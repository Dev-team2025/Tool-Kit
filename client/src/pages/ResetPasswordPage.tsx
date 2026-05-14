import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const { toast } = useToast();

  const passwordValid = (p: string) => {
    const minLen = p.length >= 8;
    const special = /[^A-Za-z0-9]/.test(p);
    return minLen && special;
  };

  useEffect(() => {
    let isMounted = true;

    const confirmSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (!data.session) {
        setError("Open the reset link from your email to continue.");
      }

      setReady(true);
    };

    confirmSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    // show success toast
    toast({ title: "Password updated", description: "Your password was changed successfully." });

    await supabase.auth.signOut();
    setIsSubmitting(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg border border-gray-200/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Create a new password</CardTitle>
          <p className="text-sm text-gray-600">
            Choose a strong password to secure your account.
          </p>
        </CardHeader>
        <CardContent>
          {!ready ? (
            <p className="text-sm text-gray-600">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 relative">
                <Label htmlFor="new-password">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-600" /> : <Eye className="h-4 w-4 text-gray-600" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Password requirements: at least 8 characters and one special character.
                </p>
                <ul className="text-xs text-gray-500 list-disc pl-5">
                  <li className={password.length >= 8 ? 'text-teal-700' : ''}>Minimum 8 characters</li>
                  <li className={/[^A-Za-z0-9]/.test(password) ? 'text-teal-700' : ''}>At least one special character</li>
                </ul>
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <Button className="w-full" disabled={isSubmitting || !passwordValid(password)}>
                {isSubmitting ? "Updating..." : "Reset Password"}
              </Button>
              {!passwordValid(password) && (
                <p className="text-sm text-gray-600">Please meet the password requirements above.</p>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
