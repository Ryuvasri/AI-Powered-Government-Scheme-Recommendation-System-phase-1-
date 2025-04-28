import React, { useState } from "react";
import "./LanguageSelection.css";

const LanguageSelection = () => {
  const [language, setLanguage] = useState("English");

  return (
    <select
      className="language-selector"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    >
      <option>English</option>
      <option>Hindi</option>
      <option>Tamil</option>
      <option>Telugu</option>
    </select>
  );
};

export default LanguageSelection;

