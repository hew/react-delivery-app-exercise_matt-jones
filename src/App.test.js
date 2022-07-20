import { fetchDeliveries, storeDeliveries } from './lib/deliveries';

jest.useFakeTimers();

describe('fetchDeliveries', function() {
    it('returns more than 1 delivery object and more than 1 order item', () => {
        const deliveries = fetchDeliveries('2022-01-02');
    
        expect(deliveries.length).toBeGreaterThan(1);
        expect(deliveries[0].orderItems.length).toBeGreaterThan(1);
    });

    it('generates sequential ids for deliveries and orderItems', () => {
        const deliveries = fetchDeliveries('2022-01-02');

        expect(deliveries[0].id).toBeLessThan(deliveries[1].id);
        expect(deliveries[0].orderItems[0].id).toBeLessThan(deliveries[0].orderItems[1].id);
    });
    
    it('returns a set of valid delivery objects when calling fetchDeliveries with a day key in YYYY-MM-DD', () => {
        const deliveries = fetchDeliveries('2022-01-02');
    
        expect(deliveries[0]).toHaveProperty('id')
        expect(deliveries[0]).toHaveProperty('deliverAt');
        expect(deliveries[0]).toHaveProperty('client');
        expect(deliveries[0]).toHaveProperty('restaurant');
        expect(deliveries[0]).toHaveProperty('pickupAt');
        expect(deliveries[0]).toHaveProperty('state');
        expect(deliveries[0]).toHaveProperty('pickupAddress');
        expect(deliveries[0]).toHaveProperty('deliveryAddress');
        expect(deliveries[0]).toHaveProperty('orderItems');

        expect(deliveries[0].orderItems[0]).toHaveProperty('id');
        expect(deliveries[0].orderItems[0]).toHaveProperty('qty');
        expect(deliveries[0].orderItems[0]).toHaveProperty('description');
        expect(deliveries[0].orderItems[0]).toHaveProperty('price');
    });

    it('returns the same set of delivery objects when called twice with the same day key in YYYY-MM-DD', () => {
        const deliveries1 = fetchDeliveries('2022-01-02');
        const deliveries2 = fetchDeliveries('2022-01-02');

        //toBe will do a deep comparison on referrential fail
        expect(JSON.stringify(deliveries1[0])).toEqual(JSON.stringify(deliveries2[0]))
    });

    it('returns a new set of delivery objects when called twice with different day keys in YYYY-MM-DD', () => {
        const deliveries1 = fetchDeliveries('2022-01-02');
        const deliveries2 = fetchDeliveries('2022-01-03');

        expect(deliveries1[0]).not.toBe(deliveries2[0])
    });
});

describe('storeDeliveries', () => {
    it('properly stores the new state of the deliveries to be fetched later', () => {
        const deliveries1 = fetchDeliveries('2022-01-02');
        expect(deliveries1[0].state).toEqual('scheduled');
        deliveries1[0].state = 'driver_confirmed';
        
        storeDeliveries('2022-01-02', deliveries1);

        const deliveries2 = fetchDeliveries('2022-01-02');    
        expect(deliveries2[0].state).toEqual('driver_confirmed');
        expect(deliveries2[0].id).toEqual(deliveries1[0].id);
    })
});
