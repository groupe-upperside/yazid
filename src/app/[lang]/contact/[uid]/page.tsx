import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SliceZone } from '@prismicio/react';
import * as prismic from '@prismicio/client';

import { createClient } from '@/prismicio';
import { components } from '@/slices';
import Layout from '@/components/Layout';

type Params = { uid: string; lang: string };

/**
 * This page renders a Prismic Document dynamically based on the URL.
 */

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const client = createClient();
  const page = await client.getByUID('contact', params.uid, { lang: params.lang }).catch(() => notFound());

  return {
    title: page.data.meta_title,
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
    .getByUID('contact', params.uid, {
      lang: params.lang,
    })
    .catch(() => notFound());

  return (
    <Layout doc={page}>
      <SliceZone slices={page.data.slices} components={components} />
    </Layout>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  /**
   * Query all Documents from the API, except the homepage.
   */
  const pages = await client.getAllByType('contact', {
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
