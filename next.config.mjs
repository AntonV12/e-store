import svgr from "next-plugin-svgr";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...svgr(),
};

export default nextConfig;
