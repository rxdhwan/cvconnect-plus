
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
import { Separator } from "@/components/ui/separator";
import { Briefcase, User } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<"job-seeker" | "employer" | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role: "job-seeker" | "employer") => {
    setSelectedRole(role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Validate form
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("Please fill all required fields");
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      
      setStep(2);
    } else {
      // Validate role selection
      if (!selectedRole) {
        toast.error("Please select a role");
        return;
      }
      
      // Simulate signup success
      localStorage.setItem("userRole", selectedRole);
      toast.success(`Welcome to CryptoJobs! You've signed up as a ${selectedRole === "job-seeker" ? "Job Seeker" : "Employer"}`);
      
      // Redirect to dashboard
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 animate-fade-in">
      <Card className="w-full max-w-md glass-card animate-scale-in">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <div className="text-xs text-muted-foreground">
              Step {step} of 2
            </div>
          </div>
          <CardDescription>
            {step === 1 
              ? "Enter your details to create your account" 
              : "Select your account type"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="subtle-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="subtle-ring"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-4 py-4">
                <p className="text-sm text-center text-muted-foreground">
                  Select the type of account you want to create
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div
                    className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover-scale ${
                      selectedRole === "job-seeker"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/20"
                    }`}
                    onClick={() => handleRoleSelect("job-seeker")}
                  >
                    <div className={`p-3 rounded-full ${
                      selectedRole === "job-seeker" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      <User size={24} />
                    </div>
                    <h3 className="font-medium">Job Seeker</h3>
                    <p className="text-xs text-center text-muted-foreground">
                      Find jobs and submit applications
                    </p>
                  </div>
                  <div
                    className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover-scale ${
                      selectedRole === "employer"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/20"
                    }`}
                    onClick={() => handleRoleSelect("employer")}
                  >
                    <div className={`p-3 rounded-full ${
                      selectedRole === "employer" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      <Briefcase size={24} />
                    </div>
                    <h3 className="font-medium">Employer</h3>
                    <p className="text-xs text-center text-muted-foreground">
                      Post jobs and manage applications
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className="w-full neo-button"
          >
            {step === 1 ? "Continue" : "Create Account"}
          </Button>
          
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-primary underline-offset-4 hover:underline font-medium"
            >
              Sign in
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
