'use client'
import { useEffect, useRef, useState } from 'react'

type Cmd = { cmd: string; value?: string; label: string; title: string }

const TB: Cmd[] = [
  { cmd: 'formatBlock', value: 'p', label: 'P', title: 'Paragraph' },
  { cmd: 'formatBlock', value: 'h2', label: 'H2', title: 'Heading 2' },
  { cmd: 'formatBlock', value: 'h3', label: 'H3', title: 'Heading 3' },
  { cmd: 'bold', label: 'B', title: 'Bold' },
  { cmd: 'italic', label: 'I', title: 'Italic' },
  { cmd: 'underline', label: 'U', title: 'Underline' },
  { cmd: 'insertUnorderedList', label: '• List', title: 'Bullet list' },
  { cmd: 'insertOrderedList', label: '1. List', title: 'Numbered list' },
  { cmd: 'formatBlock', value: 'blockquote', label: 'Quote', title: 'Quote' },
  { cmd: 'createLink', label: 'Link', title: 'Insert link' },
  { cmd: 'insertImage', label: 'Image', title: 'Insert image' },
]

function pretty(html: string) {
  return html.replace(/></g, '>\n<').split('\n').map((l) => l.trim()).join('\n')
}

export default function RTE({ initialHTML, onChange }: { initialHTML: string; onChange: (html: string) => void }) {
  const areaRef = useRef<HTMLDivElement>(null)
  const [source, setSource] = useState(false)
  const [src, setSrc] = useState('')

  useEffect(() => {
    if (areaRef.current && !areaRef.current.innerHTML) areaRef.current.innerHTML = initialHTML
  }, [initialHTML])

  function exec(cmd: string, value?: string) {
    if (cmd === 'createLink') { const u = prompt('Link URL:', 'https://'); if (!u) return; document.execCommand('createLink', false, u) }
    else if (cmd === 'insertImage') { const u = prompt('Image URL:', 'https://'); if (!u) return; document.execCommand('insertImage', false, u) }
    else if (cmd === 'formatBlock') document.execCommand('formatBlock', false, `<${value}>`)
    else document.execCommand(cmd, false, value)
    areaRef.current?.focus()
    sync()
  }

  function sync() { if (areaRef.current) onChange(areaRef.current.innerHTML) }

  function toggleSource() {
    if (!source) { if (areaRef.current) setSrc(pretty(areaRef.current.innerHTML)) }
    else { if (areaRef.current) { areaRef.current.innerHTML = src; onChange(src) } }
    setSource((s) => !s)
  }

  return (
    <div className={`rte${source ? ' source-on' : ''}`}>
      <div className="rte-toolbar">
        {TB.map((b, i) => (
          <button key={i} type="button" className="rte-btn" data-rte-only title={b.title}
            onMouseDown={(e) => e.preventDefault()} onClick={() => exec(b.cmd, b.value)}>{b.label}</button>
        ))}
        <span className="rte-spacer" />
        <button type="button" className={`rte-btn${source ? ' on' : ''}`} title="Edit HTML source" onClick={toggleSource}>HTML</button>
      </div>
      <div ref={areaRef} className="rte-area" contentEditable suppressContentEditableWarning
        data-placeholder="Write the article here — format with the toolbar, or switch to HTML." onInput={sync} />
      <textarea className="rte-source" spellCheck={false} value={src}
        onChange={(e) => { setSrc(e.target.value); onChange(e.target.value) }} />
    </div>
  )
}
