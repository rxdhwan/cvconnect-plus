
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowUpRight,
  User
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Hints from "../onboarding/Hints";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const [showHints, setShowHints] = useState(false);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    interviews: 0,
    rejected: 0,
    accepted: 0,
  });
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if hints were already shown
    const hintsShown = localStorage.getItem("hintsShown");
    setShowHints(!hintsShown);
    
    fetchUserData();
    fetchApplications();
    fetchRecommendedJobs();
  }, []);
  
  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Get user profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (data && !error) {
          // Set user name from profile
          const firstName = data.first_name || '';
          setUserName(firstName);
          
          // Calculate profile completion
          let completionScore = 0;
          const totalFields = 6; // Example: name, bio, skills, experience, education, resume
          
          if (data.first_name) completionScore++;
          if (data.last_name) completionScore++;
          if (data.bio) completionScore++;
          if (data.skills && data.skills.length > 0) completionScore++;
          if (data.experience && data.experience.length > 0) completionScore++;
          if (data.resume_url) completionScore++;
          
          setProfileCompletion(Math.round((completionScore / totalFields) * 100));
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchApplications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Get user's applications
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            jobs:job_id (
              *,
              companies:company_id (*)
            )
          `)
          .eq('applicant_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (!error) {
          setApplications(data || []);
          
          // Calculate application stats
          const stats = {
            total: data.length,
            pending: data.filter(app => app.status === 'New' || app.status === 'Pending').length,
            interviews: data.filter(app => app.status === 'Interview').length,
            rejected: data.filter(app => app.status === 'Rejected').length,
            accepted: data.filter(app => app.status === 'Hired').length,
          };
          
          setApplicationStats(stats);
        }
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };
  
  const fetchRecommendedJobs = async () => {
    try {
      // Get recently posted jobs as recommendations (in a real app, this would use more sophisticated matching)
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies:company_id (*)
        `)
        .eq('status', 'Active')
        .order('created_at', { ascending: false })
        .limit(2);
        
      if (!error) {
        setRecommendedJobs(data || []);
      }
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
    }
  };

  const handleApplyNow = (jobId) => {
    navigate(`/job/${jobId}`);
  };
  
  const handleUploadCV = () => {
    navigate('/profile', { state: { tab: 'resume' } });
  };
  
  const handleEditProfile = () => {
    navigate('/profile', { state: { tab: 'profile' } });
  };
  
  const handleViewAllApplications = () => {
    navigate('/applications');
  };
  
  const handleViewAllJobs = () => {
    navigate('/jobs');
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'New':
      case 'Pending':
        return <Clock size={14} className="text-yellow-500" />;
      case 'Interview':
        return <BarChart3 size={14} className="text-blue-500" />;
      case 'Rejected':
        return <XCircle size={14} className="text-red-500" />;
      case 'Hired':
      case 'Accepted':
        return <CheckCircle size={14} className="text-green-500" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
      case 'Pending':
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case 'Interview':
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'Rejected':
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case 'Hired':
      case 'Accepted':
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };
  
  const getMatchScoreColor = (score) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {showHints && <Hints userRole="job-seeker" />}
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">
          {userName ? `Good day, ${userName}` : 'Welcome back'}
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
                  <p className="text-xl font-bold">{profileCompletion}%</p>
                  <div className="w-24">
                    <Progress value={profileCompletion} className="h-2" />
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
                <Button variant="ghost" size="sm" className="text-xs" onClick={handleViewAllApplications}>
                  View All <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
              <CardDescription>
                Track your recent job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.length > 0 ? (
                  applications.slice(0, 3).map((application) => (
                    <div 
                      key={application.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-all hover:bg-background/50 animate-hover"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                          {application.jobs?.companies?.logo_url ? (
                            <img 
                              src={application.jobs.companies.logo_url} 
                              alt={application.jobs.companies.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Briefcase className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{application.jobs?.title || "Job Title"}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{application.jobs?.companies?.name || "Company"}</span>
                            <span className="text-xs">•</span>
                            <span>Applied {new Date(application.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <div className={`text-xs font-medium ${getMatchScoreColor(application.match_score || 70)}`}>
                            {application.match_score || 70}% match
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`mt-1 flex items-center gap-1 ${getStatusColor(application.status)}`}
                          >
                            {renderStatusIcon(application.status)}
                            {application.status}
                          </Badge>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8"
                          onClick={() => navigate(`/application/${application.id}`)}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    <p>You haven't applied to any jobs yet.</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate('/jobs')}
                    >
                      Browse Jobs
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass-card h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Top Matches</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs" onClick={handleViewAllJobs}>
                  View All <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
              <CardDescription>
                Jobs that match your skills and experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedJobs.length > 0 ? (
                  recommendedJobs.map((job) => (
                    <div 
                      key={job.id}
                      className="p-3 rounded-lg border border-border/50 hover:border-border transition-all hover:bg-background/50 animate-hover"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                          {job.companies?.logo_url ? (
                            <img 
                              src={job.companies.logo_url} 
                              alt={job.companies.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Briefcase className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.companies?.name || "Company"}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-muted-foreground">{job.location || "Remote"}</span>
                        <span className="font-medium">{job.salary_range || "Competitive"}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Badge>
                        <div className={`text-xs font-medium flex items-center gap-1 ${getMatchScoreColor(job.match_score || 80)}`}>
                          <div className="w-14 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div 
                              className={`h-full ${
                                (job.match_score || 80) >= 90 ? "bg-green-500" : 
                                (job.match_score || 80) >= 70 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${job.match_score || 80}%` }}
                            />
                          </div>
                          <span>{job.match_score || 80}% match</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full mt-3 neo-button" 
                        size="sm"
                        onClick={() => handleApplyNow(job.id)}
                      >
                        <span>Apply Now</span>
                        <ArrowUpRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    <p>No recommended jobs yet.</p>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full neo-button"
                  onClick={handleViewAllJobs}
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
              <Button onClick={handleUploadCV}>Upload CV</Button>
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
              <Button variant="outline" onClick={handleEditProfile}>Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSeekerDashboard;
