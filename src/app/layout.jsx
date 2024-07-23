import "./globals.scss";
import { ShoppingBagProvider } from '@/app/components/shopping_bag_context';
import { oswald, bebasNeue, dmMono } from '@/app/fonts/fonts';


export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" >
      <body className={`${oswald.variable} ${bebasNeue.variable} ${dmMono.variable}`}>
        <ShoppingBagProvider>
          {children}
        </ShoppingBagProvider>
      </body>
    </html>
  );
}
