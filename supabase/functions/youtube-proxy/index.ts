
/**
 * Edge function: youtube-proxy
 * Receives: { term, regionCode, order }
 * Returns: { videos: [...], error?: string }
 * 
 * Expects the secret YOUTUBE_API_KEY to be set in Supabase secrets!
 */
import { serve } from "https://esm.sh/v135/sift@0.6.0/serve";
const API_KEY = Deno.env.get("YOUTUBE_API_KEY");

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Only POST allowed" }), { status: 405 });
  }
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "API Key not configured" }), { status: 500 });
  }
  try {
    const { term, regionCode, order } = await req.json();
    if (!term || !regionCode || !order) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), { status: 400 });
    }
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&q=${encodeURIComponent(
      term
    )}&order=${order}&regionCode=${regionCode}&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    if (searchData.error) {
      return new Response(JSON.stringify({ error: searchData.error.message }), { status: 500 });
    }
    const videosList = searchData.items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      thumbnail: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
    }));
    return new Response(JSON.stringify({ videos: videosList }));
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
});
