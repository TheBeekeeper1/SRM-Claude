# 🚀 Honey SRM - Quick Start Guide

## 5 Minuter för att komma igång

### Steg 1: Installera beroenden

#### Windows:
```powershell
npm install
```

#### macOS/Linux:
```bash
npm install
```

### Steg 2: Sätt upp Supabase

1. Gå till [https://supabase.com](https://supabase.com)
2. Logga in eller skapa konto
3. Klicka "New Project"
4. Fyll i:
   - Project name: `honey-srm`
   - Database password: Spara detta någonstans säkert!
   - Region: Välj närmaste region (t.ex. eu-west-1 för Stockholm)
5. Klicka "Create new project" och vänta ~2 minuter

### Steg 3: Skapa databasschemat

1. I Supabase-konsolen, gå till **SQL Editor**
2. Öppna `supabase-schema.sql` filen i denna repo
3. Kopiera hela innehållet
4. Klistra in i SQL Editor i Supabase
5. Klicka "Run" eller `Ctrl+Enter`

### Steg 4: Hämta API-nycklar

1. I Supabase, gå till **Settings** → **API**
2. Kopiera följande:
   - **Project URL** (under "Project credentials")
   - **anon** public key (under "Project API keys")

### Steg 5: Konfigurera miljövaribler

1. Kopera `env.local.example` till `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Öppna `.env.local` och uppdatera:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   ```

### Steg 6: Starta development server

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare

### Steg 7: Skapa användare och logga in

1. Du redirect till login-sidan
2. Klicka "Ny medlem? Registrera"
3. Fyll i email och lösenord
4. Klicka "Registrera"
5. Du loggcas in automatiskt och ser Dashboard

## 🎉 Det är klart!

Du har nu ett fullständigt SRM-system för honungsleverantörer!

### Nästa steg:

- Lägg till leverantörer via Supabase eller import från CSV
- Testa olika funktioner på Dashboard
- Utforska leverantörslista och detalj-sidorna
- Lägg till kontakthistorik för leverantörer

## 🆘 Felsökning

### "Cannot find module '@supabase/supabase-js'"
- Kör `npm install` igen
- Kontrollera att `node_modules` mappen existerar

### "Missing Supabase environment variables"
- Kontrollera `.env.local` filen
- Verifiera att `NEXT_PUBLIC_SUPABASE_URL` och `NEXT_PUBLIC_SUPABASE_ANON_KEY` är satta korrekt
- Starta om dev-server efter ändringar i `.env.local`

### "Port 3000 is already in use"
- Starta på annan port: `npm run dev -- -p 3001`

### Authentication fails
- Verifiera att du har kört SQL-schemat
- Kontrollera att Supabase Auth är aktiverat (Settings → Auth Providers)
- Verifiera mail-inställningar i Supabase

## 📖 Mer information

Se [SETUP.md](./SETUP.md) för detaljerad dokumentation.
