#!/usr/bin/env node
/**
 * test-bot.mjs
 * pnpm test:bot {feature} — E2E 테스트 실행 스크립트
 *
 * 사용법:
 *   node scripts/test-bot.mjs login        # 특정 기능 테스트
 *   node scripts/test-bot.mjs              # 전체 테스트
 *   node scripts/test-bot.mjs --changed    # git 변경분만
 *   node scripts/test-bot.mjs --list       # doc ↔ spec 매핑 현황
 */

import { execSync, spawnSync } from 'child_process'
import { readdirSync, existsSync } from 'fs'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')

const args = process.argv.slice(2)
const isChanged = args.includes('--changed')
const isList = args.includes('--list')
const feature = args.find(a => !a.startsWith('--'))

// --list: doc ↔ spec 매핑 현황
if (isList) {
  const docDir = join(ROOT, 'doc')
  const specDir = join(ROOT, 'tests', 'e2e')
  const docs = existsSync(docDir)
    ? readdirSync(docDir).filter(f => f.endsWith('.md') && !f.startsWith('_'))
    : []

  console.log('\n📋 doc ↔ spec 매핑 현황\n')
  console.log('Feature'.padEnd(30) + 'doc' .padEnd(8) + 'spec')
  console.log('-'.repeat(50))
  for (const doc of docs) {
    const name = basename(doc, '.md')
    const hasSpec = existsSync(join(specDir, `${name}.spec.ts`))
    console.log(name.padEnd(30) + '✅'.padEnd(8) + (hasSpec ? '✅' : '❌'))
  }
  process.exit(0)
}

// --changed: git 변경 파일에서 feature 추출
let targets = []
if (isChanged) {
  try {
    const changed = execSync('git diff --name-only HEAD', { cwd: ROOT }).toString().trim()
    targets = changed
      .split('\n')
      .filter(f => f.match(/apps\/web\/doc\/[^_][^/]*\.md$/))
      .map(f => basename(f, '.md'))
  } catch {
    console.error('git diff 실패')
    process.exit(1)
  }
} else if (feature) {
  targets = [feature]
} else {
  // 전체 spec 파일 실행
  targets = []
}

const playwrightArgs = ['playwright', 'test']

if (targets.length > 0) {
  // 특정 spec 파일만 실행
  const specFiles = targets.map(t => `tests/e2e/${t}.spec.ts`)
  playwrightArgs.push(...specFiles)
}

const result = spawnSync('npx', playwrightArgs, {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env },
})

process.exit(result.status ?? 1)
