import type { Content } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

/**
 * Props for `BlockTextCentered`.
 */
export type BlockTextCenteredProps = SliceComponentProps<Content.BlockTextCenteredSlice>;

/**
 * Component for "BlockTextCentered" Slices.
 */
const BlockTextCentered = ({ slice }: BlockTextCenteredProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="p-12 font-avenir tracking-widest md:p-20 xl:p-32"
    >
      <div className="flex flex-col justify-center space-y-6">
        <PrismicRichText
          field={slice.primary.text}
          components={{
            paragraph: ({ children }) => (
              <p className="text-center text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
            ),
          }}
        />
      </div>
    </section>
  );
};

export default BlockTextCentered;
