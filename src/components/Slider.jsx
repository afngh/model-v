import React from 'react';

/**
 * Plain labeled Slider control component (matplotlib / textbook style).
 */
const Slider = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  unit = '',
  formatValue,
  disabled = false,
  className = ''
}) => {
  const displayValue = formatValue
    ? formatValue(value)
    : `${value}${unit ? ' ' + unit : ''}`;

  return (
    <div className={`flex flex-col gap-1 text-xs ${disabled ? 'opacity-40' : ''} ${className}`}>
      <div className="flex items-center justify-between font-mono">
        <label className="font-semibold text-slate-800">{label}</label>
        <span className="text-slate-900 bg-slate-100 px-1.5 py-0.5 border border-slate-300 rounded-sm">
          {displayValue}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-1.5 bg-slate-200 rounded-none accent-slate-900 cursor-pointer plain-slider"
      />
    </div>
  );
};

export default Slider;
