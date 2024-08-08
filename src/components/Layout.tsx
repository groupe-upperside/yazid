import type { Content } from '@prismicio/client';

import ContactFooter from './ContactFooter';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  doc: Content.AllDocumentTypes;
  children: React.ReactNode;
  lang: string;
}

export default function Layout({ doc, children, lang }: LayoutProps) {
  return (
    <>
      <Header doc={doc} lang={lang} />
      <main>{children}</main>
      <ContactFooter lang={lang} />
      <Footer lang={lang} />
    </>
  );
}
