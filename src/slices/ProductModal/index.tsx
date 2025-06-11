import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';

/**
 * Props for `ProductModal`.
 */
export type ProductModalProps = SliceComponentProps<Content.ProductModalSlice>;

/**
 * Component for "ProductModal" Slices.
 */
const ProductModal = ({ slice }: ProductModalProps): JSX.Element => {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      Placeholder component for product_modal (variation: {slice.variation}) Slices
    </section>
  );
};

export default ProductModal;
