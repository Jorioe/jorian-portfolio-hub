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

## 1.2 Home Content Tabel Aanmaken

Maak een tabel aan voor de inhoud van de homepagina:

1. Klik op "New Table" in de Table Editor
2. Vul de volgende gegevens in:
   - **Name**: `home_content`
   - **Enable Row Level Security (RLS)**: Aangevinkt
   - **Columns**:
     | Name | Type | Default Value | Primary | Nullable |
     |------|------|--------------|---------|----------|
     | id | uuid | `uuid_generate_v4()` | ✓ | ❌ |
     | heroTitle | text | - | ❌ | ✓ |
     | heroSubtitle | text | - | ❌ | ✓ |
     | heroImage | text | - | ❌ | ✓ |
     | aboutTitle | text | - | ❌ | ✓ |
     | aboutText1 | text | - | ❌ | ✓ |
     | aboutText2 | text | - | ❌ | ✓ |
     | aboutText3 | text | - | ❌ | ✓ |
     | aboutImage | text | - | ❌ | ✓ |
     | ctaTitle | text | - | ❌ | ✓ |
     | ctaText | text | - | ❌ | ✓ |
     | featuredProjects | text | - | ❌ | ✓ |
     | featuredProjectsTitle | text | - | ❌ | ✓ |
     | featuredProjectsSubtitle | text | - | ❌ | ✓ |
     | skillsTitle | text | - | ❌ | ✓ |
     | skillsItems | text | - | ❌ | ✓ |
     | footerLinks | text | - | ❌ | ✓ |
     | created_at | timestamp with time zone | `now()` | ❌ | ✓ |
     | updated_at | timestamp with time zone | `now()` | ❌ | ✓ |
3. Klik op "Save" om de tabel aan te maken

## 1.3 Contact Messages Tabel Aanmaken

Maak een tabel aan voor contactberichten:

1. Klik op "New Table" in de Table Editor
2. Vul de volgende gegevens in:
   - **Name**: `contact_messages`
   - **Enable Row Level Security (RLS)**: Aangevinkt
   - **Columns**:
     | Name | Type | Default Value | Primary | Nullable |
     |------|------|--------------|---------|----------|
     | id | uuid | `uuid_generate_v4()` | ✓ | ❌ |
     | name | text | - | ❌ | ❌ |
     | email | text | - | ❌ | ❌ |
     | subject | text | - | ❌ | ❌ |
     | message | text | - | ❌ | ❌ |
     | date | text | - | ❌ | ❌ |
     | isRead | boolean | `false` | ❌ | ❌ |
     | created_at | timestamp with time zone | `now()` | ❌ | ✓ |
3. Klik op "Save" om de tabel aan te maken

## 1.4 Contact Info Tabel Aanmaken

Maak een tabel aan voor contactinformatie en social links:

1. Klik op "New Table" in de Table Editor
2. Vul de volgende gegevens in:
   - **Name**: `contact_info`
   - **Enable Row Level Security (RLS)**: Aangevinkt
   - **Columns**:
     | Name | Type | Default Value | Primary | Nullable |
     |------|------|--------------|---------|----------|
     | id | uuid | `uuid_generate_v4()` | ✓ | ❌ |
     | email | text | - | ❌ | ✓ |
     | phone | text | - | ❌ | ✓ |
     | location | text | - | ❌ | ✓ |
     | socialLinks | text | - | ❌ | ✓ |
     | created_at | timestamp with time zone | `now()` | ❌ | ✓ |
     | updated_at | timestamp with time zone | `now()` | ❌ | ✓ |
3. Klik op "Save" om de tabel aan te maken

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

## 3.1 RLS Policies voor Home Content

Stel de volgende policies in voor de `home_content` tabel:

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

## 3.2 RLS Policies voor Contact Messages

Stel de volgende policies in voor de `contact_messages` tabel:

### Voor leesrechten (alleen admins)
1. Kies "Create a policy from scratch"
2. **Policy name**: `Allow admin read`
3. **Target roles**: `authenticated`
4. **Using expression**: `(SELECT is_admin FROM auth.users WHERE auth.users.id = auth.uid())`
5. **Check operation**: `SELECT`

