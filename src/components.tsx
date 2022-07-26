import './App.css';
import {Days, Sort, State, UpdateStatus} from './globals';
import {Delivery, DeliveryStates, OrderItem} from './lib/deliveries.js';
import {Link, useParams} from 'react-router-dom';
import {ChangeEvent} from 'react';
import {statesMap, colorsMap} from './utils';

/*
 * Catch-all component for any routes that are not recognized.
 */
export function NotFound() {
  return (
    <>
      <h1>Not Found</h1>
      <Link className="return-home-button" to="/">
        Return Home
      </Link>
    </>
  );
}

/*
 * CTA Component - allows the driver to increment their way through the different states
 */
interface CallToActionProps {
  delivery: Delivery;
  updateStatus: UpdateStatus;
  appState: any;
}
export function CallToAction({delivery, updateStatus, appState}: CallToActionProps) {
  // our booleans
  const isScheduled = delivery.state === DeliveryStates.SCHEDULED;
  const isConfirmed = delivery.state === DeliveryStates.DRIVER_CONFIRMED;
  const isAtRestaurant = delivery.state === DeliveryStates.DRIVER_AT_RESTAURANT;
  const isPickedUp = delivery.state === DeliveryStates.PICKED_UP;
  const isAtClient = delivery.state === DeliveryStates.DRIVER_AT_CLIENT;
  const isToday = appState.day.value === Days.TODAY;

  // handle buttons
  const handleDriverAccept = () =>
    updateStatus(delivery.id, DeliveryStates.DRIVER_CONFIRMED);
  const handleArrivedAtRestaurant = () =>
    updateStatus(delivery.id, DeliveryStates.DRIVER_AT_RESTAURANT);
  const handleDriverDelivered = () =>
    updateStatus(delivery.id, DeliveryStates.DELIVERED);
  const handleDriverCompletePickup = () =>
    updateStatus(delivery.id, DeliveryStates.PICKED_UP);
  const handleDriverArriveAtClient = () =>
    updateStatus(delivery.id, DeliveryStates.DRIVER_AT_CLIENT);

  return (
    <>
      {isScheduled && isToday && <button onClick={handleDriverAccept}>Accept</button>}
      {isConfirmed && isToday && (
        <button onClick={handleArrivedAtRestaurant}>Arrive at Restaurant</button>
      )}
      {isPickedUp && isToday && (
        <button onClick={handleDriverArriveAtClient}>Arrive at Client</button>
      )}
      {isAtRestaurant && isToday && (
        <button onClick={handleDriverCompletePickup}>Complete Pickup</button>
      )}
      {isAtClient && isToday && (
        <button onClick={handleDriverDelivered}>Complete Delivery</button>
      )}
    </>
  );
}

/*
 * Display a single delivery as a card
 */
interface DeliveryCardProps {
  delivery: Delivery;
  updateStatus: UpdateStatus;
  appState: State;
}
export function DeliveryCard({delivery, updateStatus, appState}: DeliveryCardProps) {
  const {id, client, orderItems, restaurant, pickupAt, deliverAt, state} = delivery;
  const date =
    delivery.state === DeliveryStates.PICKED_UP
      ? {text: 'Pickup Time', value: new Date(pickupAt).toLocaleTimeString()}
      : {text: 'Delivery Time', value: new Date(deliverAt).toLocaleTimeString()};

  return (
    /* @ts-ignore */
    <div data-testid={delivery.state} className={`card ${colorsMap[delivery.state]}`}>
      <h2>Delivery #{id}</h2>
      <div className="card-body">
        <div>
          <p>Client: {client}</p>
          <p>Restaurant: {restaurant}</p>
          <p>Items: {orderItems.length} </p>
          {/* @ts-ignore */}
          <p>State: {statesMap[state]}</p>
          <p>
            {date.text}: {date.value}
          </p>
        </div>
        <div>
          <p className="view-items-link">
            <Link to={`/${delivery.id}/items`} state={delivery.id}>
              View Items
            </Link>
          </p>
          <CallToAction
            delivery={delivery}
            appState={appState}
            updateStatus={updateStatus}
          />
        </div>
      </div>
    </div>
  );
}

/*
 * Display The List of Delivery Items
 */
interface DeliveryItemsProps {
  updateStatus: UpdateStatus;
  appState: State;
}
export function DeliveryItems({updateStatus, appState}: DeliveryItemsProps) {
  const {deliveries} = appState;
  const {id} = useParams();
  const delivery: Delivery | undefined = deliveries.find(
    each => each.id === parseInt(id as string),
  );

  if (!delivery) {
    return <NotFound />;
  }

  return (
    <>
      <h1>Showing Items for Delivery #{delivery?.id}</h1>
      <CallToAction
        delivery={delivery}
        updateStatus={updateStatus}
        appState={appState}
      />
      <Link className="back-button" to="/">
        Back to All Orders
      </Link>
      {delivery.orderItems.map((each: OrderItem, idx: number) => {
        const {qty, description, price} = each;
        return (
          <div key={idx} className="card">
            <div className="card-body">
              <div>
                <p>{description}</p>
                <p>Quantity: {qty}</p>
                <p>${price}</p>
              </div>
              {delivery.state === DeliveryStates.DRIVER_AT_CLIENT && (
                <form className="delivered">
                  <label>Delivered</label>
                  <input type="checkbox" name="delivered" />
                </form>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

/*
 * Display The List of Deliveries
 */
interface DeliveriesProps {
  updateStatus: UpdateStatus;
  dispatch: any;
  appState: State;
}
export function Deliveries({updateStatus, dispatch, appState}: DeliveriesProps) {
  const {day, sort, deliveries} = appState;
  const handleViewDate = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({type: e.target.value});
  };
  const handleSort = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({type: e.target.value});
  };

  return (
    <>
      <h1>Showing Deliveries for {day.label}</h1>
      <form className="deliveries-form">
        <label>Date</label>
        <select
          data-testid="select-day"
          defaultValue={day.value}
          onChange={handleViewDate}
        >
          <option value={Days.TODAY}>Display Today</option>
          <option value={Days.TOMORROW}>Display Tomorrow</option>
        </select>
        <label>Sorting</label>
        <select data-testid="select-sort" defaultValue={sort} onChange={handleSort}>
          <option value={Sort.SCHEDULED}>Sort By Scheduled</option>
          <option value={Sort.CONFIRMED}>Sort By Confirmed</option>
          <option value={Sort.ARRIVED_AT_RESTAURANT}>
            Sort By Arrived at Restaurant
          </option>
          <option value={Sort.PICKED_UP}>Sort By Picked Up</option>
          <option value={Sort.ARRIVED_AT_CLIENT}>Sort By Arrived At Client</option>
          <option value={Sort.DELIVERED}>Sort By Delivered</option>
        </select>
      </form>
      <div data-testid="deliveries">
        {deliveries.map((each: Delivery, idx: number) => {
          return (
            <DeliveryCard
              key={idx}
              appState={appState}
              delivery={each}
              updateStatus={updateStatus}
            />
          );
        })}
      </div>
    </>
  );
}
