import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface RealtimeSubscriptionOptions {
  table: string;
  onInsert?: (payload: RealtimePostgresChangesPayload<any>) => void;
  onUpdate?: (payload: RealtimePostgresChangesPayload<any>) => void;
  onDelete?: (payload: RealtimePostgresChangesPayload<any>) => void;
  showNotifications?: boolean;
}

export const useRealtimeSubscription = ({
  table,
  onInsert,
  onUpdate,
  onDelete,
  showNotifications = true,
}: RealtimeSubscriptionOptions) => {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`[Realtime] New ${table}:`, payload);
          if (showNotifications) {
            toast.success(`New ${table} created`, {
              description: 'The list has been updated automatically',
            });
          }
          onInsert?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`[Realtime] Updated ${table}:`, payload);
          if (showNotifications) {
            toast.info(`${table} updated`, {
              description: 'Changes have been synced',
            });
          }
          onUpdate?.(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: table,
        },
        (payload) => {
          console.log(`[Realtime] Deleted ${table}:`, payload);
          if (showNotifications) {
            toast.error(`${table} deleted`, {
              description: 'The list has been updated',
            });
          }
          onDelete?.(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onInsert, onUpdate, onDelete, showNotifications]);
};
