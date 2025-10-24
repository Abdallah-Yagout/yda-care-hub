-- Create activity log table for tracking admin actions
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at DESC);
CREATE INDEX idx_activity_log_entity ON public.activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_action ON public.activity_log(action);

-- Enable RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity logs
CREATE POLICY "Admins can view all activity logs"
  ON public.activity_log
  FOR SELECT
  USING (
    has_role(auth.uid(), 'EDITOR'::app_role) OR 
    has_role(auth.uid(), 'SUPERADMIN'::app_role)
  );

-- System can insert activity logs
CREATE POLICY "Authenticated users can insert their own activity"
  ON public.activity_log
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create analytics view table
CREATE TABLE IF NOT EXISTS public.content_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  metric TEXT NOT NULL,
  value BIGINT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(entity_type, entity_id, metric, date)
);

-- Create indexes
CREATE INDEX idx_content_analytics_entity ON public.content_analytics(entity_type, entity_id);
CREATE INDEX idx_content_analytics_date ON public.content_analytics(date DESC);
CREATE INDEX idx_content_analytics_metric ON public.content_analytics(metric);

-- Enable RLS
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;

-- Admins can view analytics
CREATE POLICY "Admins can view all content analytics"
  ON public.content_analytics
  FOR SELECT
  USING (
    has_role(auth.uid(), 'EDITOR'::app_role) OR 
    has_role(auth.uid(), 'SUPERADMIN'::app_role)
  );

-- System can manage analytics
CREATE POLICY "Admins can manage analytics"
  ON public.content_analytics
  FOR ALL
  USING (
    has_role(auth.uid(), 'EDITOR'::app_role) OR 
    has_role(auth.uid(), 'SUPERADMIN'::app_role)
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER trigger_update_content_analytics_updated_at
  BEFORE UPDATE ON public.content_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_content_analytics_updated_at();