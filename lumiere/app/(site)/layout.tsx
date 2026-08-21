import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Great_Vibes } from "next/font/google";

export const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}