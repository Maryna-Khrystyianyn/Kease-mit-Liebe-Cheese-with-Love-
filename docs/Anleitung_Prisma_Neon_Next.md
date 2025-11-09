## Anleitung: Verbindung von Prisma mit Neon in Next.js

### Installation von Prisma
npm install prisma --save-dev
npm install @prisma/client

### Initialisierung von Prisma
npx prisma init

#### Dabei werden folgende Dateien erstellt:
• prisma/schema.prisma
• .env – enthält die Variable DATABASE_URL

### Verbindung mit einer bestehenden Datenbank in Neon
Die Datenbank in Neon wurde bereits erstellt.
Die DATABASE_URL wurde aus Vercel  kopiert.

**Wichtig**: Wenn der URL Sonderzeichen enthält, muss er in Anführungszeichen stehen:
DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"
 
#### Prisma Pull & Generate

npx prisma db pull     # Bestehendes Datenbankschema abrufen
npx prisma generate    # Prisma Client generieren

#### Zuerst hat es nicht funktioniert, da Prisma die .env-Datei nicht gefunden hat.

DATABASE_URL="postgresql://neondb_owner:****************@ep-late-unit-agcvufqx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require" npx prisma db pull –schema=./prisma/schema.prisma
DATABASE_URL="postgresql://neondb_owner:****************@ep-late-unit-agcvufqx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require" npx prisma generate

Das Problem wurde durch den Import von dotenv in der Konfiguration gelöst:
import dotenv from 'dotenv'
dotenv.config()

### Erstellen von lib/prisma.ts
Im Projektstamm wurde ein Ordner lib erstellt.
Darin befindet sich die Datei prisma.ts, um einen globalen Prisma-Client zu definieren:

``` import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
globalForPrisma.prisma || new PrismaClient({ log: ["query"] });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 
```

#### Test-API-Endpoint
Ordner und Datei erstellt:
app/api/test/route.ts
Code zum Testen der Verbindung:
```
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
try {
const result = await prisma.$queryRaw`SELECT NOW();`
return NextResponse.json({ success: true, data: result })
} catch (error) {
console.error('Database connection error:', error)
return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
}
}
```

Im Browser geöffnet:
http://localhost:3000/api/test
Ergebnis:
{ "success": true, "data": ... }
✅ Prisma ist erfolgreich verbunden.

#### Zusammenfassung
• Prisma wurde erfolgreich mit Neon verbunden
• .env funktioniert korrekt
• lib/prisma.ts stellt sicher, dass nur eine Prisma-Client-Instanz existiert
• Der API-Endpoint bestätigt, dass die Datenbank antwortet
