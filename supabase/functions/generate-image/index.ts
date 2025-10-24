import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Art direction prompts
const PROMPTS = {
  hero: "Warm, hopeful photo of a Yemeni doctor/nurse counseling an adult patient in a modest clinic; natural light; teal/blue accents; respectful; editorial documentary style.",
  community: "Outdoor diabetes screening day in Yemen; volunteers measuring blood glucose; tents, posters; inclusive; documentary feel.",
  training: "Small classroom workshop with diabetic-foot model; Yemeni clinicians; flipcharts; realistic light.",
  nutrition: "Healthy Yemeni meal (grilled fish, lentils, salad, whole grains); top-down; natural colors; no sugary drinks.",
  youth: "Teen students in a Yemeni school courtyard engaging in light physical activity; bright, uplifting.",
  conference: "Professional conference backdrop with subtle diabetes iconography (glucose, heart, foot care), YDA brand colors, tasteful abstract pattern.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, customPrompt } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Use custom prompt or category-based prompt
    const prompt = customPrompt || PROMPTS[category as keyof typeof PROMPTS] || PROMPTS.hero;

    console.log("Generating image with prompt:", prompt);

    // Generate image using Lovable AI (Nano banana model)
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("No image generated");
    }

    // Convert base64 to blob
    const base64Data = imageUrl.split(",")[1];
    const imageBuffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${category}_${timestamp}.png`;
    const storagePath = `generated/${filename}`;

    // Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("shared")
      .upload(storagePath, imageBuffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("shared")
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // Save metadata to database
    const { data: mediaData, error: dbError } = await supabase
      .from("media_library")
      .insert({
        filename,
        storage_path: storagePath,
        public_url: publicUrl,
        category: category || "general",
        prompt,
        source: "generated",
        mime_type: "image/png",
        alt_text: {
          ar: "",
          en: "",
        },
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to save metadata: ${dbError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        image: mediaData,
        url: publicUrl,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
