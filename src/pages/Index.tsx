import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import VideoSearchBar from "@/components/VideoSearchBar";
import VideoFilterBar from "@/components/VideoFilterBar";
import VideoResultList from "@/components/VideoResultList";
import { toast } from "@/hooks/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useVideoSearch } from "@/hooks/useVideoSearch";

const DEFAULT_REGION = "US";
const DEFAULT_SORT = "relevance";

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

const Index = () => {
  // Auth/session managed in custom hook
  const { user, session } = useSupabaseAuth({ requireAuth: true });

  // Video API logic in its own hook
  const { videos, loading, fetchVideos, setVideos } = useVideoSearch();

  // Internal state for filters/search
  const [query, setQuery] = useState<string | null>(null);
  const [region, setRegion] = useState<string>(DEFAULT_REGION);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_SORT);
  const [pendingFilter, setPendingFilter] = useState<boolean>(false);

  const handleSearch = async (searchTerm: string) => {
    setQuery(searchTerm);
    await fetchVideos({
      term: searchTerm,
      regionCode: region,
      order: sortOrder,
      accessToken: session?.access_token || "",
    });
    setPendingFilter(false);
  };

  const handleApplyFilters = async () => {
    if (query) {
      await fetchVideos({
        term: query,
        regionCode: region,
        order: sortOrder,
        accessToken: session?.access_token || "",
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

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-2 animate-fade-in">
      <div className="w-full max-w-2xl text-center mt-16 transition-all duration-500 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 animate-scale-in origin-top">
          Curated YouTube Video Discovery
        </h1>
        <p className="text-lg text-muted-foreground mb-4 animate-fade-in delay-150">
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
              className="mt-2 animate-fade-in"
            >
              Log Out
            </Button>
          ) : (
            <Link to="/auth" className="text-xs underline text-blue-600 hover:text-blue-700 mt-3 animate-fade-in delay-200">
              Login / Signup
            </Link>
          )}
        </div>
      </div>
      {!user ? null : (
        <>
          {query && (
            <div className="w-full transition-all duration-300 animate-fade-in">
              <VideoFilterBar
                sortOrder={sortOrder}
                onSortOrderChange={handleSortOrderChange}
                region={region}
                onRegionChange={handleRegionChange}
                onSubmit={handleApplyFilters}
                loading={loading}
              />
            </div>
          )}
          <div className="w-full max-w-4xl mx-auto">
            {query && (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between px-1 py-3 animate-fade-in">
                <span className="text-xs text-muted-foreground mb-2 md:mb-0 transition-opacity duration-300">
                  <strong>Region:</strong> {regionMap[region] || region} &nbsp;|&nbsp;
                  <strong>Sort:</strong> {sortMap[sortOrder] || sortOrder}
                </span>
                <span className="text-xs text-muted-foreground text-right md:ml-4 animate-pulse delay-300">
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
