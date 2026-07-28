import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the trace root to this project. A lockfile further up the home
  // directory otherwise wins the inference and Next traces the wrong tree.
  outputFileTracingRoot: import.meta.dirname,
  images: {
    // Licensed editorial photography is fetched from these hosts and recorded
    // in public/media/LICENSES.md. Anything not listed here cannot be published.
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default withNextIntl(nextConfig);
