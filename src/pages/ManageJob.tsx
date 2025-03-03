
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Briefcase, Users, Eye, Clock, Calendar, Building, ChevronLeft, Edit, Archive } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ManageJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchJobDetails();
      fetchApplicants();
    }
  }, [id]);
  
  const fetchJobDetails = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in first");
        navigate('/signin');
        return;
      }
      
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies:company_id(*)
        `)
        .eq('id', id)
        .single();
        
      if (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to load job details");
        navigate('/dashboard');
        return;
      }
      
      // Check if the user has permission to manage this job
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', session.user.id)
        .single();
        
      if (profile?.company_id !== data.company_id) {
        toast.error("You don't have permission to manage this job");
        navigate('/dashboard');
        return;
      }
      
      setJob(data);
    } catch (error) {
      console.error("Error fetching job details:", error);
      toast.error("An unexpected error occurred");
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchApplicants = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles:applicant_id(*)
        `)
        .eq('job_id', id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching applicants:", error);
        return;
      }
      
      setApplicants(data || []);
    } catch (error) {
      console.error("Error fetching applicants:", error);
    }
  };
  
  const handleEditJob = () => {
    navigate(`/edit-job/${id}`);
  };
  
  const handleJobStatusToggle = async (active) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: active ? 'Active' : 'Inactive' })
        .eq('id', id);
        
      if (error) {
        console.error("Error updating job status:", error);
        toast.error("Failed to update job status");
        return;
      }
      
      setJob(prev => ({ ...prev, status: active ? 'Active' : 'Inactive' }));
      toast.success(`Job ${active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("An unexpected error occurred");
    }
  };
  
  const handleViewApplicant = (applicationId) => {
    navigate(`/application/${applicationId}`);
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

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4 md:px-6">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-2"
            onClick={() => navigate('/dashboard')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{job?.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{job?.companies?.name}</span>
                
                <Badge 
                  variant={job?.status === 'Active' ? 'default' : 'secondary'}
                  className="ml-2"
                >
                  {job?.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handleEditJob}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              
              <Button 
                variant="destructive"
                onClick={() => handleJobStatusToggle(job?.status !== 'Active')}
              >
                {job?.status === 'Active' ? (
                  <>
                    <Archive className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Applicants</p>
                  <p className="text-3xl font-bold mt-1">{applicants.length}</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Views</p>
                  <p className="text-3xl font-bold mt-1">{job?.view_count || 0}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Days Active</p>
                  <p className="text-3xl font-bold mt-1">
                    {Math.max(0, Math.floor((new Date() - new Date(job?.created_at)) / (1000 * 60 * 60 * 24)))}
                  </p>
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
                  <p className="text-muted-foreground text-sm">Expires</p>
                  <p className="text-2xl font-bold mt-1">
                    {new Date(job?.expires_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-red-500/10">
                  <Calendar className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applicants" className="mb-6">
          <TabsList className="grid grid-cols-2 md:w-[400px]">
            <TabsTrigger value="applicants">Applicants</TabsTrigger>
            <TabsTrigger value="details">Job Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applicants" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Applicants ({applicants.length})</CardTitle>
                <CardDescription>
                  Review and manage candidates who applied for this position
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applicants.length > 0 ? (
                  <div className="space-y-4">
                    {applicants.map((applicant) => (
                      <div 
                        key={applicant.id}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-3 md:mb-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
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
                              Applied {new Date(applicant.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(applicant.status)}
                          >
                            {applicant.status}
                          </Badge>
                          
                          <Button 
                            size="sm"
                            onClick={() => handleViewApplicant(applicant.id)}
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-medium mb-2">No applicants yet</h3>
                    <p className="mb-6">Share your job posting to attract more candidates.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {job?.description}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Requirements</h3>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {job?.requirements}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                    <p>{job?.location || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Job Type</h3>
                    <p>{job?.type}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Salary Range</h3>
                    <p>{job?.salary_range || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Remote</h3>
                    <p>{job?.remote ? "Yes" : "No"}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job?.skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="job-status"
                      checked={job?.status === 'Active'}
                      onCheckedChange={handleJobStatusToggle}
                    />
                    <Label htmlFor="job-status">Job is active and accepting applications</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ManageJob;
