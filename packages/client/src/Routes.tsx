import { Routes as RouterDomRoutes, Route, Navigate } from 'react-router-dom';

import { ListServiceOrders } from './pages/ListServiceOrders';
import { NewServiceOrder } from './pages/NewServiceOrder';
import { ViewServiceOrder } from './pages/ViewServiceOrder';
import { EditServiceOrder } from './pages/EditServiceOrder';
import { DuplicateServiceOrder } from './pages/DuplicateServiceOrder';
import { ListTrucks } from './pages/ListTrucks';
import { ListServices } from './pages/ListServices';
import { ListProducts } from './pages/ListProducts';
import { ListPeople } from './pages/ListPeople';
import { ServiceOrderDashboard } from './pages/ServiceOrderDashboard';

export function Routes() {
  return (
    <RouterDomRoutes>
      <Route index element={<Navigate to="/service-orders" />} />

      <Route path="service-orders" element={<ListServiceOrders />} />
      <Route path="service-orders/new" element={<NewServiceOrder />} />
      <Route path="service-orders/view/:id" element={<ViewServiceOrder />} />
      <Route path="service-orders/edit/:id" element={<EditServiceOrder />} />
      <Route path="service-orders/duplicate/:id" element={<DuplicateServiceOrder />} />
      <Route path="service-orders-dashboard" element={<ServiceOrderDashboard />} />

      <Route path="trucks" element={<ListTrucks />} />
      <Route path="services" element={<ListServices />} />
      <Route path="products" element={<ListProducts />} />
      <Route path="people" element={<ListPeople />} />
    </RouterDomRoutes>
  );
}
