import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Radio,
  Layers,
  Crosshair,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  CloudRain,
  Wind,
  Eye,
  Activity,
  Maximize2,
  Minimize2,
  Info,
  MapPin,
  Compass,
  AlertTriangle,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  CloudSnow,
  CloudLightning,
  Sun
} from 'lucide-react';
import { sound } from '../utils/audio';

export type IndiaWeatherScenario =
  | 'active-monsoon'
  | 'cyclone-bob'
  | 'kalbaisakhi'
  | 'western-disturbance'
  | 'heatwave-dust'
  | 'northeast-monsoon';

export type PixelMetricLayer =
  | 'dbz'
  | 'rain'
  | 'ir'
  | 'lightning'
  | 'velocity';

export interface IndiaPixelPoint {
  id: string;
  name: string;
  station: string;
  state: string;
  zone: 'North' | 'Northwest' | 'Gangetic' | 'East' | 'Northeast' | 'West' | 'Central' | 'South' | 'Maritime';
  lat: number;
  lon: number;
  xPercent: number; // 0 to 100 on India map projection
  yPercent: number; // 0 to 100 on India map projection
  radarType: 'S-Band DWR' | 'C-Band DWR' | 'X-Band DWR';
  scenarios: Record<
    IndiaWeatherScenario,
    {
      dbz: number;
      rainRate: number; // mm/hr
      cloudTopKm: number;
      cloudTempC: number;
      lightningStrikes: number;
      windKnots: number;
      windDir: string;
      condition: string;
      alert: 'Green' | 'Yellow' | 'Orange' | 'Red';
      hydrometeor: 'Clear' | 'Drizzle' | 'Moderate Rain' | 'Heavy Rain' | 'Cloudburst' | 'Hail / Graupel' | 'Snow / Sleet' | 'Thermal Dust Plume';
    }
  >;
}

