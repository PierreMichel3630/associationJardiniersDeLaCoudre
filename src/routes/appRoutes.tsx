import { HomePage } from "../pages/HomePage";
import { AccueilPage } from "../pages/AccueilPage";
import { AdherentAdminPage } from "../pages/admin/AdherentAdminPage";
import { ParcelleAdminPage } from "../pages/admin/ParcelleAdminPage";
import { SiteAdminPage } from "../pages/admin/SiteAdminPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { GestionAttributionsPage } from "../pages/admin/GestionAttributionsPage";
import { BilanPage } from "../pages/admin/BilanPage";

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
            <ParcelleAdminPage />
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
      {
        path: "/bilan",
        element: (
          <ProtectedRoute>
            <BilanPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
];
