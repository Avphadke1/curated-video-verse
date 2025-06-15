// Update this page (the content is just a fallback if you fail to update the page)

import React, { useState } from "react";
import VideoSearchBar from "@/components/VideoSearchBar";
import VideoResultList from "@/components/VideoResultList";

const Index = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string | null>(null);

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    setLoading(true);
    // Simulate API call - replace with actual fetch in next steps
    setTimeout(() => {
      setVideos([
        { title: "Sample Video 1", channel: "ChannelOne" },
        { title: "Sample Video 2", channel: "TrustedReviews" },
        { title: "Sample Video 3", channel: "HonestTech" },
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-2">
      <div className="w-full max-w-2xl text-center mt-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Curated YouTube Video Discovery</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Find the most authentic and unbiased videos on your favorite topics.
        </p>
        <VideoSearchBar onSearch={handleSearch} loading={loading} />
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <VideoResultList videos={videos} loading={loading} />
      </div>
    </div>
  );
};

export default Index;
