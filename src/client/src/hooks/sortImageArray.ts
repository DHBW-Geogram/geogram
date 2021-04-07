import { Image } from "../model/Image";

export function sortImageArray(a: Image, b: Image): number {
  if (a.distance !== undefined && b.distance !== undefined) {
    if (a.distance > b.distance) {
      return 1;
    } else if (a.distance < b.distance) {
      return -1;
    } else {
      if (a.location.timestamp < b.location.timestamp) {
        return -1;
      } else if (a.location.timestamp > b.location.timestamp) {
        return 1;
      }
    }
  }

  return 0;
}
