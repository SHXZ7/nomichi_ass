"use client";

import { useEffect, useRef, useState } from "react";

export default function ParallaxScroll({ children, speed = 0.12 }) {
  const containerRef = useRef(null);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Disable on mobile/tablet screens to prevent layout issues
      if (window.innerWidth < 1024) {
        setTranslateY(0);
        return;
      }

      const element = containerRef.current;
      if (!element) return;

      const parent = element.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      const elementHeight = element.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Check if the parent container is in the viewport
      if (parentRect.top < viewportHeight && parentRect.bottom > 0) {
        // Calculate dynamic translation based on scrolling position
        let translation = (viewportHeight - parentRect.top) * speed;
        
        // The maximum translation is the height of the parent minus the height of this element
        const maxTranslation = Math.max(0, parentRect.height - elementHeight);
        
        // Clamp it to make sure it doesn't overflow the container
        translation = Math.max(0, Math.min(translation, maxTranslation));
        
        setTranslateY(translation);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    
    // Run initially
    handleScroll();

    // Trigger after a brief timeout to let dynamic heights settle
    const timeoutId = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      style={{ transform: `translateY(${translateY}px)` }}
      className="will-change-transform transition-transform duration-100 ease-out"
    >
      {children}
    </div>
  );
}
