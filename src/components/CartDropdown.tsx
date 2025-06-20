'use client';

import type { Content } from '@prismicio/client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FaShoppingBasket } from 'react-icons/fa';

import CartRows from '@/components/CartRows';
import { useCartItems } from '@/hooks/useSnipcart';

export default function CartDropdown({ lang, meta }: { lang: string; meta: Content.DropdownCartDocument<string> }) {
  const { items, total, itemsTotal } = useCartItems();
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    document.addEventListener('openCartDropdown', handleOpen);
    return () => {
      document.removeEventListener('openCartDropdown', handleOpen);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (open && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex items-center rounded-lg p-3 text-gray-900"
      >
        <FaShoppingBasket className="size-5" />
        <span className="sr-only">Notifications</span>
        <div className="z-5 absolute bottom-1 end-1 inline-flex size-4 items-center justify-center rounded-full border border-gray-900 bg-white p-1 text-[0.5rem] font-bold">
          {itemsTotal}
        </div>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50  w-max">
          <div className="relative space-y-6 overflow-hidden bg-white p-8 shadow-lg">
            <div className="text-center text-base font-bold uppercase">{meta.data.title_bold}</div>

            <CartRows lang={lang} />

            {items.length > 0 ? (
              <>
                <div className="flex justify-between text-base font-bold uppercase">
                  <div>{meta.data.total}</div>
                  <div>{total.toFixed(2).replace('.', ',')} €</div>
                </div>

                <Link
                  href={`/${lang}/cart`}
                  className="block w-full bg-black px-8 py-4 text-center text-sm font-medium uppercase text-white 2xl:px-12"
                >
                  {meta.data.button_label}
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
