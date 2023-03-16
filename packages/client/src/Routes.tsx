import { Routes as RouterDomRoutes, Route } from 'react-router-dom';

import { ListServiceOrders } from './pages/ListServiceOrders';
import { NewServiceOrder } from './pages/NewServiceOrder';
import { ViewServiceOrder } from './pages/ViewServiceOrder';

export function Routes() {
  return (
    <RouterDomRoutes>
      <Route index element={<ListServiceOrders />} />
      <Route path="new" element={<NewServiceOrder />} />
      <Route path="view/:id" element={<ViewServiceOrder />} />
    </RouterDomRoutes>
  );
}
