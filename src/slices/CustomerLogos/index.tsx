import { type Content, isFilled } from '@prismicio/client';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';

import Divider from '@/components/Divider';

export type CustomerLogosProps = SliceComponentProps<Content.CustomerLogosSlice>;

const CustomerLogos = ({ slice }: CustomerLogosProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-[#F7F4EF] p-20 font-avenir tracking-widest xl:p-32"
    >
      <div className="w-full">
        <div className="flex w-full flex-col items-center justify-center">
          {slice.primary.title_light ? (
            <h2 className="mb-3 text-center text-2xl font-medium uppercase tracking-widest text-gray-900 md:text-3xl xl:text-start">
              {slice.primary.title_light}
            </h2>
          ) : null}
          <h2 className="mb-3 text-center text-2xl font-semibold uppercase tracking-widest text-gray-900 md:text-3xl xl:text-start">
            {slice.primary.title_bold}
          </h2>
          <Divider />
        </div>
        {slice.primary.logos.length > 0 && (
          <ul className="flex w-full flex-row items-center justify-between">
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
