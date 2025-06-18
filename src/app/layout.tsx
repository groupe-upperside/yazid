import './global.css';

import { PrismicPreview } from '@prismicio/next';
import type { Metadata } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';

import { createClient, repositoryName } from '@/prismicio';

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();

  const settings = await client.getSingle('meta');

  return {
    title: settings.data.site_title,
    description: settings.data.meta_description,
    openGraph: {
      images: [settings.data.og_image.url || ''],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <Head>
        <link rel="preconnect" href="https://app.snipcart.com" />
        <link rel="preconnect" href="https://cdn.snipcart.com" />
      </Head>
      <body className="font-avenir tracking-wide">
        <script async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=yazid"></script>
        <Script
          async
          src="https://cdn.snipcart.com/themes/v3.7.4/default/snipcart.js"
          id="snipcart"
          data-api-key={process.env.SNIPCART_KEY}
          data-config-add-product-behavior="none"
          data-cart-custom1-name="Date de retrait"
          data-cart-custom1-required="true"
          data-cart-custom2-name="Créneau horaire"
          data-cart-custom2-required="true"
        ></Script>
        <div>
          <Toaster />
        </div>
        {children}
      </body>
      <PrismicPreview repositoryName={repositoryName} />
    </html>
  );
}
