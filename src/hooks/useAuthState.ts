'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Database } from "@/src/integrations/supabase/types";
import { useEffect } from "react";

export const useAuthState = () => {
  const supabase = createClientComponentClient<Database>();
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Инвалидируем кэш при изменении состояния авторизации
        queryClient.invalidateQueries({ queryKey: ["auth-state"] });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, supabase]);

  const { data: authData, isLoading } = useQuery({
    queryKey: ["auth-state"],
    queryFn: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return { user: null, isAdmin: false };
      }

      if (!session?.user) {
        return { user: null, isAdmin: false };
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        return { user: session.user, isAdmin: false };
      }

      return {
        user: session.user,
        isAdmin: profile?.is_admin || false
      };
    },
    staleTime: 1000 * 60 * 5, // Кэшируем на 5 минут
  });

  return {
    user: authData?.user ?? null,
    isAdmin: authData?.isAdmin ?? false,
    isLoading,
  };
};