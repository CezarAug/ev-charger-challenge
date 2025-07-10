import kotlinx.coroutines.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter

fun main() = runBlocking {
  // Testing coordinates: Tokyo station
  // Reduced set test date: 2025-01-01
  // Full set test dates: 2025-07-08 or 2025-07-09

  val chargers = filterChargersByGeoAndDate(Charger.chargers, "2025-01-01", 35.68142792, 139.7674789, 5.0);

  println(chargers)
  println(chargers.size)
}


suspend fun filterChargersByGeoAndDate(chargers: List<Charger>, date: String, userLat: Double, userLng: Double, radiusKm:
  Double): List<Charger> = coroutineScope {

  val deferred = filterChargersByDate(date, chargers).map {
    charger -> async(Dispatchers.Default) {
    //println("Checking: ${charger.id}")
    val distance = haversine(userLat, userLng, charger.lat, charger.lng);
    if (distance <= radiusKm) {
        Pair(charger, distance)
      } else {
        null
      }
    }
  }

  deferred.awaitAll().filterNotNull().sortedBy{ it.second }.map{ it.first }
}

private fun filterChargersByDate(date: String, chargers: List<Charger>): List<Charger> {
  val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
  val targetDate = LocalDate.parse(date, formatter);

  val eligibleChargers = chargers.filter { charger ->
    charger.availabilityDates.any { availableDate ->
      LocalDate.parse(availableDate, formatter) == targetDate
    }
  }

  return eligibleChargers
}
