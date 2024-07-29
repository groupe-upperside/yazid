'use client';

import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { useEffect, useState } from 'react';

/**
 * Props for `ImageSlider`.
 */
export type ImageSliderProps = SliceComponentProps<Content.ImageSliderSlice>;

/**
 * Component for "ImageSlider" Slices.
 */
const ImageSlider = ({ slice }: ImageSliderProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = slice.primary.image;

  useEffect(() => {
    if (slice.primary.auto_slide) {
      const interval = setInterval(
        () => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        },
        (slice.primary.auto_slide_delay_ms as number) ?? 3000
      );
      return () => clearInterval(interval);
    }
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div id="custom-controls-gallery" className="relative w-full" data-carousel="slide">
        <div className="relative h-72 overflow-hidden xl:h-[33rem]">
          {slice.primary.image.map((item, index) => (
            <div
              className={`absolute inset-0 w-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
              data-carousel-item
              key={index}
            >
              <PrismicNextImage
                className="absolute left-1/2 top-1/2 block size-full -translate-x-1/2 -translate-y-1/2 object-cover"
                field={item.image}
              />
            </div>
          ))}
        </div>
        {slice.primary.display_buttons ? (
          <div className="flex items-center justify-center pt-4">
            <button
              type="button"
              onClick={goToPrevious}
              className="group me-4 flex h-full cursor-pointer items-center justify-center focus:outline-none"
              data-carousel-prev
            >
              <span className="text-gray-400 hover:text-gray-900 group-focus:text-gray-900 dark:hover:text-white dark:group-focus:text-white">
                <svg
                  className="size-5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 5H1m0 0 4 4M1 5l4-4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="group flex h-full cursor-pointer items-center justify-center focus:outline-none"
              data-carousel-next
            >
              <span className="text-gray-400 hover:text-gray-900 group-focus:text-gray-900 dark:hover:text-white dark:group-focus:text-white">
                <svg
                  className="size-5 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 5h12m0 0L9 1m4 4L9 9"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ImageSlider;
