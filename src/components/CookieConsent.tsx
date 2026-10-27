'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const GA_MEASUREMENT_ID = 'G-VSX2GL5XBH';
const STORAGE_KEY = 'cookie-consent';
const OPEN_EVENT = 'cookie-consent:open';

type Consent = 'granted' | 'denied';

const readConsent = (): Consent | null => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
};

const clearAnalyticsCookies = () => {
  const domain = window.location.hostname.replace(/^www\./, '');
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (!name.startsWith('_ga')) return;
    [undefined, domain, `.${domain}`].forEach((d) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ''}`;
    });
  });
};

/**
 * Opens the consent banner again (used by the « Gérer mes cookies » footer link).
 */
export const ManageCookiesButton = ({ label }: { label: string }) => (
  <button
    type="button"
    className="text-left text-sm uppercase"
    onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
  >
    {label}
  </button>
);

/**
 * Consent banner (CNIL): Google Analytics is only loaded once the visitor accepts.
 */
export default function CookieConsent({ lang }: { lang: string }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [open, setOpen] = useState(false);
  const isFr = lang.includes('fr');

  useEffect(() => {
    const saved = readConsent();
    setConsent(saved);
    setOpen(saved === null);

    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const choose = (value: Consent) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setOpen(false);

    // GA can't be unloaded once running: drop its cookies and reload without it.
    if (value === 'denied' && consent === 'granted') {
      clearAnalyticsCookies();
      window.location.reload();
      return;
    }
    setConsent(value);
  };

  return (
    <>
      {consent === 'granted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}
      {open && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={isFr ? 'Gestion des cookies' : 'Cookie settings'}
          className="fixed inset-x-0 bottom-0 z-[1000] border-t border-[#707070] bg-[#F7F4EF] p-4 font-avenir tracking-widest shadow-lg md:p-6"
        >
          <div className="mx-auto flex max-w-screen-xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-black md:text-base">
              {isFr
                ? "Nous utilisons des cookies de mesure d'audience (Google Analytics) pour améliorer notre site. Vous pouvez les accepter ou les refuser, et modifier votre choix à tout moment via « Gérer mes cookies » en bas de page."
                : 'We use audience measurement cookies (Google Analytics) to improve our website. You can accept or refuse them, and change your choice at any time via “Manage cookies” at the bottom of the page.'}
            </p>
            <div className="flex shrink-0 gap-4">
              <button
                type="button"
                onClick={() => choose('denied')}
                className="border border-black px-6 py-3 text-sm font-medium uppercase text-black"
              >
                {isFr ? 'Refuser' : 'Refuse'}
              </button>
              <button
                type="button"
                onClick={() => choose('granted')}
                className="border border-black bg-black px-6 py-3 text-sm font-medium uppercase text-white"
              >
                {isFr ? 'Accepter' : 'Accept'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