### Voor schrijfrechten (publiek, alleen invoegen)
1. Kies "Create a policy from scratch"
2. **Policy name**: `Allow public insert` 
3. **Target roles**: `authenticated`, `anon`
4. **Using expression**: `true`
5. **Check operation**: `INSERT`

### Voor schrijfrechten (alleen admins, update en delete)
1. Kies "Create a policy from scratch"
2. **Policy name**: `Allow admin update delete`
3. **Target roles**: `authenticated`
4. **Using expression**: `(SELECT is_admin FROM auth.users WHERE auth.users.id = auth.uid())`
5. **Check operations**: `UPDATE`, `DELETE`

## 3.3 RLS Policies voor Contact Info

Stel de volgende policies in voor de `contact_info` tabel:

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

5. Ga naar de Homepagina Editor en klik op "Migreer naar Database" om de homepagina content te migreren naar Supabase

6. Ga naar de Contactberichten pagina en klik op "Migreer naar Database" om de contactberichten te migreren naar Supabase

## 6. Migratie van localStorage naar Database

De applicatie ondersteunt een geleidelijke migratie van localStorage naar de Supabase database. Voor elke type data is er een aparte migratiefunctie:

### 6.1 Projecten Migreren

1. Ga naar het Admin Dashboard
2. Klik op de "Migreer naar Database" knop
3. Dit zal alle projecten uit localStorage overzetten naar de `projects` tabel in Supabase
4. Na succesvolle migratie wordt de lokale opslag voor projecten gewist

### 6.2 Homepagina Content Migreren

1. Ga naar de Homepagina Editor via het Admin Dashboard
2. Klik op de "Migreer naar Database" knop
3. Dit zal de homepagina content uit localStorage overzetten naar de `home_content` tabel in Supabase
4. Na succesvolle migratie wordt de lokale opslag voor homepagina content gewist

### 6.3 Contactberichten Migreren

1. Ga naar de Contactberichten pagina via het Admin Dashboard
2. Klik op de "Migreer naar Database" knop
3. Dit zal alle contactberichten uit localStorage overzetten naar de `contact_messages` tabel in Supabase
4. Na succesvolle migratie wordt de lokale opslag voor contactberichten gewist

### 6.4 Media Bibliotheek Migreren

1. Ga naar de Media Bibliotheek via het Admin Dashboard
2. Klik op de "Migreer naar Supabase" knop (indien beschikbaar)
3. Dit zal alle media bestanden uit localStorage overzetten naar de Supabase Storage bucket
4. Na succesvolle migratie wordt de lokale opslag voor media items gewist

### 6.5 Contactinformatie Migreren

1. Ga naar de Contactinformatie pagina via het Admin Dashboard
2. Klik op de "Migreer naar Database" knop (indien beschikbaar)
3. Dit zal de contactgegevens en social links uit localStorage overzetten naar de `contact_info` tabel in Supabase
4. Na succesvolle migratie wordt de lokale opslag voor contactinformatie gewist

### Fallback mechanisme

De applicatie bevat een fallback mechanisme dat automatisch localStorage gebruikt wanneer:
- De database niet bereikbaar is
- Er een fout optreedt bij het benaderen van de database
- De gebruiker geen internetverbinding heeft

Dit zorgt ervoor dat de applicatie blijft functioneren, zelfs als er problemen zijn met de database verbinding.aarom

## 7. Problemen Oplossen

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

## 7. Project Zichtbaarheid Feature

Om projecten te kunnen verbergen van de website zonder ze te verwijderen, moet je een `hidden` kolom toevoegen aan de `projects` tabel in Supabase:

1. Log in op je [Supabase Dashboard](https://app.supabase.com/)
2. Navigeer naar het project dat je gebruikt voor je portfolio
3. Ga naar "Table Editor" in het linker menu
4. Selecteer de `projects` tabel
5. Klik op "Edit table" (potlood icoontje)
6. Klik op "Add column"
7. Vul de volgende gegevens in:
   - **Name**: `hidden`
   - **Type**: `boolean`
   - **Default Value**: `false` 
   - **Primary**: ❌
   - **Nullable**: ✓ (optioneel)
8. Klik op "Save" om de kolom toe te voegen

Na het toevoegen van deze kolom kun je projecten verbergen en weer zichtbaar maken via het oogje-icoontje in het admin dashboard. Verborgen projecten worden niet getoond op de publieke projectenpagina. 