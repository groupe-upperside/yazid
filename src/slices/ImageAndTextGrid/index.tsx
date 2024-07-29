import Button from '@/components/Button';
import Divider from '@/components/Divider';
import { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';

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
      className="p-20 xl:p-32 font-avenir tracking-widest"
    >
      <div className="mx-auto grid max-w-screen-2xl rounded-lg xl:grid-cols-12 gap-12 xl:gap-16">
        <div
          className={`xl:col-span-5 xl:mt-0 order-last ${slice.variation === 'imageRight' ? 'xl:order-last' : 'xl:order-first'}`}
        >
          {slice.primary.image_2.url ? (
            <div className="flex flex-row gap-x-4 xl:w-full lg:w-2/3 md:w-3/4 w-full mx-auto">
              <div className="w-1/2">
                <PrismicNextImage field={slice.primary.image} className="w-full object-cover mb-20" />
              </div>
              <div className="w-1/2">
                <PrismicNextImage field={slice.primary.image_2} className="w-full object-cover mt-20" />
              </div>
            </div>
          ) : (
            <PrismicNextImage field={slice.primary.image} className="w-3/4 mx-auto object-cover" />
          )}
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
