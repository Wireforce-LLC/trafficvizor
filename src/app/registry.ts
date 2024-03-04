export default class Registry {
  getSettings(name: string) {
    const raw = localStorage.getItem(`settings:${name}`) || null

    if (!raw) {
      return raw
    }

    return JSON.parse(raw)
  }

  setSettings(name: string, body: object) {
    return localStorage.setItem(`settings:${name}`, JSON.stringify(body))
  }
}

export const $registry = new Registry()