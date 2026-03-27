/**
 * 育兒智多星 — 資料庫初始化腳本
 *
 * 用法:
 *   npm run db:setup
 *
 * 環境變數 (放在 .env.local 或直接 export):
 *   SUPABASE_DB_URL  - 直接 PostgreSQL 連線 URL
 *                      格式: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
 *   (備用) 若無 SUPABASE_DB_URL，需設定:
 *   NEXT_PUBLIC_SUPABASE_URL        - Supabase 專案 URL
 *   SUPABASE_SERVICE_ROLE_KEY       - Service Role Key (不是 anon key)
 *
 * 執行順序:
 *   1. 套用 supabase/migrations/001_initial_schema.sql (建表 + RLS + Functions)
 *   2. 填入 supabase/seed.sql (景點 + 幼兒園 seed 資料)
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Client } from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// ── 載入環境變數 ──────────────────────────────────────────────
// Next.js 的 .env.local 在腳本中不會自動載入，嘗試手動載入
try {
  const { config } = await import('dotenv')
  config({ path: join(ROOT, '.env.local') })
  config({ path: join(ROOT, '.env') })
} catch {
  // dotenv 不在依賴中時忽略，直接使用 process.env
}

function getDbUrl(): string {
  if (process.env.SUPABASE_DB_URL) return process.env.SUPABASE_DB_URL

  // 嘗試從 Supabase URL 推導
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    console.error('❌ 需要設定 SUPABASE_DB_URL 或 NEXT_PUBLIC_SUPABASE_URL')
    console.error('   SUPABASE_DB_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres')
    process.exit(1)
  }

  // 從 https://[project-ref].supabase.co 提取 project-ref
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)
  if (!match) {
    console.error('❌ 無法解析 NEXT_PUBLIC_SUPABASE_URL 中的 project ref')
    process.exit(1)
  }

  const dbPassword = process.env.SUPABASE_DB_PASSWORD
  if (!dbPassword) {
    console.error('❌ 需要設定 SUPABASE_DB_PASSWORD（Supabase 後台 > Project Settings > Database > Password）')
    process.exit(1)
  }

  const projectRef = match[1]
  return `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`
}

async function executeSQL(client: Client, sql: string, label: string) {
  console.log(`\n⏳ ${label}...`)

  // 分割 SQL 語句 (以 ; 結尾，忽略空白行)
  // 保留 $$ 函數體中的分號
  const statements = splitSQLStatements(sql)

  let successCount = 0
  let skipCount = 0

  for (const stmt of statements) {
    const trimmed = stmt.trim()
    if (!trimmed || trimmed.startsWith('--')) {
      skipCount++
      continue
    }

    try {
      await client.query(trimmed)
      successCount++
    } catch (err: unknown) {
      const pgErr = err as { code?: string; message?: string }
      // 忽略「已存在」的錯誤 (42P07 = duplicate table, 42723 = duplicate function, etc.)
      if (pgErr.code && ['42P07', '42723', '42710', '23505'].includes(pgErr.code)) {
        skipCount++
      } else {
        console.error(`  ⚠️  SQL 錯誤 (${pgErr.code}): ${pgErr.message}`)
        console.error(`     語句: ${trimmed.slice(0, 100)}...`)
      }
    }
  }

  console.log(`  ✅ 完成: ${successCount} 成功 / ${skipCount} 已存在/略過`)
}

/**
 * 智慧分割 SQL — 正確處理 $$ 包裹的函數體
 */
function splitSQLStatements(sql: string): string[] {
  const statements: string[] = []
  let current = ''
  let inDollarQuote = false
  let dollarTag = ''

  const lines = sql.split('\n')

  for (const line of lines) {
    const trimmedLine = line.trim()

    // 偵測 $$ 或 $tag$ 的開始/結束
    if (!inDollarQuote) {
      const match = trimmedLine.match(/(\$[^$]*\$)/)
      if (match) {
        inDollarQuote = true
        dollarTag = match[1]
      }
    } else if (trimmedLine.includes(dollarTag)) {
      inDollarQuote = false
      dollarTag = ''
    }

    current += line + '\n'

    // 若不在 dollar-quote 中，且行以 ; 結尾 → 切割
    if (!inDollarQuote && trimmedLine.endsWith(';')) {
      statements.push(current.trim())
      current = ''
    }
  }

  if (current.trim()) statements.push(current.trim())

  return statements
}

async function main() {
  console.log('🚀 育兒智多星 — 資料庫初始化')
  console.log('='.repeat(50))

  const dbUrl = getDbUrl()
  const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':***@')
  console.log(`🔗 連線至: ${maskedUrl}`)

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } })

  try {
    await client.connect()
    console.log('✅ 資料庫連線成功')

    // Step 1: 套用 Schema
    const schemaPath = join(ROOT, 'supabase', 'migrations', '001_initial_schema.sql')
    const schemaSql = readFileSync(schemaPath, 'utf-8')
    await executeSQL(client, schemaSql, '套用 Schema (建表 + RLS + Functions)')

    // Step 2: 填入 Seed 資料
    const seedPath = join(ROOT, 'supabase', 'seed.sql')
    const seedSql = readFileSync(seedPath, 'utf-8')
    await executeSQL(client, seedSql, '填入 Seed 資料 (景點 + 幼兒園)')

    console.log('\n🎉 資料庫初始化完成！')
    console.log('   你現在可以執行 npm run dev 啟動應用程式')
  } catch (err) {
    console.error('\n❌ 初始化失敗:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
