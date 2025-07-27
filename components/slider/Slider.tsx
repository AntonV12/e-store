import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import "./slider.css";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/scrollbar";

import { FreeMode, Navigation, Thumbs, Mousewheel, Scrollbar } from "swiper/modules";

interface SliderProps {
  images: string[];
  isImagesChanged: boolean;
}

export default function Slider({ images, isImagesChanged }: SliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [direction, setDirection] = useState<"horizontal" | "vertical">("vertical");

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 890) {
          setDirection("vertical");
        } else {
          setDirection("horizontal");
        }
      }
    });

    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <>
      <Swiper
        onSwiper={(swiper) => setThumbsSwiper(swiper)}
        direction={direction}
        spaceBetween={10}
        slidesPerView={3}
        freeMode={true}
        watchSlidesProgress={true}
        mousewheel={{ enabled: true, forceToAxis: true }}
        scrollbar={{ draggable: true }}
        modules={[FreeMode, Navigation, Thumbs, Mousewheel, Scrollbar]}
        className="mySwiper"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <Image
              src={`${isImagesChanged ? image : `/api/image?name=${image}`}`}
              alt="image"
              fill
              priority
              sizes="100%"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        loop={true}
        slidesPerView={1}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <Image
              src={`${isImagesChanged ? image : `/api/image?name=${image}`}`}
              alt="image"
              fill
              priority
              sizes="100%"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
