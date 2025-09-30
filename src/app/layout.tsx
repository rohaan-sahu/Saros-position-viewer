import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white">
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
