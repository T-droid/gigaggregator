export interface Gig {
  id: number;
  title: string;
  url: string;
  content: string;
  platform: string;
  post_date: string; // Format: "YYYY-MM-DD HH:MM:SS"
  tags: string[]; // Matching keywords found in the gig
}

// Optional: If you want to add client-side properties
export interface GigWithClientData extends Gig {
  isSaved?: boolean; // Client-side state
}