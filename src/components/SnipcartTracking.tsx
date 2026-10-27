'use client';

import { useEffect } from 'react';

// Module-level guard so the listener is only registered once (Strict Mode, remounts).
let isTracking = false;

/**
 * Sends each confirmed Snipcart order to GA4 as a `purchase` event.
 * Nothing is sent when GA isn't loaded (cookies refused).
 */
export default function SnipcartTracking() {
  useEffect(() => {
    const track = () => {
      if (isTracking || !window.Snipcart?.events) return;
      isTracking = true;

      window.Snipcart.events.on('cart.confirmed', (cart: any) => {
        // @ts-ignore
        if (typeof window.gtag !== 'function') return;

        const items = Array.isArray(cart.items) ? cart.items : cart.items?.items || [];

        // @ts-ignore
        window.gtag('event', 'purchase', {
          transaction_id: cart.invoiceNumber || cart.token,
          value: cart.total,
          currency: (cart.currency || 'eur').toUpperCase(),
          items: items.map((item: any) => ({
            item_id: item.id,
            item_name: item.name,
            price: item.unitPrice || item.basePrice,
            quantity: item.quantity,
          })),
        });
      });
    };

    if (window.Snipcart?.events) {
      track();
      return undefined;
    }
    document.addEventListener('snipcart.ready', track);
    return () => document.removeEventListener('snipcart.ready', track);
  }, []);

  return null;
}
