 Inlämningsuppgift

Vi kommer ta fram en e-handel där vi säljer prenumerationer till nyhetsartiklar i 3 olika nivåer. När man gjort ett köp ska man få en inloggning till de innehåll som gäller för ens nivå, och det ska göras återkommande kortdragningar var 7:e dag, för att användaren ska ha kvar sin access.

 

Länk till github classroom:

https://classroom.github.com/a/HEdUZuwA

 

Kraven för denna uppgift:

Betyg G

 

- Backend ska vara byggt med Typescript

- Val av databas är fritt: Mongodb eller MySQL

- Plan över fördelning av arbetsuppgifter och vilka dagar de ska utvecklas ska vara framtagen

- Försäljning av prenumerationer på 3 olika nivåer ska säljas: grundpaket, plus och fullständigt

- En användare ska kunna logga in och logga ut från sitt konto

- Startsidan efter inloggning ska visa alla de innehållssidor som användaren har tillgång till på sin prenumerationsnivå

- Innehållssidor ska hämta all sin information från databasen, rubrik innehåll och kunna begränsas till olika nivåer av prenumerationen

- Om en användare inte har rätt nivå på sin prenumeration ska den få ett förslag att uppgradera när en begränsad sida laddas

- Betalsteg ska implementeras

- Prenumerationer ska förnyas per vecka antingen genom ett cron-job eller med stripe subscriptions

- När en prenumerationsbetalning ej går igenom ska rättigheterna begränsas så att de inte längre kan läsa de sidor de tidigare haft tillgång till

- En användare ska kunna betala en förnyelse som inte automatiskt gått igenom, genom att gå igenom betalsteget igen

- En användare ska när som helst kunna avsluta sin prenumeration, men ska fortfarande ha tillgång till sin nivå fram tills de betalade dagarna har löpt ut

- En administratör ska kunna lägga in innehållssidor och välja vilken nivå man måste ha för att få se den

 

Ge er e-handel ett unikt namn t.ex. “StoryStream Chronicles” och ge de olika nivåerna olika namn, t.ex. “Explorer's Pass”, “Odyssey Membership” och “Mastermind Access”. Detta gör att det står ut mer när man använder det i sin portfolio vid LIA- och arbetsansökan.

 

Denna uppgift mäter följande moment från kursplanen:

 

- TypeScript för backendutveckling

- Planera och genomföra större databasdrivna programmeringsprojekt
