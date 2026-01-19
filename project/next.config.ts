/** @type {import('next').NextConfig} */ const nextConfig = {
  output: "standalone",
  experimental: {
    outputFileTracingIncludes: {
      "/app/api/**": ["./node_modules/pdfkit/js/data/**"],
    },
  },
};
export default nextConfig;
