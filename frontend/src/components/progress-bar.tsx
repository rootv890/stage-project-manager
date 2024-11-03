type Props = {
  size: number;
  progress: number;
  strokeWidth: number;
};

function ProgressBar({ progress, size = 100, strokeWidth }: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg
      width={size}
      height={size}
      className="circular-progress  stroke-zinc-400 dark:stroke-zinc-800 dark:text-zinc-100
    "
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        strokeWidth={strokeWidth}
        fill="none"
        r={radius}
        strokeDasharray={circumference}
        strokeLinecap="round"
        strokeDashoffset={offset}
        style={{
          transition: "stroke-dashoffset 0.35s",
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
        }}
      ></circle>

      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="1em"
        stroke="none"
        className="fill-zinc-700 dark:fill-zinc-300 antialiased"
      >
        {`${progress}%`}
      </text>
    </svg>
  );
}

export default ProgressBar;
