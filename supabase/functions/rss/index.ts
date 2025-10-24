import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml; charset=utf-8',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const baseUrl = 'https://yda-yemen.org'; // Update with actual domain
    const buildDate = new Date().toUTCString();

    // Fetch latest 20 posts
    const { data: posts } = await supabase
      .from('post')
      .select('slug, title, excerpt, published_at, type')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(10);

    // Fetch latest 10 events
    const { data: events } = await supabase
      .from('event')
      .select('slug, title, summary, start_at')
      .eq('status', 'published')
      .order('start_at', { ascending: false })
      .limit(10);

    // Combine and sort by date
    const items = [];

    if (posts) {
      for (const post of posts) {
        items.push({
          title: post.title?.en || post.title?.ar || 'Untitled Post',
          link: `${baseUrl}/en/resources/${post.slug}`,
          description: post.excerpt?.en || post.excerpt?.ar || '',
          pubDate: new Date(post.published_at).toUTCString(),
          category: post.type,
          guid: `${baseUrl}/en/resources/${post.slug}`,
        });
      }
    }

    if (events) {
      for (const event of events) {
        items.push({
          title: event.title?.en || event.title?.ar || 'Untitled Event',
          link: `${baseUrl}/en/events/${event.slug}`,
          description: event.summary?.en || event.summary?.ar || '',
          pubDate: new Date(event.start_at).toUTCString(),
          category: 'Event',
          guid: `${baseUrl}/en/events/${event.slug}`,
        });
      }
    }

    // Sort by date descending and limit to 20
    items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    const topItems = items.slice(0, 20);

    // Escape XML special characters
    const escapeXml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    // Generate RSS feed
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Yemen Diabetes Association - News & Events</title>
    <link>${baseUrl}</link>
    <description>Latest news, articles, and events from Yemen Diabetes Association</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Yemen Diabetes Association</title>
      <link>${baseUrl}</link>
    </image>
${topItems
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

    console.log('RSS feed generated successfully with', topItems.length, 'items');

    return new Response(rss, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<error>Failed to generate RSS feed</error>`,
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
