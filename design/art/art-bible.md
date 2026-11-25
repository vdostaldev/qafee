# Qafee – Art Bible

Lean art bible podle skillu `art-bible` (Donchitos/Claude-Code-Game-Studios), sekce 1–4, 7 a 9.
Předloha: Don't Starve (Klei). Bereme techniku, ne postavy ani logo.

Pilíře hry: **1. Učení je palivo** (bez správných odpovědí nic nejede) · **2. Tlak času** (zákazníci čekají, den končí) · **3. Malá útulná kavárna, která roste**.

## 1. Visual Identity Statement

**Všechno je nakreslené tenkým, škrábavým inkoustem na zažloutlém papíře a jak běží čas, kavárnu pohlcuje tma.**

- **Inkoust nese tvar, barva jen náladu.** Obrys je vždycky tmavá zužující se čára, výplň je tlumená plochá barva se šrafováním na stinné straně. Test: když váháš, přidej šrafu, ne barvu. (pilíř 3)
- **Tma = čas.** Čím blíž konec hry, tím víc se okraje scény zatahují tmou a ručička na hodinách leze do noci. Test: když je potřeba ukázat naléhavost, ztmav, nepřidávej blikání. (pilíř 2)
- **Nic není rovné.** Rámečky, linky a podtržení jsou tahy pera s přetahem v rozích. Test: rovná CSS čára nebo zaoblený box je chyba. (vše)

## 2. Mood podle stavu hry

| Stav | Emoce | Světlo | Přídavná jména | Energie |
| --- | --- | --- | --- | --- |
| Menu | zvědavost, trochu divná útulnost | teplé, okraje tmavé | prašné, tiché, podivné | klidná |
| Kavárna (začátek) | útulno, ruch | teplá lampa, žlutavá | dřevěné, voňavé, zabydlené | střední |
| Kavárna (konec času) | napětí | tma se zatahuje od krajů | stísněné, večerní, studené | vysoká |
| Zásoby (kvíz) | soustředění | rovnoměrné, papír | školní, čisté, inkoustové | soustředěná |
| Obchod | plánování | papír jídelního lístku | ručně psané, staré | klidná |
| Konec hry | úleva / pýcha | noc, jedna lampa | tiché, setmělé | nízká |

Prvek nesoucí náladu: tmavá vinětace (scéna) a hodiny den/soumrak/noc (HUD).

## 3. Tvarová řeč

- **Postavy:** velká hlava (až 1/3 výšky), hubené tyčkovité končetiny, malé černé oči nebo tmavé důlky, úzký trup. Silueta se musí poznat i v miniatuře podle účesu a hlavy (ježek, cylindr, drdol, baret…).
- **Prostředí:** ručně kreslené dřevo, svislé pruhy tapety, kulaté kavárenské stolky na jedné noze. Zaoblené, ale pokřivené tvary.
- **UI:** stejná inkoustová ruka jako svět. Tlačítka jsou rámečky tahem pera s přetahy v rozích, ne natržené papírky. Výběr se kroužkuje červeným inkoustem, chyba se škrtá.
- **Hero vs. pozadí:** postavy a jídlo mají plný inkoust a barvu; pozadí je světlejší, bez šraf, s nízkým kontrastem.

## 4. Barvy

| Barva | Hex | Role |
| --- | --- | --- |
| Pergamen | `#e8ddc4` | papír, pozadí UI |
| Inkoust | `#2a2119` | všechny obrysy, text |
| Tma | `#1a140f` | noc, vinětace, spodní lišta |
| Červený inkoust | `#9a3b2c` | oprava/kroužkování, výběr, málo zásob |
| Hořčice | `#b8903e` | peníze, světlo lampy |
| Mech | `#5f6b44` | oblečení, doplňky |
| Ocel | `#4a5a6a` | oblečení, noc na hodinách |

Barvoslepost: „málo zásob“ není jen červená, má i ikonu vykřičníku; správně/špatně se liší tvarem (kroužek vs. škrt), ne barvou.

## 7. UI/HUD

- **Umělecký pohled:** HUD je mimo fikci, ale kreslený stejnou rukou. Vlevo nahoře mince + částka, vpravo hodiny ve stylu den/soumrak/noc. Spodní tmavá lišta se třemi ikonami (Kavárna, Zásoby, Obchod). Nadpisy Grenze Gotisch, text Alegreya.
- **UX pohled:** časté přepínání tabů musí být skoro okamžité (pravidlo frekvence ze skillu game-design); dlouhý přechod jen mezi obrazovkami menu. Text min. 18 px, tlačítka min. 44 px, informace nikdy jen barvou.

## 9. Reference

| Zdroj | Co bereme | Čemu se vyhnout |
| --- | --- | --- |
| Don't Starve (Klei) | zužující se škrábavý obrys, šrafy na stinné straně, velké hlavy s malýma očima, hodiny den/noc | jejich postavy, logo, temné hororové motivy |
| Edward Gorey | tenké šrafování, prázdný papír kolem postav | černobílá viktoriánská tíseň |
| Staré jídelní lístky | tečkované vodítko mezi názvem a cenou | ozdobné rámečky a cliparty |
| Školní test | odpovědi a) b) c) d), oprava červeným perem | známkování, tabulky |
