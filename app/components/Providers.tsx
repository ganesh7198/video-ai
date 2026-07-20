import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

const urlEndPoint=process.env.NEXT_PUBLIC_URI_ENDPOINT!;
export default function Providers({childrean}:{childrean:ReactNode}){
	return <SessionProvider refetchInterval={5*60}>
		<ImageKitProvider urlEndpoint={urlEndPoint}>
		{childrean}
		</ImageKitProvider>
		</SessionProvider>
}