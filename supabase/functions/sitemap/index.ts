import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml; charset=utf-8',
};

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

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
    const urls: SitemapUrl[] = [];

    // Static pages (both ar and en)
    const staticPages = ['', '/events', '/programs', '/resources', '/get-involved', '/contact'];
    const locales = ['ar', 'en'];

    for (const locale of locales) {
      for (const page of staticPages) {
        urls.push({
          loc: `${baseUrl}/${locale}${page}`,
          changefreq: page === '' ? 'daily' : 'weekly',
          priority: page === '' ? '1.0' : '0.8',
        });
      }
    }

    // Fetch events
    const { data: events } = await supabase
      .from('event')
      .select('slug, updated_at')
      .eq('status', 'published');

    if (events) {
      for (const event of events) {
        for (const locale of locales) {
          urls.push({
            loc: `${baseUrl}/${locale}/events/${event.slug}`,
            lastmod: new Date(event.updated_at).toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: '0.7',
          });
        }
      }
    }

    // Fetch programs
    const { data: programs } = await supabase
      .from('program')
      .select('slug, updated_at')
      .eq('status', 'published');

    if (programs) {
      for (const program of programs) {
        for (const locale of locales) {
          urls.push({
            loc: `${baseUrl}/${locale}/programs/${program.slug}`,
            lastmod: new Date(program.updated_at).toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: '0.7',
          });
        }
      }
    }

    // Fetch posts (resources)
    const { data: posts } = await supabase
      .from('post')
      .select('slug, updated_at')
      .eq('status', 'published');

    if (posts) {
      for (const post of posts) {
        for (const locale of locales) {
          urls.push({
            loc: `${baseUrl}/${locale}/resources/${post.slug}`,
            lastmod: new Date(post.updated_at).toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: '0.6',
          });
        }
      }
    }

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `\n    <priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

    console.log('Sitemap generated successfully with', urls.length, 'URLs');

    return new Response(sitemap, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<error>Failed to generate sitemap</error>`,
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});
