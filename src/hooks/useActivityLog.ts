import { supabase } from '@/integrations/supabase/client';

export interface ActivityLog {
  action: string;
  entity_type: string;
  entity_id?: string;
  metadata?: Record<string, any>;
}

export const useActivityLog = () => {
  const logActivity = async ({
    action,
    entity_type,
    entity_id,
    metadata = {},
  }: ActivityLog) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      await supabase.from('activity_log').insert({
        user_id: user.id,
        action,
        entity_type,
        entity_id,
        metadata,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  return { logActivity };
};
