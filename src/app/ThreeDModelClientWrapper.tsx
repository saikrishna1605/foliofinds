// src/app/ThreeDModelClientWrapper.tsx
"use client";
import dynamic from "next/dynamic";

const ThreeDModel = dynamic(() => import("@/components/3DModel"), { ssr: false });

export default function ThreeDModelClientWrapper() {
  return <ThreeDModel />;
}
