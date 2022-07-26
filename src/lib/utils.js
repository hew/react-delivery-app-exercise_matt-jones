/**
 * Randomly returns a value from an array
 * @param {Array.<*>} arr 
 * @returns {*}
 */
export function sample(arr) {
    return arr[randomInteger(0, arr.length-1)];
}

/**
 * Returns a random integer between a min and max interval.
 * @param {number} min 
 * @param {number) max
 * @returns {number}
 */
export function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

