"use client";

import React, { useState } from "react";

const InputField = ({ label, type = "text", name, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className="relative mb-6 cursor-text" // Ensures the text cursor appears on hover
      onMouseEnter={() => setIsFocused(true)} // Optional: Highlight interaction on hover
      onMouseLeave={() => !value && setIsFocused(false)} // Reset focus when leaving if empty
    >
      <label
        className={`absolute left-0 transition-all duration-500 ease-in-out ${
          isFocused || value
            ? "-top-4 text-xs text-indigo-500"
            : "top-2 text-base text-gray-600"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => !value && setIsFocused(false)} // Reset label position if input is empty
        className="w-full border-b border-gray-500 bg-transparent text-black py-2 focus:outline-none focus:border-indigo-500"
      />
    </div>
  );
};

export default InputField;