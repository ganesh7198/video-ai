"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "@imagekit/next";

const urlEndpoint = process.env.NEXT_PUBLIC_END_POINT!;

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ImageKitProvider urlEndpoint={urlEndpoint}>
        {children}
      </ImageKitProvider>
    </SessionProvider>
  );
}