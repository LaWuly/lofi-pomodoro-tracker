const PREFIX = 'life-tracker/v2'
type Reviver<T> = (raw: unknown) => T

export function load<T>(key: string, reviver?: Reviver<T>): T | null {
  try {
    const raw = localStorage.getItem(`${PREFIX}/${key}`)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return (reviver ? reviver(parsed) : parsed) as T
  } catch {
    return null
  }
}

export function save<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(`${PREFIX}/${key}`, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function remove(key: string): void {
  localStorage.removeItem(`${PREFIX}/${key}`)
}
