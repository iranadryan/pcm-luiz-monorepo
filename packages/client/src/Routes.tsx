import {
  Routes as RouterDomRoutes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';

import { ListServiceOrders } from './pages/ListServiceOrders';
import { NewServiceOrder } from './pages/NewServiceOrder';
import { ViewServiceOrder } from './pages/ViewServiceOrder';
import { EditServiceOrder } from './pages/EditServiceOrder';
import { DuplicateServiceOrder } from './pages/DuplicateServiceOrder';
import { ListTrucks } from './pages/ListTrucks';
import { ListServices } from './pages/ListServices';
import { ListProducts } from './pages/ListProducts';
import { ListPeople } from './pages/ListPeople';
import { ListUsers } from './pages/ListUsers';
import { ServiceOrderDashboard } from './pages/ServiceOrderDashboard';
import { Login } from './pages/Login';
import { useAuthContext } from './contexts/AuthContext';

function PrivateRoutes() {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function Routes() {
  const { user } = useAuthContext();

  return (
    <RouterDomRoutes>
      <Route
        path="login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route element={<PrivateRoutes />}>
        <Route index element={<Navigate to="/service-orders" replace />} />
        <Route path="service-orders" element={<ListServiceOrders />} />
        <Route path="service-orders/new" element={<NewServiceOrder />} />
        <Route path="service-orders/view/:id" element={<ViewServiceOrder />} />
        <Route path="service-orders/edit/:id" element={<EditServiceOrder />} />
        <Route
          path="service-orders/duplicate/:id"
          element={<DuplicateServiceOrder />}
        />
        <Route
          path="service-orders-dashboard"
          element={<ServiceOrderDashboard />}
        />

        <Route path="trucks" element={<ListTrucks />} />
        <Route path="services" element={<ListServices />} />
        <Route path="products" element={<ListProducts />} />
        <Route path="people" element={<ListPeople />} />
        <Route path="users" element={<ListUsers />} />
      </Route>
    </RouterDomRoutes>
  );
}
