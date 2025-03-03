
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Heart,
  Bitcoin, 
  Ethereum 
} from "lucide-react";
import { toast } from "sonner";

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    logo: string;
    location: string;
    salary: string;
    type: string;
    posted: string;
    applicants: number;
    description: string;
    tags: string[];
    matchScore?: number;
  };
  compact?: boolean;
}

const SolanaIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 32 32" 
    xmlns="http://www.w3.org/2000/svg"
    className="fill-crypto-solana"
  >
    <path d="M26.92 10.28a1.33 1.33 0 00-.8-.8l-7.99-3.03L4.97 19.95a1.33 1.33 0 000 1.87l3.43 3.43c.49.49 1.26.52 1.8.08L26.92 10.28zm-6.5 14.29l-4.1 4.1c-.5.5-1.38.5-1.87 0l-9.8-9.8a1.33 1.33 0 01-.08-1.76L18.43 3.2l7.68 2.9a1.32 1.32 0 01.8.8l.02 16.83a1.33 1.33 0 01-.39.94l-6.13 6.13v-.25z"/>
  </svg>
);

const getCryptoIcon = (tag: string) => {
  const lowerTag = tag.toLowerCase();
  if (lowerTag.includes("bitcoin")) return <Bitcoin size={16} className="text-crypto-bitcoin" />;
  if (lowerTag.includes("ethereum")) return <Ethereum size={16} className="text-crypto-ethereum" />;
  if (lowerTag.includes("solana")) return <SolanaIcon />;
  return null;
};

const getMatchScoreColor = (score?: number) => {
  if (!score) return "";
  if (score >= 90) return "text-green-500";
  if (score >= 70) return "text-yellow-500";
  return "text-red-500";
};

const JobCard = ({ job, compact = false }: JobCardProps) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
    if (!saved) {
      toast.success("Job saved to favorites");
    } else {
      toast.success("Job removed from favorites");
    }
  };

  const handleApply = () => {
    toast.success("Application submitted successfully");
  };

  if (compact) {
    return (
      <div className="p-4 rounded-lg border border-border/50 hover:border-border transition-all hover:bg-background/50 glass-card animate-hover">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={job.logo} 
              alt={job.company} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h3 className="font-medium line-clamp-1">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="outline" className="text-xs flex items-center gap-1 bg-background/80">
            <MapPin size={12} />
            {job.location}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1 bg-background/80">
            <DollarSign size={12} />
            {job.salary}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-1">
            {job.tags.slice(0, 2).map((tag, index) => {
              const icon = getCryptoIcon(tag);
              if (!icon) return null;
              
              return (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs flex items-center gap-1"
                >
                  {icon}
                  {tag}
                </Badge>
              );
            })}
          </div>
          
          {job.matchScore && (
            <div className={`text-xs font-medium ${getMatchScoreColor(job.matchScore)}`}>
              {job.matchScore}% match
            </div>
          )}
        </div>
        
        <Button 
          className="w-full mt-3 neo-button" 
          size="sm"
          onClick={handleApply}
        >
          Apply Now
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg border border-border/50 hover:border-border transition-all hover:bg-background/50 glass-card animate-hover">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={job.logo} 
              alt={job.company} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h3 className="text-xl font-medium">{job.title}</h3>
            <p className="text-muted-foreground">{job.company}</p>
          </div>
        </div>
        
        <button 
          onClick={handleSave}
          className={`p-2 rounded-full ${
            saved ? "text-primary bg-primary/10" : "text-muted-foreground bg-muted/50 hover:bg-muted/80"
          }`}
        >
          <Heart size={20} className={saved ? "fill-primary" : ""} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10">
            <MapPin size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-medium">{job.location}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-yellow-500/10">
            <Clock size={16} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Job Type</p>
            <p className="text-sm font-medium">{job.type}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-green-500/10">
            <DollarSign size={16} className="text-green-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Salary</p>
            <p className="text-sm font-medium">{job.salary}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-blue-500/10">
            <Users size={16} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Applicants</p>
            <p className="text-sm font-medium">{job.applicants}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {job.tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="flex items-center gap-1"
            >
              {getCryptoIcon(tag)}
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Briefcase size={14} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Posted {job.posted}</span>
          </div>
          
          {job.matchScore && (
            <div className={`text-sm font-medium ${getMatchScoreColor(job.matchScore)}`}>
              {job.matchScore}% match
            </div>
          )}
        </div>
        
        <div className="flex gap-3 mt-4">
          <Button 
            variant="outline" 
            className="flex-1 neo-button"
            onClick={handleSave}
          >
            <Heart size={16} className={`mr-2 ${saved ? "fill-primary" : ""}`} />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button 
            className="flex-[2] neo-button"
            onClick={handleApply}
          >
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
