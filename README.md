# 🍯 Honey SRM

**Supplier Relationship Management System för Swedish Bee Company**

Ett fullständigt SRM-system för att hantera honungsleverantörer, kontakthistorik, supply opportunities och leveranser.

## ✨ Funktioner

- 🔐 **Säker autentisering** via Supabase Auth
- 📊 **Dashboard** med KPI:er och övervakning av uppföljningsdatum
- 🔍 **Leverantörslista** med sökning och avancerad filtrering
- 📋 **Leverantörsdetaljer** med kontakthistorik, opportunities och leveranser
- 📈 **Realtids-uppdateringar** av data
- 📱 **Responsiv design** för Desktop, Tablet och Mobile

## 🚀 Snabbstart

Se [QUICKSTART.md](./QUICKSTART.md) för steg-för-steg instruktioner.

```bash
npm install
npm run dev
# Öppna http://localhost:3000
```

## 📚 Dokumentation

- **[QUICKSTART.md](./QUICKSTART.md)** - 5 minuter för att komma igång
- **[SETUP.md](./SETUP.md)** - Detaljerad installations- och konfigurationsguide
- **[DATABASE_NOTES.md](./DATABASE_NOTES.md)** - Databasreferens och queries

## 🛠️ Teknologi

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL + Auth)
- date-fns för datumhantering

## 📦 Installation

1. `npm install`
2. Skapa Supabase-projekt och kör `supabase-schema.sql`
3. `cp .env.local.example .env.local` och uppdatera credentials
4. `npm run dev`

## 🎯 Funktion

### Dashboard
- Visa KPI:er (leverantörer, pipeline, levererad volym)
- Lista leverantörer som behöver följas upp inom 14 dagar

### Leverantörer
- Sök och filtrera
- Se detaljrad information
- Hantera kontakthistorik

### Kontakthantering
- Lägg till kontakter
- Sätt uppföljningsdatum
- Se historik

## 📝 Licens

Privat för Swedish Bee Company
