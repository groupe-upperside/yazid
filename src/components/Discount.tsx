'use client';

import type { KeyboardEvent } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Discount({ lang = 'fr' }: { lang?: string }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const apply = async () => {
    if (!code.trim()) return;
    if (typeof window === 'undefined' || !window.Snipcart?.api) return;

    const frSuccessMessage = 'Réduction appliquée';
    const enSuccessMessage = 'Discount applied';
    const frErrorMessage = "La réduction n'a pas pu être appliquée.";
    const enErrorMessage = "Discount couldn't be applied.";

    setLoading(true);
    try {
      await window.Snipcart.api.cart.applyDiscount(code.trim());
      toast.success(lang?.includes('fr') ? frSuccessMessage : enSuccessMessage);
      setCode('');
    } catch (err: any) {
      toast.error(lang?.includes('fr') ? frErrorMessage : enErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      apply();
    }
  };

  return (
    <div className="bg-[#F7F4EF] px-6 font-avenir tracking-widest md:px-20 xl:px-32">
      <div className="flex flex-col items-end justify-end gap-4 sm:flex-row">
        <input
          type="text"
          placeholder={lang?.includes('fr') ? 'Code promotionnel' : 'Discount code'}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={onKey}
          className="w-full flex-1 border px-2 py-2.5 text-left text-sm font-medium tracking-widest text-gray-400 outline-none sm:w-fit md:px-6 md:text-base"
          disabled={loading}
        />
        <button
          type="button"
          onClick={apply}
          disabled={loading}
          className={`mx-auto bg-black px-8 py-3 text-center
              text-sm font-medium uppercase text-white 2xl:px-12`}
        >
          {lang?.includes('fr') ? 'Appliquer' : 'Apply'}
        </button>
      </div>
    </div>
  );
}
