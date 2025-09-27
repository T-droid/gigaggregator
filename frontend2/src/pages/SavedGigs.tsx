import { useState } from "react";
import { Trash2, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SavedGig {
  id: string;
  title: string;
  description: string;
  platform: 'reddit' | 'discord' | 'twitter' | 'facebook';
  url: string;
  savedAt: string;
  tags: string[];
}

// Mock saved gigs data
const mockSavedGigs: SavedGig[] = [
  {
    id: '1',
    title: 'React + TypeScript Dashboard Project',
    description: 'Building a comprehensive dashboard with React, TypeScript, and Tailwind CSS. Need someone with experience in data visualization and responsive design.',
    platform: 'reddit',
    url: 'https://reddit.com/r/forhire/saved1',
    savedAt: '1 day ago',
    tags: ['React', 'TypeScript', 'Dashboard']
  },
  {
    id: '2', 
    title: 'Python API Development',
    description: 'Looking for a Python developer to create RESTful APIs with FastAPI. Must have experience with authentication and database integration.',
    platform: 'reddit',
    url: 'https://reddit.com/r/forhire/saved2',
    savedAt: '3 days ago',
    tags: ['Python', 'FastAPI', 'APIs']
  }
];

const platformColors = {
  reddit: 'reddit',
  discord: 'discord',
  twitter: 'twitter', 
  facebook: 'facebook'
} as const;

export default function SavedGigs() {
  const { toast } = useToast();
  const [savedGigs, setSavedGigs] = useState<SavedGig[]>(mockSavedGigs);

  const handleRemoveGig = (gigId: string) => {
    setSavedGigs(prev => prev.filter(gig => gig.id !== gigId));
    toast({
      title: "Gig removed",
      description: "Gig has been removed from your saved list",
    });
  };

  const handleCopyPitch = (gig: SavedGig) => {
    const pitch = `Hi there! I saw your post about "${gig.title}" and I'm very interested. I have extensive experience with ${gig.tags.join(', ')} and would love to discuss how I can help with your project.`;
    
    navigator.clipboard.writeText(pitch);
    toast({
      title: "Pitch copied!",
      description: "Template message copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Saved Gigs</h1>
          <p className="text-muted-foreground mt-1">
            {savedGigs.length} gigs saved for later
          </p>
        </div>
      </div>

      {/* Saved Gigs List */}
      <div className="grid gap-4">
        {savedGigs.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No saved gigs
                </h3>
                <p className="text-sm text-muted-foreground">
                  Save gigs from the dashboard to see them here
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          savedGigs.map((gig) => (
            <Card key={gig.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{gig.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary"
                        className={`bg-${platformColors[gig.platform]}/10 text-${platformColors[gig.platform]} border-${platformColors[gig.platform]}/20`}
                      >
                        {gig.platform}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Saved {gig.savedAt}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {gig.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-2">
                  {gig.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => window.open(gig.url, '_blank')}
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Post
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyPitch(gig)}
                    className="gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Pitch
                  </Button>

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveGig(gig.id)}
                    className="gap-2 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}