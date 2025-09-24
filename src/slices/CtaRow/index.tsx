import type { Content } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';

import Button from '@/components/Button';

/**
 * Props for `CtaRow`.
 */
export type CtaRowProps = SliceComponentProps<Content.CtaRowSlice>;

/**
 * Component for "CtaRow" Slices.
 */
const CtaRow = ({ slice }: CtaRowProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mb-6 bg-white p-6 font-avenir tracking-widest md:p-20 xl:p-32"
    >
      <div className="w-full">
        {slice.primary.cta_group.length > 0 && (
          <div className="mx-auto flex flex-col justify-center gap-8 md:flex-row md:gap-16 xl:gap-24">
            {slice.primary.cta_group.map((logo, index) => (
              <div key={index} className="flex h-full items-center justify-center">
                <Button link={logo.cta_link} label={logo.cta_text} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CtaRow;
