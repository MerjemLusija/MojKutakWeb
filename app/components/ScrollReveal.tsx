"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "none";
  className?: string;
  delay?: number;
}

export default function ScrollReveal({
  children,
  direction = "up",
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Optional: stop observing once it's visible, so it only animates once
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it hits the bottom
        threshold: 0, // Trigger as soon as 1 pixel is in the designated area
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Determine the reveal class based on direction
  const revealClass = `reveal-${direction}`;
  
  return (
    <div
      ref={ref}
      className={`reveal ${revealClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
