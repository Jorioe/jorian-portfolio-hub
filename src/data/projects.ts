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
    id: "1",
    title: "SNOTYOUNG",
    description:
      "Het oplossen van de conversieproblemen van Snotyoung en het maken van een nieuwe website",
    image: "/img/SY-BG-edit2.png",
    categories: ["design", "research", "data"],
    date: "Juli 2024",
    content: [
      { type: "subtitle", content: "Wat is Snotyoung?" },
      { type: "text", content: "Bij Snotyoung staat een gedurfde filosofie centraal..." },
      { type: "text", content: "Hiernaast is Snotyoung een nieuw gelanceerd streetwear-label..." },
      { type: "break" },
      { type: "subtitle", content: "De opdracht" },
      { type: "text", content: "Snotyoung bevindt zich momenteel in een fase waarin..." },
      { type: "text", content: "Het identificeren van het conversieprobleem..." },
      { type: "text", content: "De opdracht is om ervoor te zorgen..." },
      { type: "break" },
      { type: "subtitle", content: "Aanpak en Resultaat" },
      { type: "text", content: "Het conversieprobleem vraagt om diepgaand onderzoek..." },
      { type: "small-subtitle", content: "Hoofdvraag:" },
      { type: "opsom-text-top", content: "• Hoe kan ik de conversie op de website verbeteren..." },
      { type: "small-subtitle", content: "Deelvragen" },
      { type: "opsom-text-top", content: "• Wat zijn de specifieke knelpunten..." },
      { type: "opsom-text", content: "• Hoe ervaren bezoekers..." },
      { type: "opsom-text", content: "• In hoeverre sluit de inhoud aan..." },
      { type: "opsom-text", content: "• Hebben technische aspecten invloed..." },
      { type: "opsom-text-bottom", content: "• Hoe dragen visuele elementen bij..." },
      { type: "text", content: "Voor onderzoek naar de conversie van Snotyoung..." },
      { type: "image", content: "/img/SY-stat.png", content2: "/img/SY-stat-2.png" },
      { type: "text", content: "Om de conversie van Snotyoung te verhogen..." },
      { type: "text", content: "Ook heb ik een plugin op de huidige website..." },
      { type: "text", content: "Hieruit heb ik de volgende data verkregen..." },
      { type: "opsom-text", content: "• Slechts 10% van de bezoekers bereikt..." },
      { type: "opsom-text", content: "• Het feit dat 'store' de homepagina is..." },
      { type: "opsom-text", content: "• Veel bezoekers scrollen niet op de 'about' pagina..." },
      { type: "opsom-text-bottom", content: "• 34,8% van de bezoekers verlaat de website..." },
      { type: "text", content: "Na het verkrijgen van deze data..." },
      { type: "text", content: "Om nog meer te weten te komen..." },
      { type: "text", content: "Op de vraag of er nog aspecten..." },
      { type: "quote-top", content: "• \"Het afbeelden van gekreukelde kleding...\"" },
      { type: "quote", content: "• \"Ik werd niet echt getriggerd...\"" },
      { type: "quote", content: "• \"Ik mis een duidelijke zoekfunctie...\"" },
      { type: "quote-bottom", content: "• \"Eindeloos scrollen naar beneden...\"" },
      { type: "text", content: "Als laatst stelde ik de vraag..." },
      { type: "opsom-text", content: "• Meer foto's (van het merk)" },
      { type: "opsom-text", content: "• Website heeft geen footer" },
      { type: "opsom-text", content: "• Filterfunctie bij producten" },
      { type: "opsom-text", content: "• Meer eigenheid" },
      { type: "opsom-text", content: "• Meer informatie over het bedrijf" },
      { type: "opsom-text-bottom", content: "• Een zoekbalk om producten te kunnen zoeken" },
      { type: "text", content: "Toen ben ik biebonderzoek gaan doen..." },
      { type: "text", content: "Toen ben ik nieuwe foto's gaan schieten..." },
      { type: "image", content: "/img/SY-kl-1.png", content2: "/img/SY-kl-2.png" },
      { type: "break" },
      { type: "subtitle", content: "Resultaten" },
      { type: "flex-text", content: "Nadat de website live is gegaan...", image: "/img/SY-stat-3.png" },
      { type: "flex-text", content: "Vervolgens ben ik gaan kijken...", image: "/img/SY-stat-4.png" },
      { type: "flex-text", content: "Als laatste ben ik gaan kijken...", image: "/img/SY-stat-5.png" },
      { type: "break" },
      { type: "subtitle", content: "Conclusie" },
      { type: "text", content: "Het optimalisatieproces van de Snotyoung-website..." },
      { type: "opsom-text", content: "• Blijf de prestaties van de website..." },
      { type: "opsom-text", content: "• Blijf werken aan de SEO-strategie..." },
      { type: "opsom-text", content: "• Verhoog de inzet van marketingstrategieën..." },
      { type: "opsom-text-bottom", content: "• Gebruik gerichte advertenties en promoties..." }
    ],
    technologies: ["Wix", "Hotjar", "Photoshop", "HTML", "CSS"],
    skills: ["Figma", "UI/UX", "Data Analysis", "User Testing", "Google Analytics"],
    demoLink: "https://www.snotyoung.store/"
  },
  {
    id: "2",
    title: "Frostwave",
    description: "Het organiseren van een eigen evenement",
    image: "/img/Frostwave-FB-bg.png",
    categories: ["research", "design", "data", "rest"],
    date: "Januari 2025",
    content: [
      { type: "text", content: "Op 10 januari 2025 vond de allereerste editie van Frostwave plaats in Club Verzo in Roosendaal. Dit evenement stond in het teken van rauwe energie en een herontdekking van subgenres binnen rawstyle." },
      { type: "subtitle", content: "Doelgroep" }, // Nog een subtitel
      { type: "bold-small-subtitle", content: "Primaire doelgroep:" },
      { type: "boldtexttop", content: "Leeftijd:", aditionalContent: "16-25 jaar" },
      { type: "boldtext", content: "Locatie:", aditionalContent: "Roosendaal en omliggende steden" },
      { type: "boldtext", content: "Interesses:", aditionalContent: "Fans van rawstyle en aanverande hardstyle-evenementen" },
      { type: "bold-small-subtitle", content: "Secundaire doelgroep:" },
      { type: "opsom-text-top", content: "Gelegenheidsbezoekers die openstaan voor een unieke uitgaanservaring." },
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "USP'S" }, // Nog een subtitel
      { type: "boldtexttop", content: "Uniek concept:", aditionalContent: "Subgenres die in de vergetelheid zijn geraakt worden opnieuw tot leven gebracht." },
      { type: "boldtext", content: "Inclusiviteit:", aditionalContent: "Het hele spectrum van rawstyle komt aan bod, van melodieus tot donker en rauw." },
      { type: "boldtext", content: "Thema:", aditionalContent: "Een winterse, mysterieuze sfeer gekoppeld aan de energieke kracht van rawstyle." },
      { type: "boldtext", content: "Centrale locatie:", aditionalContent: "Club Verzo, bekend in Roosendaal en goed bereikbaar." },
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Conceptueel plan" }, // Nog een subtitel
      { type: "image", content: "/img/FW-concept.png"},
      { type: "text", content: "Voor de line-up hebben we gezocht naar artiesten die perfect aansluiten bij ons concept. We hebben ervoor gekozen om voor elk subgenre binnen raw hardstyle een artiest te boeken. Hiervoor hebben we een overzicht samengesteld met 70 artiesten en het bijbehorende subgenre dat zij draaien." },
      { type: "text", content: "Uiteindelijk hebben we de volgende artiesten geboekt voor de verschillende subgenres:" },
      { type: "image", content: "/img/FW-lineup.png"},
      { type: "text", content: "Het totale budget voor de line-up bedroeg 3000 euro, waarbij we ervoor hebben gekozen het grootste deel te investeren in twee grote artiesten. We hebben bewust gekozen voor The Saints, die al een tijdje in opkomst zijn en een hype creëren waarmee we zeker wisten dat we publiek zouden aantrekken. Daarnaast hebben we Vasto geboekt om extra bekendheid aan de line-up toe te voegen. Naast deze twee grote namen hebben we bewust gekozen voor twee wat kleinere artiesten en twee relatief onbekende artiesten." },
      { type: "text", content: "Om nieuw talent een kans te geven, hebben we een DJ-contest georganiseerd. De winnaar van deze wedstrijd mocht het evenement openen, wat ideaal was gezien het vroege tijdstip en het beperkte publiek aan het begin. Bovendien trok dit extra publiek, aangezien deelnemers vaak vrienden en supporters meenemen. Na een selectie van vier finalisten hebben onze volgers via een stemronde bepaald wie de winnaar werd." },
      { type: "text", content: "De line-up is bewust opgebouwd in chronologische volgorde, waarbij we zijn gestart met de oudere subgenres en overgingen naar de nieuwere stijlen. Hoewel we in eerste instantie een iets andere volgorde in gedachten hadden, hebben we rekening gehouden met de voorkeuren van de agency van een van de artiesten. Desondanks hebben we grotendeels vastgehouden aan de opbouw van oud naar nieuw, zodat het concept van evolutie binnen de raw hardstyle duidelijk naar voren komt. Tijdens het conversatie-event hebben we de artiesten en hun bijbehorende subgenres geïntroduceerd met interludes die werden afgespeeld voorafgaand aan hun optreden." },
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Marketingstrategie" }, // Nog een subtitel
      { type: "small-subtitle", content: "Owned Media" },
      { type: "text", content: "Voor de promotie van ons evenement zullen we dagelijks social media posts doen die ons evenement promoten. Om dit te realiseren maken we gebruik van een Instagram, TikTok en Facebook-pagina. TikTok zal voornamelijk gebruikt worden voor het opdoen van nieuwe volgers. De communicatiestijl op TikTok zal voornamelijk informeel zijn met een soms wat grappige insteek. TikTok zal voornamelijk gebruikt worden om merkbewustzijn te creëren." },
      { type: "text", content: "Onze Instagram pagina zal formeler zijn, en meer informatief dan de TikTok pagina. Het hoofddoel van de Instagram-pagina is om zoveel mogelijk tickets te verkopen. We zullen hier ook gebruik maken van betaalde promotie met een verwijs link naar de ticketverkoop. Betaalde promotie zal in Reel, Story als Carousel formaat toegepast worden." },
      { type: "small-subtitle", content: "Design en storytelling" },
      { type: "text", content: "Het design van onze owned media-content moet de koude sfeer van het winterseizoen uitstralen en tegelijkertijd de vergeten subgenres symboliseren die als het ware zijn vastgevroren. Deze elementen willen we tot leven brengen en laten ontdooien in onze visuele uitingen." },
      { type: "text", content: "Voorbeelden praktische toepassingen op content: Bekendmaking line up: artiesten verwerken in een ijsblok als teaser, later onthullen we de artiest in een post waarin het ijs is gesmolten etc." },
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Zichtbaarheid vooraf" }, // Nog een subtitel
      { type: "text", content: "Er is vooraf uitgebreide zichtbaarheid gecreëerd voor Frostwave via een combinatie van owned, paid en earned media." },
      { type: "boldtext", content: "Social media:", aditionalContent: "Regelmatige posts, story-updates, en interactie met volgers op Instagram. De DJ-contest zorgde voor extra bereik en betrokkenheid." },
      { type: "image", content: "/img/FW-posts.png", imgtext: "Posts Instagram", content2: "/img/FW-tiktoks.png", imgtext2: "Posts TikTok"},
      { type: "small-subtitle", content: "Reels Instagram:"},
      { type: "image", content: "/img/FW-reels.png"},
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "small-subtitle", content: "Posters"},
      { type: "text", content: "We hebben poster verspreid op plekken waar we denken dat onze doelgroep veel is." },
      { type: "image", content: "/img/FW-poster-1.png", imgtext: "Op school", content2: "/img/FW-poster-2.png", imgtext2: "In de gym"},
      { type: "image", content: "/img/FW-poster-3.png", imgtext: "Buiten de club"},
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Earned Media"},
      { type: "text", content: "Artikelen en vermeldingen op relevante platforms in de hardstyle community. (Appic, Hardstyle.com, Partyflock, Ticketswap.)" },
      { type: "image", content: "/img/FW-earned-1.png"},
      { type: "text", content: "Via verschillende kanalen is earned media gegenereerd. De DJ-contest deelnemers en influencers in de hardstyle-scene deelden het evenement spontaan met hun volgers, wat zorgde voor een organische boost in zichtbaarheid en geloofwaardigheid." },
      { type: "image", content: "/img/FW-earned-2.png"},
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Paid Media" }, // Nog een subtitel
      { type: "text", content: "We hebben voor paid media verschillende dingen geprobeerd. Zoals flyers, giveaways, influencers benaderen en advertenties draaien op meta." },
      { type: "image", content: "/img/FW-paid-1.png", imgtext: "Marketingschema", content2: "/img/FW-paid-2.png", imgtext2: "Flyers (800 verspreid bij Shockerz en Gearbox)"},
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Aansluiting promotie-uitingen bij concept en kernwaarden" }, // Nog een subtitel
      { type: "text", content: "Alle promotie-uitingen waren sterk verbonden met het Frostwave-concept: “Rauw in de Kou”. Dit werd weerspiegeld in:" },
      { type: "opsom-text-top", content: "• Een consistent gebruik van visuele elementen (ijsachtige graphics, neon roze en blauw) die perfect pasten bij de koude, rauwe sfeer van het evenement." },    
      { type: "opsom-text", content: "• Creatieve en verrassende content, zoals de neon-geïnspireerde visuals en pakkende Nederlandse captions die de kernwaarden (energie, vernieuwing, en humor) benadrukten." },    
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Conversatie tijdens het evenement" }, // Nog een subtitel    
      { type: "text", content: "Tijdens het evenement werd het conversatie-element versterkt door middel van Live updates en verhalen op social media en interactieve polls tijdens het event. Ook deelde we Interactieve momenten zoals het betrekken van het publiek in reacties op posts en het delen van video's direct vanuit de club." },
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Nabeleving van het evenement" }, // Nog een subtitel    
      { type: "opsom-text", content: "• Foto's en video's van het evenement werden snel gedeeld via de officiële social media-kanalen, met bijzondere focus op de hoogtepunten (zoals de opening door DJ Yoker en optredens van headliners). Dit is toegevoegd aan een hoogtepunt op Instagram zodat je die altijd kunt terugzien." },    
      { type: "opsom-text", content: "• Bezoekers deelden hun ervaringen via stories en posts, wat de nabeleving versterkte." },    
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Mond-tot-mondpromotie" }, // Nog een subtitel
      { type: "text", content: "De DJ-contest deelnemers, artiesten en bezoekers werden actief betrokken als ambassadeurs van het evenement. Zij promootten Frostwave via hun eigen netwerken, wat zorgde voor sterke mond-tot-mondpromotie. De doelgroep werd op natuurlijke wijze betrokken bij het verspreiden van het concept en de kernwaarden." },
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Bezoekersaantallen en sfeer op het evenement" }, // Nog een subtitel
      { type: "text", content: "Frostwave heeft met succes een grote groep bezoekers aangetrokken. De capaciteit van Club Verzo was (bijna) volledig benut, zonder dat het evenement te druk aanvoelde. De balans tussen een energieke sfeer en voldoende ruimte voor comfort zorgde voor een prettige ervaring voor alle aanwezigen." },
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Conclusie" }, // Nog een subtitel
      { type: "text", content: "Frostwave 2025 was een succesvol evenement dat de rauwe energie van de rawstylecommunity naar voren bracht. Er waren echter belangrijke leermomenten die moeten worden opgevolgd om de volgende editie nog sterker te maken. Door de marketingcampagne eerder op te starten, technische zaken beter af te stemmen en meer aandacht te geven aan de backstagebeleving, kan de impact en de algehele ervaring voor zowel bezoekers als artiesten verder worden verbeterd. Het is cruciaal om de geleerde lessen om te zetten in concrete acties om de groei van het evenement te waarborgen." },
      { type: "text", content: "Dit project was een geweldige kans om mijn vaardigheden in eventplanning, marketing en social media te verbeteren. Ik kijk ernaar uit om deze ervaringen toe te passen in toekomstige projecten." }
    ],
    fullDescription: "Frostwave was een multidisciplinair project waarin ik een compleet evenement van A tot Z heb ontwikkeld, georganiseerd en gepositioneerd. Het concept draait om de herontdekking van vergeten subgenres binnen raw hardstyle in een mysterieuze winterse setting - “Rauw in de Kou”.",
    technologies: ["Adobe Photoshop & Illustrator", "Premiere Pro", "Meta Ads Manager", "Instagram", "TikTok"],
    skills: ["Photoshop", "Illustrator", "Market Research", "Data Analysis", "Event planning", "Social Media"],
    instagramLink: "https://www.instagram.com/frostwave.event/"
  },
  {
    id: "3",
    title: "NewZ",
    description: "Het maken van een product, die ervoor zorgt dat generative AI de nieuws ervaring voor lezers verbetert.",
    image: "/img/NewZlogo.png",
    categories: ["design", "development", "research"],
    date: "November 2023",
    content: [
      { type: "text", content: "LiveWall is een creatief digitaal bureau met een team van denkers en makers in zowel de creatieve als technische industrie. Ze zijn gespecialiseerd in van het ontwikkelen van een digitale marketingstrategie tot het bouwen van online platforms en het creëren van klikbare content tot het organiseren van (hybride) evenementen. Ze werken in 3 kernteams: Platform & Apps, Engagement & Gaming en Studio's. LiveWall heeft ons gevraagd om te onderzoeken wat de impact van AI kan hebben op het nieuws in de toekomst." },
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "De opdracht" }, // Nog een subtitel
      { type: "text", content: "Het doel van het project is om te kijken wat de mogelijkheden zijn om de journalistiek te verbeteren door middel van generatieve AI. Hierbij is de bedoeling dat er bekeken wordt wat de mogelijkheden zijn op dit gebied, wat er al bestaat en wat er nog mogelijk is in de toekomst. Om hierachter te komen zullen wij als groep onderzoek gaan doen naar dit onderwerp. Het doel is om een product te maken dat ervoor zorgt dat generative AI de nieuws ervaring voor lezers verbetert en dat journalisten de artikelen makkelijker kunnen maken. De kans die wij benutten met dit project is de nieuwservaring van de lezers/kijkers verbeteren door het gebruik van AI op grotere schaal te gebruiken." },
      { type: "subtitle", content: "Discover" }, // Nog een subtitel
      { type: "flex-text", content: "Om meer te weten te komen over hoe vaak en waarop mensen het nieuws volgen, hebben we een enquête opgesteld. Deze is ingevuld door 166 mensen van verschillende leeftijden. Hieruit is gekomen dat hoe lager de leeftijdscategorie, hoe minder nieuws er wordt gevolgd. Hierna zijn we biebonderzoek gaan doen naar de nieuwsconsumptie. De resultaten van de enquête hebben we toen vergeleken met de resultaten van het onderzoek en hieruit hebben we onze doelgroep vastgesteld: jongvolwassenen tussen de 18 en 29 jaar.",
        image: "/img/newz-1.jpg"},
      { type: "flex-text", content: "Na het vaststellen van de doelgroep hebben we de enquête er weer bij gepakt en gekeken naar hoe de personen van onze doelgroep het nieuws volgen. Hieruit is gebleken dat er een enorme voorkeur uitgaat naar shorts video's van minder dan 1 minuut.",
        image: "/img/newz-2.jpg"},
      { type: "text", content: "Om een beter beeld te krijgen heb ik 2 interviews gehouden met mensen uit onze doelgroep om te ontdekken over hoe mensen het nieuws volgen en wat hun struikelblokken daarbij zijn. Ook wilde ik te weten komen welke nieuwsbronnen ze gebruiken, welke problemen ze ervaren en welke ideeën ze hebben over hoe nieuws beter kan worden gepresenteerd."},
      { type: "text", content: "Hier zijn enkele belangrijke punten die uit deze interviews kwamen:" },
      { type: "opsom-text-top", content: "• Nieuws wat je op sociale media tegenkomt is minder snel betrouwbaar" },    
      { type: "opsom-text-bottom", content: "• Gebrek aan interesse. Doordat nieuws vaak niet leuk is of op een saaie manier wordt gepubliceerd, is er minder interesse om het nieuws te volgen." },    
      { type: "text", content: "Hierna hebben we de volgende onderzoeksvragen opgesteld om een duidelijk begrip te krijgen van wat er moet worden onderzocht en om een richting te bieden voor het onderzoek:" },
      { type: "small-subtitle", content: "Hoofdvraag:" }, 
      { type: "opsom-text-top", content: "Hoe zorgen wij ervoor dat AI de nieuwswereld veranderd zodat meer jongeren het nieuws gaan volgen?" },
      { type: "small-subtitle", content: "Deelvragen:" }, 
      { type: "opsom-text-top", content: "• Hoe ziet de huidige implementatie van AI eruit in de nieuwswereld?" },
      { type: "opsom-text", content: "• Welke manieren van het gebruiken van AI zijn effectief?" },
      { type: "opsom-text", content: "• Wat zijn de nadelen in de huidige implementatie van AI?" },
      { type: "opsom-text", content: "• Hoe beïnvloedt de implementatie van AI de objectiviteit en betrouwbaarheid van nieuwsberichtgeving?" },
      { type: "opsom-text", content: "• In hoeverre verbetert AI de personalisatie van nieuwsconsumptie voor individuele lezers?" },
      { type: "opsom-text-bottom", content: "• Wat zijn de ethische en maatschappelijke implicaties van het gebruik van AI in de redactionele besluitvorming van nieuwsorganisaties?" },
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "text", content: "Ook hebben we onderzoek gedaan naar de mogelijkheden van AI. Hieruit is gekomen dat AI een enorme potentie heeft om te groeien in verschillende industrieën. Ook heb ik interviews gehouden met een expert, studenten journalisme, onderzoek gedaan naar de huidige implementatie van AI in de nieuwswereld en de nadelen van AI. Hieruit is gekomen dat sommige grote mediabedrijven al gebruik maken van AI om bijvoorbeeld nieuwsproductiecapaciteiten te verbeteren. Daarnaast is gebleken dat het vele gebruik van AI kan leiden tot beschadiging van het vertrouwen van de mensen." },
      { type: "subtitle", content: "Define" },
      { type: "flex-text", content: "Om de doelgroep beter te begrijpen hebben we aan de hand van deze onderzoeken een empathy map en een persona gemaakt. Om onze creativiteit aan te wakkeren hebben we samen met de docent een design challenge opgesteld: ontwerp een omgeving om jongvolwassenen in de leeftijd van 18-29 jaar te laten interesseren in nieuws zodat ze weten wat er gaande is.",
        image: "/img/newz-3.png"},
      { type: "text", content: "Hierna hebben we How-Might-We-vragen gemaakt om innovatieve oplossingen te verkennen:" },
      { type: "opsom-text-top", content: "• Hoe gaan we jongvolwassenen van 18-29 jaar laten \"snacken\" van het nieuws zodat we hun betrokkenheid bij nieuws vergroten." },
      { type: "opsom-text", content: "• Hoe kunnen we AI inzetten om nieuwsverhalen te selecteren en aanbevelingen te doen op basis van de persoonlijke interesses en voorkeuren van jongvolwassenen?" },
      { type: "opsom-text-bottom", content: "• Hoe kunnen we AI inzetten om nieuws op een visueel aantrekkelijke manier te presenteren, zoals infographics of korte video's, om jongvolwassenen aan te spreken die niet van lange teksten houden?" },
      { type: "break", content: "" }, // Witregel toevoegen
      { type: "subtitle", content: "Design" },
      
    ],
    fullDescription: "Dit project betrof het herontwerpen van de gebruikersinterface voor een bestaande mobiele app. Na uitgebreid gebruikersonderzoek heb ik pijnpunten geïdentificeerd en een nieuw ontwerp gecreëerd dat de gebruikerservaring significant verbeterde. Het herontwerp resulteerde in een 40% hogere gebruikerstevredenheid en 25% meer dagelijkse actieve gebruikers.",
    technologies: ["Figma", "Adobe XD", "Sketch", "InVision", "User Testing"],
    skills: ["Figma", "UI/UX", "Prototyping", "Market Research", "Javascript", "React", "User Testing"],
    demoLink: "https://demo-project.com"
  },
  // {
  //   id: "4",
  //   title: "Marktonderzoek Sociale Media",
  //   description: "Uitgebreid onderzoek naar sociale media gebruikspatronen onder jongeren",
  //   image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
  //   categories: ["research", "data"],
  //   date: "Mei 2023", 
  //   fullDescription: "Voor dit onderzoeksproject heb ik de sociale media gebruikspatronen onder jongeren tussen 15-25 jaar onderzocht. Het onderzoek omvatte zowel kwalitatieve als kwantitatieve methoden, waaronder enquêtes, interviews en data-analyse. De resultaten boden inzicht in opkomende trends en voorkeursplatformen, wat waardevol was voor marketingstrategieën gericht op deze demografische groep.",
  //   fullDescription2: "tests",
  //   technologies: ["SPSS", "Google Analytics", "Survey Monkey", "Excel", "Power BI"],
  // },
  // {
  //   id: "5",
  //   title: "Mobiele Fitness App",
  //   description: "Een fitness app die gepersonaliseerde trainingsschema's genereert",
  //   image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  //   categories: ["development", "design"],
  //   date: "Juni 2023",
  //   fullDescription: "Ik heb een mobiele fitness app ontwikkeld die gepersonaliseerde trainingsschema's genereert op basis van gebruikersdoelen, ervaring en beschikbare apparatuur. De app houdt voortgang bij, geeft feedback op oefeningstechniek en past schema's aan op basis van prestaties. Dit was een uitdagend project dat me hielp mijn vaardigheden in mobiele app-ontwikkeling te verbeteren.",
  //   technologies: ["React Native", "Firebase", "Redux", "Node.js", "Express"],
  //   githubLink: "https://github.com",
  //   demoLink: "https://demo-project.com"
  // },
  // {
  //   id: "6",
  //   title: "Duurzaamheidsonderzoek",
  //   description: "Onderzoek naar duurzame praktijken in de IT-sector",
  //   image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
  //   categories: ["research"],
  //   date: "Augustus 2023",
  //   fullDescription: "Dit onderzoeksproject richtte zich op duurzame praktijken in de IT-sector. Ik analyseerde de huidige stand van zaken, identificeerde uitdagingen en mogelijkheden, en stelde aanbevelingen op voor bedrijven om hun ecologische voetafdruk te verkleinen. Het onderzoek benadrukte het belang van groene hosting, energiezuinige datacenters en duurzame softwareontwikkelingspraktijken.",
  //   technologies: ["Research Methodologies", "Data Analysis", "Academic Writing"],
  // },
];
