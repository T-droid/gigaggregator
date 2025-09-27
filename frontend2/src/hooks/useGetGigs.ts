import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export function useGetGigs() {
    return useQuery({
        queryKey: ['gigs'],
        queryFn: async () => {
            const res = await axiosInstance.get("/gigs");
            return res.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}