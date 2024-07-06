/* eslint-disable prettier/prettier */
import { safeStorage } from 'electron'
import { promises as fs } from 'node:fs'

const DATA_FILE = 'data'

const isEncryptionAvailable = (): boolean => {
  const available = safeStorage.isEncryptionAvailable()
  if (!available) {
    console.error('Encryption is not available')
  }
  return available
}

const readData = async (): Promise<Record<string, string>> => {
  try {
    const encryptedData = await fs.readFile(DATA_FILE)
    const decryptedString = safeStorage.decryptString(encryptedData)
    return JSON.parse(decryptedString)
  } catch (error) {
    console.log('No data found or failed to read data')
    return {}
  }
}

const writeData = async (data: Record<string, string>): Promise<void> => {
  try {
    const dataString = JSON.stringify(data)
    const encryptedData = safeStorage.encryptString(dataString)
    await fs.writeFile(DATA_FILE, encryptedData)
  } catch (error) {
    console.error('Failed to encrypt and write data:', error)
  }
}

const saveData = async (key: string, data: string): Promise<void> => {
  if (!isEncryptionAvailable()) {
    return
  }

  const oldData = await readData()
  const newData = { ...oldData, [key]: data }

  await writeData(newData)
}

export { saveData, readData }
