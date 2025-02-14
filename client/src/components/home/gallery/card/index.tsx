"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface CardProps {
  image: string;
  title: string;
  content: string;
  id: string;
}

const Card: React.FC<CardProps> = ({ image, title, content, id }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/journal/${id}`);
  };

  return (
    <motion.div
      className="relative overflow-hidden h-[300px] min-w-[300px] bg-slate-400 rounded-xl flex justify-center items-center"
      onHoverStart={() => setShowOverlay(true)}
      onHoverEnd={() => setShowOverlay(false)}
      // onClick={handleClick}
    >
      <Image src={image} alt={image} fill style={{ objectFit: "cover" }} />

      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-2">
        <p className="text-white font-bold text-sm truncate">{title}</p>
      </div>

    
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            className="absolute inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <motion.p className="text-white text-sm overflow-hidden text-ellipsis">
              {content}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Card;
