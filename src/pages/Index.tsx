import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { locale } = useParams<{ locale: string }>();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (locale && i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  // Fetch home page blocks
  const { data: blocks } = useQuery({
    queryKey: ['home-blocks'],
    queryFn: async () => {
      const { data: page } = await supabase
        .from('page')
        .select('id')
        .eq('slug', 'home')
        .single();

      if (!page) return [];

      const { data } = await supabase
        .from('block')
        .select('*')
        .eq('page_id', page.id)
        .order('sort');

      return data || [];
    },
  });

  // Fetch KPIs
  const { data: kpis } = useQuery({
    queryKey: ['kpis'],
    queryFn: async () => {
      const { data } = await supabase
        .from('kpi')
        .select('*')
        .order('key');
      return data || [];
    },
  });

  // Fetch programs
  const { data: programs } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      const { data } = await supabase
        .from('program')
        .select('*')
        .eq('status', 'published')
        .limit(4);
      return data || [];
    },
  });

  // Fetch upcoming events
  const { data: events } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: async () => {
      const { data } = await supabase
        .from('event')
        .select('*')
        .eq('status', 'published')
        .gte('start_at', new Date().toISOString())
        .order('start_at')
        .limit(3);
      return data || [];
    },
  });

  // Fetch latest posts
  const { data: posts } = useQuery({
    queryKey: ['latest-posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('post')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);
      return data || [];
    },
  });

  const getLocalizedContent = (jsonContent: any) => {
    if (!jsonContent) return '';
    return jsonContent[i18n.language] || jsonContent.ar || jsonContent.en || '';
  };

  const heroBlock = blocks?.find(b => b.key === 'hero');
  const missionBlock = blocks?.find(b => b.key === 'mission');
  const visionBlock = blocks?.find(b => b.key === 'vision');
  const valuesBlock = blocks?.find(b => b.key === 'values');

  return (
    <PublicLayout>
      <Helmet>
        <title>{getLocalizedContent(heroBlock?.title)} | YDA</title>
        <meta name="description" content={getLocalizedContent(heroBlock?.content)} />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {getLocalizedContent(heroBlock?.title)}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {getLocalizedContent(heroBlock?.content)}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg">{t('hero.cta1')}</Button>
            <Button size="lg" variant="outline">{t('hero.cta2')}</Button>
            <Button size="lg" variant="secondary">{t('hero.cta3')}</Button>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{getLocalizedContent(missionBlock?.title)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{getLocalizedContent(missionBlock?.content)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{getLocalizedContent(visionBlock?.title)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{getLocalizedContent(visionBlock?.content)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{getLocalizedContent(valuesBlock?.title)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{getLocalizedContent(valuesBlock?.content)}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.kpis')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {kpis?.map((kpi) => (
              <Card key={kpi.id} className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {kpi.value_int?.toLocaleString() || kpi.value_dec || '—'}
                    {kpi.key === 'adult_prevalence' && '%'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {kpi.key.replace(/_/g, ' ')}
                  </div>
                  {kpi.year && <div className="text-xs text-muted-foreground mt-1">({kpi.year})</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">{t('home.programs')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs?.map((program) => (
              <Card key={program.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{getLocalizedContent(program.title)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {getLocalizedContent(program.summary)}
                  </p>
                  <Button variant="ghost" size="sm" className="w-full">
                    {t('common.learnMore')} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events && events.length > 0 && (
        <section className="py-16 px-4 bg-muted/50">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">{t('home.events')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{getLocalizedContent(event.title)}</CardTitle>
                    <CardDescription>
                      {new Date(event.start_at).toLocaleDateString(i18n.language === 'ar' ? 'ar-YE' : 'en-US')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {getLocalizedContent(event.summary)}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('common.viewAll')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Resources */}
      {posts && posts.length > 0 && (
        <section className="py-16 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">{t('home.resources')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{getLocalizedContent(post.title)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {getLocalizedContent(post.excerpt)}
                    </p>
                    <Button variant="ghost" size="sm" className="w-full">
                      {t('common.readMore')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t('home.cta')}</h2>
          <p className="text-lg mb-8 opacity-90">
            {i18n.language === 'ar' 
              ? 'كن جزءاً من حركة مكافحة السكري في اليمن'
              : 'Be part of the movement to combat diabetes in Yemen'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary">{t('hero.cta2')}</Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              {t('hero.cta3')}
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Index;
