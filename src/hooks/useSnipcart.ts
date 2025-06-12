// hooks/useSnipcart.ts

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

interface CustomField {
  name: string;
  value: string;
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
        setTotal(cartItems.reduce((sum, i) => sum + i.quantity * i.price, 0));
        setItemsTotal(cartItems.reduce((sum, i) => sum + i.quantity, 0));
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
  const initial: CartFieldsHook = Object.fromEntries(fieldNames.map((name) => [name, '']));
  const [fields, setFields] = useState<CartFieldsHook>(initial);

  useEffect(() => {
    function sync() {
      if (!window.Snipcart?.store) return;
      const state = window.Snipcart.store.getState();
      const cf: CustomField[] = Array.isArray(state.cart.customFields) ? state.cart.customFields : [];
      const updated = Object.fromEntries(
        fieldNames.map((name) => {
          const found = cf.find((f) => f.name === name);
          return [name, found?.value ?? ''];
        })
      );
      setFields(updated);
    }

    if (typeof window !== 'undefined') {
      if (window.Snipcart?.store) {
        sync();
      } else {
        document.addEventListener('snipcart.ready', sync);
      }
    }
    return () => {
      document.removeEventListener('snipcart.ready', sync);
    };
  }, [JSON.stringify(fieldNames)]);

  return fields;
}
