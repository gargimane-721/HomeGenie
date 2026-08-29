import React from 'react';

interface HomeGenieLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'full' | 'icon' | 'badge';
  color?: string; // Gray color class or hex, defaults to gray-700
  secondaryColor?: string;
}

export const HomeGenieLogo: React.FC<HomeGenieLogoProps> = ({
  className = '',
  size = 40,
  variant = 'full',
  color = 'currentColor',
}) => {
  // If only the compass icon mark is needed
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ width: size, height: size }}
      >
        {/* Outer Circular Ring */}
        <circle
          cx="60"
          cy="60"
          r="38"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* Inner Concentric Arc / Ring */}
        <circle
          cx="60"
          cy="60"
          r="32"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="2 2"
          opacity="0.8"
        />

        {/* 4 Diagonal Compass Ticks (45, 135, 225, 315 deg) */}
        <line x1="88" y1="32" x2="98" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="88" y1="88" x2="98" y2="98" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="88" x2="22" y2="98" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="32" x2="22" y2="22" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

        {/* North Pointer (Compass Apex) */}
        <polygon
          points="60,6 66,42 60,36"
          fill={color}
          opacity="0.25"
        />
        <polygon
          points="60,6 54,42 60,36"
          fill={color}
          opacity="0.6"
        />
        <polyline
          points="54,42 60,6 66,42"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <line x1="60" y1="6" x2="60" y2="38" stroke={color} strokeWidth="1.5" />

        {/* South Pointer */}
        <polygon
          points="60,114 66,78 60,84"
          fill={color}
          opacity="0.6"
        />
        <polygon
          points="60,114 54,78 60,84"
          fill={color}
          opacity="0.25"
        />
        <polyline
          points="54,78 60,114 66,78"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <line x1="60" y1="82" x2="60" y2="114" stroke={color} strokeWidth="1.5" />

        {/* West Pointer */}
        <polyline
          points="42,54 6,60 42,66"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon points="6,60 42,54 36,60" fill={color} opacity="0.6" />
        <polygon points="6,60 42,66 36,60" fill={color} opacity="0.25" />

        {/* East Pointer */}
        <polyline
          points="78,54 114,60 78,66"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polygon points="114,60 78,54 84,60" fill={color} opacity="0.25" />
        <polygon points="114,60 78,66 84,60" fill={color} opacity="0.6" />

        {/* House Gable Roof Profile inside Compass */}
        <path
          d="M38 64 L60 42 L82 64"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M60 42 L88 42 L88 36"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Full Logo matching the uploaded visual reference with precision typography & emblem
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 340 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-auto w-auto max-h-full"
        style={{ width: typeof size === 'number' ? `${size * 3.4}px` : size, height: typeof size === 'number' ? `${size}px` : 'auto' }}
      >
        <g transform="translate(0, 0)">
          {/* Outer Ring */}
          <circle
            cx="65"
            cy="50"
            r="32"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Inner Ring Segment */}
          <circle
            cx="65"
            cy="50"
            r="26"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.85"
          />

          {/* Diagonal Compass Ray Notches */}
          <line x1="88" y1="27" x2="96" y2="19" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="88" y1="73" x2="96" y2="81" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="42" y1="73" x2="34" y2="81" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="42" y1="27" x2="34" y2="19" stroke={color} strokeWidth="2.2" strokeLinecap="round" />

          {/* North Pointer (Tall Top Needle) */}
          <polygon points="65,6 70,35 65,31" fill={color} opacity="0.3" />
          <polygon points="65,6 60,35 65,31" fill={color} opacity="0.75" />
          <polyline
            points="60,35 65,6 70,35"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line x1="65" y1="6" x2="65" y2="33" stroke={color} strokeWidth="1.2" />

          {/* South Pointer (Tall Bottom Needle) */}
          <polygon points="65,94 70,65 65,69" fill={color} opacity="0.75" />
          <polygon points="65,94 60,65 65,69" fill={color} opacity="0.3" />
          <polyline
            points="60,65 65,94 70,65"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line x1="65" y1="67" x2="65" y2="94" stroke={color} strokeWidth="1.2" />

          {/* West Pointer (Left Needle) */}
          <polygon points="18,50 47,45 42,50" fill={color} opacity="0.75" />
          <polygon points="18,50 47,55 42,50" fill={color} opacity="0.3" />
          <polyline
            points="47,45 18,50 47,55"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Architectural House Gable Roof Outline */}
          <path
            d="M48 54 L65 37 L86 54"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Extended horizontal drafting eave & step */}
          <path
            d="M65 37 L114 46 L114 41"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Wordmark: homegenie */}
        {/* Rendered with crisp SVG vector paths / typography */}
        <text
          x="44"
          y="56"
          fill={color}
          fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
          fontWeight="600"
          fontSize="31"
          letterSpacing="-0.03em"
          dominantBaseline="middle"
        >
          homegenie
        </text>
      </svg>
    </div>
  );
};
