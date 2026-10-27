import type { DateField } from '@prismicio/client';
import { isValid, max, min, parseISO, startOfDay } from 'date-fns';

import type { SnipCartItem } from '@/hooks/useSnipcart';

export type OrderableWindow =
  | { status: 'none' }
  | { status: 'ok'; start: Date | null; end: Date | null }
  | { status: 'unavailable'; names: string[] };

/**
 * Serializes a product's optional orderable date range (inclusive) into Snipcart item metadata.
 */
export const getOrderableMetadata = (from?: DateField, to?: DateField) => {
  if (!from && !to) return undefined;
  return JSON.stringify({ ...(from && { orderableFrom: from }), ...(to && { orderableTo: to }) });
};

const parseDate = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const d = parseISO(value);
  return isValid(d) ? startOfDay(d) : null;
};

/**
 * Intersects the orderable date ranges of every restricted item in the cart.
 * Returns `unavailable` when the intersection is empty or entirely in the past.
 */
export const getOrderableWindow = (items: SnipCartItem[], today = startOfDay(new Date())): OrderableWindow => {
  const restricted = items
    .map((item) => ({
      name: item.name,
      from: parseDate(item.metadata?.orderableFrom),
      to: parseDate(item.metadata?.orderableTo),
    }))
    .filter(({ from, to }) => from || to);

  if (restricted.length === 0) return { status: 'none' };

  const names = restricted.map(({ name }) => name);
  const starts = restricted.flatMap(({ from }) => (from ? [from] : []));
  const ends = restricted.flatMap(({ to }) => (to ? [to] : []));
  const start = starts.length ? max(starts) : null;
  const end = ends.length ? min(ends) : null;

  if ((start && end && start > end) || (end && end < today)) return { status: 'unavailable', names };

  return { status: 'ok', start, end };
};
