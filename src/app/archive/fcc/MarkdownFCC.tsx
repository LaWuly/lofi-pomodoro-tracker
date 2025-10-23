import { useMemo } from 'react'
import { useMarkdown } from '@app/archive/markdown/useMarkdown'
import { sanitize } from '@domain/markdown/sanitizeHtml'
import styles from './MarkdownFCC.module.css'

export default function MarkdownFCC() {
  const { text, setText, html } = useMarkdown()
  const safeHtml = useMemo(() => sanitize(html), [html])

  return (
    <div className={styles.wrapper}>
      {/* Card sinistra: Editor */}
      <section className={styles.card} aria-labelledby="md-editor-title">
        <header className={styles.header}>
          <h2 id="md-editor-title" className={styles.title}>
            Editor
          </h2>
          <div aria-hidden="true" className={styles.kbd}>
            Scrivi a sinistra · anteprima a destra
          </div>
        </header>
        <div className={styles.body}>
          <label htmlFor="editor" className="sr-only">
            Editor markdown
          </label>
          <textarea
            id="editor"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Editor markdown"
          />
        </div>
      </section>

      {/* Card destra: Preview */}
      <section className={styles.card} aria-labelledby="md-preview-title">
        <header className={styles.header}>
          <h2 id="md-preview-title" className={styles.title}>
            Preview
          </h2>
          <div aria-hidden="true" className={styles.kbd}>
            Live
          </div>
        </header>
        <div className={styles.body}>
          <div
            id="preview"
            className={styles.preview}
            aria-label="Anteprima"
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </div>
      </section>
    </div>
  )
}
