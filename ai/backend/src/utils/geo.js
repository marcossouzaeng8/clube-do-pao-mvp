const earthRadiusKm = 6371

function toRadians(degrees) {
  return (degrees * Math.PI) / 180
}

export function haversineDistance(lat1, lng1, lat2, lng2) {
  const deltaLat = toRadians(lat2 - lat1)
  const deltaLng = toRadians(lng2 - lng1)
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLng / 2) ** 2

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function roundTwo(value) {
  return Math.round(value * 100) / 100
}
