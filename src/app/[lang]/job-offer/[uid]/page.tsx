import * as prismic from '@prismicio/client';
import { PrismicRichText, SliceZone } from '@prismicio/react';
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
  const page = await client.getByUID('job_offer', params.uid, { lang: params.lang }).catch(() => notFound());

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
    .getByUID('job_offer', params.uid, {
      lang: params.lang,
    })
    .catch(() => notFound());

  const { slices } = page.data;

  const topSlices = ['banner', 'page_title_underlined'];

  const divider = slices.filter((slice) => slice.slice_type === 'divider');

  const renderTopSlices = slices.filter((slice) => topSlices.includes(slice.slice_type));

  const sidebar = slices.filter((slice) => slice.slice_type === 'job_sidebar');

  return (
    <Layout doc={page} lang={params.lang}>
      <SliceZone slices={renderTopSlices} components={components} />
      <div className="grid grid-cols-1 gap-20 p-6 font-avenir tracking-widest md:p-20 xl:grid-cols-3 xl:p-32">
        <div className="col-span-3 xl:col-span-2">
          <div className="space-y-6">
            <PrismicRichText
              field={page.data.job_description}
              components={{
                paragraph: ({ children }) => (
                  <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
                ),
                list: ({ children }) => (
                  <ul className="list-inside list-disc text-sm tracking-widest text-[#707070] md:text-base">
                    {children}
                  </ul>
                ),
              }}
            />
          </div>
          <p className="mt-6 pb-2 text-justify text-base tracking-widest text-black md:text-lg">
            {page.data.skills_title}
          </p>
          <PrismicRichText
            field={page.data.skills}
            components={{
              paragraph: ({ children }) => (
                <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
              ),
              list: ({ children }) => (
                <ul className="list-inside list-disc text-sm tracking-widest text-[#707070] md:text-base">
                  {children}
                </ul>
              ),
            }}
          />
          <p className="mt-6 pb-2 text-justify text-base tracking-widest text-black md:text-lg">
            {page.data.soft_skills_title}
          </p>
          <PrismicRichText
            field={page.data.soft_skills}
            components={{
              paragraph: ({ children }) => (
                <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
              ),
              list: ({ children }) => (
                <ul className="list-inside list-disc text-sm tracking-widest text-[#707070] md:text-base">
                  {children}
                </ul>
              ),
            }}
          />
          <p className="mt-6 pb-2 text-justify text-base tracking-widest text-black md:text-lg">
            {page.data.profile_title}
          </p>
          <PrismicRichText
            field={page.data.profile}
            components={{
              paragraph: ({ children }) => (
                <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
              ),
              list: ({ children }) => (
                <ul className="list-inside list-disc text-sm tracking-widest text-[#707070] md:text-base">
                  {children}
                </ul>
              ),
            }}
          />
          <div className="py-6">
            <SliceZone slices={divider} components={components} />
          </div>
          {page.data.contracts_details.map((contract, index) => (
            <p key={index}>
              <span className="text-justify text-sm font-bold tracking-widest text-black md:text-base">
                {contract.title}
              </span>
              <span className="ml-1 text-justify text-sm tracking-widest text-[#707070] md:text-base">
                {contract.description}
              </span>
            </p>
          ))}
          <p className="py-8 text-justify text-base font-bold italic tracking-widest text-black md:text-lg">
            {page.data.join_us}
          </p>
        </div>
        <div className="col-span-3 xl:col-span-1">
          <SliceZone slices={sidebar} components={components} />
        </div>
      </div>
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
