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
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile");
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
      // Update employees table by email (more robust) and update auth user metadata
      const { error: updateError } = await supabase
        .from("employees")
        .update({
          name: formData.name,
          birthday: formData.birthday,
          department: formData.department,
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
      }
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
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
    } catch (err: any) {
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      {/* Profile Header */}
      <section className="rounded-3xl border border-teal-100/70 bg-white/80 p-8 shadow-sm">
        <h1 className="text-3xl font-display text-gray-900">Your Profile</h1>
        <p className="mt-2 text-sm text-gray-600">
          View and update your personal and professional information.
        </p>
      </section>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Profile Form */}
      {formData && (
        <Card className="shadow-xl border border-gray-200/80">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="border-gray-200"
                />
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  disabled
                  className="bg-gray-50 border-gray-200 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              {/* Department/Base */}
              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-700">
                  Department / Base
                </Label>
                <Input
                  id="department"
                  name="department"
                  type="text"
                  value={formData.department || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., Engineering, Sales, HR"
                  className="border-gray-200"
                />
              </div>

              {/* Birthday */}
              <div className="space-y-2">
                <Label htmlFor="birthday" className="text-gray-700">
                  Birthday
                </Label>
                <Input
                  id="birthday"
                  name="birthday"
                  type="text"
                  value={formData.birthday || ""}
                  onChange={handleInputChange}
                  placeholder="MM-DD"
                  className="border-gray-200"
                  maxLength={5}
                />
                <p className="text-xs text-gray-500">Format: MM-DD (e.g., 05-30)</p>
              </div>

              {/* Role (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700">
                  Role
                </Label>
                <Input
                  id="role"
                  type="text"
                  value={formData.role || ""}
                  disabled
                  className="bg-gray-50 border-gray-200 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">Contact admin to change your role</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSaving || JSON.stringify(formData) === JSON.stringify(profile)}
                  className="flex-1"
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
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Change Password */}
      <Card className="shadow-xl border border-gray-200/80">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

              <p className="text-xs text-gray-500">Password requirements: at least 8 characters and one special character. New password must differ from current password.</p>
              <ul className="text-xs text-gray-500 list-disc pl-5">
                <li className={newPassword.length >= 8 ? 'text-teal-700' : ''}>Minimum 8 characters</li>
                <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-teal-700' : ''}>At least one special character</li>
                <li className={newPassword && currentPassword && newPassword !== currentPassword ? 'text-teal-700' : ''}>Must not match current password</li>
              </ul>
              {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1" disabled={isChangingPassword || !passwordValid(newPassword) || !currentPassword}>
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
              <Button type="button" variant="outline" className="flex-1" onClick={() => { setNewPassword(""); setCurrentPassword(""); }}>
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
