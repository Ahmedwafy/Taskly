// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   /* config options here */

//   // For production builds (Webpack)
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/i,
//       use: [{ loader: '@svgr/webpack', options: { icon: true } }],
//     });
//     return config;
//   },

//   // For active local development server and production (Turbopack)
//   turbopack: {
//     rules: {
//       '*.svg': {
//         loaders: [{ loader: '@svgr/webpack', options: { icon: true } }],
//         as: '*.js',
//       },
//     },
//   },
// };

// export default nextConfig;
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.2'],

  // For production builds (Webpack)
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
    });
    return config;
  },

  // For active local development server and production (Turbopack)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [{ loader: '@svgr/webpack', options: { icon: true } }],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
