import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createSeedData } from './seed'
import type { CMSData } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'cms.json')

async function ensureDataFile() {
  try {
    await readFile(DATA_FILE, 'utf8')
  } catch {
    await mkdir(DATA_DIR, { recursive: true })
    await writeFile(DATA_FILE, JSON.stringify(createSeedData(), null, 2), 'utf8')
  }
}

export async function readCMSData(): Promise<CMSData> {
  await ensureDataFile()
  const raw = await readFile(DATA_FILE, 'utf8')
  return JSON.parse(raw) as CMSData
}

export async function writeCMSData(data: CMSData) {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}
