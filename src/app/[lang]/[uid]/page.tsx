import * as prismic from '@prismicio/client';
import { SliceZone } from '@prismicio/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Layout from '@/components/Layout';
import { createClient } from '@/prismicio';
import { components } from '@/slices';

type Params = { uid: string; lang: string };

/**
 * This page renders a Prismic Document dynamically based on the URL.
 */

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const client = createClient();
  const page = await client.getByUID('page', params.uid, { lang: params.lang }).catch(() => notFound());

  return {
    title: prismic.asText(page.data.title),
    description: page.data.meta_description,
    openGraph: {
      title: page.data.meta_title || undefined,
      images: [
        {
          url: page.data.meta_image.url || '',
        },
      ],
    },
  };
}

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID('page', params.uid, {
      lang: params.lang,
    })
    .catch(() => notFound());

  return (
    <Layout doc={page} lang={params.lang}>
      <SliceZone slices={page.data.slices} components={components} />
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  /**
   * Query all Documents from the API, except the homepage.
   */
  const pages = await client.getAllByType('page', {
    predicates: [prismic.filter.not('my.page.uid', 'home')],
    lang: '*',
  });

  /**
   * Define a path for every Document.
   */
  return pages.map((page) => {
    return { uid: page.uid, lang: page.lang };
  });
}
