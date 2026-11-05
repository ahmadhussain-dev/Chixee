import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartButton from "@/components/cart/CartButton";
import CartDrawer from "@/components/cart/CartDrawer";
import LocationModal from "@/components/location/LocationModal";
import OrderBar from "@/components/orders/OrderBar";
import { ItemModalProvider } from "@/context/ItemModalContext";

export default function ShopChrome({ children }) {
  return (
    <ItemModalProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
      <Header />
      <div id="main">{children}</div>
      <Footer />
      <OrderBar />
      <CartButton />
      <CartDrawer />
      <LocationModal />
    </ItemModalProvider>
  );
}
