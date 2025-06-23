// components/StockGuard.tsx

'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useStock } from '@/hooks/useStock';

export default function StockGuard({ cartItem, lang = 'fr' }: { cartItem: any; lang?: string }) {
  const { data } = useStock(cartItem.id);

  useEffect(() => {
    if (data?.stock === undefined || typeof window === 'undefined') return;

    const { stock, allowOutOfStockPurchases } = data;
    const { Snipcart } = window;
    if (!Snipcart?.api) return;

    if (stock <= 0 && !allowOutOfStockPurchases) {
      Snipcart.api.cart.items.remove(cartItem.uniqueId);
      toast.error(
        lang.startsWith('fr')
          ? `${cartItem.name} a été retiré : article épuisé`
          : `${cartItem.name} was removed – out of stock`,
        { id: cartItem.uniqueId }
      );
    } else if (cartItem.quantity > stock) {
      Snipcart.api.cart.items.update({
        uniqueId: cartItem.uniqueId,
        quantity: stock,
      });
      toast.error(
        lang.startsWith('fr')
          ? `${cartItem.name} : quantité ajustée à ${stock}`
          : `${cartItem.name} quantity adjusted to ${stock}`,
        { id: cartItem.uniqueId }
      );
    }
  }, [data, cartItem, lang]);

  return null; // side-effects only
}
