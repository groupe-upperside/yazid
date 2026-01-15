import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

import Button from '@/components/Button';

export type PressCardProps = SliceComponentProps<Content.PressCardSlice>;

const PressCard = ({ slice }: PressCardProps): JSX.Element => {
  const { image, title, description, link, link_label } = slice.primary;

  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation} className="py-10">
      <div className="mx-auto max-w-xl px-6">
        <article className="w-full">
          <div className="relative overflow-hidden">
            <div className="relative aspect-[4/3] w-full">
              <PrismicNextImage field={image} fill className="object-cover" />
            </div>
          </div>

          <div className="pt-4">
            {title ? (
              <h3 className="text-sm font-semibold uppercase tracking-widest text-black md:text-base">{title}</h3>
            ) : null}

            <div className="mt-2 text-justify text-sm tracking-widest text-[#707070] md:text-base">
              <PrismicRichText
                field={description}
                components={{
                  paragraph: ({ children }) => <p className="mb-2">{children}</p>,
                  strong: ({ children }) => <strong className="font-semibold text-black/80">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              />
            </div>

            {link ? (
              <div className="w-fit">
                <Button link={link} label={link_label} />
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
};

export default PressCard;
