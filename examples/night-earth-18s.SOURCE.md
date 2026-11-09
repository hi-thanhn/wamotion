# Data source

- `8k_earth_nightmap.jpg` — equirectangular night-lights texture of Earth, 8192×4096, from Solar System Scope,
  https://www.solarsystemscope.com/textures/ (download URL https://www.solarsystemscope.com/textures/download/8k_earth_nightmap.jpg),
  licensed Creative Commons Attribution 4.0 International (CC BY 4.0). It is derived from NASA's Earth at Night
  imagery (Suomi NPP VIIRS day/night band, NASA Earth Observatory / NOAA NGDC, public domain). NASA's own
  "Black Marble 2016" files on eoimages.gsfc.nasa.gov were unreachable at download time (2026-11-09 15:05).
  Credit to show: "Night lights: NASA Earth Observatory / NOAA NGDC, texture by Solar System Scope (CC BY 4.0)".

- `cities-top20.json` — the 20 most populous cities with population, country and coordinates, from Wikidata
  (query.wikidata.org SPARQL, 2026-11-09; items that are instances of "city" with population > 5,000,000, metro
  areas removed, deduplicated). Wikidata data is CC0. Populations are whatever Wikidata holds (mixed years and
  definitions); show them as "about" figures or with the Wikidata attribution "Population: Wikidata". `cities-wikidata.json` is the raw query result.

- `BlackMarble_2016_3km.jpg` — NASA's own Black Marble 2016 (Suomi NPP VIIRS, 13500×6750, 3 km), public domain, from
  https://assets.science.nasa.gov/content/dam/science/esd/eo/images/imagerecords/144000/144898/BlackMarble_2016_3km.jpg
  (NASA Earth Observatory, https://earthobservatory.nasa.gov/features/NightLights). Added after the run started; prefer
  it over the Solar System Scope texture if you see this. Credit: "Earth at night: NASA Earth Observatory (Black Marble 2016)".
