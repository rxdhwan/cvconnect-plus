
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Hints from "../onboarding/Hints";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [showHints, setShowHints] = useState(false);
  const [activeJobs, setActiveJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [jobStats, setJobStats] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    newApplications: 0,
    interviewsScheduled: 0,
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if hints were already shown
    const hintsShown = localStorage.getItem("hintsShown");
    setShowHints(!hintsShown);
    
    fetchCompanyData();
  }, []);
  
  const fetchCompanyData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Get company ID from profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', session.user.id)
          .single();
          
        if (profileError || !profile?.company_id) {
          console.error("Error fetching profile or no company ID:", profileError);
          setLoading(false);
          return;
        }
        
        const companyId = profile.company_id;
        
        // Fetch active jobs
        const { data: jobs, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('company_id', companyId)
          .eq('status', 'Active')
          .order('created_at', { ascending: false });
          
        if (!jobsError) {
          setActiveJobs(jobs || []);
        }
        
        // Fetch recent applicants
        const { data: applicants, error: applicantsError } = await supabase
          .from('applications')
          .select(`
            *,
            jobs:job_id(*),
            profiles:applicant_id(*)
          `)
          .eq('company_id', companyId)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (!applicantsError) {
          setRecentApplicants(applicants || []);
        }
        
        // Calculate job stats
        if (!jobsError && !applicantsError) {
          // Count total applicants across all jobs
          const { count: totalApplicants, error: countError } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', companyId);
            
          // Count new applications (received in last 7 days)
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          
          const { count: newApplications, error: newAppError } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', companyId)
            .gte('created_at', oneWeekAgo.toISOString());
            
          // Count interviews scheduled
          const { count: interviewsScheduled, error: interviewsError } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', companyId)
            .eq('status', 'Interview');
            
          setJobStats({
            activeJobs: jobs?.length || 0,
            totalApplicants: totalApplicants || 0,
            newApplications: newApplications || 0,
            interviewsScheduled: interviewsScheduled || 0,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching employer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostNewJob = () => {
    navigate('/post-job');
  };
  
  const handleViewJobDetails = (jobId) => {
    navigate(`/job/${jobId}/manage`);
  };
  
  const handleViewAllJobs = () => {
    navigate('/company/jobs');
  };
  
  const handleViewAllApplicants = () => {
    navigate('/company/applicants');
  };
  
  const handleViewCv = (resumeUrl) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      toast.error("CV not available");
    }
  };
  
  const handleReviewApplication = (applicationId) => {
    navigate(`/application/${applicationId}`);
  };
  
  const handleUpgradeToPremium = () => {
    navigate('/pricing');
  };

  const getStatusColor = (status) => {
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

  const getMatchScoreColor = (score) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const renderStatusIcon = (status) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                <Button variant="ghost" size="sm" className="text-xs" onClick={handleViewAllJobs}>
                  View All <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
              <CardDescription>
                Monitor performance of your job listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeJobs.length > 0 ? (
                  activeJobs.map((job) => (
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
                            <span>Posted {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            <span className="text-xs">•</span>
                            <span>Expires {new Date(job.expires_at || new Date(job.created_at).setMonth(new Date(job.created_at).getMonth() + 1)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                          <p className="text-lg font-medium">{job.application_count || 0}</p>
                          <p className="text-xs text-muted-foreground">Applicants</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-lg font-medium">{job.view_count || 0}</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8"
                          onClick={() => handleViewJobDetails(job.id)}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6 text-muted-foreground">
                    <p>You don't have any active job listings.</p>
                    <p className="text-sm mt-2">Post a new job to start receiving applications.</p>
                  </div>
                )}
                
                <Button 
                  className="w-full neo-button" 
                  variant="outline"
                  onClick={handlePostNewJob}
                >
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
                <Button variant="ghost" size="sm" className="text-xs" onClick={handleViewAllApplicants}>
                  View All <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
              <CardDescription>
                Candidates that recently applied to your jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplicants.length > 0 ? (
                  recentApplicants.map((applicant) => (
                    <div 
                      key={applicant.id}
                      className="p-3 rounded-lg border border-border/50 hover:border-border transition-all hover:bg-background/50 animate-hover"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                          {applicant.profiles?.avatar_url ? (
                            <img 
                              src={applicant.profiles.avatar_url} 
                              alt={`${applicant.profiles.first_name} ${applicant.profiles.last_name}`} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Users className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {applicant.profiles?.first_name} {applicant.profiles?.last_name || ""}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Applied for {applicant.jobs?.title || "Job"}
                          </p>
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
                        
                        <div className={`text-xs font-medium flex items-center gap-1 ${getMatchScoreColor(applicant.match_score || 75)}`}>
                          <span>{applicant.match_score || 75}% match</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button 
                          className="w-full neo-button" 
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewCv(applicant.profiles?.resume_url)}
                        >
                          View CV
                        </Button>
                        <Button 
                          className="w-full neo-button" 
                          size="sm"
                          onClick={() => handleReviewApplication(applicant.id)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    <p>No applications received yet.</p>
                    <p className="text-sm mt-2">Post jobs to start receiving applications.</p>
                  </div>
                )}
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
          
          <Button 
            className="w-full neo-button mt-4"
            onClick={handleUpgradeToPremium}
          >
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerDashboard;
