/// <reference types="vitest/globals" />

declare global {
  declare const _vi: (typeof import("vitest"))["vi"];
}

export {};
