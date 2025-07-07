# Kotlin-Geo and Availability function

Just a simple method, the executed steps are:

- Filter all stations that corresponds to the target data
- Filter all stations that in the radius, calculating them in a coroutine

## How to Run

Just run the main class, unfortunately changes on the parameters needs to be performed directly at the code.

## Used dataset

The Charger data class was preloaded with Tokyo's train stations data (Station name as Id, lat,lon)

The available dates were set all to 2025-07-08 and 2025-07-09, with some stations having the date 2025-01-01


#### Ideas, Observations and Assumptions

- Unit tests were skipped due to time constraints.