import Header from '../components/Header';

// CSS
import '../css/output.css';

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Header />
        <main className='tw-mx-auto tw-max-w-7xl'>{children}</main>
      </body>
    </html>
  );
}
