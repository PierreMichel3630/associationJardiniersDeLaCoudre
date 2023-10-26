import { HomePage } from "../pages/HomePage";
import { AccueilPage } from "../pages/AccueilPage";
import { AdherentAdminPage } from "../pages/admin/AdherentAdminPage";
import { PlotAdminPage } from "../pages/admin/PlotAdminPage";
import { SiteAdminPage } from "../pages/admin/SiteAdminPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { GestionAttributionsPage } from "../pages/admin/GestionAttributionsPage";

export const AppRoutes = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "/",
        element: <AccueilPage />,
      },
      {
        path: "/admin-sites",
        element: (
          <ProtectedRoute>
            <SiteAdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-parcelles",
        element: (
          <ProtectedRoute>
            <PlotAdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin-adherants",
        element: (
          <ProtectedRoute>
            <AdherentAdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/gestion-attributions",
        element: (
          <ProtectedRoute>
            <GestionAttributionsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
