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
import InvoiceViewPage from './pages/InvoiceViewPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AppErrorScreen from './components/system/AppErrorScreen';

function Layout() {
  return (
    <div className="min-h-dvh flex flex-col bg-background">
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
  errorComponent: ({ error }) => (
    <AppErrorScreen 
      message="Navigation Error" 
      details={error?.message || 'An error occurred while navigating'}
    />
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <a href="/" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg">
          Go Home
        </a>
      </div>
    </div>
  ),
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

const invoiceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/invoice/$invoiceId',
  component: InvoiceViewPage,
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
  invoiceRoute,
]);

const router = createRouter({ 
  routeTree,
  defaultErrorComponent: ({ error }) => (
    <AppErrorScreen 
      message="Router Error" 
      details={error?.message || 'An unexpected error occurred'}
    />
  ),
});

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
