// Generates the English site into clarity/en/ from the Romanian pages.
// Text is swapped per text-node / attribute (never blind substring replacement,
// which would corrupt short words like "din" or "mai" inside longer ones).
const fs = require('fs');
const path = require('path');

const SRC = '/Users/jessicaanastasescu/test-claude/clarity';
const OUT = path.join(SRC, 'en');

const PAGES = {
  'index.html': 'index.html',
  'ingrediente.html': 'ingredients.html',
  'invata.html': 'learn.html',
  'product.html': 'product.html',
  'faq.html': 'faq.html',
  'contact.html': 'contact.html',
};

// Headline fragments where English word order differs from Romanian, so the
// whole inner markup is swapped rather than node-by-node.
const SPECIAL = [
  ['Suplimente cu formule <br><em>transparente</em>.', 'Supplements with <br><em>transparent</em> formulas.'],
  ['Nu ar trebui să ai nevoie de <em>un dicționar</em> ca să alegi un supliment.', "You shouldn't need <em>a dictionary</em> to choose a supplement."],
  ['Ai grijă de sănătatea ta, <em>oriunde</em> te-ai afla.', 'Take care of your health, <em>wherever</em> you are.'],
  ['Începe-ți rutina de <em>wellness</em> cu Clarity.', 'Start your <em>wellness</em> routine with Clarity.'],
  ['<span>Transparența face</span> <br><em>diferența</em>.', '<span>Transparency makes</span> <br><em>the difference</em>.'],
  ['Fiecare ingredient are o <em>poveste</em>.', 'Every ingredient has a <em>story</em>.'],
  ['<em>Standardele</em> după care alegem <br>fiecare ingredient.', 'The <em>standards</em> behind every <br>ingredient we choose.'],
  ['<em>Descoperă</em> o abordare mai clară <br>a suplimentelor.', '<em>Discover</em> a clearer approach <br>to supplements.'],
  ['<em>Explorează</em> știința din <br>spatele fiecărei formule.', '<em>Explore</em> the science <br>behind every formula.'],
  ['Fiecare ingredient <em>contează</em>.', 'Every ingredient <em>matters</em>.'],
  ['<span>O formulă <em>completă</em>,</span> <br>construită pentru fiecare zi.', '<span>A <em>complete</em> formula,</span> <br>built for every day.'],
  ['<em>Transparență</em> până la sursa <br>fiecărui ingredient.', '<em>Transparency</em> down to the source <br>of every ingredient.'],
  ['Încredere construită <br>din <em>experiențe reale</em>.', 'Trust built <br>from <em>real experiences</em>.'],
  ['Tot ce trebuie să știi <br>despre <em>Daily Essentials</em>.', 'Everything you need to know <br>about <em>Daily Essentials</em>.'],
  ['Tot ce trebuie să știi <br>despre Clarity.', 'Everything you need to know <br>about Clarity.'],
  ['Răspunsuri clare la cele <br>mai <em>frecvente întrebări</em>.', 'Clear answers to the <br>most <em>frequently asked questions</em>.'],
  ['Cu ce te putem <br><em>ajuta astăzi?</em>', 'How can we <br><em>help you today?</em>'],
  ['trăiește <em>limpede</em>', 'live <em>clearly</em>'],
  ['Explorează ingredientele din formulele Clarity, află de unde provin, <br>de ce le-am ales și ce rol au în organism.',
   'Explore the ingredients in Clarity formulas — where they come from, <br>why we chose them and what they do in the body.'],
  ['Și ingredientele de suport sunt atent alese pentru a asigura <br>stabilitatea, calitatea și administrarea eficientă a fiecărei formule.',
   'Support ingredients are chosen just as carefully, to ensure <br>the stability, quality and effective delivery of every formula.'],
  ['Articole bazate pe cercetare despre nutriție, sănătate și <br>ingredientele care susțin o rutină mai bună.',
   'Research-based articles on nutrition, health and <br>the ingredients behind a better routine.'],
];

