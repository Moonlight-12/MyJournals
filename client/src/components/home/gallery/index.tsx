"use client";

import { animate, useMotionValue } from "framer-motion";
import Card from "./card";
import useMeasure from "react-use-measure";
import { useEffect, useState, useRef } from "react"; 
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { GetFavourite } from "../../../app/api/get-favourites";

interface Journal {
  _id: string;
  title: string;
  content: string;
}

export default function GalleryView() {
  const images = ["/image11.jpg", "/image10.jpg", "/image9.jpg"];

  const FAST_DURATION = 15;
  const SLOW_DURATION = 10000000;

  const [duration, setDuration] = useState(FAST_DURATION);
  let [ref, { width }] = useMeasure();
  const xTranslation = useMotionValue(0);
  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);

  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Journal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const animationEnabled = favorites.length > 2;

  useEffect(() => {
    async function fetchFavorites() {
      if (session?.user?.id) {
        try {
          const data: Journal[] = await GetFavourite(session.user.id);
          setFavorites(data);
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchFavorites();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!animationEnabled) {
      return;
    }

    let controls;
    let finalPosition = -width / 2 - 8;

    if (mustFinish) {
      controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
        ease: "linear",
        duration: duration * (1 - xTranslation.get() / finalPosition),
        onComplete: () => {
          setMustFinish(false);
          setRerender(!rerender);
        },
      });
    } else {
      controls = animate(xTranslation, [0, finalPosition], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
      });
    }

    return controls?.stop;
  }, [xTranslation, width, duration, rerender, animationEnabled]);

  return (
    <>
      {isLoading ? (
        <div>Loading favorites...</div>
      ) : (
        <div className="relative overflow-hidden w-full px-0 rounded-md">
          {animationEnabled ? (
            <motion.div
              className="flex gap-4 w-max ml-0"
              ref={ref}
              style={{ x: xTranslation }}
              onHoverStart={() => {
                setMustFinish(true);
                setDuration(SLOW_DURATION);
              }}
              onHoverEnd={() => {
                setMustFinish(true);
                setDuration(FAST_DURATION);
              }}
            >
              {[...favorites, ...favorites].map((journal, idx) => {
                let imageIndex;
                if (favorites.length === 1) {
                  imageIndex = 0;
                } else {
                  imageIndex = idx % images.length;
                }
                return (
                  <Card
                    key={`${journal._id}-${idx}`}
                    image={images[imageIndex]}
                    title={journal.title}
                    content={journal.content}
                    id={journal._id}
                  />
                );
              })}
            </motion.div>
          ) : (
            <div className="flex gap-4 w-max ml-5">
              {favorites.map((journal, idx) => {
                let imageIndex;
                if (favorites.length === 1) {
                  imageIndex = 0;
                } else {
                  imageIndex = idx % images.length;
                }
                return (
                  <Card
                    key={`${journal._id}-${idx}`}
                    image={images[imageIndex]}
                    title={journal.title}
                    content={journal.content}
                    id={journal._id}
                  />
                );
              })}
            </div>
          )}

          {animationEnabled && (
            <>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 opacity-70" />

              <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 opacity-70" />
            </>
          )}
        </div>
      )}
    </>
  );
}
