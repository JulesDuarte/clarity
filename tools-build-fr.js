// Generates the French site into clarity/fr/ from the Romanian pages.
// Same approach as tools-build-en.js: whole text nodes / attributes are
// swapped, never substrings.
const fs = require('fs');
const path = require('path');

const SRC = __dirname;
const OUT = path.join(SRC, 'fr');

const PAGES = {
  'index.html': 'index.html',
  'ingrediente.html': 'ingredients.html',
  'invata.html': 'apprendre.html',
  'product.html': 'produit.html',
  'faq.html': 'faq.html',
  'contact.html': 'contact.html',
};

// Headlines where French word order differs from Romanian.
const SPECIAL = [
  ['Suplimente cu formule <br><em>transparente</em>.', 'Des compléments aux formules <br><em>transparentes</em>.'],
  ['Nu ar trebui să ai nevoie de <em>un dicționar</em> ca să alegi un supliment.', 'Vous ne devriez pas avoir besoin d’<em>un dictionnaire</em> pour choisir un complément.'],
  ['Ai grijă de sănătatea ta, <em>oriunde</em> te-ai afla.', 'Prenez soin de votre santé, <em>où que</em> vous soyez.'],
  ['Începe-ți rutina de <em>wellness</em> cu Clarity.', 'Commencez votre routine <em>bien-être</em> avec Clarity.'],
  ['<span>Transparența face</span> <br><em>diferența</em>.', '<span>La transparence fait</span> <br><em>la différence</em>.'],
  ['Fiecare ingredient are o <em>poveste</em>.', 'Chaque ingrédient a une <em>histoire</em>.'],
  ['<em>Standardele</em> după care alegem <br>fiecare ingredient.', 'Les <em>standards</em> qui guident <br>le choix de chaque ingrédient.'],
  ['<em>Descoperă</em> o abordare mai clară <br>a suplimentelor.', '<em>Découvrez</em> une approche plus claire <br>des compléments.'],
  ['<em>Explorează</em> știința din <br>spatele fiecărei formule.', '<em>Explorez</em> la science <br>derrière chaque formule.'],
  ['Fiecare ingredient <em>contează</em>.', 'Chaque ingrédient <em>compte</em>.'],
  ['<span>O formulă <em>completă</em>,</span> <br>construită pentru fiecare zi.', '<span>Une formule <em>complète</em>,</span> <br>conçue pour chaque jour.'],
  ['<em>Transparență</em> până la sursa <br>fiecărui ingredient.', '<em>Transparence</em> jusqu’à la source <br>de chaque ingrédient.'],
  ['Încredere construită <br>din <em>experiențe reale</em>.', 'Une confiance bâtie <br>sur des <em>expériences réelles</em>.'],
  ['Tot ce trebuie să știi <br>despre <em>Daily Essentials</em>.', 'Tout ce qu’il faut savoir <br>sur <em>Daily Essentials</em>.'],
  ['Tot ce trebuie să știi <br>despre Clarity.', 'Tout ce qu’il faut savoir <br>sur Clarity.'],
  ['Răspunsuri clare la cele <br>mai <em>frecvente întrebări</em>.', 'Des réponses claires aux <br><em>questions les plus fréquentes</em>.'],
  ['Cu ce te putem <br><em>ajuta astăzi?</em>', 'Comment pouvons-nous <br><em>vous aider aujourd’hui ?</em>'],
  ['trăiește <em>limpede</em>', 'vivez <em>clairement</em>'],
  ['Explorează ingredientele din formulele Clarity, află de unde provin, <br>de ce le-am ales și ce rol au în organism.',
   'Explorez les ingrédients des formules Clarity : leur origine, <br>les raisons de notre choix et leur rôle dans l’organisme.'],
  ['Și ingredientele de suport sunt atent alese pentru a asigura <br>stabilitatea, calitatea și administrarea eficientă a fiecărei formule.',
   'Les ingrédients de support sont choisis avec le même soin, pour garantir <br>la stabilité, la qualité et la bonne assimilation de chaque formule.'],
  ['Articole bazate pe cercetare despre nutriție, sănătate și <br>ingredientele care susțin o rutină mai bună.',
   'Des articles fondés sur la recherche autour de la nutrition, de la santé <br>et des ingrédients d’une meilleure routine.'],
];

