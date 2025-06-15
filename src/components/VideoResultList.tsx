
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoResultListProps {
  videos: Array<any>;
  loading?: boolean;
}

const VideoResultList: React.FC<VideoResultListProps> = ({ videos, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!videos.length) {
    return <div className="text-center text-muted-foreground pt-12">No results yet. Try searching for a topic!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {videos.map((video, i) => (
        <div key={i} className="rounded-lg shadow bg-card p-4">
          <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center">
            {/* In later steps, render the thumbnail */}
            <span className="text-xs text-muted-foreground">Thumbnail</span>
          </div>
          <div className="font-semibold text-base truncate">{video.title}</div>
          <div className="text-xs text-muted-foreground truncate">{video.channel}</div>
        </div>
      ))}
    </div>
  );
};

export default VideoResultList;
