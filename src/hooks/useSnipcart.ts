'use client';

import { useEffect, useState } from 'react';

interface SnipCartItem {
  id: string;
  uniqueId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

type CartItemsHook = {
  items: SnipCartItem[];
  total: number;
  itemsTotal: number;
};

type CartFieldsHook = Record<string, string>;
/**
 * Subscribes to Snipcart store for cart items and totals.
 * Returns items array, total price, and total quantity.
 */
export function useCartItems(): CartItemsHook {
  const [items, setItems] = useState<SnipCartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [itemsTotal, setItemsTotal] = useState(0);

  useEffect(() => {
    function subscribe() {
      if (!window.Snipcart?.store) return () => {};
      const sync = () => {
        const state = window.Snipcart.store.getState();
        const cartItems = Array.isArray(state.cart.items.items) ? state.cart.items.items : [];
        setItems(cartItems);
        setTotal(
          cartItems.reduce((sum: number, i: { quantity: number; price: number }) => sum + i.quantity * i.price, 0)
        );
        setItemsTotal(cartItems.reduce((sum: any, i: { quantity: any }) => sum + i.quantity, 0));
      };
      sync();
      return window.Snipcart.store.subscribe(sync);
    }

    let unsubscribe: () => void = () => {};
    if (typeof window !== 'undefined') {
      if (window.Snipcart?.store) {
        unsubscribe = subscribe();
      } else {
        const onReady = () => {
          unsubscribe = subscribe();
        };
        document.addEventListener('snipcart.ready', onReady);
        return () => {
          document.removeEventListener('snipcart.ready', onReady);
          unsubscribe();
        };
      }
    }

    return () => {
      unsubscribe();
    };
  }, []);

  return { items, total, itemsTotal };
}

/**
 * Subscribes to Snipcart store for order-level custom fields.
 * @param fieldNames array of custom-field names to track
 * @returns object mapping each fieldName to its current value or ''
 */
export function useCartCustomFields(fieldNames: string[]): CartFieldsHook {
  const initial = Object.fromEntries(fieldNames.map((n) => [n, '']));
  const [fields, setFields] = useState<CartFieldsHook>(initial);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Pull the latest values from the Redux store
    const sync = () => {
      const state = window.Snipcart.store.getState(); // ← live state
      const cf = Array.isArray(state.cart.customFields) ? state.cart.customFields : [];
      setFields(
        Object.fromEntries(
          fieldNames.map((name) => [name, cf.find((f: { name: string }) => f.name === name)?.value ?? ''])
        )
      );
    };

    // --- subscribe once Snipcart is ready ---
    const start = () => {
      sync(); // initial load
      return window.Snipcart.store.subscribe(sync); // ← stay in sync 🆕
    };

    let unsubscribe = () => {};
    if (window.Snipcart?.store) {
      unsubscribe = start();
    } else {
      // eslint-disable-next-line no-return-assign
      const onReady = () => (unsubscribe = start());
      document.addEventListener('snipcart.ready', onReady);
      // eslint-disable-next-line consistent-return
      return () => document.removeEventListener('snipcart.ready', onReady);
    }

    // eslint-disable-next-line consistent-return
    return unsubscribe; // cleanup
  }, [JSON.stringify(fieldNames)]);

  return fields;
}
