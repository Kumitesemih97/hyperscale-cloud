export interface PoP {
  id: string;
  name: string;
  code: string;
  lat: number;
  lon: number;
  continent: "NA" | "EU" | "APAC" | "SA" | "ME" | "AF";
  tier: "Hyperscale Core" | "Edge PoP" | "SuperPoP";
  azCount: number;
  capacityTbps: number;
  status: "operational" | "expanding";
}

export interface SubseaCable {
  id: string;
  name: string;
  from: string; // PoP code
  to: string; // PoP code
  capacityTbps: number;
  rttMs: number;
}

export const GLOBAL_POPS: PoP[] = [
  {
    id: "pop-us-east-1",
    name: "Northern Virginia (US-East)",
    code: "iad",
    lat: 39.0438,
    lon: -77.4874,
    continent: "NA",
    tier: "Hyperscale Core",
    azCount: 6,
    capacityTbps: 180,
    status: "operational",
  },
  {
    id: "pop-us-west-1",
    name: "Silicon Valley (US-West)",
    code: "sfo",
    lat: 37.3861,
    lon: -122.0839,
    continent: "NA",
    tier: "Hyperscale Core",
    azCount: 4,
    capacityTbps: 140,
    status: "operational",
  },
  {
    id: "pop-eu-central-1",
    name: "Frankfurt (EU-Central)",
    code: "fra",
    lat: 50.1109,
    lon: 8.6821,
    continent: "EU",
    tier: "Hyperscale Core",
    azCount: 5,
    capacityTbps: 160,
    status: "operational",
  },
  {
    id: "pop-eu-west-1",
    name: "London (EU-West)",
    code: "lhr",
    lat: 51.5074,
    lon: -0.1278,
    continent: "EU",
    tier: "SuperPoP",
    azCount: 4,
    capacityTbps: 120,
    status: "operational",
  },
  {
    id: "pop-ap-northeast-1",
    name: "Tokyo (AP-East)",
    code: "nrt",
    lat: 35.6762,
    lon: 139.6503,
    continent: "APAC",
    tier: "Hyperscale Core",
    azCount: 4,
    capacityTbps: 150,
    status: "operational",
  },
  {
    id: "pop-ap-southeast-1",
    name: "Singapore (AP-South)",
    code: "sin",
    lat: 1.3521,
    lon: 103.8198,
    continent: "APAC",
    tier: "Hyperscale Core",
    azCount: 4,
    capacityTbps: 130,
    status: "operational",
  },
  {
    id: "pop-sa-east-1",
    name: "São Paulo (SA-East)",
    code: "gru",
    lat: -23.5505,
    lon: -46.6333,
    continent: "SA",
    tier: "SuperPoP",
    azCount: 3,
    capacityTbps: 70,
    status: "operational",
  },
  {
    id: "pop-me-central-1",
    name: "Dubai (ME-Central)",
    code: "dxb",
    lat: 25.2048,
    lon: 55.2708,
    continent: "ME",
    tier: "SuperPoP",
    azCount: 3,
    capacityTbps: 60,
    status: "operational",
  },
  {
    id: "pop-ap-southeast-2",
    name: "Sydney (AP-Oceania)",
    code: "syd",
    lat: -33.8688,
    lon: 151.2093,
    continent: "APAC",
    tier: "SuperPoP",
    azCount: 3,
    capacityTbps: 80,
    status: "operational",
  },
];

export const SUBSEA_CABLES: SubseaCable[] = [
  { id: "cable-transatlantic-1", name: "HyperTransatlantic Express", from: "iad", to: "lhr", capacityTbps: 450, rttMs: 64 },
  { id: "cable-eu-backbone", name: "EuroCross Optical Mesh", from: "lhr", to: "fra", capacityTbps: 600, rttMs: 11 },
  { id: "cable-transpacific-1", name: "Pacific Direct TeraWave", from: "sfo", to: "nrt", capacityTbps: 380, rttMs: 96 },
  { id: "cable-intra-asia", name: "Asia-Pacific Gateway Ultra", from: "nrt", to: "sin", capacityTbps: 420, rttMs: 48 },
  { id: "cable-us-coast", name: "Americas Trans-Continental", from: "iad", to: "sfo", capacityTbps: 800, rttMs: 42 },
  { id: "cable-eu-me", name: "Eurasia HyperRoute", from: "fra", to: "dxb", capacityTbps: 300, rttMs: 72 },
  { id: "cable-asia-oceania", name: "Southern Cross Terabit", from: "sin", to: "syd", capacityTbps: 260, rttMs: 68 },
  { id: "cable-us-sa", name: "Atlantic South HighSpeed", from: "iad", to: "gru", capacityTbps: 200, rttMs: 88 },
];

const EARTH_RADIUS_KM = 6371;
const SPEED_OF_LIGHT_FIBER_KM_S = 202000; // ~ 202,000 km/s in standard silica single-mode glass

export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c);
}

export function calculateLatency(from: PoP, to: PoP): number {
  if (from.code === to.code) {
    return 0.8; // intra-datacenter optical fabric latency (< 1ms)
  }

  const distanceKm = haversineDistance(from.lat, from.lon, to.lat, to.lon);
  // Direct cable route lookup if exists
  const direct = SUBSEA_CABLES.find(
    (c) => (c.from === from.code && c.to === to.code) || (c.from === to.code && c.to === from.code)
  );
  if (direct) {
    return direct.rttMs;
  }

  // Geodesic fiber propagation (round-trip): (distance * 2 / speed) * 1000 + routing switch overhead (1.25x routing factor)
  const oneWaySeconds = (distanceKm * 1.22) / SPEED_OF_LIGHT_FIBER_KM_S;
  const rttSeconds = oneWaySeconds * 2;
  const rttMs = rttSeconds * 1000 + 4.5; // 4.5ms equipment forwarding delay
  return Math.round(rttMs * 10) / 10;
}
