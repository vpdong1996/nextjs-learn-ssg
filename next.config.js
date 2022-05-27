const fs = require('fs');
const path = require('path');

try {
  const files = fs
    .readdirSync('./')
    .filter((file) => file.endsWith('-db.json'));
  Promise.all(files.map((file) => fs.unlinkSync(path.resolve(file))));
} catch (error) {
  console.log('Error', error);
}

/* eslint-disable import/no-extraneous-dependencies */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  eslint: {
    dirs: ['.'],
  },
  poweredByHeader: false,
  trailingSlash: true,
  basePath: '',
  // The starter code load resources from `public` folder with `router.basePath` in React components.
  // So, the source code is "basePath-ready".
  // You can remove `basePath` if you don't need it.
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    if (dev || !isServer) return config;

    process.env.USE_CACHE = 'true';

    return config;
  },
});
