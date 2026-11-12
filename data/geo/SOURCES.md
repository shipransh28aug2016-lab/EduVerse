# Geodata & Visualization Sources
- **Plate polygons**: PB2002 (Bird, 2003, "An updated digital model of plate boundaries", Geochem. Geophys. Geosyst.), via the Fraxen/tectonicplates repository, licensed ODC-By 1.0. Simplified (RDP) and split at the antimeridian.
- **Coastlines**: Natural Earth 110m land, public domain (`land.simplified.json`).
- **World countries**: `world-atlas` (`countries-110m.json`, Natural Earth 110m TopoJSON), ISC license (`WORLD_ATLAS_LICENSE`).
- **India states & union territories**: `datta07/INDIAN-SHAPEFILES` (`INDIA_STATES.geojson`, 37 states/UTs), MIT license (`INDIA_SHAPEFILES_LICENSE`). Simplified (RDP, tol 0.03°) and spherical-wound for `d3-geo` into `india.simplified.json` (98 KB).
- **Outputs**: `plates.simplified.json` (54 plates, 8 flagged major), `land.simplified.json`, `countries-110m.json` (177 countries), `india.simplified.json` (37 states/UTs).
- Plate and boundary outlines are simplified for classroom visual learning and are not for navigation or official boundary demarcation.
