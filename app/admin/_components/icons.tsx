import type { SVGProps } from 'react'

const S = (p: SVGProps<SVGSVGElement>) => ({
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...p,
})

export const IconPin = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><path d="M12 21s-7-5.4-7-11a7 7 0 0 1 14 0c0 5.6-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>)
export const IconDoc = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /><path d="M8 13h8M8 17h5" /></svg>)
export const IconImage = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><rect x="3" y="3" width="18" height="18" rx="2.5" /><circle cx="8.5" cy="8.5" r="1.8" /><path d="M21 15l-5-5L5 21" /></svg>)
export const IconSearch = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>)
export const IconDash = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>)
export const IconStar = (p: SVGProps<SVGSVGElement>) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 17.3 6.2 20.5l1.1-6.5L2.5 9.4l6.5-.9L12 2.5l3 6 6.5.9-4.8 4.6 1.1 6.5z" /></svg>)
export const IconEdit = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>)
export const IconTrash = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></svg>)
export const IconPlus = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><path d="M12 5v14M5 12h14" /></svg>)
export const IconSun = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>)
export const IconMoon = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>)
export const IconBurger = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><path d="M3 6h18M3 12h18M3 18h18" /></svg>)
export const IconChevR = (p: SVGProps<SVGSVGElement>) => (<svg {...S({ strokeWidth: 2.5, ...p })}><path d="m9 18 6-6-6-6" /></svg>)
export const IconLogout = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></svg>)
export const IconUpload = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m8 9 4-4 4 4" /><path d="M12 5v12" /></svg>)
export const IconCheck = (p: SVGProps<SVGSVGElement>) => (<svg {...S({ strokeWidth: 2.6, ...p })}><path d="m5 12 5 5 9-11" /></svg>)
export const IconWarn = (p: SVGProps<SVGSVGElement>) => (<svg {...S({ strokeWidth: 2.2, ...p })}><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>)
export const IconCross = (p: SVGProps<SVGSVGElement>) => (<svg {...S({ strokeWidth: 2.4, ...p })}><path d="M6 6l12 12M18 6 6 18" /></svg>)
export const IconEye = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>)
export const IconMail = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>)
export const IconTree = (p: SVGProps<SVGSVGElement>) => (<svg {...S(p)}><rect x="9" y="3" width="6" height="5" rx="1" /><rect x="3" y="16" width="6" height="5" rx="1" /><rect x="15" y="16" width="6" height="5" rx="1" /><path d="M12 8v3M6 16v-2.5h12V16" /></svg>)
