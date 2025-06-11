'use client';

import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { useMemo } from 'react';

import Divider from '@/components/Divider';
import SectionTitle from '@/components/SectionTitle';
import { formatToString } from '@/utils/formatPrice';
import { getGridColsClass } from '@/utils/getGridColsClass';

/**
 * Props for `ClickAndCollectGrid`.
 */
export type ClickAndCollectGridProps = SliceComponentProps<Content.ClickAndCollectGridSlice>;

const ImageGridComponent = ({ slice }) => {
  const products = slice.primary.product || [];

  const gridColsClass = useMemo(() => getGridColsClass(slice.primary.number_per_row), [slice.primary.number_per_row]);
  const lgGridCols = slice.primary.number_per_row
    ? `lg:grid-cols-${slice.primary.number_per_row - 1}`
    : 'lg:grid-cols-4';

  return (
    <>
      <div className={`grid grid-cols-1 gap-8 ${lgGridCols} ${gridColsClass}`}>
        {products.map((item, index: number) => (
          <div key={index}>
            <PrismicNextImage className="aspect-square w-full object-cover pb-3" field={item.image} />
            <p className="pb-0.5 text-sm font-bold uppercase tracking-widest md:text-base">{item.product_name}</p>
            <p className="text-sm font-medium tracking-widest text-[#9A9A9A] md:text-base">
              {formatToString(item.product_price)} €
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

/**
 * Component for "ClickAndCollectGrid" Slices.
 */
const ClickAndCollectGrid = ({ slice }: ClickAndCollectGridProps): JSX.Element => {
  const { variation, primary } = slice;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={variation}
      className={`bg-white p-12 font-avenir tracking-widest md:p-20 xl:p-32`}
    >
      <SectionTitle text={primary.grid_title_bold} bold={true} centered={true} />
      <Divider centered={true} />
      <ImageGridComponent slice={slice} />
    </section>
  );
};

export default ClickAndCollectGrid;
