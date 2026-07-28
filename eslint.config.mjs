import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Diagrams and licensed photography are plain <img> on purpose. They are
      // either SVG (where next/image adds nothing) or already sized and served
      // from /public, and routing them through the image optimiser would strip
      // the SVG's internal theme-aware <style> block.
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
