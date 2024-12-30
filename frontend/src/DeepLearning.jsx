import React, { useState, useEffect } from "react";
import { Music, Radio, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GenreSelect } from "./GenreSelect";
import { SongSelect } from "./SongSelect";
import { RecommendationCard } from "./RecommendationCard";

export default function DeepLearning() {
  // Static genre array
  const genreArr = [
    "blues",
    "classical",
    "jazz",
    "reggae",
    "country",
    "rock",
    "metal",
    "disco",
    "hiphop",
    "pop",
  ];

  // State variables
  const [genres] = useState(genreArr);
  const [selectedGenre, setSelectedGenre] = useState(genreArr[0]);
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch songs for the selected genre
  const handleGenreChange = async (genre) => {
    setSelectedGenre(genre);
    setSelectedSong("");
    setSongs([]);
    setError("");

    try {
      const response = await fetch(`/api/genre/${genre}/songs`);
      if (!response.ok) {
        throw new Error("Failed to fetch songs for the selected genre");
      }
      const data = await response.json();
      setSongs(data.songs || []); // API returns an array of songs
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("Unable to load songs. Please try again later.");
    }
  };

  // Fetch songs for the default genre on component mount
  useEffect(() => {
    handleGenreChange(selectedGenre);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle generating recommendations
  const handleGenerateRecommendations = async () => {
    if (!selectedSong) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audio_path: selectedSong }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations || []); // API returns file_name and link
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Unable to fetch recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center mb-4"
        >
          <Music className="w-12 h-12 text-black mr-4" />
          <h1 className="text-4xl font-bold text-black">
            Live Song Recommendations!
          </h1>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center font-semibold text-black mb-12"
        >
          You can test our model yourself! The current recommendations and
          genres are based on the GTZAN dataset, which we used to train our
          model. Work is in progress to change and spice things up even more!
        </motion.p>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto mb-6 bg-red-100 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Genre and Song Selection */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-gray-100 rounded-xl p-8 shadow-lg border border-black text-black"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <GenreSelect
              genres={genres}
              value={selectedGenre}
              onChange={handleGenreChange}
            />
            <SongSelect
              files={songs}
              value={selectedSong}
              onChange={setSelectedSong}
              disabled={!selectedGenre}
            />
          </div>

          {/* Generate Recommendations Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerateRecommendations}
            disabled={!selectedGenre || !selectedSong || loading}
            className="w-full bg-black text-white font-bold py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" /> Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Radio className="mr-2" /> Get Recommendations
              </span>
            )}
          </motion.button>
        </motion.div>

        {/* Recommendations Display */}
        <AnimatePresence>
          {recommendations.length > 0 && (
            <>
              {/* First Recommendation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-12 max-w-3xl mx-auto"
              >
                <RecommendationCard
                  recommendation={recommendations[0]}
                  index={0}
                  label="Your Selected Audio Clip"
                />
              </motion.div>

              {/* Other Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {recommendations.slice(1).map((rec, index) => (
                  <RecommendationCard
                    key={index + 1}
                    recommendation={rec}
                    index={index + 1}
                    label={`Recommendation ${index + 1}`}
                  />
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
