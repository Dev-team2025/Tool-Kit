import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  birthday: string;
  avatar: string;
  role: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallback;
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [formData, setFormData] = useState<EmployeeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch employee profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.email) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("employees")
          .select("*")
          .eq("email", user.email)
          .single();

        if (fetchError) {
          setError(fetchError.message);
          setIsLoading(false);
          return;
        }

        if (data) {
          setProfile(data);
          setFormData(data);
        } else {
          setError("Profile not found");
        }
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to fetch profile"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user?.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !profile) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      // Update only name in employees table
      const { error: updateError } = await supabase
        .from("employees")
        .update({
          name: formData.name,
        })
        .eq("email", formData.email);

      // Also update the Supabase auth user's metadata (so name shows in auth)
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { name: formData.name },
      });

      if (updateError) {
        setError(updateError.message);
        setIsSaving(false);
        return;
      }

      if (authUpdateError) {
        // Non-fatal: warn user but continue
        setError(`Profile saved, but auth update failed: ${authUpdateError.message}`);
      } else {
        setSuccess("Profile updated successfully!");
        setProfile({ ...profile, name: formData.name });
      }
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to update profile"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (formData && profile) {
      setFormData(profile);
    }
  };

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");

  const passwordValid = (p: string) => {
    const minLen = p.length >= 8;
    const special = /[^A-Za-z0-9]/.test(p);
    return minLen && special;
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!passwordValid(newPassword)) {
      setPasswordError("Password must be at least 8 characters and include one special character.");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError("New password must be different from the current password.");
      return;
    }

    setIsChangingPassword(true);

    try {
      // Re-authenticate user with current password
      const email = formData?.email || user?.email;
      if (!email) {
        setPasswordError("Unable to verify user email.");
        setIsChangingPassword(false);
        return;
      }

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError || !signInData?.user) {
        setPasswordError(signInError?.message || "Current password is incorrect.");
        setIsChangingPassword(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordError(error.message);
        setIsChangingPassword(false);
        return;
      }

      setNewPassword("");
      setCurrentPassword("");
      setSuccess("Password updated. You may need to sign in again.");
      toast({ title: "Password updated", description: "Your password was changed successfully." });
      setTimeout(() => setSuccess(""), 3000);
      // Sign out to force re-login
      await supabase.auth.signOut();
    } catch (err: unknown) {
      setPasswordError(getErrorMessage(err, "Failed to change password"));
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-2">
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="bg-green-50 border-2 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 font-medium">{success}</AlertDescription>
        </Alert>
      )}

      {/* Profile Form */}
      {formData && (
        <Card className="border-2 border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {formData.name?.[0] || 'U'}
              </div>
              <div>
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Update your profile details</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>

              {/* Department/Base */}
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-semibold">
                  Department / Base
                </Label>
                <Input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Contact admin to change your department</p>
              </div>

              {/* Birthday */}
              <div className="space-y-2">
                <Label htmlFor="birthday" className="text-sm font-semibold">
                  Birthday
                </Label>
                <Input
                  id="birthday"
                  name="birthday"
                  type="text"
                  value={formData.birthday || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Contact admin to change your birthday</p>
              </div>

              {/* Role (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold">
                  Role
                </Label>
                <Input
                  id="role"
                  type="text"
                  value={formData.role || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Contact admin to change your role</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="submit"
                  disabled={isSaving || formData.name === profile.name}//null error due data fetch issue
                  className="flex-1"
                  size="lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Change Password */}
      <Card className="border-2 border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-200 bg-gray-50">
          <CardTitle className="text-xl">Change Password</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Update your account password</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleChangePassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm font-semibold">Current password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isChangingPassword}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm font-semibold">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isChangingPassword}
                  className="pr-11"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  disabled={isChangingPassword}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>

              <div className="rounded-lg bg-muted p-3 space-y-2">
                <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li className={`flex items-center gap-2 ${newPassword.length >= 8 ? 'text-green-600 font-medium' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-green-600' : 'bg-gray-300'}`} />
                    Minimum 8 characters
                  </li>
                  <li className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600 font-medium' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-600' : 'bg-gray-300'}`} />
                    At least one special character
                  </li>
                  <li className={`flex items-center gap-2 ${newPassword && currentPassword && newPassword !== currentPassword ? 'text-green-600 font-medium' : ''}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${newPassword && currentPassword && newPassword !== currentPassword ? 'bg-green-600' : 'bg-gray-300'}`} />
                    Must not match current password
                  </li>
                </ul>
              </div>

              {passwordError && (
                <Alert variant="destructive" className="border-2">
                  <AlertDescription className="text-sm font-medium">{passwordError}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button 
                type="submit" 
                className="flex-1" 
                size="lg"
                disabled={isChangingPassword || !passwordValid(newPassword) || !currentPassword}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                size="lg"
                onClick={() => { setNewPassword(""); setCurrentPassword(""); setPasswordError(""); }}
                disabled={isChangingPassword}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
