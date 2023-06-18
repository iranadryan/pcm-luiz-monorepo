type ServiceOrderStatus = 'OPEN' | 'CLOSED' | 'LAUNCHED' | 'SCHEDULED';

export interface ServiceOrder {
  number: number | null;
  status: ServiceOrderStatus;
  id: string;
  truck: {
    plate: string;
  };
  startDate: Date;
  endDate: Date | null;
  driver: {
    name: string;
  };
}
