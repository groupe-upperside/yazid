import type { KeyTextField, NumberField } from '@prismicio/client';
import { isFilled } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import type { ImageField, RichTextField } from '@prismicio/types';
import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

import { useCartItems } from '@/hooks/useSnipcart';

type Props = {
  open: boolean;
  onClose: () => void;
  product: {
    image: ImageField;
    product_name: KeyTextField;
    product_price: NumberField;
    product_description: RichTextField;
    product_allergens: KeyTextField;
    product_id: NumberField;
  } | null;
};

export default function ProductModal({ open, onClose, product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { items } = useCartItems();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (open && product) {
      const id = product?.product_id?.toString();
      const existing = items.find((i) => i.id === id);
      setQuantity(existing?.quantity ?? 1);
    }
  }, [open, product, items]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.dispatchEvent(new CustomEvent('openCartDropdown'));
  };

  if (!open || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-scroll bg-gray-100/40"
      onClick={onClose}
    >
      <div className="relative mx-auto flex  w-4/5 bg-white lg:w-3/4" onClick={(e) => e.stopPropagation()}>
        <div className="relative hidden lg:block">
          <PrismicNextImage field={product.image} className="size-full object-cover" />
        </div>

        <div className="relative flex flex-1 flex-col">
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
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="text-2xl">
                -
              </button>
              <span className="text-2xl text-[#111827]">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="text-2xl">
                +
              </button>
            </div>
            <button
              onClick={(e) => handleClick(e)}
              className="snipcart-add-item mx-auto bg-black px-8 py-4 text-center text-sm font-medium uppercase text-white 2xl:px-12"
              data-item-id={product.product_id}
              data-item-name={product.product_name}
              data-item-price={(product.product_price as number).toFixed(2)}
              data-item-quantity={quantity}
              data-item-url="https://yazid-ichemrahen.com"
              data-item-image={product.image.url}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
