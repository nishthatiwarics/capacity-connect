import React, { useState } from 'react';
import {
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  Sun,
  Wind,
  Droplets,
  Eye,
  Compass,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  Search,
  CheckCircle2,
  Waves,
  MapPin,
  RefreshCw,
  Radio,
  Thermometer,
  ShieldAlert,
  ArrowUpRight,
  Info,
  Zap,
  Layers,
  Sparkles,
  Award,
  Navigation,
  Clock,
  Play,
  Share2,
  Newspaper,
  Activity,
  SlidersHorizontal,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { sound } from '../utils/audio';
import { WeatherForecastingTraineeSuite } from './WeatherForecastingTraineeSuite';
import { IndiaRadarPixelCanvas } from './IndiaRadarPixelCanvas';
import weatherRadarSatelliteImg from '../assets/images/weather_radar_satellite_1789898457040.jpg';
import weatherForecastNewsImg from '../assets/images/weather_forecast_news_1789898472333.jpg';

export interface WeatherBulletinDashboardProps {
  onOpenStation?: (stationId: string) => void;
  isCompact?: boolean;
  onAwardXP?: (amount: number, reason: string) => void;
  onOpenRadarSim?: () => void;
}

export interface WeatherNewsDispatch {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  category: 'Severe Alert' | 'Satellite Imagery' | 'Radar Telemetry' | 'Marine Warning';
  badgeColor: string;
  summary: string;
  keyMetric: string;
  station: string;
  readinessScore?: string;
}

export const WEATHER_NEWS_DISPATCHES: WeatherNewsDispatch[] = [
  {
    id: 'news-1',
    title: 'Monsoon Low Pressure Over Bay of Bengal: Active Surge & Extreme Rain Watch',
    source: 'National Weather Forecasting Centre (NWFC)',
    timestamp: '14 Mins Ago',
    category: 'Severe Alert',
    badgeColor: 'rose',
    summary: 'High-resolution Doppler radar network captures intense convective bands moving westward with reflectivity values exceeding 56 dBZ. Widespread heavy precipitation active over Konkan, Odisha and Gangetic Bengal.',
    keyMetric: 'Rainfall: 115 - 204 mm (Extremely Heavy)',
    station: 'RMC Kolkata & Bhubaneswar DWR',
    readinessScore: '99.4% Dual-Pol Uptime'
  },
  {
    id: 'news-2',
    title: 'INSAT-3DR Rapid Scan Satellite Telemetry: Cloud-Top Temperature Dips to -78°C',
    source: 'Satellite Meteorology Division, New Delhi',
    timestamp: '28 Mins Ago',
    category: 'Satellite Imagery',
    badgeColor: 'sky',
    summary: 'Multispectral pixel sampling in 10.8 µm TIR-1 channel pinpoints active overshooting cloud tops penetrating the tropopause over Central India. Rapid scan mode provides 15-min cadence update.',
    keyMetric: 'Cloud-Top: 16.4 km ASL (-78°C)',
    station: 'Geostationary 74°E Sub-satellite Point',
    readinessScore: 'Rapid Scan 15-min Active'
  },
  {
    id: 'news-3',
    title: 'Dual-Polarization Radar Reflectivity Pixel Analysis Confirms Deep Hail Core',
    source: 'DWR Doppler Radar Network Operations',
    timestamp: '42 Mins Ago',
    category: 'Radar Telemetry',
    badgeColor: 'amber',
    summary: 'Differential Reflectivity (ZDR) near 0 dB paired with Horizontal Reflectivity > 60 dBZ indicates dense graupel and hail aloft within severe squall line across Chota Nagpur plateau.',
    keyMetric: 'Reflectivity: 62.4 dBZ Max(Z)',
    station: 'DWR Ranchi & DWR Patna',
    readinessScore: 'Dual-Pol Hydrometeor Classified'
  },
  {
    id: 'news-4',
    title: 'Arabian Sea High Seas Marine Weather Bulletin: Squally Winds Up to 65 kmph',
    source: 'Sagar Vani Coastal Information System',
    timestamp: '1 Hour Ago',
    category: 'Marine Warning',
    badgeColor: 'teal',
    summary: 'Rough to very rough sea conditions observed off Gujarat and North Maharashtra coasts; automated ocean buoys record 3.8m significant wave height with southwesterly gale winds.',
    keyMetric: 'Wave Height: 3.8m | Wind: 35 Knots',
    station: 'INCOIS / IMD Marine Wing',
    readinessScore: 'Coastal Warning Level 3'
  }
];

export const RADAR_PIXEL_HOTSPOTS = [
  {
    id: 'pt-1',
    name: 'Bay of Bengal Deep Depression',
    lat: '18.4°N',
    lon: '88.2°E',
    xPercent: 72,
    yPercent: 48,
    dbz: 58.5,
    condition: 'Heavy Tropical Rain Band',
    rainRate: '42 mm/hr',
    echoTop: '15.8 km',
    alert: 'Red Alert',
    color: 'bg-rose-500'
  },
  {
    id: 'pt-2',
    name: 'Gangetic Plains Convective Cluster',
    lat: '23.6°N',
    lon: '86.4°E',
    xPercent: 62,
    yPercent: 32,
    dbz: 62.1,
    condition: 'Severe Thunderstorm & Hail Core',
    rainRate: '68 mm/hr',
    echoTop: '16.5 km',
    alert: 'Orange Alert',
    color: 'bg-amber-500'
  },
  {
    id: 'pt-3',
    name: 'Konkan Coast Monsoon Inflow',
    lat: '19.1°N',
    lon: '72.8°E',
    xPercent: 35,
    yPercent: 55,
    dbz: 51.4,
    condition: 'Continuous Monsoon Downpour',
    rainRate: '34 mm/hr',
    echoTop: '13.2 km',
    alert: 'Orange Alert',
    color: 'bg-sky-500'
  },
  {
    id: 'pt-4',
    name: 'Assam & Meghalaya Orographic Mass',
    lat: '25.8°N',
    lon: '92.2°E',
    xPercent: 86,
    yPercent: 28,
    dbz: 56.8,
    condition: 'Intense Orographic Uplift',
    rainRate: '55 mm/hr',
    echoTop: '14.6 km',
    alert: 'Red Alert',
    color: 'bg-rose-600'
  },
  {
    id: 'pt-5',
    name: 'Northwest Plains Thermal Heat Low',
    lat: '28.6°N',
    lon: '77.2°E',
    xPercent: 46,
    yPercent: 24,
    dbz: 28.0,
    condition: 'Partly Cloudy, Thermal Plumes',
    rainRate: '0 mm/hr',
    echoTop: '4.2 km',
    alert: 'Green Alert',
    color: 'bg-emerald-500'
  }
];

interface CityForecast {
  id: string;
  city: string;
  state: string;
  zone: 'North' | 'Central' | 'South' | 'East' | 'West' | 'Northeast';
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: 'sun' | 'cloud-sun' | 'rain' | 'lightning';
  rainfallProb: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  aqi: number;
  aqiStatus: 'Good' | 'Moderate' | 'Poor' | 'Severe';
  alertLevel: 'Green' | 'Yellow' | 'Orange' | 'Red';
  alertDesc: string;
}

const MET_CITIES: CityForecast[] = [
  {
    id: 'delhi',
    city: 'New Delhi',
    state: 'National Capital Region',
    zone: 'North',
    tempMax: 34,
    tempMin: 22,
    condition: 'Partly Cloudy with haze',
    icon: 'cloud-sun',
    rainfallProb: 20,
    humidity: 58,
    windSpeed: 14,
    windDirection: 'NW',
    aqi: 142,
    aqiStatus: 'Moderate',
    alertLevel: 'Green',
    alertDesc: 'No severe weather warning. Normal meteorological conditions.'
  },
  {
    id: 'mumbai',
    city: 'Mumbai (Colaba / Santacruz)',
    state: 'Maharashtra',
    zone: 'West',
    tempMax: 31,
    tempMin: 26,
    condition: 'Heavy Coastal Showers & Squall',
    icon: 'rain',
    rainfallProb: 85,
    humidity: 88,
    windSpeed: 38,
    windDirection: 'WSW',
    aqi: 65,
    aqiStatus: 'Good',
    alertLevel: 'Orange',
    alertDesc: 'Heavy to very heavy rainfall warning along Konkan coast; sea conditions rough.'
  },
  {
    id: 'chennai',
    city: 'Chennai (Meenambakkam)',
    state: 'Tamil Nadu',
    zone: 'South',
    tempMax: 33,
    tempMin: 27,
    condition: 'Isolated Thunderstorms & Humid',
    icon: 'lightning',
    rainfallProb: 60,
    humidity: 82,
    windSpeed: 22,
    windDirection: 'SE',
    aqi: 74,
    aqiStatus: 'Good',
    alertLevel: 'Yellow',
    alertDesc: 'Thunderstorm accompanied with gusty winds (30-40 kmph) likely.'
  },
  {
    id: 'kolkata',
    city: 'Kolkata (Alipore)',
    state: 'West Bengal',
    zone: 'East',
    tempMax: 32,
    tempMin: 25,
    condition: 'Passing Monsoon Showers',
    icon: 'rain',
    rainfallProb: 75,
    humidity: 84,
    windSpeed: 26,
    windDirection: 'S',
    aqi: 88,
    aqiStatus: 'Good',
    alertLevel: 'Yellow',
    alertDesc: 'Moderate to heavy rain likely over coastal Gangetic West Bengal.'
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru (HAL / KIAL)',
    state: 'Karnataka',
    zone: 'South',
    tempMax: 28,
    tempMin: 20,
    condition: 'Pleasant Breeze with Overcast Sky',
    icon: 'cloud-sun',
    rainfallProb: 40,
    humidity: 68,
    windSpeed: 18,
    windDirection: 'W',
    aqi: 48,
    aqiStatus: 'Good',
    alertLevel: 'Green',
    alertDesc: 'Light to moderate scattered rainfall during late evening hours.'
  },
  {
    id: 'guwahati',
    city: 'Guwahati (Borjhar)',
    state: 'Assam',
    zone: 'Northeast',
    tempMax: 30,
    tempMin: 24,
    condition: 'Persistent Heavy Rain & Fog',
    icon: 'rain',
    rainfallProb: 90,
    humidity: 92,
    windSpeed: 20,
    windDirection: 'ENE',
    aqi: 42,
    aqiStatus: 'Good',
    alertLevel: 'Orange',
    alertDesc: 'Heavy rainfall in Brahmaputra valley with localized flash-flood potential.'
  },
  {
    id: 'bhubaneswar',
    city: 'Bhubaneswar',
    state: 'Odisha',
    zone: 'East',
    tempMax: 33,
    tempMin: 26,
    condition: 'Scattered Thundershowers',
    icon: 'lightning',
    rainfallProb: 70,
    humidity: 86,
    windSpeed: 30,
    windDirection: 'SSE',
    aqi: 72,
    aqiStatus: 'Good',
    alertLevel: 'Yellow',
    alertDesc: 'Lightning risk during afternoon; fishermen warned not to venture into deep sea.'
  },
  {
    id: 'shimla',
    city: 'Shimla (Western Himalayas)',
    state: 'Himachal Pradesh',
    zone: 'North',
    tempMax: 19,
    tempMin: 12,
    condition: 'Chilly Morning Mist & Fair Sky',
    icon: 'cloud-sun',
    rainfallProb: 25,
    humidity: 62,
    windSpeed: 12,
    windDirection: 'NE',
    aqi: 28,
    aqiStatus: 'Good',
    alertLevel: 'Green',
    alertDesc: 'Normal mountain weather with clear visibilities along ridgelines.'
  }
];

interface NowcastWarningItem {
  id: string;
  station: string;
  district: string;
  state: string;
  issuedTime: string;
  validUntil: string;
  minutesRemaining: number;
  level: 'Yellow' | 'Orange' | 'Red';
  phenomenon: string;
  windSpeedKmph: string;
  action: string;
}

const LIVE_NOWCAST_WARNINGS: NowcastWarningItem[] = [
  {
    id: 'nc-1',
    station: 'Palam / Safdarjung',
    district: 'New Delhi',
    state: 'Delhi NCR',
    issuedTime: '14:30 IST',
    validUntil: '17:30 IST',
    minutesRemaining: 112,
    level: 'Orange',
    phenomenon: 'Moderate to Severe Thunderstorm with Squall',
    windSpeedKmph: '50-65 kmph',
    action: 'Avoid staying under weak structures or trees. Secure loose objects and delay outdoor activities.'
  },
  {
    id: 'nc-2',
    station: 'Santacruz / Colaba',
    district: 'Mumbai Suburban',
    state: 'Maharashtra',
    issuedTime: '15:00 IST',
    validUntil: '18:00 IST',
    minutesRemaining: 142,
    level: 'Orange',
    phenomenon: 'Intense spells of rain with gusty winds',
    windSpeedKmph: '45-60 kmph',
    action: 'Waterlogging expected in low-lying coastal areas. Drive cautiously and follow traffic advisories.'
  },
  {
    id: 'nc-3',
    station: 'Alipore / Dum Dum',
    district: 'Kolkata',
    state: 'West Bengal',
    issuedTime: '14:00 IST',
    validUntil: '17:00 IST',
    minutesRemaining: 82,
    level: 'Red',
    phenomenon: 'Severe Kalbaishakhi / Hailstorm with lightning',
    windSpeedKmph: '70-85 kmph',
    action: 'IMMEDIATE ACTION: Take shelter indoors. Keep away from electrical poles, water bodies, and metal tin sheds.'
  },
  {
    id: 'nc-4',
    station: 'Meenambakkam',
    district: 'Chennai',
    state: 'Tamil Nadu',
    issuedTime: '13:45 IST',
    validUntil: '16:45 IST',
    minutesRemaining: 67,
    level: 'Yellow',
    phenomenon: 'Light to moderate thunderstorm with lightning',
    windSpeedKmph: '35-45 kmph',
    action: 'Be updated. Avoid taking shelter under isolated trees in open grounds.'
  },
  {
    id: 'nc-5',
    station: 'Bhubaneswar Airport',
    district: 'Khordha',
    state: 'Odisha',
    issuedTime: '15:15 IST',
    validUntil: '18:15 IST',
    minutesRemaining: 157,
    level: 'Orange',
    phenomenon: 'Intense lightning strikes with localized downpour',
    windSpeedKmph: '40-55 kmph',
    action: 'Unplug sensitive electronics. Farmers working in fields advised to seek safe masonry buildings.'
  }
];

export const WeatherBulletinDashboard: React.FC<WeatherBulletinDashboardProps> = ({
  onOpenStation,
  isCompact = false,
  onAwardXP,
  onOpenRadarSim
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // NAVIGATION TABS matching Government of India Ecosystem + Trainee Tools
  const [selectedBulletinTab, setSelectedBulletinTab] = useState<
    'news-pixels' | 'synoptic' | 'nowcast' | 'damini' | 'meghdoot' | 'satellite' | 'cyclone' | 'cities' | 'marine' | 'trainee-lab'
  >('news-pixels');
  
  const [isCopied, setIsCopied] = useState(false);
  const [selectedSatelliteChannel, setSelectedSatelliteChannel] = useState<'tir1' | 'vis' | 'wv' | 'rgb'>('tir1');
  const [nowcastSearch, setNowcastSearch] = useState('');

  // AESTHETIC GLASS BLUR & WEATHER PIXEL STATES
  const [activePixelFilter, setActivePixelFilter] = useState<'radar-dbz' | 'satellite-ir' | 'nowcast-grid' | 'lightning-strikes'>('radar-dbz');
  const [isGlassBlurActive, setIsGlassBlurActive] = useState<boolean>(true);
  const [showPixelGrid, setShowPixelGrid] = useState<boolean>(true);
  const [selectedPixelPoint, setSelectedPixelPoint] = useState<typeof RADAR_PIXEL_HOTSPOTS[0] | null>(RADAR_PIXEL_HOTSPOTS[0]);

  // Filtered Cities
  const filteredCities = MET_CITIES.filter((c) => {
    const matchesZone = selectedZone === 'All' || c.zone === selectedZone;
    const matchesSearch = 
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.condition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesSearch;
  });

  // Filtered Nowcasts
  const filteredNowcasts = LIVE_NOWCAST_WARNINGS.filter((n) => 
    n.district.toLowerCase().includes(nowcastSearch.toLowerCase()) ||
    n.station.toLowerCase().includes(nowcastSearch.toLowerCase()) ||
    n.state.toLowerCase().includes(nowcastSearch.toLowerCase()) ||
    n.phenomenon.toLowerCase().includes(nowcastSearch.toLowerCase())
  );

  const handlePrint = () => {
    sound.playBlip(700);
    window.print();
  };

  const handleCopySummary = () => {
    sound.playBlip(600);
    const text = `IMD ALL-INDIA OFFICIAL WEATHER BULLETIN\nIssued: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}\nSynoptic Summary: Low pressure area over West-Central Bay of Bengal. Orange Alert active for Konkan, Assam & Gangetic West Bengal.\nDetails: Capacity Connect Meteorological Portal (Mausam / NWFC).`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const renderWeatherIcon = (type: string, className: string = 'w-6 h-6') => {
    switch (type) {
      case 'sun':
        return <Sun className={`${className} text-amber-500`} />;
      case 'cloud-sun':
        return <CloudSun className={`${className} text-sky-600`} />;
      case 'rain':
        return <CloudRain className={`${className} text-blue-600`} />;
      case 'lightning':
        return <CloudLightning className={`${className} text-indigo-600`} />;
      default:
        return <Cloud className={`${className} text-slate-500`} />;
    }
  };

  const getAlertBadge = (level: 'Green' | 'Yellow' | 'Orange' | 'Red') => {
    switch (level) {
      case 'Red':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          label: 'RED ALERT (Take Action)',
          indicator: 'bg-rose-600'
        };
      case 'Orange':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          label: 'ORANGE ALERT (Be Prepared)',
          indicator: 'bg-amber-500'
        };
      case 'Yellow':
        return {
          bg: 'bg-yellow-50 text-yellow-900 border-yellow-300',
          label: 'YELLOW ALERT (Be Updated)',
          indicator: 'bg-yellow-500'
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          label: 'GREEN (No Warning)',
          indicator: 'bg-emerald-500'
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-800">
      
      {/* OFFICIAL HEADER BANNER: MAUSAM BHAWAN / NWFC */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-sky-100 shadow-sm relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-50 rounded-full opacity-70 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-start gap-4">
            {/* Emblem Mark */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 via-sky-50 to-blue-100 border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs">
              <svg viewBox="0 0 100 100" className="w-9 h-9 fill-slate-800" aria-label="Emblem of India">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0284c7" strokeWidth="3.5" />
                <circle cx="50" cy="50" r="14" fill="none" stroke="#d97706" strokeWidth="3" />
                <path d="M50 12 V88 M12 50 H88 M23 23 L77 77 M23 77 L77 23" stroke="#0284c7" strokeWidth="2" />
              </svg>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-sky-100 text-sky-900 border border-sky-300 tracking-wider">
                  GOVERNMENT OF INDIA WEATHER ECOSYSTEM
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  MAUSAM • DAMINI • MEGHDOOT
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  NWFC/ALL-INDIA/2026/09/B-48
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1 flex items-center gap-2">
                <span>National Daily Weather & Trainee Forecasting Operations</span>
              </h1>
              
              <p className="text-xs text-slate-600 max-w-3xl mt-1 leading-relaxed">
                National Weather Forecasting Centre (NWFC) • India Meteorological Department, Ministry of Earth Sciences, Mausam Bhawan, New Delhi. Synchronized with 37 DWRs, INSAT-3DR Rapid Scan, and agricultural agromet networks.
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                sound.playBlip(700);
                setSelectedBulletinTab('trainee-lab');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xs flex items-center gap-2 hover:brightness-105 cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
              <span>Launch Trainee Lab</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Copy official weather summary"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{isCopied ? 'Copied to Clipboard!' : 'Export Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Print official weather bulletin"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600" />
              <span>Print Bulletin</span>
            </button>
          </div>
        </div>

        {/* Live Synoptic Alert Ticker */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs bg-slate-50/70 -mx-5 -mb-5 px-5 sm:px-7 py-3 rounded-b-3xl">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="font-bold text-slate-800">
              Active Synoptic Warning:
            </span>
            <span className="text-slate-600">
              Low-Pressure Area over West-Central Bay of Bengal (MSW: 25-30 knots) with cyclonic circulation extending up to 7.6 km ASL. Orange Alert active for Konkan & Assam.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono font-bold text-slate-500 shrink-0">
            <span>Next Advisory: 17:30 IST</span>
            <span>•</span>
            <span className="text-emerald-700">37/37 DWRs Synchronized</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD NAVIGATION TABS: Government Weather Apps & Forecaster Tools */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-bold overflow-x-auto max-w-full">
          
          {/* Tab 0: Radar and Weather Pixels */}
          <button
            onClick={() => {
              sound.playBlip(750);
              setSelectedBulletinTab('news-pixels');
            }}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedBulletinTab === 'news-pixels'
                ? 'bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-xs font-black ring-2 ring-sky-300'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Radar and Weather Pixels</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-white/20 text-white font-mono font-black backdrop-blur-xs">
              GLASS
            </span>
          </button>

          {/* Tab 1: Synoptic Warning */}
          <button
            onClick={() => {
              sound.playBlip(700);
              setSelectedBulletinTab('synoptic');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedBulletinTab === 'synoptic'
                ? 'bg-white text-sky-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-sky-600" />
            <span>Synoptic & 4-Color Matrix</span>
          </button>

          {/* Tab 2: Mausam 3-Hr Nowcast Warnings */}
          <button
            onClick={() => {
              sound.playBlip(700);
              setSelectedBulletinTab('nowcast');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedBulletinTab === 'nowcast'
                ? 'bg-white text-sky-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Mausam 3-Hr Nowcasts ({LIVE_NOWCAST_WARNINGS.length})</span>
          </button>

          {/* Tab 3: DAMINI Lightning Network */}
          <button
            onClick={() => {
              sound.playBlip(700);
              setSelectedBulletinTab('damini');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedBulletinTab === 'damini'
                ? 'bg-white text-sky-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5 text-indigo-600" />
            <span>DAMINI Lightning Tracker</span>
          </button>

          {/* Tab 4: Meghdoot Agromet Advisory */}
          <button
            onClick={() => {
              sound.playBlip(700);
              setSelectedBulletinTab('meghdoot');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedBulletinTab === 'meghdoot'
                ? 'bg-white text-sky-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-emerald-600" />
            <span>Meghdoot Agromet Advisory</span>
          </button>

          {/* Tab 5: INSAT-3DR & Radar */}
          <button
            onClick={() => {
              sound.playBlip(700);
              setSelectedBulletinTab('satellite');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedBulletinTab === 'satellite'
                ? 'bg-white text-sky-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-600" />
            <span>INSAT-3DR & DWR Radar</span>
          </button>

          {/* Tab 6: Cyclone Tracking */}
          <button
            onClick={() => {
              sound.playBlip(700);
              setSelectedBulletinTab('cyclone');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedBulletinTab === 'cyclone'
                ? 'bg-white text-sky-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-amber-600" />
            <span>RSMC Cyclone Watch</span>
          </button>

          {/* Tab 7: 7-Day City Forecasts */}
          <button
            onClick={() => {
              sound.playBlip(700);
              setSelectedBulletinTab('cities');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedBulletinTab === 'cities'
                ? 'bg-white text-sky-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>7-Day City Forecasts ({MET_CITIES.length})</span>
          </button>

          {/* Tab 8: Maritime Warnings */}
          <button
            onClick={() => {
              sound.playBlip(700);
              setSelectedBulletinTab('marine');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedBulletinTab === 'marine'
                ? 'bg-white text-sky-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Waves className="w-3.5 h-3.5 text-teal-600" />
            <span>Sagar Vani Marine</span>
          </button>

          {/* Tab 9: Trainee Forecaster Lab */}
          <button
            onClick={() => {
              sound.playBlip(700);
              setSelectedBulletinTab('trainee-lab');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
              selectedBulletinTab === 'trainee-lab'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-700 text-white shadow-xs font-black'
                : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 font-bold'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Forecaster Trainee Lab</span>
          </button>

        </div>

        {/* Timestamp */}
        <div className="text-xs text-slate-500 font-mono font-medium">
          Observation Cycle: {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} • 12:00 UTC (17:30 IST)
        </div>
      </div>

      {/* =========================================================================
          TAB 0: WEATHER NEWS & RADAR PIXELS (AESTHETIC GLASS BLUR SUITE)
      ========================================================================= */}
      {selectedBulletinTab === 'news-pixels' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Dynamic Radar and Weather Pixels Engine for India */}
          <div className="space-y-6">
            <IndiaRadarPixelCanvas
              onAwardXP={onAwardXP}
              onOpenStation={onOpenStation}
            />

            {/* Collapsible Secondary Feed: INSAT-3DR Multispectral Imagery & DWR Radar Composite Archive */}
            <div className="p-4 rounded-3xl pryda-glass-card border border-white/60 dark:border-white/10 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/60 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    INSAT-3DR Rapid Scan Satellite & Radar Feed Archive
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playBlip(600);
                      setIsGlassBlurActive(!isGlassBlurActive);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isGlassBlurActive 
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs' 
                        : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Toggle Frosted Glass Blur Effect"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Glass Frost: {isGlassBlurActive ? 'ON' : 'OFF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playBlip(600);
                      setShowPixelGrid(!showPixelGrid);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      showPixelGrid 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                        : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                    title="Toggle 250m Radar Pixel Mesh"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Pixel Mesh: {showPixelGrid ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="relative rounded-2xl overflow-hidden border border-sky-200 dark:border-sky-900 bg-slate-950 h-56 group">
                  <img
                    src={weatherRadarSatelliteImg}
                    alt="Satellite Imagery"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {showPixelGrid && (
                    <div className="absolute inset-0 weather-pixel-overlay pointer-events-none opacity-60" />
                  )}
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl glass-hud text-white text-[11px] flex items-center justify-between">
                    <span className="font-bold">INSAT-3DR TIR-1 Channel (10.8 µm)</span>
                    <span className="font-mono text-sky-300">Cadence: 15 min</span>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-sky-200 dark:border-sky-900 bg-slate-950 h-56 group">
                  <img
                    src={weatherForecastNewsImg}
                    alt="National Weather News Telemetry"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {showPixelGrid && (
                    <div className="absolute inset-0 weather-pixel-overlay pointer-events-none opacity-60" />
                  )}
                  <div className="absolute bottom-2 left-2 right-2 p-2 rounded-xl glass-hud text-white text-[11px] flex items-center justify-between">
                    <span className="font-bold">DWR 3D Hydrometeor Classification</span>
                    <span className="font-mono text-emerald-300">Dual-Pol Mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AESTHETIC FROSTED GLASS WEATHER NEWS DISPATCHES GRID */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-sky-600" />
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Official Meteorological News Dispatches & Severe Bulletins
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Updated Every 15 Minutes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WEATHER_NEWS_DISPATCHES.map((dispatch) => (
                <div
                  key={dispatch.id}
                  className="glass-surface-card rounded-2xl p-5 border border-white/70 hover:border-sky-300 hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => {
                    sound.playBlip(700);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase ${
                        dispatch.badgeColor === 'rose' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        dispatch.badgeColor === 'sky' ? 'bg-sky-100 text-sky-800 border border-sky-200' :
                        dispatch.badgeColor === 'amber' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-teal-100 text-teal-800 border border-teal-200'
                      }`}>
                        {dispatch.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {dispatch.timestamp}
                      </span>
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors shrink-0" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2 group-hover:text-sky-900 transition-colors leading-snug">
                    {dispatch.title}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {dispatch.summary}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200/60">
                      {dispatch.keyMetric}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Source: {dispatch.station}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 1: SYNOPTIC ANALYSIS & 4-TIER COLOUR-CODED WARNINGS
      ========================================================================= */}
      {selectedBulletinTab === 'synoptic' && (
        <div className="space-y-6">
          {/* 4-Color Warning Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-900 tracking-wider">Green Alert</span>
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="text-lg font-black text-emerald-950 mt-1">No Warning</div>
              <p className="text-xs text-emerald-800/90 mt-1">
                Normal meteorological conditions. Northwest plains & interior peninsula experience seasonal weather.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-yellow-50/70 border border-yellow-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-yellow-900 tracking-wider">Yellow Alert</span>
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
              </div>
              <div className="text-lg font-black text-yellow-950 mt-1">Be Updated</div>
              <p className="text-xs text-yellow-800/90 mt-1">
                Scattered heavy showers & gusty thunderstorm winds expected over Coastal Odisha, Bengal, and Tamil Nadu.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-900 tracking-wider">Orange Alert</span>
                <span className="w-3 h-3 rounded-full bg-amber-500" />
              </div>
              <div className="text-lg font-black text-amber-950 mt-1">Be Prepared</div>
              <p className="text-xs text-amber-900/90 mt-1">
                Heavy to very heavy rainfall along Konkan & Goa coast and Assam/Meghalaya. Localized waterlogging possible.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-rose-900 tracking-wider">Red Alert</span>
                <span className="w-3 h-3 rounded-full bg-rose-600" />
              </div>
              <div className="text-lg font-black text-rose-950 mt-1">Take Action</div>
              <p className="text-xs text-rose-800/90 mt-1">
                Extremely heavy rain (&gt;204.4 mm) emergency protocols in standby. Active localized severe Nor'wester in South Bengal.
              </p>
            </div>
          </div>

          {/* Meteorological Analysis Dossier */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <h2 className="text-base font-extrabold text-slate-900">
                    Synoptic Meteorological Discussion & Precipitation Forecast
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Forecaster: Dr. Someshwar Rao</span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                <p>
                  <strong>1. Pressure Patterns:</strong> The monsoon trough at mean sea level passes through Bikaner, Sikar, Orai, Sultanpur, Patna, and thence south-eastwards to the center of the low-pressure area over West-Central Bay of Bengal.
                </p>
                <p>
                  <strong>2. Arabian Sea & Western Ghats:</strong> Strong south-westerly winds with speeds reaching 40-50 kmph gusting to 60 kmph are prevailing along the Maharashtra and Karnataka coasts. Widespread rainfall with isolated very heavy falls is highly probable during the next 48 hours.
                </p>
                <p>
                  <strong>3. Himalayan Foothills & Northeast:</strong> Moisture incursion from the Bay of Bengal continues to sustain convective activity over Sub-Himalayan West Bengal, Sikkim, and Assam. Lightning precautions remain advised.
                </p>
              </div>

              {/* 5-Day Outlook Visual Table */}
              <div className="pt-3 border-t border-slate-100">
                <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-3">
                  5-Day Regional Precipitation Tendency
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                  {[
                    { day: 'Day 1 (Today)', outlook: 'Widespread Rain', icon: 'rain', chance: '85%' },
                    { day: 'Day 2 (Tomorrow)', outlook: 'Heavy Showers', icon: 'rain', chance: '80%' },
                    { day: 'Day 3', outlook: 'Scattered Rain', icon: 'cloud-sun', chance: '55%' },
                    { day: 'Day 4', outlook: 'Isolated Rain', icon: 'cloud-sun', chance: '40%' },
                    { day: 'Day 5', outlook: 'Partly Cloudy', icon: 'sun', chance: '20%' },
                  ].map((d, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-500 block">{d.day}</span>
                      <div className="my-1.5 flex justify-center">
                        {renderWeatherIcon(d.icon, 'w-5 h-5')}
                      </div>
                      <span className="text-xs font-extrabold text-slate-800 block">{d.chance}</span>
                      <span className="text-[10px] text-slate-600 block mt-0.5 truncate">{d.outlook}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Meteorological Indicators */}
            <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-600" />
                  <span>National Key Observations</span>
                </h2>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <Thermometer className="w-4 h-4 text-amber-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Highest Max Temp</span>
                        <span className="text-[11px] text-slate-500">Phalodi, Rajasthan</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-amber-700">41.8 °C</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <Thermometer className="w-4 h-4 text-sky-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Lowest Min Temp</span>
                        <span className="text-[11px] text-slate-500">Dras / Leh Ladakh</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-sky-800">4.2 °C</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <CloudRain className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Max 24-hr Rainfall</span>
                        <span className="text-[11px] text-slate-500">Mawsynram, Meghalaya</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-blue-700">182 mm</span>
                  </div>
                </div>
              </div>

              {/* Agro-Met Farmers Advisory Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
                <span className="font-extrabold text-amber-900 block mb-1">
                  🌾 Agro-Met Advisory Notice
                </span>
                <p className="text-amber-800/90 leading-relaxed text-[11px]">
                  Farmers in coastal Maharashtra and Assam are advised to drain excess water from rice paddies and postpone scheduled pesticide spraying during active squall periods.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MAUSAM 3-HOURLY NOWCAST WARNINGS (GOVERNMENT MAUSAM APP BENCHMARK)
      ========================================================================= */}
      {selectedBulletinTab === 'nowcast' && (
        <div className="space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    Mausam App 3-Hourly Nowcast Network
                  </h2>
                  <p className="text-xs text-slate-500">
                    Localized high-resolution warnings across 800+ Indian stations with validity countdowns
                  </p>
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search station or district..."
                  value={nowcastSearch}
                  onChange={(e) => setNowcastSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-slate-900 w-64"
                />
              </div>
            </div>

            {/* Nowcasts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNowcasts.map((nc) => {
                const alertInfo = getAlertBadge(nc.level);
                return (
                  <div
                    key={nc.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      nc.level === 'Red'
                        ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20'
                        : nc.level === 'Orange'
                        ? 'bg-amber-50/70 border-amber-300'
                        : 'bg-yellow-50/60 border-yellow-300'
                    }`}
                  >
                    <div>
                      {/* Station & Timing */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-extrabold text-sm text-slate-900">{nc.district}</div>
                          <div className="text-[11px] text-slate-600 font-medium">{nc.station} • {nc.state}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase border ${alertInfo.bg}`}>
                          {nc.level} ALERT
                        </span>
                      </div>

                      {/* Remaining validity badge */}
                      <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono font-bold text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Valid until {nc.validUntil} ({nc.minutesRemaining} mins left)</span>
                      </div>

                      {/* Phenomenon */}
                      <div className="mt-3 p-2.5 rounded-xl bg-white/80 border border-slate-200/80 text-xs">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <CloudLightning className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{nc.phenomenon}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                          Wind Gusts: <span className="font-bold text-slate-800">{nc.windSpeedKmph}</span>
                        </div>
                      </div>

                      {/* Action Suggested */}
                      <p className="text-[11px] text-slate-700 leading-relaxed mt-2.5 italic">
                        "{nc.action}"
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Issued: {nc.issuedTime}</span>
                      <span className="font-bold text-sky-700">DWR Echo Verified</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: DAMINI LIGHTNING NETWORK (IITM PUNE / MOES)
      ========================================================================= */}
      {selectedBulletinTab === 'damini' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
                  <CloudLightning className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
                      DAMINI EARLY WARNING SYSTEM
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">IITM Pune / MoES</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    Real-Time Cloud-to-Ground Lightning Flash Density & Proximity Alert
                  </h2>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-black text-indigo-600 font-mono">3,418</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Strikes in past 60 mins</div>
              </div>
            </div>

            {/* DAMINI Radar Radar Proximity Rings & Safety Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: 20km / 40km Proximity Warning Radar Ring Diagram (6 cols) */}
              <div className="lg:col-span-6 bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  DAMINI 20km / 40km Proximity Radar Ring
                </div>

                <div className="relative w-64 h-64 flex items-center justify-center my-2">
                  {/* Outer 40km Ring */}
                  <div className="w-64 h-64 rounded-full border border-dashed border-amber-500/50 flex items-center justify-center">
                    <span className="absolute top-2 text-[9px] font-mono text-amber-400">40 km Caution Radius</span>
                    
                    {/* Inner 20km Ring */}
                    <div className="w-40 h-40 rounded-full border-2 border-rose-500/80 bg-rose-500/10 flex items-center justify-center animate-pulse">
                      <span className="absolute top-14 text-[9px] font-mono text-rose-400 font-bold">20 km High Danger Zone</span>
                      
                      {/* Station Center */}
                      <div className="w-6 h-6 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-lg">
                        <MapPin className="w-4 h-4 text-sky-600" />
                      </div>
                    </div>
                  </div>

                  {/* Simulated Lightning Flashes */}
                  <div className="absolute top-16 right-16 flex items-center gap-1 text-amber-300 font-mono text-[10px] animate-bounce">
                    <Zap className="w-3.5 h-3.5 fill-amber-300" />
                    <span>Flash (14 km)</span>
                  </div>
                  <div className="absolute bottom-20 left-16 flex items-center gap-1 text-rose-300 font-mono text-[10px] animate-bounce">
                    <Zap className="w-3.5 h-3.5 fill-rose-400" />
                    <span>Flash (8 km)</span>
                  </div>
                  <div className="absolute top-24 left-10 flex items-center gap-1 text-amber-300 font-mono text-[10px]">
                    <Zap className="w-3 h-3 fill-amber-300" />
                    <span>Flash (32 km)</span>
                  </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-2 text-center text-xs mt-3 pt-3 border-t border-slate-800">
                  <div className="p-2 rounded bg-rose-950/40 border border-rose-700/50 text-rose-300 font-mono text-[11px]">
                    ⚠️ <span className="font-bold">20 km Alert:</span> Take immediate indoor shelter
                  </div>
                  <div className="p-2 rounded bg-amber-950/40 border border-amber-700/50 text-amber-300 font-mono text-[11px]">
                    ⚡ <span className="font-bold">40 km Alert:</span> Monitor storm approach
                  </div>
                </div>
              </div>

              {/* Right: NDMA & DAMINI Official Safety Guidelines (6 cols) */}
              <div className="lg:col-span-6 space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="font-extrabold text-amber-950 text-sm">The 30-30 Safety Rule (IMD & NDMA Standard)</span>
                  </div>
                  <p className="text-amber-900 text-xs leading-relaxed">
                    <strong>Rule 1:</strong> If the time between seeing lightning and hearing thunder is less than <strong>30 seconds</strong>, you are already in the strike danger zone. Take shelter immediately.
                  </p>
                  <p className="text-amber-900 text-xs leading-relaxed">
                    <strong>Rule 2:</strong> Wait at least <strong>30 minutes</strong> after the last thunderclap before resuming outdoor activities or farming work.
                  </p>
                </div>

                {/* Hotspot Districts Table */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">
                    Current High Strike Density Hotspots:
                  </div>
                  <div className="space-y-2">
                    {[
                      { region: 'Mayurbhanj & Keonjhar', state: 'Odisha', count: '840 strikes/hr', risk: 'Severe' },
                      { region: 'Ratnagiri & Sindhudurg', state: 'Maharashtra', count: '620 strikes/hr', risk: 'High' },
                      { region: 'Bankura & Purulia', state: 'West Bengal', count: '480 strikes/hr', risk: 'High' },
                      { region: 'Srikakulam & Vizianagaram', state: 'Andhra Pradesh', count: '390 strikes/hr', risk: 'Moderate' },
                    ].map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{h.region}</span>
                          <span className="text-[11px] text-slate-500 ml-1.5">({h.state})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-indigo-700 font-bold text-[11px]">{h.count}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            {h.risk}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: MEGHDOOT AGROMET ADVISORY SERVICES (IMD / ICAR / IITM)
      ========================================================================= */}
      {selectedBulletinTab === 'meghdoot' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      MEGHDOOT AGROMET ADVISORY (AAS)
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">Ministry of Earth Sciences & ICAR</span>
                  </div>
                  <h2 className="text-base font-black text-slate-900 mt-0.5">
                    Block-Level Weather-Based Farm Advisories for Crops & Livestock
                  </h2>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">Validity: Next 5 Days</span>
            </div>

            {/* Agromet Bulletins Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  zone: 'Indo-Gangetic Plains (Punjab, Haryana & Western UP)',
                  crop: 'Wheat & Mustard',
                  stage: 'Vegetative Growth / Sowing Preparation',
                  advisory: 'Since rainfall probability is below 20% with clear sunny intervals, light irrigation can be applied to late-sown wheat. Postpone nitrogen top-dressing until moisture settles.',
                  icon: '🌾',
                  alert: 'Favorable Weather'
                },
                {
                  zone: 'Konkan & Goa (Maharashtra Coastal Belt)',
                  crop: 'Kharif Rice & Coconut',
                  stage: 'Grain Filling & Maturity',
                  advisory: 'Heavy downpours and squally winds exceeding 55 kmph expected. Farmers should drain surplus water from paddy fields immediately and secure harvested bundles on raised platforms.',
                  icon: '🥥',
                  alert: 'Squall Caution'
                },
                {
                  zone: 'Deccan Plateau (Vidarbha & Marathwada)',
                  crop: 'Cotton & Soybean',
                  stage: 'Pod Development & Boll Formation',
                  advisory: 'High relative humidity (>80%) creates favorable conditions for sucking pests and fungal rot. Spray recommended bio-pesticides during dry morning windows only.',
                  icon: '🌱',
                  alert: 'Pest Advisory'
                },
                {
                  zone: 'Cauvery Delta (Tamil Nadu & Puducherry)',
                  crop: 'Thaladi Rice & Black Gram',
                  stage: 'Transplanting & Nursery Care',
                  advisory: 'Scattered thunderstorm showers likely. Harvest rainwater in farm ponds and reinforce bund heights to prevent localized soil erosion.',
                  icon: '💧',
                  alert: 'Water Harvesting'
                }
              ].map((card, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{card.icon}</span>
                        <span className="font-extrabold text-sm text-slate-900">{card.zone}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {card.alert}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 mt-2">
                      <span><strong>Crop:</strong> {card.crop}</span>
                      <span>•</span>
                      <span><strong>Stage:</strong> {card.stage}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed mt-2 p-3 bg-white rounded-xl border border-slate-200/80">
                      {card.advisory}
                    </p>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 pt-1 flex justify-between items-center">
                    <span>Issued by District Agromet Unit (DAMU)</span>
                    <span className="text-emerald-700 font-bold">AAS Bulletin #24</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: INSAT-3DR SATELLITE & DOPPLER WEATHER RADAR (DWR)
      ========================================================================= */}
      {selectedBulletinTab === 'satellite' && (
        <div className="space-y-6">
          <div className="glass-surface-card rounded-3xl p-6 border border-sky-100/80 shadow-md space-y-5 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
                  <Radio className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    INSAT-3DR Geostationary Satellite & 37 DWR Radar Products
                  </h2>
                  <p className="text-xs text-slate-500">
                    Live multispectral imagery (Rapid Scan: 15-min) and Doppler reflectivity scans
                  </p>
                </div>
              </div>

              {/* Channel Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                {[
                  { id: 'tir1', label: 'TIR-1 (Infrared 10.8 µm)' },
                  { id: 'vis', label: 'Visible Channel' },
                  { id: 'wv', label: 'Water Vapor (6.9 µm)' },
                  { id: 'rgb', label: 'RGB Day Convection' }
                ].map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      sound.playBlip(700);
                      setSelectedSatelliteChannel(ch.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedSatelliteChannel === ch.id
                        ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {ch.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Satellite Imagery Display with Aesthetic Glass Blur */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Satellite Canvas Box (8 cols) */}
              <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-lg">
                <div className="w-full flex items-center justify-between text-[11px] font-mono text-slate-300 p-3 z-10 glass-hud">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>INSAT-3DR RAPID SCAN: CHANNEL {selectedSatelliteChannel.toUpperCase()}</span>
                  </div>
                  <span>LAT 05°N - 38°N | LON 60°E - 100°E</span>
                </div>

                {/* Satellite Imagery with Frosted Glass Overlay */}
                <div className="relative w-full h-72 sm:h-80 overflow-hidden group">
                  <img
                    src={weatherRadarSatelliteImg}
                    alt="INSAT-3DR Multispectral Imagery"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center filter saturate-110"
                  />
                  
                  <div className="absolute inset-0 weather-pixel-overlay pointer-events-none opacity-60" />

                  {/* Frosted Glass Overlay Tag */}
                  <div className="absolute bottom-3 left-3 right-3 glass-hud rounded-xl p-2.5 text-white flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span className="font-bold">Multispectral Pixel Core</span>
                      <span className="text-slate-300">• -78°C Overshooting Top detected</span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-300 bg-white/10 px-2 py-0.5 rounded">
                      250m Resolution
                    </span>
                  </div>
                </div>

                {/* Satellite Cloud-Top Temperature Scale */}
                <div className="w-full p-3 glass-hud flex items-center justify-between text-[9px] font-mono text-slate-300 z-10">
                  <span>-80°C (Deep Overshooting Anvils)</span>
                  <div className="h-2.5 w-48 rounded bg-gradient-to-r from-purple-700 via-rose-500 via-amber-400 to-sky-400 border border-white/20" />
                  <span>+30°C (Warm Surface)</span>
                </div>
              </div>

              {/* Right: Radar Station Telemetry (4 cols) */}
              <div className="lg:col-span-4 space-y-3 text-xs">
                <div className="glass-surface-card p-4 rounded-2xl border border-sky-100">
                  <div className="font-bold text-slate-800 text-xs">Doppler Weather Radar (DWR) Summary</div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    37 Operational Radars actively scanning Max(Z) Reflectivity dBZ, Doppler Radial Velocity, and Hydrometeor Classification.
                  </p>
                </div>

                <div className="glass-surface-card p-4 rounded-2xl border border-sky-100 space-y-2">
                  <div className="font-bold text-slate-800 text-xs">Top Reflectivity Radar Returns:</div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">DWR Kolkata:</span>
                      <span className="font-mono font-bold text-rose-600">62 dBZ (Hail Risk)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">DWR Mumbai:</span>
                      <span className="font-mono font-bold text-amber-600">54 dBZ (Heavy Rain)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">DWR Delhi Palam:</span>
                      <span className="font-mono font-bold text-sky-700">48 dBZ (Squall Core)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">DWR Machilipatnam:</span>
                      <span className="font-mono font-bold text-indigo-700">44 dBZ (Coastal Band)</span>
                    </div>
                  </div>
                </div>

                {onOpenRadarSim && (
                  <button
                    onClick={onOpenRadarSim}
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Open Interactive Radar Simulator</span>
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: RSMC CYCLONE EARLY WARNING SYSTEM (NEW DELHI STANDARD)
      ========================================================================= */}
      {selectedBulletinTab === 'cyclone' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      RSMC NEW DELHI CYCLONE BULLETIN
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">WMO Tropical Cyclone Centre</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    Tropical Depression BOB-04: Trajectory Track & 4-Stage Warning Protocol
                  </h2>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-amber-100 text-amber-900 border border-amber-300">
                CURRENT STAGE: DEEP DEPRESSION
              </span>
            </div>

            {/* 4-Stage Standard IMD Protocol Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { stage: 'Stage 1: Pre-Cyclone Watch', time: '72 Hours Prior', status: 'Completed', color: 'bg-emerald-50 border-emerald-300 text-emerald-900' },
                { stage: 'Stage 2: Cyclone Alert', time: '48 Hours Prior', status: 'Completed (Yellow)', color: 'bg-yellow-50 border-yellow-300 text-yellow-900' },
                { stage: 'Stage 3: Cyclone Warning', time: '24 Hours Prior', status: 'ACTIVE NOW (Orange)', color: 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-500/20' },
                { stage: 'Stage 4: Post-Landfall Outlook', time: '12 Hours Prior', status: 'Standby (Red)', color: 'bg-slate-50 border-slate-200 text-slate-600' }
              ].map((s, i) => (
                <div key={i} className={`p-3 rounded-2xl border ${s.color} text-xs`}>
                  <div className="font-extrabold">{s.stage}</div>
                  <div className="text-[10px] font-mono mt-0.5">{s.time}</div>
                  <div className="text-[11px] font-bold mt-1">{s.status}</div>
                </div>
              ))}
            </div>

            {/* Cyclone Parameters & Track Data */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Center Location</div>
                <div className="text-base font-black text-slate-900 mt-0.5">17.2°N, 86.5°E</div>
                <div className="text-[10px] text-slate-500">West-Central Bay of Bengal</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Central Pressure</div>
                <div className="text-base font-black text-rose-600 mt-0.5">994 hPa</div>
                <div className="text-[10px] text-slate-500">Pressure deficit: 12 hPa</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Max Sustained Wind (MSW)</div>
                <div className="text-base font-black text-amber-700 mt-0.5">35 Knots (65 kmph)</div>
                <div className="text-[10px] text-slate-500">Gusts up to 45 knots (85 kmph)</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Forecast Landfall</div>
                <div className="text-base font-black text-sky-700 mt-0.5">Puri - Sagar Island</div>
                <div className="text-[10px] text-slate-500">Expected within 36 hours</div>
              </div>
            </div>

            {/* Fishermen & Port Signals */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2">
              <div className="font-extrabold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Fishermen Warning & Port Warning Signal Alert:</span>
              </div>
              <p className="leading-relaxed">
                Local Cautionary Signal No. 3 (LC-3) kept hoisted at Paradip, Gopalpur, Dhamra, and Haldia ports. Fishermen are strictly warned not to venture into deep sea areas of West-Central and Northwest Bay of Bengal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: 7-DAY CITY & DISTRICT FORECASTS
      ========================================================================= */}
      {selectedBulletinTab === 'cities' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search station, city, or meteorological condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 text-slate-900"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-bold">
              {['All', 'North', 'West', 'South', 'East', 'Northeast'].map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                    selectedZone === z
                      ? 'bg-sky-600 text-white font-extrabold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {/* City Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCities.map((item) => {
              const alert = getAlertBadge(item.alertLevel);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-sky-300 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                          {item.city}
                        </h3>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.state} • {item.zone} Zone
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${alert.bg} shrink-0`}>
                        {item.alertLevel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 py-2 border-y border-slate-100">
                      <div className="flex items-center gap-2.5">
                        {renderWeatherIcon(item.icon, 'w-8 h-8')}
                        <div>
                          <div className="text-2xl font-black text-slate-900 tracking-tight">
                            {item.tempMax}°<span className="text-sm font-semibold text-slate-500">/{item.tempMin}°C</span>
                          </div>
                          <span className="text-[11px] text-slate-600 font-medium block -mt-0.5">
                            {item.condition}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Droplets className="w-3.5 h-3.5 text-sky-500" />
                        <span>Rain Prob: <strong>{item.rainfallProb}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Wind className="w-3.5 h-3.5 text-teal-500" />
                        <span>Wind: <strong>{item.windSpeed} km/h</strong> {item.windDirection}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                    <p className="line-clamp-2">{item.alertDesc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 8: MARITIME & FISHERMEN WARNINGS (SAGAR VANI / INCOIS)
      ========================================================================= */}
      {selectedBulletinTab === 'marine' && (
        <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Sagar Vani / INCOIS Coastal & High Seas Meteorological Advisory
                </h2>
                <p className="text-xs text-slate-500">
                  Valid for Indian EEZ waters, mechanized fishing trawlers, and major ports
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">Next Update: 06:00 UTC</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-300">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-amber-900 text-sm">
                  1. Arabian Sea (Konkan, Goa & Gujarat Coasts)
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-950 font-mono text-[10px] font-bold">
                  SQUALLY WINDS
                </span>
              </div>
              <p className="text-xs text-amber-900/90 leading-relaxed mb-3">
                Squally weather with wind speed reaching 45-55 kmph gusting to 65 kmph is very likely to prevail over East-central & adjoining Northeast Arabian Sea. Sea condition will be rough to very rough.
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200 text-xs font-bold text-amber-950 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>ADVISORY: Fishermen are advised not to venture into these sea areas until further notice.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sky-900 text-sm">
                  2. Bay of Bengal & Andaman Sea
                </span>
                <span className="px-2 py-0.5 rounded bg-sky-200 text-sky-950 font-mono text-[10px] font-bold">
                  MODERATE TO ROUGH
                </span>
              </div>
              <p className="text-xs text-sky-900/90 leading-relaxed mb-3">
                Wind speeds of 40-50 kmph gusting to 60 kmph likely over West-Central & adjoining Northwest Bay of Bengal around the low-pressure area center. Wave heights 2.5 - 3.8 metres.
              </p>
              <div className="p-2.5 rounded-xl bg-white/80 border border-sky-200 text-xs font-bold text-sky-950 flex items-center gap-2">
                <Info className="w-4 h-4 text-sky-600 shrink-0" />
                <span>ADVISORY: Small fishing craft are cautioned against venturing beyond 20 nautical miles.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 9: FORECASTING TRAINEE OPERATIONS LAB (DEDICATED TRAINEE SUITE)
      ========================================================================= */}
      {selectedBulletinTab === 'trainee-lab' && (
        <div className="space-y-4">
          <WeatherForecastingTraineeSuite
            onAwardXP={onAwardXP}
            onOpenRadarSim={onOpenRadarSim}
            isEmbedded={true}
          />
        </div>
      )}

    </div>
  );
};
