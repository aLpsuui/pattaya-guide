// Inline SVG star for ratings. Replaces the bare "★" (U+2605) text glyph, which
// renders as a missing-glyph box (tofu) on devices whose fonts don't include it
// - the cause of the "orange square" some visitors saw instead of a star.
// fill:currentColor + 1em so it inherits the surrounding .star colour and size.
export default function Star({ className = 'star' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      style={{ verticalAlign: '-0.14em', flexShrink: 0 }}
    >
      <path d="M12 2.6 14.85 8.4 21.2 9.3l-4.6 4.4 1.1 6.3L12 17.4 6.3 20l1.1-6.3-4.6-4.4 6.35-.9z" />
    </svg>
  )
}
