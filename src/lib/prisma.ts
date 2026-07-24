import { PrismaClient } from '../../prisma/generated/client/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'
const absoluteUrl = dbUrl.startsWith('file:./') 
  ? `file:${path.join(process.cwd(), dbUrl.replace('file:./', ''))}`
  : dbUrl

const adapter = new PrismaLibSql({
  url: absoluteUrl,
})

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
