import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthGuardState {
  user: User | null;
  role: string | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export const useAuthGuard = (requireAuth: boolean = true) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthGuardState>({
    user: null,
    role: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let mounted = true;
    let isInitializing = true;

    const initializeAuth = async () => {
      try {
        // Wait for session to be confirmed loaded
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error("[useAuthGuard] Session error:", error);
          setState({ user: null, role: null, loading: false, isAuthenticated: false });
          if (requireAuth && !isInitializing) {
            navigate("/admin/login", { replace: true });
          }
          isInitializing = false;
          return;
        }

        if (!session) {
          console.log("[useAuthGuard] No active session");
          setState({ user: null, role: null, loading: false, isAuthenticated: false });
          if (requireAuth && !isInitializing) {
            navigate("/admin/login", { replace: true });
          }
          isInitializing = false;
          return;
        }

        console.log("[useAuthGuard] Session found for:", session.user.email);

        // Fetch user role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (roleError) {
          console.error("[useAuthGuard] Role fetch error:", roleError);
        }

        const userRole = roleData?.role || null;
        console.log("[useAuthGuard] User role:", userRole);

        if (!mounted) return;

        setState({
          user: session.user,
          role: userRole,
          loading: false,
          isAuthenticated: true,
        });
        isInitializing = false;

      } catch (error) {
        console.error("[useAuthGuard] Initialization error:", error);
        if (!mounted) return;
        setState({ user: null, role: null, loading: false, isAuthenticated: false });
        if (requireAuth && !isInitializing) {
          navigate("/admin/login", { replace: true });
        }
        isInitializing = false;
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[useAuthGuard] Auth state changed:", event);

        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          setState({ user: null, role: null, loading: false, isAuthenticated: false });
          navigate("/admin/login", { replace: true });
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (!session) return;

          // Fetch role for new session
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .maybeSingle();

          setState({
            user: session.user,
            role: roleData?.role || null,
            loading: false,
            isAuthenticated: true,
          });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [requireAuth, navigate]);

  return state;
};
