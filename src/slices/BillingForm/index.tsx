'use client';

import type { Content } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';

/**
 * Props for `BillingForm`.
 */
export type BillingFormProps = SliceComponentProps<Content.BillingFormSlice>;

/**
 * Component for "BillingForm" Slices.
 */
const BillingForm = ({ slice }: BillingFormProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto w-full bg-[#F7F4EF] font-avenir tracking-widest lg:w-1/2"
    ></section>
  );
};

export default BillingForm;
