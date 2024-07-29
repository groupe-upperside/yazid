import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

import Button from '@/components/Button';
import Divider from '@/components/Divider';

/**
 * Props for `ImageLeftAndTextGrid`.
 */
export type ImageLeftAndTextGridProps = SliceComponentProps<Content.ImageLeftAndTextGridSlice>;

/**
 * Component for "ImageLeftAndTextGrid" Slices.
 */
const ImageLeftAndTextGrid = ({ slice }: ImageLeftAndTextGridProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="p-20 font-avenir tracking-widest xl:p-32"
    >
      <div className="mx-auto grid max-w-screen-2xl gap-12 rounded-lg xl:grid-cols-12 xl:gap-16">
        <div
          className={`order-last xl:col-span-5 xl:mt-0 ${slice.variation === 'imageRight' ? 'xl:order-last' : 'xl:order-first'}`}
        >
          {slice.primary.image_2.url ? (
            <div className="mx-auto flex w-full flex-row gap-x-4 md:w-3/4 lg:w-2/3 xl:w-full">
              <div className="w-1/2">
                <PrismicNextImage field={slice.primary.image} className="mb-20 w-full object-cover" />
              </div>
              <div className="w-1/2">
                <PrismicNextImage field={slice.primary.image_2} className="mt-20 w-full object-cover" />
              </div>
            </div>
          ) : (
            <PrismicNextImage field={slice.primary.image} className="mx-auto w-3/4 object-cover" />
          )}
        </div>
        <div className="me-auto place-self-center xl:col-span-7">
          {slice.primary.title_light ? (
            <h2 className="mb-3 text-center text-2xl font-medium uppercase tracking-widest text-gray-900 md:text-3xl xl:text-start">
              {slice.primary.title_light}
            </h2>
          ) : null}
          <h2 className="mb-3 text-center text-2xl font-semibold uppercase tracking-widest text-gray-900 md:text-3xl xl:text-start">
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
          {slice.primary.link_label ? (
            <div className="w-fit">
              <Button link={slice.primary.link} label={slice.primary.link_label} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ImageLeftAndTextGrid;
