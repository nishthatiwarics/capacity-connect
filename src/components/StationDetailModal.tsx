import React, { useState } from 'react';
import { 
  Radio, 
  MapPin, 
  Users, 
  Award, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  Sliders, 
  Download
} from 'lucide-react';
import { Station, AlertLevel } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface StationDetailModalProps {
  station: Station | null;
  onClose: () => void;
  onUpdateStationAlert: (stationId: string, level: AlertLevel) => void;
  onLaunchStationDrill: (station: Station) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  onClose,
  onUpdateStationAlert,
  onLaunchStationDrill,
}) => {
  const { isBright } = useTheme();
  if (!station) return null;

  const handleAlertChange = (level: AlertLevel) => {
    sound.playAlert();
    onUpdateStationAlert(station.id, level);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className={`border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 ${
        isBright ? 'bg-white border-slate-200' : 'bg-[#0b1220] border-cyan-900/60'
      }`}>
        {/* Header */}
        <div className={`flex items-start justify-between pb-3 border-b ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${
                isBright ? 'bg-slate-100 text-black border-slate-300' : 'bg-black text-white border-neutral-700'
              }`}>
                {station.code} • {station.region}
              </span>
              <span className={`text-xs font-mono font-semibold flex items-center gap-1 ${
                isBright ? 'text-emerald-700' : 'text-emerald-400'
              }`}>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                {station.status}
              </span>
            </div>
            <h2 className={`text-lg font-bold mt-1 ${isBright ? 'text-slate-900' : 'text-white'}`}>
              {station.name}
            </h2>
            <p className={`text-xs flex items-center gap-1 mt-0.5 font-mono ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
              <MapPin className="w-3 h-3 text-black dark:text-white" />
              {station.location} ({station.lat.toFixed(4)}°N, {station.lng.toFixed(4)}°E)
            </p>
          </div>
          <button
            onClick={onClose}
            className={`text-lg p-1 cursor-pointer ${isBright ? 'text-slate-400 hover:text-black' : 'text-slate-400 hover:text-white'}`}
          >
            ✕
          </button>
        </div>

        {/* Radar Telemetry & Hardware Spec */}
        <div className={`p-4 border rounded-xl space-y-2 ${
          isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={`uppercase ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>DWR HARDWARE RIG:</span>
            <span className="font-bold text-black dark:text-white">500 KM RANGE</span>
          </div>
          <div className={`flex items-center gap-2.5 text-sm font-semibold ${isBright ? 'text-slate-900' : 'text-slate-100'}`}>
            <Radio className="w-5 h-5 text-black dark:text-white" />
            <span>{station.radarType}</span>
          </div>
          <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
            Supports simultaneous dual-polarization (ZDR, CC, KDP) and 14-layer Volume Coverage Pattern (VCP) sweeps.
          </p>
        </div>

        {/* Capacity & Personnel Breakdown */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className={`p-3 border rounded-xl ${isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
            <span className={`text-[10px] font-mono block ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>TOTAL STAFF</span>
            <span className={`text-xl font-bold font-mono mt-0.5 block ${isBright ? 'text-slate-900' : 'text-white'}`}>{station.totalCapacity}</span>
            <span className={`text-[10px] ${isBright ? 'text-slate-400' : 'text-slate-500'}`}>100% Post Allocated</span>
          </div>
          <div className={`p-3 border rounded-xl ${isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
            <span className={`text-[10px] font-mono block ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>CERTIFIED</span>
            <span className={`text-xl font-bold font-mono mt-0.5 block ${isBright ? 'text-emerald-700' : 'text-emerald-400'}`}>{station.certifiedForecasters}</span>
            <span className={`text-[10px] ${isBright ? 'text-slate-400' : 'text-slate-500'}`}>WMO Standard</span>
          </div>
          <div className={`p-3 border rounded-xl ${isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
            <span className={`text-[10px] font-mono block ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>ACTIVE ROTATION</span>
            <span className="text-xl font-bold font-mono mt-0.5 block text-black dark:text-white">{station.activeTrainees}</span>
            <span className={`text-[10px] ${isBright ? 'text-slate-400' : 'text-slate-500'}`}>In Academy</span>
          </div>
        </div>

        {/* Alert Level Setting */}
        <div className={`p-3 border rounded-xl space-y-2 ${isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
          <span className={`text-[11px] font-mono uppercase font-bold block ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
            STATION WARNING STAGE COLOR-CODE:
          </span>
          <div className="grid grid-cols-4 gap-2 text-xs font-mono font-bold">
            {(['Green', 'Yellow', 'Orange', 'Red'] as AlertLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => handleAlertChange(lvl)}
                className={`py-2 rounded-lg border transition-all ${
                  station.alertLevel === lvl
                    ? lvl === 'Green' ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : lvl === 'Yellow' ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                    : lvl === 'Orange' ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-rose-600 text-white border-rose-500 animate-pulse'
                    : isBright 
                      ? 'bg-white text-slate-600 border-slate-300 hover:text-slate-900 hover:border-slate-400' 
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className={`flex items-center justify-between pt-3 border-t ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border ${
              isBright ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-transparent'
            }`}
          >
            Close
          </button>

          <button
            onClick={() => {
              sound.playAlert();
              onLaunchStationDrill(station);
              onClose();
            }}
            className={`px-4 py-2 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
              isBright
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 text-white'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 shadow-lg'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Dispatch Emergency Drill to {station.code}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

