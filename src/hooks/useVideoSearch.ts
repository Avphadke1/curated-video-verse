
import { useState } from "react";
import { SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FetchVideosParams {
  term: string;
  regionCode: string;
  order: string;
  accessToken: string;
}

export function useVideoSearch() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVideos = async ({ term, regionCode, order, accessToken }: FetchVideosParams) => {
    setLoading(true);
    try {
      if (!accessToken) {
        toast({ title: "Not logged in", description: "You must be logged in to search videos.", variant: "destructive" });
        setLoading(false);
        return [];
      }
      const res = await fetch("https://goucqtoqpxkuhkyjddpg.supabase.co/functions/v1/youtube-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_PUBLISHABLE_KEY,
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ term, regionCode, order })
      });
      let data: any = null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }
      if (!res.ok || !data) {
        toast({ title: "API Error", description: data?.error || "Failed to fetch videos or invalid response.", variant: "destructive" });
        setVideos([]);
        setLoading(false);
        return [];
      }
      if (data.error) {
        toast({ title: "API Error", description: data.error, variant: "destructive" });
        setVideos([]);
        setLoading(false);
        return [];
      }
      if (!Array.isArray(data.videos)) {
        toast({ title: "Unexpected response", description: "Server did not return a videos array.", variant: "destructive" });
        setVideos([]);
        setLoading(false);
        return [];
      }
      setVideos(data.videos);
      setLoading(false);
      return data.videos;
    } catch (e: any) {
      toast({ title: "Network Error", description: e.message, variant: "destructive" });
      setVideos([]);
      setLoading(false);
      return [];
    }
  };

  // convenience for resetting results
  const clearVideos = () => setVideos([]);

  return { videos, setVideos, loading, fetchVideos, clearVideos };
}
