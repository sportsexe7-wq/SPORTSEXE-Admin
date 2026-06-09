import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { MediaPage } from '@/pages/MediaPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { OrdersPage } from '@/pages/OrdersPage'
import { OrderDetailPage } from '@/pages/OrderDetailPage'
import { CouponsPage } from '@/pages/CouponsPage'
import { BannersPage } from '@/pages/BannersPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { SettingsPage } from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'media', element: <MediaPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'coupons', element: <CouponsPage /> },
      { path: 'banners', element: <BannersPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
