"use client";

import React from "react";
import Loader from "@/components/Loader";

export default function PrivacyLoading() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center">
      <Loader text="Loading Privacy Policy..." />
    </div>
  );
}
