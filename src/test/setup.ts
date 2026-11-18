import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value() {
    return {
      canvas: this,
      font: '',
      textAlign: 'left',
      textBaseline: 'top',
      measureText: (text: string) => ({ width: Math.max(text.length * 10, 10) }),
      fillText: () => undefined,
      clearRect: () => undefined,
      getImageData: () => ({ data: new Uint8ClampedArray([255, 255, 255, 255]) }),
    };
  },
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.style.colorScheme = '';
});
