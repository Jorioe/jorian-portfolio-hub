# Supabase Database Setup voor Projectbeheer

Deze handleiding legt uit hoe je de Supabase database kunt instellen voor projectbeheer en mediabibliotheek in je portfolio website.

## 1. Tabel Aanmaken

1. Log in op je [Supabase Dashboard](https://app.supabase.com/)
2. Navigeer naar het project dat je gebruikt voor je portfolio
3. Ga naar "Table Editor" in het linker menu
4. Klik op "New Table"
5. Vul de volgende gegevens in:
   - **Name**: `projects`
   - **Enable Row Level Security (RLS)**: Aangevinkt
   - **Columns**:
     | Name | Type | Default Value | Primary | Nullable |
     |------|------|--------------|---------|----------|
     | id | uuid | `uuid_generate_v4()` | ✓ | ❌ |
     | title | text | - | ❌ | ❌ |
     | description | text | - | ❌ | ❌ |
     | image | text | - | ❌ | ❌ |
     | categories | text[] | - | ❌ | ❌ |
     | date | text | - | ❌ | ❌ |
     | content | jsonb | - | ❌ | ❌ |
     | aditionalContent | text | - | ❌ | ✓ |
     | imgtext | text | - | ❌ | ✓ |
     | imgtext2 | text | - | ❌ | ✓ |
     | subtitle | text | - | ❌ | ✓ |
     | technologies | text[] | - | ❌ | ✓ |
     | githubLink | text | - | ❌ | ✓ |
     | instagramLink | text | - | ❌ | ✓ |
     | demoLink | text | - | ❌ | ✓ |
     | skills | text[] | - | ❌ | ✓ |
     | created_at | timestamp with time zone | `now()` | ❌ | ✓ |
6. Klik op "Save" om de tabel aan te maken

## 2. Storage Bucket Aanmaken voor Media

1. Ga naar "Storage" in het linkermenu van je Supabase Dashboard
2. Klik op "New Bucket"
3. Vul de volgende gegevens in:
   - **Name**: `media` (let op: dit moet overeenkomen met de `STORAGE_BUCKET` constante in je code)
   - **Public bucket**: Aangevinkt (zodat media-bestanden publiek toegankelijk zijn)
   - **Allow file size uploads up to**: 50MB
4. Klik op "Create bucket"

## 3. Row Level Security (RLS) Policies Instellen

Om te zorgen dat alleen geauthenticeerde admins projecten kunnen wijzigen:

1. Ga naar de "Authentication" pagina in je Supabase Dashboard
2. Klik op "Policies" in het linkermenu
3. Klik op "New Policy" voor de `projects` tabel
4. Maak de volgende policies:

### Voor leesrechten (voor iedereen)
1. Kies "Create a policy from scratch"
2. **Policy name**: `Allow public read`
3. **Target roles**: `authenticated`, `anon`
4. **Using expression**: `true`
5. **Check operation**: `SELECT`

### Voor schrijfrechten (alleen admins)
1. Kies "Create a policy from scratch"
2. **Policy name**: `Allow admin write`  
3. **Target roles**: `authenticated`
4. **Using expression**: `(SELECT is_admin FROM auth.users WHERE auth.users.id = auth.uid())`
5. **Check operations**: `INSERT`, `UPDATE`, `DELETE`

> Let op: De expressie gaat ervan uit dat je gebruikerstabel een kolom `is_admin` heeft. Als je dit niet hebt, zul je een andere RLS policy moeten bedenken of een administratorrol toevoegen aan je gebruikers.

## 4. Storage Policies Instellen

Om toegang tot de media-bestanden te regelen:

1. Ga naar "Storage" in het linkermenu
2. Selecteer de `media` bucket
3. Klik op "Policies" tab
4. Maak de volgende policies:

### Voor leesrechten (voor iedereen)
1. Klik op "New policy"
2. Kies "Create a policy from scratch" 
3. **Policy name**: `Allow public read`
4. **Target roles**: `authenticated`, `anon`
5. **Using expression**: `true`
6. **Definition**: Selecteer "Select" om alleen leesrechten toe te staan
7. Klik op "Save policy"

### Voor schrijfrechten (alleen voor geauthenticeerde gebruikers)
1. Klik op "New policy"
2. Kies "Create a policy from scratch"
3. **Policy name**: `Allow authenticated upload`
4. **Target roles**: `authenticated`
5. **Using expression**: `true` (of gebruik dezelfde admin conditie als hierboven voor striktere toegang)
6. **Definition**: Selecteer "Insert", "Update", "Delete" om schrijfoperaties toe te staan
7. Klik op "Save policy"

## 5. Aanpassingen in de App

1. Zorg dat je `.env.local` bestand de volgende variabelen bevat:
   ```
   VITE_SUPABASE_URL=je_supabase_url
   VITE_SUPABASE_ANON_KEY=je_supabase_anon_key
   ```

2. Start je ontwikkelserver en ga naar het admin dashboard

3. Klik op de "Migreer naar Database" knop als je bestaande projecten hebt in localStorage die je wilt overzetten

4. Ga naar de Media Bibliotheek en klik op "Migreer naar Supabase" om je media te migreren van localStorage naar Supabase Storage

## Problemen Oplossen

### Project types voldoen niet aan het schema
Als je projectstructuur niet exact overeenkomt met wat in de database is gedefinieerd, pas dan het schema aan of update je projectobjecten voordat je ze opslaat.

### Oneindige lading bij projecten laden
Dit kan gebeuren als je RLS policies niet correct zijn ingesteld. Controleer de browser console voor foutmeldingen en pas indien nodig de policies aan.

### CORS fouten
Als je CORS-fouten krijgt, controleer dan de instellingen in je Supabase dashboard onder "API" -> "Settings" en voeg je website URL toe aan de toegestane oorsprongen.

### Media uploads werken niet
Controleer de volgende punten:
1. Zorg dat de bucket naam in de code (`STORAGE_BUCKET` constante) overeenkomt met de naam in Supabase
2. Controleer of je bucket publiek is ingesteld voor publieke toegang tot media
3. Zorg dat je storage policies correct zijn ingesteld
4. Controleer in je browser console of er geen CORS-fouten zijn bij uploads 