'use client';

import type { NumberField } from '@prismicio/client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useStock(id: NumberField) {
  return useSWR<{
    allowOutOfStockPurchases: boolean;
    stock: number;
  }>(`/api/product/${id}`, fetcher, {
    refreshInterval: 60_000,
  });
}
