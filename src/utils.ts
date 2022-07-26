import { Sort } from './globals';
import {Delivery, DeliveryStates} from './lib/deliveries';

/**
 * Helper to make the states human-readable.
 */
export const statesMap = {
  scheduled: 'This order is scheduled for you.',
  driver_confirmed: 'You have confirmed this order.',
  driver_at_restaurant: 'You are currently at the restaurant.',
  picked_up: 'You have picked up the order',
  driver_at_client: 'You are at current at the client.',
  delivered: 'Your order has been delivered',
};

/**
 * Helper for the card background colors
 */
export const colorsMap = {
  scheduled: 'card-scheduled',
  driver_confirmed: 'card-confirmed',
  driver_at_restaurant: 'card-at-restaurant',
  picked_up: 'card-picked-up',
  driver_at_client: 'card-at-client',
  delivered: 'card-delivered',
};



/**
 * Sorting fuction
 */
export function sortFunc (sort: string) {
  return function(a: Delivery, b: Delivery) {

  // This repetition be further abstracted.

  if (sort === Sort.SCHEDULED) {
    const sch = DeliveryStates.SCHEDULED;

    if (a.state === sch && b.state !== sch) {
      return -1;
    }

    if (a.state !== sch && b.state === sch) {
      return 1;
    } else return 0;
  }

  if (sort === Sort.CONFIRMED) {
    const cnf = DeliveryStates.DRIVER_CONFIRMED;

    if (a.state === cnf && b.state !== cnf) {
      return -1;
    }

    if (a.state !== cnf && b.state === cnf) {
      return 1;
    } else return 0;
  }

  if (sort === Sort.ARRIVED_AT_RESTAURANT) {
    const arr = DeliveryStates.DRIVER_AT_RESTAURANT;

    if (a.state === arr && b.state !== arr) {
      return -1;
    }

    if (a.state !== arr && b.state === arr) {
      return 1;
    } else return 0;
  }

  if (sort === Sort.PICKED_UP) {
    const pu = DeliveryStates.PICKED_UP;

    if (a.state === pu && b.state !== pu) {
      return -1;
    }

    if (a.state !== pu && b.state === pu) {
      return 1;
    } else return 0;
  }

  if (sort === Sort.ARRIVED_AT_CLIENT) {
    const at = DeliveryStates.DRIVER_AT_CLIENT;

    if (a.state === at && b.state !== at) {
      return -1;
    }

    if (a.state !== at && b.state === at) {
      return 1;
    } else return 0;
  }

  if (sort === Sort.DELIVERED) {
    const del = DeliveryStates.DELIVERED;

    if (a.state === del && b.state !== del) {
      return -1;
    }

    if (a.state !== del && b.state === del) {
      return 1;
    } else return 0;
  }

  return 0;
}
};
