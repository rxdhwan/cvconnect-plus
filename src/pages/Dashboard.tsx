
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobSeekerDashboard from "@/components/dashboard/JobSeekerDashboard";
import EmployerDashboard from "@/components/dashboard/EmployerDashboard";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";

const Dashboard = () => {
  const [userRole, setUserRole] = useState<"job-seeker" | "employer" | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and get role from localStorage
    const storedRole = localStorage.getItem("userRole") as "job-seeker" | "employer" | null;
    
    if (!storedRole) {
      toast.error("Please sign in to access the dashboard");
      navigate('/');
      return;
    }
    
    setUserRole(storedRole);
  }, [navigate]);

  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {userRole === "job-seeker" ? (
          <JobSeekerDashboard />
        ) : userRole === "employer" ? (
          <EmployerDashboard />
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
