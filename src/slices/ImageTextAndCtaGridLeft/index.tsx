import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

import Button from '@/components/Button';
import Divider from '@/components/Divider';
import SectionTitle from '@/components/SectionTitle';

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
      className="p-6 font-avenir tracking-widest md:p-20 xl:p-32"
    >
      <div className="mx-auto grid max-w-screen-2xl gap-12 rounded-lg xl:grid-cols-12 xl:gap-16">
        <div className="order-last hidden xl:order-first xl:col-span-5 xl:mt-0 xl:flex">
          <div className="mx-auto hidden w-full flex-row gap-x-4 md:w-3/4 lg:w-2/3 xl:flex xl:w-full">
            <div className="w-1/2">
              <PrismicNextImage field={slice.primary.image} className="mb-20 w-full object-cover" />
            </div>
            <div className="w-1/2">
              <PrismicNextImage field={slice.primary.image_2} className="mt-20 w-full object-cover" />
            </div>
          </div>
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
                  <p className="text-justify text-sm  tracking-widest text-[#707070] md:text-base">{children}</p>
                ),
                list: ({ children }) => (
                  <ul className="list-inside list-disc text-sm tracking-widest text-[#707070] md:text-base">
                    {children}
                  </ul>
                ),
              }}
            />
          </div>
          <div className="block space-y-6 xl:hidden">
            <PrismicRichText
              field={slice.primary.mobile_description_top}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-justify text-sm  tracking-widest text-[#707070] md:text-base">{children}</p>
                ),
                list: ({ children }) => (
                  <ul className="list-inside list-disc text-sm tracking-widest text-[#707070] md:text-base">
                    {children}
                  </ul>
                ),
              }}
            />
          </div>
          <div className="order-last flex py-16 xl:order-first xl:col-span-5 xl:mt-0 xl:hidden">
            <div className="mx-auto flex w-full flex-row gap-x-4 md:w-3/4 lg:w-2/3 xl:hidden xl:w-full">
              <div className="w-1/2">
                <PrismicNextImage field={slice.primary.image} className="mb-20 w-full object-cover" />
              </div>
              <div className="w-1/2">
                <PrismicNextImage field={slice.primary.image_2} className="mt-20 w-full object-cover" />
              </div>
            </div>
          </div>
          <div className="block space-y-6 xl:hidden">
            <PrismicRichText
              field={slice.primary.mobile_description_bottom}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
                ),
                list: ({ children }) => (
                  <ul className="list-inside list-disc text-sm tracking-widest text-[#707070] md:text-base">
                    {children}
                  </ul>
                ),
              }}
            />
          </div>
          <div className="mt-16 grid grid-cols-1 gap-y-16 md:grid-cols-2">
            {slice.primary.card.map((card, index) => (
              <div
                key={index}
                className={`flex flex-col items-center justify-between gap-4 md:items-start ${slice.primary.card.length === 1 ? 'col-span-2 xl:col-span-1 xl:mx-0' : ''}`}
              >
                {card.title && (
                  <>
                    <hr className="border-0.5 h-0.5 w-12 border-black" />
                    <h3 className="text-center text-xl font-semibold uppercase tracking-widest text-gray-900 md:text-start">
                      {card.title}
                    </h3>
                  </>
                )}
                {card.subtitle && (
                  <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{card.subtitle}</p>
                )}
                <div className="w-fit">
                  <Button
                    link={card.link}
                    label={card.link_label}
                    dark={!!card?.link_dark}
                    link2_zenchef={!!card?.link_2_zenchef}
                  />
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
