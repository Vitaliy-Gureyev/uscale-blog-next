'use client';

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Database } from "@/src/integrations/supabase/types";
import { log } from "console";

// Создаем отдельный компонент для Auth UI
function AuthComponent() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          return;
        }

        // Если сессия существует, сразу редиректим
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile error:', profileError);
            return;
          }

          if (profile?.is_admin) {
            router.replace('/'); // Используем replace вместо push
            router.refresh();
          } else {
            toast.error("Access denied. Admin privileges required.");
            await supabase.auth.signOut();
          }
        }
      } catch (error) {
        console.error('Check user error:', error);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user?.id) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile error:', profileError);
            return;
          }

          if (profile?.is_admin) {
            router.replace('/'); // Используем replace вместо push
            router.refresh();
          } else {
            toast.error("Access denied. Admin privileges required.");
            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error('Auth state change error:', error);
        }
      }
    });

    checkUser();
    return () => subscription.unsubscribe();
  }, [router, supabase]);

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme="light"
      providers={[]}
      redirectTo={typeof window !== 'undefined' ? window.location.origin : ''}
      showLinks={false}
      view="sign_in"
      magicLink={false}
      localization={{
        variables: {
          sign_in: {
            email_label: "Email",
            password_label: "Password",
            button_label: "Sign in",
            loading_button_label: "Signing in...",
          }
        }
      }}
    />
  );
}

// Основной компонент страницы
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in with your admin credentials
          </p>
        </div>
        <div className="mt-8">
          <AuthComponent />
        </div>
      </div>
    </div>
  );
}
