import type { NextConfig } from "next";
import { env } from "process";

const nextConfig: NextConfig = {
  allowedDevOrigins: [(env.REPLIT_DOMAINS || "localhost").split(",")[0]],
};

module.exports = nextConfig;
