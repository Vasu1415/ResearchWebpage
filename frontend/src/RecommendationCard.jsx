import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react"; // Icons for Play and Pause

export function RecommendationCard({ recommendation, index, label }) {
  const [isPlaying, setIsPlaying] = useState(false); // Track audio playback state
  const audioRef = React.useRef(null); // Reference to the audio element

  // Handle play/pause functionality
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="bg-white text-black rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
    >
      {/* Card Label */}
      {label && <p className="text-gray-700 font-semibold mb-4">{label}</p>}

      {/* Card Content */}
      <div className="flex flex-col space-y-4">
        {/* Audio Name */}
        <h3 className="text-lg font-bold text-black">{recommendation.file_name}</h3>

        {/* Play/Pause Button */}
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlayback}
            className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-900 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" /> // Pause icon when playing
            ) : (
              <Play className="w-5 h-5" /> // Play icon when paused
            )}
          </button>
          <p className="text-sm text-gray-500">Click to {isPlaying ? "pause" : "play"} the audio</p>
        </div>

        {/* Single Audio Player */}
        <audio type="audio/wav" ref={audioRef} src={recommendation.link} />
      </div>
    </motion.div>
  );
}