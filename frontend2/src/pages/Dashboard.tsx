import { useState } from "react";
import { RefreshCw, ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useScrapData } from "@/hooks/useScrapData";
import { Gig } from "@/types/gigs";
import { useGetGigs } from "@/hooks/useGetGigs";


type Platform = 'reddit' | 'discord' | 'twitter' | 'facebook';

interface DashboardProps {
  selectedPlatform: Platform;
}

const platformColors = {
  reddit: 'reddit',
  discord: 'discord', 
  twitter: 'twitter',
  facebook: 'facebook'
} as const;

export default function Dashboard({ selectedPlatform }: DashboardProps) {
  const { toast } = useToast();
  const [isScrapingGigs, setIsScrapingGigs] = useState(false);

  // Fetch gigs data using React Query
  const { data: gigs = [], isLoading, error } = useGetGigs();

  const { mutateAsync: scrapeGigs } = useScrapData();

  const handleScrapeNow = async () => {
    setIsScrapingGigs(true);
    try {
      await scrapeGigs();
    } catch (error) {
      console.error("Error scraping gigs:", error);
    } finally {
      setIsScrapingGigs(false);
    }
  };

  const handleCopyPitch = (gig: Gig) => {
    const pitch = `Hi there! I saw your post about "${gig.title}" and I'm very interested. I have extensive experience with ${gig.tags.join(', ')} and would love to discuss how I can help with your project.`;
    
    navigator.clipboard.writeText(pitch);
    toast({
      title: "Pitch copied!",
      description: "Template message copied to clipboard",
    });
  };

  // Filter gigs by platform (currently only Reddit is supported)
  const filteredGigs = gigs.filter(gig => gig.platform.toLowerCase() === selectedPlatform.toLowerCase());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading gigs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">Error loading gigs</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Reload
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Latest Gigs</h1>
          <p className="text-muted-foreground mt-1">
            Showing {filteredGigs.length} gigs from {selectedPlatform}
          </p>
        </div>
        
        <Button 
          onClick={handleScrapeNow} 
          disabled={isScrapingGigs}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isScrapingGigs ? 'animate-spin' : ''}`} />
          Scrape Now
        </Button>
      </div>

      {/* Gigs List */}
      <div className="grid gap-4">
        {filteredGigs.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  No gigs available
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try scraping for new gigs or check back later
                </p>
                <Button onClick={handleScrapeNow} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Scrape Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredGigs.map((gig) => (
            <Card key={gig.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{gig.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="secondary"
                        className={`bg-${platformColors[gig.platform.toLowerCase() as Platform]}/10 text-${platformColors[gig.platform.toLowerCase() as Platform]} border-${platformColors[gig.platform.toLowerCase() as Platform]}/20`}
                      >
                        {gig.platform}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{gig.post_date}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {gig.content}
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
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}