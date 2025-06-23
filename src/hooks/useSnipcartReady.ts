// hooks/useSnipcartReady.ts

'use client';

import { useEffect, useState } from 'react';

export function useSnipcartReady() {
  const [ready, setReady] = useState(typeof window !== 'undefined' && !!window.Snipcart?.api);

  useEffect(() => {
    if (ready || typeof window === 'undefined') return;

    const handler = () => setReady(true);

    window.document.addEventListener('snipcart.ready', handler);
    return () => window.document.removeEventListener('snipcart.ready', handler);
  }, [ready]);

  return ready;
}
