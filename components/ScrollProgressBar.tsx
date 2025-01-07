// ScrollProgressBar.tsx
'use client';

import { useEffect, useState } from "react";

const ScrollProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const progressBarLeft = {
    width: `${scrollProgress / 2}%`,
    right: "50%",
  };

  const progressBarRight = {
    width: `${scrollProgress / 2}%`,
    left: "50%",
  };

  return (
    <div className="fixed top-0 z-50 w-full h-1">
      <div
        className="absolute h-full bg-indigo-600 transition-all duration-300"
        style={progressBarLeft}
      />
      <div
        className="absolute h-full bg-indigo-600 transition-all duration-300"
        style={progressBarRight}
      />
    </div>
  );
};

export default ScrollProgressBar;
