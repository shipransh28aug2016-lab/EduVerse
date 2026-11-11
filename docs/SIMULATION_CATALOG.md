# Simulation catalog
| LO | Theme | Engine | Model (pure, unit-tested) | Pedagogy | Fallback |
|---|---|---|---|---|---|
| T02.L1 | Shaping of the Earth's Surface | SVG equirectangular plate map | `data/geo` PB2002 | tap to identify, "find the plate" quiz | n/a (SVG) |
| T02.L2 | same | three.js section + SVG section | `geography/models.js`, `plate-profiles.js` (one geometry for 3D and 2D) | predict distance and crust creation, hazard prompt | SVG section when no WebGL / low graphics / `?nowebgl=1` |
| T02.L3 | same | SVG interior | `LAYERS`, `layerAtDepth` | predict mantle state, true-scale toggle | n/a (SVG) |
| T09.L1 | The Price Puzzle | SVG market | `economics/models.js` (centred linear demand/supply) | 5 predictions: surplus, demand shift, supply shift, ceiling, perishable | table view |
| T09.L2 | same | price ceiling | `compute`, black-market price | prediction | table view |
| T09.L3 | same | scenarios and expectations | `SCENARIOS` | necessity / luxury / perishable | table view |
| T09.L4 | same | externality | `externality` | prediction + deadweight loss | n/a |
| T09.L5 | same | public goods, free rider | `freeRider` | classify + street-light | n/a |
| T09.L6 | same | information asymmetry | `usedBikes` | prediction + inspection toggle | n/a |
Planned (not built): all other learning objects; see `docs/CURRICULUM_COVERAGE_AUDIT.md`.
