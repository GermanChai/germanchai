import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </div>
        </form>
        <div className="text-center">
          <Link to="/login" className="text-primary hover:text-primary/90">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;