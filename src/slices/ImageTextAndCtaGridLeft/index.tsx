import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

import Button from '@/components/Button';
import Divider from '@/components/Divider';

/**
 * Props for `ImageTextAndCtaGridLeft`.
 */
export type ImageTextAndCtaGridLeftProps = SliceComponentProps<Content.ImageTextAndCtaGridLeftSlice>;

/**
 * Component for "ImageTextAndCtaGridLeft" Slices.
 */
const ImageTextAndCtaGridLeft = ({ slice }: ImageTextAndCtaGridLeftProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="p-20 font-avenir tracking-widest xl:p-32"
    >
      <div className="mx-auto grid max-w-screen-2xl gap-12 rounded-lg xl:grid-cols-12 xl:gap-16">
        <div className="order-last xl:order-first xl:col-span-5 xl:mt-0">
          <div className="mx-auto flex w-full flex-row gap-x-4 md:w-3/4 lg:w-2/3 xl:w-full">
            <div className="w-1/2">
              <PrismicNextImage field={slice.primary.image} className="mb-20 w-full object-cover" />
            </div>
            <div className="w-1/2">
              <PrismicNextImage field={slice.primary.image_2} className="mt-20 w-full object-cover" />
            </div>
          </div>
        </div>
        <div className="me-auto place-self-center xl:col-span-7">
          <h2 className="mb-3 text-center text-2xl font-medium uppercase tracking-widest text-gray-900 md:text-3xl xl:text-start">
            {slice.primary.title_light}
          </h2>
          <h2 className="mb-3 text-center text-2xl font-semibold uppercase  tracking-widest text-gray-900 md:text-3xl xl:text-start">
            {slice.primary.title}
          </h2>
          <Divider />
          <div className="space-y-6">
            <PrismicRichText
              field={slice.primary.description}
              components={{
                paragraph: ({ children }) => <p className="text-justify tracking-widest text-[#707070]">{children}</p>,
                list: ({ children }) => (
                  <ul className="list-inside list-disc tracking-widest text-[#707070]">{children}</ul>
                ),
              }}
            />
          </div>
          <div className="mt-10 grid grid-cols-2">
            {slice.primary.card.map((card, index) => (
              <div key={index} className="flex flex-col gap-4 ">
                <hr className="border-0.5 h-0.5 w-12 border-black" />
                <h2 className="text-xl font-semibold uppercase tracking-widest text-gray-900">{card.title}</h2>
                <p className="text-justify tracking-widest text-[#707070]">{card.subtitle}</p>
                <div className="w-fit">
                  <Button link={card.link} label={card.link_label} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextAndCtaGridLeft;
