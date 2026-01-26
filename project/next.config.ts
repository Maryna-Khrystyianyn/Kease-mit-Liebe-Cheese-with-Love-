import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    // Beispiel: zusätzliche Dateien oder Ordner, die ins Deployment aufgenommen werden sollen
    "pages/api/**": ["./some-extra-file.txt"]
  }
};

export default nextConfig;