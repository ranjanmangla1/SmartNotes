import React, { useState, useEffect } from 'react';

const Scrollbar = ({ children }) => {
  const [scrolledDown, setScrolledDown] = useState(false);

  // Function to handle scroll events
  const handleScroll = () => {
    // Check if the user has scrolled down (you can adjust the threshold)
    if (window.scrollY > 20) {
      setScrolledDown(true);
    } else {
      setScrolledDown(false);
    }
  };

  // Attach the scroll event listener when the component mounts
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`app-wrapper ${scrolledDown ? 'show-scrollbar' : ''}`}>
      {children}
    </div>
  );
};

export default Scrollbar;
