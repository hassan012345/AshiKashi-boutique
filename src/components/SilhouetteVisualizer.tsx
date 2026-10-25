import React, { useState } from 'react';
import { 
  GarmentCategory, 
  NecklineType, 
  SleeveType, 
  BottomType,
  HemLength, 
  BodyMeasurements 
} from '../types/stitching';
import { Eye, Info, Layers, ZoomIn, Box } from 'lucide-react';
import { ThreeDMannequinVisualizer } from './ThreeDMannequinVisualizer';

interface SilhouetteVisualizerProps {
  garmentId: GarmentCategory;
  neckline: NecklineType;
  sleeve: SleeveType;
  bottomStyle?: BottomType;
  length: HemLength;
  fabricColorHex: string;
  fabricName: string;
  measurements?: BodyMeasurements;
  onOpenMeasurements: () => void;
}

export const SilhouetteVisualizer: React.FC<SilhouetteVisualizerProps> = ({
  garmentId,
  neckline,
  sleeve,
  bottomStyle = 'patiala_shalwar',
  length,
  fabricColorHex,
  fabricName,
  measurements,
  onOpenMeasurements
}) => {
  const [viewMode, setViewMode] = useState<'3d_mannequin' | 'couture' | 'blueprint'>('3d_mannequin');
  const [activeCallout, setActiveCallout] = useState<string | null>(null);

  const isBlouse = garmentId === 'saree_blouse';
  const isFrock = garmentId === 'kalidar_frock';
  const isMaxi = garmentId === 'formal_maxi';
  const isAngrakha = garmentId === 'angrakha_gharara';
  const isKameez = garmentId === 'shalwar_kameez' || garmentId === 'kurti_trouser';

  let bottomY = 460;
  if (length === 'knee_length') bottomY = 360;
  if (length === 'ankle_length') bottomY = 440;
  if (length === 'floor_length') bottomY = 480;
  if (isBlouse) bottomY = 220;

  // 2D Neckline paths
  const renderNeckline = () => {
    switch (neckline) {
      case 'sherwani_collar':
        return (
          <g>
            <path d="M 136,88 Q 150,85 164,88 L 165,78 Q 150,75 135,78 Z" fill="#D4AF37" stroke="#2B2724" strokeWidth="1.5" />
            <path d="M 148,88 L 150,135" stroke="#D4AF37" strokeWidth="2.5" />
            <circle cx="150" cy="100" r="2" fill="#FAF9F6" />
            <circle cx="150" cy="114" r="2" fill="#FAF9F6" />
            <circle cx="150" cy="128" r="2" fill="#FAF9F6" />
          </g>
        );
      case 'sweetheart':
        return (
          <path
            d="M 125,95 Q 140,120 150,118 Q 160,120 175,95"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2.2"
          />
        );
      case 'angrakha_wrap':
        return (
          <g>
            <path d="M 128,90 L 168,160" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
            <circle cx="168" cy="160" r="3" fill="#D4AF37" />
          </g>
        );
      case 'boat_neck':
        return (
          <path
            d="M 115,90 Q 150,102 185,90"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2.2"
          />
        );
      case 'keyhole_dori':
        return (
          <g>
            <circle cx="150" cy="115" r="7" fill="#FAF9F6" stroke="#D4AF37" strokeWidth="1.8" />
            <line x1="150" y1="92" x2="150" y2="108" stroke="#D4AF37" strokeWidth="1.8" />
          </g>
        );
      case 'round_patti':
        return (
          <g>
            <path d="M 128,92 Q 150,118 172,92" fill="none" stroke="#D4AF37" strokeWidth="2" />
            <line x1="150" y1="118" x2="150" y2="155" stroke="#D4AF37" strokeWidth="3" />
          </g>
        );
      case 'square_cut':
        return (
          <path
            d="M 128,92 L 128,122 L 172,122 L 172,92"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2"
          />
        );
      default:
        return <path d="M 125,92 Q 150,115 175,92" fill="none" stroke="#D4AF37" strokeWidth="2" />;
    }
  };

  // 2D Sleeve paths
  const renderSleeves = (fillColor: string) => {
    switch (sleeve) {
      case 'sleeveless':
        return null;
      case 'choori_daar':
        return (
          <g>
            {/* Left Choori Daar with gathered ripple cuffs */}
            <path d="M 118,92 L 78,220 L 96,224 L 126,122" fill={fillColor} stroke="#2B2724" strokeWidth="1.5" />
            <line x1="78" y1="205" x2="94" y2="207" stroke="#D4AF37" strokeWidth="1.5" />
            <line x1="80" y1="212" x2="95" y2="214" stroke="#D4AF37" strokeWidth="1.5" />
            <line x1="82" y1="219" x2="96" y2="221" stroke="#D4AF37" strokeWidth="1.5" />

            {/* Right Choori Daar */}
            <path d="M 182,92 L 222,220 L 204,224 L 174,122" fill={fillColor} stroke="#2B2724" strokeWidth="1.5" />
            <line x1="222" y1="205" x2="206" y2="207" stroke="#D4AF37" strokeWidth="1.5" />
            <line x1="220" y1="212" x2="205" y2="214" stroke="#D4AF37" strokeWidth="1.5" />
            <line x1="218" y1="219" x2="204" y2="221" stroke="#D4AF37" strokeWidth="1.5" />
          </g>
        );
      case 'bell_bottom':
        return (
          <g>
            <path d="M 118,92 L 98,150 L 65,225 Q 95,218 108,205 L 126,122" fill={fillColor} stroke="#2B2724" strokeWidth="1.5" />
            <path d="M 65,225 Q 95,218 108,205" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
            <path d="M 182,92 L 202,150 L 235,225 Q 205,218 192,205 L 174,122" fill={fillColor} stroke="#2B2724" strokeWidth="1.5" />
            <path d="M 235,225 Q 205,218 192,205" stroke="#D4AF37" strokeWidth="2.5" fill="none" />
          </g>
        );
      case 'kurta_cut':
        return (
          <g>
            <path d="M 118,92 L 86,190 L 102,192 L 126,122" fill={fillColor} stroke="#2B2724" strokeWidth="1.5" />
            <line x1="86" y1="185" x2="102" y2="187" stroke="#D4AF37" strokeWidth="2" />
            <path d="M 182,92 L 214,190 L 198,192 L 174,122" fill={fillColor} stroke="#2B2724" strokeWidth="1.5" />
            <line x1="214" y1="185" x2="198" y2="187" stroke="#D4AF37" strokeWidth="2" />
          </g>
        );
      case 'bishop_cuff':
        return (
          <g>
            <path d="M 118,92 Q 70,160 88,210 L 98,210 Q 110,180 126,122" fill={fillColor} stroke="#2B2724" strokeWidth="1.5" />
            <rect x="88" y="206" width="10" height="8" fill="#D4AF37" />
            <path d="M 182,92 Q 230,160 212,210 L 202,210 Q 190,180 174,122" fill={fillColor} stroke="#2B2724" strokeWidth="1.5" />
            <rect x="202" y="206" width="10" height="8" fill="#D4AF37" />
          </g>
        );
      case 'cape_sleeve':
        return (
          <g>
            <path d="M 118,92 Q 60,180 68,340 L 95,330 Q 88,180 126,122" fill={fillColor} stroke="#2B2724" strokeWidth="1.2" opacity="0.9" />
            <path d="M 182,92 Q 240,180 232,340 L 205,330 Q 212,180 174,122" fill={fillColor} stroke="#2B2724" strokeWidth="1.2" opacity="0.9" />
          </g>
        );
      default:
        return null;
    }
  };

  const garmentFill = viewMode === 'blueprint' ? '#FFFFFF' : fabricColorHex;
  const strokeLineColor = viewMode === 'blueprint' ? '#1A365D' : '#D4AF37';

  return (
    <div className="bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm p-6 flex flex-col items-center justify-between shadow-sm relative">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between pb-4 border-b border-[#EAE5DD] text-xs">
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm font-semibold text-[#1A1A1A]">Pakistani Tailoring Visualizer</span>
          <span className="text-[#8C7A6B]">·</span>
          <span className="text-[#78716C] capitalize">{fabricName}</span>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-[#EFECE6] p-0.5 rounded-sm">
          <button
            onClick={() => setViewMode('3d_mannequin')}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors rounded-sm flex items-center gap-1 ${
              viewMode === '3d_mannequin' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
            }`}
          >
            <Box className="w-3 h-3 text-[#7D5A44]" />
            <span>3D Model</span>
          </button>
          <button
            onClick={() => setViewMode('couture')}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors rounded-sm ${
              viewMode === 'couture' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
            }`}
          >
            Couture Drape
          </button>
          <button
            onClick={() => setViewMode('blueprint')}
            className={`px-2.5 py-1 text-[11px] font-medium transition-colors rounded-sm ${
              viewMode === 'blueprint' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
            }`}
          >
            Paper Sloper
          </button>
        </div>
      </div>

      {/* Render 3D Mannequin Model OR 2D SVG Blueprint */}
      {viewMode === '3d_mannequin' ? (
        <div className="w-full my-1">
          <ThreeDMannequinVisualizer
            garmentId={garmentId}
            neckline={neckline}
            sleeve={sleeve}
            bottomStyle={bottomStyle}
            length={length}
            fabricColorHex={fabricColorHex}
            fabricName={fabricName}
          />
        </div>
      ) : (
        /* SVG Canvas */
        <div className="relative w-full max-w-[340px] my-4 flex items-center justify-center">
          <svg
            viewBox="0 0 300 500"
            className="w-full h-auto drop-shadow-sm transition-all duration-300"
            style={{ maxHeight: '460px' }}
          >
            <defs>
              <linearGradient id="pakSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={garmentFill} stopOpacity="0.88" />
                <stop offset="50%" stopColor={garmentFill} stopOpacity="1" />
                <stop offset="100%" stopColor={garmentFill} stopOpacity="0.84" />
              </linearGradient>

              <pattern id="sloperGrid" width="15" height="15" patternUnits="userSpaceOnUse">
                <rect width="15" height="15" fill="#FAFAFA" />
                <path d="M 15 0 L 0 0 0 15" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
              </pattern>
            </defs>

            {viewMode === 'blueprint' && (
              <rect width="300" height="500" fill="url(#sloperGrid)" />
            )}

            {/* Mannequin stand */}
            <path d="M 142,50 L 142,85 Q 150,90 158,85 L 158,50 Z" fill="#DFD7CB" stroke="#B8ABA0" strokeWidth="1" />
            <ellipse cx="150" cy="50" rx="8" ry="4" fill="#C9BDAF" />

            {/* Sleeves layer */}
            {renderSleeves("url(#pakSheen)")}

            {/* Garment Silhouette */}
            {isFrock || isMaxi ? (
              /* Flared Anarkali / Kalidar Frock or Maxi */
              <g>
                <path
                  d={`M 118,92 Q 114,140 128,175 Q 70,320 50,${bottomY} Q 150,${bottomY + 15} 250,${bottomY} Q 230,320 172,175 Q 186,140 182,92 Z`}
                  fill="url(#pakSheen)"
                  stroke="#2A2421"
                  strokeWidth="1.8"
                />
                {/* Kalidar flair seams */}
                <line x1="134" y1="175" x2="88" y2={bottomY} stroke={strokeLineColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="142" y1="175" x2="118" y2={bottomY} stroke={strokeLineColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="150" y1="175" x2="150" y2={bottomY} stroke={strokeLineColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="158" y1="175" x2="182" y2={bottomY} stroke={strokeLineColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <line x1="166" y1="175" x2="212" y2={bottomY} stroke={strokeLineColor} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                {/* Gota Daman Border */}
                <path d={`M 50,${bottomY} Q 150,${bottomY + 15} 250,${bottomY}`} stroke="#D4AF37" strokeWidth="4" fill="none" />
              </g>
            ) : isBlouse ? (
              /* Saree Blouse */
              <g>
                <path
                  d="M 118,92 Q 112,140 128,215 L 172,215 Q 188,140 182,92 Z"
                  fill="url(#pakSheen)"
                  stroke="#2A2421"
                  strokeWidth="1.8"
                />
                <line x1="128" y1="215" x2="172" y2="215" stroke="#D4AF37" strokeWidth="3" />
              </g>
            ) : isAngrakha ? (
              /* Angrakha Tunic + Gharara */
              <g>
                {/* Gharara Bottom Flairs */}
                <path d="M 125,260 L 95,${bottomY} L 140,${bottomY} L 150,300 Z" fill="url(#pakSheen)" stroke="#2A2421" strokeWidth="1.5" />
                <path d="M 175,260 L 205,${bottomY} L 160,${bottomY} L 150,300 Z" fill="url(#pakSheen)" stroke="#2A2421" strokeWidth="1.5" />
                {/* Angrakha Top */}
                <path
                  d="M 118,92 Q 112,140 126,260 L 174,260 Q 188,140 182,92 Z"
                  fill="url(#pakSheen)"
                  stroke="#2A2421"
                  strokeWidth="1.8"
                />
              </g>
            ) : (
              /* Classic Shalwar Kameez or Kurti with Cigarette Pants */
              <g>
                {/* Shalwar / Trouser visible underneath */}
                {bottomStyle === 'patiala_shalwar' ? (
                  /* Patiala Shalwar flares */
                  <g>
                    <path d="M 128,230 Q 90,320 115,${bottomY} L 138,${bottomY} Q 130,300 150,260 Q 170,300 162,${bottomY} L 185,${bottomY} Q 210,320 172,230 Z" fill="url(#pakSheen)" stroke="#2A2421" strokeWidth="1.5" />
                    {/* Pressed Pancha */}
                    <line x1="115" y1={bottomY - 6} x2="138" y2={bottomY - 6} stroke="#D4AF37" strokeWidth="3" />
                    <line x1="162" y1={bottomY - 6} x2="185" y2={bottomY - 6} stroke="#D4AF37" strokeWidth="3" />
                  </g>
                ) : (
                  /* Cigarette Pants */
                  <g>
                    <path d={`M 130,220 L 122,${bottomY} L 138,${bottomY} L 150,260 L 162,${bottomY} L 178,${bottomY} L 170,220 Z`} fill="url(#pakSheen)" stroke="#2A2421" strokeWidth="1.5" />
                    <line x1="122" y1={bottomY - 5} x2="138" y2={bottomY - 5} stroke="#D4AF37" strokeWidth="2.5" />
                    <line x1="162" y1={bottomY - 5} x2="178" y2={bottomY - 5} stroke="#D4AF37" strokeWidth="2.5" />
                  </g>
                )}

                {/* Kameez Body */}
                <path
                  d="M 118,92 Q 112,140 128,190 L 126,340 L 174,340 L 172,190 Q 188,140 182,92 Z"
                  fill="url(#pakSheen)"
                  stroke="#2A2421"
                  strokeWidth="1.8"
                />
                {/* Side Chaaks with Gold Magzi */}
                <line x1="126" y1="210" x2="126" y2="340" stroke="#D4AF37" strokeWidth="2" />
                <line x1="174" y1="210" x2="174" y2="340" stroke="#D4AF37" strokeWidth="2" />
                {/* Daman Facing */}
                <line x1="126" y1="340" x2="174" y2="340" stroke="#D4AF37" strokeWidth="3" />
              </g>
            )}

            {/* Neckline cutout layer */}
            {renderNeckline()}

            {/* Anatomical measurement pins */}
            <g className="cursor-pointer group" onClick={() => setActiveCallout(activeCallout === 'chest' ? null : 'chest')}>
              <circle cx="150" cy="140" r="4.5" fill="#7D5A44" stroke="#FAF9F6" strokeWidth="1.5" />
              <line x1="110" y1="140" x2="190" y2="140" stroke="#7D5A44" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            <g className="cursor-pointer group" onClick={() => setActiveCallout(activeCallout === 'waist' ? null : 'waist')}>
              <circle cx="150" cy="175" r="4.5" fill="#7D5A44" stroke="#FAF9F6" strokeWidth="1.5" />
              <line x1="125" y1="175" x2="175" y2="175" stroke="#7D5A44" strokeWidth="1" strokeDasharray="2 2" />
            </g>

            <g className="cursor-pointer group" onClick={() => setActiveCallout(activeCallout === 'hip' ? null : 'hip')}>
              <circle cx="150" cy="225" r="4.5" fill="#7D5A44" stroke="#FAF9F6" strokeWidth="1.5" />
              <line x1="118" y1="225" x2="182" y2="225" stroke="#7D5A44" strokeWidth="1" strokeDasharray="2 2" />
            </g>
          </svg>

          {activeCallout && (
            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md border border-[#E6E0D6] rounded-sm p-3 text-xs shadow-md z-10 max-w-[190px]">
              <div className="font-semibold text-[#1A1A1A] capitalize flex items-center justify-between">
                <span>{activeCallout} Dimension</span>
                <button onClick={() => setActiveCallout(null)} className="text-[#8C7A6B] hover:text-[#1A1A1A]">✕</button>
              </div>
              <div className="text-[#57534E] text-[11px] mt-1">
                {activeCallout === 'chest' && `Chest/Bust: ${measurements?.chest ? `${measurements.chest}"` : '36"'}`}
                {activeCallout === 'waist' && `Waist: ${measurements?.waist ? `${measurements.waist}"` : '28"'}`}
                {activeCallout === 'hip' && `Hip / Chaak: ${measurements?.hip ? `${measurements.hip}"` : '40"'}`}
              </div>
              <button onClick={onOpenMeasurements} className="mt-2 text-[10px] uppercase font-semibold text-[#7D5A44] hover:underline">
                Adjust In Guide →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Blueprint Annotations Footer */}
      <div className="w-full pt-3 border-t border-[#EAE5DD] flex items-center justify-between text-[11px] text-[#78716C]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: fabricColorHex }} />
          <span>{fabricName}</span>
        </div>
        <button
          onClick={onOpenMeasurements}
          className="text-[#7D5A44] hover:text-[#5B3E2B] font-medium flex items-center gap-1"
        >
          <span>Darzi Measurement Chart</span>
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
