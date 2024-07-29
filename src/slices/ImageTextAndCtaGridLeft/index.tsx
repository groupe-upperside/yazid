import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
import Divider from '@/components/Divider';
import { PrismicNextImage } from '@prismicio/next';
import Button from '@/components/Button';

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
      className="p-20 xl:p-32 font-avenir tracking-widest"
    >
      <div className="mx-auto grid max-w-screen-2xl rounded-lg xl:grid-cols-12 gap-12 xl:gap-16">
        <div className="xl:col-span-5 xl:mt-0 order-last xl:order-first">
          <div className="flex flex-row gap-x-4 xl:w-full lg:w-2/3 md:w-3/4 w-full mx-auto">
            <div className="w-1/2">
              <PrismicNextImage field={slice.primary.image} className="w-full object-cover mb-20" />
            </div>
            <div className="w-1/2">
              <PrismicNextImage field={slice.primary.image_2} className="w-full object-cover mt-20" />
            </div>
          </div>
        </div>
        <div className="me-auto place-self-center xl:col-span-7">
          <h2 className="mb-3 text-2xl font-medium tracking-widest uppercase xl:text-start text-center text-gray-900 md:text-3xl">
            {slice.primary.title_light}
          </h2>
          <h2 className="mb-3 text-2xl font-semibold uppercase tracking-widest  xl:text-start text-center text-gray-900 md:text-3xl">
            {slice.primary.title}
          </h2>
          <Divider />
          <div className="space-y-6">
            <PrismicRichText
              field={slice.primary.description}
              components={{
                paragraph: ({ children }) => <p className="text-justify tracking-widest text-[#707070]">{children}</p>,
                list: ({ children }) => (
                  <ul className="list-disc list-inside tracking-widest text-[#707070]">{children}</ul>
                ),
              }}
            />
          </div>
          <div className="grid grid-cols-2 mt-10">
            {slice.primary.card.map((card, index) => (
              <div key={index} className="flex flex-col gap-4 ">
                <hr className="w-12 border-black h-0.5 border-0.5" />
                <h2 className="text-xl tracking-widest font-semibold uppercase text-gray-900">{card.title}</h2>
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
