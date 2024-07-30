'use client';

import markerSDK from '@marker.io/browser';
import { useEffect } from 'react';

export default function MarkerComponent() {
  useEffect(() => {
    markerSDK.loadWidget({
      project: '66a89e09c08a12091d1f7d25',
    });
  }, []);

  return null;
}
