import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "./use-toast";
import { Gig } from "@/types/gigs";


export function useScrapData() {
    const queryClient = useQueryClient();
  return useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.post("/scrape");
            return res.data;
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to scrape data. Please try again.",
                variant: "destructive"
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['gigs'] });
            toast({
                title: "Success",
                description: data.message || "Scrape completed successfully!",
                variant: "default"
            });
        }
    });
}