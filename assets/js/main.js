/* ==========================================================================
   MAXXX CLUB — main.js
   Minta / demo weboldal. Nincs backend: az űrlapok kliens oldalon szimulálnak.
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- LOADER */
  function loader() {
    var el = $('.loader');
    if (!el) return;
    var hide = function () { setTimeout(function () { el.classList.add('done'); }, 380); };
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    setTimeout(function () { el.classList.add('done'); }, 3500); // biztonsági háló
  }

  /* --------------------------------------------------------------- DEMOBAR */
  function demobar() {
    var bar = $('.demobar');
    if (!bar) return;
    try { if (sessionStorage.getItem('maxxx-demobar') === 'off') bar.remove(); } catch (e) {}
    var btn = $('button', bar);
    if (btn) btn.addEventListener('click', function () {
      bar.remove();
      try { sessionStorage.setItem('maxxx-demobar', 'off'); } catch (e) {}
    });
  }

  /* ------------------------------------------------------------ HEADER/NAV */
  function header() {
    var head = $('.head');
    var prog = $('.progress');
    var top = $('.top');

    var onScroll = function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (head) head.classList.toggle('stuck', y > 24);
      if (top) top.classList.toggle('show', y > 700);
      if (prog) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (top) top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });

    var burger = $('.burger');
    var drawer = $('.drawer');
    if (burger && drawer) {
      var setMenu = function (open) {
        document.body.classList.toggle('menu-open', open);
        document.body.classList.toggle('is-locked', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      };
      burger.addEventListener('click', function () {
        setMenu(!document.body.classList.contains('menu-open'));
      });
      $$('a', drawer).forEach(function (a) {
        a.addEventListener('click', function () { setMenu(false); });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') setMenu(false);
      });
      setMenu(false);
    }
  }

  /* ---------------------------------------------------------------- CURSOR */
  function cursor() {
    if (window.matchMedia('(pointer: coarse)').matches || reduced) return;
    var dot = document.createElement('div');
    var ring = document.createElement('div');
    dot.className = 'cursor';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    }, { passive: true });

    (function frame() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      requestAnimationFrame(frame);
    })();

    var hot = 'a,button,summary,input,select,textarea,.gal__i,.ticket';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest && e.target.closest(hot)) document.body.classList.add('cursor-hot');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest(hot)) document.body.classList.remove('cursor-hot');
    });
  }

  /* ---------------------------------------------------------------- REVEAL */
  function reveal() {
    var items = $$('[data-rv]');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || reduced) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------- COUNTDOWN */
  // A következő szombat 22:00-ig számol vissza — mindig aktuális marad.
  function nextSaturday() {
    var now = new Date();
    var d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0, 0);
    var delta = (6 - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + delta);
    if (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 7);
    return d;
  }

  function countdown() {
    var root = $('[data-countdown]');
    if (!root) return;
    var target = nextSaturday();
    var HU_M = ['január', 'február', 'március', 'április', 'május', 'június',
                'július', 'augusztus', 'szeptember', 'október', 'november', 'december'];
    var out = $('[data-cd-date]');
    if (out) {
      out.textContent = target.getFullYear() + '. ' + HU_M[target.getMonth()] + ' ' +
        target.getDate() + '. — szombat, 22:00';
    }

    var cells = {
      d: $('[data-cd="d"]'), h: $('[data-cd="h"]'),
      m: $('[data-cd="m"]'), s: $('[data-cd="s"]')
    };
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };

    var tick = function () {
      var diff = target.getTime() - Date.now();
      if (diff <= 0) { target = nextSaturday(); diff = target.getTime() - Date.now(); }
      var s = Math.floor(diff / 1000);
      if (cells.d) cells.d.textContent = pad(Math.floor(s / 86400));
      if (cells.h) cells.h.textContent = pad(Math.floor(s / 3600) % 24);
      if (cells.m) cells.m.textContent = pad(Math.floor(s / 60) % 60);
      if (cells.s) cells.s.textContent = pad(s % 60);
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------- NYITVA-E? */
  function openNow() {
    var el = $('[data-opennow]');
    if (!el) return;
    var n = new Date(), day = n.getDay(), h = n.getHours();
    // Szombat 22:00 – vasárnap 05:00
    var open = (day === 6 && h >= 22) || (day === 0 && h < 5);
    el.textContent = open ? 'Most nyitva — gyere be' : 'Szombathely · Szombaton 22:00-tól';
    if (open) el.style.color = 'var(--acid)';
  }

  /* ----------------------------------------------------------- STAT SZÁMOK */
  function counters() {
    var nums = $$('[data-count-to]');
    if (!nums.length) return;
    if (!('IntersectionObserver' in window) || reduced) {
      nums.forEach(function (el) { el.textContent = el.dataset.countTo; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, to = parseFloat(el.dataset.countTo), t0 = null;
        var step = function (ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1400, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(to * e).toLocaleString('hu-HU');
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------- MARQUEE x2 */
  // Duplikálja a sávot, hogy a görgetés hézagmentesen ismétlődjön.
  function marquee() {
    $$('.marquee').forEach(function (m) {
      var track = $('.marquee__t', m);
      if (!track) return;
      var clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      m.appendChild(clone);
    });
  }

  /* -------------------------------------------------------- ESEMÉNYSZŰRŐK */
  function filters() {
    var bar = $('[data-filters]');
    if (!bar) return;
    var cards = $$('[data-cat]');
    var empty = $('[data-noresult]');

    $$('.filter', bar).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.dataset.filter;
        $$('.filter', bar).forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        var shown = 0;
        cards.forEach(function (c) {
          var hit = cat === 'all' || c.dataset.cat === cat;
          c.style.display = hit ? '' : 'none';
          if (hit) shown++;
        });
        if (empty) empty.style.display = shown ? 'none' : 'block';
      });
    });
  }

  /* -------------------------------------------------------------- LIGHTBOX */
  function lightbox() {
    var items = $$('.gal__i');
    if (!items.length) return;

    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Galéria nagyítás');
    lb.innerHTML =
      '<button class="lb__x" aria-label="Bezárás">✕</button>' +
      '<button class="lb__p" aria-label="Előző">‹</button>' +
      '<button class="lb__n" aria-label="Következő">›</button>' +
      '<div><img alt=""><p class="lb__cap"></p></div>';
    document.body.appendChild(lb);

    var img = $('img', lb), cap = $('.lb__cap', lb), idx = 0, last = null;

    var show = function (i) {
      idx = (i + items.length) % items.length;
      var src = items[idx].dataset.full || $('img', items[idx]).src;
      img.src = src;
      img.alt = items[idx].dataset.caption || '';
      cap.textContent = (idx + 1) + ' / ' + items.length + ' — ' + (items[idx].dataset.caption || '');
    };
    var open = function (i) {
      last = document.activeElement;
      show(i);
      lb.classList.add('open');
      document.body.classList.add('is-locked');
      $('.lb__x', lb).focus();
    };
    var close = function () {
      lb.classList.remove('open');
      document.body.classList.remove('is-locked');
      if (last) last.focus();
    };

    items.forEach(function (it, i) {
      it.addEventListener('click', function () { open(i); });
    });
    $('.lb__x', lb).addEventListener('click', close);
    $('.lb__p', lb).addEventListener('click', function () { show(idx - 1); });
    $('.lb__n', lb).addEventListener('click', function () { show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ------------------------------------------------------------------ TABS */
  function tabs() {
    $$('[data-tabs]').forEach(function (group) {
      var btns = $$('[role="tab"]', group);
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          btns.forEach(function (b) {
            var on = b === btn;
            b.setAttribute('aria-selected', on ? 'true' : 'false');
            var panel = document.getElementById(b.getAttribute('aria-controls'));
            if (panel) panel.hidden = !on;
          });
        });
      });
    });
  }

  /* -------------------------------------------------------------- FOGLALÁS */
  function booking() {
    var box = $('.book');
    if (!box) return;
    var form = $('form', box);
    if (!form) return;

    // Típusváltó: asztalfoglalás / terembérlés
    var seg = $('.seg', box);
    var roomField = $('[data-only="terem"]', box);
    var guestLabel = $('[data-guest-label]', box);

    var applyType = function (type) {
      if (roomField) roomField.style.display = (type === 'terem') ? '' : 'none';
      if (guestLabel) guestLabel.textContent = (type === 'terem') ? 'Várható létszám' : 'Hány főre';
      var sel = $('#f-room', box);
      if (sel) sel.required = (type === 'terem');
    };

    if (seg) {
      $$('button', seg).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('button', seg).forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
          b.setAttribute('aria-selected', 'true');
          applyType(b.dataset.type);
        });
      });
      var active = $('button[aria-selected="true"]', seg);
      applyType(active ? active.dataset.type : 'asztal');
    }

    // Dátum: ma vagy későbbi
    var dateInput = $('input[type="date"]', form);
    if (dateInput) {
      var t = new Date();
      dateInput.min = t.getFullYear() + '-' +
        ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('.field', form).forEach(function (f) {
        var input = $('input,select,textarea', f);
        if (!input || f.style.display === 'none') return;
        var bad = input.required && !String(input.value).trim();
        if (input.type === 'email' && input.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) bad = true;
        f.classList.toggle('err', bad);
        if (bad && ok) { input.focus(); ok = false; }
      });
      var consent = $('.consent input', form);
      if (consent && !consent.checked) {
        consent.focus();
        return;
      }
      if (!ok) return;

      // DEMO: nincs szerver, csak visszajelzés.
      var name = ($('#f-name', form) || {}).value || '';
      var slot = $('[data-ok-name]', box);
      // magyar névsorrend: a keresztnév az utolsó tag
      var parts = name.trim().split(/\s+/);
      if (slot) slot.textContent = parts[parts.length - 1] || 'Vendégünk';
      box.classList.add('sent');
      box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });

    var again = $('[data-again]', box);
    if (again) again.addEventListener('click', function () {
      form.reset();
      box.classList.remove('sent');
      $$('.field', form).forEach(function (f) { f.classList.remove('err'); });
    });
  }

  /* ------------------------------------------------------------ HÍRLEVÉL */
  function newsletter() {
    $$('[data-news]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var i = $('input', f);
        if (!i || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(i.value)) { if (i) i.focus(); return; }
        f.innerHTML = '<p class="tiny" style="color:var(--acid);margin:0">' +
          'Köszönjük! Feliratkoztunk — (demo: nem megy ki e-mail)</p>';
      });
    });
  }

  /* ------------------------------------------------------------------ ÉVSZÁM */
  function year() {
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ------------------------------------------------------------------ INIT */
  function init() {
    loader(); demobar(); header(); cursor(); reveal(); marquee();
    countdown(); openNow(); counters(); filters(); lightbox();
    tabs(); booking(); newsletter(); year();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
