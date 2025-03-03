
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Briefcase,
  Users,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Plus
} from "lucide-react";
import Hints from "../onboarding/Hints";

// Mock data for dashboard
const jobStats = {
  activeJobs: 5,
  totalApplicants: 87,
  newApplications: 12,
  interviewsScheduled: 8,
};

const activeJobs = [
  {
    id: 1,
    title: "Senior Solana Developer",
    applicants: 32,
    views: 243,
    posted: "2023-11-01",
    expires: "2023-12-01",
    status: "Active",
  },
  {
    id: 2,
    title: "Ethereum Smart Contract Engineer",
    applicants: 24,
    views: 187,
    posted: "2023-11-05",
    expires: "2023-12-05",
    status: "Active",
  },
  {
    id: 3,
    title: "Frontend Developer (Web3)",
    applicants: 18,
    views: 156,
    posted: "2023-11-10",
    expires: "2023-12-10",
    status: "Active",
  },
];

const recentApplicants = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Solana Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
    appliedDate: "2023-11-15",
    status: "New",
    matchScore: 92,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Ethereum Smart Contract Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
    appliedDate: "2023-11-14",
    status: "Reviewed",
    matchScore: 87,
  },
  {
    id: 3,
    name: "Alex Rodriguez",
    role: "Frontend Developer (Web3)",
    avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&q=80&w=100&h=100",
    appliedDate: "2023-11-13",
    status: "Interview",
    matchScore: 78,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "Reviewed":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "Interview":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "Rejected":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "Hired":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const getMatchScoreColor = (score: number) => {
  if (score >= 90) return "text-green-500";
  if (score >= 70) return "text-yellow-500";
  return "text-red-500";
};

const renderStatusIcon = (status: string) => {
  switch (status) {
    case "New":
      return <Clock size={14} className="text-blue-500" />;
    case "Reviewed":
      return <Eye size={14} className="text-yellow-500" />;
    case "Interview":
      return <BarChart3 size={14} className="text-green-500" />;
    case "Rejected":
      return <XCircle size={14} className="text-red-500" />;
    case "Hired":
      return <CheckCircle size={14} className="text-purple-500" />;
    default:
      return null;
  }
};

const EmployerDashboard = () => {
  const [showHints, setShowHints] = useState(false);
  
  useEffect(() => {
    // Check if hints were already shown
    const hintsShown = localStorage.getItem("hintsShown");
    setShowHints(!hintsShown);
  }, []);

  return (
    <div className="animate-fade-in">
      {showHints && <Hints userRole="employer" />}
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          Company Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your job listings and applicants
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Jobs</p>
                <p className="text-3xl font-bold mt-1">{jobStats.activeJobs}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Applicants</p>
                <p className="text-3xl font-bold mt-1">{jobStats.totalApplicants}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">New Applications</p>
                <p className="text-3xl font-bold mt-1">{jobStats.newApplications}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500/10">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Interviews Scheduled</p>
                <p className="text-3xl font-bold mt-1">{jobStats.interviewsScheduled}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Active Job Listings</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
              <CardDescription>
                Monitor performance of your job listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeJobs.map((job) => (
                  <div 
                    key={job.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-all hover:bg-background/50 animate-hover"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{job.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Posted {new Date(job.posted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="text-xs">•</span>
                          <span>Expires {new Date(job.expires).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <p className="text-lg font-medium">{job.applicants}</p>
                        <p className="text-xs text-muted-foreground">Applicants</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <p className="text-lg font-medium">{job.views}</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button className="w-full neo-button" variant="outline">
                  <Plus size={16} className="mr-2" />
                  Post New Job
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass-card h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Applicants</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
              <CardDescription>
                Candidates that recently applied to your jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplicants.map((applicant) => (
                  <div 
                    key={applicant.id}
                    className="p-3 rounded-lg border border-border/50 hover:border-border transition-all hover:bg-background/50 animate-hover"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={applicant.avatar} 
                          alt={applicant.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{applicant.name}</h4>
                        <p className="text-sm text-muted-foreground">Applied for {applicant.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <Badge 
                        variant="outline" 
                        className={`flex items-center gap-1 ${getStatusColor(applicant.status)}`}
                      >
                        {renderStatusIcon(applicant.status)}
                        {applicant.status}
                      </Badge>
                      
                      <div className={`text-xs font-medium flex items-center gap-1 ${getMatchScoreColor(applicant.matchScore)}`}>
                        <span>{applicant.matchScore}% match</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button 
                        className="w-full neo-button" 
                        size="sm"
                        variant="outline"
                      >
                        View CV
                      </Button>
                      <Button 
                        className="w-full neo-button" 
                        size="sm"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle>AI Talent Matching</CardTitle>
          <CardDescription>
            Our AI helps you find the best candidates for your job openings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 p-4 rounded-lg border border-border/50">
              <h4 className="font-medium">Smart Candidate Filtering</h4>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes candidate CVs to match them with your job requirements
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-crypto-bitcoin/10 text-crypto-bitcoin border-crypto-bitcoin/20">
                  Bitcoin
                </Badge>
                <Badge variant="outline" className="bg-crypto-ethereum/10 text-crypto-ethereum border-crypto-ethereum/20">
                  Ethereum
                </Badge>
                <Badge variant="outline" className="bg-crypto-solana/10 text-crypto-solana border-crypto-solana/20">
                  Solana
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 p-4 rounded-lg border border-border/50">
              <h4 className="font-medium">Skills-Based Matching</h4>
              <p className="text-sm text-muted-foreground">
                Find candidates with the exact skills your position requires
              </p>
              <Progress value={75} className="h-2 mt-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Basic Match</span>
                <span>Skills Match</span>
                <span>Perfect Match</span>
              </div>
            </div>
          </div>
          
          <Button className="w-full neo-button mt-4">
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerDashboard;
