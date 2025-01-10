'use client'

import { Button } from "@/src/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/src/hooks/useAuthState";
import { useQueryClient } from "@tanstack/react-query";

export const AdminActions = () => {
  const router = useRouter();
  const { isAdmin, isLoading } = useAuthState();
  const supabase = createClientComponentClient();
  const queryClient = useQueryClient();

  if (isLoading) return null;
  if (!isAdmin) return null;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast.error("Error signing out: " + error.message);
        return;
      }
      
      queryClient.invalidateQueries({ queryKey: ["auth-state"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      
      toast.success("Signed out successfully");
      router.push("/login");
      router.refresh();
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred during sign out");
      router.push("/login");
    }
  };

  return (
    <div className="flex gap-2">
      <Link href="/editor/posts/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          New Blog Post
        </Button>
      </Link>
      <Button variant="outline" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
        Logout
      </Button>
    </div>
  );
};