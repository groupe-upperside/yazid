import { createClient } from '@/prismicio';
import { PrismicNextImage } from '@prismicio/next';

export default async function Loading() {
  const client = createClient();

  const meta = await client.getSingle('meta');

  return (
    <div className="h-screen flex items-center justify-center z-50 bg-[#F7F4EF]">
      <PrismicNextImage className="h-20 2xl:h-24 w-auto" field={meta.data.og_image} />
    </div>
  );
}
