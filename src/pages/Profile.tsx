
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { User, Upload, Download, Plus, X, CheckCircle } from "lucide-react";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [cvUploaded, setCvUploaded] = useState(false);
  const [profileComplete, setProfileComplete] = useState(70);
  const [skills, setSkills] = useState<string[]>([
    "JavaScript", "React", "TypeScript", "Solana", "Rust"
  ]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
      toast.success("Skill added");
      // Increase profile completeness
      if (profileComplete < 100) {
        setProfileComplete(Math.min(100, profileComplete + 5));
      }
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
    toast("Skill removed");
    // Decrease profile completeness slightly
    if (profileComplete > 0) {
      setProfileComplete(Math.max(0, profileComplete - 5));
    }
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, you would upload the file to your server/storage
      setCvUploaded(true);
      toast.success("CV uploaded successfully");
      // Increase profile completeness
      if (profileComplete < 100) {
        setProfileComplete(Math.min(100, profileComplete + 15));
      }
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col gap-6">
          {/* Profile header */}
          <div className="glass-card p-6 rounded-lg">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt="User avatar" />
                <AvatarFallback className="text-3xl">JS</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold">John Smith</h1>
                <p className="text-muted-foreground">Senior Blockchain Developer</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">Solana</Badge>
                  <Badge variant="secondary">Ethereum</Badge>
                  <Badge variant="secondary">Smart Contracts</Badge>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <div className="bg-secondary p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Profile completeness</span>
                    <span className="text-sm font-medium">{profileComplete}%</span>
                  </div>
                  <Progress value={profileComplete} className="h-2" />
                </div>
                <Button className="w-full" onClick={() => navigate("/jobs")}>
                  Find Jobs
                </Button>
              </div>
            </div>
          </div>
          
          {/* Tabs content */}
          <Tabs defaultValue="profile">
            <TabsList className="grid grid-cols-3 md:w-[400px]">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6 mt-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue="John Smith" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Professional Title</Label>
                      <Input id="title" defaultValue="Senior Blockchain Developer" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="john.smith@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" defaultValue="San Francisco, CA" />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        defaultValue="Experienced blockchain developer with 5+ years working with Solana, Ethereum, and other protocols. Passionate about decentralized finance and creating secure smart contracts."
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>
                  
                  <Button className="w-full md:w-auto">
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Skills</h2>
                  
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <Badge key={skill} className="flex items-center gap-1 py-1.5">
                        {skill}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a skill..." 
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Experience</h2>
                  
                  <div className="space-y-6">
                    <div className="border p-4 rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">Senior Blockchain Developer</h3>
                          <p className="text-muted-foreground">CryptoX</p>
                        </div>
                        <p className="text-sm text-muted-foreground">2020 - Present</p>
                      </div>
                      <p className="mt-2 text-sm">
                        Led development of DeFi protocols on Solana and Ethereum, managing a team of 5 engineers.
                      </p>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">Blockchain Engineer</h3>
                          <p className="text-muted-foreground">BlockChain Inc</p>
                        </div>
                        <p className="text-sm text-muted-foreground">2018 - 2020</p>
                      </div>
                      <p className="mt-2 text-sm">
                        Developed smart contracts and dApps on Ethereum using Solidity and Web3.js.
                      </p>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="resume" className="space-y-6 mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Resume/CV</h2>
                  
                  {cvUploaded ? (
                    <div className="border rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <div>
                            <p className="font-medium">Resume_JohnSmith_2023.pdf</p>
                            <p className="text-sm text-muted-foreground">
                              Uploaded on {new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Replace
                          </Button>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div>
                        <h3 className="font-medium mb-2">AI Analysis Results</h3>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Skills Extracted</span>
                              <span>12 skills</span>
                            </div>
                            <Progress value={100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Experience Levels</span>
                              <span>Senior (5+ years)</span>
                            </div>
                            <Progress value={100} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Profile Completeness</span>
                              <span>85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg p-6 flex flex-col items-center text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium">Upload your resume</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        PDF, DOCX or TXT files up to 5MB
                      </p>
                      <div className="flex gap-4">
                        <label htmlFor="cv-upload">
                          <Input
                            id="cv-upload"
                            type="file"
                            accept=".pdf,.docx,.txt"
                            className="hidden"
                            onChange={handleCvUpload}
                          />
                          <Button
                            type="button"
                            className="cursor-pointer"
                            asChild
                          >
                            <span>Select File</span>
                          </Button>
                        </label>
                        <Button variant="outline">Use Template</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {cvUploaded && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Job Matching</h2>
                    <p className="mb-4">
                      Based on your resume, we've found the following job matches:
                    </p>
                    
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">Senior Solana Developer</h3>
                            <p className="text-sm text-muted-foreground">CryptoX • Remote</p>
                          </div>
                          <Badge>92% Match</Badge>
                        </div>
                        <div className="mt-2">
                          <Button
                            size="sm"
                            onClick={() => navigate("/job/1")}
                          >
                            View Job
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">Blockchain Engineer</h3>
                            <p className="text-sm text-muted-foreground">DefiProtocol • San Francisco, CA</p>
                          </div>
                          <Badge>85% Match</Badge>
                        </div>
                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            View Job
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate("/jobs")}
                      >
                        View All Matches
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6 mt-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Job Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Desired Job Title</Label>
                      <Input id="title" defaultValue="Senior Blockchain Developer" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="jobTypes">Job Types</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge>Full-time</Badge>
                        <Badge variant="outline">Part-time</Badge>
                        <Badge variant="outline">Contract</Badge>
                        <Badge variant="outline">Freelance</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="salary">Expected Salary Range</Label>
                      <Input id="salary" defaultValue="$120,000 - $160,000" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="locations">Preferred Locations</Label>
                      <Input id="locations" defaultValue="Remote, San Francisco, New York" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="remote" defaultChecked />
                      <Label htmlFor="remote">Open to remote work</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch id="relocation" />
                      <Label htmlFor="relocation">Willing to relocate</Label>
                    </div>
                  </div>
                  
                  <Button className="w-full md:w-auto">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="job-alerts">Job Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications for new matching jobs
                        </p>
                      </div>
                      <Switch id="job-alerts" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="application-updates">Application Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about your application status
                        </p>
                      </div>
                      <Switch id="application-updates" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive tips, news, and career advice
                        </p>
                      </div>
                      <Switch id="marketing" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
