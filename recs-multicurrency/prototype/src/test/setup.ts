import '@testing-library/jest-dom'

// Polyfill requestAnimationFrame for jsdom
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0) as unknown as number
globalThis.cancelAnimationFrame = (id) => clearTimeout(id)

// Polyfill ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Polyfill matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
