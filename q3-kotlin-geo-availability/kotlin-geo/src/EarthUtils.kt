import java.lang.Math.*

const val earthRadiusKm: Double = 6372.8

fun haversine(originLat: Double, originLon: Double, targetLat: Double, targetLon: Double): Double {
  val latOrigin = toRadians(originLat)
  val latTarget = toRadians(targetLat)
  val dLat = toRadians(targetLat - originLat)
  val dLon = toRadians(targetLon - originLon)
  return 2 * earthRadiusKm * asin(sqrt(pow(sin(dLat / 2), 2.0) + pow(sin(dLon / 2), 2.0) * cos(latOrigin) * cos(latTarget)))
}
