# 🍯 Honey SRM - Supplier Relationship Management System

Ett komplett SRM-system för honungsleverantörer åt Swedish Bee Company, byggt med Next.js, TypeScript, Tailwind CSS och Supabase.

## Funktioner

- ✅ **Autentisering**: Inloggning och registrering via Supabase Auth
- ✅ **Leverantörslista**: Sök och filtrera leverantörer efter status och kategori
- ✅ **Leverantörsdetaljer**: Visa och hantera:
  - Kontakthistorik med möjlighet att lägga till nya kontakter
  - Uppföljningsdatum
  - Supply Opportunities
  - Leveranser
- ✅ **Dashboard**: KPI:er och lista på leverantörer som behöver följas upp inom 14 dagar
- ✅ **Responsiv design**: Fungerar på desktop och mobil

## Teknologi Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL, Authentication)
- **Real-time**: Supabase Real-time updates (kan konfigureras)

## Installation

### 1. Installera beroenden

```bash
npm install
```

### 2. Konfigurera Supabase

#### a) Skapa Supabase-projekt
1. Gå till [Supabase](https://supabase.com)
2. Skapa ett nytt projekt
3. Kopiera Project URL och Anon Key från Settings → API

#### b) Kör SQL-schemat
1. Gå till SQL Editor i Supabase
2. Öppna filen `supabase-schema.sql`
3. Kopiera hela innehållet och kör det i SQL Editor

### 3. Sätt upp miljövaribler

Skapa `.env.local`-fil (kopiera från `.env.local.example`):

```bash
cp .env.local.example .env.local
```

Uppdatera värdena med dina Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

### 4. Starta utvecklingsserver

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Struktur

```
src/
├── app/
│   ├── layout.tsx              # Root layout med Auth provider
│   ├── page.tsx                # Redirect till login/dashboard
│   ├── login/
│   │   └── page.tsx            # Inloggnings- och registreringssida
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard med KPI:er
│   └── suppliers/
│       ├── page.tsx            # Leverantörslista
│       └── [id]/
│           └── page.tsx        # Leverantörsdetalj
├── components/
│   ├── navigation.tsx          # Navigationsmeny
│   └── protected-route.tsx     # Skyddad rutt-komponent
└── lib/
    ├── supabase.ts            # Supabase-klient och types
    └── auth-context.tsx       # Auth context för React
```

## Funktionalitet

### Dashboard

Visar följande KPI:er:
- 👥 Antal aktiva leverantörer
- 📈 Pipeline-volym (summa av open opportunities)
- 📦 Levererad volym (senaste 12 månader)

Listan under visar alla leverantörer som behöver följas upp inom 14 dagar (baserat på `follow_up_date` från senaste kontakthistorik).

### Leverantörslista

- Sök efter namn, företag eller email
- Filtrera efter status (Aktiv, Inaktiv, Prospect)
- Filtrera efter kategori
- Visar totalt antal leverantörer

### Leverantörsdetaljer

Visar och hanterar:
- **Kontaktuppgifter**: Email, telefon, plats, kategori
- **Avtalsdetaljer**: Status, årlig volym, avtalsperiod
- **Kontakthistorik**: Lista över alla kontakter med möjlighet att lägga till nya
- **Supply Opportunities**: Lista över möjligheter
- **Leveranser**: Historia över alla leveranser

#### Lägg till kontakt

1. Klicka på "+ Ny Kontakt" på leverantörsdetaljsidan
2. Välj kontakttyp (Möte, Samtal, Email, Övrigt)
3. Lägg till anteckningar
4. Sätt uppföljningsdatum (valfritt)
5. Spara

## Databas-schema

### Tabeller

#### `suppliers`
Grundinformation om leverantörer
- `id`: UUID (primary key)
- `name`: Leverantörens namn
- `company_name`: Företagsnamn
- `email`: E-postadress
- `phone`: Telefonnummer
- `location`: Plats
- `category`: Kategori
- `status`: aktiv/inactive/prospect
- `annual_volume`: År leveransar volym
- `contract_start_date`: Avtalsstart
- `contract_end_date`: Avtalsslut
- `notes`: Anteckningar

#### `contact_history`
Kontakthistorik per leverantör
- `id`: UUID (primary key)
- `supplier_id`: Referens till suppliers
- `contact_date`: Kontaktdatum
- `follow_up_date`: Uppföljningsdatum
- `contact_type`: Kontakttyp (meeting/call/email/other)
- `notes`: Anteckningar

#### `supply_opportunities`
Möjligheter för leveranser
- `id`: UUID (primary key)
- `supplier_id`: Referens till suppliers
- `opportunity_date`: Möjlighetsdatum
- `description`: Beskrivning
- `estimated_volume`: Beräknad volym
- `estimated_value`: Beräknadvärde
- `status`: Status (open/closed)

#### `deliveries`
Leveranshistorik
- `id`: UUID (primary key)
- `supplier_id`: Referens till suppliers
- `delivery_date`: Leveransdatum
- `quantity`: Kvantitet
- `unit`: Enhet
- `price`: Pris
- `notes`: Anteckningar

## Sekuritet

- Row Level Security (RLS) är aktiverat för alla tabeller
- Endast autentiserade användare kan komma åt data
- Sessioner hanteras automatiskt via Supabase Auth

## Framtida förbättringar

- [ ] Excel-export av leverantörer och data
- [ ] Kalender-vy för uppföljningsdatum
- [ ] E-postnotifikationer för uppföljningsdatum
- [ ] Analysrapporter och trender
- [ ] API-integrationer med andra system
- [ ] Massvyrkörtningar för leverantörer

## Licens

Private use for Swedish Bee Company
