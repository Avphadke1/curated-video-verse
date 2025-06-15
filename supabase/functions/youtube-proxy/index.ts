
// Use Deno std/http serve and CORS headers
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const API_KEY = Deno.env.get("YOUTUBE_API_KEY");

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST allowed" }), {
      status: 405, headers: corsHeaders,
    });
  }
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "API Key not configured" }), {
      status: 500, headers: corsHeaders,
    });
  }
  try {
    const { term, regionCode, order } = await req.json();
    if (!term || !regionCode || !order) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400, headers: corsHeaders,
      });
    }
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&q=${encodeURIComponent(
      term
    )}&order=${order}&regionCode=${regionCode}&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    if (searchData.error) {
      return new Response(JSON.stringify({ error: searchData.error.message }), {
        status: 500, headers: corsHeaders,
      });
    }
    const videosList = searchData.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
    }));
    return new Response(JSON.stringify({ videos: videosList }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Edge Function Error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: corsHeaders,
    });
  }
});

