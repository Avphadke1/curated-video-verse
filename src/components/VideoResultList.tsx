
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoResultListProps {
  videos: Array<any>;
  loading?: boolean;
}

const VideoResultList: React.FC<VideoResultListProps> = ({ videos, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 mt-8 px-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full rounded" />
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!videos.length) {
    return <div className="text-center text-muted-foreground pt-12">No results yet. Try searching for a topic!</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 mt-8 px-1">
      {videos.map((video, i) => (
        <a
          key={video.videoId || i}
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          className="rounded-lg shadow bg-card p-3 sm:p-4 hover:shadow-lg transition-shadow block focus:ring-2 focus:ring-primary ring-offset-2 outline-none"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center overflow-hidden">
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt={video.title}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            ) : (
              <span className="text-xs text-muted-foreground">No Thumbnail</span>
            )}
          </div>
          <div className="font-semibold text-base truncate mb-0.5">{video.title}</div>
          <div className="text-xs text-muted-foreground truncate">{video.channel}</div>
          {video.publishedAt && (
            <div className="text-xs text-muted-foreground mt-1">{new Date(video.publishedAt).toLocaleDateString()}</div>
          )}
        </a>
      ))}
    </div>
  );
};

export default VideoResultList;
