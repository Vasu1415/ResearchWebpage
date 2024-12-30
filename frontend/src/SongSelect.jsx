import React from "react";

export function SongSelect({ files, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-black font-bold mb-2">Select Song</label>
      <select
        className={`w-full bg-white font-semibold text-black border border-black rounded-lg p-3 ${
          disabled ? "cursor-not-allowed" : ""
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" className="text-black font-semibold">Choose a song...</option>
        {files.map((file) => (
          <option key={file} value={file} className="text-black">
            {file}
          </option>
        ))}
      </select>
    </div>
  );
}

