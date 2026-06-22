/** @type {import('next').NextConfig} */

// When building for GitHub Pages (PAGES=true), emit a static export served
// from the /ved sub-path. Local dev/build are unaffected.
const isPages = process.env.PAGES === "true";

const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  ...(isPages
    ? {
        output: "export",
        basePath: "/ved",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
