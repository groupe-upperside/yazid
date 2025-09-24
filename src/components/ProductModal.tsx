'use client';

import type { KeyTextField, NumberField } from '@prismicio/client';
import { isFilled } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { PrismicRichText } from '@prismicio/react';
import type { ImageField, RichTextField } from '@prismicio/types';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';

import { useCartItems } from '@/hooks/useSnipcart';
import { useStock } from '@/hooks/useStock';

type Product = {
  image: ImageField;
  image2?: ImageField;
  product_name: KeyTextField;
  product_price: NumberField;
  product_description: RichTextField;
  product_allergens: KeyTextField;
  product_id: NumberField;
  product_min_quantity: NumberField;
  linked_products_ids?: KeyTextField;
};

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  linkedProducts: Product[] | null;
};

function getVariantShortLabel(fullName: string): string {
  const idx = fullName.indexOf('-');
  if (idx === -1) return fullName.trim();
  const right = fullName.slice(idx + 1).trim();
  return right.length ? right : fullName.trim();
}

type PopAlign = 'left' | 'center' | 'right';
type PopPlace = 'above' | 'below';

export default function ProductModal({ open, onClose, product, linkedProducts }: Props) {
  // ===== Build variants list (main + linked), dedup by product_id =====
  const variants = useMemo(() => {
    if (!product) return [];
    const list = [product, ...(linkedProducts ?? [])];
    const seen = new Set<number>();
    return list.filter((p) => {
      const id = Number(p.product_id);
      if (!Number.isFinite(id) || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [product, linkedProducts]);

  // ===== Selected variant =====
  const [selected, setSelected] = useState<Product | null>(product);
  useEffect(() => setSelected(product), [product]);

  // ===== Hovered/Focused variant for popover + computed placement =====
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [popAlign, setPopAlign] = useState<PopAlign>('center');
  const [popPlace, setPopPlace] = useState<PopPlace>('below');

  // container refs to constrain popover inside the right panel
  const rightPanelRef = useRef<HTMLDivElement | null>(null);

  // ===== Locale =====
  const pathname = usePathname();
  const localeSegment = pathname.split('/')[1] ?? 'fr';
  const lang = localeSegment.startsWith('en') ? 'en' : 'fr';

  // ===== Stock based on selected variant =====
  const selectedId = Number(selected?.product_id ?? product?.product_id ?? 1);
  const { data } = useStock(selectedId);
  const outOfStock = data?.stock !== undefined && data.stock <= 0 && !data.allowOutOfStockPurchases;

  // ===== Gallery (derived from selected) =====
  const images = selected ? [selected.image, ...(selected.image2?.url ? [selected.image2] : [])] : [];
  const [imgIndex, setImgIndex] = useState(0);
  useEffect(() => setImgIndex(0), [selected, open]);

  // ===== Quantity (derived from selected + cart) =====
  const minQty = useMemo(() => (selected?.product_min_quantity as number | undefined) ?? 1, [selected]);
  const maxQty = data && !data.allowOutOfStockPurchases && Number.isFinite(data.stock) ? data.stock : Infinity;

  const [quantity, setQuantity] = useState(minQty);
  const { items } = useCartItems();

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // sync quantity with cart for selected variant
  useEffect(() => {
    if (open && selected) {
      const selectedStr = selected.product_id?.toString();
      const existing = items.find((i) => i.id === selectedStr);
      setQuantity(Math.max(minQty, existing?.quantity ?? minQty));
    }
  }, [open, selected, items, minQty]);

  const handleClickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.dispatchEvent(new CustomEvent('openCartDropdown'));
  };

  // Compute popover alignment so it stays inside right panel
  const computePopoverPlacement = (triggerEl: HTMLElement) => {
    const container = rightPanelRef.current;
    if (!container) return;

    const c = container.getBoundingClientRect();
    const t = triggerEl.getBoundingClientRect();

    // Approx popover size (matches w-72/md:w-[22rem]) and padding
    const popW = Math.min(352, Math.min(window.innerWidth * 0.9, 384)); // px
    const popH = 180; // rough; we also flip vertically if needed

    // Horizontal alignment
    const centerX = t.left + t.width / 2;
    if (centerX - popW / 2 < c.left + 8) {
      setPopAlign('left');
    } else if (centerX + popW / 2 > c.right - 8) {
      setPopAlign('right');
    } else {
      setPopAlign('center');
    }

    // Vertical placement
    const spaceBelow = c.bottom - t.bottom;
    const spaceAbove = t.top - c.top;
    if (spaceBelow < popH && spaceAbove > popH) {
      setPopPlace('above');
    } else {
      setPopPlace('below');
    }
  };

  if (!open || !product || !selected) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/80" onClick={onClose}>
      <div
        className="relative mx-auto flex max-h-[calc(100vh-4rem)] w-11/12 bg-white xl:w-4/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Gallery */}
        <div className="relative hidden max-w-[45%] overflow-hidden lg:flex">
          <div
            className="relative size-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (images.length > 0) setImgIndex((i) => (i + 1) % images.length);
            }}
          >
            {images[imgIndex] ? (
              <PrismicNextImage
                field={images[imgIndex]}
                className="size-full object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-gray-100 text-gray-400">
                {lang === 'fr' ? 'Aucune image' : 'No image'}
              </div>
            )}

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
                      className={`size-2 rounded-full transition-all ${
                        imgIndex === mappedIndex ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Content */}
        <div ref={rightPanelRef} className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <button
            className="absolute right-4 top-4 text-gray-600 hover:text-gray-800"
            onClick={onClose}
            aria-label="Close"
          >
            <IoClose size={20} />
          </button>

          <div className="p-6 md:p-10">
            <div className="space-y-0.5 pb-2">
              <h2 className="break-words text-xl font-semibold uppercase tracking-widest text-gray-900 md:text-3xl">
                {selected.product_name}
              </h2>

              <p className="text-sm font-semibold tracking-widest text-[#707070] md:text-base">
                {selected.product_price ? (selected.product_price as number).toFixed(2).replace('.', ',') : ''}€
              </p>
            </div>

            {isFilled.richText(selected.product_description) && (
              <div className="mt-2 space-y-2">
                <PrismicRichText
                  field={selected.product_description}
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
            )}

            {/* Variations rail */}
            {variants.length > 1 && (
              <>
                <hr className="my-6 h-0.5 w-20 border-0 bg-[#E5E7EB]" />
                <div className="xl:mx-0">
                  <h3 className="mb-3 text-sm font-semibold tracking-widest text-[#707070] md:text-base">
                    {lang === 'fr' ? 'Variantes' : 'Variations'}
                  </h3>

                  {/* Mobile: horizontal scroll; Desktop: wraps (no overflow) */}
                  <div
                    role="radiogroup"
                    aria-label={lang === 'fr' ? 'Choisir une variante' : 'Choose a variation'}
                    className="
                      relative flex snap-x snap-mandatory gap-2
                      overflow-x-auto px-1 pb-1
                      [-ms-overflow-style:none] [scrollbar-width:none]
                      md:snap-none md:flex-wrap md:overflow-x-visible
                    "
                  >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>

                    {variants.map((v) => {
                      const isSelected = Number(v.product_id) === Number(selected.product_id);
                      const idNum = Number(v.product_id);
                      const fullName = String(v.product_name ?? '');
                      const shortName = getVariantShortLabel(fullName);

                      return (
                        <div
                          key={String(v.product_id)}
                          className="relative"
                          onMouseEnter={(e) => {
                            setHoveredId(idNum);
                            computePopoverPlacement(e.currentTarget as HTMLElement);
                          }}
                          onMouseLeave={() => setHoveredId((prev) => (prev === idNum ? null : prev))}
                        >
                          <button
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => {
                              setSelected(v);
                              setImgIndex(0);
                            }}
                            onFocus={(e) => {
                              setHoveredId(idNum);
                              computePopoverPlacement((e.currentTarget as HTMLElement).parentElement as HTMLElement);
                            }} /* keyboard focus opens & positions popover */
                            onBlur={() => setHoveredId((prev) => (prev === idNum ? null : prev))}
                            title={fullName}
                            className={[
                              'group snap-start shrink-0 rounded-lg border p-2 text-left outline-none transition-colors',
                              'w-[7.5rem] md:w-[10rem]',
                              isSelected
                                ? 'border-gray-900 ring-0.5 ring-gray-900'
                                : 'border-gray-200 hover:border-gray-400 focus:ring-2 focus:ring-gray-300',
                            ].join(' ')}
                          >
                            <div className="mx-auto size-16 overflow-hidden rounded-md bg-gray-50 md:size-20">
                              <PrismicNextImage
                                field={v.image}
                                className="size-full object-cover transition-transform group-hover:scale-[1.03]"
                                sizes="80px"
                              />
                            </div>
                            <div
                              className="md:text-xs mt-2 line-clamp-2 break-words text-[11px] leading-snug text-gray-800"
                              aria-label={fullName}
                            >
                              {shortName}
                            </div>
                          </button>

                          {/* Hover/Focus Popover — positioned to stay INSIDE right panel */}
                          {hoveredId === idNum && (
                            <div
                              role="dialog"
                              aria-label={lang === 'fr' ? 'Détails de la variante' : 'Variant details'}
                              className={[
                                'absolute z-40 w-72 md:w-[22rem] rounded-xl border border-gray-200 bg-white p-3 shadow-xl',
                                popPlace === 'below' ? 'top-full mt-2' : 'bottom-full mb-2',
                                // eslint-disable-next-line no-nested-ternary
                                popAlign === 'left'
                                  ? 'left-0'
                                  : popAlign === 'right'
                                    ? 'right-0'
                                    : 'left-1/2 -translate-x-1/2',
                              ].join(' ')}
                              style={{ maxWidth: 'min(90vw, 24rem)' }}
                            >
                              {/* arrow */}
                              <div
                                className={[
                                  'absolute h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-white',
                                  popPlace === 'below' ? '-top-2' : '-bottom-2 rotate-180',
                                  // eslint-disable-next-line no-nested-ternary
                                  popAlign === 'left'
                                    ? 'left-4'
                                    : popAlign === 'right'
                                      ? 'right-4'
                                      : 'left-1/2 -translate-x-1/2',
                                ].join(' ')}
                              />

                              <div className="flex items-start gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="break-words text-[11px] font-semibold text-gray-900">{fullName}</div>
                                  {v.product_price != null && (
                                    <div className="mt-0.5 text-[11px] font-medium text-gray-600">
                                      {(v.product_price as number).toFixed(2).replace('.', ',')}€
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <hr className="border-0.5 my-6 flex h-0.5 w-20 border-[#707070] xl:mx-0 xl:block" />

            <p className="break-words text-justify text-sm tracking-widest text-[#707070] md:text-base">
              {selected.product_allergens}
            </p>
          </div>

          {/* Quantity + CTA */}
          <div className="mt-auto flex flex-col items-center justify-center gap-4 p-6 md:p-10">
            <div className="flex items-center gap-6 font-bold">
              <button
                disabled={quantity === minQty}
                onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
                className="text-2xl disabled:opacity-30"
                aria-label={lang === 'fr' ? 'Diminuer la quantité' : 'Decrease quantity'}
              >
                –
              </button>
              <span className="text-2xl text-[#111827]" aria-live="polite">
                {quantity}
              </span>
              <button
                disabled={quantity >= maxQty}
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                className="text-2xl disabled:opacity-30"
                aria-label={lang === 'fr' ? 'Augmenter la quantité' : 'Increase quantity'}
              >
                +
              </button>
            </div>

            {quantity === maxQty && Number.isFinite(maxQty) && (
              <p className="text-justify text-sm tracking-widest text-orange-300 md:text-base">
                {lang === 'fr' ? 'Quantité maximum atteinte' : 'Max quantity reached'}
              </p>
            )}

            <button
              disabled={outOfStock}
              onClick={handleClickAdd}
              className="snipcart-add-item mx-auto bg-black px-8 py-4 text-center text-sm font-medium uppercase text-white disabled:opacity-40 2xl:px-12"
              data-item-id={selected.product_id}
              data-item-name={selected.product_name}
              data-item-price={(selected.product_price as number).toFixed(2)}
              data-item-quantity={quantity}
              data-item-url="https://yazid-ichemrahen.com/fr-fr/click-and-collect"
              data-item-image={images[imgIndex]?.url}
              data-item-min-quantity={selected.product_min_quantity}
              data-item-max-quantity={Number.isFinite(maxQty) ? maxQty : 1000}
            >
              {lang === 'fr' ? 'Ajouter au panier' : 'Add to cart'}
            </button>

            {outOfStock && (
              <p className="text-sm tracking-widest text-red-500">{lang === 'fr' ? 'Indisponible' : 'Out of stock'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
