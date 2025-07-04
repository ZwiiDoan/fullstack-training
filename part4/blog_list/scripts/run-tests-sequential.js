// scripts/run-tests-sequential.js
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const testDir = path.join(__dirname, '../tests')
const testFiles = fs.readdirSync(testDir)
  .filter(f => f.endsWith('.test.js'))
  .map(f => path.join(testDir, f))
  .sort()

for (const file of testFiles) {
  console.log(`\nRunning: ${file}`)
  const result = spawnSync('node', ['--test', file], { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'test' } })
  if (result.status !== 0) {
    process.exit(result.status)
  }
}
