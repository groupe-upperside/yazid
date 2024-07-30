import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

import Button from '@/components/Button';
import Divider from '@/components/Divider';
import SectionTitle from '@/components/SectionTitle';

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
      className="p-12 font-avenir tracking-widest md:p-20 xl:p-32"
    >
      <div className="mx-auto grid max-w-screen-2xl gap-12 rounded-lg xl:grid-cols-12 xl:gap-16">
        <div
          className={`order-last hidden h-full xl:col-span-5 xl:mt-0 xl:block ${slice.variation === 'imageRight' ? 'xl:order-last' : 'xl:order-first'}`}
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
            <div className="flex h-full items-center justify-center">
              <PrismicNextImage field={slice.primary.image} className="w-3/4 object-cover" />
            </div>
          )}
        </div>
        <div className="me-auto place-self-center xl:col-span-7">
          {slice.primary.title_light ? <SectionTitle text={slice.primary.title_light} /> : null}
          <SectionTitle text={slice.primary.title} bold={true} />
          <Divider />
          <div className="hidden space-y-6 xl:block">
            <PrismicRichText
              field={slice.primary.description}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
                ),
              }}
            />
          </div>
          <div className="block space-y-6 xl:hidden">
            <PrismicRichText
              field={slice.primary.mobile_description_top}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
                ),
              }}
            />
          </div>
          <div
            className={`order-last block py-16 xl:col-span-5 xl:mt-0 xl:hidden ${slice.variation === 'imageRight' ? 'xl:order-last' : 'xl:order-first'}`}
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
              <PrismicNextImage field={slice.primary.image} className="mx-auto w-full object-cover px-4 md:w-1/2" />
            )}
          </div>
          <div className="block space-y-6 xl:hidden">
            <PrismicRichText
              field={slice.primary.mobile_description_bottom}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
                ),
              }}
            />
          </div>
          {slice.primary.link_label ? (
            <div className="mx-auto w-fit xl:mx-0">
              <Button link={slice.primary.link} label={slice.primary.link_label} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ImageLeftAndTextGrid;
