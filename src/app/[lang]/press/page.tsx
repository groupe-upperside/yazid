import { PrismicRichText, SliceZone } from '@prismicio/react';
import type { Metadata } from 'next';

import Layout from '@/components/Layout';
import { createClient } from '@/prismicio';
import { components } from '@/slices';

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle('press', {
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
  const page = await client.getSingle('press', {
    lang,
  });

  return (
    <Layout doc={page} lang={lang}>
      <div className="flex flex-col justify-center gap-8 bg-[#F7F4EF] px-6 pb-6 pt-12 font-avenir tracking-widest md:px-20 md:pt-20 xl:px-32 xl:pt-32">
        <div className="flex flex-col items-center justify-center gap-4 md:gap-8">
          <h1
            className={`text-center text-xl font-medium uppercase tracking-widest text-gray-900 md:text-3xl xl:text-4xl`}
          >
            {page.data.title}
          </h1>
          <PrismicRichText
            field={page.data.description}
            components={{
              paragraph: ({ children }) => (
                <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
              ),
            }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:px-10">
          <SliceZone slices={page.data.slices} components={components} />
        </div>
      </div>
    </Layout>
  );
}
