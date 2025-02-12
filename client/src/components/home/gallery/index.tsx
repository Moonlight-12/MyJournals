"use client";

import { animate, useMotionValue } from "framer-motion";
import Card from "./card";
import useMeasure from "react-use-measure";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function GalleryView() {
  const images = [
    "/image1.jpg",
    "/image2.jpg",
    "/image3.jpg",
    "/image4.jpg",
    "/image5.jpg",
    "/image6.jpg",
    "/image7.jpg",
    "/image8.jpg",
  ];

  const FAST_DURATION = 25;
  const SLOW_DURATION = 75;

  const [duration, setDuration] = useState(FAST_DURATION);

  let [ref, { width }] = useMeasure();

  const xTranslation = useMotionValue(0);

  const [mustFinish, setMustFinish] = useState(false);
  const [rerender, setRerender] = useState(false);



  useEffect(() => {
    let controls;
    let finalPosition = (-width / 2) - 8;

    if(mustFinish){
      controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
        ease: "linear",
        duration: duration * (1-xTranslation.get()/finalPosition),
        onComplete: () => {
          setMustFinish(false);
          setRerender(!rerender);
        },
      });
      
    }else{
      controls = animate(xTranslation, [0, finalPosition], {
        ease: "linear",
        duration: duration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
      });
    }

    

    return controls?.stop;
  }, [xTranslation, width, duration, rerender]);
  return (
    <>
      <div className="relative overflow-hidden w-[600px] px-0 rounded-md">
        <motion.div
          className="flex gap-4 w-max ml-0"
          ref={ref}
          style={{ x: xTranslation }}
          onHoverStart={() => {
            setMustFinish(true);
            setDuration(SLOW_DURATION);
            
          }}
          onHoverEnd={() => {setMustFinish(true);
            setDuration(FAST_DURATION);}}
        >
          {[...images, ...images].map((item, idx) => (
            <Card image={item} key={idx} />
          ))}
        </motion.div>

        {/* Left fade overlay: fades from white to transparent. Adjust color as needed. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 opacity-70" />
        {/* Right fade overlay: fades from white to transparent. Adjust color as needed. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 opacity-70 " />
      </div>
    </>
  );
}
