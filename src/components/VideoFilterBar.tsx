
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
      className="w-full max-w-3xl mx-auto flex flex-col md:flex-row gap-2 mb-3 md:mb-0 items-center justify-between animate-fade-in transition-all"
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex gap-2 w-full">
        <Select value={sortOrder} onValueChange={onSortOrderChange}>
          <SelectTrigger className="w-36 hover-scale focus:scale-105 transition-all duration-100">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50 animate-fade-in">
            {sortOptions.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={region} onValueChange={onRegionChange}>
          <SelectTrigger className="w-36 hover-scale focus:scale-105 transition-all duration-100">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50 animate-fade-in">
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
        className="w-full md:w-auto mt-2 md:mt-0 pulse animate-scale-in"
        disabled={loading}
        variant="outline"
      >
        {loading ? (
          <span className="flex items-center gap-2 animate-pulse">
            <svg className="animate-spin h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Loading...
          </span>
        ) : "Apply Filters"}
      </Button>
    </form>
  );
};

export default VideoFilterBar;
