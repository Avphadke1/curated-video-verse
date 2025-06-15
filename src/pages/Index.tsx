
import React, { useState } from "react";
import VideoSearchBar from "@/components/VideoSearchBar";
import VideoResultList from "@/components/VideoResultList";

// Helper: Get/Set API Key in localStorage
function getYoutubeApiKey(): string | null {
  return localStorage.getItem("youtube_api_key");
}

function setYoutubeApiKey(key: string) {
  localStorage.setItem("youtube_api_key", key);
}

const Index = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(getYoutubeApiKey());
  const [showKeyInput, setShowKeyInput] = useState(apiKey ? false : true);
  const [keyInputVal, setKeyInputVal] = useState("");

  const handleSearch = async (searchTerm: string) => {
    setQuery(searchTerm);
    setLoading(true);

    if (!apiKey) {
      setLoading(false);
      return;
    }

    try {
      // YouTube API: Search for videos matching the query
      const searchUrl =
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=9&q=${encodeURIComponent(
          searchTerm
        )}&key=${apiKey}`;

      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (searchData.error) {
        setVideos([]);
        alert(`YouTube API error: ${searchData.error.message}`);
        setLoading(false);
        return;
      }

      // Fetch video details (views, etc) in bulk if needed: videoIds = searchData.items.map(i => i.id.videoId).join(",")
      const videosList = searchData.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        channelId: item.snippet.channelId,
        thumbnail: item.snippet.thumbnails.medium.url,
        publishedAt: item.snippet.publishedAt,
      }));

      setVideos(videosList);
    } catch (e: any) {
      alert("Error fetching YouTube videos: " + e.message);
      setVideos([]);
    }
    setLoading(false);
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInputVal.trim()) return;
    setYoutubeApiKey(keyInputVal.trim());
    setApiKey(keyInputVal.trim());
    setShowKeyInput(false);
  };

  // Option to reset/change the API key if needed
  const handleResetKey = () => {
    setApiKey(null);
    setShowKeyInput(true);
    localStorage.removeItem("youtube_api_key");
    setVideos([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-2">
      <div className="w-full max-w-2xl text-center mt-16">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Curated YouTube Video Discovery</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Find the most authentic and unbiased videos on your favorite topics.
        </p>
        {showKeyInput ? (
          <form
            onSubmit={handleKeySubmit}
            className="flex flex-col items-center gap-2 mb-6"
          >
            <input
              type="password"
              className="border rounded px-3 py-2 w-full max-w-sm"
              placeholder="Enter your YouTube API key"
              value={keyInputVal}
              onChange={e => setKeyInputVal(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium hover:bg-primary/90"
            >
              Save API Key
            </button>
            <div className="text-xs text-muted-foreground max-w-xs mt-1">
              Your API key is safely stored in your browser (localStorage) and never sent anywhere except directly to YouTube.
            </div>
            <a
              href="https://console.developers.google.com/apis/credentials"
              className="text-xs underline text-blue-600 hover:text-blue-700 mt-1"
              rel="noopener noreferrer"
              target="_blank"
            >
              Get your YouTube Data API v3 key (Google Cloud Console)
            </a>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-2 mb-4">
            <VideoSearchBar onSearch={handleSearch} loading={loading} />
            <button
              className="text-xs text-muted-foreground underline"
              onClick={handleResetKey}
              type="button"
            >
              Change or Remove API Key
            </button>
          </div>
        )}
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <VideoResultList videos={videos} loading={loading} />
      </div>
    </div>
  );
};

export default Index;

