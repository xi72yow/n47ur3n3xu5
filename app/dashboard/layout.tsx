export const metadata = {
  title: "NatureNexus | Dashboard",
  description: "A Nature Database",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
