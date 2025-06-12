import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';

import sm from '../slicemachine.config.json';

/**
 * The project's Prismic repository name.
 */
export const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * The project's Prismic Route Resolvers. This list determines a Prismic document's URL.
 */
const routes: prismic.ClientConfig['routes'] = [
  { type: 'homepage', path: '/:lang' },
  {
    type: 'page',
    path: '/:lang/:uid',
  },
  {
    type: 'contact',
    path: '/:lang/contact/:uid',
  },
  {
    type: 'job_offer',
    path: '/:lang/job-offer/:uid',
  },
  {
    type: 'creations',
    path: '/:lang/creations',
  },
  {
    type: 'chef',
    path: '/:lang/chef',
  },
  {
    type: 'at_home',
    uid: 'at_home_new',
    path: '/:lang/at_home_new',
  },
  {
    type: 'cart',
    uid: 'cart',
    path: '/:lang/cart',
  },
  {
    type: 'coming_soon',
    uid: 'click_and_collect',
    path: '/:lang/click-and-collect',
  },
  {
    type: 'coming_soon',
    uid: 'bookings',
    path: '/:lang/reservations',
  },
  {
    type: 'coming_soon',
    uid: 'at_home',
    path: '/:lang/at-home',
  },
];

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(sm.apiEndpoint || repositoryName, {
    routes,
    fetchOptions:
      process.env.NODE_ENV === 'production'
        ? { next: { tags: ['prismic'] }, cache: 'force-cache' }
        : { next: { revalidate: 5 } },
    ...config,
  });

  prismicNext.enableAutoPreviews({ client });

  return client;
};
