
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoResultListProps {
  videos: Array<any>;
  loading?: boolean;
  query?: string;
}

const VideoResultList: React.FC<VideoResultListProps> = ({ videos, loading, query }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 mt-8 px-1 animate-fade-in">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2 animate-pulse transition-shadow duration-300">
            <Skeleton className="h-48 w-full rounded" />
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!videos.length && query) {
    return <div className="text-center text-muted-foreground pt-12 animate-fade-in">No videos found for your search.</div>;
  }

  if (!videos.length) {
    return <div className="text-center text-muted-foreground pt-12 animate-fade-in">No results yet. Try searching for a topic!</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 mt-8 px-1 animate-fade-in">
      {videos.map((video, i) => (
        <a
          key={video.videoId || i}
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          className="rounded-lg shadow bg-card p-3 sm:p-4 hover:shadow-xl hover-scale hover:ring-2 hover:ring-primary ring-offset-2 outline-none transition-all duration-200 animate-scale-in"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center overflow-hidden animate-fade-in">
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
                loading="lazy"
              />
            ) : (
              <span className="text-xs text-muted-foreground">No Thumbnail</span>
            )}
          </div>
          <div className="font-semibold text-base truncate mb-0.5 animate-fade-in delay-100">{video.title}</div>
          <div className="text-xs text-muted-foreground truncate animate-fade-in delay-200">{video.channel}</div>
          {video.publishedAt && (
            <div className="text-xs text-muted-foreground mt-1 animate-fade-in delay-300">{new Date(video.publishedAt).toLocaleDateString()}</div>
          )}
        </a>
      ))}
    </div>
  );
};

export default VideoResultList;
