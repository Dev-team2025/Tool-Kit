import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
export default function VerifyCodePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg border border-gray-200/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Check your inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              We sent a password reset link to
              {email ? ` ${email}` : " your email address"}.
            </p>
            <p>
              Open the link and follow the steps to set a new password.
            </p>
            <Button className="w-full" onClick={() => navigate("/login")}>
              Back to login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
