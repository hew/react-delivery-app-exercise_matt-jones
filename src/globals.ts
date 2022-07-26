import {DeliveryStates, Delivery} from './lib/deliveries';

export enum Fetch {
  SUCCESS = 'DATA_LOADED',
  FAILURE = 'DATA_FAILED',
}

export enum Days {
  TODAY = 'LIST_TODAY',
  TOMORROW = 'LIST_TOMORROW',
}

export enum Sort {
  SCHEDULED = 'SORT_SCHEDULED',
  CONFIRMED = 'SORT_CONFIRMED',
  ARRIVED_AT_RESTAURANT = 'SORT_ARRIVED_AT_RESTAURANT',
  PICKED_UP = 'SORT_PICKED_UP',
  ARRIVED_AT_CLIENT = 'SORT_ARRIVED_AT_CLIENT',
  DELIVERED = 'SORT_DELIVERED',
}

export interface State {
  day: {
    time: string;
    label: string;
    value: Days;
  };
  sort: string;
  deliveries: Delivery[];
}

export type UpdateStatus = (id: number, state: DeliveryStates) => void;
