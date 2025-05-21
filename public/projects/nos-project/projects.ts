export type CategoryType = "development" | "design" | "research" | "data" | "rest";

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  categories: CategoryType[];
  date: string;
  content: Array<{
    type:
      | "text"
      | "break"
      | "subtitle"
      | "small-subtitle"
      | "quote-top"
      | "quote"
      | "quote-bottom"
      | "opsom-text-top"
      | "opsom-text"
      | "opsom-text-bottom"
      | "flex-text"
      | "image";
    content?: string;
    content2?: string;
    image?: string;
  }>;
  aditionalContent?: string;
  imgtext?: string;
  imgtext2?: string;
  subtitle?: string;
  technologies?: string[];
  githubLink?: string;
  instagramLink?: string;
  demoLink?: string;
  skills?: string[];
}

export const projects: Project[] = [
    {
      id: '2',
      title: 'Frostwave',
      description: 'Het organiseren van een eigen evenement',
      image: '/img/Frostwave-FB-bg.png',
      categories: [
        'research',
        'design',
        'data',
        'rest'
      ],
      date: 'Januari 2025',
      content: [
        {
          type: 'text',
          content: 'Op 10 januari 2025 vond de allereerste editie van Frostwave plaats in Club Verzo in Roosendaal. Dit evenement stond in het teken van rauwe energie en een herontdekking van subgenres binnen rawstyle.'
        },
        {
          type: 'subtitle',
          content: 'Doelgroep'
        },
        {
          type: 'bold-small-subtitle',
          content: 'Primaire doelgroep:'
        },
        {
          type: 'boldtexttop',
          content: 'Leeftijd:',
          aditionalContent: '16-25 jaar'
        },
        {
          type: 'boldtext',
          content: 'Locatie:',
          aditionalContent: 'Roosendaal en omliggende steden'
        },
        {
          type: 'boldtext',
          content: 'Interesses:',
          aditionalContent: 'Fans van rawstyle en aanverande hardstyle-evenementen'
        },
        {
          type: 'bold-small-subtitle',
          content: 'Secundaire doelgroep:'
        },
        {
          type: 'opsom-text-top',
          content: 'Gelegenheidsbezoekers die openstaan voor een unieke uitgaanservaring.'
        },
        {
          type: 'break',
          content: "'
        },
        {
          type: 'subtitle',
          content: 'USP'S'
        },
        {
          type: 'boldtexttop',
          content: 'Uniek concept:',
          aditionalContent: 'Subgenres die in de vergetelheid zijn geraakt worden opnieuw tot leven gebracht.'
        },
        {
          type: 'boldtext',
          content: 'Inclusiviteit:',
          aditionalContent: 'Het hele spectrum van rawstyle komt aan bod, van melodieus tot donker en rauw.'
        },
        {
          type: 'boldtext',
          content: 'Thema:',
          aditionalContent: 'Een winterse, mysterieuze sfeer gekoppeld aan de energieke kracht van rawstyle.'
        },
        {
          type: 'boldtext',
          content: 'Centrale locatie:',
          aditionalContent: 'Club Verzo, bekend in Roosendaal en goed bereikbaar.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Conceptueel plan'
        },
        {
          type: 'image',
          content: '/img/FW-concept.png'
        },
        {
          type: 'text',
          content: 'Voor de line-up hebben we gezocht naar artiesten die perfect aansluiten bij ons concept. We hebben ervoor gekozen om voor elk subgenre binnen raw hardstyle een artiest te boeken. Hiervoor hebben we een overzicht samengesteld met 70 artiesten en het bijbehorende subgenre dat zij draaien.'
        },
        {
          type: 'text',
          content: 'Uiteindelijk hebben we de volgende artiesten geboekt voor de verschillende subgenres:'
        },
        {
          type: 'image',
          content: '/img/FW-lineup.png'
        },
        {
          type: 'text',
          content: 'Het totale budget voor de line-up bedroeg 3000 euro, waarbij we ervoor hebben gekozen het grootste deel te investeren in twee grote artiesten. We hebben bewust gekozen voor The Saints, die al een tijdje in opkomst zijn en een hype creëren waarmee we zeker wisten dat we publiek zouden aantrekken. Daarnaast hebben we Vasto geboekt om extra bekendheid aan de line-up toe te voegen. Naast deze twee grote namen hebben we bewust gekozen voor twee wat kleinere artiesten en twee relatief onbekende artiesten.'
        },
        {
          type: 'text',
          content: 'Om nieuw talent een kans te geven, hebben we een DJ-contest georganiseerd. De winnaar van deze wedstrijd mocht het evenement openen, wat ideaal was gezien het vroege tijdstip en het beperkte publiek aan het begin. Bovendien trok dit extra publiek, aangezien deelnemers vaak vrienden en supporters meenemen. Na een selectie van vier finalisten hebben onze volgers via een stemronde bepaald wie de winnaar werd.'
        },
        {
          type: 'text',
          content: 'De line-up is bewust opgebouwd in chronologische volgorde, waarbij we zijn gestart met de oudere subgenres en overgingen naar de nieuwere stijlen. Hoewel we in eerste instantie een iets andere volgorde in gedachten hadden, hebben we rekening gehouden met de voorkeuren van de agency van een van de artiesten. Desondanks hebben we grotendeels vastgehouden aan de opbouw van oud naar nieuw, zodat het concept van evolutie binnen de raw hardstyle duidelijk naar voren komt. Tijdens het conversatie-event hebben we de artiesten en hun bijbehorende subgenres geïntroduceerd met interludes die werden afgespeeld voorafgaand aan hun optreden.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Marketingstrategie'
        },
        {
          type: 'small-subtitle',
          content: 'Owned Media'
        },
        {
          type: 'text',
          content: 'Voor de promotie van ons evenement zullen we dagelijks social media posts doen die ons evenement promoten. Om dit te realiseren maken we gebruik van een Instagram, TikTok en Facebook-pagina. TikTok zal voornamelijk gebruikt worden voor het opdoen van nieuwe volgers. De communicatiestijl op TikTok zal voornamelijk informeel zijn met een soms wat grappige insteek. TikTok zal voornamelijk gebruikt worden om merkbewustzijn te creëren.'
        },
        {
          type: 'text',
          content: 'Onze Instagram pagina zal formeler zijn, en meer informatief dan de TikTok pagina. Het hoofddoel van de Instagram-pagina is om zoveel mogelijk tickets te verkopen. We zullen hier ook gebruik maken van betaalde promotie met een verwijs link naar de ticketverkoop. Betaalde promotie zal in Reel, Story als Carousel formaat toegepast worden.'
        },
        {
          type: 'small-subtitle',
          content: 'Design en storytelling'
        },
        {
          type: 'text',
          content: 'Het design van onze owned media-content moet de koude sfeer van het winterseizoen uitstralen en tegelijkertijd de vergeten subgenres symboliseren die als het ware zijn vastgevroren. Deze elementen willen we tot leven brengen en laten ontdooien in onze visuele uitingen.'
        },
        {
          type: 'text',
          content: 'Voorbeelden praktische toepassingen op content: Bekendmaking line up: artiesten verwerken in een ijsblok als teaser, later onthullen we de artiest in een post waarin het ijs is gesmolten etc.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Zichtbaarheid vooraf'
        },
        {
          type: 'text',
          content: 'Er is vooraf uitgebreide zichtbaarheid gecreëerd voor Frostwave via een combinatie van owned, paid en earned media.'
        },
        {
          type: 'boldtext',
          content: 'Social media:',
          aditionalContent: 'Regelmatige posts, story-updates, en interactie met volgers op Instagram. De DJ-contest zorgde voor extra bereik en betrokkenheid.'
        },
        {
          type: 'image',
          content: '/img/FW-posts.png',
          imgtext: 'Posts Instagram',
          content2: '/img/FW-tiktoks.png',
          imgtext2: 'Posts TikTok'
        },
        {
          type: 'small-subtitle',
          content: 'Reels Instagram:'
        },
        {
          type: 'image',
          content: '/img/FW-reels.png'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'small-subtitle',
          content: 'Posters'
        },
        {
          type: 'text',
          content: 'We hebben poster verspreid op plekken waar we denken dat onze doelgroep veel is.'
        },
        {
          type: 'image',
          content: '/img/FW-poster-1.png',
          imgtext: 'Op school',
          content2: '/img/FW-poster-2.png',
          imgtext2: 'In de gym'
        },
        {
          type: 'image',
          content: '/img/FW-poster-3.png',
          imgtext: 'Buiten de club'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Earned Media'
        },
        {
          type: 'text',
          content: 'Artikelen en vermeldingen op relevante platforms in de hardstyle community. (Appic, Hardstyle.com, Partyflock, Ticketswap.)'
        },
        {
          type: 'image',
          content: '/img/FW-earned-1.png'
        },
        {
          type: 'text',
          content: 'Via verschillende kanalen is earned media gegenereerd. De DJ-contest deelnemers en influencers in de hardstyle-scene deelden het evenement spontaan met hun volgers, wat zorgde voor een organische boost in zichtbaarheid en geloofwaardigheid.'
        },
        {
          type: 'image',
          content: '/img/FW-earned-2.png'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Paid Media'
        },
        {
          type: 'text',
          content: 'We hebben voor paid media verschillende dingen geprobeerd. Zoals flyers, giveaways, influencers benaderen en advertenties draaien op meta.'
        },
        {
          type: 'image',
          content: '/img/FW-paid-1.png',
          imgtext: 'Marketingschema',
          content2: '/img/FW-paid-2.png',
          imgtext2: 'Flyers (800 verspreid bij Shockerz en Gearbox)'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Aansluiting promotie-uitingen bij concept en kernwaarden'
        },
        {
          type: 'text',
          content: 'Alle promotie-uitingen waren sterk verbonden met het Frostwave-concept: “Rauw in de Kou”. Dit werd weerspiegeld in:'
        },
        {
          type: 'opsom-text-top',
          content: '• Een consistent gebruik van visuele elementen (ijsachtige graphics, neon roze en blauw) die perfect pasten bij de koude, rauwe sfeer van het evenement.'
        },
        {
          type: 'opsom-text',
          content: '• Creatieve en verrassende content, zoals de neon-geïnspireerde visuals en pakkende Nederlandse captions die de kernwaarden (energie, vernieuwing, en humor) benadrukten.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Conversatie tijdens het evenement'
        },
        {
          type: 'text',
          content: 'Tijdens het evenement werd het conversatie-element versterkt door middel van Live updates en verhalen op social media en interactieve polls tijdens het event. Ook deelde we Interactieve momenten zoals het betrekken van het publiek in reacties op posts en het delen van video's direct vanuit de club.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Nabeleving van het evenement'
        },
        {
          type: 'opsom-text',
          content: '• Foto's en video's van het evenement werden snel gedeeld via de officiële social media-kanalen, met bijzondere focus op de hoogtepunten (zoals de opening door DJ Yoker en optredens van headliners). Dit is toegevoegd aan een hoogtepunt op Instagram zodat je die altijd kunt terugzien.'
        },
        {
          type: 'opsom-text',
          content: '• Bezoekers deelden hun ervaringen via stories en posts, wat de nabeleving versterkte.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Mond-tot-mondpromotie'
        },
        {
          type: 'text',
          content: 'De DJ-contest deelnemers, artiesten en bezoekers werden actief betrokken als ambassadeurs van het evenement. Zij promootten Frostwave via hun eigen netwerken, wat zorgde voor sterke mond-tot-mondpromotie. De doelgroep werd op natuurlijke wijze betrokken bij het verspreiden van het concept en de kernwaarden.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Bezoekersaantallen en sfeer op het evenement'
        },
        {
          type: 'text',
          content: 'Frostwave heeft met succes een grote groep bezoekers aangetrokken. De capaciteit van Club Verzo was (bijna) volledig benut, zonder dat het evenement te druk aanvoelde. De balans tussen een energieke sfeer en voldoende ruimte voor comfort zorgde voor een prettige ervaring voor alle aanwezigen.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Conclusie'
        },
        {
          type: 'text',
          content: 'Frostwave 2025 was een succesvol evenement dat de rauwe energie van de rawstylecommunity naar voren bracht. Er waren echter belangrijke leermomenten die moeten worden opgevolgd om de volgende editie nog sterker te maken. Door de marketingcampagne eerder op te starten, technische zaken beter af te stemmen en meer aandacht te geven aan de backstagebeleving, kan de impact en de algehele ervaring voor zowel bezoekers als artiesten verder worden verbeterd. Het is cruciaal om de geleerde lessen om te zetten in concrete acties om de groei van het evenement te waarborgen.'
        },
        {
          type: 'text',
          content: 'Dit project was een geweldige kans om mijn vaardigheden in eventplanning, marketing en social media te verbeteren. Ik kijk ernaar uit om deze ervaringen toe te passen in toekomstige projecten.'
        }
      ],
      fullDescription: 'Frostwave was een multidisciplinair project waarin ik een compleet evenement van A tot Z heb ontwikkeld, georganiseerd en gepositioneerd. Het concept draait om de herontdekking van vergeten subgenres binnen raw hardstyle in een mysterieuze winterse setting - “Rauw in de Kou”.',
      technologies: [
        'Adobe Photoshop & Illustrator',
        'Premiere Pro',
        'Meta Ads Manager',
        'Instagram',
        'TikTok'
      ],
      skills: [
        'Photoshop',
        'Illustrator',
        'Market Research',
        'Data Analysis',
        'Event planning',
        'Social Media'
      ],
      instagramLink: 'https://www.instagram.com/frostwave.event/'
    },
    {
      id: '4',
      title: 'NOS',
      description: 'Een project voor de NOS tijdens de VPRO Hackathon \'Publieke Pioniers #7: De Wereld in Je Broekzak\'',
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAQFBAYFBQYJBgUGCQsIBgYICwwKCgsKCgwQDAwMDAwMEAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/2wBDAQcHBw0MDRgQEBgUDg4OFBQODg4OFBEMDAwMDBERDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wgARCAJ2BLADAREAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAUHBAYIAwIB/9oACAEBAAAAAOmwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPmCh/PM2DPAAA/Ph9/oAAAAAAAAAAAAAAwqjCfsoCMqkFwZID4rWp6/wAAfuz2ZcGwAA+NW1aEj/N95spO7NOfoAAAAAAAAAAAAAR9Fgs7dgRFJAvnLAr3nTWAB92/0FIAGrVpHgBKb5uX0AAAAAAAAAAAAAR9Fg+7lnAiKSBfOWHzz7SH4ABOdUbgBolbAAE/cn6AAAAAAAAAAAAAj6LAz7ryhEUkC+csfnNFRgADM6y3YNdp0AAWbu4AAAAAAAAAAAABH0WA2S3voiKSBfOWKJoEAAEp2LNimYEAAn7k/QAAAAAAAAAAAACPosAsCxCIpIF85ZqXHnmBM7llQel+QFj9WmJQwNi3jM8I3XtY8npdkoAAAAAAAAAAAAAI+iwBbuzoikgXzlnKVcAnui7J+iKoqlvwHW++oOlwXVNBj6ToO+7+AAAAAAAAAAAAAEfRYAybsz4ikgXzltf4s/A2rreTAqXmb8C0eo0HS4NjsWb/AEMPJ+wAAAAAAAAAAAAAj6LADZLfiKTBfOWpTnYPTsnZwDmyngyu5PbDocBmbBP7FLfoAAAAAAAAAAAAACPosAFoTtJAvnLcw1SFodSADX+Kwdi7epSGACQ23dZIAAAAAAAAAAAAAEfRYfWx60GRbVOgvnLciaMHRl0ABxRBB1TZbWahAA+t0sj2AAAAAAAAAAAAAEfRYLrpnyDYdeBfOW4900OmraADjXVQ6jtE0qs/gACZuPIAAAAAAAAAAAAAI+iwXxptcgAvnLcm16F832APPhzCDrKwhFV7qvwADdbPAAAAAAAAAAAAAI+iwXtmUvCgBfOW5zpcNp7J+gCt+UwdsTgMXV9a1/CAPu+vcAAAAAAAAAAAABH0WC9JCIpbzAF85asOWgdHXMAxePdXDYe0wAjdd1XWvwFzTwAAAAAAAAAAAACPosF5STSaxAF85bG4kjw9elbaBG8u1+C+L8GLom+ZIGrVIC5NgAAAAAAAAAAAAAR9FgvKSKp1EAvnLKFoUCxLi3TLgq3pSKBl9pywqvT/AH3LcJr9ENSgLlnwAAAAAAAAAAAAEfRYLykjwpaLAXzlmLxvroAAHRF2DWqgDNnJD9wtbxgXxmAAAAAAAAAAAAAI+iwXlJCHpjyAvnLGn8i4oAAWZ1N9HhSUeAANhuMAAAAAAAAAAAAAj6LBeUkGmVcBfOWFf8r4YABYvU2SKz0cAAfVzTgAAAAAAAAAAAABH0WC8pIFWacC+csGq8v6qAD6vC/vQNZrqGAAelqbYAAAAAAAAAAAAAI+iwXlJA8aXiQvnLA8abpGDAfVkX3t4D813TdYxwD62qxJQAAAAAAAAAAAAAPHVAbV7gRsAG2eoB8aFX2pQ3nm7Fu1lTgAHxDQkXheP7kSEzsWUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf//EABoBAQADAQEBAAAAAAAAAAAAAAADBAUCAQb/2gAIAQIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIo3s3QAAAAAAAAAAAAAAAAAAAAAAAp0avAT3L8oAAAAAAAAAAAAAAAAAAAAAAVciEAe39TsAAAAAAAAAAAAAAAAAAAAABlZoACXasAAAAAAAAAAAAAAAAAAAAAAx6AAA63LIAAAAAAAAAAAAAAAAAAAAAzMsAAHf0EgAAAAAAAAAAAAAAAAAAAACDA8AksdRV/ALe4AAAAAAAAAAAAAAAAAAAAAw6gJda4OMzOA3bQAAAAAAAAAAAAAAAAAAAAIvnQT7vYFHGBd2gAAAAAAAAAAAAAAAAAAAAZ2SHv0EwBkZ4dfSegAAAAAAAAAAAAAAAAAAABjUQu7QAi+dB9BOAAAAAAAAAAAAAAAAAAAAGDWDW0QA+diDbuAAAAAAAAAAAAAAAAAAAABgVw2bwAfPwBtXQAAAAAAAAAAAAAAAAAAAAw6gaeoAPPm+Q3bQAAAAAAAAAAAAAAAAAAAAZOcE/0AAqYYPopQAAAAAAAAAAAAAAAAAAAApYoNfQAc4MAS/RAAAAAAAAAAAAAAAAAAAAA8+c4D3YvA4xaoNPUAAAAAAAAAAAAAAAAAAAAAzMsC3oWOoqefGDr6LsAAAAAAAAAAAAAAAAAAAADnAhAAA1tEAAAAAAAAAAAAAAAAAAAAAr4XIAAXNsAAAAAAAAAAAAAAAAAAAAAKuJyAAW9v0AAAAAAAAAAAAAAAAAAAAAEGNAAD3R1PQAAAAAAAAAAAAAAAAAAAAAHmfnRAFzUnAAAAAAAAAAAAAAAAAAAAAAB5WqQRupbNyQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8QAGwEBAAIDAQEAAAAAAAAAAAAAAAYHAQQFAwL/2gAIAQMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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',
      categories: [
        'research',
        'data'
      ],
      date: 'Mei 2025',
      content: [
        {
          type: 'text',
          content: 'Op 12 en 13 mei 2025 streek de zevende editie van Publieke Pioniers neer bij MindLabs in Tilburg. Samen met BUas, Fontys, en Mindlabs organiseerde VPRO Medialab een tweedaagse hackathon om te onderzoeken hoe immersieve vertelvormen ingezet kan worden voor buitenlandjournalistiek.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'text',
          content: 'Wie de voorpagina van de NOS site bezoekt wordt geconfronteerd met een zich snel verversende stroom van nieuwsberichten, die niet bepaald uitnodigt om je er in te verdiepen. Dat kan pakkender, relevanter en immersiever. Tim Mooren, werkzaam bij het AI team van de NOS, zocht met het team meer samenhang en overzicht in de nieuwsberichten. In de eindpitch presenteerde het team een visuele interface waarbij op basis van verschillende criteria het nieuws gelokaliseerd werd weergegeven. De wereldbol, sinds jaar en dag niet weg te denken uit de leaders van gerenommeerde nieuwsprogramma's, geeft direct een globaal perspectief. Je kunt je meteen voorstellen hoe gerelateerde berichten zich verbinden terwijl ze zich betrekken op verschillende landen en locaties. Een wereldreis door het nieuws...'
        },
        {
          type: 'subtitle',
          content: 'Discover'
        },
        {
          type: 'flex-text',
          content: 'Om meer te weten te komen over hoe vaak en waarop mensen het nieuws volgen, hebben we een enquête opgesteld. Deze is ingevuld door 166 mensen van verschillende leeftijden. Hieruit is gekomen dat hoe lager de leeftijdscategorie, hoe minder nieuws er wordt gevolgd. Hierna zijn we biebonderzoek gaan doen naar de nieuwsconsumptie. De resultaten van de enquête hebben we toen vergeleken met de resultaten van het onderzoek en hieruit hebben we onze doelgroep vastgesteld: jongvolwassenen tussen de 18 en 29 jaar.',
          image: '/img/newz-1.jpg',
          content2: ''
        },
        {
          type: 'flex-text',
          content: 'Na het vaststellen van de doelgroep hebben we de enquête er weer bij gepakt en gekeken naar hoe de personen van onze doelgroep het nieuws volgen. Hieruit is gebleken dat er een enorme voorkeur uitgaat naar shorts video's van minder dan 1 minuut.',
          image: '/img/newz-2.jpg'
        },
        {
          type: 'text',
          content: 'Om een beter beeld te krijgen heb ik 2 interviews gehouden met mensen uit onze doelgroep om te ontdekken over hoe mensen het nieuws volgen en wat hun struikelblokken daarbij zijn. Ook wilde ik te weten komen welke nieuwsbronnen ze gebruiken, welke problemen ze ervaren en welke ideeën ze hebben over hoe nieuws beter kan worden gepresenteerd.'
        },
        {
          type: 'text',
          content: 'Hier zijn enkele belangrijke punten die uit deze interviews kwamen:'
        },
        {
          type: 'opsom-text-top',
          content: '• Nieuws wat je op sociale media tegenkomt is minder snel betrouwbaar'
        },
        {
          type: 'opsom-text-bottom',
          content: '• Gebrek aan interesse. Doordat nieuws vaak niet leuk is of op een saaie manier wordt gepubliceerd, is er minder interesse om het nieuws te volgen.'
        },
        {
          type: 'text',
          content: 'Hierna hebben we de volgende onderzoeksvragen opgesteld om een duidelijk begrip te krijgen van wat er moet worden onderzocht en om een richting te bieden voor het onderzoek:'
        },
        {
          type: 'small-subtitle',
          content: 'Hoofdvraag:'
        },
        {
          type: 'opsom-text-top',
          content: 'Hoe zorgen wij ervoor dat AI de nieuwswereld veranderd zodat meer jongeren het nieuws gaan volgen?'
        },
        {
          type: 'small-subtitle',
          content: 'Deelvragen:'
        },
        {
          type: 'opsom-text-top',
          content: '• Hoe ziet de huidige implementatie van AI eruit in de nieuwswereld?'
        },
        {
          type: 'opsom-text',
          content: '• Welke manieren van het gebruiken van AI zijn effectief?'
        },
        {
          type: 'opsom-text',
          content: '• Wat zijn de nadelen in de huidige implementatie van AI?'
        },
        {
          type: 'opsom-text',
          content: '• Hoe beïnvloedt de implementatie van AI de objectiviteit en betrouwbaarheid van nieuwsberichtgeving?'
        },
        {
          type: 'opsom-text',
          content: '• In hoeverre verbetert AI de personalisatie van nieuwsconsumptie voor individuele lezers?'
        },
        {
          type: 'opsom-text-bottom',
          content: '• Wat zijn de ethische en maatschappelijke implicaties van het gebruik van AI in de redactionele besluitvorming van nieuwsorganisaties?'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'text',
          content: 'Ook hebben we onderzoek gedaan naar de mogelijkheden van AI. Hieruit is gekomen dat AI een enorme potentie heeft om te groeien in verschillende industrieën. Ook heb ik interviews gehouden met een expert, studenten journalisme, onderzoek gedaan naar de huidige implementatie van AI in de nieuwswereld en de nadelen van AI. Hieruit is gekomen dat sommige grote mediabedrijven al gebruik maken van AI om bijvoorbeeld nieuwsproductiecapaciteiten te verbeteren. Daarnaast is gebleken dat het vele gebruik van AI kan leiden tot beschadiging van het vertrouwen van de mensen.'
        },
        {
          type: 'subtitle',
          content: 'Define'
        },
        {
          type: 'flex-text',
          content: 'Om de doelgroep beter te begrijpen hebben we aan de hand van deze onderzoeken een empathy map en een persona gemaakt. Om onze creativiteit aan te wakkeren hebben we samen met de docent een design challenge opgesteld: ontwerp een omgeving om jongvolwassenen in de leeftijd van 18-29 jaar te laten interesseren in nieuws zodat ze weten wat er gaande is.',
          image: '/img/newz-3.png'
        },
        {
          type: 'text',
          content: 'Hierna hebben we How-Might-We-vragen gemaakt om innovatieve oplossingen te verkennen:'
        },
        {
          type: 'opsom-text-top',
          content: '• Hoe gaan we jongvolwassenen van 18-29 jaar laten \'snacken\' van het nieuws zodat we hun betrokkenheid bij nieuws vergroten.'
        },
        {
          type: 'opsom-text',
          content: '• Hoe kunnen we AI inzetten om nieuwsverhalen te selecteren en aanbevelingen te doen op basis van de persoonlijke interesses en voorkeuren van jongvolwassenen?'
        },
        {
          type: 'opsom-text-bottom',
          content: '• Hoe kunnen we AI inzetten om nieuws op een visueel aantrekkelijke manier te presenteren, zoals infographics of korte video's, om jongvolwassenen aan te spreken die niet van lange teksten houden?'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Design'
        }
      ],
      technologies: [
        'Figma',
        'Adobe XD',
        'Sketch',
        'InVision',
        'User Testing'
      ],
      skills: [
        'Figma',
        'UI/UX',
        'Prototyping',
        'Market Research',
        'Javascript',
        'React',
        'User Testing'
      ],
      demoLink: '/projects/nos-project/index.html'
    },
    {
      id: '1',
      title: 'SNOTYOUNG',
      description: 'Het oplossen van de conversieproblemen van Snotyoung en het maken van een nieuwe website',
      image: '/img/SY-BG-edit2.png',
      categories: [
        'design',
        'research',
        'data'
      ],
      date: 'Juli 2024',
      content: [
        {
          type: 'subtitle',
          content: 'Wat is Snotyoung?'
        },
        {
          type: 'text',
          content: 'Bij Snotyoung staat een gedurfde filosofie centraal: veiligheid op de eerste plaats is nooit de weg naar het verwezenlijken van je dromen. Avontuur vormt de basis van alles wat ze doen. Ze omarmen het belang van kwaliteit en expertise, terwijl ze tegelijkertijd het idee koesteren dat werk (en leven) alleen opwindend zal zijn als je bereid bent risico's te nemen. Snotyoung is toegewijd aan het creëren van boeiende visuele verhalen, variërend van fotografie en videoproductie tot conceptontwikkeling.'
        },
        {
          type: 'text',
          content: 'Hiernaast is Snotyoung een nieuw gelanceerd streetwear-label voor mannen. De eerste batch bestaat uit onmisbare basics in verrassende kleurstellingen, maar de filosofie bestaat uit nog veel meer. Snotyoung vraagt een jongere generatie om haar dromen te volgen. De oprichters van het merk zijn een stel jonge creatievelingen die besloten hun krachten te bundelen. Ze hadden de drang om zich te verenigen en een gedeelde ideologie tot uitdrukking te brengen. Zonder enige relevante ervaring in de mode-industrie, maar met één doel gemeenschappelijk, begonnen ze aan hun avontuur. Ze willen zich onderscheiden van de massa door een moedige beweging te creëren. Het streetwearlabel Snotyoung is die ongehoorzame nieuwe buurjongen die je hart meteen verovert door zijn oprechtheid en enthousiasme.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'De opdracht'
        },
        {
          type: 'text',
          content: 'Snotyoung bevindt zich momenteel in een fase waarin de website veel verkeer genereert, maar niet effectief leidt tot conversies, met name sales. Veel bezoekers lijken af te haken zonder de gewenste acties te ondernemen. Dit fenomeen duidt op een potentieel conversieprobleem dat moet worden aangepakt. Waar gaat dit mis?'
        },
        {
          type: 'text',
          content: 'Het identificeren van het conversieprobleem op de website is cruciaal om de kansen voor sales te vergroten. Het is een kans om de website zo in te richten dat het niet alleen aantrekkelijk is voor bezoekers, maar hen ook aanzet tot de gewenste acties, namelijk aankoop.'
        },
        {
          type: 'text',
          content: 'De opdracht is om ervoor te zorgen dat de conversieproblemen van Snotyoung worden onderzocht en opgelost door het verbeteren van de huidige website of het maken van een nieuwe website.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Aanpak en Resultaat'
        },
        {
          type: 'text',
          content: 'Het conversieprobleem van Snotyoung vraagt om een diepgaand onderzoek om de knelpunten te identificeren en effectieve oplossingen te vinden. Allereerst heb ik een hoofdvraag en deelvragen opgesteld:'
        },
        {
          type: 'small-subtitle',
          content: 'Hoofdvraag:'
        },
        {
          type: 'opsom-text-top',
          content: '• Hoe kan ik de conversie op de Snotyoung-website verbeteren om bezoeken om te zetten in sales voor Snotyoung?'
        },
        {
          type: 'small-subtitle',
          content: 'Deelvragen'
        },
        {
          type: 'opsom-text-top',
          content: '• Wat zijn de specifieke knelpunten die leiden tot een lage conversie op de Snotyoung-website?'
        },
        {
          type: 'opsom-text',
          content: '• Hoe ervaren bezoekers de huidige gebruikersinterface en navigatie op de website?'
        },
        {
          type: 'opsom-text',
          content: '• In hoeverre sluit de huidige inhoud aan op de behoeften en verwachtingen van de bezoekers?'
        },
        {
          type: 'opsom-text',
          content: '• Hebben technische aspecten, zoals laadtijd en responsiviteit, invloed op de conversie?'
        },
        {
          type: 'opsom-text-bottom',
          content: '• Hoe dragen visuele elementen bij aan de conversie of belemmeren ze de conversie?'
        },
        {
          type: 'text',
          content: 'Voor onderzoek naar de conversie van Snotyoung ben ik begonnen met het bekijken van de statistieken van de website. Hierin is te zien dat Snotyoung in 90 dagen 3.656 unieke websitebezoekers heeft gehad, waarvan maar 32 bestellingen. Dat is een percentage van 0,84%, terwijl de gemiddelde conversie in de fashion branche ligt tussen de 1,61 en 2,77%.'
        },
        {
          type: 'image',
          content: '/img/SY-stat.png',
          content2: '/img/SY-stat-2.png'
        },
        {
          type: 'text',
          content: 'Om de conversie van Snotyoung te verhogen ben ik allereest onderzoek gaan doen naar de gebruikerservaring van Snotyoung. Om meer te weten te komen over de gebruikerservaring van de website heb ik een enquête uitgestuurd met vragen over het uiterlijk van de website. Hieruit is het volgende gekomen: Uit de enquête bleek dat de ondervraagden vooral vonden dat de website een basic uitstraling heeft met weinig eigen stijl. Wel vonden ze de website makkelijk navigeren, maar dit omdat er niet veel opties waren om heen te gaan op de website.'
        },
        {
          type: 'text',
          content: 'Ook heb ik een plugin op de huidige website geïnstalleerd die de activiteit van bezoekers bekijkt en opneemt gedurende 2 weken. Hiermee kan ik zien welke pagina’s de bezoekers bekijken, waar ze op klikken, tot hoever ze scrollen etc. Dit is essentiële data die ik kan gebruiken bij het maken van de nieuwe website en het verbeteren van de gebruikerservaring. Het geeft bijvoorbeeld waardevolle inzichten over hoe bezoekers de website gebruiken en eventuele knelpunten en problemen op de website (bijv. onduidelijke navigatie).'
        },
        {
          type: 'text',
          content: 'Hieruit heb ik de volgende data verkregen. In de heatmaps is te zien dat maar 10% van de bezoekers de onderkant van de homepagina bereikt. Ook is te zien dat er vooral geklikt wordt op \'store\' (maar dit is de homepagina) en op \'about\'. Hier is te zien dat veel bezoekers niet scrollen op de \'about\' pagina, maar weer klikken op \'store\'. Als we kijken naar een samenvatting van alle verkregen data met deze plugin, is te zien dat de gemiddelde tijd op een pagina 59 seconden is, bezoekers gemiddeld maar tot 52,4% scrollen en dat 34,8% de website verlaat na 1 pagina te hebben bekeken. Wat betekent dit?'
        },
        {
          type: 'opsom-text',
          content: '• Slechts 10% van de bezoekers bereikt de onderkant van de homepagina. Dit betekent dat de meeste bezoekers hun informatiebehoeften vervullen zonder helemaal naar beneden te scrollen of dat ze snel afhaken.'
        },
        {
          type: 'opsom-text',
          content: '• Het feit dat \'store\' de homepagina is en veel bezoekers daarop klikken, kan erop wijzen dat ze niet doorhebben dat ze al op de homepagina/store zijn. Dit kan verwarrend zijn en leidt mogelijk tot een slechte gebruikerservaring.'
        },
        {
          type: 'opsom-text',
          content: '• Veel bezoekers scrollen niet op de \'about\' pagina en klikken snel weer terug naar \'store\'. Dit kan betekenen dat de inhoud of opmaak van de \'about\' pagina niet genoeg boeit of relevantie biedt voor de bezoekers.'
        },
        {
          type: 'opsom-text-bottom',
          content: '• 34,8% van de bezoekers verlaat de website na het bekijken van slechts één pagina. Dit betekent dat een aanzienlijk deel van de bezoekers niet vindt wat ze zoeken of niet wordt aangespoord om verder te navigeren.'
        },
        {
          type: 'text',
          content: 'Na het verkrijgen van deze data ben ik door middel van biebonderzoek gaan kijken naar hoe andere streetwear merken hun website hebben ingericht, om zo inspiratie op te doen voor de nieuwe website van Snotyoung. Bij de merken die een paar producten op de homepagina hebben staan is te zien dat de fotografie van de kleding van hoge kwaliteit, maar ook simpel is (kledingstuk met effen achtergrond). Ook is te zien dat op elke onderzochte website sfeerfoto's van het merk staan. Dit laat de stijl van het merk zien en creëert een bepaalde sfeer op de website. Geen enkel merk heeft gelijk alle producten op de homepagina staan, maar hebben een \'store\' pagina waar alle producten te vinden zijn. Hierop is het mogelijk om te filteren op bijvoorbeeld categorie, prijs of maat. Hiernaast heeft elke website een footer met informatie of handige links en kun je bij de meeste een account aanmaken.'
        },
        {
          type: 'text',
          content: 'Om nog meer te weten te komen over de gebruikerservaring van de Snotyoung website heb ik een tweede enquête uitgestuurd. Dit keer met vragen over of ze iets zouden kopen op de website en waarom wel of niet. Ook stelde ik de vraag hoe ze de gebruikerservaring op de website zouden beoordelen en of er aspecten zijn van het websiteontwerp of de functionaliteiten die ze als frustrerend ervaren. Hieruit is gekomen dat maar liefst 69,2% van de ondervraagden niets zou kopen op de Snotyoung-website. De voornaamste redenen hiervoor zijn: onaantrekkelijke productfotografie/presentatie van de kledingstukken, onduidelijke website lay-out/navigatie en gebrek aan duidelijke informatie over het bedrijf waardoor het onbetrouwbaar overkomt. Het gemiddelde cijfer dat de ondervraagden de website zouden geven is een 6,1.'
        },
        {
          type: 'text',
          content: 'Op de vraag of er nog aspecten zijn van het websiteontwerp of de functionaliteiten die ze frustreren kwamen de volgende antwoorden:'
        },
        {
          type: 'quote-top',
          content: '• \'Het afbeelden van gekreukelde kleding wekt voor mij de suggestie dat de kwaliteit van de kleding te wensen overlaat.\''
        },
        {
          type: 'quote',
          content: '• \'Ik werd niet echt getriggerd om iets te kopen omdat ik niet het \'wauw gevoel\' kreeg, de producten worden ver onder de maat gepresenteerd.\''
        },
        {
          type: 'quote',
          content: '• \'Ik mis een duidelijke zoekfunctie voor de producten.\''
        },
        {
          type: 'quote-bottom',
          content: '• \'Eindeloos scrollen naar beneden met soortgelijke producten is geen fijne ervaring.\''
        },
        {
          type: 'text',
          content: 'Als laatst stelde ik de vraag of er nog functies of elementen zijn die ze missen op de website. Hieruit kwamen de volgende punten:'
        },
        {
          type: 'opsom-text',
          content: '• Meer foto's (van het merk)'
        },
        {
          type: 'opsom-text',
          content: '• Website heeft geen footer'
        },
        {
          type: 'opsom-text',
          content: '• Filterfunctie bij producten'
        },
        {
          type: 'opsom-text',
          content: '• Meer eigenheid'
        },
        {
          type: 'opsom-text',
          content: '• Meer informatie over het bedrijf'
        },
        {
          type: 'opsom-text-bottom',
          content: '• Een zoekbalk om producten te kunnen zoeken'
        },
        {
          type: 'text',
          content: 'Toen ben ik biebonderzoek gaan doen naar hoe ik de websiteconversie kan verhogen. Uit dit onderzoek is bijvoorbeeld gebleken dat het hebben van hoogwaardige productfoto's en video's een cruciale rol kan spelen bij het overtuigen van bezoekers om een aankoop te doen. Daarnaast is het handig dat bezoekers een account aan kunnen maken om zo bijvoorbeeld e-mails over achtergelaten winkelwagentjes te kunnen sturen. Met deze informatie ben ik gaan brainstormen over dingen die ik zou kunnen toevoegen aan de nieuwe website. Ik heb deze ideeën geordend en geanalyseerd door deze te verwerken in een mindmap en een SWOT-analyse. Om inspiratie te krijgen voor het design van de website heb ik een moodboard gemaakt. Hiervoor heb ik gekeken naar andere streetwear websites en inspiratie opgedaan via behance.'
        },
        {
          type: 'text',
          content: 'Toen ben ik nieuwe foto's van de kleding gaan schieten. Eerst een voorbeeld van hoe de foto's er op de website eerst uizagen, en daarnaast het resultaat van de nieuwe foto's na wat nabewerking in Photoshop.'
        },
        {
          type: 'image',
          content: '/img/SY-kl-1.png',
          content2: '/img/SY-kl-2.png'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Resultaten'
        },
        {
          type: 'flex-text',
          content: 'Nadat de website is live gegaan ben ik gaan kijken hoe deze nu presteert en of er verbetering is ten opzichte van de oude website. Hiervoor neem ik de data van de afgelopen 30 dagen aangezien de website nog geen 90 dagen live is. Allereerst ben ik gaan kijken of er een verschil is in de vindbaarheid op Google. Hiervoor heb ik de zoekwoorden \'streetwear\' en \'snotyoung\' gebruikt. Hieronder kun je zien dat de positie op Google bij het zoekwoord \'snotyoung\' 0,1 positie is gestegen. Ook is er een stijging van 15% in het aantal kliks naar de website, en een stijging van 18% in het aantal vertoningen.',
          image: '/img/SY-stat-3.png'
        },
        {
          type: 'flex-text',
          content: 'Vervolgens ben ik gaan kijken bij \'streetwear\'. Hieronder zie je dat de website van Snotyoung maar liefst 41,3 posities is gestegen ten opzichte van de oude website. Ook is er een stijging van 900% in het aantal kliks naar de website, en een stijging van 319% in het aantal vertoningen.',
          image: '/img/SY-stat-4.png'
        },
        {
          type: 'flex-text',
          content: 'Als laatste ben ik gaan kijken bij de statistieken van Wix zelf. Hierbij heb ik gekeken naar de statistieken van de sales om te kijken of de conversie is gestegen. Hieronder is te zien dat de conversie van 0,84% naar 1% is gestegen. Dit is een stijging van 19.',
          image: '/img/SY-stat-5.png'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Conclusie'
        },
        {
          type: 'text',
          content: 'et optimalisatieproces van de Snotyoung-website heeft duidelijke verbeteringen opgeleverd. Door onderzoek, het analyseren van gebruikersgedrag en het implementeren van gerichte aanpassingen is de website niet alleen gebruiksvriendelijker geworden, maar ook beter vindbaar en aantrekkelijker voor potentiële klanten. Hoewel de resultaten tot nu toe positief zijn, is het belangrijk om te blijven optimaliseren en verbeteren. Tot slot heb ik daarom enkele aanbevelingen voor de toekomst:'
        },
        {
          type: 'opsom-text',
          content: '• Blijf de prestaties van de website nauwlettend volgen met behulp van Google Analytics en Wix-statistieken.'
        },
        {
          type: 'opsom-text',
          content: '• Blijf werken aan de SEO-strategie om de vindbaarheid van de website verder te verbeteren.'
        },
        {
          type: 'opsom-text',
          content: '• Verhoog de inzet van marketingstrategieën zoals e-mailmarketing en sociale media om meer verkeer naar de website te leiden.'
        },
        {
          type: 'opsom-text-bottom',
          content: '• Gebruik gerichte advertenties en promoties om nieuwe klanten aan te trekken en de naamsbekendheid te vergroten.'
        }
      ],
      technologies: [
        'Wix',
        'Hotjar',
        'Photoshop',
        'HTML',
        'CSS'
      ],
      skills: [
        'Figma',
        'UI/UX',
        'Data Analysis',
        'User Testing',
        'Google Analytics'
      ],
      demoLink: 'https://www.snotyoung.store/'
    },
    {
      id: '3',
      title: 'NewZ',
      description: 'Het maken van een product, die ervoor zorgt dat generative AI de nieuws ervaring voor lezers verbetert.',
      image: '/img/NewZlogo.png',
      categories: [
        'design',
        'development',
        'research'
      ],
      date: 'November 2023',
      content: [
        {
          type: 'text',
          content: 'LiveWall is een creatief digitaal bureau met een team van denkers en makers in zowel de creatieve als technische industrie. Ze zijn gespecialiseerd in van het ontwikkelen van een digitale marketingstrategie tot het bouwen van online platforms en het creëren van klikbare content tot het organiseren van (hybride) evenementen. Ze werken in 3 kernteams: Platform & Apps, Engagement & Gaming en Studio's. LiveWall heeft ons gevraagd om te onderzoeken wat de impact van AI kan hebben op het nieuws in de toekomst.'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'De opdracht'
        },
        {
          type: 'text',
          content: 'Het doel van het project is om te kijken wat de mogelijkheden zijn om de journalistiek te verbeteren door middel van generatieve AI. Hierbij is de bedoeling dat er bekeken wordt wat de mogelijkheden zijn op dit gebied, wat er al bestaat en wat er nog mogelijk is in de toekomst. Om hierachter te komen zullen wij als groep onderzoek gaan doen naar dit onderwerp. Het doel is om een product te maken dat ervoor zorgt dat generative AI de nieuws ervaring voor lezers verbetert en dat journalisten de artikelen makkelijker kunnen maken. De kans die wij benutten met dit project is de nieuwservaring van de lezers/kijkers verbeteren door het gebruik van AI op grotere schaal te gebruiken.'
        },
        {
          type: 'subtitle',
          content: 'Discover'
        },
        {
          type: 'flex-text',
          content: 'Om meer te weten te komen over hoe vaak en waarop mensen het nieuws volgen, hebben we een enquête opgesteld. Deze is ingevuld door 166 mensen van verschillende leeftijden. Hieruit is gekomen dat hoe lager de leeftijdscategorie, hoe minder nieuws er wordt gevolgd. Hierna zijn we biebonderzoek gaan doen naar de nieuwsconsumptie. De resultaten van de enquête hebben we toen vergeleken met de resultaten van het onderzoek en hieruit hebben we onze doelgroep vastgesteld: jongvolwassenen tussen de 18 en 29 jaar.',
          image: '/img/newz-1.jpg'
        },
        {
          type: 'flex-text',
          content: 'Na het vaststellen van de doelgroep hebben we de enquête er weer bij gepakt en gekeken naar hoe de personen van onze doelgroep het nieuws volgen. Hieruit is gebleken dat er een enorme voorkeur uitgaat naar shorts video's van minder dan 1 minuut.',
          image: '/img/newz-2.jpg'
        },
        {
          type: 'text',
          content: 'Om een beter beeld te krijgen heb ik 2 interviews gehouden met mensen uit onze doelgroep om te ontdekken over hoe mensen het nieuws volgen en wat hun struikelblokken daarbij zijn. Ook wilde ik te weten komen welke nieuwsbronnen ze gebruiken, welke problemen ze ervaren en welke ideeën ze hebben over hoe nieuws beter kan worden gepresenteerd.'
        },
        {
          type: 'text',
          content: 'Hier zijn enkele belangrijke punten die uit deze interviews kwamen:'
        },
        {
          type: 'opsom-text-top',
          content: '• Nieuws wat je op sociale media tegenkomt is minder snel betrouwbaar'
        },
        {
          type: 'opsom-text-bottom',
          content: '• Gebrek aan interesse. Doordat nieuws vaak niet leuk is of op een saaie manier wordt gepubliceerd, is er minder interesse om het nieuws te volgen.'
        },
        {
          type: 'text',
          content: 'Hierna hebben we de volgende onderzoeksvragen opgesteld om een duidelijk begrip te krijgen van wat er moet worden onderzocht en om een richting te bieden voor het onderzoek:'
        },
        {
          type: 'small-subtitle',
          content: 'Hoofdvraag:'
        },
        {
          type: 'opsom-text-top',
          content: 'Hoe zorgen wij ervoor dat AI de nieuwswereld veranderd zodat meer jongeren het nieuws gaan volgen?'
        },
        {
          type: 'small-subtitle',
          content: 'Deelvragen:'
        },
        {
          type: 'opsom-text-top',
          content: '• Hoe ziet de huidige implementatie van AI eruit in de nieuwswereld?'
        },
        {
          type: 'opsom-text',
          content: '• Welke manieren van het gebruiken van AI zijn effectief?'
        },
        {
          type: 'opsom-text',
          content: '• Wat zijn de nadelen in de huidige implementatie van AI?'
        },
        {
          type: 'opsom-text',
          content: '• Hoe beïnvloedt de implementatie van AI de objectiviteit en betrouwbaarheid van nieuwsberichtgeving?'
        },
        {
          type: 'opsom-text',
          content: '• In hoeverre verbetert AI de personalisatie van nieuwsconsumptie voor individuele lezers?'
        },
        {
          type: 'opsom-text-bottom',
          content: '• Wat zijn de ethische en maatschappelijke implicaties van het gebruik van AI in de redactionele besluitvorming van nieuwsorganisaties?'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'text',
          content: 'Ook hebben we onderzoek gedaan naar de mogelijkheden van AI. Hieruit is gekomen dat AI een enorme potentie heeft om te groeien in verschillende industrieën. Ook heb ik interviews gehouden met een expert, studenten journalisme, onderzoek gedaan naar de huidige implementatie van AI in de nieuwswereld en de nadelen van AI. Hieruit is gekomen dat sommige grote mediabedrijven al gebruik maken van AI om bijvoorbeeld nieuwsproductiecapaciteiten te verbeteren. Daarnaast is gebleken dat het vele gebruik van AI kan leiden tot beschadiging van het vertrouwen van de mensen.'
        },
        {
          type: 'subtitle',
          content: 'Define'
        },
        {
          type: 'flex-text',
          content: 'Om de doelgroep beter te begrijpen hebben we aan de hand van deze onderzoeken een empathy map en een persona gemaakt. Om onze creativiteit aan te wakkeren hebben we samen met de docent een design challenge opgesteld: ontwerp een omgeving om jongvolwassenen in de leeftijd van 18-29 jaar te laten interesseren in nieuws zodat ze weten wat er gaande is.',
          image: '/img/newz-3.png'
        },
        {
          type: 'text',
          content: 'Hierna hebben we How-Might-We-vragen gemaakt om innovatieve oplossingen te verkennen:'
        },
        {
          type: 'opsom-text-top',
          content: '• Hoe gaan we jongvolwassenen van 18-29 jaar laten \'snacken\' van het nieuws zodat we hun betrokkenheid bij nieuws vergroten.'
        },
        {
          type: 'opsom-text',
          content: '• Hoe kunnen we AI inzetten om nieuwsverhalen te selecteren en aanbevelingen te doen op basis van de persoonlijke interesses en voorkeuren van jongvolwassenen?'
        },
        {
          type: 'opsom-text-bottom',
          content: '• Hoe kunnen we AI inzetten om nieuws op een visueel aantrekkelijke manier te presenteren, zoals infographics of korte video's, om jongvolwassenen aan te spreken die niet van lange teksten houden?'
        },
        {
          type: 'break',
          content: ''
        },
        {
          type: 'subtitle',
          content: 'Design'
        }
      ],
      technologies: [
        'Figma',
        'Adobe XD',
        'Sketch',
        'InVision',
        'User Testing'
      ],
      skills: [
        'Figma',
        'UI/UX',
        'Prototyping',
        'Market Research',
        'Javascript',
        'React',
        'User Testing'
      ],
      demoLink: 'https://demo-project.com"
    }
  ]; // Juiste sluithaakjes formattering
