import { STORAGE } from './constants'
// sessionStorage keeps patient data out of URLs and clears when the tab closes.
export const session = {
  get<T> (key: keyof typeof STORAGE): T | null {
    try {
      const v = sessionStorage.getItem(STORAGE[key])
      return v ? (JSON.parse(v) as T) : null
    } catch {
      return null
    }
  },
  set (key: keyof typeof STORAGE, value: unknown) {
    sessionStorage.setItem(STORAGE[key], JSON.stringify(value))
  },
  clear () {
    Object.values(STORAGE).forEach(k => sessionStorage.removeItem(k))
  }
}
