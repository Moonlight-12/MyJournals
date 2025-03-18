"use client";

import { EffectCards, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { RecentJournalCard } from "./recent-journal-card";
import { cn } from "@/utils/cn";

export function RecentCarousel({
  className,
  data,
}: {
  className?: string;
  data: {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
    isFavourite: boolean;
  }[];
}) {
  return (
    <Swiper
      className={cn(" mx-auto px-4 w-full max-w-screen-xl !py-8 !pb-8", className)}
      modules={[Scrollbar, EffectCards]}
      grabCursor={true}
      scrollbar={{
        draggable: true,
        horizontalClass: "scrollbar-recent",
        snapOnRelease: true,
      }}
      effect="cards"
      cardsEffect={{
        perSlideOffset: 8,
        perSlideRotate: 2,
        rotate: true,
        slideShadows: false,
      }}
      centeredSlides={true}
      
    >
      {data.map((item) => (
        <SwiperSlide key={item._id} className="!flex !justify-center !items-center">
          <RecentJournalCard {...item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
