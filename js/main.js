/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'tino-battaglia',
    /* nessun WhatsApp: il fisso della scheda Google */
    whatsapp: { number: '', message: '', ids: [] },
    /* pannello Google (30/9/2026): lunedì–venerdì 9–18, sabato 9–17, domenica chiuso */
    hours: {
      0: [], 1: [['09:00', '18:00']], 2: [['09:00', '18:00']], 3: [['09:00', '18:00']],
      4: [['09:00', '18:00']], 5: [['09:00', '18:00']], 6: [['09:00', '17:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1100,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Tino Battaglia: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.taglio": "The cut",
      "n.colore": "Colour",
      "n.cura": "Care and styling",
      "n.salone": "The salon",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "t.chiama": "Call",
      "t.prenota": "Book on Treatwell",
      "t.prenota2": "Book",
      "t.indicazioni": "Directions",
      "h.sopra": "Hairdresser & Stylist · Via Santa Maria alla Porta 7, Cinque Vie",
      "h.titolo": "It’s time for a new look.",
      "h.seconda": "«The hair takes on a new shape: it is “built” to measure so as to frame the face perfectly»",
      "h.testo": "Cut, colour, scalp care and styling, for women and men, a few steps from the church of Santa Maria alla Porta.",
      "h.google": "on Google, 118 reviews",
      "h.chi": "Federica, in a review on Google (in English: «Tino is a wizard!»)",
      "p.titolo": "The cut on the geometry of the face",
      "p.desc": "In the mirror with the silver frame and the lights at the sides, a training head with long hair. The guide lines of the face appear, then the cutting line; the scissors follow it and the locks below the line fall. The guides disappear, the blow-dry catches the light, the mirror lights up. Three cuts: short, to the shoulders, long.",
      "p.d0": "Short, at the chin: the cut that frames the face.",
      "p.d1": "To the shoulders: shorter, and the face stays framed.",
      "p.d2": "Long: the ends even, a shape that lasts.",
      "p.modi": "Which cut",
      "p.b0": "Short",
      "p.b1": "To the shoulders",
      "p.b2": "Long",
      "p.nota": "The geometry of the face: the guide lines, the cutting line, the scissors; then the light.",
      "c.etichetta": "The cut",
      "c.titolo": "A cut accurate down to the smallest detail, leaving nothing to chance.",
      "c.loro": "«A scientific cut based on the morphology and geometry of the face. It doesn’t lose its shape like commercial cuts and it lasts.»",
      "c.s1": "Women’s cut",
      "c.s2": "Trim",
      "c.s3": "Fringe, designed on the face of whoever wears it",
      "c.s4": "Men’s cut",
      "c.s5": "Children’s cut",
      "c.mano": "«Tino follows his artistic hand; it is the hand that leads and guides him in creating cuts, colours and hairstyles»",
      "a.forbici": "Hands with scissors and comb, a dark lock between the fingers.",
      "k.forbici": "The lock between the fingers",
      "o.etichetta2": "Colour",
      "o.titolo2": "Colour, ombré and highlights",
      "o.v1": "Colour",
      "o.v1t": "ammonia-free too, and the touch-up",
      "o.v2t": "«soft and natural at the base of the hair, intense at the ends»",
      "o.v3": "Highlights and streaks",
      "o.v3t": "to light up the base colour",
      "o.v4": "Men’s colour",
      "o.v4t": "for him too",
      "o.corso": "May 2026, the Master Colorist course:",
      "o.corsoloro": "«Whoever stops, stops learning.»",
      "a.onde": "Blonde waves, seen from behind.",
      "k.onde": "Blonde waves",
      "a.goccia": "The dropper: a drop of red pigment falls into the bowl.",
      "k.goccia": "A drop of pigment",
      "u.etichetta": "Care and styling",
      "u.titolo": "The world is more beautiful when the blow-dry is done well",
      "u.n1": "Scalp and hair",
      "u.a1": "Scalp regeneration",
      "u.a2": "Scalp peeling",
      "u.a3": "Mask",
      "u.a4": "Anti-yellow treatment",
      "u.a5": "Smoothing and keratin",
      "u.n2": "The blow-dry",
      "u.b1": "Short hair",
      "u.b2": "Long hair",
      "u.b3": "Curling, in waves",
      "u.n3": "And then",
      "u.c1": "Eyebrows and upper lip",
      "u.nota": "No prices here: for advice give us a call, to book there’s Treatwell.",
      "u.lista": "The price list on Treatwell",
      "s.etichetta": "The salon",
      "s.titolo": "Cared for, refined and welcoming",
      "s.sotto": "On Via Santa Maria alla Porta, a few metres from the church that gives the street its name: the mirrors with the light at the sides, the olive green and pale blue chairs, the wall of colours.",
      "a.specchi": "The mirrors with the silver frame and the light at the sides, the chairs, the basins at the back.",
      "k.specchi": "The mirrors",
      "a.salone": "The salon: the beige, pale blue and green chairs with the silver frame, the white basin, the window.",
      "k.salone": "The chairs and the basin",
      "a.poltrone": "The chairs in a row, the white orchids and the black wall of colours at the back.",
      "k.poltrone": "The wall of colours",
      "a.poltrona": "The olive green chair in the foreground, the others in a row, the window.",
      "k.poltrona": "The green chair",
      "a.girasoli": "Sunflowers in the vase, in front of the mirror.",
      "k.girasoli": "The sunflowers",
      "a.dallalto": "The salon seen from above: the chairs, the sunflowers, the basins.",
      "k.dallalto": "From above",
      "d.etichetta": "Reviews",
      "d.titolo": "His clients say it",
      "d.google": "on Google, 118 reviews",
      "d.g3m": "Google, 3 months ago",
      "d.g6m": "Google, 6 months ago",
      "d.g5a": "Google, 5 years ago",
      "d.g6a": "Google, 6 years ago",
      "d.g3a": "Google, 3 years ago",
      "d.g7a": "Google, 7 years ago",
      "d.nota": "From the reviews on Google, in Italian, as they were written; […] where we cut. The line at the top comes from another client, also on Google.",
      "d.tutte": "All the reviews on Google",
      "r.etichetta": "Hours and where",
      "r.titolo": "Monday to Friday 9 am–6 pm, Saturday 9 am–5 pm",
      "r.testa": "By appointment",
      "r.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "r.chiuso": "closed",
      "a.via": "The salon towards the window and the street.",
      "k.via": "From the window, Via Santa Maria alla Porta",
      "r.nota": "Hours from our Google listing (September 2026).",
      "w.mappa": "Map: Tino Battaglia, Via Santa Maria alla Porta 7, Milan",
      "w.dove": "Where",
      "w.dovev": "Via Santa Maria alla Porta 7, 20123 Milan, a few metres from the church of Santa Maria alla Porta",
      "w.tram": "By tram",
      "w.tramv": "16 and 19, Via Meravigli stop, about 70 metres away",
      "w.metro": "By metro",
      "w.metrov": "M1 Cairoli and M1 Cordusio, about 400 metres away",
      "w.tel": "Phone",
      "f2.riga": "Hairdresser & Stylist · cut, colour, care and styling",
      "f2.orario": "Monday to Friday 9 am–6 pm · Saturday 9 am–5 pm · by appointment",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · hours, rating and reviews from his Google listing (September 2026); his words from Instagram and Treatwell; the photos from his Google listing and Treatwell. We drew the head in the mirror ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ TINO BATTAGLIA — Via Santa Maria alla Porta 7 ══════════
     la FIRMA — «la geometria del viso»: nello specchio con la cornice d'argento, sulla testa studio coi capelli lunghi, le linee guida
     una dopo l'altra, la linea del taglio, le forbici che la percorrono, le ciocche che cadono; le guide spariscono, la piega prende la
     luce, lo specchio si accende. Lo stato è M (corto, alle spalle, lungo), T (0…1) e V (0 al suo posto; fino a 1 la testa esce a
     destra; da −1 a 0 entra da sinistra la prossima, coi capelli lunghi). Senza JS e alla fine: corto, T = 1, V = 0 (l'HTML).
     L'attesa (classe nell'head): i capelli lunghi. Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo
     se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[560,560],"via":380,"fasi":{"guide":{"t":0.04,"d":0.07,"passo":0.03},"linea":{"t":0.21,"d":0.08},"entra":{"t":0.29,"d":0.06},"taglio":{"t":0.35,"d":0.3},"cade":{"d":0.07},"esce":{"t":0.66,"d":0.06},"guideVia":{"t":0.72,"d":0.05},"luce":{"t":0.77,"d":0.13},"specchio":{"t":0.88,"d":0.12}},"riposo":[660,150],"x0":164,"x1":396,"colpi":9,"caduta":190,"guide":["M280 92 V300","M206 178 H354","M202 224 H358","M226 289 H334"],"modi":[{"nome":"Corto","linea":296,"ciocche":[{"quando":0.269,"centro":[207.6,387.5],"giro":-14},{"quando":0.929,"centro":[352.4,387.5],"giro":14}]},{"nome":"Alle spalle","linea":372,"ciocche":[{"quando":0.344,"centro":[206.2,427],"giro":-14},{"quando":0.956,"centro":[353.8,427],"giro":14}]},{"nome":"Lungo","linea":444,"ciocche":[{"quando":0.331,"centro":[205,462.1],"giro":-14},{"quando":0.968,"centro":[355,462.1],"giro":14}]}],"tempi":{"inizio":300,"taglio":7600,"servi":480,"arriva":520,"taglioV":6600}};
  /* il taglio a (M, T, V) — una sola fonte: la usano _tba_firma.mjs (l'HTML allo stato finale), main.js (via tba_main.cjs) e la
     prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     «Taglio scientifico basato sulla morfologia e geometria del viso» (il loro listino): nello specchio, sulla testa studio coi capelli
     lunghi, compaiono le linee guida, poi la linea del taglio; le forbici la percorrono e le ciocche sotto la linea cadono; le guide
     spariscono, la piega prende la luce, lo specchio si accende. Il modo dà la lunghezza (e il colore, dal CSS); col V la testa esce a
     destra dallo specchio, la prossima, coi capelli lunghi, entra da sinistra. */
  function creaTaglio(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var q1 = function (c) { return svg.querySelector('.' + c); };
    var servito = q1('servito'), guide = q1('guide'), forbici = q1('forbici'), lamaA = q1('forbici__lama--a'), lamaB = q1('forbici__lama--b'), luceS = q1('specchio__luce');
    var linee = D.guide.map(function (_, i) { return svg.querySelector('.guida[data-i="' + i + '"]'); });
    var P = D.modi.map(function (M, m) {
      var q = function (c) { return svg.querySelector('.' + c + '[data-m="' + m + '"]'); };
      return { linea: q('linea'), luce: q('luce'), ciocche: [0, 1].map(function (l) { return svg.querySelector('.ciocca[data-m="' + m + '"][data-l="' + l + '"]'); }) };
    });
    /* un tratto disegnato da 0 a «quanto» (pathLength = 1) */
    var tratto = function (el, quanto) { el.setAttribute('stroke-dasharray', r3(quanto) + ' 2'); el.setAttribute('stroke-dashoffset', '0'); };
    function disegna(m, t, v) {
      var F = D.fasi, q = P[m], M = D.modi[m], R = D.riposo;
      /* lo sguardo: le linee guida una dopo l'altra, poi la linea del taglio; alla fine spariscono insieme */
      linee.forEach(function (el, i) { tratto(el, dolce(fase(t, { t: F.guide.t + i * F.guide.passo, d: F.guide.d }))); });
      tratto(q.linea, dolce(fase(t, F.linea)));
      guide.setAttribute('opacity', String(r3(1 - dolce(fase(t, F.guideVia)))));
      /* le forbici: arrivano da fuori quadro all'inizio della linea, la percorrono tagliando, se ne vanno */
      var a = dolce(fase(t, F.entra)), u = fase(t, F.taglio), b = dolce(fase(t, F.esce)), x, y, y0 = M.linea - 3;
      if (b > 0) { x = D.x1 + (R[0] - D.x1) * b; y = y0 + (R[1] - y0) * b; }
      else if (u > 0) { x = D.x0 + (D.x1 - D.x0) * u; y = y0; }
      else { x = R[0] + (D.x0 - R[0]) * a; y = R[1] + (y0 - R[1]) * a; }
      forbici.setAttribute('transform', 'translate(' + r1(x) + ' ' + r1(y) + ')');
      var apre = r1(16 * Math.abs(Math.sin(u * D.colpi * Math.PI)));
      lamaA.setAttribute('transform', 'rotate(' + r1(-apre) + ')');
      lamaB.setAttribute('transform', 'rotate(' + apre + ')');
      /* le ciocche sotto la linea cadono quando le forbici le hanno passate */
      M.ciocche.forEach(function (c, l) {
        var w = fase(t, { t: F.taglio.t + F.taglio.d * c.quando, d: F.cade.d }), d = dolce(w);
        q.ciocche[l].setAttribute('transform', 'translate(0 ' + r1(D.caduta * w * w) + ') rotate(' + r1(c.giro * d) + ' ' + c.centro[0] + ' ' + c.centro[1] + ')');
        q.ciocche[l].setAttribute('opacity', String(r3(1 - c01((w - 0.4) / 0.6))));
      });
      /* la piega prende la luce; lo specchio si accende */
      tratto(q.luce, dolce(fase(t, F.luce)));
      luceS.setAttribute('opacity', String(r3(0.35 + 0.65 * dolce(fase(t, F.specchio)))));
      /* col V la testa esce a destra dallo specchio; la prossima entra da sinistra */
      servito.setAttribute('transform', 'translate(' + r1(D.via * v) + ' 0)');
    }
    var completo = !!(servito && guide && forbici && lamaA && lamaB && luceS) && linee.every(Boolean) && P.every(function (q) {
      return q.linea && q.luce && q.ciocche.every(Boolean);
    });
    return { disegna: disegna, pezzi: P, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('taglio-firma'), svgF = prendi('taglioSvg'), leggiF = prendi('taglioLeggi');
  var TAGLIO = svgF ? creaTaglio(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.specchio__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.specchio__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    TAGLIO.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) TAGLIO.disegna(k, 1, 0); });
    TAGLIO.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa restano i capelli lunghi */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: i capelli lunghi */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.taglio, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.taglio });
  }
  /* il gesto: scegliere il taglio. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è, la
     testa esce a destra dallo specchio, entra da sinistra la prossima coi capelli lunghi, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.taglioV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && TAGLIO && TAGLIO.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaTaglio); } catch (e) {}
    window.__taglio = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__taglio.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora restano i capelli lunghi */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__taglio.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
