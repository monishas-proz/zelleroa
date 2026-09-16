import type { NextConfig } from "next";

// Ensure Node memory allocation is 4GB across all Next.js worker threads
if (!process.env.NODE_OPTIONS?.includes("max-old-space-size")) {
  process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ""} --max-old-space-size=4096`.trim();
}

const nextConfig: NextConfig = {
  // typescript: {
  //   ignoreBuildErrors: false,
  // },
  // Cache recently visited pages to avoid recompilation thrashing, while freeing inactive pages after 3 minutes
  onDemandEntries: {
    maxInactiveAge: 180 * 1000,
    pagesBufferLength: 6,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  serverExternalPackages: [
    "@prisma/adapter-mariadb",
    "mariadb",
    "@whiskeysockets/baileys",
    "pino",
    "razorpay",
  ],

  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@tanstack/react-table",
      "@tanstack/react-query",
    ],
  },

  webpack: (config) => {
    // Baileys rewrites its session/key files under auth_baileys/ continuously
    // while a WhatsApp socket is connected. Without this, webpack's dev-server
    // watcher picks up every write and triggers a full page reload.
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ["**/node_modules/**", "**/auth_baileys/**"],
    };
    return config;
  },
};

export default nextConfig;
