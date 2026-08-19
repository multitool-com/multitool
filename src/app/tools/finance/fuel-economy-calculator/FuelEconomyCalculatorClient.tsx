"use client";

import { useState } from "react";

type Units = "metric" | "imperial";
type Mode = "consumption" | "trip";

/** km/L (metric) or MPG (imperial) from distance and fuel used. */
export function calcConsumption(distance: number, fuel: number, units: Units): number | null {
  if (!isFinite(distance) || !isFinite(fuel) || distance <= 0 || fuel <= 0) return null;
  return distance / fuel;
}

/** L/100km from a km/L figure. */
export function litersPer100(kmPerL: number): number | null {
  if (!isFinite(kmPerL) || kmPerL <= 0) return null;
  return 100 / kmPerL;
}

/** Fuel needed and total cost for a trip. */
export function calcTrip(
  consumption: number,
  distance: number,
  price: number,
  units: Units
): { fuel: number; cost: number } | null {
  if (!isFinite(consumption) || !isFinite(distance) || !isFinite(price) || consumption <= 0 || distance <= 0 || price <= 0) {
    return null;
  }
  const fuel = distance / consumption;
  return { fuel, cost: fuel * price };
}

export default function FuelEconomyCalculatorClient() {
  const [mode, setMode] = useState<Mode>("consumption");
  const [units, setUnits] = useState<Units>("metric");

  // mode A
  const [distA, setDistA] = useState("500");
  const [fuelA, setFuelA] = useState("40");
  // mode B
  const [consB, setConsB] = useState("12.5");
  const [distB, setDistB] = useState("500");
  const [priceB, setPriceB] = useState("6.0");

  const consumption = calcConsumption(parseFloat(distA), parseFloat(fuelA), units);
  const l100 = consumption ? litersPer100(consumption) : null;
  const trip = calcTrip(parseFloat(consB), parseFloat(distB), parseFloat(priceB), units);

  const dUnit = units === "metric" ? "km" : "mi";
  const fUnit = units === "metric" ? "L" : "gal";
  const cUnit = units === "metric" ? "km/L" : "MPG";

  const inputCls =
    "w-full border border-ink/15 rounded-lg px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="bg-white border border-ink/10 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
      <div className="flex gap-2 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => setMode("consumption")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            mode === "consumption" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          ⛽ FUEL CONSUMPTION
        </button>
        <button
          type="button"
          onClick={() => setMode("trip")}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            mode === "trip" ? "bg-deep text-paper" : "bg-paper text-ink/60 border border-ink/15 hover:border-accent hover:text-accent"
          }`}
        >
          🛣️ TRIP COST
        </button>
        <button
          type="button"
          onClick={() => setUnits((u) => (u === "metric" ? "imperial" : "metric"))}
          className={`font-mono text-xs tracking-widest px-4 py-2 rounded-full transition-colors ${
            units === "metric" ? "bg-accent/10 border border-accent/30 text-accent" : "bg-paper text-ink/60 border border-ink/15"
          }`}
        >
          {units === "metric" ? "KM / LITERS" : "MILES / GALLONS"}
        </button>
      </div>

      {mode === "consumption" ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fe-dist" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                DISTANCE ({dUnit})
              </label>
              <input id="fe-dist" type="number" min="0" value={distA} onChange={(e) => setDistA(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="fe-fuel" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                FUEL USED ({fUnit})
              </label>
              <input id="fe-fuel" type="number" min="0" value={fuelA} onChange={(e) => setFuelA(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="bg-paper border border-ink/10 rounded-lg px-4 py-5 flex flex-col items-center gap-1">
            <span className="font-mono text-xs tracking-widest text-ink/60">CONSUMPTION</span>
            <span className="font-display text-4xl font-bold text-deep">
              {consumption ? consumption.toFixed(2) : "—"}
            </span>
            <span className="font-mono text-sm text-accent">
              {cUnit}
              {l100 && units === "metric" ? ` · ${l100.toFixed(1)} L/100km` : ""}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="fe-cons" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                CONSUMPTION ({cUnit})
              </label>
              <input id="fe-cons" type="number" min="0" value={consB} onChange={(e) => setConsB(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="fe-distb" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                DISTANCE ({dUnit})
              </label>
              <input id="fe-distb" type="number" min="0" value={distB} onChange={(e) => setDistB(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label htmlFor="fe-price" className="font-mono text-xs tracking-widest text-ink/60 block mb-2">
                PRICE PER {units === "metric" ? "LITER" : "GALLON"} ($)
              </label>
              <input id="fe-price" type="number" min="0" step="0.01" value={priceB} onChange={(e) => setPriceB(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-paper border border-ink/10 rounded-lg px-4 py-5 flex flex-col items-center gap-1">
              <span className="font-mono text-xs tracking-widest text-ink/60">FUEL NEEDED</span>
              <span className="font-display text-3xl font-bold text-deep">
                {trip ? trip.fuel.toFixed(1) : "—"}
              </span>
              <span className="font-mono text-sm text-accent">{fUnit}</span>
            </div>
            <div className="bg-paper border border-ink/10 rounded-lg px-4 py-5 flex flex-col items-center gap-1">
              <span className="font-mono text-xs tracking-widest text-ink/60">TOTAL COST</span>
              <span className="font-display text-3xl font-bold text-deep">
                {trip ? "$" + trip.cost.toFixed(2) : "—"}
              </span>
              <span className="font-mono text-sm text-accent">
                {trip ? `$ ${(trip.cost / parseFloat(distB)).toFixed(2)} per ${dUnit}` : ""}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
