import React, { useState } from 'react';
import { BodyMeasurements } from '../types/stitching';
import { MEASUREMENT_GUIDE_POINTS, STANDARD_SIZE_PRESETS, PAKISTANI_CITIES } from '../data/atelierData';
import { X, Check, Info } from 'lucide-react';

interface MeasurementGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurements: BodyMeasurements;
  onSaveMeasurements: (updated: BodyMeasurements) => void;
}

export const MeasurementGuideModal: React.FC<MeasurementGuideModalProps> = ({
  isOpen,
  onClose,
  measurements,
  onSaveMeasurements
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'digital_tape' | 'standard_presets' | 'doorstep'>('digital_tape');
  const [formData, setFormData] = useState<BodyMeasurements>({ ...measurements });
  const [selectedPointKey, setSelectedPointKey] = useState<string>('chest');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Doorstep form
  const [visitCity, setVisitCity] = useState('Lahore');
  const [visitArea, setVisitArea] = useState('DHA Phase 5');
  const [visitDate, setVisitDate] = useState('2026-10-29');
  const [visitSlot, setVisitSlot] = useState('Afternoon (3:00 PM – 5:00 PM)');
  const [visitAddress, setVisitAddress] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [doorstepBooked, setDoorstepBooked] = useState(false);

  const handleUnitToggle = (newUnit: 'inches' | 'cm') => {
    if (newUnit === formData.unit) return;
    const factor = newUnit === 'cm' ? 2.54 : 1 / 2.54;
    setFormData({
      ...formData,
      unit: newUnit,
      kameezLength: Math.round(formData.kameezLength * factor * 10) / 10,
      chest: Math.round(formData.chest * factor * 10) / 10,
      waist: Math.round(formData.waist * factor * 10) / 10,
      hip: Math.round(formData.hip * factor * 10) / 10,
      shoulderTeera: Math.round(formData.shoulderTeera * factor * 10) / 10,
      armhole: Math.round(formData.armhole * factor * 10) / 10,
      sleeveLength: Math.round(formData.sleeveLength * factor * 10) / 10,
      shalwarLength: Math.round(formData.shalwarLength * factor * 10) / 10,
      panchaTrouserOpening: Math.round(formData.panchaTrouserOpening * factor * 10) / 10,
    });
  };

  const handleApplyPreset = (presetName: string) => {
    const preset = STANDARD_SIZE_PRESETS[presetName];
    if (preset) {
      setFormData({
        ...formData,
        kameezLength: preset.kameezLength || formData.kameezLength,
        chest: preset.chest || formData.chest,
        waist: preset.waist || formData.waist,
        hip: preset.hip || formData.hip,
        shoulderTeera: preset.shoulderTeera || formData.shoulderTeera,
        sleeveLength: preset.sleeveLength || formData.sleeveLength,
        shalwarLength: preset.shalwarLength || formData.shalwarLength,
        panchaTrouserOpening: preset.panchaTrouserOpening || formData.panchaTrouserOpening,
      });
      setActiveTab('digital_tape');
    }
  };

  const handleSave = () => {
    onSaveMeasurements(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const activePointInfo = MEASUREMENT_GUIDE_POINTS.find(p => p.key === selectedPointKey) || MEASUREMENT_GUIDE_POINTS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-[#FAF9F6] border border-[#E6E0D6] rounded-sm max-w-4xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-[#EAE5DD]">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#7D5A44] font-medium">
              Bespoke Fitting Department (ناپ و پیمائش گائیڈ)
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] mt-1">
              Pakistani Tailoring Measurement Chart
            </h2>
            <p className="text-xs text-[#57534E] mt-1 font-light">
              Exact measurements for kameez, chaaks, shoulder teera, and shalwar pancha guarantee comfortable armhole movement without pulling.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#78716C] hover:text-[#1A1A1A] rounded-full hover:bg-[#EFECE6] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center justify-between gap-4 mt-6 pb-4 border-b border-[#EAE5DD] flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#EFECE6] p-0.5 rounded-sm text-xs font-medium">
            <button
              onClick={() => setActiveTab('digital_tape')}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                activeTab === 'digital_tape' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
              }`}
            >
              Interactive Tape Chart
            </button>
            <button
              onClick={() => setActiveTab('standard_presets')}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                activeTab === 'standard_presets' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
              }`}
            >
              Pakistani Sizes (34-44)
            </button>
            <button
              onClick={() => setActiveTab('doorstep')}
              className={`px-3 py-1.5 rounded-sm transition-colors ${
                activeTab === 'doorstep' ? 'bg-white text-[#1A1A1A] shadow-xs font-semibold' : 'text-[#78716C] hover:text-[#1A1A1A]'
              }`}
            >
              Book Home Master Darzi
            </button>
          </div>

          {activeTab === 'digital_tape' && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#78716C] text-[11px] mr-1">Unit:</span>
              <button
                onClick={() => handleUnitToggle('inches')}
                className={`px-2.5 py-1 rounded-sm border ${
                  formData.unit === 'inches' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#1A1A1A] border-[#E6E0D6]'
                }`}
              >
                Inches (انچ)
              </button>
              <button
                onClick={() => handleUnitToggle('cm')}
                className={`px-2.5 py-1 rounded-sm border ${
                  formData.unit === 'cm' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#1A1A1A] border-[#E6E0D6]'
                }`}
              >
                CM (سینٹی میٹر)
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: Digital Tape Form */}
        {activeTab === 'digital_tape' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6 items-start">
            
            {/* Mannequin diagram */}
            <div className="md:col-span-5 bg-[#F4F1EA] border border-[#E6E0D6] rounded-sm p-4 flex flex-col items-center justify-between">
              <div className="text-[11px] text-[#78716C] font-mono uppercase tracking-wider mb-2">
                Darzi Tape Diagram
              </div>

              <div className="relative w-48 h-80 flex items-center justify-center">
                <svg viewBox="0 0 200 360" className="w-full h-full">
                  <path
                    d="M 90,30 L 90,55 Q 100,58 110,55 L 110,30 Z"
                    fill="#DFD7CB"
                    stroke="#B8ABA0"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 68,60 Q 60,95 72,130 Q 75,170 82,185 Q 70,230 65,340 L 135,340 Q 130,230 118,185 Q 125,170 128,130 Q 140,95 132,60 Q 100,68 68,60 Z"
                    fill="#EDE6DB"
                    stroke="#8C7A6B"
                    strokeWidth="1.8"
                  />

                  {/* Teera / Shoulder (y=62) */}
                  <line x1="66" y1="62" x2="134" y2="62" stroke={selectedPointKey === 'shoulderTeera' ? '#B2422A' : '#A8998C'} strokeWidth={selectedPointKey === 'shoulderTeera' ? '3' : '1.5'} strokeDasharray={selectedPointKey === 'shoulderTeera' ? 'none' : '3 3'} />
                  {/* Chest (y=115) */}
                  <line x1="62" y1="115" x2="138" y2="115" stroke={selectedPointKey === 'chest' ? '#B2422A' : '#A8998C'} strokeWidth={selectedPointKey === 'chest' ? '3' : '1.5'} strokeDasharray={selectedPointKey === 'chest' ? 'none' : '3 3'} />
                  {/* Waist (y=165) */}
                  <line x1="74" y1="165" x2="126" y2="165" stroke={selectedPointKey === 'waist' ? '#B2422A' : '#A8998C'} strokeWidth={selectedPointKey === 'waist' ? '3' : '1.5'} strokeDasharray={selectedPointKey === 'waist' ? 'none' : '3 3'} />
                  {/* Hip / Chaak (y=210) */}
                  <line x1="66" y1="210" x2="134" y2="210" stroke={selectedPointKey === 'hip' ? '#B2422A' : '#A8998C'} strokeWidth={selectedPointKey === 'hip' ? '3' : '1.5'} strokeDasharray={selectedPointKey === 'hip' ? 'none' : '3 3'} />
                  {/* Kameez Length (Vertical) */}
                  <line x1="100" y1="62" x2="100" y2="300" stroke={selectedPointKey === 'kameezLength' ? '#B2422A' : '#A8998C'} strokeWidth={selectedPointKey === 'kameezLength' ? '2.5' : '1'} strokeDasharray="4 2" />
                  {/* Shalwar Length */}
                  <line x1="115" y1="165" x2="115" y2="340" stroke={selectedPointKey === 'shalwarLength' ? '#B2422A' : '#A8998C'} strokeWidth={selectedPointKey === 'shalwarLength' ? '2.5' : '1'} strokeDasharray="4 2" />
                </svg>
              </div>

              <div className="w-full mt-4 p-3 bg-white border border-[#E6E0D6] rounded-sm text-xs space-y-1">
                <div className="font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#7D5A44]" />
                  <span>{activePointInfo.label}</span>
                </div>
                <p className="text-[11px] text-[#57534E] leading-relaxed">
                  {activePointInfo.hint}
                </p>
              </div>
            </div>

            {/* Input fields */}
            <div className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {MEASUREMENT_GUIDE_POINTS.map((pt) => {
                  const val = (formData as any)[pt.key] || '';
                  const isActive = selectedPointKey === pt.key;
                  return (
                    <div
                      key={pt.key}
                      onClick={() => setSelectedPointKey(pt.key)}
                      className={`p-3 rounded-sm border transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#1A1A1A] bg-white ring-1 ring-[#1A1A1A] shadow-xs'
                          : 'border-[#E6E0D6] bg-white hover:border-[#C5BBAF]'
                      }`}
                    >
                      <label className="text-[11px] font-medium text-[#78716C] block truncate">
                        {pt.label}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="number"
                          step="0.5"
                          value={val}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              [pt.key]: parseFloat(e.target.value) || 0
                            });
                          }}
                          className="w-full text-base font-semibold text-[#1A1A1A] bg-transparent border-b border-[#D5CBBF] focus:border-[#1A1A1A] focus:outline-hidden tabular-nums"
                        />
                        <span className="text-xs text-[#78716C] shrink-0">{formData.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-[#1A1A1A] block mb-1">
                  Fit Preferences / Posture Notes (خصوصی ہدایات):
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Keep chaaks 1 inch higher; loose fit around chest; preference for straight cigarette pants with pearl buttons."
                  rows={2}
                  className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs text-[#1A1A1A] focus:outline-hidden focus:border-[#1A1A1A]"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#EAE5DD]">
                <button
                  onClick={() => handleApplyPreset('M (Pakistani Size 38)')}
                  className="text-xs text-[#7D5A44] hover:underline font-medium"
                >
                  Reset to Size M (38)
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-[#C5BBAF] text-xs font-medium text-[#1A1A1A] rounded-sm hover:bg-[#EFECE6]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E] flex items-center gap-1.5 shadow-sm"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <span>Save Measurements</span>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: Standard Pakistani Size Presets */}
        {activeTab === 'standard_presets' && (
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-serif text-lg text-[#1A1A1A]">Select Pakistani Standard Size (34-44)</h3>
              <p className="text-xs text-[#78716C] mt-1">
                Standard chart calibrated for Pakistani brands (Khaadi, Sapphire, Sana Safinaz sizing).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(STANDARD_SIZE_PRESETS).map(([name, vals]) => (
                <div
                  key={name}
                  className="p-4 bg-white border border-[#E6E0D6] rounded-sm text-xs space-y-2 hover:border-[#1A1A1A] transition-colors"
                >
                  <div className="flex items-center justify-between font-semibold text-[#1A1A1A]">
                    <span>{name}</span>
                    <button
                      onClick={() => handleApplyPreset(name)}
                      className="px-3 py-1 bg-[#1A1A1A] text-white text-[11px] rounded-sm hover:bg-[#38332E]"
                    >
                      Apply
                    </button>
                  </div>
                  <div className="text-[11px] text-[#6B655F] space-y-0.5 tabular-nums">
                    <div>Kameez: {vals.kameezLength}" · Chest: {vals.chest}"</div>
                    <div>Waist: {vals.waist}" · Hip: {vals.hip}"</div>
                    <div>Teera: {vals.shoulderTeera}" · Shalwar: {vals.shalwarLength}"</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Doorstep Master Darzi Booking */}
        {activeTab === 'doorstep' && (
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-serif text-lg text-[#1A1A1A]">Book Doorstep Master Darzi (گھر پر درزی کی وزٹ)</h3>
              <p className="text-xs text-[#78716C] mt-1">
                A senior certified female master tailor visits your residence in Lahore, Karachi, or Islamabad with measuring tapes, lace cards, and swatch samples.
              </p>
            </div>

            {doorstepBooked ? (
              <div className="p-6 bg-[#EFECE6] border border-[#C5BBAF] rounded-sm text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-semibold text-[#1A1A1A]">
                  Home Measurement Appointment Confirmed!
                </h4>
                <p className="text-xs text-[#57534E] max-w-md mx-auto">
                  Our Master Tailor is scheduled to visit your residence in <strong>{visitCity} ({visitArea})</strong> on <strong>{visitDate}</strong> during <strong>{visitSlot}</strong>. You will receive an SMS and WhatsApp confirmation.
                </p>
                <button
                  onClick={() => setDoorstepBooked(false)}
                  className="mt-2 text-xs text-[#7D5A44] hover:underline font-medium"
                >
                  Change Appointment Details
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[11px] text-[#78716C] block mb-1">City (شہر)</label>
                  <select
                    value={visitCity}
                    onChange={(e) => setVisitCity(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs"
                  >
                    {PAKISTANI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-[#78716C] block mb-1">Area / Sector</label>
                  <input
                    type="text"
                    value={visitArea}
                    onChange={(e) => setVisitArea(e.target.value)}
                    placeholder="e.g. DHA, Gulberg, Bahria Town, Clifton"
                    className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#78716C] block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#78716C] block mb-1">Time Slot</label>
                  <select
                    value={visitSlot}
                    onChange={(e) => setVisitSlot(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs"
                  >
                    <option>Morning (11:00 AM – 1:00 PM)</option>
                    <option>Afternoon (3:00 PM – 5:00 PM)</option>
                    <option>Evening (6:00 PM – 8:00 PM)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-[#78716C] block mb-1">Complete Home Address</label>
                  <input
                    type="text"
                    value={visitAddress}
                    onChange={(e) => setVisitAddress(e.target.value)}
                    placeholder="House / Apartment #, Street #, Sector / Phase"
                    className="w-full p-2.5 bg-white border border-[#E6E0D6] rounded-sm text-xs"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      if (!visitAddress) setVisitAddress('House 14, Street 8, DHA Phase 5');
                      setDoorstepBooked(true);
                    }}
                    className="px-6 py-2.5 bg-[#1A1A1A] text-white text-xs font-semibold tracking-wider uppercase rounded-sm hover:bg-[#38332E] transition-colors"
                  >
                    Confirm Master Darzi Slot
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
