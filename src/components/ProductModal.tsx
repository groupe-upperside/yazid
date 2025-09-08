'use client';

import type { KeyTextField, NumberField } from '@prismicio/client';
import { isFilled } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import type { ImageField, RichTextField } from '@prismicio/types';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';

import { useCartItems } from '@/hooks/useSnipcart';
import { useStock } from '@/hooks/useStock';

type Props = {
  open: boolean;
  onClose: () => void;
  product: {
    image: ImageField;
    image2?: ImageField;
    product_name: KeyTextField;
    product_price: NumberField;
    product_description: RichTextField;
    product_allergens: KeyTextField;
    product_id: NumberField;
    product_min_quantity: NumberField;
  } | null;
};

export default function ProductModal({ open, onClose, product }: Props) {
  const id = product?.product_id ?? 1;
  const { data } = useStock(id);
  const outOfStock = data?.stock !== undefined && data.stock <= 0 && !data.allowOutOfStockPurchases;

  const minQty = useMemo(() => (product?.product_min_quantity as number | undefined) ?? 1, [product]);
  const maxQty = data && !data.allowOutOfStockPurchases && Number.isFinite(data.stock) ? data.stock : Infinity;

  const [quantity, setQuantity] = useState(minQty);
  const { items } = useCartItems();

  const pathname = usePathname();
  const localeSegment = pathname.split('/')[1] ?? 'fr';
  const lang = localeSegment.startsWith('en') ? 'en' : 'fr';

  // images array and index for switching
  const images = product ? [product.image, ...(product.image2?.url ? [product.image2] : [])] : [];
  const [imgIndex, setImgIndex] = useState(0);

  // reset index when product/modal changes
  useEffect(() => {
    setImgIndex(0);
  }, [product, open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (open && product) {
      const productId = product.product_id?.toString();
      const existing = items.find((i) => i.id === productId);
      setQuantity(Math.max(minQty, existing?.quantity ?? minQty));
    }
  }, [open, product, items, minQty]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.dispatchEvent(new CustomEvent('openCartDropdown'));
  };

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/80" onClick={onClose}>
      <div
        className="relative mx-auto flex max-h-[calc(100vh-4rem)] w-11/12 bg-white xl:w-4/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative hidden max-w-[45%] lg:flex">
          {/* clickable image area: clicking cycles images */}
          <div
            className="relative size-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (images.length > 0) setImgIndex((i) => (i + 1) % images.length);
            }}
          >
            <PrismicNextImage field={images[imgIndex]} className="size-full object-cover" />

            {/* three grey dots over the bottom of the image when there is a second image */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
                {Array.from({ length: 3 }).map((_, idx) => {
                  const mappedIndex = idx % images.length;
                  return (
                    <button
                      key={idx}
                      aria-label={`Show image ${mappedIndex + 1}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setImgIndex(mappedIndex);
                      }}
                      className={`size-2 rounded-full transition-all ${imgIndex === mappedIndex ? 'bg-gray-600' : 'bg-gray-300'}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="relative flex flex-1 flex-col overflow-y-auto">
          <button className="absolute right-4 top-4 text-gray-600 hover:text-gray-800" onClick={onClose}>
            <IoClose size={20} />
          </button>

          <div className="p-6 md:p-10">
            <div className="space-y-0.5 pb-2">
              <h2 className="text-xl font-semibold uppercase tracking-widest text-gray-900 md:text-3xl">
                {product.product_name}
              </h2>

              <p className="text-sm font-semibold tracking-widest text-[#707070] md:text-base">
                {product.product_price ? product.product_price.toFixed(2).replace('.', ',') : ''}€
              </p>
            </div>

            {isFilled.richText(product.product_description) && (
              <>
                <div className="mt-2 space-y-2">
                  <PrismicRichText
                    field={product.product_description}
                    components={{
                      paragraph: ({ children }) => (
                        <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
                      ),
                      list: ({ children }) => (
                        <ul className="list-inside list-disc tracking-widest text-[#707070]">{children}</ul>
                      ),
                    }}
                  />
                </div>
              </>
            )}

            <hr className="border-0.5 my-6 flex h-0.5 w-20 border-[#707070] xl:mx-0 xl:block" />

            <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">
              {product.product_allergens}
            </p>
          </div>

          <hr className="border-0.5 flex h-0.5 w-full border-[#707070] xl:mx-0 xl:block" />

          <div className="mt-auto flex flex-col items-center justify-center gap-4 p-6 md:p-10">
            <div className="flex items-center gap-6 font-bold">
              <button
                disabled={quantity === minQty}
                onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
                className="text-2xl"
              >
                -
              </button>
              <span className="text-2xl text-[#111827]">{quantity}</span>
              <button
                disabled={quantity >= maxQty}
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                className="text-2xl"
              >
                +
              </button>
            </div>
            {quantity === maxQty && (
              <p className="text-justify text-sm tracking-widest text-orange-300 md:text-base">
                {lang === 'fr' ? 'Quantité maximum atteinte' : 'Max quantity reached'}
              </p>
            )}
            <button
              disabled={outOfStock}
              onClick={(e) => handleClick(e)}
              className="snipcart-add-item mx-auto bg-black px-8 py-4 text-center text-sm font-medium uppercase text-white 2xl:px-12"
              data-item-id={product.product_id}
              data-item-name={product.product_name}
              data-item-price={(product.product_price as number).toFixed(2)}
              data-item-quantity={quantity}
              data-item-url="https://yazid-ichemrahen.com/fr-fr/click-and-collect"
              data-item-image={images[imgIndex]?.url}
              data-item-min-quantity={product.product_min_quantity}
              data-item-max-quantity={maxQty || 1000}
            >
              {lang === 'fr' ? ' Ajouter au panier' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
