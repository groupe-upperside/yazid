import { SliceZone } from '@prismicio/react';
import type { Metadata } from 'next';

import Layout from '@/components/Layout';
import { createClient } from '@/prismicio';
import { components } from '@/slices';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('checkout', {
    lang,
  });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export default async function Index({ params: { lang } }: { params: { lang: string } }) {
  // The client queries content from the Prismic API
  const client = createClient();
  const page = await client.getSingle('checkout', {
    lang,
  });

  return (
    <Layout doc={page} lang={lang}>
      <div className="flex flex-col-reverse justify-center gap-8 bg-[#F7F4EF] px-6 pb-6 pt-12 font-avenir tracking-widest md:px-20 md:pt-20 lg:flex-row xl:px-32 xl:pt-32">
        <SliceZone slices={page.data.slices} components={components} />
      </div>
    </Layout>
  );
}
