
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import JobCard from "@/components/jobs/JobCard";
import { Search, Briefcase, MapPin, DollarSign, Users } from "lucide-react";

const MOCK_JOBS = [
  {
    id: "1",
    title: "Senior Solana Developer",
    company: "CryptoX",
    location: "Remote",
    salary: "$120k - $160k",
    type: "Full-time",
    tags: ["Solana", "Rust", "JavaScript"],
    applications: 23,
    posted: "2 days ago",
    description: "We're looking for an experienced Solana developer to join our team to work on our DeFi protocol.",
    aiScore: 92,
  },
  {
    id: "2",
    title: "Ethereum Smart Contract Engineer",
    company: "BlockFi",
    location: "San Francisco, CA",
    salary: "$140k - $180k",
    type: "Full-time",
    tags: ["Ethereum", "Solidity", "Web3.js"],
    applications: 45,
    posted: "1 week ago",
    description: "Join our team to build secure and efficient smart contracts for our financial products.",
    aiScore: 85,
  },
  {
    id: "3",
    title: "Blockchain UI/UX Designer",
    company: "CoinBase",
    location: "New York, NY",
    salary: "$90k - $120k",
    type: "Full-time",
    tags: ["UI/UX", "Figma", "Crypto"],
    applications: 36,
    posted: "3 days ago",
    description: "Design intuitive and beautiful interfaces for our cryptocurrency exchange platform.",
    aiScore: 78,
  },
  {
    id: "4",
    title: "Bitcoin Core Developer",
    company: "Lightning Labs",
    location: "Remote",
    salary: "$150k - $200k",
    type: "Full-time",
    tags: ["Bitcoin", "C++", "Lightning Network"],
    applications: 19,
    posted: "1 month ago",
    description: "Help us improve Bitcoin's scalability and implement new features in the Lightning Network.",
    aiScore: 90,
  },
  {
    id: "5",
    title: "Web3 Frontend Engineer",
    company: "MetaMask",
    location: "Remote",
    salary: "$110k - $150k",
    type: "Full-time",
    tags: ["React", "Ethereum", "TypeScript"],
    applications: 67,
    posted: "5 days ago",
    description: "Build intuitive interfaces for our Web3 wallet and DApp browser.",
    aiScore: 88,
  },
  {
    id: "6",
    title: "Crypto Security Researcher",
    company: "ChainSecurity",
    location: "Zurich, Switzerland",
    salary: "$130k - $170k",
    type: "Full-time",
    tags: ["Security", "Ethereum", "Solana"],
    applications: 12,
    posted: "2 weeks ago",
    description: "Research and identify security vulnerabilities in blockchain protocols and smart contracts.",
    aiScore: 95,
  },
];

const Jobs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(MOCK_JOBS);
  const [salaryRange, setSalaryRange] = useState([80, 200]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [jobType, setJobType] = useState<string | undefined>();
  const [remoteOnly, setRemoteOnly] = useState(false);

  const handleFilter = () => {
    let results = MOCK_JOBS;
    
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedTags.length > 0) {
      results = results.filter(job => 
        job.tags.some(tag => selectedTags.includes(tag))
      );
    }
    
    if (jobType) {
      results = results.filter(job => job.type === jobType);
    }
    
    if (remoteOnly) {
      results = results.filter(job => job.location.toLowerCase().includes("remote"));
    }
    
    // Filter by salary range (rough estimation since we're using strings)
    results = results.filter(job => {
      const salaryText = job.salary.replace(/[^0-9-]/g, '');
      const [min, max] = salaryText.split('-').map(Number);
      return (min >= salaryRange[0] * 1000) && (max <= salaryRange[1] * 1000);
    });
    
    setFilteredJobs(results);
  };

  // All possible tags from jobs
  const allTags = Array.from(new Set(MOCK_JOBS.flatMap(job => job.tags)));

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="w-full md:w-1/4 space-y-6">
            <div className="glass-card p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search jobs..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select value={jobType} onValueChange={setJobType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Salary Range (k$)</Label>
                  <div className="pt-4 pb-2">
                    <Slider
                      min={50}
                      max={250}
                      step={10}
                      value={salaryRange}
                      onValueChange={setSalaryRange}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${salaryRange[0]}k</span>
                    <span>${salaryRange[1]}k</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="remote"
                    checked={remoteOnly}
                    onCheckedChange={setRemoteOnly}
                  />
                  <Label htmlFor="remote">Remote only</Label>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label>Skills & Technologies</Label>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {allTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full" onClick={handleFilter}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Job listings */}
          <div className="w-full md:w-3/4 space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                Jobs <span className="text-muted-foreground ml-2 text-lg">({filteredJobs.length})</span>
              </h1>
              <Select defaultValue="relevant">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevant">Most Relevant</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary-high">Highest Salary</SelectItem>
                  <SelectItem value="salary-low">Lowest Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map(job => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    salary={job.salary}
                    tags={job.tags}
                    applications={job.applications}
                    posted={job.posted}
                    description={job.description}
                    aiScore={job.aiScore}
                    onApply={() => navigate(`/job/${job.id}`)}
                    onSave={() => console.log("Saved job", job.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 glass-card rounded-lg">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Jobs;
