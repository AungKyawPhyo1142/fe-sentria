/**
 * Calculate the distance in meters between two [lat, lng] coordinates
 * using the Haversine formula.
 */
export function distanceBetween(
  pos1: [number, number],
  pos2: [number, number],
): number {
  const R = 6371000 // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(pos2[0] - pos1[0])
  const dLng = toRad(pos2[1] - pos1[1])

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pos1[0])) *
      Math.cos(toRad(pos2[0])) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function isWithinDistance(
  pos1: [number, number],
  pos2: [number, number],
  maxMeters: number,
): boolean {
  return distanceBetween(pos1, pos2) <= maxMeters
}
