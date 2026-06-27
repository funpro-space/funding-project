import type { NextConfig } from "next";

// Enforce validation of critical build-time environment variables in production
if (process.env.NODE_ENV === "production") {
  const requiredEnvs = {
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_ONCHAINKIT_API_KEY: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY,
  };

  const missingOrPlaceholder: string[] = [];

  for (const [key, value] of Object.entries(requiredEnvs)) {
    if (!value) {
      missingOrPlaceholder.push(`${key} is missing`);
    } else if (
      value.toLowerCase().includes("placeholder") ||
      value === "clx123abc0000000000000000"
    ) {
      missingOrPlaceholder.push(`${key} is using a placeholder ("${value}")`);
    }
  }

  if (missingOrPlaceholder.length > 0) {
    console.error("\n==================================================================");
    console.error("❌ CRITICAL ERROR: BUILD FAILED DUE TO MISSING/INVALID ENV VARIABLES");
    console.error("The following build-time environment variables are missing or invalid:");
    missingOrPlaceholder.forEach((msg) => console.error(`  - ${msg}`));
    console.error("\nTo secure and build the production app successfully, please provide");
    console.error("valid environment variables. If you are building via Cloud Build,");
    console.error("ensure the trigger is passing the actual variables as build arguments.");
    console.error("==================================================================\n");
    process.exit(1);
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
