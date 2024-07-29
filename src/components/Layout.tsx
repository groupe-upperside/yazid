import ContactFooter from './ContactFooter';
import Footer from './Footer';
import Header from './Header';
import type { Content } from '@prismicio/client';

interface LayoutProps {
  doc: Content.AllDocumentTypes;
  children: React.ReactNode;
}

export default function Layout({ doc, children }: LayoutProps) {
  return (
    <>
      <Header doc={doc} />
      <main>{children}</main>
      <ContactFooter />
      <Footer />
    </>
  );
}
