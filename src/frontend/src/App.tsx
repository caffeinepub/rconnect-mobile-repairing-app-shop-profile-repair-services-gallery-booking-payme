import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import ShopPage from './pages/ShopPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import BookingPage from './pages/BookingPage';
import PaymentsPage from './pages/PaymentsPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import PublicBookingsPage from './pages/PublicBookingsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ShopPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: ServicesPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: GalleryPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/booking',
  component: BookingPage,
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payments',
  component: PaymentsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const reviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reviews',
  component: ReviewsPage,
});

const bookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookings',
  component: PublicBookingsPage,
});

const adminBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/bookings',
  component: AdminBookingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  servicesRoute,
  galleryRoute,
  bookingRoute,
  paymentsRoute,
  contactRoute,
  reviewsRoute,
  bookingsRoute,
  adminBookingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