const T = {
  // ---- chrome / nav / footer ----
  'Magazin': 'Boutique', 'Ingrediente': 'Ingrédients', 'Învață': 'Apprendre', 'Despre noi': 'À propos',
  'Parteneri': 'Partenaires', 'Cont': 'Compte', 'Coș': 'Panier', 'Principal': 'Principal', 'Subsol': 'Pied de page',
  'Meniu': 'Menu', '30% reducere la prima comandă': '30 % de remise sur votre première commande',
  'Fă prima comandă': 'Passer ma première commande',
  'Rămâi conectat cu Clarity': 'Restez connecté avec Clarity',
  'Primește articole despre sănătate, noutăți despre produse și recomandări bazate pe cercetare, direct în inbox-ul tău.':
    'Recevez des articles santé, les nouveautés produits et des recommandations fondées sur la recherche, directement dans votre boîte mail.',
  'Introdu adresa ta de email': 'Saisissez votre adresse e-mail', 'Adresă de email': 'Adresse e-mail',
  'Abonează-te': 'S’abonner', 'PRODUSE': 'PRODUITS', 'Toate': 'Tous', 'Somn': 'Sommeil',
  'Performanță': 'Performance', 'Esențiale': 'Essentiels', 'SOCIAL': 'RÉSEAUX', 'SUPORT': 'AIDE',
  'Întrebări frecvente': 'Questions fréquentes', 'Contact': 'Contact', 'Livrare': 'Livraison', 'Retur': 'Retours',
  'LEGAL': 'MENTIONS LÉGALES', 'Termeni și condiții': 'Conditions générales',
  'Politica de confidențialitate': 'Politique de confidentialité', 'Politica de cookies': 'Politique de cookies',
  'DESPRE': 'À PROPOS', 'Blog': 'Blog', '© 2026 Clarity. Toate drepturile rezervate.': '© 2026 Clarity. Tous droits réservés.',
  'trăiește': 'vivez', 'limpede': 'clairement',

  // ---- home ----
  'Clarity — Suplimente cu formule transparente': 'Clarity — Des compléments aux formules transparentes',
  'Suplimente cu ingrediente, forme și doze explicate clar, ca să poți alege informat ce pui în corpul tău.':
    'Des compléments dont les ingrédients, les formes et les dosages sont expliqués clairement, pour choisir en connaissance de cause ce que vous mettez dans votre corps.',
  'de farmaciști recomandă Clarity™': 'pharmaciens recommandent Clarity™',
  'fără compensație.': 'sans contrepartie.', 'Află de ce': 'Découvrir pourquoi',
  'Descoperă suplimente': 'Découvrir les compléments', 'Descarcă aplicația': 'Télécharger l’application',
  'FIECARE LOT TESTAT INDEPENDENT': 'CHAQUE LOT TESTÉ INDÉPENDAMMENT',
  'INGREDIENTE TRASABILE LA SURSĂ': 'INGRÉDIENTS TRAÇABLES À LA SOURCE',
  'DISPONIBIL ÎN FARMACIILE MEDIMFARM': 'DISPONIBLE EN PHARMACIES MEDIMFARM',
  'Femeie ținând un supliment Clarity': 'Femme tenant un complément Clarity',
  'Ingrediente 100%': 'Ingrédients 100 %', 'trasabile': 'traçables',
  'Suplimente': 'Compléments fabriqués', 'fabricate etic': 'de façon éthique',
  'Formule verificate': 'Formules validées', 'de farmaciști': 'par des pharmaciens',
  'Certificat USP': 'Certifié USP', 'Susținute de studii': 'Appuyées par des études', 'clinice': 'cliniques',
  'Transparență în': 'Transparence dans', 'fiecare formulă': 'chaque formule',
  'COLECȚIA CLARITY': 'LA COLLECTION CLARITY', 'Produse clare pentru nevoi reale.': 'Des produits clairs pour des besoins réels.',
  'Vezi toate produsele': 'Voir tous les produits', 'În curând': 'Bientôt',
  'Alege următorul produs': 'Choisissez le prochain produit', 'Bestseller': 'Best-seller', 'Essential': 'Essentiel',
  'Fiecare formulă, trecută prin filtrul unui farmacist.': 'Chaque formule, passée au crible d’un pharmacien.',
  'Farmaciștii Medimfarm au analizat produsele Clarity din perspectiva formei ingredientelor, dozei, formulei și modului de utilizare.':
    'Les pharmaciens Medimfarm ont analysé les produits Clarity sous l’angle de la forme des ingrédients, du dosage, de la formulation et du mode d’emploi.',
  'Farmaciștii primesc mostre': 'Les pharmaciens reçoivent des échantillons',
  'Ca să le poată analiza direct și să își formeze propria opinie despre formulă.':
    'Afin de les examiner directement et de se forger leur propre avis sur la formule.',
  'Opiniile nu sunt plătite': 'Les avis ne sont pas rémunérés',
  'Farmaciștii nu sunt remunerați pentru ceea ce aleg să scrie.': 'Les pharmaciens ne sont pas rémunérés pour ce qu’ils choisissent d’écrire.',
  'Recenzii colectate transparent': 'Des avis recueillis en toute transparence',
  'Fiecare opinie este publicată cu numele și rolul farmacistului, fără să fie modificată de Clarity.':
    'Chaque avis est publié avec le nom et la fonction du pharmacien, sans modification de la part de Clarity.',
  '42 REVIEW-URI': '42 AVIS', 'Anterior': 'Précédent', 'Următor': 'Suivant',
  'Farmacist Dr. Max': 'Pharmacienne, Dr. Max', 'Farmacist': 'Pharmacien',
  'O formă mai eficientă de magneziu': 'Une forme de magnésium plus efficace',
  '„Apreciez că produsul comunică foarte clar forma de magneziu folosită și cantitatea efectivă per porție. Este genul de informație care îi ajută pe oameni să compare produsele mai corect.”':
    '« J’apprécie que le produit indique très clairement la forme de magnésium utilisée et la quantité réelle par portion. C’est le genre d’information qui aide vraiment à comparer les produits. »',
  'Citește tot review-ul': 'Lire l’avis complet',
  'Complex natural de vitamine și minerale': 'Un complexe naturel de vitamines et minéraux',
  '„Un supliment echilibrat ce oferă nutrienți esențiali, susținând performanța fizică și mentală zilnică.”':
    '« Un complément équilibré qui apporte des nutriments essentiels et soutient la performance physique et mentale au quotidien. »',
  'Vezi review-ul complet': 'Voir l’avis complet',
  'Extract concentrat de ghimbir organic': 'Extrait concentré de gingembre bio',
  '„Ajută la reducerea inflamațiilor și îmbunătățește digestia fără efecte secundare.”':
    '« Il aide à réduire les inflammations et améliore la digestion, sans effets secondaires. »',
  'Citește întregul review': 'Lire l’avis en entier',
  'Multi-Vitamine 30 cps': 'Multivitamines 30 gél.', 'Ghimbir Organic 60 cps': 'Gingembre Bio 60 gél.',
  'PROBLEMA DIN PIAȚĂ': 'LE PROBLÈME DU MARCHÉ',
  'De multe ori auzi ce să iei, dar de prea puține de ce contează, ce conțin suplimentele și în ce formă.':
    'On vous dit souvent quoi prendre, mais rarement pourquoi cela compte, ce que contiennent les compléments et sous quelle forme.',
  'Borcane cu etichete greu de descifrat': 'Des pots aux étiquettes difficiles à déchiffrer',
  'ABORDAREA NOASTRĂ': 'NOTRE APPROCHE',
  'Claritatea începe cu a ști ce pui în corp.': 'La clarté commence par savoir ce que l’on met dans son corps.',
  'Îți arătăm ingredientele, dozele, originea și testele fiecărui produs. Lucrăm la standarde mai înalte decât minimul obligatoriu și facem fiecare etapă ușor de urmărit.':
    'Nous vous montrons les ingrédients, les dosages, l’origine et les tests de chaque produit. Nous travaillons à des standards plus élevés que le minimum légal et rendons chaque étape facile à suivre.',
  'Vezi cum construim produsele': 'Voir comment nous concevons nos produits',
  'Plante crescute în seră': 'Plantes cultivées sous serre',
  'APLICAȚIA CLARITY': 'L’APPLICATION CLARITY',
  'Urmărește-ți rutina zilnică, primește notificări personalizate și construiește obiceiuri sănătoase cu aplicația Clarity.':
    'Suivez votre routine quotidienne, recevez des rappels personnalisés et installez des habitudes saines avec l’application Clarity.',
  'Aplicația Clarity pe telefon': 'L’application Clarity sur un téléphone',
  'EXPERIENȚE REALE': 'EXPÉRIENCES RÉELLES', 'Clarity, în rutina de zi cu zi.': 'Clarity, au quotidien.',
  'PACHET EXCLUSIV PENTRU PRIMA COMANDĂ': 'COFFRET EXCLUSIF POUR LA PREMIÈRE COMMANDE',
  'Pachetul Clarity Essentials': 'Le coffret Clarity Essentials',
  'Pachet Clarity Essentials': 'Coffret Clarity Essentials',
  'INCLUDE LA PRIMA COMANDĂ': 'INCLUS AVEC VOTRE PREMIÈRE COMMANDE',
  'Ghid digital de utilizare': 'Guide d’utilisation numérique',
  'Învață cum să îți construiești o rutină simplă și eficientă.': 'Apprenez à bâtir une routine simple et efficace.',
  'Organizator pentru suplimente': 'Organiseur à compléments',
  'Păstrează produsele organizate și ușor de administrat.': 'Gardez vos produits rangés et faciles à prendre.',
  'Acces Premium în aplicația Clarity': 'Accès Premium à l’application Clarity',
  'Monitorizează rutina, primește notificări și urmărește progresul.': 'Suivez votre routine, recevez des rappels et mesurez vos progrès.',
  'Livrare gratuită': 'Livraison offerte', 'Disponibilă pentru prima comandă.': 'Valable sur la première commande.',
  'Total': 'Total', 'Comandă pachetul Clarity': 'Commander le coffret Clarity',
  'COMPARAȚIE TRANSPARENTĂ': 'UNE COMPARAISON TRANSPARENTE',
  'Glisează pentru a compara': 'Faites glisser pour comparer',
  'INGREDIENT': 'INGRÉDIENT', 'CLARITY SLEEP': 'CLARITY SLEEP', 'SUPLIMENT OBIȘNUIT': 'COMPLÉMENT ORDINAIRE',
  'Melatonină': 'Mélatonine', 'Magneziu (bisglicinat)': 'Magnésium (bisglycinate)', 'L-Theanină': 'L-Théanine',
  'Extract de Ashwagandha': 'Extrait d’ashwagandha', 'Vitamina B6': 'Vitamine B6',
  '40 mg (oxid)': '40 mg (oxyde)', '60 mg (oxid)': '60 mg (oxyde)', '10 mg (oxid)': '10 mg (oxyde)',
  'Vezi toate ingredientele': 'Voir tous les ingrédients',
  'ÎNTREBĂRI FRECVENTE': 'QUESTIONS FRÉQUENTES',
  'Cum aleg suplimentul potrivit pentru mine?': 'Comment choisir le complément qui me convient ?',
  'Îți recomandăm să pornești de la obiectivul tău — somn, energie sau imunitate — iar fișa fiecărui produs îți arată exact ce conține și în ce doză.':
    'Partez de votre objectif — sommeil, énergie ou immunité — et la fiche de chaque produit vous indique exactement ce qu’il contient et à quel dosage.',
  'Poți filtra produsele după nevoie și compara formulele direct, cu ingredientele și dozele afișate transparent.':
    'Vous pouvez filtrer les produits par besoin et comparer les formules directement, avec les ingrédients et les dosages affichés en toute transparence.',
  'Aplicația Clarity îți poate sugera o rutină personalizată în funcție de răspunsurile tale.':
    'L’application Clarity peut vous proposer une routine personnalisée selon vos réponses.',
  'Toate produsele sunt verificate de farmaciști și testate independent, lot cu lot.':
    'Tous les produits sont validés par des pharmaciens et testés indépendamment, lot par lot.',
  'Poți combina mai multe produse fără suprapuneri de doze — formulele sunt gândite să funcționeze împreună.':
    'Vous pouvez associer plusieurs produits sans cumul de dosages : les formules sont conçues pour fonctionner ensemble.',
  'Dacă ai nevoie de ajutor, echipa noastră îți răspunde oricând prin chat sau email.':
    'Si vous avez besoin d’aide, notre équipe vous répond à tout moment par chat ou par e-mail.',
  'Mâini ținând un borcan Clarity': 'Mains tenant un pot Clarity',

  // ---- ingredients page ----
  'Clarity — Bibliotecă de ingrediente': 'Clarity — Bibliothèque d’ingrédients',
  'Explorează ingredientele din formulele Clarity, află de unde provin, de ce le-am ales și ce rol au în organism.':
    'Explorez les ingrédients des formules Clarity : leur origine, les raisons de notre choix et leur rôle dans l’organisme.',
  'INGREDIENT LIBRARY': 'BIBLIOTHÈQUE D’INGRÉDIENTS',
  'Caută un ingredient...': 'Rechercher un ingrédient...', 'Caută un ingredient': 'Rechercher un ingrédient',
  'Caută': 'Rechercher', 'Ingrediente esențiale': 'Ingrédients essentiels',
  'Sort by': 'Trier par', 'Vizualizare grilă': 'Vue grille', 'Vizualizare listă': 'Vue liste',
  'Descoperă ingredientele de suport': 'Découvrir les ingrédients de support',
  'STANDARDELE CLARITY': 'LES STANDARDS CLARITY',
  'Transparență înainte de toate': 'La transparence avant tout',
  'Fiecare ingredient este complet trasabil, de la sursă până la produsul final. Știm exact de unde provine, cum este procesat și cine îl furnizează.':
    'Chaque ingrédient est entièrement traçable, de la source au produit fini. Nous savons exactement d’où il vient, comment il est transformé et qui le fournit.',
  'Calitate verificată': 'Une qualité vérifiée',
  'Lucrăm exclusiv cu furnizori care respectă standarde internaționale de producție, certificări GMP și procese independente de testare pentru fiecare lot.':
    'Nous travaillons uniquement avec des fournisseurs respectant les standards internationaux de fabrication, la certification GMP et des tests indépendants pour chaque lot.',
  'Aprovizionare responsabilă': 'Un approvisionnement responsable',
  'Selectăm ingrediente provenite din surse responsabile, cu respect pentru mediu, comunitățile locale și practicile etice de producție.':
    'Nous sélectionnons des ingrédients issus de sources responsables, dans le respect de l’environnement, des communautés locales et de pratiques de production éthiques.',
  'Susținute de cercetare': 'Appuyés par la recherche',
  'Preferăm ingrediente pentru care există studii relevante privind eficiența, biodisponibilitatea și siguranța utilizării pe termen lung.':
    'Nous privilégions les ingrédients pour lesquels existent des études sérieuses sur l’efficacité, la biodisponibilité et la sécurité à long terme.',
  'ÎNCEPE CU CLARITY': 'COMMENCEZ AVEC CLARITY', 'Explorează produsele Clarity': 'Explorer les produits Clarity',

  // ---- learn / journal ----
  'Jurnal Clarity — Învață': 'Journal Clarity — Apprendre',
  'Articole bazate pe cercetare despre nutriție, sănătate și ingredientele care susțin o rutină mai bună.':
    'Des articles fondés sur la recherche autour de la nutrition, de la santé et des ingrédients d’une meilleure routine.',
  'JURNAL CLARITY': 'JOURNAL CLARITY',
  'Caută după subiect, ingredient sau autor...': 'Rechercher par sujet, ingrédient ou auteur...',
  'Caută articole': 'Rechercher des articles',
  'CERCETARE': 'RECHERCHE', 'INGREDIENTE': 'INGRÉDIENTS', 'SOMN': 'SOMMEIL', 'NUTRITIE': 'NUTRITION',
  'WELLNESS': 'BIEN-ÊTRE', 'MINERALE': 'MINÉRAUX',
  'Legătura dintre intestin și creier: cum influențează microbiomul claritatea mentală':
    'Le lien intestin-cerveau : comment le microbiote influence la clarté mentale',
  'Cercetările recente arată că microbiomul intestinal influențează mult mai mult decât digestia. Descoperă cum sănătatea intestinului poate avea un impact asupra concentrării, memoriei și stării generale de bine, precum și ce spune știința despre această conexiune.':
    'Les recherches récentes montrent que le microbiote intestinal influence bien plus que la digestion. Découvrez comment la santé intestinale peut agir sur la concentration, la mémoire et le bien-être général — et ce que dit la science de ce lien.',
  'Citește articolul': 'Lire l’article', 'Descoperă mai multe': 'Découvrir plus',
  'Vase Petri cu ingrediente și un caiet de notițe': 'Boîtes de Petri avec des ingrédients et un carnet',
  'Ashwagandha: beneficii susținute de cercetare': 'Ashwagandha : des bienfaits appuyés par la recherche',
  'Cum îți construiești o rutină de seară eficientă': 'Comment bâtir une routine du soir efficace',
  'Ce înseamnă biodisponibilitatea și de ce contează': 'Ce qu’est la biodisponibilité et pourquoi elle compte',
  '5 obiceiuri simple pentru mai multă energie': '5 habitudes simples pour plus d’énergie',
  'Cum influențează microbiomul sănătatea creierului': 'Comment le microbiote influence la santé du cerveau',
  'De ce magneziul este esențial pentru organism': 'Pourquoi le magnésium est essentiel à l’organisme',
  'Vezi mai multe': 'Voir plus',

  // ---- product page ----
  'Daily Essentials — Clarity': 'Daily Essentials — Clarity',
  'Daily Essentials: supliment complet pentru energie, concentrare și starea de bine. Ingrediente trasabile, formule verificate.':
    'Daily Essentials : un complément complet pour l’énergie, la concentration et le bien-être. Ingrédients traçables, formules validées.',
  'Borcanul Clarity Daily Essentials': 'Le pot Clarity Daily Essentials',
  'Imagine 1': 'Image 1', 'Imagine 2': 'Image 2', 'Imagine 3': 'Image 3', 'Imagine 4': 'Image 4', 'Imagine 5': 'Image 5',
  'Următoarea imagine': 'Image suivante', 'Informații nutriționale': 'Informations nutritionnelles',
  '(1,284 recenzii)': '(1 284 avis)',
  'Supliment complet pentru energia, concentrarea și starea de bine.': 'Un complément complet pour l’énergie, la concentration et le bien-être.',
  'Energie': 'Énergie', 'Focus': 'Concentration', 'Imunitate': 'Immunité',
  'Abonament': 'Abonnement', 'Economisești 15%': 'Économisez 15 %', 'Modifici oricând': 'Modifiable à tout moment',
  'Frecvență livrare': 'Fréquence de livraison', 'pentru 30 de zile': 'tous les 30 jours', 'pentru 60 de zile': 'tous les 60 jours',
  'pentru 90 de zile': 'tous les 90 jours', 'Achiziție unică': 'Achat unique',
  'Adaugă în coș': 'Ajouter au panier', 'Achită cu': 'Payer avec',
  'Retur 30 zile': 'Retour sous 30 jours', 'Ingrediente trasabile': 'Ingrédients traçables',
  'Mod de administrare': 'Mode d’emploi',
  'Vitamina D3, Vitamina K2 (MK-7), Vitamina C, Magneziu bisglicinat și Zinc bisglicinat — în doze relevante, alese pentru biodisponibilitate ridicată.':
    'Vitamine D3, vitamine K2 (MK-7), vitamine C, bisglycinate de magnésium et bisglycinate de zinc — à des dosages utiles, choisis pour leur haute biodisponibilité.',
  '2 capsule pe zi, dimineața, cu un pahar de apă. Pentru rezultate optime, administrează zilnic, consecvent.':
    'Deux gélules par jour, le matin, avec un verre d’eau. Pour de meilleurs résultats, prenez-les quotidiennement, avec régularité.',
  'FORMULAT CU UN SCOP': 'FORMULÉ AVEC UNE INTENTION',
  'Ingrediente studiate clinic': 'Des ingrédients étudiés cliniquement',
  'Selectăm ingrediente susținute de cercetare și le folosim în doze relevante, alese pentru beneficii reale și consecvente.':
    'Nous sélectionnons des ingrédients appuyés par la recherche et les utilisons à des dosages utiles, choisis pour des bienfaits réels et constants.',
  'Absorbție optimă': 'Une absorption optimale',
  'Folosim forme de ingrediente cu biodisponibilitate ridicată, astfel încât organismul să poată valorifica fiecare doză cât mai eficient.':
    'Nous utilisons des formes d’ingrédients à haute biodisponibilité, afin que l’organisme tire le meilleur parti de chaque dose.',
  'Formule echilibrate': 'Des formules équilibrées',
  'Fiecare ingredient este ales pentru modul în care completează întreaga formulă, nu doar pentru prezența pe etichetă.':
    'Chaque ingrédient est choisi pour la façon dont il complète l’ensemble de la formule, et non pour sa simple présence sur l’étiquette.',
  'Capsulă cu granule de ingrediente': 'Gélule avec granulés d’ingrédients',
  'CLARITY DAILY ESSENTIALS': 'CLARITY DAILY ESSENTIALS', 'MULTIVITAMINĂ OBIȘNUITĂ': 'MULTIVITAMINE ORDINAIRE',
  'Vitamina D3': 'Vitamine D3', 'Vitamina K2 (MK-7)': 'Vitamine K2 (MK-7)', 'Vitamina C': 'Vitamine C',
  'Zinc (bisglicinat)': 'Zinc (bisglycinate)',
  'RECOMANDATE PENTRU TINE': 'RECOMMANDÉ POUR VOUS', 'Completează-ți rutina de': 'Complétez votre routine',
  'wellness': 'bien-être', 'CLARITY PASSPORT®': 'CLARITY PASSPORT®',
  'Vitamina D3 în formă cristalină': 'Vitamine D3 sous forme cristalline',
  'Obținută din lanolină purificată și utilizată într-o formă cu biodisponibilitate ridicată pentru susținerea sistemului imunitar și a sănătății oaselor.':
    'Issue de lanoline purifiée et utilisée sous une forme à haute biodisponibilité, pour soutenir le système immunitaire et la santé osseuse.',
  'Origine': 'Origine', 'Europa': 'Europe', 'Furnizor': 'Fournisseur', 'Partener certificat GMP': 'Partenaire certifié GMP',
  'Forma utilizată': 'Forme utilisée', 'Vitamina D3 (Colecalciferol)': 'Vitamine D3 (cholécalciférol)',
  'Rol în formulă': 'Rôle dans la formule', 'Imunitate & sănătatea oaselor': 'Immunité et santé osseuse',
  'Imunitate &amp; sănătatea oaselor': 'Immunité &amp; santé osseuse',
  'Testare': 'Tests', 'Laborator independent': 'Laboratoire indépendant',
  'Ce este Daily Essentials?': 'Qu’est-ce que Daily Essentials ?',
  'Un supliment complet, cu vitamine și minerale esențiale în doze relevante, pentru energie, concentrare și imunitate.':
    'Un complément complet, avec des vitamines et minéraux essentiels à des dosages utiles, pour l’énergie, la concentration et l’immunité.',
  'Cum se administrează?': 'Comment le prendre ?',
  '2 capsule pe zi, dimineața, cu un pahar de apă.': 'Deux gélules par jour, le matin, avec un verre d’eau.',
  'În cât timp pot observa beneficiile?': 'Au bout de combien de temps en voit-on les effets ?',
  'Majoritatea utilizatorilor observă rezultate după 4–6 săptămâni de administrare consecventă.':
    'La plupart des personnes constatent des résultats après 4 à 6 semaines de prise régulière.',
  'Pot combina Daily Essentials cu alte produse Clarity?': 'Puis-je associer Daily Essentials à d’autres produits Clarity ?',
  'Da. Formulele sunt gândite să funcționeze împreună, fără suprapuneri de doze.':
    'Oui. Les formules sont conçues pour fonctionner ensemble, sans cumul de dosages.',
  'Sunt ingredientele testate?': 'Les ingrédients sont-ils testés ?',
  'Fiecare lot este testat independent, în laborator, pentru puritate și potență.':
    'Chaque lot est testé indépendamment en laboratoire, pour la pureté et la teneur.',
  'Conține ingrediente artificiale?': 'Contient-il des ingrédients artificiels ?',
  'Nu. Fără coloranți, arome sau umpluturi artificiale.': 'Non. Sans colorants, arômes ni excipients artificiels.',
  'Persoană ținând borcanul Clarity': 'Personne tenant le pot Clarity',
  'RECENZII VERIFICATE': 'AVIS VÉRIFIÉS',
  'recomandă acest produs': 'recommandent ce produit',
  'Recenzii (1284)': 'Avis (1284)', 'Întrebări (37)': 'Questions (37)', 'Recenzii video (58)': 'Avis vidéo (58)',
  'Filtru': 'Filtrer', 'Scrie o recenzie': 'Écrire un avis', 'Sortare': 'Trier', 'Cele mai recente': 'Les plus récents',
  'Acum 5 zile': 'Il y a 5 jours', 'Acum 2 zile': 'Il y a 2 jours', 'Acum 1 săptămână': 'Il y a 1 semaine',
  'O formulă pe care chiar am înțeles-o.': 'Une formule que j’ai vraiment comprise.',
  'Mi-a plăcut faptul că fiecare ingredient este explicat clar și că pot verifica proveniența lui. Aplicația mă ajută să nu uit administrarea zilnică.':
    'J’ai apprécié que chaque ingrédient soit clairement expliqué et de pouvoir vérifier sa provenance. L’application m’aide à ne pas oublier la prise quotidienne.',
  'În sfârșit un brand care explică totul.': 'Enfin une marque qui explique tout.',
  'Mi-a plăcut că pot vedea exact ce conține produsul și de unde provin ingredientele. Totul este prezentat clar, iar aplicația cu mementouri m-a ajutat să îmi transform administrarea suplimentelor într-un obicei.':
    'J’ai aimé voir exactement ce que contient le produit et d’où viennent les ingrédients. Tout est présenté clairement, et l’application de rappels m’a aidée à transformer la prise de compléments en habitude.',
  'Simplu, transparent și ușor de integrat în rutina mea.': 'Simple, transparent et facile à intégrer à ma routine.',
  'Îmi place că formula nu este încărcată cu ingrediente inutile și că fiecare componentă are o explicație clară. Ambalajul este premium, iar aplicația completează foarte bine experiența.':
    'J’aime que la formule ne soit pas alourdie d’ingrédients inutiles et que chaque composant soit clairement expliqué. L’emballage est haut de gamme, et l’application complète très bien l’expérience.',
  'A fost utilă această recenzie?': 'Cet avis vous a-t-il été utile ?',

  // ---- FAQ page ----
  'Întrebări frecvente — Clarity': 'Questions fréquentes — Clarity',
  'Răspunsuri clare la cele mai frecvente întrebări despre produsele, ingredientele și comenzile Clarity.':
    'Des réponses claires aux questions les plus fréquentes sur les produits, les ingrédients et les commandes Clarity.',
  'Categorii întrebări': 'Catégories de questions',
  'Despre Clarity': 'À propos de Clarity', 'Produse': 'Produits', 'Ingrediente & Formule': 'Ingrédients et formules',
  'Ingrediente &amp; Formule': 'Ingrédients &amp; formules',
  'Cum se administrează': 'Mode d’emploi', 'Comenzi & Livrare': 'Commandes et livraison',
  'Comenzi &amp; Livrare': 'Commandes &amp; livraison',
  'Abonamente': 'Abonnements', 'Retururi': 'Retours', 'Calitate & Testare': 'Qualité et tests',
  'Calitate &amp; Testare': 'Qualité &amp; tests',
  'Siguranță & Utilizare': 'Sécurité et usage', 'Siguranță &amp; Utilizare': 'Sécurité &amp; usage',
  'Contul meu': 'Mon compte',
  'Ce este Clarity?': 'Qu’est-ce que Clarity ?',
  'Clarity este un brand de suplimente construit în jurul transparenței: îți arătăm ce conține fiecare formulă, în ce formă și în ce doză, plus de unde provine fiecare ingredient.':
    'Clarity est une marque de compléments bâtie autour de la transparence : nous vous montrons ce que contient chaque formule, sous quelle forme et à quel dosage, ainsi que l’origine de chaque ingrédient.',
  'Care este misiunea Clarity?': 'Quelle est la mission de Clarity ?',
  'Vrem să facem suplimentele ușor de înțeles. Fiecare decizie de formulare este explicată, astfel încât să poți alege informat, nu după promisiuni de pe etichetă.':
    'Nous voulons rendre les compléments faciles à comprendre. Chaque choix de formulation est expliqué, afin que vous décidiez sur la base d’informations et non de promesses d’étiquette.',
  'Ce diferențiază Clarity de alte branduri?': 'Qu’est-ce qui distingue Clarity des autres marques ?',
  'Folosim forme cu biodisponibilitate ridicată în doze relevante, publicăm originea ingredientelor și testăm independent fiecare lot. Nimic nu este ascuns sub termenul „amestec proprietar”.':
    'Nous utilisons des formes à haute biodisponibilité à des dosages utiles, publions l’origine des ingrédients et testons chaque lot de façon indépendante. Rien n’est dissimulé derrière la mention « mélange exclusif ».',
  'Unde sunt fabricate produsele?': 'Où les produits sont-ils fabriqués ?',
  'Produsele sunt fabricate în unități certificate GMP din Uniunea Europeană, cu parteneri care respectă standarde internaționale de producție.':
    'Les produits sont fabriqués dans des sites certifiés GMP au sein de l’Union européenne, avec des partenaires respectant les standards internationaux de fabrication.',
  'Ce produse are Clarity?': 'Quels produits propose Clarity ?',
  'Gama include formule pentru somn, energie și performanță, plus esențiale zilnice precum Daily Essentials, Magnesium Bisglycinate și Omega-3.':
    'La gamme comprend des formules pour le sommeil, l’énergie et la performance, ainsi que des essentiels quotidiens comme Daily Essentials, Magnesium Bisglycinate et Oméga-3.',
  'Cum aleg produsul potrivit pentru mine?': 'Comment choisir le produit qui me convient ?',
  'Pornește de la obiectivul tău — somn, energie sau imunitate. Fișa fiecărui produs îți arată exact ce conține, în ce doză și pentru cine este potrivit.':
    'Partez de votre objectif — sommeil, énergie ou immunité. La fiche de chaque produit indique exactement ce qu’il contient, à quel dosage et à qui il convient.',
  'Pot combina mai multe produse?': 'Puis-je associer plusieurs produits ?',
  'Da. Formulele sunt gândite să funcționeze împreună, fără suprapuneri de doze între produse.':
    'Oui. Les formules sont conçues pour fonctionner ensemble, sans cumul de dosages d’un produit à l’autre.',
  'Produsele sunt potrivite pentru vegani?': 'Les produits conviennent-ils aux véganes ?',
  'Majoritatea produselor sunt 100% vegane, cu capsule pe bază de celuloză. Fișa fiecărui produs menționează explicit acest lucru.':
    'La plupart des produits sont 100 % végans, avec des gélules à base de cellulose. La fiche de chaque produit le précise explicitement.',
  'De unde provin ingredientele?': 'D’où viennent les ingrédients ?',
  'Fiecare ingredient are originea publicată în biblioteca de ingrediente — de la sursă până la furnizorul certificat care îl livrează.':
    'L’origine de chaque ingrédient est publiée dans la bibliothèque d’ingrédients — de la source au fournisseur certifié qui le livre.',
  'Ce înseamnă biodisponibilitatea?': 'Que signifie la biodisponibilité ?',
  'Este cantitatea dintr-un nutrient pe care organismul o poate absorbi și folosi efectiv. De aceea alegem forme precum magneziu bisglicinat în locul oxidului.':
    'C’est la quantité d’un nutriment que l’organisme peut réellement absorber et utiliser. C’est pourquoi nous choisissons des formes comme le bisglycinate de magnésium plutôt que l’oxyde.',
  'Conțin ingrediente artificiale?': 'Contiennent-ils des ingrédients artificiels ?',
  'Nu. Fără coloranți, arome sau îndulcitori artificiali și fără umpluturi inutile.':
    'Non. Sans colorants, arômes ni édulcorants artificiels, et sans excipients inutiles.',
  'Ce sunt ingredientele de suport?': 'Que sont les ingrédients de support ?',
  'Sunt componente care asigură stabilitatea și administrarea corectă a formulei — de exemplu celuloza din capsulă. Le explicăm pe toate, la fel ca pe cele active.':
    'Ce sont les composants qui assurent la stabilité et la bonne administration de la formule — la cellulose de la gélule, par exemple. Nous les expliquons tous, au même titre que les actifs.',
  'Când este cel mai bine să iau suplimentele?': 'Quel est le meilleur moment pour prendre les compléments ?',
  'Formulele pentru energie și esențialele se administrează dimineața, iar cele pentru somn cu 30–60 de minute înainte de culcare.':
    'Les formules énergie et les essentiels se prennent le matin ; celles pour le sommeil, 30 à 60 minutes avant le coucher.',
  'Câte capsule iau pe zi?': 'Combien de gélules par jour ?',
  'Doza recomandată este trecută pe fiecare produs — de regulă 2 capsule pe zi, cu un pahar de apă.':
    'La dose recommandée figure sur chaque produit — en général deux gélules par jour, avec un verre d’eau.',
  'Le pot lua pe stomacul gol?': 'Puis-je les prendre à jeun ?',
  'Recomandăm administrarea în timpul unei mese, mai ales pentru vitaminele liposolubile (D3, K2, E), care se absorb mai bine alături de grăsimi.':
    'Nous recommandons de les prendre au cours d’un repas, surtout pour les vitamines liposolubles (D3, K2, E), mieux absorbées avec des matières grasses.',
  'În cât timp văd rezultate?': 'Au bout de combien de temps voit-on des résultats ?',
  'Majoritatea utilizatorilor observă diferențe după 4–6 săptămâni de administrare consecventă.':
    'La plupart des personnes constatent une différence après 4 à 6 semaines de prise régulière.',
  'Cât durează livrarea?': 'Quels sont les délais de livraison ?',
  'Comenzile plasate în zilele lucrătoare ajung de regulă în 1–3 zile lucrătoare.':
    'Les commandes passées un jour ouvré arrivent généralement sous 1 à 3 jours ouvrés.',
  'Cât costă livrarea?': 'Combien coûte la livraison ?',
  'Livrarea este gratuită pentru prima comandă și pentru toate comenzile din abonament.':
    'La livraison est offerte sur la première commande et sur toutes les commandes en abonnement.',
  'Îmi pot urmări comanda?': 'Puis-je suivre ma commande ?',
  'Da. Primești un link de urmărire pe email imediat ce comanda a fost expediată.':
    'Oui. Vous recevez un lien de suivi par e-mail dès l’expédition de votre commande.',
  'Livrați în afara României?': 'Livrez-vous hors de Roumanie ?',
  'Momentan livrăm în România și în Uniunea Europeană. Costurile se calculează automat la finalizarea comenzii.':
    'Nous livrons actuellement en Roumanie et dans l’Union européenne. Les frais sont calculés automatiquement lors de la commande.',
  'Cum funcționează abonamentul?': 'Comment fonctionne l’abonnement ?',
  'Alegi frecvența livrării — la 30, 60 sau 90 de zile — iar produsele ajung automat la tine, cu 15% reducere față de achiziția unică.':
    'Vous choisissez la fréquence de livraison — tous les 30, 60 ou 90 jours — et les produits vous parviennent automatiquement, avec 15 % de remise par rapport à l’achat unique.',
  'Pot modifica frecvența livrărilor?': 'Puis-je modifier la fréquence des livraisons ?',
  'Da, oricând din contul tău. Poți schimba frecvența, sări peste o livrare sau pune abonamentul pe pauză.':
    'Oui, à tout moment depuis votre compte. Vous pouvez changer la fréquence, sauter une livraison ou mettre l’abonnement en pause.',
  'Cum anulez abonamentul?': 'Comment annuler mon abonnement ?',
  'Din contul tău, într-un singur pas, fără taxe și fără să fie nevoie să ne contactezi.':
    'Depuis votre compte, en une seule étape, sans frais et sans avoir à nous contacter.',
  'Ce reducere am cu abonamentul?': 'Quelle remise offre l’abonnement ?',
  '15% la fiecare livrare, plus livrare gratuită pe toată durata abonamentului.':
    '15 % sur chaque livraison, et la livraison offerte pendant toute la durée de l’abonnement.',
  'Care este politica de retur?': 'Quelle est la politique de retour ?',
  'Ai la dispoziție 30 de zile de la primirea comenzii pentru a returna produsele.':
    'Vous disposez de 30 jours à compter de la réception pour retourner les produits.',
  'Cum returnez un produs?': 'Comment retourner un produit ?',
  'Deschizi o cerere de retur din contul tău, iar noi îți trimitem eticheta de expediere.':
    'Vous ouvrez une demande de retour depuis votre compte et nous vous envoyons l’étiquette d’expédition.',
  'Când primesc banii înapoi?': 'Quand suis-je remboursé ?',
  'Rambursarea se face în 5–10 zile lucrătoare de la recepția coletului, pe aceeași metodă de plată.':
    'Le remboursement intervient sous 5 à 10 jours ouvrés après réception du colis, sur le même moyen de paiement.',
  'Pot returna un produs desigilat?': 'Puis-je retourner un produit ouvert ?',
  'Da. Dacă produsul nu ți se potrivește, îl poți returna chiar și desigilat, în cele 30 de zile.':
    'Oui. Si le produit ne vous convient pas, vous pouvez le retourner même ouvert, dans les 30 jours.',
  'Cum sunt testate produsele?': 'Comment les produits sont-ils testés ?',
  'Fiecare lot este testat independent, în laborator, pentru puritate, potență și contaminanți.':
    'Chaque lot est testé indépendamment en laboratoire, pour la pureté, la teneur et les contaminants.',
  'Ce înseamnă certificarea GMP?': 'Que signifie la certification GMP ?',
  'Good Manufacturing Practice este un standard internațional care garantează condiții stricte de producție și trasabilitate completă.':
    'Good Manufacturing Practice est un standard international garantissant des conditions de production strictes et une traçabilité complète.',
  'Pot vedea rezultatele testelor?': 'Puis-je consulter les résultats des tests ?',
  'Da. Buletinul de analiză pentru lotul tău este disponibil în Clarity Passport, pe fișa produsului.':
    'Oui. Le certificat d’analyse de votre lot est disponible dans Clarity Passport, sur la fiche produit.',
  'Ce este Clarity Passport?': 'Qu’est-ce que Clarity Passport ?',
  'Este fișa de transparență a fiecărui ingredient: originea, furnizorul, forma utilizată, rolul în formulă și testările efectuate.':
    'C’est la fiche de transparence de chaque ingrédient : origine, fournisseur, forme utilisée, rôle dans la formule et tests réalisés.',
  'Pot lua suplimentele dacă urmez un tratament?': 'Puis-je prendre des compléments si je suis un traitement ?',
  'Dacă urmezi un tratament medicamentos, discută cu medicul sau farmacistul înainte de a începe orice supliment.':
    'Si vous suivez un traitement médicamenteux, parlez-en à votre médecin ou à votre pharmacien avant de commencer tout complément.',
  'Sunt sigure în sarcină sau alăptare?': 'Sont-ils sûrs pendant la grossesse ou l’allaitement ?',
  'În sarcină și alăptare, administrarea oricărui supliment trebuie discutată în prealabil cu medicul curant.':
    'Pendant la grossesse et l’allaitement, la prise de tout complément doit être discutée au préalable avec votre médecin.',
  'Există efecte secundare?': 'Y a-t-il des effets secondaires ?',
  'La dozele recomandate, formulele sunt bine tolerate. Dacă apar reacții neobișnuite, oprește administrarea și cere sfatul medicului.':
    'Aux doses recommandées, les formules sont bien tolérées. En cas de réaction inhabituelle, arrêtez la prise et demandez un avis médical.',
  'De la ce vârstă pot fi administrate?': 'À partir de quel âge peut-on les prendre ?',
  'Produsele sunt formulate pentru adulți, de la 18 ani în sus.': 'Les produits sont formulés pour les adultes, à partir de 18 ans.',
  'Cum îmi creez un cont?': 'Comment créer un compte ?',
  'Poți crea un cont din meniul „Cont” sau direct la finalizarea primei comenzi.':
    'Vous pouvez créer un compte depuis le menu « Compte » ou directement lors de votre première commande.',
  'Mi-am uitat parola. Ce fac?': 'J’ai oublié mon mot de passe. Que faire ?',
  'Folosește opțiunea „Am uitat parola” din pagina de autentificare și primești un link de resetare pe email.':
    'Utilisez l’option « Mot de passe oublié » sur la page de connexion et vous recevrez un lien de réinitialisation par e-mail.',
  'Cum îmi actualizez datele?': 'Comment mettre à jour mes informations ?',
  'Datele de livrare și facturare pot fi modificate oricând din secțiunea de setări a contului.':
    'Les informations de livraison et de facturation peuvent être modifiées à tout moment dans les paramètres du compte.',
  'Cum îmi șterg contul?': 'Comment supprimer mon compte ?',
  'Ne scrii pe pagina de': 'Écrivez-nous depuis la page',
  'și ștergem contul și datele asociate în cel mult 30 de zile.':
    'et nous supprimerons votre compte et les données associées sous 30 jours.',

  // ---- contact ----
  'Contact — Clarity': 'Contact — Clarity',
  'Scrie-ne și îți răspundem în cel mai scurt timp. Echipa Clarity este aici pentru tine.':
    'Écrivez-nous et nous vous répondrons dans les meilleurs délais. L’équipe Clarity est là pour vous.',
  'Persoană scriind pe laptop, alături de un produs Clarity': 'Personne travaillant sur un ordinateur portable à côté d’un produit Clarity',
  'SUNTEM AICI PENTRU TINE': 'NOUS SOMMES LÀ POUR VOUS',
  'Selectează un subiect': 'Choisissez un sujet', 'Comanda mea': 'Ma commande',
  'Produse și ingrediente': 'Produits et ingrédients', 'Altceva': 'Autre',
  'Introdu numele': 'Saisissez votre nom', 'Numele tău': 'Votre nom',
  'Adresă de e-mail': 'Adresse e-mail', 'Spune-ne cu ce te putem ajuta...': 'Dites-nous comment nous pouvons vous aider...',
  'Mesajul tău': 'Votre message', 'Trimite mesajul': 'Envoyer le message',
};

