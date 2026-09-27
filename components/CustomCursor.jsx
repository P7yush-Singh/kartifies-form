"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useLayoutEffect(() => {
    // Don't enable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    const moveX = gsap.quickTo(dot, "x", {
      duration: 0.12,
      ease: "power3.out",
    });

    const moveY = gsap.quickTo(dot, "y", {
      duration: 0.12,
      ease: "power3.out",
    });

    const ringX = gsap.quickTo(ring, "x", {
      duration: 0.45,
      ease: "power3.out",
    });

    const ringY = gsap.quickTo(ring, "y", {
      duration: 0.45,
      ease: "power3.out",
    });

    function handleMove(event) {
      moveX(event.clientX);
      moveY(event.clientY);

      ringX(event.clientX);
      ringY(event.clientY);
    }

    function handleOver(event) {
      const target = event.target.closest(
        "button, a, input, textarea, select, [data-cursor]"
      );

      if (target) {
        gsap.to(ring, {
          scale: 1.8,
          opacity: 0.8,
          duration: 0.25,
          ease: "power2.out",
        });

        gsap.to(dot, {
          scale: 0.5,
          duration: 0.2,
        });
      }
    }

    function handleOut(event) {
      const target = event.target.closest(
        "button, a, input, textarea, select, [data-cursor]"
      );

      if (target) {
        gsap.to(ring, {
          scale: 1,
          opacity: 0.45,
          duration: 0.25,
          ease: "power2.out",
        });

        gsap.to(dot, {
          scale: 1,
          duration: 0.2,
        });
      }
    }

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    document.body.classList.add("kartifies-custom-cursor");

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);

      document.body.classList.remove("kartifies-custom-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
      />

      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 opacity-45 mix-blend-difference"
      />

      <style jsx global>{`
        @media (pointer: fine) {
          body.kartifies-custom-cursor,
          body.kartifies-custom-cursor * {
            cursor: none !important;
          }
        }

        @media (pointer: coarse) {
          .kartifies-custom-cursor {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}