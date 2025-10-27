import { useEffect, useState } from "react";
import { recommendationService } from "../services/recommendationService";
import SongList from "../components/songs/SongList";
import { Sparkles, TrendingUp, Music } from "lucide-react";

const ForYouPage = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const [recommendedSongs, trendingSongs] = await Promise.all([
        recommendationService.getRecommendations(20),
        recommendationService.getTrendingSongs(10),
      ]);
      setRecommendations(recommendedSongs);
      setTrending(trendingSongs);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Sparkles className="text-primary" size={32} />
          <h1 className="text-4xl font-bold">For You</h1>
        </div>
        <p className="text-gray-400">
          Personalized recommendations based on your listening history
        </p>
      </div>

      {/* Recommended Songs */}
      {recommendations.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <Music className="text-primary" size={24} />
            <h2 className="text-2xl font-bold">Recommended for You</h2>
          </div>
          <SongList songs={recommendations} />
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="text-primary" size={24} />
            <h2 className="text-2xl font-bold">Trending Now</h2>
          </div>
          <SongList songs={trending} />
        </section>
      )}

      {/* Empty State */}
      {recommendations.length === 0 && trending.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="text-gray-600 mx-auto mb-4" size={64} />
          <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            Start listening to songs to get personalized recommendations based
            on your taste!
          </p>
        </div>
      )}
    </div>
  );
};

export default ForYouPage;
