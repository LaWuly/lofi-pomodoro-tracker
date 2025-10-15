// src/app/markdown/useMarkdown.ts
import { useMemo, useState } from 'react'
import { markdownToHtml } from '@domain/markdown/parser'
import { sanitize } from './sanitizeHtml'
import { DEFAULT_MD } from '@domain/markdown/sample'

export function useMarkdown(initial: string = DEFAULT_MD) {
  const [text, setText] = useState(initial)

  const html = useMemo(() => {
    const raw = markdownToHtml(text)
    return sanitize(raw)
  }, [text])

  return { text, setText, html }
}
