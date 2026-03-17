import { Outfit } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import ToastProvider from "../../providers/ToastProvider";
import AuthProvider from "@/context/AuthContext";
import { AppProviders } from "../../providers/app-providers";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | AlphaHome",
    default: "AlphaHome",
  },
  description: "AlphaHome Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AppProviders>
          <ThemeProvider>
            <SidebarProvider>
              <AuthProvider>
                {children}
                <ToastProvider />
              </AuthProvider>
            </SidebarProvider>
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  );
}
