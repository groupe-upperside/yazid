import { type Content, isFilled } from '@prismicio/client';
import { SliceComponentProps, PrismicRichText } from '@prismicio/react';
import { PrismicNextLink, PrismicNextImage } from '@prismicio/next';
import Divider from '@/components/Divider';

export type CustomerLogosProps = SliceComponentProps<Content.CustomerLogosSlice>;

const CustomerLogos = ({ slice }: CustomerLogosProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="p-20 xl:p-32 font-avenir tracking-widest bg-[#F7F4EF]"
    >
      <div className="w-full">
        <div className="flex justify-center items-center flex-col w-full">
          {slice.primary.title_light ? (
            <h2 className="mb-3 text-2xl font-medium tracking-widest uppercase xl:text-start text-center text-gray-900 md:text-3xl">
              {slice.primary.title_light}
            </h2>
          ) : null}
          <h2 className="mb-3 text-2xl font-semibold uppercase tracking-widest xl:text-start text-center text-gray-900 md:text-3xl">
            {slice.primary.title_bold}
          </h2>
          <Divider />
        </div>
        {slice.primary.logos.length > 0 && (
          <ul className="flex flex-row justify-between items-center w-full">
            {slice.primary.logos.map(
              (logo) =>
                isFilled.image(logo.image) && (
                  <li key={logo.image.url} className="es-customer-logos__logo">
                    <PrismicNextLink field={logo.link}>
                      <PrismicNextImage
                        field={logo.image}
                        height={26}
                        width={160}
                        className="es-customer-logos__logo__link__image"
                      />
                    </PrismicNextLink>
                  </li>
                )
            )}
          </ul>
        )}
      </div>
    </section>
  );
};

export default CustomerLogos;
