// Decodes text-encoded binaries (*.b64) into real files before dev/build, so images can
// travel through text-only commits. Runs as predev/prebuild. Scans public/projects and public/home.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'

for (const rel of ['../public/projects/', '../public/home/']) {
  const dir = new URL(rel, import.meta.url)
  if (!existsSync(dir)) continue
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.b64'))) {
    const out = f.replace(/\.b64$/, '')
    writeFileSync(new URL(out, dir), Buffer.from(readFileSync(new URL(f, dir), 'utf8').replace(/\s+/g, ''), 'base64'))
    console.log('decoded:', rel.slice(3) + out)
  }
}
