
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
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl gap-2 mx-auto mt-8">
      <Input
        type="text"
        placeholder="Enter a topic (e.g. Tesla launch, iPhone review)..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !value.trim()}>
        {loading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
};

export default VideoSearchBar;
