import { SliceZone } from '@prismicio/react';
import type { Metadata } from 'next';

import Layout from '@/components/Layout';
import { createClient } from '@/prismicio';
import { components } from '@/slices';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('creations', { lang });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export default async function Index({ params: { lang } }: { params: { lang: string } }) {
  // The client queries content from the Prismic API
  const client = createClient();
  const page = await client.getSingle('creations', {
    lang,
  });

  return (
    <Layout doc={page} lang={lang}>
      <SliceZone slices={page.data.slices} components={components} />
    </Layout>
  );
}
