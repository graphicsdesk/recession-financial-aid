import { extent, bisectLeft, range, leastIndex } from 'd3-array';

let years = range(2003, 2018 + 1);

export function indexClosest(lines, x, y) {
  const indexRight = bisectLeft(years, x, 1);
  const indexLeft = indexRight - 1;
  const index =
    x - years[indexLeft] > years[indexRight] - x ? indexRight : indexLeft;
  return leastIndex(lines, ({ values }) => Math.abs(values[index] - y));
}

export function flatExtent(dataArray, accessor, scaleBounds) {
  const theExtent = extent(dataArray.map(data => data.data).flat(), accessor);
  if (scaleBounds) {
    const [a, b] = theExtent;
    const expansion = (scaleBounds - 1) * b;
    return [a - expansion, b + expansion];
  }
  return theExtent;
}

export function valuesExtent(series, scaleBounds) {
  const theExtent = extent(series.map(s => s.values).flat());
  if (scaleBounds) {
    const [a, b] = theExtent;
    const expansion = (scaleBounds - 1) * b;
    return [a - expansion, b + expansion];
  }
  return theExtent;
}
