import { PrismicNextImage } from '@prismicio/next';

import { createClient } from '@/prismicio';

export default async function Loading() {
  const client = createClient();

  const meta = await client.getSingle('meta');

  return (
    <div className="z-50 flex h-screen items-center justify-center bg-[#F7F4EF]">
      <PrismicNextImage className="h-20 w-auto 2xl:h-24" field={meta.data.og_image} />
    </div>
  );
}
