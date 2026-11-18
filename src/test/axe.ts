import axe, { type AxeResults, type RunOptions } from 'axe-core';

export async function getAccessibilityResults(
  root: Element,
  options?: RunOptions,
): Promise<AxeResults> {
  const runOptions: RunOptions = {
    ...options,
    rules: {
      ...options?.rules,
      // jsdom has no canvas implementation; contrast is checked in real-browser QA.
      'color-contrast': { enabled: false },
    },
  };

  return new Promise((resolve, reject) => {
    axe.run(root, runOptions, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
}
