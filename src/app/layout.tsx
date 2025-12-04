import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import ReduxProvider from "@/lib/ReduxProvider";
import ToastNotification from "@/components/ToastNotification";
import "@/styles/App.scss";
import "@/styles/Accessibility.scss";

export const metadata: Metadata = {
  title: "Airline Management System",
  description: "Modern airline check-in and in-flight management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ReduxProvider>
              {children}
              <ToastNotification />
            </ReduxProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
