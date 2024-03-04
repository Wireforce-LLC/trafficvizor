/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * ITS TEMPORARY
   */
  eslint: {
    ignoreDuringBuilds: true,
  },
  // !! WARN !!
  // Dangerously allow production builds to successfully complete even if
  // your project has type errors.
  // !! WARN !!
  ignoreBuildErrors: true,
};

export default nextConfig;
