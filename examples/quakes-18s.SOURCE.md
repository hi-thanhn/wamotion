# Data source

`usgs-4.5-month.geojson` — USGS Earthquake Hazards Program, real-time GeoJSON summary feed,
"Magnitude 4.5+ Earthquakes, Past Month", downloaded 2026-11-09 14:48 UTC+7 from
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson

665 events, 2026-10-10 08:38 UTC to 2026-11-09 07:04 UTC, largest magnitude 7.0.
Each feature: `properties.time` (ms since epoch, UTC), `properties.mag`, `properties.place`,
`properties.depth` is `geometry.coordinates[2]` (km); coordinates are [lon, lat, depth].

USGS data are in the public domain (U.S. Government work): https://www.usgs.gov/information-policies-and-instructions/copyrights-and-credits
Credit line: "Earthquake data: U.S. Geological Survey".
