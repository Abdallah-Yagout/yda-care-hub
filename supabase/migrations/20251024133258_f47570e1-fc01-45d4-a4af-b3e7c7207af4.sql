-- Fix search_path for the function
DROP TRIGGER IF EXISTS trigger_update_content_analytics_updated_at ON public.content_analytics;
DROP FUNCTION IF EXISTS update_content_analytics_updated_at();

CREATE OR REPLACE FUNCTION update_content_analytics_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER trigger_update_content_analytics_updated_at
  BEFORE UPDATE ON public.content_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_content_analytics_updated_at();