const T = {
  // ---- chrome / nav / footer ----
  'Magazin': 'Shop', 'Ingrediente': 'Ingredients', 'Învață': 'Learn', 'Despre noi': 'About',
  'Parteneri': 'Partners', 'Cont': 'Account', 'Coș': 'Cart', 'Principal': 'Main', 'Subsol': 'Footer',
  'Meniu': 'Menu', '30% reducere la prima comandă': '30% off your first order',
  'Fă prima comandă': 'Place your first order',
  'Rămâi conectat cu Clarity': 'Stay connected with Clarity',
  'Primește articole despre sănătate, noutăți despre produse și recomandări bazate pe cercetare, direct în inbox-ul tău.':
    'Get health articles, product news and research-based recommendations straight to your inbox.',
  'Introdu adresa ta de email': 'Enter your email address', 'Adresă de email': 'Email address',
  'Abonează-te': 'Subscribe', 'PRODUSE': 'PRODUCTS', 'Toate': 'All', 'Somn': 'Sleep',
  'Performanță': 'Performance', 'Esențiale': 'Essentials', 'SOCIAL': 'SOCIAL', 'SUPORT': 'SUPPORT',
  'Întrebări frecvente': 'FAQ', 'Contact': 'Contact', 'Livrare': 'Shipping', 'Retur': 'Returns',
  'LEGAL': 'LEGAL', 'Termeni și condiții': 'Terms & conditions',
  'Politica de confidențialitate': 'Privacy policy', 'Politica de cookies': 'Cookie policy',
  'DESPRE': 'ABOUT', 'Blog': 'Blog', '© 2026 Clarity. Toate drepturile rezervate.': '© 2026 Clarity. All rights reserved.',
  'trăiește': 'live', 'limpede': 'clearly',

  // ---- home ----
  'Clarity — Suplimente cu formule transparente': 'Clarity — Supplements with transparent formulas',
  'Suplimente cu ingrediente, forme și doze explicate clar, ca să poți alege informat ce pui în corpul tău.':
    'Supplements with ingredients, forms and doses explained clearly, so you can make an informed choice about what you put in your body.',
  'de farmaciști recomandă Clarity™': 'pharmacists recommend Clarity™',
  'fără compensație.': 'without compensation.', 'Află de ce': 'Find out why',
  'Descoperă suplimente': 'Explore supplements', 'Descarcă aplicația': 'Download the app',
  'FIECARE LOT TESTAT INDEPENDENT': 'EVERY BATCH INDEPENDENTLY TESTED',
  'INGREDIENTE TRASABILE LA SURSĂ': 'INGREDIENTS TRACEABLE TO SOURCE',
  'DISPONIBIL ÎN FARMACIILE MEDIMFARM': 'AVAILABLE IN MEDIMFARM PHARMACIES',
  'Femeie ținând un supliment Clarity': 'Woman holding a Clarity supplement',
  'Ingrediente 100%': '100% traceable', 'trasabile': 'ingredients',
  'Suplimente': 'Ethically made', 'fabricate etic': 'supplements',
  'Formule verificate': 'Formulas verified', 'de farmaciști': 'by pharmacists',
  'Certificat USP': 'USP certified', 'Susținute de studii': 'Backed by clinical', 'clinice': 'studies',
  'Transparență în': 'Transparency in', 'fiecare formulă': 'every formula',
  'COLECȚIA CLARITY': 'THE CLARITY COLLECTION', 'Produse clare pentru nevoi reale.': 'Clear products for real needs.',
  'Vezi toate produsele': 'See all products', 'În curând': 'Coming soon',
  'Alege următorul produs': 'Choose the next product', 'Bestseller': 'Bestseller', 'Essential': 'Essential',
  'Fiecare formulă, trecută prin filtrul unui farmacist.': 'Every formula, reviewed by a pharmacist.',
  'Farmaciștii Medimfarm au analizat produsele Clarity din perspectiva formei ingredientelor, dozei, formulei și modului de utilizare.':
    'Medimfarm pharmacists reviewed Clarity products for ingredient form, dosage, formulation and how they are taken.',
  'Farmaciștii primesc mostre': 'Pharmacists receive samples',
  'Ca să le poată analiza direct și să își formeze propria opinie despre formulă.':
    'So they can examine them directly and form their own view of the formula.',
  'Opiniile nu sunt plătite': 'Opinions are not paid for',
  'Farmaciștii nu sunt remunerați pentru ceea ce aleg să scrie.': 'Pharmacists are not compensated for what they choose to write.',
  'Recenzii colectate transparent': 'Reviews collected transparently',
  'Fiecare opinie este publicată cu numele și rolul farmacistului, fără să fie modificată de Clarity.':
    'Every opinion is published with the pharmacist’s name and role, unedited by Clarity.',
  '42 REVIEW-URI': '42 REVIEWS', 'Anterior': 'Previous', 'Următor': 'Next',
  'Farmacist Dr. Max': 'Pharmacist, Dr. Max', 'Farmacist': 'Pharmacist',
  'O formă mai eficientă de magneziu': 'A more effective form of magnesium',
  '„Apreciez că produsul comunică foarte clar forma de magneziu folosită și cantitatea efectivă per porție. Este genul de informație care îi ajută pe oameni să compare produsele mai corect.”':
    '“I appreciate how clearly the product states the form of magnesium used and the actual amount per serving. That is the kind of information that helps people compare products properly.”',
  'Citește tot review-ul': 'Read the full review',
  'Complex natural de vitamine și minerale': 'A natural vitamin and mineral complex',
  '„Un supliment echilibrat ce oferă nutrienți esențiali, susținând performanța fizică și mentală zilnică.”':
    '“A balanced supplement providing essential nutrients, supporting daily physical and mental performance.”',
  'Vezi review-ul complet': 'See the full review',
  'Extract concentrat de ghimbir organic': 'Concentrated organic ginger extract',
  '„Ajută la reducerea inflamațiilor și îmbunătățește digestia fără efecte secundare.”':
    '“It helps reduce inflammation and improves digestion with no side effects.”',
  'Citește întregul review': 'Read the whole review',
  'Multi-Vitamine 30 cps': 'Multivitamin 30 caps', 'Ghimbir Organic 60 cps': 'Organic Ginger 60 caps',
  'PROBLEMA DIN PIAȚĂ': 'THE PROBLEM IN THE MARKET',
  'De multe ori auzi ce să iei, dar de prea puține de ce contează, ce conțin suplimentele și în ce formă.':
    'You often hear what to take, but rarely why it matters, what supplements actually contain and in what form.',
  'Borcane cu etichete greu de descifrat': 'Jars with labels that are hard to decipher',
  'ABORDAREA NOASTRĂ': 'OUR APPROACH',
  'Claritatea începe cu a ști ce pui în corp.': 'Clarity starts with knowing what you put in your body.',
  'Îți arătăm ingredientele, dozele, originea și testele fiecărui produs. Lucrăm la standarde mai înalte decât minimul obligatoriu și facem fiecare etapă ușor de urmărit.':
    'We show you the ingredients, doses, origin and testing behind every product. We work to standards higher than the legal minimum and make every step easy to follow.',
  'Vezi cum construim produsele': 'See how we build our products',
  'Plante crescute în seră': 'Plants grown in a greenhouse',
  'APLICAȚIA CLARITY': 'THE CLARITY APP',
  'Urmărește-ți rutina zilnică, primește notificări personalizate și construiește obiceiuri sănătoase cu aplicația Clarity.':
    'Track your daily routine, get personalised reminders and build healthy habits with the Clarity app.',
  'Aplicația Clarity pe telefon': 'The Clarity app on a phone',
  'EXPERIENȚE REALE': 'REAL EXPERIENCES', 'Clarity, în rutina de zi cu zi.': 'Clarity, in everyday life.',
  'PACHET EXCLUSIV PENTRU PRIMA COMANDĂ': 'EXCLUSIVE FIRST-ORDER BUNDLE',
  'Pachetul Clarity Essentials': 'The Clarity Essentials bundle',
  'Pachet Clarity Essentials': 'Clarity Essentials Bundle',
  'INCLUDE LA PRIMA COMANDĂ': 'INCLUDED WITH YOUR FIRST ORDER',
  'Ghid digital de utilizare': 'Digital usage guide',
  'Învață cum să îți construiești o rutină simplă și eficientă.': 'Learn how to build a simple, effective routine.',
  'Organizator pentru suplimente': 'Supplement organiser',
  'Păstrează produsele organizate și ușor de administrat.': 'Keeps your products organised and easy to take.',
  'Acces Premium în aplicația Clarity': 'Premium access in the Clarity app',
  'Monitorizează rutina, primește notificări și urmărește progresul.': 'Track your routine, get reminders and follow your progress.',
  'Livrare gratuită': 'Free shipping', 'Disponibilă pentru prima comandă.': 'Available on your first order.',
  'Total': 'Total', 'Comandă pachetul Clarity': 'Order the Clarity bundle',
  'COMPARAȚIE TRANSPARENTĂ': 'A TRANSPARENT COMPARISON',
  'Glisează pentru a compara': 'Swipe to compare',
  'INGREDIENT': 'INGREDIENT', 'CLARITY SLEEP': 'CLARITY SLEEP', 'SUPLIMENT OBIȘNUIT': 'ORDINARY SUPPLEMENT',
  'Melatonină': 'Melatonin', 'Magneziu (bisglicinat)': 'Magnesium (bisglycinate)', 'L-Theanină': 'L-Theanine',
  'Extract de Ashwagandha': 'Ashwagandha extract', 'Vitamina B6': 'Vitamin B6',
  '40 mg (oxid)': '40 mg (oxide)', '60 mg (oxid)': '60 mg (oxide)', '10 mg (oxid)': '10 mg (oxide)',
  'Vezi toate ingredientele': 'See all ingredients',
  'ÎNTREBĂRI FRECVENTE': 'FREQUENTLY ASKED QUESTIONS',
  'Cum aleg suplimentul potrivit pentru mine?': 'How do I choose the right supplement for me?',
  'Îți recomandăm să pornești de la obiectivul tău — somn, energie sau imunitate — iar fișa fiecărui produs îți arată exact ce conține și în ce doză.':
    'Start from your goal — sleep, energy or immunity — and each product page shows exactly what it contains and at what dose.',
  'Poți filtra produsele după nevoie și compara formulele direct, cu ingredientele și dozele afișate transparent.':
    'You can filter products by need and compare formulas directly, with ingredients and doses shown transparently.',
  'Aplicația Clarity îți poate sugera o rutină personalizată în funcție de răspunsurile tale.':
    'The Clarity app can suggest a personalised routine based on your answers.',
  'Toate produsele sunt verificate de farmaciști și testate independent, lot cu lot.':
    'All products are reviewed by pharmacists and independently tested, batch by batch.',
  'Poți combina mai multe produse fără suprapuneri de doze — formulele sunt gândite să funcționeze împreună.':
    'You can combine several products without overlapping doses — the formulas are designed to work together.',
  'Dacă ai nevoie de ajutor, echipa noastră îți răspunde oricând prin chat sau email.':
    'If you need help, our team is available any time by chat or email.',
  'Mâini ținând un borcan Clarity': 'Hands holding a Clarity jar',

  // ---- ingredients page ----
  'Clarity — Bibliotecă de ingrediente': 'Clarity — Ingredient library',
  'Explorează ingredientele din formulele Clarity, află de unde provin, de ce le-am ales și ce rol au în organism.':
    'Explore the ingredients in Clarity formulas — where they come from, why we chose them and what they do in the body.',
  'INGREDIENT LIBRARY': 'INGREDIENT LIBRARY',
  'Caută un ingredient...': 'Search for an ingredient...', 'Caută un ingredient': 'Search for an ingredient',
  'Caută': 'Search', 'Ingrediente esențiale': 'Essential ingredients',
  'Sort by': 'Sort by', 'Vizualizare grilă': 'Grid view', 'Vizualizare listă': 'List view',
  'Descoperă ingredientele de suport': 'Discover the support ingredients',
  'STANDARDELE CLARITY': 'THE CLARITY STANDARDS',
  'Transparență înainte de toate': 'Transparency above all',
  'Fiecare ingredient este complet trasabil, de la sursă până la produsul final. Știm exact de unde provine, cum este procesat și cine îl furnizează.':
    'Every ingredient is fully traceable, from source to finished product. We know exactly where it comes from, how it is processed and who supplies it.',
  'Calitate verificată': 'Verified quality',
  'Lucrăm exclusiv cu furnizori care respectă standarde internaționale de producție, certificări GMP și procese independente de testare pentru fiecare lot.':
    'We work only with suppliers who meet international manufacturing standards, GMP certification and independent testing for every batch.',
  'Aprovizionare responsabilă': 'Responsible sourcing',
  'Selectăm ingrediente provenite din surse responsabile, cu respect pentru mediu, comunitățile locale și practicile etice de producție.':
    'We select ingredients from responsible sources, with respect for the environment, local communities and ethical production practices.',
  'Susținute de cercetare': 'Backed by research',
  'Preferăm ingrediente pentru care există studii relevante privind eficiența, biodisponibilitatea și siguranța utilizării pe termen lung.':
    'We favour ingredients with relevant studies on effectiveness, bioavailability and long-term safety.',
  'ÎNCEPE CU CLARITY': 'START WITH CLARITY', 'Explorează produsele Clarity': 'Explore Clarity products',

  // ---- learn / journal ----
  'Jurnal Clarity — Învață': 'Clarity Journal — Learn',
  'Articole bazate pe cercetare despre nutriție, sănătate și ingredientele care susțin o rutină mai bună.':
    'Research-based articles on nutrition, health and the ingredients behind a better routine.',
  'JURNAL CLARITY': 'CLARITY JOURNAL',
  'Caută după subiect, ingredient sau autor...': 'Search by topic, ingredient or author...',
  'Caută articole': 'Search articles',
  'CERCETARE': 'RESEARCH', 'INGREDIENTE': 'INGREDIENTS', 'SOMN': 'SLEEP', 'NUTRITIE': 'NUTRITION',
  'WELLNESS': 'WELLNESS', 'MINERALE': 'MINERALS',
  'Legătura dintre intestin și creier: cum influențează microbiomul claritatea mentală':
    'The gut–brain link: how the microbiome shapes mental clarity',
  'Cercetările recente arată că microbiomul intestinal influențează mult mai mult decât digestia. Descoperă cum sănătatea intestinului poate avea un impact asupra concentrării, memoriei și stării generale de bine, precum și ce spune știința despre această conexiune.':
    'Recent research shows the gut microbiome influences far more than digestion. Discover how gut health can affect focus, memory and general wellbeing — and what the science says about the connection.',
  'Citește articolul': 'Read the article', 'Descoperă mai multe': 'Discover more',
  'Vase Petri cu ingrediente și un caiet de notițe': 'Petri dishes with ingredients and a notebook',
  'Ashwagandha: beneficii susținute de cercetare': 'Ashwagandha: benefits backed by research',
  'Cum îți construiești o rutină de seară eficientă': 'How to build an effective evening routine',
  'Ce înseamnă biodisponibilitatea și de ce contează': 'What bioavailability means and why it matters',
  '5 obiceiuri simple pentru mai multă energie': '5 simple habits for more energy',
  'Cum influențează microbiomul sănătatea creierului': 'How the microbiome affects brain health',
  'De ce magneziul este esențial pentru organism': 'Why magnesium is essential for the body',
  'Vezi mai multe': 'See more',

  // ---- product page ----
  'Daily Essentials — Clarity': 'Daily Essentials — Clarity',
  'Daily Essentials: supliment complet pentru energie, concentrare și starea de bine. Ingrediente trasabile, formule verificate.':
    'Daily Essentials: a complete supplement for energy, focus and wellbeing. Traceable ingredients, verified formulas.',
  'Borcanul Clarity Daily Essentials': 'The Clarity Daily Essentials jar',
  'Imagine 1': 'Image 1', 'Imagine 2': 'Image 2', 'Imagine 3': 'Image 3', 'Imagine 4': 'Image 4', 'Imagine 5': 'Image 5',
  'Următoarea imagine': 'Next image', 'Informații nutriționale': 'Nutritional information',
  '(1,284 recenzii)': '(1,284 reviews)',
  'Supliment complet pentru energia, concentrarea și starea de bine.': 'A complete supplement for energy, focus and wellbeing.',
  'Energie': 'Energy', 'Focus': 'Focus', 'Imunitate': 'Immunity',
  'Abonament': 'Subscription', 'Economisești 15%': 'Save 15%', 'Modifici oricând': 'Change any time',
  'Frecvență livrare': 'Delivery frequency', 'pentru 30 de zile': 'for 30 days', 'pentru 60 de zile': 'for 60 days',
  'pentru 90 de zile': 'for 90 days', 'Achiziție unică': 'One-time purchase',
  'Adaugă în coș': 'Add to cart', 'Achită cu': 'Pay with',
  'Retur 30 zile': '30-day returns', 'Ingrediente trasabile': 'Traceable ingredients',
  'Mod de administrare': 'How to take it',
  'Vitamina D3, Vitamina K2 (MK-7), Vitamina C, Magneziu bisglicinat și Zinc bisglicinat — în doze relevante, alese pentru biodisponibilitate ridicată.':
    'Vitamin D3, Vitamin K2 (MK-7), Vitamin C, magnesium bisglycinate and zinc bisglycinate — in meaningful doses, chosen for high bioavailability.',
  '2 capsule pe zi, dimineața, cu un pahar de apă. Pentru rezultate optime, administrează zilnic, consecvent.':
    'Two capsules a day, in the morning, with a glass of water. For best results, take them daily and consistently.',
  'FORMULAT CU UN SCOP': 'FORMULATED WITH PURPOSE',
  'Ingrediente studiate clinic': 'Clinically studied ingredients',
  'Selectăm ingrediente susținute de cercetare și le folosim în doze relevante, alese pentru beneficii reale și consecvente.':
    'We select research-backed ingredients and use them in meaningful doses, chosen for real and consistent benefits.',
  'Absorbție optimă': 'Optimal absorption',
  'Folosim forme de ingrediente cu biodisponibilitate ridicată, astfel încât organismul să poată valorifica fiecare doză cât mai eficient.':
    'We use highly bioavailable ingredient forms, so your body can make the most of every dose.',
  'Formule echilibrate': 'Balanced formulas',
  'Fiecare ingredient este ales pentru modul în care completează întreaga formulă, nu doar pentru prezența pe etichetă.':
    'Every ingredient is chosen for how it complements the whole formula, not just for its presence on the label.',
  'Capsulă cu granule de ingrediente': 'A capsule with ingredient granules',
  'CLARITY DAILY ESSENTIALS': 'CLARITY DAILY ESSENTIALS', 'MULTIVITAMINĂ OBIȘNUITĂ': 'ORDINARY MULTIVITAMIN',
  'Vitamina D3': 'Vitamin D3', 'Vitamina K2 (MK-7)': 'Vitamin K2 (MK-7)', 'Vitamina C': 'Vitamin C',
  'Magneziu (bisglicinat)_dup': 'Magnesium (bisglycinate)', 'Zinc (bisglicinat)': 'Zinc (bisglycinate)',
  'RECOMANDATE PENTRU TINE': 'RECOMMENDED FOR YOU', 'Completează-ți rutina de': 'Complete your',
  'wellness': 'wellness', 'CLARITY PASSPORT®': 'CLARITY PASSPORT®',
  'Vitamina D3 în formă cristalină': 'Vitamin D3 in crystalline form',
  'Obținută din lanolină purificată și utilizată într-o formă cu biodisponibilitate ridicată pentru susținerea sistemului imunitar și a sănătății oaselor.':
    'Derived from purified lanolin and used in a highly bioavailable form to support the immune system and bone health.',
  'Origine': 'Origin', 'Europa': 'Europe', 'Furnizor': 'Supplier', 'Partener certificat GMP': 'GMP-certified partner',
  'Forma utilizată': 'Form used', 'Vitamina D3 (Colecalciferol)': 'Vitamin D3 (Cholecalciferol)',
  'Rol în formulă': 'Role in the formula', 'Imunitate & sănătatea oaselor': 'Immunity & bone health',
  'Testare': 'Testing', 'Laborator independent': 'Independent laboratory',
  'Ce este Daily Essentials?': 'What is Daily Essentials?',
  'Un supliment complet, cu vitamine și minerale esențiale în doze relevante, pentru energie, concentrare și imunitate.':
    'A complete supplement with essential vitamins and minerals in meaningful doses, for energy, focus and immunity.',
  'Cum se administrează?': 'How is it taken?',
  '2 capsule pe zi, dimineața, cu un pahar de apă.': 'Two capsules a day, in the morning, with a glass of water.',
  'În cât timp pot observa beneficiile?': 'How soon will I notice the benefits?',
  'Majoritatea utilizatorilor observă rezultate după 4–6 săptămâni de administrare consecventă.':
    'Most people notice results after 4–6 weeks of consistent use.',
  'Pot combina Daily Essentials cu alte produse Clarity?': 'Can I combine Daily Essentials with other Clarity products?',
  'Da. Formulele sunt gândite să funcționeze împreună, fără suprapuneri de doze.':
    'Yes. The formulas are designed to work together, without overlapping doses.',
  'Sunt ingredientele testate?': 'Are the ingredients tested?',
  'Fiecare lot este testat independent, în laborator, pentru puritate și potență.':
    'Every batch is independently lab-tested for purity and potency.',
  'Conține ingrediente artificiale?': 'Does it contain artificial ingredients?',
  'Nu. Fără coloranți, arome sau umpluturi artificiale.': 'No. No artificial colours, flavours or fillers.',
  'Persoană ținând borcanul Clarity': 'A person holding the Clarity jar',
  'RECENZII VERIFICATE': 'VERIFIED REVIEWS',
  'recomandă acest produs': 'recommend this product',
  'Recenzii (1284)': 'Reviews (1284)', 'Întrebări (37)': 'Questions (37)', 'Recenzii video (58)': 'Video reviews (58)',
  'Filtru': 'Filter', 'Scrie o recenzie': 'Write a review', 'Sortare': 'Sort by', 'Cele mai recente': 'Most recent',
  'Acum 5 zile': '5 days ago', 'Acum 2 zile': '2 days ago', 'Acum 1 săptămână': '1 week ago',
  'O formulă pe care chiar am înțeles-o.': 'A formula I could actually understand.',
  'Mi-a plăcut faptul că fiecare ingredient este explicat clar și că pot verifica proveniența lui. Aplicația mă ajută să nu uit administrarea zilnică.':
    'I liked that every ingredient is clearly explained and that I can check where it comes from. The app helps me remember to take it daily.',
  'În sfârșit un brand care explică totul.': 'Finally, a brand that explains everything.',
  'Mi-a plăcut că pot vedea exact ce conține produsul și de unde provin ingredientele. Totul este prezentat clar, iar aplicația cu mementouri m-a ajutat să îmi transform administrarea suplimentelor într-un obicei.':
    'I liked being able to see exactly what the product contains and where the ingredients come from. Everything is presented clearly, and the reminder app helped me turn taking supplements into a habit.',
  'Simplu, transparent și ușor de integrat în rutina mea.': 'Simple, transparent and easy to fit into my routine.',
  'Îmi place că formula nu este încărcată cu ingrediente inutile și că fiecare componentă are o explicație clară. Ambalajul este premium, iar aplicația completează foarte bine experiența.':
    'I like that the formula is not padded with unnecessary ingredients and that every component has a clear explanation. The packaging is premium, and the app rounds out the experience nicely.',
  'A fost utilă această recenzie?': 'Was this review helpful?',

  // ---- FAQ page ----
  'Întrebări frecvente — Clarity': 'FAQ — Clarity',
  'Răspunsuri clare la cele mai frecvente întrebări despre produsele, ingredientele și comenzile Clarity.':
    'Clear answers to the most frequently asked questions about Clarity products, ingredients and orders.',
  'Categorii întrebări': 'Question categories',
  'Despre Clarity': 'About Clarity', 'Produse': 'Products', 'Ingrediente & Formule': 'Ingredients & Formulas',
  'Cum se administrează': 'How to take them', 'Comenzi & Livrare': 'Orders & Shipping',
  'Abonamente': 'Subscriptions', 'Retururi': 'Returns', 'Calitate & Testare': 'Quality & Testing',
  'Siguranță & Utilizare': 'Safety & Use', 'Contul meu': 'My account',
  'Ce este Clarity?': 'What is Clarity?',
  'Clarity este un brand de suplimente construit în jurul transparenței: îți arătăm ce conține fiecare formulă, în ce formă și în ce doză, plus de unde provine fiecare ingredient.':
    'Clarity is a supplement brand built around transparency: we show you what each formula contains, in what form and at what dose, plus where every ingredient comes from.',
  'Care este misiunea Clarity?': 'What is Clarity’s mission?',
  'Vrem să facem suplimentele ușor de înțeles. Fiecare decizie de formulare este explicată, astfel încât să poți alege informat, nu după promisiuni de pe etichetă.':
    'We want to make supplements easy to understand. Every formulation decision is explained, so you can choose based on information rather than label promises.',
  'Ce diferențiază Clarity de alte branduri?': 'What sets Clarity apart from other brands?',
  'Folosim forme cu biodisponibilitate ridicată în doze relevante, publicăm originea ingredientelor și testăm independent fiecare lot. Nimic nu este ascuns sub termenul „amestec proprietar”.':
    'We use highly bioavailable forms in meaningful doses, publish ingredient origins and independently test every batch. Nothing is hidden behind the term “proprietary blend”.',
  'Unde sunt fabricate produsele?': 'Where are the products made?',
  'Produsele sunt fabricate în unități certificate GMP din Uniunea Europeană, cu parteneri care respectă standarde internaționale de producție.':
    'Products are manufactured in GMP-certified facilities in the European Union, with partners who meet international manufacturing standards.',
  'Ce produse are Clarity?': 'What products does Clarity offer?',
  'Gama include formule pentru somn, energie și performanță, plus esențiale zilnice precum Daily Essentials, Magnesium Bisglycinate și Omega-3.':
    'The range includes formulas for sleep, energy and performance, plus daily essentials such as Daily Essentials, Magnesium Bisglycinate and Omega-3.',
  'Cum aleg produsul potrivit pentru mine?': 'How do I choose the right product for me?',
  'Pornește de la obiectivul tău — somn, energie sau imunitate. Fișa fiecărui produs îți arată exact ce conține, în ce doză și pentru cine este potrivit.':
    'Start from your goal — sleep, energy or immunity. Each product page shows exactly what it contains, at what dose and who it suits.',
  'Pot combina mai multe produse?': 'Can I combine several products?',
  'Da. Formulele sunt gândite să funcționeze împreună, fără suprapuneri de doze între produse.':
    'Yes. The formulas are designed to work together, without overlapping doses between products.',
  'Produsele sunt potrivite pentru vegani?': 'Are the products suitable for vegans?',
  'Majoritatea produselor sunt 100% vegane, cu capsule pe bază de celuloză. Fișa fiecărui produs menționează explicit acest lucru.':
    'Most products are 100% vegan, with cellulose-based capsules. Each product page states this explicitly.',
  'De unde provin ingredientele?': 'Where do the ingredients come from?',
  'Fiecare ingredient are originea publicată în biblioteca de ingrediente — de la sursă până la furnizorul certificat care îl livrează.':
    'Every ingredient has its origin published in the ingredient library — from source to the certified supplier who delivers it.',
  'Ce înseamnă biodisponibilitatea?': 'What does bioavailability mean?',
  'Este cantitatea dintr-un nutrient pe care organismul o poate absorbi și folosi efectiv. De aceea alegem forme precum magneziu bisglicinat în locul oxidului.':
    'It is the amount of a nutrient your body can actually absorb and use. That is why we choose forms such as magnesium bisglycinate over the oxide.',
  'Conțin ingrediente artificiale?': 'Do they contain artificial ingredients?',
  'Nu. Fără coloranți, arome sau îndulcitori artificiali și fără umpluturi inutile.':
    'No. No artificial colours, flavours or sweeteners, and no unnecessary fillers.',
  'Ce sunt ingredientele de suport?': 'What are support ingredients?',
  'Sunt componente care asigură stabilitatea și administrarea corectă a formulei — de exemplu celuloza din capsulă. Le explicăm pe toate, la fel ca pe cele active.':
    'They are components that ensure the stability and correct delivery of the formula — the cellulose in the capsule, for example. We explain all of them, just as we do the active ones.',
  'Când este cel mai bine să iau suplimentele?': 'When is the best time to take supplements?',
  'Formulele pentru energie și esențialele se administrează dimineața, iar cele pentru somn cu 30–60 de minute înainte de culcare.':
    'Energy formulas and daily essentials are taken in the morning; sleep formulas 30–60 minutes before bed.',
  'Câte capsule iau pe zi?': 'How many capsules do I take per day?',
  'Doza recomandată este trecută pe fiecare produs — de regulă 2 capsule pe zi, cu un pahar de apă.':
    'The recommended dose is stated on each product — usually two capsules a day, with a glass of water.',
  'Le pot lua pe stomacul gol?': 'Can I take them on an empty stomach?',
  'Recomandăm administrarea în timpul unei mese, mai ales pentru vitaminele liposolubile (D3, K2, E), care se absorb mai bine alături de grăsimi.':
    'We recommend taking them with a meal, especially the fat-soluble vitamins (D3, K2, E), which absorb better alongside fats.',
  'În cât timp văd rezultate?': 'How soon will I see results?',
  'Majoritatea utilizatorilor observă diferențe după 4–6 săptămâni de administrare consecventă.':
    'Most people notice a difference after 4–6 weeks of consistent use.',
  'Cât durează livrarea?': 'How long does delivery take?',
  'Comenzile plasate în zilele lucrătoare ajung de regulă în 1–3 zile lucrătoare.':
    'Orders placed on working days usually arrive within 1–3 working days.',
  'Cât costă livrarea?': 'How much does delivery cost?',
  'Livrarea este gratuită pentru prima comandă și pentru toate comenzile din abonament.':
    'Delivery is free on your first order and on all subscription orders.',
  'Îmi pot urmări comanda?': 'Can I track my order?',
  'Da. Primești un link de urmărire pe email imediat ce comanda a fost expediată.':
    'Yes. You receive a tracking link by email as soon as your order ships.',
  'Livrați în afara României?': 'Do you deliver outside Romania?',
  'Momentan livrăm în România și în Uniunea Europeană. Costurile se calculează automat la finalizarea comenzii.':
    'We currently deliver within Romania and the European Union. Costs are calculated automatically at checkout.',
  'Cum funcționează abonamentul?': 'How does the subscription work?',
  'Alegi frecvența livrării — la 30, 60 sau 90 de zile — iar produsele ajung automat la tine, cu 15% reducere față de achiziția unică.':
    'You choose the delivery frequency — every 30, 60 or 90 days — and products arrive automatically, at 15% less than a one-time purchase.',
  'Pot modifica frecvența livrărilor?': 'Can I change the delivery frequency?',
  'Da, oricând din contul tău. Poți schimba frecvența, sări peste o livrare sau pune abonamentul pe pauză.':
    'Yes, any time from your account. You can change the frequency, skip a delivery or pause the subscription.',
  'Cum anulez abonamentul?': 'How do I cancel my subscription?',
  'Din contul tău, într-un singur pas, fără taxe și fără să fie nevoie să ne contactezi.':
    'From your account, in a single step, with no fees and no need to contact us.',
  'Ce reducere am cu abonamentul?': 'What discount do I get with a subscription?',
  '15% la fiecare livrare, plus livrare gratuită pe toată durata abonamentului.':
    '15% off every delivery, plus free shipping for as long as the subscription lasts.',
  'Care este politica de retur?': 'What is the returns policy?',
  'Ai la dispoziție 30 de zile de la primirea comenzii pentru a returna produsele.':
    'You have 30 days from receiving your order to return the products.',
  'Cum returnez un produs?': 'How do I return a product?',
  'Deschizi o cerere de retur din contul tău, iar noi îți trimitem eticheta de expediere.':
    'You open a return request from your account and we send you the shipping label.',
  'Când primesc banii înapoi?': 'When do I get my money back?',
  'Rambursarea se face în 5–10 zile lucrătoare de la recepția coletului, pe aceeași metodă de plată.':
    'Refunds are issued within 5–10 working days of the parcel arriving, to the same payment method.',
  'Pot returna un produs desigilat?': 'Can I return an opened product?',
  'Da. Dacă produsul nu ți se potrivește, îl poți returna chiar și desigilat, în cele 30 de zile.':
    'Yes. If the product is not right for you, you can return it even opened, within the 30 days.',
  'Cum sunt testate produsele?': 'How are the products tested?',
  'Fiecare lot este testat independent, în laborator, pentru puritate, potență și contaminanți.':
    'Every batch is independently lab-tested for purity, potency and contaminants.',
  'Ce înseamnă certificarea GMP?': 'What does GMP certification mean?',
  'Good Manufacturing Practice este un standard internațional care garantează condiții stricte de producție și trasabilitate completă.':
    'Good Manufacturing Practice is an international standard guaranteeing strict production conditions and full traceability.',
  'Pot vedea rezultatele testelor?': 'Can I see the test results?',
  'Da. Buletinul de analiză pentru lotul tău este disponibil în Clarity Passport, pe fișa produsului.':
    'Yes. The certificate of analysis for your batch is available in Clarity Passport, on the product page.',
  'Ce este Clarity Passport?': 'What is Clarity Passport?',
  'Este fișa de transparență a fiecărui ingredient: originea, furnizorul, forma utilizată, rolul în formulă și testările efectuate.':
    'It is the transparency record for each ingredient: origin, supplier, form used, role in the formula and the testing carried out.',
  'Pot lua suplimentele dacă urmez un tratament?': 'Can I take supplements if I am on medication?',
  'Dacă urmezi un tratament medicamentos, discută cu medicul sau farmacistul înainte de a începe orice supliment.':
    'If you are taking medication, speak to your doctor or pharmacist before starting any supplement.',
  'Sunt sigure în sarcină sau alăptare?': 'Are they safe during pregnancy or breastfeeding?',
  'În sarcină și alăptare, administrarea oricărui supliment trebuie discutată în prealabil cu medicul curant.':
    'During pregnancy and breastfeeding, any supplement should be discussed with your doctor beforehand.',
  'Există efecte secundare?': 'Are there side effects?',
  'La dozele recomandate, formulele sunt bine tolerate. Dacă apar reacții neobișnuite, oprește administrarea și cere sfatul medicului.':
    'At the recommended doses the formulas are well tolerated. If unusual reactions occur, stop taking them and seek medical advice.',
  'De la ce vârstă pot fi administrate?': 'What age are they suitable from?',
  'Produsele sunt formulate pentru adulți, de la 18 ani în sus.': 'The products are formulated for adults, 18 and over.',
  'Cum îmi creez un cont?': 'How do I create an account?',
  'Poți crea un cont din meniul „Cont” sau direct la finalizarea primei comenzi.':
    'You can create an account from the “Account” menu or directly when completing your first order.',
  'Mi-am uitat parola. Ce fac?': 'I forgot my password. What do I do?',
  'Folosește opțiunea „Am uitat parola” din pagina de autentificare și primești un link de resetare pe email.':
    'Use the “Forgot password” option on the sign-in page and you will receive a reset link by email.',
  'Cum îmi actualizez datele?': 'How do I update my details?',
  'Datele de livrare și facturare pot fi modificate oricând din secțiunea de setări a contului.':
    'Delivery and billing details can be changed at any time in your account settings.',
  'Cum îmi șterg contul?': 'How do I delete my account?',
  'Ne scrii pe pagina de': 'Write to us on the',
  'și ștergem contul și datele asociate în cel mult 30 de zile.':
    'page and we will delete your account and its data within 30 days.',

  'Ingrediente &amp; Formule': 'Ingredients &amp; Formulas',
  'Comenzi &amp; Livrare': 'Orders &amp; Shipping',
  'Calitate &amp; Testare': 'Quality &amp; Testing',
  'Siguranță &amp; Utilizare': 'Safety &amp; Use',
  'Imunitate &amp; sănătatea oaselor': 'Immunity &amp; bone health',
  // ---- contact ----
  'Contact — Clarity': 'Contact — Clarity',
  'Scrie-ne și îți răspundem în cel mai scurt timp. Echipa Clarity este aici pentru tine.':
    'Write to us and we will reply as soon as we can. The Clarity team is here for you.',
  'Persoană scriind pe laptop, alături de un produs Clarity': 'A person typing on a laptop next to a Clarity product',
  'SUNTEM AICI PENTRU TINE': 'WE ARE HERE FOR YOU',
  'Selectează un subiect': 'Select a topic', 'Comanda mea': 'My order',
  'Produse și ingrediente': 'Products and ingredients', 'Altceva': 'Something else',
  'Introdu numele': 'Enter your name', 'Numele tău': 'Your name',
  'Adresă de e-mail': 'Email address', 'Spune-ne cu ce te putem ajuta...': 'Tell us how we can help...',
  'Mesajul tău': 'Your message', 'Trimite mesajul': 'Send message',
};

