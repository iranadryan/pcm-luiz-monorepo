export type ServiceOrderStatus = 'OPEN' | 'CLOSED' | 'LAUNCHED' | 'SCHEDULED';

export interface IServiceOrder {
  id: string;
  number: number | null;
  status: ServiceOrderStatus;
  startDate: Date;
  endDate: Date | null;
  truck: {
    plate: string;
  };
  driver: {
    name: string;
  };
}
