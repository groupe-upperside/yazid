import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import type { Metadata } from 'next';

import Layout from '@/components/Layout';
import { createClient } from '@/prismicio';
import { components } from '@/slices';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('homepage', { lang });

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
  };
}

export default async function Index({ params: { lang } }: { params: { lang: string } }) {
  // The client queries content from the Prismic API
  const client = createClient();
  const home = await client.getSingle('homepage', {
    lang,
  });

  return (
    <Layout doc={home} lang={lang}>
      <SliceZone slices={home.data.slices} components={components} />
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('page', {
    lang: '*',
    filters: [prismic.filter.at('my.page.uid', 'homepage')],
  });

  return pages.map((page) => {
    return {
      lang: page.lang,
    };
  });
}
