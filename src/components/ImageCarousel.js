"use client";

import Image from "next/image";
import {
  useEffect,
  useState,
} from "react";

import { motion } from "framer-motion";

export default function ImageCarousel({
  images = [],
}) {
  const [current, setCurrent] =
    useState(0);

  const safeImages =
    Array.isArray(images)
      ? images.filter(Boolean)
      : [];

  useEffect(() => {
    if (safeImages.length <= 1) {
      return;
    }

    const interval =
      setInterval(() => {
        setCurrent((previous) =>
          (previous + 1) %
          safeImages.length
        );
      }, 3000);

    return () =>
      clearInterval(interval);
  }, [safeImages.length]);

  if (safeImages.length === 0) {
    return (
      <div className="flex h-60 w-full items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-400">
        No image available
      </div>
    );
  }

  return (
    <div className="relative h-60 w-full overflow-hidden rounded-2xl">
      {safeImages.map(
        (url, index) => (
          <motion.div
            key={`${url}-${index}`}
            className="absolute inset-0"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity:
                index === current
                  ? 1
                  : 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <Image
              src={url}
              alt={`Order image ${
                index + 1
              }`}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
            />
          </motion.div>
        )
      )}

      {safeImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {safeImages.map(
            (_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show image ${
                  index + 1
                }`}
                onClick={() =>
                  setCurrent(index)
                }
                className={`h-2 rounded-full transition-all ${
                  index === current
                    ? "w-5 bg-white"
                    : "w-2 bg-white/50"
                }`}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}