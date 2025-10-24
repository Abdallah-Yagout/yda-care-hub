-- Enable realtime for all content tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.program;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event;
ALTER PUBLICATION supabase_realtime ADD TABLE public.page;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post;
ALTER PUBLICATION supabase_realtime ADD TABLE public.submission;