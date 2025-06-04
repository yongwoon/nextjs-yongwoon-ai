import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/i18n/request.tsx',
  experimental: {
    createMessagesDeclaration: './messages/en.json'
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

export default withNextIntl(nextConfig);