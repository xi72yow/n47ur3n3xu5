import "./globals.css";

export const metadata = {
  title: "NatureNexus | Login",
  description: "A Nature Database",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
