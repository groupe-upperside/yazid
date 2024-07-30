import './global.css';

import { PrismicPreview } from '@prismicio/next';
import type { Metadata } from 'next';

import MarkerComponent from '@/components/MarkerIoComponent';
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
    <html lang="en">
      <body className="font-avenir tracking-wide">
        <MarkerComponent />
        {children}
      </body>
      <PrismicPreview repositoryName={repositoryName} />
    </html>
  );
}
