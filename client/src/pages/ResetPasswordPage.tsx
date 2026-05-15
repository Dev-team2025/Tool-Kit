import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabaseClient";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    toast({ title: "Password updated", description: "Your password was changed successfully." });

    await supabase.auth.signOut();
    setIsSubmitting(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md border-2 border-gray-200 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display font-bold">Create a new password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose a strong password to secure your account
          </p>
        </CardHeader>
        <CardContent>
          {!ready ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-semibold">New password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="pr-11"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>
                <div className="rounded-lg bg-muted p-3 space-y-2">
                  <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-600 font-medium' : ''}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? 'bg-green-600' : 'bg-gray-300'}`} />
                      Minimum 8 characters
                    </li>
                    <li className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600 font-medium' : ''}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(password) ? 'bg-green-600' : 'bg-gray-300'}`} />
                      At least one special character
                    </li>
                  </ul>
                </div>
              </div>
              {error && (
                <Alert variant="destructive" className="border-2">
                  <AlertDescription className="font-medium">{error}</AlertDescription>
                </Alert>
              )}
              <Button className="w-full" size="lg" disabled={isSubmitting || !passwordValid(password)}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
              {!passwordValid(password) && password && (
                <p className="text-xs text-center text-muted-foreground">Please meet all password requirements above</p>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
