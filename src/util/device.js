// Auto-focus is skipped on touch devices because it opens the keyboard immediately
export const canAutoFocus = () =>
    typeof window !== "undefined" && !window.matchMedia("(pointer: coarse)").matches;