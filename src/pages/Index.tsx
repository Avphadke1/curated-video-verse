import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import VideoSearchBar from "@/components/VideoSearchBar";
import VideoFilterBar from "@/components/VideoFilterBar";
import VideoResultList from "@/components/VideoResultList";

// Helper: Get/Set API Key in localStorage
function getYoutubeApiKey(): string | null {
  return localStorage.getItem("youtube_api_key");
}

function setYoutubeApiKey(key: string) {
  localStorage.setItem("youtube_api_key", key);
}

const DEFAULT_REGION = "US";
const DEFAULT_SORT = "relevance";

const Index = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [region, setRegion] = useState<string>(DEFAULT_REGION);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_SORT);
  const [pendingFilter, setPendingFilter] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // On mount: check authentication
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });
    // Subscribe to auth-changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/auth");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Remove API key from UI and localStorage (now handled on backend)
  // API calls will now use edge function endpoint
  const fetchVideos = async ({
    term, regionCode, order,
  }: {
    term: string;
    regionCode: string;
    order: string;
  }) => {
    setLoading(true);
    try {
      // Add the Supabase anon key as 'apikey' header
      const res = await fetch(`/functions/v1/youtube-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabase.options.auth?.anonKey || "",
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
      console.log("EdgeFunction fetch, status:", res.status);
      console.log("Received data from edge function:", data);

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
      console.log("Final videos set in state:", data.videos);
      setLoading(false);
      return data.videos;
    } catch (e: any) {
      toast({ title: "Network Error", description: e.message, variant: "destructive" });
      setVideos([]);
      setLoading(false);
      return [];
    }
  };

  const handleSearch = async (searchTerm: string) => {
    setQuery(searchTerm);
    await fetchVideos({
      term: searchTerm,
      regionCode: region,
      order: sortOrder,
    });
    setPendingFilter(false);
  };

  // Handle user clicks "Apply Filters"
  const handleApplyFilters = async () => {
    if (query) {
      await fetchVideos({
        term: query,
        regionCode: region,
        order: sortOrder,
      });
      setPendingFilter(false);
    }
  };

  const handleSortOrderChange = (newSort: string) => {
    setSortOrder(newSort);
    setPendingFilter(true);
  };
  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    setPendingFilter(true);
  };

  // For display above grid for debugging
  const regionMap: Record<string, string> = {
    US: "United States",
    IN: "India",
    GB: "United Kingdom",
    JP: "Japan",
    DE: "Germany",
    FR: "France",
    RU: "Russia",
    BR: "Brazil",
    KR: "South Korea",
    CA: "Canada",
  };
  const sortMap: Record<string, string> = {
    relevance: "Relevance",
    date: "Upload Date",
    viewCount: "View Count",
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-2 animate-fade-in">
      <div className="w-full max-w-2xl text-center mt-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 animate-scale-in">
          Curated YouTube Video Discovery
        </h1>
        <p className="text-lg text-muted-foreground mb-4 animate-fade-in">
          Find the most authentic and unbiased videos on your favorite topics.
        </p>
        <div className="flex flex-col items-center gap-2 mb-2">
          <VideoSearchBar onSearch={handleSearch} loading={loading} />
          {user ? (
            <Button
              onClick={async () => {
                await supabase.auth.signOut();
                toast({ title: "Logged out" });
              }}
              size="sm"
              variant="ghost"
              className="mt-2"
            >
              Log Out
            </Button>
          ) : (
            <Link to="/auth" className="text-xs underline text-blue-600 hover:text-blue-700 mt-3">
              Login / Signup
            </Link>
          )}
        </div>
      </div>
      {!user ? null : (
        <>
          {/* Filters: visible only if user is logged in and after a search */}
          {query && (
            <VideoFilterBar
              sortOrder={sortOrder}
              onSortOrderChange={handleSortOrderChange}
              region={region}
              onRegionChange={handleRegionChange}
              onSubmit={handleApplyFilters}
              loading={loading}
            />
          )}
          <div className="w-full max-w-4xl mx-auto">
            {/* Helper & debug bar */}
            {query && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between px-1 py-3 animate-fade-in">
                <span className="text-xs text-muted-foreground mb-2 md:mb-0">
                  <strong>Region:</strong> {regionMap[region] || region} &nbsp;|&nbsp;
                  <strong>Sort:</strong> {sortMap[sortOrder] || sortOrder}
                </span>
                <span className="text-xs text-muted-foreground text-right md:ml-4">
                  <span className="hidden sm:inline">Tip:</span> Try searching for topics like <span className="font-semibold">"music charts"</span>,{" "}
                  <span className="font-semibold">"football news"</span>, or <span className="font-semibold">"election 2024"</span> and switching region/sort filters!
                </span>
              </div>
            )}
            <VideoResultList
              videos={videos}
              loading={loading}
              query={query}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