function translateTextNodes(html) {
  return html.replace(/>([^<]+)</g, (m, text) => {
    const trimmed = text.trim();
    if (!trimmed) return m;
    const hit = T[trimmed];
    if (hit === undefined) return m;
    return '>' + text.match(/^\s*/)[0] + hit + text.match(/\s*$/)[0] + '<';
  });
}

function translateAttrs(html) {
  return html.replace(/(placeholder|aria-label|alt|title)="([^"]*)"/g, (m, attr, val) => {
    const hit = T[val.trim()];
    return hit === undefined ? m : `${attr}="${hit}"`;
  });
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const missing = new Set();
for (const [ro, fr] of Object.entries(PAGES)) {
  let h = fs.readFileSync(path.join(SRC, ro), 'utf8');

  for (const [from, to] of SPECIAL) h = h.split(from).join(to);
  h = translateTextNodes(h);
  h = translateAttrs(h);

  h = h.replace(/<title>([^<]*)<\/title>/, (m, t) => `<title>${T[t.trim()] || t}</title>`);
  h = h.replace(/(<meta name="description" content=")([^"]*)(")/, (m, a, c, b) => a + (T[c.trim()] || c) + b);
  h = h.replace('<html lang="ro">', '<html lang="fr">');

  h = h.replace(/(src|href)="assets\//g, '$1="../assets/');
  h = h.replace(/href="styles\.css"/g, 'href="../styles.css"');
  h = h.replace(/src="site\.js"/g, 'src="../site.js"');

  for (const [roFile, frFile] of Object.entries(PAGES)) {
    h = h.split(`href="${roFile}"`).join(`href="${frFile}"`);
    h = h.split(`href="${roFile}#`).join(`href="${frFile}#`);
  }

  fs.writeFileSync(path.join(OUT, fr), h);

  const stripped = h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  for (const m of stripped.matchAll(/>([^<]+)</g)) {
    const t = m[1].trim();
    if (t && /[ăâîșțĂÂÎȘȚ]/.test(t)) missing.add(`${fr}: ${t.slice(0, 70)}`);
  }
  console.log('wrote fr/' + fr);
}

if (missing.size) {
  console.log('\nSTILL ROMANIAN (' + missing.size + '):');
  [...missing].slice(0, 40).forEach(s => console.log('  ' + s));
} else {
  console.log('\nNo Romanian left in visible text.');
}
