import { twJoin } from 'tailwind-merge'

interface RatingBadgeProps {
  rating: number
  size?: number // outer circle diameter including stroke
  strokeWidth?: number
  textSize?: string // Tailwind text size
  isAbsolute?: boolean
}

export const RatingCircle = ({
  rating: __rating,
  size = 34,
  strokeWidth = 4,
  textSize = 'text-xs',
  isAbsolute = true,
}: RatingBadgeProps) => {
  const rating = Math.floor(__rating * 10)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (rating / 100) * circumference
  const strokeColor =
    rating >= 70 ? 'hsl(131, 63%, 34%)' : rating >= 40 ? 'orange' : 'red'

  return (
    <div
      className={twJoin(
        'rounded-full bg-black/80',
        isAbsolute && 'absolute top-2 right-2',
      )}
    >
      <div style={{ width: size, height: size }} className="relative">
        <svg
          className="h-full w-full -rotate-90 transform"
          viewBox={`0 0 ${size} ${size}`}
        >
          <title>{rating}%</title>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span
          className={`absolute inset-0 flex items-center justify-center font-medium text-white ${textSize}`}
        >
          {rating}%
        </span>
      </div>
    </div>
  )
}
