
import React from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface VideoFilterBarProps {
  sortOrder: string;
  onSortOrderChange: (sort: string) => void;
  region: string;
  onRegionChange: (region: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const regionOptions = [
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "JP", name: "Japan" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "RU", name: "Russia" },
  { code: "BR", name: "Brazil" },
  { code: "KR", name: "South Korea" },
  { code: "CA", name: "Canada" },
];

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "date", label: "Upload Date" },
  { value: "viewCount", label: "View Count" },
];

const VideoFilterBar: React.FC<VideoFilterBarProps> = ({
  sortOrder,
  onSortOrderChange,
  region,
  onRegionChange,
  onSubmit,
  loading,
}) => {
  return (
    <form
      className="w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-2 mb-3 md:mb-0 items-center justify-between"
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex gap-2 w-full">
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={region} onValueChange={onRegionChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            {regionOptions.map(opt => (
              <SelectItem key={opt.code} value={opt.code}>
                {opt.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        className="w-full md:w-auto mt-2 md:mt-0"
        disabled={loading}
        variant="outline"
      >
        {loading ? "Loading..." : "Apply Filters"}
      </Button>
    </form>
  );
};

export default VideoFilterBar;
