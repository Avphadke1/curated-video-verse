
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VideoSearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const VideoSearchBar: React.FC<VideoSearchBarProps> = ({ onSearch, loading }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSearch(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl gap-2 mx-auto mt-8 animate-fade-in transition-all"
    >
      <Input
        type="text"
        placeholder="Enter a topic (e.g. Tesla launch, iPhone review)..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
        className="transition-shadow duration-150 focus:shadow-lg focus:border-primary/60"
      />
      <Button type="submit" disabled={loading || !value.trim()} className="pulse transition-all animate-scale-in">
        {loading ? (
          <span className="flex items-center gap-2 animate-pulse">
            <svg className="animate-spin h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Searching...
          </span>
        ) : (
          "Search"
        )}
      </Button>
    </form>
  );
};

export default VideoSearchBar;
