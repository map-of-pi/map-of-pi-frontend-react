import Navbar from "@/components/navbar/Navbar";
import '../global.css';
export default function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  return (
    <html lang={locale}>
      <body>
      <Navbar />
        {children}
        </body>
    </html>
  );
}