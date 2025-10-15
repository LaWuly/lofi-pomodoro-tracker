import { marked } from 'marked'

export function configureMarked() {
  marked.setOptions({
    gfm: true,
    breaks: true,
  })
}

configureMarked()

export function markdownToHtml(md: string): string {
  return String(marked.parse(md))
}
