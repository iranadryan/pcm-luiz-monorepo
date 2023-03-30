import { Routes as RouterDomRoutes, Route } from 'react-router-dom';

import { ListServiceOrders } from './pages/ListServiceOrders';
import { NewServiceOrder } from './pages/NewServiceOrder';
import { ViewServiceOrder } from './pages/ViewServiceOrder';
import { EditServiceOrder } from './pages/EditServiceOrder';
import { DuplicateServiceOrder } from './pages/DuplicateServiceOrder';

export function Routes() {
  return (
    <RouterDomRoutes>
      <Route index element={<ListServiceOrders />} />
      <Route path="new" element={<NewServiceOrder />} />
      <Route path="view/:id" element={<ViewServiceOrder />} />
      <Route path="edit/:id" element={<EditServiceOrder />} />
      <Route path="duplicate/:id" element={<DuplicateServiceOrder />} />
    </RouterDomRoutes>
  );
}
