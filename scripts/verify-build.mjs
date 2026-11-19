import { readFile } from 'node:fs/promises';

const expectedBase = process.env.EXPECT_BASE ?? '/';
const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const assetPrefix = `${expectedBase.replace(/\/$/, '')}/assets/`.replace(/^\/assets/, '/assets');

if (!html.includes(`src="${assetPrefix}`) || !html.includes(`href="${assetPrefix}`)) {
  throw new Error(`Build verwendet nicht den erwarteten Asset-Pfad ${assetPrefix}`);
}

console.log(`Build geprüft: Asset-Pfad ${assetPrefix}`);
