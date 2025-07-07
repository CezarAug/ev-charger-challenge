import kotlinx.coroutines.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.lang.Math.*


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

  val eligibleChargers = filterEligibleChargers(date, chargers)

  val deferred = eligibleChargers.map {
    charger -> async {
      if (haversine(userLat, userLng, charger.lat, charger.lng) <= radiusKm) charger else null
    }
  }

  deferred.awaitAll().filterNotNull();
}

private fun filterEligibleChargers(date: String, chargers: List<Charger>): List<Charger> {
  val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
  val targetDate = LocalDate.parse(date, formatter);

  val eligibleChargers = chargers.filter { charger ->
    charger.availabilityDates.any { availableDate ->
      LocalDate.parse(availableDate, formatter) == targetDate
    }
  }

  return eligibleChargers
}
