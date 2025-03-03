
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate login
    // Using job-seeker as default role for demo
    localStorage.setItem("userRole", "job-seeker");
    toast.success("Successfully signed in!");
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 animate-fade-in">
      <Card className="w-full max-w-md glass-card animate-scale-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="subtle-ring"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-xs text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
                className="subtle-ring"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="rememberMe" 
                checked={formData.rememberMe}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="rememberMe" className="text-sm">Remember me</Label>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className="w-full neo-button"
          >
            Sign In
          </Button>
          
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-primary underline-offset-4 hover:underline font-medium"
            >
              Sign up
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
