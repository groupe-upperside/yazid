'use client';

import Divider from '@/components/Divider';
import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import { useState } from 'react';

/**
 * Props for `VideoAndTextGrid`.
 */
export type VideoAndTextGridProps = SliceComponentProps<Content.VideoAndTextGridSlice>;

/**https://player.vimeo.com/video/990082921
 * Component for "VideoAndTextGrid" Slices.
 */
const VideoAndTextGrid = ({ slice }: VideoAndTextGridProps): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const vimeoEmbedUrl = `${slice.primary.video.embed_url}?controls=0`;
  const autoplayUrl = `${vimeoEmbedUrl}&autoplay=1&volume=0&background=1`;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="p-20 xl:p-32 font-avenir tracking-widest"
    >
      <div className="mx-auto grid max-w-screen-2xl rounded-lg xl:grid-cols-12 gap-12 xl:gap-16">
        <div
          className={`xl:col-span-5 xl:mt-0 order-last min-h-[45rem] ${slice.variation === 'videoRight' ? 'xl:order-last' : 'xl:order-first'}`}
        >
          <div className="relative group size-full">
            <iframe
              id="video-iframe"
              src={isPlaying ? autoplayUrl : vimeoEmbedUrl}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen"
              style={{ pointerEvents: isPlaying ? 'auto' : 'none' }}
              allowFullScreen
            ></iframe>
            {!isPlaying ? (
              <div
                className="absolute top-1/2 left-1/2 bg-white bg-opacity-40 p-6 rounded-full -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                onClick={handlePlay}
              >
                <img
                  src="https://yazid.cdn.prismic.io/yazid/ZqJUex5LeNNTxfmK_play-svgrepo-com-1-.svg"
                  alt="Play"
                  width="64"
                  height="64"
                />
              </div>
            ) : (
              <div
                className="absolute top-1/2 left-1/2 cursor-pointer bg-white bg-opacity-40 p-6 rounded-full -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
                onClick={handlePlay}
              >
                <img
                  src="https://yazid.cdn.prismic.io/yazid/ZqJUPh5LeNNTxfmG_pauze-svgrepo-com-1-.svg"
                  alt="Play"
                  width="64"
                  height="64"
                />
              </div>
            )}
          </div>
        </div>
        <div className="me-auto place-self-center xl:col-span-7">
          {slice.primary.title_light ? (
            <h2 className="mb-3 text-2xl font-medium tracking-widest uppercase xl:text-start text-center text-gray-900 md:text-3xl">
              {slice.primary.title_light}
            </h2>
          ) : null}
          <h2 className="mb-3 text-2xl font-semibold uppercase tracking-widest xl:text-start text-center text-gray-900 md:text-3xl">
            {slice.primary.title}
          </h2>
          <Divider />
          <div className="space-y-6">
            <PrismicRichText
              field={slice.primary.description}
              components={{
                paragraph: ({ children }) => <p className="text-justify tracking-widest text-[#707070]">{children}</p>,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoAndTextGrid;
