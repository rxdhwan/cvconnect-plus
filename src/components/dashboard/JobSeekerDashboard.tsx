
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Briefcase,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import Hints from "../onboarding/Hints";

// Mock data for dashboard
const applicationStats = {
  total: 12,
  pending: 5,
  interviews: 3,
  rejected: 2,
  accepted: 2,
};

const recentApplications = [
  {
    id: 1,
    company: "BlockChain Inc",
    role: "Senior Solana Developer",
    status: "Pending",
    logo: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=100&h=100",
    appliedDate: "2023-11-15",
    matchScore: 92,
  },
  {
    id: 2,
    company: "CryptoFuture",
    role: "Ethereum Smart Contract Engineer",
    status: "Interview",
    logo: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&q=80&w=100&h=100",
    appliedDate: "2023-11-10",
    matchScore: 87,
  },
  {
    id: 3,
    company: "Dapps Innovation",
    role: "Frontend Developer (Web3)",
    status: "Rejected",
    logo: "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&q=80&w=100&h=100",
    appliedDate: "2023-11-05",
    matchScore: 65,
  },
];

const recommendedJobs = [
  {
    id: 1,
    company: "Solana Foundation",
    role: "Rust Developer",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=100&h=100",
    location: "Remote",
    salary: "$120k - $160k",
    posted: "2 days ago",
    matchScore: 95,
  },
  {
    id: 2,
    company: "Ethereum Labs",
    role: "Blockchain Security Engineer",
    logo: "https://images.unsplash.com/photo-1639762681447-76e57dc0d399?auto=format&fit=crop&q=80&w=100&h=100",
    location: "New York, USA",
    salary: "$140k - $180k",
    posted: "1 week ago",
    matchScore: 88,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "Interview":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "Rejected":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "Accepted":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/20";
  }
};

const getMatchScoreColor = (score: number) => {
  if (score >= 90) return "text-green-500";
  if (score >= 70) return "text-yellow-500";
  return "text-red-500";
};

const JobSeekerDashboard = () => {
  const [showHints, setShowHints] = useState(false);
  
  useEffect(() => {
    // Check if hints were already shown
    const hintsShown = localStorage.getItem("hintsShown");
    setShowHints(!hintsShown);
  }, []);

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock size={14} className="text-yellow-500" />;
      case "Interview":
        return <BarChart3 size={14} className="text-blue-500" />;
      case "Rejected":
        return <XCircle size={14} className="text-red-500" />;
      case "Accepted":
        return <CheckCircle size={14} className="text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {showHints && <Hints userRole="job-seeker" />}
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          Good morning, Alex
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your job applications and recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Applications</p>
                <p className="text-3xl font-bold mt-1">{applicationStats.total}</p>
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
                <p className="text-muted-foreground text-sm">Pending Review</p>
                <p className="text-3xl font-bold mt-1">{applicationStats.pending}</p>
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
                <p className="text-muted-foreground text-sm">Interviews</p>
                <p className="text-3xl font-bold mt-1">{applicationStats.interviews}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Profile Completion</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xl font-bold">75%</p>
                  <div className="w-24">
                    <Progress value={75} className="h-2" />
                  </div>
                </div>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
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
                <CardTitle>Recent Applications</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
              <CardDescription>
                Track your recent job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div 
                    key={application.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-all hover:bg-background/50 animate-hover"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={application.logo} 
                          alt={application.company} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{application.role}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{application.company}</span>
                          <span className="text-xs">•</span>
                          <span>Applied {new Date(application.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <div className={`text-xs font-medium ${getMatchScoreColor(application.matchScore)}`}>
                          {application.matchScore}% match
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`mt-1 flex items-center gap-1 ${getStatusColor(application.status)}`}
                        >
                          {renderStatusIcon(application.status)}
                          {application.status}
                        </Badge>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass-card h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Top Matches</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs">
                  View All <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
              <CardDescription>
                Jobs that match your skills and experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedJobs.map((job) => (
                  <div 
                    key={job.id}
                    className="p-3 rounded-lg border border-border/50 hover:border-border transition-all hover:bg-background/50 animate-hover"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={job.logo} 
                          alt={job.company} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{job.role}</h4>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-muted-foreground">{job.location}</span>
                      <span className="font-medium">{job.salary}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {job.posted}
                      </Badge>
                      <div className={`text-xs font-medium flex items-center gap-1 ${getMatchScoreColor(job.matchScore)}`}>
                        <div className="w-14 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div 
                            className={`h-full ${
                              job.matchScore >= 90 ? "bg-green-500" : 
                              job.matchScore >= 70 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${job.matchScore}%` }}
                          />
                        </div>
                        <span>{job.matchScore}% match</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-3 neo-button" 
                      size="sm"
                    >
                      <span>Apply Now</span>
                      <ArrowUpRight size={14} className="ml-1" />
                    </Button>
                  </div>
                ))}

                <Button 
                  variant="outline" 
                  className="w-full neo-button" 
                >
                  Browse More Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Increase your chances of getting noticed by employers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Upload Your CV</h4>
                  <p className="text-sm text-muted-foreground">Our AI will analyze your CV to match you with suitable jobs</p>
                </div>
              </div>
              <Button>Upload CV</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium">Complete Your Profile</h4>
                  <p className="text-sm text-muted-foreground">Add skills, experience, and preferences to improve job matches</p>
                </div>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSeekerDashboard;
