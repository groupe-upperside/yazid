import { Metadata } from 'next';

import { SliceZone } from '@prismicio/react';
import * as prismic from '@prismicio/client';

import { createClient } from '@/prismicio';
import { components } from '@/slices';
import Layout from '@/components/Layout';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('chef', { lang });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export default async function Index({ params: { lang } }: { params: { lang: string } }) {
  // The client queries content from the Prismic API
  const client = createClient();
  const page = await client.getSingle('chef', {
    lang,
  });

  return (
    <Layout doc={page}>
      <SliceZone slices={page.data.slices} components={components} />
    </Layout>
  );
}
