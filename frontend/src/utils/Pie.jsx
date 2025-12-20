const OccupancyPie = ({ occupied = 0, vacant = 0, size = 96 }) => {
  const total = occupied + vacant || 1;
  const occupiedPct = (occupied / total) * 100;

  const radius = size / 2 - 6;
  const circumference = 2 * Math.PI * radius;
  const dash = (occupiedPct / 100) * circumference;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgb(51 65 85)"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgb(16 185 129)"
        strokeWidth="10"
        fill="none"
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default OccupancyPie;
