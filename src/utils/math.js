/**
 * @param {number} x
 * @param {number} [min]
 * @param {number} [max]
 */
export function clamp(x, min = 0, max = 1) {
  return Math.min(Math.max(x, min), max);
}

/**
 * @param {number} x
 * @param {number} fromMin
 * @param {number} fromMax
 * @param {number} toMin
 * @param {number} toMax
 */
export function mapRange(x, fromMin, fromMax, toMin, toMax) {
  const fromRange = fromMax - fromMin; // Length of the source range
  const toRange = toMax - toMin; // Length of the target range
  const scaleFactor = toRange / fromRange; // Scale factor between ranges

  // Map the value then scale and shift to the new range
  return (x - fromMin) * scaleFactor + toMin;
}

/**
 * Quantizes a floating-point number to the nearest lower multiple of a given step.
 * @param {number} x - The value to quantize.
 * @param {number} step - The quantization step size.
 * @returns {number} The quantized value.
 */
export function quantize(x, step) {
  return Math.floor(x / step) * step;
}
