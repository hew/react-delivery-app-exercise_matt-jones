import moment from 'moment-timezone';
import {useMemo, useReducer} from 'react';
import {State, Days, Sort, Fetch} from './globals';
import {sortFunc} from './utils';
import {
  Delivery,
  DeliveryStates,
  fetchDeliveries,
  storeDeliveries,
} from './lib/deliveries';

const theWeek = {
  today: {time: moment().format('YYYY-MM-DD'), value: Days.TODAY, label: 'Today'},
  tomorrow: {
    time: moment().add(1, 'days').format('YYYY-MM-DD'),
    value: Days.TOMORROW,
    label: 'Tomorrow',
  },
};

export const initialState: State = {
  day: theWeek.today,
  sort: Sort.SCHEDULED,
  deliveries: [],
};

export function reducer(state: any, action: any) {
  switch (action.type) {
    case Fetch.SUCCESS:
      return {...state, deliveries: action.payload};
    case Fetch.FAILURE:
      throw new Error('Error', action.payload);
    case Days.TODAY:
      return {...state, day: theWeek.today};
    case Days.TOMORROW:
      return {...state, day: theWeek.tomorrow};
    case Sort.SCHEDULED:
      return {...state, sort: Sort.SCHEDULED};
    case Sort.CONFIRMED:
      return {...state, sort: Sort.CONFIRMED};
    case Sort.ARRIVED_AT_RESTAURANT:
      return {...state, sort: Sort.ARRIVED_AT_RESTAURANT};
    case Sort.PICKED_UP:
      return {...state, sort: Sort.PICKED_UP};
    case Sort.ARRIVED_AT_CLIENT:
      return {...state, sort: Sort.ARRIVED_AT_CLIENT};
    case Sort.DELIVERED:
      return {...state, sort: Sort.DELIVERED};
    default:
      throw new Error();
  }
}

export function useAppState() {
  const [appState, dispatch] = useReducer(reducer, initialState);
  const {deliveries, day, sort} = appState;

  useMemo(() => {
    const fetchData = async () => {
      try {
        const fetched = await fetchDeliveries(day.time);
        const sorted = fetched.sort(sortFunc(sort));
        dispatch({type: Fetch.SUCCESS, payload: sorted});
      } catch (err) {
        dispatch({type: Fetch.FAILURE, payload: err});
      }
    };

    fetchData();
  }, [day.time, sort]);

  const updateStatus = async (id: number, state: DeliveryStates) => {
    const found = deliveries.find((each: Delivery) => each.id === id);

    if (!found) {
      throw new Error(`Could not find delivery with id ${id}`);
    }

    const updated = {...found, state};
    const index = deliveries.findIndex((each: Delivery) => each.id === updated.id);
    const newDeliveries = [...deliveries];
    newDeliveries[index] = updated;
    // write to local storage
    await storeDeliveries(appState.day.time, newDeliveries);
    // optimistic update
    const sorted = newDeliveries.sort(sortFunc(sort));
    dispatch({type: 'DATA_LOADED', payload: sorted});
  };

  return {appState, dispatch, updateStatus};
}
