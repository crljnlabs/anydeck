/**
 * The number and the plus on a profile chip, drawn rather than typed.
 *
 * A digit in a round badge is centred by CSS only as well as the font allows:
 * `place-items: center` centres the line box, and a line box carries room for
 * ascenders and descenders that the digit itself does not fill. The glyph ends
 * up sitting low, by an amount that changes with the font. Drawing it puts the
 * geometric centre of the shape at the centre of the circle, which is what the
 * eye is actually checking.
 */

export function ProfileNumber({ value }) {
  return (
    <svg className="profile-mark" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <text
        x="10"
        y="10"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11.5"
        fontWeight="700"
        fill="var(--profile-mark-ink)"
      >
        {value}
      </text>
    </svg>
  )
}

export function ProfileAdd() {
  return (
    <svg className="profile-mark" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M10 4.5v11M4.5 10h11"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  )
}
