# Maxxx Club Szombathely — weboldal mintaterv

Statikus mintaoldal (dizájnterv) a **Maxxx Music Club Szombathely** részére.
Tiszta HTML + CSS + JavaScript, keretrendszer és build lépés nélkül — bármilyen
tárhelyre feltehető, GitHub Pages-en azonnal fut.

**Élő előnézet:** _(GitHub Pages link ide, miután bekapcsoltad)_

---

## Mit tartalmaz

| Oldal | Fájl | Tartalom |
|---|---|---|
| Főoldal | `index.html` | Hero élő visszaszámlálóval, következő bulik, a klub bemutatása, 3 terem, galéria, foglalási űrlap, itallap-kiemelés, GYIK |
| Bulik | `bulik.html` | Programnaptár szűrhető kategóriákkal (klubest, retro, vendég DJ, zártkörű) |
| Terembérlés | `termek.html` | A három terem részletes adatlapja, alkalmak, folyamat, ajánlatkérő űrlap |
| Galéria | `galeria.html` | Rácsos galéria nagyítható lightboxszal (billentyűvel is lapozható) |
| Itallap | `itallap.html` | Füles itallap: koktélok, rövidek, sör & bor, alkoholmentes |
| Kapcsolat | `kapcsolat.html` | Elérhetőségek, nyitvatartás, térkép, kapcsolati űrlap, adatkezelés és házirend |

## Funkciók

- **Élő visszaszámláló** a következő szombat 22:00-ig — magától frissül, nem kell karbantartani
- **Foglalási űrlap** két módban: asztalfoglalás / terembérlés (a terem választó automatikusan megjelenik)
- Kliensoldali űrlap-ellenőrzés és visszajelző képernyő
- **Galéria lightbox** nyíl- és ESC-billentyűvel
- Programszűrő kategóriánként
- Görgetésre megjelenő animációk, futó szalagcímek, egyedi egérkurzor, olvasási folyamatjelző
- Mobilbarát (reszponzív), sötét téma, `prefers-reduced-motion` támogatás
- SEO alapok: leíró címek, Open Graph, `schema.org` NightClub strukturált adat

## Fontos: ez mintaoldal

- **Az űrlapok nem küldenek e-mailt.** Statikus oldalról nincs szerveroldal; élesítéskor
  a küldés bekötendő (pl. Formspree, Netlify Forms, vagy egy kis PHP/API végpont).
- **A programok, árak és a termek adatai demó tartalmak.** Az igazi adatok a klubtól jönnek.
- A **kapcsolati adatok valósak** (cím, telefon, e-mail, Facebook), a fotók a klub
  meglévő anyagaiból származnak.
- Az adatkezelési tájékoztató szövege minta — élesítés előtt jogi ellenőrzés szükséges.

## Élesítés előtt

1. Valós programok, árak, teremadatok beírása
2. Friss fotók a galériába és a hero-ba
3. Az űrlapok bekötése (e-mail küldés)
4. Adatkezelési tájékoztató és házirend véglegesítése
5. Cookie-sáv, ha analitika kerül az oldalra
6. `index.html`-ben a `canonical` és az Open Graph URL-ek a végleges domainre állítása

## Helyi futtatás

Nincs telepítés. Vagy nyisd meg az `index.html`-t böngészőben, vagy indíts egy kis szervert:

```bash
python -m http.server 8000
# majd: http://localhost:8000
```

## Közzététel GitHub Pages-en

1. Töltsd fel a mappát egy GitHub repóba
2. **Settings → Pages → Source: Deploy from a branch → `main` / `root`**
3. Pár perc múlva él a `https://<felhasznalo>.github.io/<repo>/` cím

A `.nojekyll` fájl már a repóban van, hogy a Pages ne dolgozza fel Jekyll-lel.

## Felépítés

```
.
├── index.html
├── bulik.html
├── termek.html
├── galeria.html
├── itallap.html
├── kapcsolat.html
├── assets/
│   ├── css/style.css     # teljes design rendszer, egy fájlban
│   ├── js/main.js        # minden interakció, függőség nélkül
│   └── img/              # képek
├── .nojekyll
└── README.md
```

## Technikai megjegyzések

- Betűtípusok: **Archivo** (variable, cím és szöveg), **Fraunces** (kiemelt idézetek),
  **DM Mono** (adatok, címkék) — Google Fonts-ról
- Nincs npm, nincs build, nincs külső JS könyvtár
- A színek és térközök CSS változókban (`:root`) — egy helyen átszínezhető
