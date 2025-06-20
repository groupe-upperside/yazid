'use client';

import type { Content, KeyTextField, NumberField } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import type { ImageField, RichTextField } from '@prismicio/types';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FaShoppingBasket } from 'react-icons/fa';

import Divider from '@/components/Divider';
import ProductModal from '@/components/ProductModal';
import SectionTitle from '@/components/SectionTitle';
import { useStock } from '@/hooks/useStock';
import { getGridColsClass } from '@/utils/getGridColsClass';

type Product = {
  image: ImageField;
  product_name: KeyTextField;
  product_price: NumberField;
  product_description: RichTextField;
  product_allergens: KeyTextField;
  product_id: NumberField;
  product_min_quantity: NumberField;
};

const GridComponent = ({
  item,
  onProductClick,
  lang,
}: {
  lang: string;
  item: Product;
  onProductClick: (p: Product) => void;
}) => {
  const { data } = useStock(item.product_id);
  const outOfStock = data?.stock !== undefined && data.stock <= 0 && !data.allowOutOfStockPurchases;
  const overlayVisibility = outOfStock ? 'opacity-100 bg-black/65' : 'opacity-0 group-hover:opacity-100 bg-black/75';

  return (
    <div onClick={outOfStock ? undefined : () => onProductClick(item)}>
      <div className={`group relative mb-3 aspect-square w-full ${outOfStock ? '' : 'cursor-pointer'}`}>
        <PrismicNextImage className="aspect-square w-full object-cover" field={item.image} />
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center  opacity-0 transition-opacity ${overlayVisibility}`}
        >
          {outOfStock ? (
            <p className="pb-0.5 text-sm font-bold uppercase tracking-widest text-white md:text-base">
              {lang === 'fr' ? 'Épuisé' : 'Out of stock'}
            </p>
          ) : (
            <>
              <span className="pb-0.5 text-sm font-bold uppercase tracking-widest text-white md:text-base">
                {item.product_name}
              </span>
              <span className="text-sm font-medium tracking-widest text-white md:text-base">
                {item.product_price ? item.product_price.toFixed(2).replace('.', ',') : ''}€
              </span>
              <div className="mt-4 flex size-10 items-center justify-center rounded-full bg-white">
                <FaShoppingBasket className="size-6" />
              </div>
            </>
          )}
        </div>
      </div>
      <p className="pb-0.5 text-sm font-bold uppercase tracking-widest md:text-base">{item.product_name}</p>
      <p className="text-sm font-medium tracking-widest text-[#9A9A9A] md:text-base">
        {item.product_price ? item.product_price.toFixed(2).replace('.', ',') : ''}€
      </p>
      <button
        className="snipcart-add-item sr-only"
        data-item-id={item.product_id}
        data-item-name={item.product_name}
        data-item-price={(item.product_price as number).toFixed(2)}
        data-item-url="https://yazid-ichemrahen.com/fr-fr/click-and-collect"
        data-item-image={item.image.url}
      ></button>
    </div>
  );
};

/**
 * Props for `ClickAndCollectGrid`.
 */
export type ClickAndCollectGridProps = SliceComponentProps<Content.ClickAndCollectGridSlice>;

const ImageGridComponent = ({ slice }: ClickAndCollectGridProps) => {
  const products: Product[] = slice.primary.product ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const gridColsClass = useMemo(() => getGridColsClass(slice.primary.number_per_row), [slice.primary.number_per_row]);
  const lgGridCols = slice.primary.number_per_row
    ? `lg:grid-cols-${slice.primary.number_per_row - 1}`
    : 'lg:grid-cols-4';

  const pathname = usePathname();
  const localeSegment = pathname.split('/')[1] ?? 'fr';
  const lang = localeSegment.startsWith('en') ? 'en' : 'fr';

  const onProductClick = (item: Product) => {
    setSelectedProduct(item);
    setModalOpen(true);
  };

  return (
    <>
      <div className={`grid grid-cols-1 gap-8 ${lgGridCols} ${gridColsClass}`}>
        {products.map((item) => (
          <GridComponent key={item.product_id} item={item} onProductClick={onProductClick} lang={lang} />
        ))}
      </div>
      <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} product={selectedProduct} />
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
      className={`bg-white p-6 font-avenir tracking-widest md:p-20 xl:p-32`}
    >
      <SectionTitle text={primary.grid_title_bold} bold={true} centered={true} />
      <Divider centered={true} />
      <ImageGridComponent slice={slice} index={0} slices={[]} context={undefined} />
    </section>
  );
};

export default ClickAndCollectGrid;
