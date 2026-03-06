import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import AppErrorScreen from "./components/system/AppErrorScreen";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import GalleryPage from "./pages/GalleryPage";
import IncomePage from "./pages/IncomePage";
import PublicBookingsPage from "./pages/PublicBookingsPage";
import ReviewsPage from "./pages/ReviewsPage";
import ServicesPage from "./pages/ServicesPage";
import ShopPage from "./pages/ShopPage";

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
      details={error?.message || "An error occurred while navigating"}
    />
  ),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Go Home
        </a>
      </div>
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: ShopPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: ServicesPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: GalleryPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/booking",
  component: BookingPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const reviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reviews",
  component: ReviewsPage,
});

const trackBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track",
  component: PublicBookingsPage,
});

const allBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bookings",
  component: AdminBookingsPage,
});

const incomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/income",
  component: IncomePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  servicesRoute,
  galleryRoute,
  bookingRoute,
  contactRoute,
  reviewsRoute,
  trackBookingsRoute,
  allBookingsRoute,
  incomeRoute,
]);

const router = createRouter({
  routeTree,
  defaultErrorComponent: ({ error }) => (
    <AppErrorScreen
      message="Router Error"
      details={error?.message || "An unexpected error occurred"}
    />
  ),
});

declare module "@tanstack/react-router" {
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
