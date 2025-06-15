
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect to home if logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) navigate("/");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    if (!email || !password) {
      setError("Email and password required");
      setSubmitting(false);
      return;
    }
    if (view === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else toast({ title: "Login Successful!" });
    } else {
      const redirectUrl = `${window.location.origin}/`;
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl } });
      if (error) setError(error.message);
      else toast({ title: "Check your email!", description: "Click the magic link to activate your account." });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background animate-fade-in px-2">
      <form onSubmit={handleAuth} className="bg-card shadow-lg rounded-lg p-8 max-w-sm w-full flex flex-col gap-4 animate-scale-in">
        <h2 className="text-2xl font-extrabold text-center">{view === "sign-in" ? "Sign In" : "Create Account"}</h2>
        <Input type="email" placeholder="Email" value={email} autoFocus onChange={e => setEmail(e.target.value)} disabled={submitting} />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} disabled={submitting} />
        <Button type="submit" className="w-full pulse" disabled={submitting}>
          {submitting ? (view === "sign-in" ? "Signing in..." : "Registering...") : (view === "sign-in" ? "Sign In" : "Sign Up")}
        </Button>
        {error && <div className="text-center text-destructive text-sm">{error}</div>}
        <div className="text-center text-sm mt-2">
          {view === "sign-in" ? (
            <>
              Don&apos;t have an account?{" "}
              <button type="button" className="text-blue-600 underline" onClick={() => setView("sign-up")} disabled={submitting}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" className="text-blue-600 underline" onClick={() => setView("sign-in")} disabled={submitting}>
                Sign in
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
