import svgr from "next-plugin-svgr";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...svgr(),
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