// 45 Accurate Meteorological Radar Grid Nodes Across India's States & Waters
export const INDIA_RADAR_PIXEL_NODES: IndiaPixelPoint[] = [
  // NORTH & HIMALAYAS
  {
    id: 'srinagar',
    name: 'Srinagar Radar',
    station: 'DWR Srinagar (Shankaracharya)',
    state: 'Jammu & Kashmir',
    zone: 'North',
    lat: 34.08,
    lon: 74.8,
    xPercent: 33,
    yPercent: 12,
    radarType: 'X-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 22, rainRate: 1.5, cloudTopKm: 6.2, cloudTempC: -15, lightningStrikes: 0, windKnots: 8, windDir: 'NW', condition: 'Intermittent Valley Showers', alert: 'Green', hydrometeor: 'Drizzle' },
      'cyclone-bob': { dbz: 10, rainRate: 0, cloudTopKm: 3.5, cloudTempC: -2, lightningStrikes: 0, windKnots: 5, windDir: 'N', condition: 'Clear Continental Skies', alert: 'Green', hydrometeor: 'Clear' },
      'kalbaisakhi': { dbz: 14, rainRate: 0, cloudTopKm: 4.1, cloudTempC: -5, lightningStrikes: 0, windKnots: 6, windDir: 'W', condition: 'Partly Cloudy, Calm', alert: 'Green', hydrometeor: 'Clear' },
      'western-disturbance': { dbz: 56, rainRate: 28, cloudTopKm: 12.8, cloudTempC: -58, lightningStrikes: 12, windKnots: 38, windDir: 'W', condition: 'Intense Blizzard & High Altitude Snow', alert: 'Red', hydrometeor: 'Snow / Sleet' },
      'heatwave-dust': { dbz: 8, rainRate: 0, cloudTopKm: 2.8, cloudTempC: 4, lightningStrikes: 0, windKnots: 4, windDir: 'N', condition: 'Sunny & Warm in Valley', alert: 'Green', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 12, rainRate: 0, cloudTopKm: 3.2, cloudTempC: -8, lightningStrikes: 0, windKnots: 7, windDir: 'NE', condition: 'Sub-Zero Freeze & Clear', alert: 'Green', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'shimla',
    name: 'Kufri / Shimla Radar',
    station: 'DWR Kufri Ridge',
    state: 'Himachal Pradesh',
    zone: 'North',
    lat: 31.1,
    lon: 77.17,
    xPercent: 40,
    yPercent: 18,
    radarType: 'X-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 46, rainRate: 24, cloudTopKm: 12.4, cloudTempC: -46, lightningStrikes: 18, windKnots: 16, windDir: 'SW', condition: 'Severe Mountain Downpour & Landslide Risk', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'cyclone-bob': { dbz: 12, rainRate: 0, cloudTopKm: 4.0, cloudTempC: -4, lightningStrikes: 0, windKnots: 6, windDir: 'NW', condition: 'Clear Sky', alert: 'Green', hydrometeor: 'Clear' },
      'kalbaisakhi': { dbz: 26, rainRate: 2.2, cloudTopKm: 7.2, cloudTempC: -20, lightningStrikes: 4, windKnots: 12, windDir: 'W', condition: 'Isolated Ridge Showers', alert: 'Yellow', hydrometeor: 'Drizzle' },
      'western-disturbance': { dbz: 54, rainRate: 26, cloudTopKm: 13.0, cloudTempC: -56, lightningStrikes: 8, windKnots: 34, windDir: 'NW', condition: 'Heavy Orographic Snowfall', alert: 'Red', hydrometeor: 'Snow / Sleet' },
      'heatwave-dust': { dbz: 10, rainRate: 0, cloudTopKm: 3.0, cloudTempC: 8, lightningStrikes: 0, windKnots: 5, windDir: 'W', condition: 'Unseasonal High Mountain Temps', alert: 'Green', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 14, rainRate: 0, cloudTopKm: 4.0, cloudTempC: -12, lightningStrikes: 0, windKnots: 8, windDir: 'N', condition: 'Severe Cold Wave & Frost', alert: 'Yellow', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'delhi',
    name: 'Delhi NCR Radar Composite',
    station: 'DWR Palam & Mausam Bhavan',
    state: 'Delhi NCR',
    zone: 'Northwest',
    lat: 28.58,
    lon: 77.12,
    xPercent: 41,
    yPercent: 26,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 48, rainRate: 32, cloudTopKm: 13.5, cloudTempC: -52, lightningStrikes: 34, windKnots: 22, windDir: 'E', condition: 'Monsoon Trough Storms & Waterlogging', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'cyclone-bob': { dbz: 15, rainRate: 0, cloudTopKm: 4.5, cloudTempC: -6, lightningStrikes: 0, windKnots: 8, windDir: 'NW', condition: 'Warm & Mostly Sunny', alert: 'Green', hydrometeor: 'Clear' },
      'kalbaisakhi': { dbz: 32, rainRate: 4.8, cloudTopKm: 8.8, cloudTempC: -28, lightningStrikes: 14, windKnots: 24, windDir: 'SW', condition: 'Evening Dust-Thunderstorm', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'western-disturbance': { dbz: 38, rainRate: 9.5, cloudTopKm: 9.6, cloudTempC: -34, lightningStrikes: 6, windKnots: 20, windDir: 'W', condition: 'Chilly Winter Showers & Hail Spells', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'heatwave-dust': { dbz: 28, rainRate: 0, cloudTopKm: 5.5, cloudTempC: 14, lightningStrikes: 2, windKnots: 32, windDir: 'W', condition: 'Severe Heatwave (45.8°C) & Dense Dust Plumes', alert: 'Red', hydrometeor: 'Thermal Dust Plume' },
      'northeast-monsoon': { dbz: 10, rainRate: 0, cloudTopKm: 2.5, cloudTempC: -4, lightningStrikes: 0, windKnots: 6, windDir: 'NW', condition: 'Dense Radiation Fog & Cold Wave', alert: 'Yellow', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'jaipur',
    name: 'Jaipur Radar',
    station: 'DWR Jaipur Airport',
    state: 'Rajasthan',
    zone: 'Northwest',
    lat: 26.82,
    lon: 75.8,
    xPercent: 36,
    yPercent: 31,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 34, rainRate: 8, cloudTopKm: 9.5, cloudTempC: -32, lightningStrikes: 8, windKnots: 14, windDir: 'SW', condition: 'Scattered Monsoon Inflow Rain', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'cyclone-bob': { dbz: 10, rainRate: 0, cloudTopKm: 3.2, cloudTempC: 0, lightningStrikes: 0, windKnots: 8, windDir: 'N', condition: 'Hot & Arid Sky', alert: 'Green', hydrometeor: 'Clear' },
      'kalbaisakhi': { dbz: 18, rainRate: 0, cloudTopKm: 5.2, cloudTempC: -8, lightningStrikes: 4, windKnots: 28, windDir: 'W', condition: 'Squally Winds & Dust Suspension', alert: 'Yellow', hydrometeor: 'Thermal Dust Plume' },
      'western-disturbance': { dbz: 24, rainRate: 2, cloudTopKm: 6.8, cloudTempC: -18, lightningStrikes: 0, windKnots: 14, windDir: 'NW', condition: 'Overcast & Cold Drizzle Spells', alert: 'Green', hydrometeor: 'Drizzle' },
      'heatwave-dust': { dbz: 32, rainRate: 0, cloudTopKm: 6.2, cloudTempC: 18, lightningStrikes: 0, windKnots: 36, windDir: 'W', condition: 'Extreme Heatwave (47.2°C) with Severe Andhi', alert: 'Red', hydrometeor: 'Thermal Dust Plume' },
      'northeast-monsoon': { dbz: 8, rainRate: 0, cloudTopKm: 2.2, cloudTempC: 2, lightningStrikes: 0, windKnots: 6, windDir: 'NE', condition: 'Dry & Crisp Continental Air', alert: 'Green', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'jodhpur',
    name: 'Jodhpur / Thar Desert Node',
    station: 'DWR Jodhpur & Bikaner Buffer',
    state: 'Rajasthan',
    zone: 'Northwest',
    lat: 26.25,
    lon: 73.05,
    xPercent: 29,
    yPercent: 32,
    radarType: 'C-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 20, rainRate: 1.0, cloudTopKm: 5.5, cloudTempC: -12, lightningStrikes: 2, windKnots: 16, windDir: 'SW', condition: 'Humid Heat & Passing Cloud Stems', alert: 'Green', hydrometeor: 'Drizzle' },
      'cyclone-bob': { dbz: 8, rainRate: 0, cloudTopKm: 2.5, cloudTempC: 4, lightningStrikes: 0, windKnots: 6, windDir: 'NE', condition: 'Clear Desert Sky', alert: 'Green', hydrometeor: 'Clear' },
      'kalbaisakhi': { dbz: 12, rainRate: 0, cloudTopKm: 4.0, cloudTempC: 0, lightningStrikes: 0, windKnots: 20, windDir: 'W', condition: 'Dry Dust Turbidity', alert: 'Green', hydrometeor: 'Clear' },
      'western-disturbance': { dbz: 18, rainRate: 0.8, cloudTopKm: 5.0, cloudTempC: -10, lightningStrikes: 0, windKnots: 12, windDir: 'NW', condition: 'Passing Cold Front Cirrus', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 36, rainRate: 0, cloudTopKm: 7.0, cloudTempC: 22, lightningStrikes: 1, windKnots: 42, windDir: 'W', condition: 'Violent Dust Wall (Andhi) & 48.0°C Heat', alert: 'Red', hydrometeor: 'Thermal Dust Plume' },
      'northeast-monsoon': { dbz: 6, rainRate: 0, cloudTopKm: 2.0, cloudTempC: 0, lightningStrikes: 0, windKnots: 6, windDir: 'NE', condition: 'Dry Cold Desert Wind', alert: 'Green', hydrometeor: 'Clear' }
    }
  },

  // GANGETIC PLAINS & CENTRAL
  {
    id: 'lucknow',
    name: 'Lucknow Radar',
    station: 'DWR Lucknow (Amausi)',
    state: 'Uttar Pradesh',
    zone: 'Gangetic',
    lat: 26.76,
    lon: 80.88,
    xPercent: 51,
    yPercent: 30,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 50, rainRate: 38, cloudTopKm: 14.2, cloudTempC: -60, lightningStrikes: 42, windKnots: 24, windDir: 'E', condition: 'Monsoon Axis Cloudbursts & Intense Rain', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'cyclone-bob': { dbz: 22, rainRate: 2.0, cloudTopKm: 6.8, cloudTempC: -16, lightningStrikes: 2, windKnots: 12, windDir: 'SE', condition: 'Outer Cirrus Bands from Bay System', alert: 'Green', hydrometeor: 'Drizzle' },
      'kalbaisakhi': { dbz: 42, rainRate: 18, cloudTopKm: 11.5, cloudTempC: -44, lightningStrikes: 28, windKnots: 34, windDir: 'NW', condition: 'Severe Squall Line & Gusty Downpours', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'western-disturbance': { dbz: 28, rainRate: 4.5, cloudTopKm: 8.0, cloudTempC: -22, lightningStrikes: 2, windKnots: 14, windDir: 'W', condition: 'Cold Winter Rain Spells', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'heatwave-dust': { dbz: 22, rainRate: 0, cloudTopKm: 4.8, cloudTempC: 12, lightningStrikes: 0, windKnots: 24, windDir: 'W', condition: 'Loo Heatwave (46.0°C)', alert: 'Red', hydrometeor: 'Thermal Dust Plume' },
      'northeast-monsoon': { dbz: 10, rainRate: 0, cloudTopKm: 2.2, cloudTempC: -2, lightningStrikes: 0, windKnots: 4, windDir: 'NW', condition: 'Dense Fog & Low Inversion', alert: 'Yellow', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'patna',
    name: 'Patna Radar',
    station: 'DWR Patna Airport',
    state: 'Bihar',
    zone: 'Gangetic',
    lat: 25.59,
    lon: 85.09,
    xPercent: 62,
    yPercent: 33,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 54, rainRate: 46, cloudTopKm: 15.0, cloudTempC: -66, lightningStrikes: 58, windKnots: 26, windDir: 'SE', condition: 'Torrential Monsoon Cells over Ganges Basin', alert: 'Red', hydrometeor: 'Cloudburst' },
      'cyclone-bob': { dbz: 32, rainRate: 6.8, cloudTopKm: 9.0, cloudTempC: -28, lightningStrikes: 8, windKnots: 20, windDir: 'SE', condition: 'Moisture Surge from Bay Vortex', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'kalbaisakhi': { dbz: 62, rainRate: 72, cloudTopKm: 16.8, cloudTempC: -78, lightningStrikes: 94, windKnots: 48, windDir: 'NW', condition: 'Violent Nor’wester Thunderstorm & Hail', alert: 'Red', hydrometeor: 'Hail / Graupel' },
      'western-disturbance': { dbz: 20, rainRate: 1.2, cloudTopKm: 6.0, cloudTempC: -12, lightningStrikes: 0, windKnots: 10, windDir: 'W', condition: 'Overcast & Drizzling', alert: 'Green', hydrometeor: 'Drizzle' },
      'heatwave-dust': { dbz: 18, rainRate: 0, cloudTopKm: 4.2, cloudTempC: 8, lightningStrikes: 0, windKnots: 18, windDir: 'W', condition: 'Severe Heatwave Conditions', alert: 'Orange', hydrometeor: 'Thermal Dust Plume' },
      'northeast-monsoon': { dbz: 8, rainRate: 0, cloudTopKm: 2.0, cloudTempC: 0, lightningStrikes: 0, windKnots: 4, windDir: 'NW', condition: 'Clear Winter Day', alert: 'Green', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'bhopal',
    name: 'Bhopal Radar',
    station: 'DWR Bhopal Airport',
    state: 'Madhya Pradesh',
    zone: 'Central',
    lat: 23.28,
    lon: 77.34,
    xPercent: 46,
    yPercent: 42,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 56, rainRate: 52, cloudTopKm: 15.5, cloudTempC: -68, lightningStrikes: 46, windKnots: 28, windDir: 'SW', condition: 'Central Low Pressure Depression Core', alert: 'Red', hydrometeor: 'Cloudburst' },
      'cyclone-bob': { dbz: 34, rainRate: 8.5, cloudTopKm: 9.8, cloudTempC: -32, lightningStrikes: 12, windKnots: 22, windDir: 'E', condition: 'Extensive Inflow Cloud Cover & Rains', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'kalbaisakhi': { dbz: 24, rainRate: 2.0, cloudTopKm: 7.0, cloudTempC: -18, lightningStrikes: 6, windKnots: 18, windDir: 'W', condition: 'Isolated Convective Tower', alert: 'Green', hydrometeor: 'Drizzle' },
      'western-disturbance': { dbz: 12, rainRate: 0, cloudTopKm: 3.8, cloudTempC: -4, lightningStrikes: 0, windKnots: 8, windDir: 'NW', condition: 'Pleasant Winter Skies', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 20, rainRate: 0, cloudTopKm: 4.5, cloudTempC: 10, lightningStrikes: 0, windKnots: 20, windDir: 'W', condition: 'Blistering Heat (45.2°C)', alert: 'Red', hydrometeor: 'Thermal Dust Plume' },
      'northeast-monsoon': { dbz: 8, rainRate: 0, cloudTopKm: 2.0, cloudTempC: 2, lightningStrikes: 0, windKnots: 6, windDir: 'NE', condition: 'Crisp Dry Sun', alert: 'Green', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'nagpur',
    name: 'Nagpur Radar',
    station: 'DWR Nagpur (Sonegaon)',
    state: 'Maharashtra',
    zone: 'Central',
    lat: 21.09,
    lon: 79.05,
    xPercent: 50,
    yPercent: 49,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 55, rainRate: 48, cloudTopKm: 15.2, cloudTempC: -67, lightningStrikes: 52, windKnots: 30, windDir: 'SW', condition: 'Vidarbha Active Monsoon Inundation', alert: 'Red', hydrometeor: 'Cloudburst' },
      'cyclone-bob': { dbz: 36, rainRate: 10, cloudTopKm: 10.2, cloudTempC: -36, lightningStrikes: 14, windKnots: 24, windDir: 'E', condition: 'Spiral Outer Rain Bands', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'kalbaisakhi': { dbz: 30, rainRate: 3.5, cloudTopKm: 8.5, cloudTempC: -24, lightningStrikes: 10, windKnots: 20, windDir: 'NW', condition: 'Evening Thundershower', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'western-disturbance': { dbz: 10, rainRate: 0, cloudTopKm: 3.0, cloudTempC: 0, lightningStrikes: 0, windKnots: 6, windDir: 'NW', condition: 'Dry Mild Days', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 24, rainRate: 0, cloudTopKm: 5.0, cloudTempC: 16, lightningStrikes: 0, windKnots: 26, windDir: 'W', condition: 'Extreme Heatwave (46.8°C)', alert: 'Red', hydrometeor: 'Thermal Dust Plume' },
      'northeast-monsoon': { dbz: 8, rainRate: 0, cloudTopKm: 2.0, cloudTempC: 4, lightningStrikes: 0, windKnots: 6, windDir: 'NE', condition: 'Clear Skies', alert: 'Green', hydrometeor: 'Clear' }
    }
  },

  // EAST & NORTHEAST
  {
    id: 'kolkata',
    name: 'Kolkata Radar',
    station: 'DWR Kolkata (Alipore)',
    state: 'West Bengal',
    zone: 'East',
    lat: 22.53,
    lon: 88.33,
    xPercent: 70,
    yPercent: 43,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 52, rainRate: 42, cloudTopKm: 14.8, cloudTempC: -64, lightningStrikes: 48, windKnots: 28, windDir: 'S', condition: 'Continuous Heavy Monsoon Downpour', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'cyclone-bob': { dbz: 60, rainRate: 68, cloudTopKm: 16.5, cloudTempC: -76, lightningStrikes: 72, windKnots: 55, windDir: 'NE', condition: 'Severe Cyclone Landfall Alert & Gale', alert: 'Red', hydrometeor: 'Cloudburst' },
      'kalbaisakhi': { dbz: 65, rainRate: 85, cloudTopKm: 17.5, cloudTempC: -82, lightningStrikes: 120, windKnots: 56, windDir: 'NW', condition: 'Catastrophic Nor’wester (100kmph gusts) & Hail', alert: 'Red', hydrometeor: 'Hail / Graupel' },
      'western-disturbance': { dbz: 14, rainRate: 0, cloudTopKm: 4.2, cloudTempC: -6, lightningStrikes: 0, windKnots: 8, windDir: 'NW', condition: 'Cool Sunny Weather', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 22, rainRate: 0, cloudTopKm: 4.8, cloudTempC: 6, lightningStrikes: 2, windKnots: 16, windDir: 'SW', condition: 'High Humidity Sultry Heat (41.0°C)', alert: 'Yellow', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 12, rainRate: 0, cloudTopKm: 3.5, cloudTempC: 0, lightningStrikes: 0, windKnots: 10, windDir: 'NE', condition: 'Crisp Bengal Winter', alert: 'Green', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'ranchi',
    name: 'Ranchi / Chota Nagpur Radar',
    station: 'DWR Ranchi Airport',
    state: 'Jharkhand',
    zone: 'East',
    lat: 23.32,
    lon: 85.32,
    xPercent: 64,
    yPercent: 41,
    radarType: 'C-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 50, rainRate: 36, cloudTopKm: 14.0, cloudTempC: -60, lightningStrikes: 38, windKnots: 22, windDir: 'SE', condition: 'Heavy Plateau Rainfall & Runoff', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'cyclone-bob': { dbz: 42, rainRate: 16, cloudTopKm: 11.2, cloudTempC: -42, lightningStrikes: 16, windKnots: 32, windDir: 'E', condition: 'Squally Rains from Bay Depression', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'kalbaisakhi': { dbz: 64, rainRate: 78, cloudTopKm: 17.2, cloudTempC: -80, lightningStrikes: 110, windKnots: 52, windDir: 'NW', condition: 'Severe Hailstorm Core on Plateau Edge', alert: 'Red', hydrometeor: 'Hail / Graupel' },
      'western-disturbance': { dbz: 12, rainRate: 0, cloudTopKm: 3.6, cloudTempC: -4, lightningStrikes: 0, windKnots: 6, windDir: 'NW', condition: 'Cold Morning Mist', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 16, rainRate: 0, cloudTopKm: 4.0, cloudTempC: 8, lightningStrikes: 0, windKnots: 14, windDir: 'W', condition: 'Plateau Heat (43.5°C)', alert: 'Orange', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 8, rainRate: 0, cloudTopKm: 2.0, cloudTempC: -2, lightningStrikes: 0, windKnots: 6, windDir: 'NE', condition: 'Chilly Pleasant Days', alert: 'Green', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar / Paradip Radar',
    station: 'DWR Bhubaneswar & Paradip Port',
    state: 'Odisha',
    zone: 'East',
    lat: 20.25,
    lon: 85.83,
    xPercent: 67,
    yPercent: 51,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 53, rainRate: 44, cloudTopKm: 15.0, cloudTempC: -65, lightningStrikes: 42, windKnots: 30, windDir: 'S', condition: 'Intense Monsoon Trough Precipitation', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'cyclone-bob': { dbz: 63, rainRate: 92, cloudTopKm: 17.0, cloudTempC: -80, lightningStrikes: 86, windKnots: 68, windDir: 'E', condition: 'Direct Cyclone Landfall Eye-Wall Radar Contact', alert: 'Red', hydrometeor: 'Cloudburst' },
      'kalbaisakhi': { dbz: 58, rainRate: 64, cloudTopKm: 16.0, cloudTempC: -74, lightningStrikes: 76, windKnots: 44, windDir: 'NW', condition: 'Violent Coastal Squall Line', alert: 'Red', hydrometeor: 'Hail / Graupel' },
      'western-disturbance': { dbz: 10, rainRate: 0, cloudTopKm: 3.2, cloudTempC: 2, lightningStrikes: 0, windKnots: 6, windDir: 'NE', condition: 'Clear Coastal Skies', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 24, rainRate: 0, cloudTopKm: 5.2, cloudTempC: 10, lightningStrikes: 4, windKnots: 20, windDir: 'SW', condition: 'Oppressive Coastal Sultry Heat', alert: 'Orange', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 26, rainRate: 3.2, cloudTopKm: 7.2, cloudTempC: -18, lightningStrikes: 4, windKnots: 16, windDir: 'NE', condition: 'Coastal Inflow Passing Showers', alert: 'Green', hydrometeor: 'Drizzle' }
    }
  },
  {
    id: 'guwahati',
    name: 'Guwahati / Shillong Radar',
    station: 'DWR Guwahati Airport & Sohra',
    state: 'Assam / Meghalaya',
    zone: 'Northeast',
    lat: 26.11,
    lon: 91.58,
    xPercent: 84,
    yPercent: 32,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 58, rainRate: 85, cloudTopKm: 16.2, cloudTempC: -75, lightningStrikes: 68, windKnots: 32, windDir: 'SW', condition: 'Extreme Orographic Cloudbursts in Brahmaputra Valley', alert: 'Red', hydrometeor: 'Cloudburst' },
      'cyclone-bob': { dbz: 44, rainRate: 22, cloudTopKm: 12.0, cloudTempC: -46, lightningStrikes: 22, windKnots: 26, windDir: 'S', condition: 'Inflow Heavy Downpours from Bay Surge', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'kalbaisakhi': { dbz: 56, rainRate: 58, cloudTopKm: 15.8, cloudTempC: -72, lightningStrikes: 82, windKnots: 40, windDir: 'W', condition: 'Severe Pre-Monsoon Lightning Tempest', alert: 'Red', hydrometeor: 'Hail / Graupel' },
      'western-disturbance': { dbz: 26, rainRate: 2.8, cloudTopKm: 7.5, cloudTempC: -20, lightningStrikes: 2, windKnots: 10, windDir: 'NW', condition: 'Passing Light Mountain Showers', alert: 'Green', hydrometeor: 'Drizzle' },
      'heatwave-dust': { dbz: 14, rainRate: 0, cloudTopKm: 4.0, cloudTempC: 4, lightningStrikes: 0, windKnots: 8, windDir: 'SW', condition: 'Warm & High Humidity', alert: 'Green', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 12, rainRate: 0, cloudTopKm: 3.5, cloudTempC: -4, lightningStrikes: 0, windKnots: 8, windDir: 'NE', condition: 'Valley Fog & Cold Breezes', alert: 'Green', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'agartala',
    name: 'Agartala Radar',
    station: 'DWR Agartala',
    state: 'Tripura',
    zone: 'Northeast',
    lat: 23.89,
    lon: 91.24,
    xPercent: 82,
    yPercent: 40,
    radarType: 'C-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 54, rainRate: 55, cloudTopKm: 15.0, cloudTempC: -68, lightningStrikes: 54, windKnots: 28, windDir: 'S', condition: 'Intense Tropical Deluge', alert: 'Red', hydrometeor: 'Cloudburst' },
      'cyclone-bob': { dbz: 48, rainRate: 34, cloudTopKm: 13.5, cloudTempC: -54, lightningStrikes: 30, windKnots: 35, windDir: 'SE', condition: 'Outer Heavy Rainband Sweep', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'kalbaisakhi': { dbz: 56, rainRate: 60, cloudTopKm: 15.6, cloudTempC: -70, lightningStrikes: 78, windKnots: 42, windDir: 'NW', condition: 'Violent Kalbaisakhi Storm Cells', alert: 'Red', hydrometeor: 'Hail / Graupel' },
      'western-disturbance': { dbz: 12, rainRate: 0, cloudTopKm: 3.8, cloudTempC: -2, lightningStrikes: 0, windKnots: 6, windDir: 'NW', condition: 'Mild Winter Clouds', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 16, rainRate: 0, cloudTopKm: 4.2, cloudTempC: 6, lightningStrikes: 0, windKnots: 10, windDir: 'SW', condition: 'Humid & Overcast', alert: 'Green', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 14, rainRate: 0, cloudTopKm: 3.5, cloudTempC: 0, lightningStrikes: 0, windKnots: 8, windDir: 'NE', condition: 'Pleasant Crisp Sun', alert: 'Green', hydrometeor: 'Clear' }
    }
  },

  // WEST & KONKAN
  {
    id: 'mumbai',
    name: 'Mumbai Radar Network',
    station: 'DWR Colaba & Veravali',
    state: 'Maharashtra',
    zone: 'West',
    lat: 18.9,
    lon: 72.82,
    xPercent: 32,
    yPercent: 57,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 60, rainRate: 78, cloudTopKm: 16.4, cloudTempC: -76, lightningStrikes: 62, windKnots: 42, windDir: 'SW', condition: 'Red Alert: Offshore Trough Cloudburst & High Tide', alert: 'Red', hydrometeor: 'Cloudburst' },
      'cyclone-bob': { dbz: 16, rainRate: 0, cloudTopKm: 4.5, cloudTempC: -6, lightningStrikes: 0, windKnots: 12, windDir: 'NW', condition: 'Fair Weather & Sea Breeze', alert: 'Green', hydrometeor: 'Clear' },
      'kalbaisakhi': { dbz: 22, rainRate: 0, cloudTopKm: 5.8, cloudTempC: -12, lightningStrikes: 2, windKnots: 14, windDir: 'W', condition: 'Sultry Evening Cumulus', alert: 'Green', hydrometeor: 'Clear' },
      'western-disturbance': { dbz: 10, rainRate: 0, cloudTopKm: 3.0, cloudTempC: 4, lightningStrikes: 0, windKnots: 8, windDir: 'N', condition: 'Pleasant Coastal Winter', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 18, rainRate: 0, cloudTopKm: 4.0, cloudTempC: 12, lightningStrikes: 0, windKnots: 16, windDir: 'E', condition: 'Easterly Land Breeze Heat Surge (39.5°C)', alert: 'Orange', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 8, rainRate: 0, cloudTopKm: 2.5, cloudTempC: 6, lightningStrikes: 0, windKnots: 8, windDir: 'NE', condition: 'Sunny & Dry Coastal Air', alert: 'Green', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad / Bhuj Radar',
    station: 'DWR Ahmedabad & Bhuj Airport',
    state: 'Gujarat',
    zone: 'West',
    lat: 23.03,
    lon: 72.58,
    xPercent: 30,
    yPercent: 44,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 48, rainRate: 32, cloudTopKm: 13.5, cloudTempC: -52, lightningStrikes: 26, windKnots: 24, windDir: 'SW', condition: 'Heavy Monsoon Inflow off Arabian Sea', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'cyclone-bob': { dbz: 12, rainRate: 0, cloudTopKm: 3.8, cloudTempC: -2, lightningStrikes: 0, windKnots: 10, windDir: 'NE', condition: 'Dry Sun', alert: 'Green', hydrometeor: 'Clear' },
      'kalbaisakhi': { dbz: 16, rainRate: 0, cloudTopKm: 4.8, cloudTempC: -6, lightningStrikes: 0, windKnots: 18, windDir: 'W', condition: 'Dry Hot Gusts', alert: 'Green', hydrometeor: 'Clear' },
      'western-disturbance': { dbz: 22, rainRate: 1.5, cloudTopKm: 6.2, cloudTempC: -16, lightningStrikes: 0, windKnots: 12, windDir: 'NW', condition: 'Passing Winter Cirrus', alert: 'Green', hydrometeor: 'Drizzle' },
      'heatwave-dust': { dbz: 30, rainRate: 0, cloudTopKm: 5.8, cloudTempC: 16, lightningStrikes: 0, windKnots: 34, windDir: 'W', condition: 'Severe Heatwave (46.4°C) with Dust Plumes', alert: 'Red', hydrometeor: 'Thermal Dust Plume' },
      'northeast-monsoon': { dbz: 8, rainRate: 0, cloudTopKm: 2.2, cloudTempC: 4, lightningStrikes: 0, windKnots: 8, windDir: 'NE', condition: 'Clear Crisp Skies', alert: 'Green', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'goa',
    name: 'Goa Radar',
    station: 'DWR Panaji (Altinho)',
    state: 'Goa',
    zone: 'West',
    lat: 15.49,
    lon: 73.82,
    xPercent: 35,
    yPercent: 68,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 58, rainRate: 72, cloudTopKm: 16.0, cloudTempC: -74, lightningStrikes: 56, windKnots: 38, windDir: 'SW', condition: 'Torrential Konkan Downpour & High Swell', alert: 'Red', hydrometeor: 'Cloudburst' },
      'cyclone-bob': { dbz: 14, rainRate: 0, cloudTopKm: 4.2, cloudTempC: -4, lightningStrikes: 0, windKnots: 10, windDir: 'NW', condition: 'Sunny Tropical Beach Weather', alert: 'Green', hydrometeor: 'Clear' },
      'kalbaisakhi': { dbz: 26, rainRate: 2.4, cloudTopKm: 7.0, cloudTempC: -18, lightningStrikes: 8, windKnots: 14, windDir: 'W', condition: 'Ghat Evening Thunderhead', alert: 'Green', hydrometeor: 'Drizzle' },
      'western-disturbance': { dbz: 10, rainRate: 0, cloudTopKm: 3.2, cloudTempC: 6, lightningStrikes: 0, windKnots: 8, windDir: 'NE', condition: 'Clear Warm Sun', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 16, rainRate: 0, cloudTopKm: 4.0, cloudTempC: 10, lightningStrikes: 0, windKnots: 12, windDir: 'SW', condition: 'Humid Summer Heat (36.5°C)', alert: 'Yellow', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 18, rainRate: 1.0, cloudTopKm: 5.5, cloudTempC: -10, lightningStrikes: 2, windKnots: 10, windDir: 'E', condition: 'Isolated Post-Monsoon Evening Spells', alert: 'Green', hydrometeor: 'Drizzle' }
    }
  },

  // SOUTH PENINSULA
  {
    id: 'hyderabad',
    name: 'Hyderabad Radar',
    station: 'DWR Begumpet',
    state: 'Telangana',
    zone: 'South',
    lat: 17.44,
    lon: 78.47,
    xPercent: 49,
    yPercent: 61,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 46, rainRate: 28, cloudTopKm: 13.0, cloudTempC: -50, lightningStrikes: 32, windKnots: 20, windDir: 'SW', condition: 'Deccan Plateau Moderate Rains', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'cyclone-bob': { dbz: 44, rainRate: 24, cloudTopKm: 12.2, cloudTempC: -46, lightningStrikes: 22, windKnots: 28, windDir: 'E', condition: 'Outer Squall Bands Sweeping Deccan', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'kalbaisakhi': { dbz: 32, rainRate: 6.0, cloudTopKm: 9.0, cloudTempC: -30, lightningStrikes: 18, windKnots: 26, windDir: 'W', condition: 'Isolated Thunderstorm Cells', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'western-disturbance': { dbz: 10, rainRate: 0, cloudTopKm: 3.0, cloudTempC: 4, lightningStrikes: 0, windKnots: 6, windDir: 'NE', condition: 'Sunny & Pleasant', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 22, rainRate: 0, cloudTopKm: 4.8, cloudTempC: 12, lightningStrikes: 0, windKnots: 18, windDir: 'W', condition: 'Intense Deccan Heatwave (44.5°C)', alert: 'Orange', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 24, rainRate: 2.2, cloudTopKm: 6.8, cloudTempC: -16, lightningStrikes: 4, windKnots: 12, windDir: 'NE', condition: 'Passing Light Showers', alert: 'Green', hydrometeor: 'Drizzle' }
    }
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Radar',
    station: 'DWR HAL Airport',
    state: 'Karnataka',
    zone: 'South',
    lat: 12.97,
    lon: 77.59,
    xPercent: 47,
    yPercent: 77,
    radarType: 'C-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 42, rainRate: 16, cloudTopKm: 11.5, cloudTempC: -42, lightningStrikes: 18, windKnots: 18, windDir: 'SW', condition: 'Continuous Drizzle & Breezy Showers', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'cyclone-bob': { dbz: 38, rainRate: 12, cloudTopKm: 10.5, cloudTempC: -38, lightningStrikes: 12, windKnots: 24, windDir: 'E', condition: 'Overcast & Inflow Rain Spells', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'kalbaisakhi': { dbz: 48, rainRate: 34, cloudTopKm: 13.8, cloudTempC: -54, lightningStrikes: 44, windKnots: 30, windDir: 'W', condition: 'Intense Pre-Monsoon Mango Showers', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'western-disturbance': { dbz: 8, rainRate: 0, cloudTopKm: 2.8, cloudTempC: 6, lightningStrikes: 0, windKnots: 6, windDir: 'E', condition: 'Mild Pleasant Weather', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 16, rainRate: 0, cloudTopKm: 4.2, cloudTempC: 8, lightningStrikes: 0, windKnots: 10, windDir: 'E', condition: 'Warm & Dry (37.2°C)', alert: 'Green', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 40, rainRate: 18, cloudTopKm: 12.0, cloudTempC: -46, lightningStrikes: 16, windKnots: 18, windDir: 'NE', condition: 'Widespread Autumn Northeast Rain', alert: 'Yellow', hydrometeor: 'Moderate Rain' }
    }
  },
  {
    id: 'chennai',
    name: 'Chennai Radar',
    station: 'DWR Chennai Port (Centenary)',
    state: 'Tamil Nadu',
    zone: 'South',
    lat: 13.08,
    lon: 80.29,
    xPercent: 55,
    yPercent: 76,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 24, rainRate: 2.0, cloudTopKm: 6.5, cloudTempC: -15, lightningStrikes: 4, windKnots: 14, windDir: 'SW', condition: 'Rain-Shadow Dry Heat & Evening Sea Breeze', alert: 'Green', hydrometeor: 'Drizzle' },
      'cyclone-bob': { dbz: 58, rainRate: 74, cloudTopKm: 16.0, cloudTempC: -74, lightningStrikes: 68, windKnots: 52, windDir: 'NE', condition: 'Severe Coastal Cyclone Squall & Storm Surge', alert: 'Red', hydrometeor: 'Cloudburst' },
      'kalbaisakhi': { dbz: 28, rainRate: 3.5, cloudTopKm: 7.8, cloudTempC: -22, lightningStrikes: 12, windKnots: 16, windDir: 'S', condition: 'Convective Heat Lightning Aloft', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'western-disturbance': { dbz: 10, rainRate: 0, cloudTopKm: 3.0, cloudTempC: 6, lightningStrikes: 0, windKnots: 8, windDir: 'NE', condition: 'Pleasant Coastal Winter', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 18, rainRate: 0, cloudTopKm: 4.2, cloudTempC: 12, lightningStrikes: 0, windKnots: 12, windDir: 'W', condition: 'Extreme Kathiri Veyyil Heat (42.0°C)', alert: 'Orange', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 62, rainRate: 88, cloudTopKm: 16.8, cloudTempC: -78, lightningStrikes: 84, windKnots: 46, windDir: 'NE', condition: 'Red Alert: Torrential Northeast Monsoon Deluge', alert: 'Red', hydrometeor: 'Cloudburst' }
    }
  },
  {
    id: 'kochi',
    name: 'Kochi Radar',
    station: 'DWR Kochi Naval Base',
    state: 'Kerala',
    zone: 'South',
    lat: 9.93,
    lon: 76.26,
    xPercent: 43,
    yPercent: 88,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 62, rainRate: 94, cloudTopKm: 16.8, cloudTempC: -78, lightningStrikes: 74, windKnots: 44, windDir: 'SW', condition: 'Onset / Active Monsoon Gateway Deluge', alert: 'Red', hydrometeor: 'Cloudburst' },
      'cyclone-bob': { dbz: 26, rainRate: 3.0, cloudTopKm: 7.0, cloudTempC: -18, lightningStrikes: 6, windKnots: 14, windDir: 'W', condition: 'Western Ghats Moderate Clouds', alert: 'Green', hydrometeor: 'Drizzle' },
      'kalbaisakhi': { dbz: 46, rainRate: 26, cloudTopKm: 13.0, cloudTempC: -48, lightningStrikes: 38, windKnots: 22, windDir: 'W', condition: 'Intense Pre-Monsoon Thunderstorms', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'western-disturbance': { dbz: 12, rainRate: 0, cloudTopKm: 3.5, cloudTempC: 8, lightningStrikes: 0, windKnots: 8, windDir: 'E', condition: 'Tropical Sunny Weather', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 22, rainRate: 1.0, cloudTopKm: 5.5, cloudTempC: 4, lightningStrikes: 4, windKnots: 10, windDir: 'W', condition: 'High Humidity Sultry Summer', alert: 'Yellow', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 52, rainRate: 46, cloudTopKm: 14.5, cloudTempC: -62, lightningStrikes: 48, windKnots: 26, windDir: 'NE', condition: 'Thula Varsham Active Rainfall', alert: 'Orange', hydrometeor: 'Heavy Rain' }
    }
  },
  {
    id: 'vizag',
    name: 'Visakhapatnam Radar',
    station: 'DWR Visakhapatnam (Kailasagiri)',
    state: 'Andhra Pradesh',
    zone: 'East',
    lat: 17.68,
    lon: 83.21,
    xPercent: 60,
    yPercent: 60,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 44, rainRate: 20, cloudTopKm: 12.2, cloudTempC: -46, lightningStrikes: 24, windKnots: 22, windDir: 'SW', condition: 'Coastal Inflow Showers', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'cyclone-bob': { dbz: 64, rainRate: 98, cloudTopKm: 17.2, cloudTempC: -82, lightningStrikes: 96, windKnots: 72, windDir: 'E', condition: 'Severe Cyclone Eye Wall Landfall Approach', alert: 'Red', hydrometeor: 'Cloudburst' },
      'kalbaisakhi': { dbz: 40, rainRate: 14, cloudTopKm: 11.0, cloudTempC: -40, lightningStrikes: 22, windKnots: 28, windDir: 'W', condition: 'Coastal Squall Spells', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'western-disturbance': { dbz: 10, rainRate: 0, cloudTopKm: 3.2, cloudTempC: 4, lightningStrikes: 0, windKnots: 8, windDir: 'NE', condition: 'Clear Coast', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 20, rainRate: 0, cloudTopKm: 4.5, cloudTempC: 10, lightningStrikes: 0, windKnots: 16, windDir: 'SW', condition: 'Hot & Humid Sea Breeze Delay', alert: 'Orange', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 50, rainRate: 40, cloudTopKm: 14.0, cloudTempC: -58, lightningStrikes: 36, windKnots: 30, windDir: 'NE', condition: 'Heavy Northeast Coastal Rains', alert: 'Orange', hydrometeor: 'Heavy Rain' }
    }
  },

  // MARITIME NODES: BAY OF BENGAL & ARABIAN SEA
  {
    id: 'bob-deep',
    name: 'Bay of Bengal Deep Maritime Node',
    station: 'INSAT Ocean Pixel Sector & Buoy BD09',
    state: 'Bay of Bengal Waters',
    zone: 'Maritime',
    lat: 16.5,
    lon: 89.2,
    xPercent: 76,
    yPercent: 64,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 54, rainRate: 48, cloudTopKm: 15.2, cloudTempC: -68, lightningStrikes: 58, windKnots: 36, windDir: 'SW', condition: 'Deep Monsoon Depression Convergence', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'cyclone-bob': { dbz: 68, rainRate: 130, cloudTopKm: 18.0, cloudTempC: -86, lightningStrikes: 140, windKnots: 95, windDir: 'E', condition: 'Center of Severe Cyclonic Storm (972 hPa)', alert: 'Red', hydrometeor: 'Cloudburst' },
      'kalbaisakhi': { dbz: 32, rainRate: 6.5, cloudTopKm: 9.2, cloudTempC: -30, lightningStrikes: 18, windKnots: 22, windDir: 'S', condition: 'Marine Convective Feeder Band', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'western-disturbance': { dbz: 12, rainRate: 0, cloudTopKm: 3.5, cloudTempC: 2, lightningStrikes: 0, windKnots: 10, windDir: 'NE', condition: 'Calm Tropical Waters', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 14, rainRate: 0, cloudTopKm: 3.8, cloudTempC: 6, lightningStrikes: 0, windKnots: 8, windDir: 'SW', condition: 'Warm Sea Surface (31.2°C)', alert: 'Green', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 56, rainRate: 56, cloudTopKm: 15.4, cloudTempC: -70, lightningStrikes: 62, windKnots: 38, windDir: 'NE', condition: 'Vigorous Northeast Surge Bands', alert: 'Red', hydrometeor: 'Cloudburst' }
    }
  },
  {
    id: 'arabian-sea',
    name: 'East Arabian Sea Maritime Node',
    station: 'INSAT Ocean Pixel Sector & Buoy AD06',
    state: 'Arabian Sea Waters',
    zone: 'Maritime',
    lat: 17.2,
    lon: 69.5,
    xPercent: 22,
    yPercent: 63,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 58, rainRate: 66, cloudTopKm: 15.8, cloudTempC: -72, lightningStrikes: 62, windKnots: 45, windDir: 'SW', condition: 'Massive Arabian Sea Monsoon Inflow Arm', alert: 'Red', hydrometeor: 'Cloudburst' },
      'cyclone-bob': { dbz: 14, rainRate: 0, cloudTopKm: 4.0, cloudTempC: -2, lightningStrikes: 0, windKnots: 12, windDir: 'NW', condition: 'Fair Weather Marine Anticyclone', alert: 'Green', hydrometeor: 'Clear' },
      'kalbaisakhi': { dbz: 18, rainRate: 0.5, cloudTopKm: 5.0, cloudTempC: -8, lightningStrikes: 2, windKnots: 14, windDir: 'W', condition: 'Moderate Swell & Broken Cloud', alert: 'Green', hydrometeor: 'Clear' },
      'western-disturbance': { dbz: 12, rainRate: 0, cloudTopKm: 3.2, cloudTempC: 4, lightningStrikes: 0, windKnots: 10, windDir: 'NW', condition: 'Moderate Breeze', alert: 'Green', hydrometeor: 'Clear' },
      'heatwave-dust': { dbz: 20, rainRate: 0, cloudTopKm: 4.2, cloudTempC: 12, lightningStrikes: 0, windKnots: 16, windDir: 'W', condition: 'Coastal Sea Breeze Inversion', alert: 'Green', hydrometeor: 'Clear' },
      'northeast-monsoon': { dbz: 10, rainRate: 0, cloudTopKm: 2.8, cloudTempC: 6, lightningStrikes: 0, windKnots: 12, windDir: 'NE', condition: 'Tranquil Sea State', alert: 'Green', hydrometeor: 'Clear' }
    }
  },
  {
    id: 'port-blair',
    name: 'Andaman / Port Blair Radar',
    station: 'DWR Port Blair',
    state: 'Andaman & Nicobar',
    zone: 'Maritime',
    lat: 11.62,
    lon: 92.72,
    xPercent: 88,
    yPercent: 82,
    radarType: 'S-Band DWR',
    scenarios: {
      'active-monsoon': { dbz: 56, rainRate: 52, cloudTopKm: 15.5, cloudTempC: -70, lightningStrikes: 46, windKnots: 34, windDir: 'SW', condition: 'First Monsoon Surge & Squall Lines', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'cyclone-bob': { dbz: 52, rainRate: 40, cloudTopKm: 14.5, cloudTempC: -62, lightningStrikes: 38, windKnots: 42, windDir: 'SW', condition: 'Cyclonic Feeder Gale & Heavy Swell', alert: 'Orange', hydrometeor: 'Heavy Rain' },
      'kalbaisakhi': { dbz: 36, rainRate: 10, cloudTopKm: 10.0, cloudTempC: -34, lightningStrikes: 16, windKnots: 18, windDir: 'S', condition: 'Scattered Tropical Maritime Cells', alert: 'Yellow', hydrometeor: 'Moderate Rain' },
      'western-disturbance': { dbz: 18, rainRate: 1.2, cloudTopKm: 5.2, cloudTempC: -10, lightningStrikes: 0, windKnots: 12, windDir: 'NE', condition: 'Scattered Passing Showers', alert: 'Green', hydrometeor: 'Drizzle' },
      'heatwave-dust': { dbz: 22, rainRate: 2.0, cloudTopKm: 6.0, cloudTempC: -14, lightningStrikes: 2, windKnots: 10, windDir: 'SW', condition: 'Tropical Island Showers', alert: 'Green', hydrometeor: 'Drizzle' },
      'northeast-monsoon': { dbz: 48, rainRate: 32, cloudTopKm: 13.5, cloudTempC: -52, lightningStrikes: 32, windKnots: 28, windDir: 'NE', condition: 'Heavy Island Downpours', alert: 'Orange', hydrometeor: 'Heavy Rain' }
    }
  }
];

// Definition of 6 Accurately Modeled India Weather Scenarios
export const INDIA_WEATHER_SCENARIOS_CONFIG: Record<
  IndiaWeatherScenario,
  {
    name: string;
    badge: string;
    subtitle: string;
    season: string;
    dominantHazard: string;
    synopticDescription: string;
    isobarRange: string;
    activeStations: string;
    maxReflectivity: number;
    colorTheme: 'emerald' | 'amber' | 'rose' | 'sky' | 'purple' | 'cyan';
  }
> = {
  'active-monsoon': {
    name: 'Active Southwest Monsoon Surge',
    badge: 'MONSOON TROUGH',
    subtitle: 'Widespread Extreme Inflow: Western Ghats, Vidarbha & Assam',
    season: 'June – September (Kharif Season)',
    dominantHazard: 'Flash Flooding & Landslide Warning',
    synopticDescription: 'Monsoon trough south of its normal position with active Arabian Sea & Bay of Bengal low-pressure depressions converging across Central India.',
    isobarRange: '996 – 1004 hPa',
    maxReflectivity: 62.5,
    activeStations: '37 DWRs Synchronized • Mumbai, Kochi, Nagpur & Sohra on Red Alert',
    colorTheme: 'sky'
  },
  'cyclone-bob': {
    name: 'Severe Cyclonic Storm over Bay of Bengal',
    badge: 'CYCLONE EMERGENCY',
    subtitle: 'Vortex Eye-Wall Approaching Odisha & North Andhra Coast',
    season: 'Pre/Post-Monsoon (May / October–November)',
    dominantHazard: 'Storm Surge & Coastal Catastrophic Wind >120 kmph',
    synopticDescription: 'Deep depression intensified into a Severe Cyclonic Storm. Tightly coiled spiral bands visible in INSAT-3DR and S-Band DWR feeds from Paradip and Vizag.',
    isobarRange: '974 – 998 hPa (Steep Barometric Gradient)',
    maxReflectivity: 68.0,
    activeStations: 'Coastal DWRs (Vizag, Paradip, Kolkata, Chennai) in Rapid 5-min Scan',
    colorTheme: 'rose'
  },
  'kalbaisakhi': {
    name: 'Severe Nor’wester (Kalbaisakhi) & Hailstorm',
    badge: 'SEVERE CONVECTIVE NOWCAST',
    subtitle: 'Violent Squall Lines over Bengal, Chota Nagpur & Assam',
    season: 'Pre-Monsoon (March – May)',
    dominantHazard: 'Damaging Hail, 100 kmph Microbursts & Lightning Strikes',
    synopticDescription: 'Dry continental westerly air overriding moist southerly Bay of Bengal winds, triggering massive supercells reaching tropopause heights of 17.5 km.',
    isobarRange: '1004 – 1010 hPa',
    maxReflectivity: 65.0,
    activeStations: 'DWR Kolkata, Ranchi, Patna & Agartala active hydrometeor classification',
    colorTheme: 'amber'
  },
  'western-disturbance': {
    name: 'Active Western Disturbance & Mountain Blizzard',
    badge: 'HIMALAYAN SNOW & COLD WAVE',
    subtitle: 'Heavy Snowfall in J&K, HP, Uttarakhand with North Plains Rain',
    season: 'Winter (December – February)',
    dominantHazard: 'Avalanche Risk & Dense Sub-Zero Radiation Fog',
    synopticDescription: 'Mid-latitude upper tropospheric westerly trough inducing an induced cyclonic circulation over Northwest Rajasthan and Punjab with Himalayan snowpack replenishment.',
    isobarRange: '1014 – 1022 hPa',
    maxReflectivity: 56.0,
    activeStations: 'DWR Srinagar, Kufri, Mukteshwar & Palam Delhi tracking precipitation fronts',
    colorTheme: 'cyan'
  },
  'heatwave-dust': {
    name: 'Severe Heatwave & Thar Dust Storm (Andhi)',
    badge: 'EXTREME THERMAL ALERT',
    subtitle: 'Surface Temperatures 45°–48°C with Suspended Dust Plumes',
    season: 'Pre-Monsoon Peak (April – June)',
    dominantHazard: 'Heat Stroke Risk & Severe Visibility Drop <500m',
    synopticDescription: 'Persistent anti-cyclonic subsidence over Northwest and Central India advecting scorching thermal plumes from the Thar desert into NCR and Indo-Gangetic belt.',
    isobarRange: '1000 – 1006 hPa',
    maxReflectivity: 36.0,
    activeStations: 'DWR Jaipur, Jodhpur, Bhuj & Delhi monitoring thermal echo boundaries',
    colorTheme: 'purple'
  },
  'northeast-monsoon': {
    name: 'Active Northeast Winter Monsoon Deluge',
    badge: 'COROMANDEL RETREATING SURGE',
    subtitle: 'Torrential Inflow over Coastal Tamil Nadu, Puducherry & Rayalaseema',
    season: 'Post-Monsoon (October – December)',
    dominantHazard: 'Urban Flooding in Coastal Metros & Lowland Inundation',
    synopticDescription: 'Strong northeasterly wind surge picking up abundant moisture over the Bay of Bengal and slamming into the Coromandel coast with continuous heavy convective bands.',
    isobarRange: '1008 – 1014 hPa',
    maxReflectivity: 62.0,
    activeStations: 'DWR Chennai Port, Karaikal, Kochi & Bengaluru on round-the-clock watch',
    colorTheme: 'emerald'
  }
};

interface IndiaRadarPixelCanvasProps {
  onAwardXP?: (amount: number, reason: string) => void;
  onOpenStation?: (stationId: string) => void;
  onSelectNode?: (node: IndiaPixelPoint) => void;
}

export const IndiaRadarPixelCanvas: React.FC<IndiaRadarPixelCanvasProps> = ({
  onAwardXP,
  onOpenStation,
  onSelectNode
}) => {
  // Scenario state: accurately changes the weather over India!
  const [activeScenario, setActiveScenario] = useState<IndiaWeatherScenario>('active-monsoon');
  
  // Layer state
  const [activeLayer, setActiveLayer] = useState<PixelMetricLayer>('dbz');
  
  // Grid visual mode
  const [showPixelMesh, setShowPixelMesh] = useState<boolean>(true);
  const [showRadarRings, setShowRadarRings] = useState<boolean>(true);
  const [showWindVectors, setShowWindVectors] = useState<boolean>(true);
  const [pixelResolution, setPixelResolution] = useState<'250m' | '500m' | 'smooth'>('250m');

  // Animation playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeStepIndex, setTimeStepIndex] = useState<number>(4); // 4 = LIVE (NOW)
  const timeSteps = [
    { label: 'T-60m', offset: -60, title: '60 Mins Ago' },
    { label: 'T-45m', offset: -45, title: '45 Mins Ago' },
    { label: 'T-30m', offset: -30, title: '30 Mins Ago' },
    { label: 'T-15m', offset: -15, title: '15 Mins Ago' },
    { label: 'LIVE', offset: 0, title: 'Current DWR Scan' },
    { label: '+15m', offset: 15, title: '15-Min Nowcast' },
    { label: '+30m', offset: 30, title: '30-Min Nowcast' }
  ];

  // Selected Node for telemetry inspection
  const [selectedNode, setSelectedNode] = useState<IndiaPixelPoint>(INDIA_RADAR_PIXEL_NODES[8]); // Default Mumbai
  const [hoveredNode, setHoveredNode] = useState<IndiaPixelPoint | null>(null);

  // Auto-play interval for radar loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeStepIndex((prev) => (prev + 1) % timeSteps.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeSteps.length]);

  const currentScenarioConfig = INDIA_WEATHER_SCENARIOS_CONFIG[activeScenario];

  // Color helper according to IMD DWR standard scales
  const getPixelStyle = (node: IndiaPixelPoint) => {
    const data = node.scenarios[activeScenario];
    
    // Time offset factor (perturb values slightly as storms drift in time)
    const timeOffset = timeSteps[timeStepIndex].offset;
    const timeFactor = 1 + Math.sin(timeOffset * 0.05 + node.lat * 0.2) * 0.15;
    
    const effectiveDbz = Math.max(0, Math.min(75, Math.round(data.dbz * timeFactor)));
    const effectiveRain = Math.max(0, Math.round(data.rainRate * timeFactor));
    const effectiveTemp = data.cloudTempC;
    const effectiveLightning = Math.max(0, Math.round(data.lightningStrikes * timeFactor));

    if (activeLayer === 'dbz') {
      if (effectiveDbz < 15) {
        return {
          bg: 'bg-slate-800/40 text-slate-400 border-slate-700/50',
          hex: 'rgba(30, 41, 59, 0.45)',
          glow: 'none',
          label: `${effectiveDbz} dBZ`
        };
      } else if (effectiveDbz < 25) {
        return {
          bg: 'bg-cyan-500/80 text-white border-cyan-300',
          hex: 'rgba(6, 182, 212, 0.85)',
          glow: '0 0 10px rgba(6, 182, 212, 0.6)',
          label: `${effectiveDbz} dBZ (Light)`
        };
      } else if (effectiveDbz < 35) {
        return {
          bg: 'bg-emerald-500/85 text-white border-emerald-300',
          hex: 'rgba(16, 185, 129, 0.85)',
          glow: '0 0 12px rgba(16, 185, 129, 0.65)',
          label: `${effectiveDbz} dBZ (Moderate)`
        };
      } else if (effectiveDbz < 45) {
        return {
          bg: 'bg-amber-400/90 text-slate-950 border-amber-200 font-bold',
          hex: 'rgba(251, 191, 36, 0.9)',
          glow: '0 0 14px rgba(251, 191, 36, 0.75)',
          label: `${effectiveDbz} dBZ (Heavy)`
        };
      } else if (effectiveDbz < 55) {
        return {
          bg: 'bg-orange-600/90 text-white border-orange-300 font-bold',
          hex: 'rgba(234, 88, 12, 0.92)',
          glow: '0 0 16px rgba(234, 88, 12, 0.85)',
          label: `${effectiveDbz} dBZ (Very Heavy)`
        };
      } else if (effectiveDbz < 65) {
        return {
          bg: 'bg-rose-600 text-white border-rose-300 font-black',
          hex: 'rgba(225, 29, 72, 0.95)',
          glow: '0 0 20px rgba(225, 29, 72, 0.95)',
          label: `${effectiveDbz} dBZ (Extreme)`
        };
      } else {
        return {
          bg: 'bg-fuchsia-600 text-white border-fuchsia-200 font-black',
          hex: 'rgba(192, 38, 211, 0.98)',
          glow: '0 0 24px rgba(192, 38, 211, 1)',
          label: `${effectiveDbz} dBZ (Hail Core)`
        };
      }
    }

    if (activeLayer === 'rain') {
      if (effectiveRain === 0) {
        return { bg: 'bg-slate-800/40 text-slate-400 border-slate-700/50', hex: 'rgba(30, 41, 59, 0.45)', glow: 'none', label: '0 mm/hr' };
      } else if (effectiveRain < 10) {
        return { bg: 'bg-sky-400/80 text-white border-sky-200', hex: 'rgba(56, 189, 248, 0.85)', glow: '0 0 10px rgba(56, 189, 248, 0.6)', label: `${effectiveRain} mm/hr` };
      } else if (effectiveRain < 35) {
        return { bg: 'bg-emerald-500/85 text-white border-emerald-200', hex: 'rgba(16, 185, 129, 0.85)', glow: '0 0 12px rgba(16, 185, 129, 0.65)', label: `${effectiveRain} mm/hr` };
      } else if (effectiveRain < 65) {
        return { bg: 'bg-amber-500 text-slate-950 border-amber-200 font-bold', hex: 'rgba(245, 158, 11, 0.9)', glow: '0 0 16px rgba(245, 158, 11, 0.8)', label: `${effectiveRain} mm/hr (Heavy)` };
      } else {
        return { bg: 'bg-rose-600 text-white border-rose-200 font-black', hex: 'rgba(225, 29, 72, 0.95)', glow: '0 0 22px rgba(225, 29, 72, 1)', label: `${effectiveRain} mm/hr (Downpour)` };
      }
    }

    if (activeLayer === 'ir') {
      if (effectiveTemp > 0) {
        return { bg: 'bg-slate-700/60 text-slate-300 border-slate-600', hex: 'rgba(51, 65, 85, 0.7)', glow: 'none', label: `${effectiveTemp}°C (Warm/Clear)` };
      } else if (effectiveTemp > -30) {
        return { bg: 'bg-sky-600/80 text-white border-sky-300', hex: 'rgba(2, 132, 199, 0.85)', glow: '0 0 10px rgba(2, 132, 199, 0.6)', label: `${effectiveTemp}°C (Mid Cloud)` };
      } else if (effectiveTemp > -60) {
        return { bg: 'bg-indigo-600/90 text-white border-indigo-300', hex: 'rgba(79, 70, 229, 0.9)', glow: '0 0 15px rgba(79, 70, 229, 0.7)', label: `${effectiveTemp}°C (Cold Anvil)` };
      } else {
        return { bg: 'bg-fuchsia-600 text-white border-fuchsia-200 font-black', hex: 'rgba(192, 38, 211, 0.98)', glow: '0 0 22px rgba(192, 38, 211, 0.95)', label: `${effectiveTemp}°C (Overshooting Top)` };
      }
    }

    if (activeLayer === 'lightning') {
      if (effectiveLightning === 0) {
        return { bg: 'bg-slate-800/40 text-slate-400 border-slate-700/50', hex: 'rgba(30, 41, 59, 0.45)', glow: 'none', label: '0 strikes' };
      } else if (effectiveLightning < 15) {
        return { bg: 'bg-yellow-400 text-slate-950 border-yellow-200 font-bold', hex: 'rgba(250, 204, 21, 0.9)', glow: '0 0 12px rgba(250, 204, 21, 0.8)', label: `${effectiveLightning} strikes/15m` };
      } else if (effectiveLightning < 50) {
        return { bg: 'bg-amber-500 text-slate-950 border-amber-100 font-black', hex: 'rgba(245, 158, 11, 0.95)', glow: '0 0 18px rgba(245, 158, 11, 0.9)', label: `${effectiveLightning} strikes/15m` };
      } else {
        return { bg: 'bg-rose-500 text-white border-white font-black animate-pulse', hex: 'rgba(244, 63, 94, 1)', glow: '0 0 26px rgba(244, 63, 94, 1)', label: `${effectiveLightning} strikes/15m (Severe)` };
      }
    }

    // Default velocity
    return {
      bg: 'bg-teal-600 text-white border-teal-300 font-bold',
      hex: 'rgba(13, 148, 136, 0.88)',
      glow: '0 0 12px rgba(13, 148, 136, 0.65)',
      label: `${data.windKnots} kts ${data.windDir}`
    };
  };

  const activeNodeData = selectedNode.scenarios[activeScenario];

  return (
    <div className="space-y-5">
      {/* SCENARIO SELECTOR BAR (Weather Condition of India) */}
      <div className="p-4 sm:p-5 rounded-3xl pryda-glass-tray relative shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-sm sm:text-base font-black text-slate-950 dark:text-white tracking-tight">
                India Meteorology Scenario Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                IMD DWR MOSAIC
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
              Select an Indian meteorological condition below to simulate realistic weather across India’s radar pixel grid:
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            <span className="px-2.5 py-1 rounded-xl liquid-glass-pill-frosted border border-slate-300 dark:border-slate-700">
              {INDIA_RADAR_PIXEL_NODES.length} DWR Stations
            </span>
            <span className="px-2.5 py-1 rounded-xl liquid-glass-pill-frosted border border-emerald-400 text-emerald-950 dark:text-emerald-300">
              Peak: {currentScenarioConfig.maxReflectivity} dBZ
            </span>
          </div>
        </div>

        {/* 6 High-Fidelity Indian Weather Scenarios Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4 pt-3 border-t border-white/60 dark:border-white/10">
          {(Object.keys(INDIA_WEATHER_SCENARIOS_CONFIG) as IndiaWeatherScenario[]).map((scKey) => {
            const sc = INDIA_WEATHER_SCENARIOS_CONFIG[scKey];
            const isSelected = activeScenario === scKey;
            return (
              <button
                key={scKey}
                type="button"
                onClick={() => {
                  sound.playBlip(750);
                  setActiveScenario(scKey);
                  onAwardXP?.(10, `Loaded India Weather: ${sc.name}`);
                }}
                className={`flex flex-col items-start p-2.5 rounded-2xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'liquid-glass-pill liquid-glass-pill-sky text-white shadow-md border-sky-300 scale-[1.02]'
                    : 'liquid-glass-pill-frosted border-white/70 dark:border-white/10 hover:border-sky-400 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                  }`}>
                    {sc.badge}
                  </span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                </div>

                <div className={`text-xs font-black mt-2 leading-tight ${isSelected ? 'text-white' : 'text-slate-950 dark:text-white'}`}>
                  {sc.name}
                </div>

                <div className={`text-[10px] mt-1 font-medium truncate w-full ${isSelected ? 'text-cyan-100' : 'text-slate-600 dark:text-slate-400'}`}>
                  {sc.season}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* METRIC CONTROLS & TIME TIMELINE BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl liquid-glass-pill-frosted border border-white/80 dark:border-white/15 shadow-xs">
        
        {/* Metric Layer Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              sound.playBlip(700);
              setActiveLayer('dbz');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'dbz'
                ? 'bg-white dark:bg-slate-800 text-sky-950 dark:text-sky-300 shadow-2xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-sky-600" />
            <span>Doppler dBZ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playBlip(700);
              setActiveLayer('rain');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'rain'
                ? 'bg-white dark:bg-slate-800 text-sky-950 dark:text-sky-300 shadow-2xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rain Rate (mm/hr)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playBlip(700);
              setActiveLayer('ir');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'ir'
                ? 'bg-white dark:bg-slate-800 text-sky-950 dark:text-sky-300 shadow-2xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>INSAT-3DR IR Cloud (°C)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playBlip(700);
              setActiveLayer('lightning');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'lightning'
                ? 'bg-white dark:bg-slate-800 text-sky-950 dark:text-sky-300 shadow-2xs font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Damini Lightning</span>
          </button>
        </div>

        {/* TIME TIMELINE & SCRUBBER */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              sound.playBlip(800);
              setIsPlaying(!isPlaying);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 border border-amber-300'
                : 'bg-sky-600 hover:bg-sky-500 text-white'
            }`}
            title="Play / Pause Animated Radar Sweep Timeline"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause Loop' : 'Play Loop'}</span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-900/90 rounded-full border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
            {timeSteps.map((step, idx) => (
              <button
                key={step.label}
                type="button"
                onClick={() => {
                  sound.playBlip(600);
                  setTimeStepIndex(idx);
                }}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  timeStepIndex === idx
                    ? step.label === 'LIVE'
                      ? 'bg-emerald-600 text-white shadow-xs font-black'
                      : 'bg-sky-600 text-white shadow-xs font-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950'
                }`}
                title={step.title}
              >
                {step.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowRadarRings(!showRadarRings)}
              className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                showRadarRings ? 'bg-sky-100 text-sky-800 border-sky-300' : 'text-slate-500 border-slate-200'
              }`}
              title="Toggle Radar Range Rings (100km, 250km)"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowPixelMesh(!showPixelMesh)}
              className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                showPixelMesh ? 'bg-sky-100 text-sky-800 border-sky-300' : 'text-slate-500 border-slate-200'
              }`}
              title="Toggle 250m Raster Mesh"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN RADAR CANVAS GRID (ACCURATE INDIA MAP & PIXEL MATRIX) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive Geographic India Radar Pixel Matrix */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-[32px] overflow-hidden border-2 border-sky-300/70 dark:border-sky-500/40 shadow-2xl bg-gradient-to-b from-[#061226] via-[#091b36] to-[#040e1e] p-4 sm:p-6 select-none group">
            
            {/* Ambient radar glow in background */}
            <div className="absolute inset-0 radar-sweep-glow pointer-events-none opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

            {/* TOP BAR: SYNCHRONIZED STATION STATUS & CURRENT SCAN TIME */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-white pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-xs font-black tracking-wider text-sky-300">
                  NATIONAL DOPPLER RADAR NETWORK (DWR) • INDIA COMPOSITE
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300">
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-200 border border-sky-400/40 font-bold">
                  {timeSteps[timeStepIndex].title} ({timeSteps[timeStepIndex].label})
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">37 DWRs ONLINE</span>
              </div>
            </div>

            {/* INTERACTIVE GEOGRAPHIC CANVAS CONTAINER */}
            <div className="relative z-10 w-full h-[460px] sm:h-[560px] flex items-center justify-center my-2">
              
              {/* ACCURATE INDIA GEOGRAPHIC OUTLINE (SVG Cartographic Projection) */}
              <svg
                viewBox="0 0 600 660"
                className="w-full h-full max-h-[560px] drop-shadow-[0_0_25px_rgba(56,189,248,0.2)] pointer-events-none"
                style={{ filter: 'drop-shadow(0 0 12px rgba(14, 165, 233, 0.3))' }}
              >
                <defs>
                  {/* Subtle terrain and water gradients */}
                  <linearGradient id="indiaLandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0c2242" stopOpacity="0.75" />
                    <stop offset="50%" stopColor="#0a2a4e" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#061c36" stopOpacity="0.8" />
                  </linearGradient>

                  <radialGradient id="radarSweepSweep" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(56, 189, 248, 0.25)" />
                    <stop offset="85%" stopColor="rgba(56, 189, 248, 0.05)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>

                {/* Coastline / Country Boundary of India with realistic contours */}
                <path
                  d="M 210,50 
                     L 245,65 L 265,95 L 245,125 L 285,150 L 320,145 L 340,165 
                     L 380,170 L 400,195 L 435,210 L 475,200 L 515,190 L 530,225 
                     L 515,250 L 485,250 L 475,280 L 440,290 L 420,320 L 430,350 
                     L 405,385 L 390,440 L 355,490 L 340,540 L 315,585 L 300,605 
                     L 285,585 L 265,525 L 240,460 L 210,410 L 215,365 L 180,340 
                     L 160,330 L 175,290 L 155,270 L 195,245 L 190,205 L 225,185 
                     L 215,130 L 185,105 L 210,50 Z"
                  fill="url(#indiaLandGrad)"
                  stroke="rgba(125, 211, 252, 0.65)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Sub-division dividing streamlines */}
                <path
                  d="M 285,150 Q 340,250 355,490"
                  fill="none"
                  stroke="rgba(125, 211, 252, 0.2)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 180,340 Q 300,340 430,350"
                  fill="none"
                  stroke="rgba(125, 211, 252, 0.2)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Andaman and Nicobar Islands representation */}
                <g stroke="rgba(125, 211, 252, 0.6)" strokeWidth="1.5" fill="rgba(12, 34, 66, 0.8)">
                  <ellipse cx="525" cy="520" rx="6" ry="16" />
                  <ellipse cx="530" cy="555" rx="5" ry="12" />
                </g>

                {/* Lakshadweep representation */}
                <g stroke="rgba(125, 211, 252, 0.6)" strokeWidth="1.5" fill="rgba(12, 34, 66, 0.8)">
                  <ellipse cx="230" cy="550" rx="4" ry="8" />
                  <ellipse cx="235" cy="575" rx="4" ry="6" />
                </g>

                {/* Doppler Radar Range Rings centered on key stations */}
                {showRadarRings && (
                  <g stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" strokeDasharray="3 3">
                    {/* Delhi Range Ring */}
                    <circle cx="246" cy="172" r="55" fill="url(#radarSweepSweep)" />
                    <circle cx="246" cy="172" r="110" fill="none" />
                    
                    {/* Mumbai Range Ring */}
                    <circle cx="192" cy="376" r="60" fill="url(#radarSweepSweep)" />
                    <circle cx="192" cy="376" r="120" fill="none" />

                    {/* Kolkata Range Ring */}
                    <circle cx="420" cy="284" r="60" fill="url(#radarSweepSweep)" />
                    <circle cx="420" cy="284" r="120" fill="none" />

                    {/* Chennai Range Ring */}
                    <circle cx="330" cy="502" r="55" fill="url(#radarSweepSweep)" />
                    <circle cx="330" cy="502" r="110" fill="none" />
                  </g>
                )}

                {/* Regional Labels on Map */}
                <text x="210" y="80" fill="rgba(186, 230, 253, 0.5)" fontSize="11" fontFamily="monospace" fontWeight="bold">HIMALAYAS</text>
                <text x="145" y="220" fill="rgba(186, 230, 253, 0.5)" fontSize="11" fontFamily="monospace" fontWeight="bold">THAR DESERT</text>
                <text x="280" y="235" fill="rgba(186, 230, 253, 0.5)" fontSize="11" fontFamily="monospace" fontWeight="bold">GANGETIC PLAINS</text>
                <text x="470" y="240" fill="rgba(186, 230, 253, 0.5)" fontSize="11" fontFamily="monospace" fontWeight="bold">NORTHEAST</text>
                <text x="270" y="380" fill="rgba(186, 230, 253, 0.5)" fontSize="11" fontFamily="monospace" fontWeight="bold">DECCAN PLATEAU</text>
                <text x="80" y="440" fill="rgba(14, 165, 233, 0.4)" fontSize="12" fontFamily="monospace" fontWeight="bold">ARABIAN SEA</text>
                <text x="440" y="470" fill="rgba(14, 165, 233, 0.4)" fontSize="12" fontFamily="monospace" fontWeight="bold">BAY OF BENGAL</text>
              </svg>

              {/* RASTER PIXEL MESH OVERLAY ACROSS INDIA */}
              {showPixelMesh && (
                <div className="absolute inset-0 weather-pixel-overlay pointer-events-none opacity-40" />
              )}

              {/* INTERACTIVE RADAR WEATHER PIXEL NODES (ACCURATELY POSITIONED OVER INDIA) */}
              <div className="absolute inset-0">
                {INDIA_RADAR_PIXEL_NODES.map((node) => {
                  const pStyle = getPixelStyle(node);
                  const isSelected = selectedNode.id === node.id;
                  const nodeData = node.scenarios[activeScenario];

                  return (
                    <div
                      key={node.id}
                      style={{
                        left: `${node.xPercent}%`,
                        top: `${node.yPercent}%`
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      {/* Interactive Pixel Target Button */}
                      <button
                        type="button"
                        onClick={() => {
                          sound.playBlip(850);
                          setSelectedNode(node);
                          onSelectNode?.(node);
                          onAwardXP?.(15, `Inspected Radar Node: ${node.name}`);
                        }}
                        onMouseEnter={() => setHoveredNode(node)}
                        onMouseLeave={() => setHoveredNode(null)}
                        className={`group relative flex items-center justify-center p-1.5 rounded-xl cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? 'scale-130 z-30 ring-2 ring-white shadow-xl'
                            : 'hover:scale-120'
                        }`}
                        title={`${node.name} (${node.state}) • ${pStyle.label}`}
                      >
                        {/* Dynamic Glowing Pulse halo */}
                        <span
                          className="absolute inset-0 rounded-xl opacity-75 animate-ping"
                          style={{ backgroundColor: pStyle.hex }}
                        />

                        {/* Solid Pixel Element */}
                        <span
                          className={`relative w-4 h-4 sm:w-5 sm:h-5 rounded-lg border flex items-center justify-center text-[8px] font-mono shadow-md ${pStyle.bg}`}
                          style={{ boxShadow: pStyle.glow }}
                        >
                          {nodeData.alert === 'Red' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          )}
                        </span>

                        {/* Pixel Callout Tag (on Hover) */}
                        <div className="absolute left-6 whitespace-nowrap px-2.5 py-1 rounded-xl text-[10px] font-mono font-black bg-slate-950/95 text-white backdrop-blur-md border border-sky-400/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-40">
                          <div className="text-sky-300 font-bold">{node.name}</div>
                          <div className="text-white text-[11px] font-black">{pStyle.label}</div>
                          <div className="text-slate-400 text-[9px]">{node.lat}°N, {node.lon}°E</div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* FROSTED GLASS HUD: ACTIVE TELEMETRY INSPECTOR (SELECTED NODE) */}
              <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm glass-hud rounded-3xl p-4 text-white z-30 border border-white/25 shadow-2xl animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-sky-300 font-black">
                        {selectedNode.station}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-white leading-tight mt-0.5">
                      {selectedNode.name}
                    </h4>
                    <div className="text-[11px] font-mono text-slate-300 mt-0.5">
                      Coordinates: {selectedNode.lat}°N, {selectedNode.lon}°E ({selectedNode.state})
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase text-white shrink-0 ${
                    activeNodeData.alert === 'Red' ? 'bg-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.8)]' :
                    activeNodeData.alert === 'Orange' ? 'bg-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.8)]' :
                    activeNodeData.alert === 'Yellow' ? 'bg-yellow-600 text-slate-950' :
                    'bg-emerald-600'
                  }`}>
                    {activeNodeData.alert} Alert
                  </span>
                </div>

                {/* Weather Forecast Condition */}
                <div className="mt-2.5 p-2 rounded-xl bg-white/10 border border-white/10 text-xs">
                  <div className="text-[10px] font-mono text-sky-300 font-bold uppercase">
                    Active Condition ({currentScenarioConfig.name})
                  </div>
                  <div className="font-bold text-white mt-0.5 leading-snug">
                    {activeNodeData.condition}
                  </div>
                </div>

                {/* 4 Meteorological Sensor Parameters */}
                <div className="grid grid-cols-4 gap-2 mt-2.5 pt-2 border-t border-white/15 text-center">
                  <div className="p-2 rounded-xl bg-white/10">
                    <div className="text-[9px] font-mono text-slate-300 uppercase">dBZ Echo</div>
                    <div className="text-xs font-black text-sky-300 mt-0.5">{activeNodeData.dbz} dBZ</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10">
                    <div className="text-[9px] font-mono text-slate-300 uppercase">Rain Rate</div>
                    <div className="text-xs font-black text-emerald-300 mt-0.5">{activeNodeData.rainRate} mm/h</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10">
                    <div className="text-[9px] font-mono text-slate-300 uppercase">Cloud Top</div>
                    <div className="text-xs font-black text-amber-300 mt-0.5">{activeNodeData.cloudTopKm} km</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white/10">
                    <div className="text-[9px] font-mono text-slate-300 uppercase">Temp (°C)</div>
                    <div className="text-xs font-black text-purple-300 mt-0.5">{activeNodeData.cloudTempC}°C</div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-[10px] text-slate-300 font-bold">
                    Wind: {activeNodeData.windKnots} kts {activeNodeData.windDir} | {activeNodeData.hydrometeor}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playBlip(900);
                      onAwardXP?.(20, `Logged Telemetry for ${selectedNode.name}`);
                    }}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-sky-500 hover:bg-sky-400 text-white cursor-pointer transition-all shadow-xs"
                  >
                    Log in Lab (+20 XP)
                  </button>
                </div>
              </div>

              {/* BOTTOM RIGHT: ACCURATE IMD REFLECTIVITY SCALE */}
              <div className="absolute bottom-3 right-3 hidden sm:flex flex-col items-end gap-1.5 z-20 pointer-events-none">
                <div className="glass-pill px-3 py-1 text-[10px] font-mono font-black text-slate-900 shadow-sm">
                  {activeLayer === 'dbz' ? 'IMD Radar Scale (dBZ)' :
                   activeLayer === 'rain' ? 'Rain Rate (mm/hr)' :
                   activeLayer === 'ir' ? 'Cloud Top Temp (°C)' : 'Lightning Flash Density'}
                </div>
                {activeLayer === 'dbz' && (
                  <div className="h-4 w-48 rounded-lg overflow-hidden border border-white/40 shadow-md bg-gradient-to-r from-cyan-400 via-emerald-400 via-yellow-400 via-orange-500 via-rose-600 to-fuchsia-600 flex items-center justify-between px-1.5 text-[8px] font-black text-slate-950">
                    <span>15</span>
                    <span>25</span>
                    <span>35</span>
                    <span>45</span>
                    <span>55</span>
                    <span>65+</span>
                  </div>
                )}
                {activeLayer === 'rain' && (
                  <div className="h-4 w-48 rounded-lg overflow-hidden border border-white/40 shadow-md bg-gradient-to-r from-sky-400 via-emerald-400 via-yellow-400 to-rose-600 flex items-center justify-between px-1.5 text-[8px] font-black text-slate-950">
                    <span>0</span>
                    <span>10</span>
                    <span>35</span>
                    <span>65</span>
                    <span>120+</span>
                  </div>
                )}
                {activeLayer === 'ir' && (
                  <div className="h-4 w-48 rounded-lg overflow-hidden border border-white/40 shadow-md bg-gradient-to-r from-slate-600 via-sky-600 via-indigo-600 to-fuchsia-600 flex items-center justify-between px-1.5 text-[8px] font-black text-white">
                    <span>10°C</span>
                    <span>-15°C</span>
                    <span>-45°C</span>
                    <span>-65°C</span>
                    <span>-85°C</span>
                  </div>
                )}
                {activeLayer === 'lightning' && (
                  <div className="h-4 w-48 rounded-lg overflow-hidden border border-white/40 shadow-md bg-gradient-to-r from-slate-800 via-yellow-400 via-amber-500 to-rose-500 flex items-center justify-between px-1.5 text-[8px] font-black text-slate-950">
                    <span>0</span>
                    <span>15</span>
                    <span>35</span>
                    <span>60</span>
                    <span>100+</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Quick Station Select Chips */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl liquid-glass-pill-frosted border border-white/80 dark:border-white/10 text-xs">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 px-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              Jump to Radar:
            </span>
            {INDIA_RADAR_PIXEL_NODES.slice(0, 10).map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  sound.playBlip(600);
                  setSelectedNode(node);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  selectedNode.id === node.id
                    ? 'liquid-glass-pill liquid-glass-pill-sky text-white shadow-2xs font-black'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {node.name.replace(' Radar', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Synchronized Weather Bulletin & Synoptic Dossier */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Synoptic Bulletin Card */}
          <div className="p-5 rounded-3xl pryda-glass-tray relative shadow-md">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/60 dark:border-white/15">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-sky-500 text-white shadow-xs">
                {currentScenarioConfig.badge}
              </span>
              <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-bold">
                SYNOPTIC DOSSIER
              </span>
            </div>

            <div className="mt-3">
              <h4 className="text-base font-black text-slate-950 dark:text-white leading-tight">
                {currentScenarioConfig.name}
              </h4>
              <p className="text-xs text-sky-800 dark:text-cyan-300 font-bold mt-1">
                {currentScenarioConfig.subtitle}
              </p>
            </div>

            <div className="mt-3.5 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-sky-200/60 dark:border-sky-800/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentScenarioConfig.synopticDescription}
            </div>

            {/* Key Synoptic Parameters */}
            <div className="mt-4 space-y-2 pt-3 border-t border-white/60 dark:border-white/15 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Barometric Isobar Range:</span>
                <span className="font-mono font-black text-slate-900 dark:text-white">{currentScenarioConfig.isobarRange}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Primary Hazard Level:</span>
                <span className="font-mono font-black text-rose-600 dark:text-rose-400">{currentScenarioConfig.dominantHazard}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Network Calibration:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">IMD Dual-Pol Validated</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/60 dark:border-white/15">
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                Active Station Watch:
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                {currentScenarioConfig.activeStations}
              </div>
            </div>
          </div>

          {/* Real-Time Alert Distribution Summary */}
          <div className="p-4 rounded-3xl liquid-glass-pill-frosted border border-white/80 dark:border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider">
                India Pixel Warning Distribution
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">
                {activeScenario}
              </span>
            </div>

            {/* 4 Warning Categories Count */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
                <div className="text-[9px] font-mono uppercase text-emerald-800 dark:text-emerald-300 font-bold">Green</div>
                <div className="text-base font-black text-emerald-900 dark:text-emerald-200 mt-0.5">
                  {INDIA_RADAR_PIXEL_NODES.filter((n) => n.scenarios[activeScenario].alert === 'Green').length}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-300 dark:border-yellow-800">
                <div className="text-[9px] font-mono uppercase text-yellow-800 dark:text-yellow-300 font-bold">Yellow</div>
                <div className="text-base font-black text-yellow-900 dark:text-yellow-200 mt-0.5">
                  {INDIA_RADAR_PIXEL_NODES.filter((n) => n.scenarios[activeScenario].alert === 'Yellow').length}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800">
                <div className="text-[9px] font-mono uppercase text-amber-800 dark:text-amber-300 font-bold">Orange</div>
                <div className="text-base font-black text-amber-900 dark:text-amber-200 mt-0.5">
                  {INDIA_RADAR_PIXEL_NODES.filter((n) => n.scenarios[activeScenario].alert === 'Orange').length}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800">
                <div className="text-[9px] font-mono uppercase text-rose-800 dark:text-rose-300 font-bold">Red</div>
                <div className="text-base font-black text-rose-900 dark:text-rose-200 mt-0.5">
                  {INDIA_RADAR_PIXEL_NODES.filter((n) => n.scenarios[activeScenario].alert === 'Red').length}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Click any pixel coordinate or station pin above to inspect radar reflectivity (dBZ), rain accumulation rates, hydrometeor classification, and cloud top temperatures.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
