# Geodata sources
- **Plate polygons**: PB2002 (Bird, 2003, "An updated digital model of plate boundaries", Geochem. Geophys. Geosyst.), via the Fraxen/tectonicplates repository, licensed ODC-By 1.0. Simplified (RDP) and split at the antimeridian by `tools/build-geodata.py`.
- **Coastlines**: Natural Earth 110m land, public domain. Simplified by the same script.
- Outputs: `plates.simplified.json` (54 plates, 8 flagged major), `land.simplified.json`.
- The Indo-Australian plate grouping differs between sources (PB2002 splits India and Australia); both are shown as major. **Needs teacher review.**
- Plate outlines are simplified for teaching and are not for navigation or hazard assessment.
