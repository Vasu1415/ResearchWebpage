import React from "react";

export function GenreSelect({ genres, value, onChange }) {
  return (
    <div className="mb-4">
      <label
        htmlFor="genre-select"
        className="block text-black font-bold mb-2"
      >
        Select Genre
      </label>
      <select
        id="genre-select"
        className="w-full bg-transparent border font-semibold border-black rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Choose a genre...
        </option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}
