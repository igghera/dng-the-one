export function getClosestValue(arr, goal) {
  return arr.reduce((prev, curr) => {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
  })
}
