'use client';

import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface Unit {
  name: string;
  abbreviation: string;
  toBase: number;
}

interface Category {
  name: string;
  units: Unit[];
}

const CATEGORIES: Record<string, Category> = {
  length: {
    name: 'Length',
    units: [
      { name: 'Millimeter', abbreviation: 'mm', toBase: 0.001 },
      { name: 'Centimeter', abbreviation: 'cm', toBase: 0.01 },
      { name: 'Meter', abbreviation: 'm', toBase: 1 },
      { name: 'Kilometer', abbreviation: 'km', toBase: 1000 },
      { name: 'Inch', abbreviation: 'in', toBase: 0.0254 },
      { name: 'Foot', abbreviation: 'ft', toBase: 0.3048 },
      { name: 'Yard', abbreviation: 'yd', toBase: 0.9144 },
      { name: 'Mile', abbreviation: 'mi', toBase: 1609.34 },
    ],
  },
  mass: {
    name: 'Mass',
    units: [
      { name: 'Milligram', abbreviation: 'mg', toBase: 0.001 },
      { name: 'Gram', abbreviation: 'g', toBase: 1 },
      { name: 'Kilogram', abbreviation: 'kg', toBase: 1000 },
      { name: 'Ounce', abbreviation: 'oz', toBase: 28.3495 },
      { name: 'Pound', abbreviation: 'lb', toBase: 453.592 },
      { name: 'Ton', abbreviation: 't', toBase: 1000000 },
    ],
  },
  temperature: {
    name: 'Temperature',
    units: [
      { name: 'Celsius', abbreviation: '°C', toBase: 1 },
      { name: 'Fahrenheit', abbreviation: '°F', toBase: 1 },
      { name: 'Kelvin', abbreviation: 'K', toBase: 1 },
    ],
  },
  time: {
    name: 'Time',
    units: [
      { name: 'Second', abbreviation: 's', toBase: 1 },
      { name: 'Minute', abbreviation: 'min', toBase: 60 },
      { name: 'Hour', abbreviation: 'h', toBase: 3600 },
      { name: 'Day', abbreviation: 'd', toBase: 86400 },
      { name: 'Week', abbreviation: 'w', toBase: 604800 },
      { name: 'Month', abbreviation: 'mo', toBase: 2592000 },
      { name: 'Year', abbreviation: 'y', toBase: 31536000 },
    ],
  },
  dataSize: {
    name: 'Data Size',
    units: [
      { name: 'Byte', abbreviation: 'B', toBase: 1 },
      { name: 'Kilobyte', abbreviation: 'KB', toBase: 1024 },
      { name: 'Megabyte', abbreviation: 'MB', toBase: 1048576 },
      { name: 'Gigabyte', abbreviation: 'GB', toBase: 1073741824 },
      { name: 'Terabyte', abbreviation: 'TB', toBase: 1099511627776 },
    ],
  },
  speed: {
    name: 'Speed',
    units: [
      { name: 'Meter/Second', abbreviation: 'm/s', toBase: 1 },
      { name: 'Kilometer/Hour', abbreviation: 'km/h', toBase: 0.2778 },
      { name: 'Mile/Hour', abbreviation: 'mph', toBase: 0.44704 },
      { name: 'Knot', abbreviation: 'kn', toBase: 0.51444 },
    ],
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState('length');
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);

  const current = CATEGORIES[category];
  const units = current.units;

  const convert = (): string => {
    if (!value) return '';

    const num = parseFloat(value);
    if (isNaN(num)) return '';

    if (category === 'temperature') {
      const celsius = convertTemperatureToCelsius(num, units[fromUnit].abbreviation);
      return convertTemperatureFromCelsius(celsius, units[toUnit].abbreviation).toFixed(6);
    }

    const baseValue = num * units[fromUnit].toBase;
    const result = baseValue / units[toUnit].toBase;
    return result.toFixed(10).replace(/0+$/, '').replace(/\.$/, '');
  };

  const convertTemperatureToCelsius = (value: number, from: string): number => {
    if (from === '°C') return value;
    if (from === '°F') return (value - 32) * (5 / 9);
    if (from === 'K') return value - 273.15;
    return value;
  };

  const convertTemperatureFromCelsius = (celsius: number, to: string): number => {
    if (to === '°C') return celsius;
    if (to === '°F') return celsius * (9 / 5) + 32;
    if (to === 'K') return celsius + 273.15;
    return celsius;
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="space-y-6">
      {/* Category Selector */}
      <Card className="p-4">
        <label className="text-sm text-text-muted block mb-3">Conversion Category</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => {
                setCategory(key);
                setFromUnit(0);
                setToUnit(1);
                setValue('');
              }}
              className={`p-3 rounded-lg border transition text-sm ${
                category === key
                  ? 'bg-accent text-white border-accent'
                  : 'border-border hover:border-accent/50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Converter */}
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          {/* From Unit */}
          <div className="space-y-2">
            <label className="text-sm text-text-muted">From</label>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="0"
                value={value}
                onChange={e => setValue(e.target.value)}
                className="flex-1"
              />
              <select
                value={fromUnit}
                onChange={e => setFromUnit(Number(e.target.value))}
                className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm min-w-max"
              >
                {units.map((unit, idx) => (
                  <option key={idx} value={idx}>
                    {unit.abbreviation}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-3 bg-surface-2 hover:bg-accent/10 rounded-lg border border-border transition"
            >
              <ArrowRightLeft size={20} className="text-accent" />
            </button>
          </div>

          {/* To Unit */}
          <div className="space-y-2">
            <label className="text-sm text-text-muted">To</label>
            <div className="flex gap-3">
              <Input
                type="text"
                value={convert()}
                readOnly
                placeholder="0"
                className="flex-1 opacity-75"
              />
              <select
                value={toUnit}
                onChange={e => setToUnit(Number(e.target.value))}
                className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-text text-sm min-w-max"
              >
                {units.map((unit, idx) => (
                  <option key={idx} value={idx}>
                    {unit.abbreviation}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Conversion Info */}
        {value && !isNaN(parseFloat(value)) && (
          <div className="bg-surface/50 border border-border rounded-lg p-4 text-sm">
            <p className="text-text-muted">
              <span className="text-accent font-semibold">{value}</span> {units[fromUnit].abbreviation} ={' '}
              <span className="text-accent font-semibold">{convert()}</span> {units[toUnit].abbreviation}
            </p>
          </div>
        )}
      </Card>

      {/* Common Conversions */}
      <Card className="p-6 space-y-3">
        <h3 className="font-semibold text-text">Quick Conversions for {current.name}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {units.slice(0, 4).map((unit, idx) => (
            <div key={idx} className="text-sm bg-surface/50 p-3 rounded border border-border">
              <p className="text-text-muted">1 {units[0].abbreviation} =</p>
              <p className="text-accent font-semibold">
                {(units[0].toBase / unit.toBase).toFixed(6)} {unit.abbreviation}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={() => setValue('')} variant="outline" className="w-full">
        Clear
      </Button>
    </div>
  );
}