// remove the helper key used only to keep the object unique
delete T['Magneziu (bisglicinat)_dup'];

function translateTextNodes(html) {
  // split into tags and text; only text segments are looked up
  return html.replace(/>([^<]+)</g, (m, text) => {
    const trimmed = text.trim();
    if (!trimmed) return m;
    const hit = T[trimmed];
    if (hit === undefined) return m;
    const lead = text.match(/^\s*/)[0];
    const tail = text.match(/\s*$/)[0];
    return '>' + lead + hit + tail + '<';
  });
}

function translateAttrs(html) {
  return html.replace(/(placeholder|aria-label|alt|title)="([^"]*)"/g, (m, attr, val) => {
    const hit = T[val.trim()];
    return hit === undefined ? m : `${attr}="${hit}"`;
  });
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

let missing = new Set();
for (const [ro, en] of Object.entries(PAGES)) {
  let h = fs.readFileSync(path.join(SRC, ro), 'utf8');

  for (const [from, to] of SPECIAL) {
    if (!h.includes(from) && ro !== 'contact.html') { /* not every special is on every page */ }
    h = h.split(from).join(to);
  }
  h = translateTextNodes(h);
  h = translateAttrs(h);

  // <title> and meta description
  h = h.replace(/<title>([^<]*)<\/title>/, (m, t) => `<title>${T[t.trim()] || t}</title>`);
  h = h.replace(/(<meta name="description" content=")([^"]*)(")/, (m, a, c, b) => a + (T[c.trim()] || c) + b);

  h = h.replace('<html lang="ro">', '<html lang="en">');

  // shared assets live one level up
  h = h.replace(/(src|href)="assets\//g, '$1="../assets/');
  h = h.replace(/href="styles\.css"/g, 'href="../styles.css"');
  h = h.replace(/src="site\.js"/g, 'src="../site.js"');

  // internal links point at the English counterparts
  for (const [roFile, enFile] of Object.entries(PAGES)) {
    h = h.split(`href="${roFile}"`).join(`href="${enFile}"`);
    h = h.split(`href="${roFile}#`).join(`href="${enFile}#`);
  }

  fs.writeFileSync(path.join(OUT, en), h);

  // report anything still Romanian-looking
  const stripped = h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  for (const m of stripped.matchAll(/>([^<]+)</g)) {
    const t = m[1].trim();
    if (t && (/[ăâîșțĂÂÎȘȚ]/.test(t) || /\b(pentru|este|sunt|care|fiecare|toate|despre|cu|si|din|nu|poti|orice|produs|produse|livrare|retur|cont|zile)\b/i.test(t))) missing.add(`${en}: ${t.slice(0,70)}`);
  }
  console.log('wrote en/' + en);
}

if (missing.size) {
  console.log('\nSTILL ROMANIAN (' + missing.size + '):');
  [...missing].slice(0, 40).forEach(s => console.log('  ' + s));
} else {
  console.log('\nNo Romanian diacritics left in visible text.');
}
