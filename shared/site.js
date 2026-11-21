/* sitestudio.az · demo gül mağazası mühərriki (v2)
   Hər sayt index.html-də window.SITE obyektini verir. Bu fayl ana səhifə, mağaza (filtrlər), məhsul,
   səbət və sifariş səhifələrini hash marşrutlarla qurur: #/  #/magaza  #/mehsul/<id>  #/sebet  #/sifaris  #/ugurlu */
(function () {
  'use strict';
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => `${Math.round(n)} ₼`;
  const wa = (text) => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(S.key + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(S.key + k, JSON.stringify(v)); } catch { /* yaddaş bağlıdır: səhifə yaddaşsız da işləyir */ } },
  };
  const P = S.products;
  const byId = (id) => P.find((p) => p.id === id);
  const SIZES = S.sizes || [{ id: 'std', label: 'Standart', k: 1 }, { id: 'big', label: 'Böyük', k: 1.35 }, { id: 'lux', label: 'Lüks', k: 1.7 }];
  const sizePrice = (p, sid) => Math.round((p.price * (SIZES.find((s) => s.id === sid) || SIZES[0]).k) / 5) * 5;
  const catLabel = (id) => (S.categories.find((c) => c.id === id) || {}).label || '';
  const COLORS = S.colors || [];

  /* ---------- ikonlar ---------- */
  const I = {
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-2Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M3 6h11v9H3zM14 9h4l3 3v3h-7"/><circle cx="7" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="var(--heart-fill, none)" stroke="currentColor" stroke-width="1.7" d="M12 20s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.6 4.2 4.2 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.7"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.7"/></svg>',
    filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="1.7"/></svg>',
    card: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.7"/></svg>',
    cash: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    gift: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7S10 3 8 4s0 3 4 3Zm0 0s2-4 4-3 0 3-4 3Z"/></svg>',
    store: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.7" d="M4 9 5.5 4h13L20 9M4 9h16v11H4zM9 20v-6h6v6"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m5-5-5 5 5 5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
    minus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12" stroke="currentColor" stroke-width="1.8"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12M12 6v12" stroke="currentColor" stroke-width="1.8"/></svg>',
  };

  /* ---------- vəziyyət ---------- */
  let cart = store.get('cart', []); // [{id, size, qty}]
  let likes = store.get('likes', []);
  const saveCart = () => { store.set('cart', cart); updateBadge(); };
  const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);
  const lineTotal = (l) => sizePrice(byId(l.id), l.size) * l.qty;
  const subtotal = () => cart.reduce((n, l) => n + lineTotal(l), 0);
  const delivery = (sub, type) => (type === 'pickup' || sub === 0 || sub >= S.freeDeliveryFrom ? 0 : S.deliveryFee);

  function addToCart(id, size = 'std', qty = 1) {
    const l = cart.find((x) => x.id === id && x.size === size);
    if (l) l.qty += qty; else cart.push({ id, size, qty });
    saveCart(); toast(`${byId(id).name} səbətə əlavə olundu`, true);
    const b = $('#cartBtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }

  /* ---------- karkas ---------- */
  document.title = `${S.name} · ${S.tagline}`;
  document.body.innerHTML = `
  <a class="skip" href="#main">Əsas məzmuna keç</a>
  <div class="demo-bar"><span><b>Demo sayt.</b> <a href="https://www.instagram.com/sitestudio.az/" target="_blank" rel="noopener">sitestudio.az</a> tərəfindən ${esc(S.name)} üçün təklif kimi hazırlanıb. Qiymətlər nümunədir.</span></div>
  <header class="hdr" id="top">
    <a class="logo" href="#/" aria-label="${esc(S.name)}, ana səhifə"><img src="${S.logo}" alt="${esc(S.name)}" width="${S.logoW}" height="${S.logoH}"></a>
    <nav class="nav" id="nav" aria-label="Əsas menyu">
      <a href="#/" data-nav="home">Ana səhifə</a>
      <a href="#/magaza" data-nav="shop">Mağaza</a>
      <a href="#/#haqqimizda" data-nav="about">Haqqımızda</a>
      <a href="#/#elaqe" data-nav="contact">Əlaqə</a>
      <a class="nav-wa" href="${wa('Salam! Sifariş vermək istəyirəm.')}" target="_blank" rel="noopener">${I.wa} WhatsApp</a>
    </nav>
    <div class="hdr-actions">
      <a class="icon-btn" id="cartBtn" href="#/sebet" aria-label="Səbət">${I.bag}<span class="badge" id="cartN">0</span></a>
      <button class="icon-btn menu-btn" id="menuBtn" aria-label="Menyunu aç" aria-expanded="false" aria-controls="nav">${I.menu}</button>
    </div>
  </header>
  <main id="main" tabindex="-1"></main>
  <footer class="ftr">
    <div class="ftr-grid">
      <div class="ftr-brand"><img src="${S.logo}" alt="${esc(S.name)}" width="${S.logoW}" height="${S.logoH}"><p>${esc(S.footerLine)}</p></div>
      <div><h3>Mağaza</h3>${S.categories.filter((c) => P.some((p) => p.cats.includes(c.id))).map((c) => `<a href="#/magaza?k=${c.id}">${esc(c.label)}</a>`).join('')}</div>
      <div><h3>Əlaqə</h3>${S.phones.map((p) => `<a href="tel:${p.replace(/[^\d+]/g, '')}">${esc(p)}</a>`).join('')}<span>${esc(S.address)}</span><span>${esc(S.hours)}</span></div>
      <div><h3>Bizi izləyin</h3><a href="https://www.instagram.com/${S.instagram}/" target="_blank" rel="noopener">${I.ig} @${esc(S.instagram)}</a><a href="${wa('Salam!')}" target="_blank" rel="noopener">${I.wa} WhatsApp</a></div>
    </div>
    <p class="ftr-bottom">© 2026 ${esc(S.name)} · Demo: <a href="https://www.instagram.com/sitestudio.az/" target="_blank" rel="noopener">sitestudio.az</a></p>
  </footer>
  <a class="wa-float" href="${wa('Salam! Sifariş vermək istəyirəm.')}" target="_blank" rel="noopener" aria-label="WhatsApp ilə yazın">${I.wa}</a>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;

  const main = $('#main');
  function updateBadge() { const n = cartCount(); const b = $('#cartN'); b.textContent = n; b.classList.toggle('on', n > 0); }
  updateBadge();
  function toast(t, withLink) {
    const el = $('#toast'); el.innerHTML = `${I.check}<span>${esc(t)}</span>${withLink ? '<a href="#/sebet">Səbətə bax</a>' : ''}`;
    el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 2600);
  }
  $('#menuBtn').addEventListener('click', () => { const o = document.body.classList.toggle('nav-open'); $('#menuBtn').setAttribute('aria-expanded', o); });
  $('#nav').addEventListener('click', (e) => { if (e.target.closest('a')) document.body.classList.remove('nav-open'); });

  /* ---------- kartlar ---------- */
  const badgeHtml = (p) => p.badge ? `<span class="pbadge pbadge-${p.badge.toLowerCase()}">${esc(p.badge === 'Endirim' && p.old ? '−' + Math.round((1 - p.price / p.old) * 100) + '%' : p.badge)}</span>` : '';
  const priceHtml = (p, size = 'std') => `<span class="price">${money(sizePrice(p, size))}${p.old && size === 'std' ? ` <s>${money(p.old)}</s>` : ''}</span>`;
  const card = (p, i = 0) => `
    <article class="pcard" style="--i:${i}">
      <a class="pcard-img" href="#/mehsul/${p.id}" aria-label="${esc(p.name)}">
        <img src="${p.image}" alt="${esc(p.name)}" loading="lazy" width="600" height="750">${badgeHtml(p)}
      </a>
      <button class="like${likes.includes(p.id) ? ' on' : ''}" data-like="${p.id}" aria-label="Bəyəndiklərimə əlavə et" aria-pressed="${likes.includes(p.id)}">${I.heart}</button>
      <div class="pcard-body">
        <p class="pcat">${esc(catLabel(p.cats[0]))}</p>
        <h3><a href="#/mehsul/${p.id}">${esc(p.name)}</a></h3>
        <div class="pcard-foot">${priceHtml(p)}<button class="add" data-add="${p.id}" aria-label="${esc(p.name)} səbətə əlavə et">${I.bag}<span>Səbətə</span></button></div>
      </div>
    </article>`;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-add]'); if (a) { addToCart(a.dataset.add); return; }
    const l = e.target.closest('[data-like]');
    if (l) { const id = l.dataset.like; likes = likes.includes(id) ? likes.filter((x) => x !== id) : [...likes, id]; store.set('likes', likes);
      $$(`[data-like="${id}"]`).forEach((b) => { b.classList.toggle('on', likes.includes(id)); b.setAttribute('aria-pressed', likes.includes(id)); }); }
  });

  /* ---------- səhifələr ---------- */
  const pages = {};

  pages.home = () => {
    const top = P.filter((p) => p.featured).slice(0, 4);
    main.innerHTML = `
    ${S.heroHtml(I, wa)}
    <section class="sec">
      <div class="sec-head row"><div><p class="eyebrow">${esc(S.featuredEyebrow || 'Ən çox seçilənlər')}</p><h2>${S.featuredTitle}</h2></div>
        <a class="link-arrow" href="#/magaza">Bütün kolleksiya ${I.arrow}</a></div>
      <div class="pgrid pgrid-4">${top.map(card).join('')}</div>
    </section>
    ${S.categoriesHtml ? S.categoriesHtml(I, wa) : ''}
    ${S.signatureHtml ? S.signatureHtml(I, wa) : ''}
    <section class="sec perks">
      ${S.perks.map((k) => `<div class="perk">${I[k.icon] || I.gift}<div><b>${esc(k.title)}</b><span>${esc(k.text)}</span></div></div>`).join('')}
    </section>
    <section class="sec about" id="haqqimizda">
      <div class="about-media">${S.about.images.map((src) => `<img src="${src}" alt="" loading="lazy" width="600" height="800">`).join('')}</div>
      <div class="about-txt"><p class="eyebrow">Haqqımızda</p><h2>${S.about.title}</h2>
        ${S.about.paragraphs.map((t) => `<p class="lead">${esc(t)}</p>`).join('')}
        <a class="btn btn-ghost" href="https://www.instagram.com/${S.instagram}/" target="_blank" rel="noopener">${I.ig}<span>@${esc(S.instagram)}</span></a></div>
    </section>
    <section class="sec finale" id="elaqe">
      <div class="finale-card">
        <div><p class="eyebrow">Əlaqə</p><h2>${S.finaleTitle}</h2>
          <ul class="contact-list">
            ${S.phones.map((p) => `<li>${I.phone}<a href="tel:${p.replace(/[^\d+]/g, '')}">${esc(p)}</a></li>`).join('')}
            <li>${I.pin}<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(S.mapQuery)}" target="_blank" rel="noopener">${esc(S.address)}</a></li>
            <li>${I.clock}<span>${esc(S.hours)}</span></li>
          </ul></div>
        <div class="finale-cta"><a class="btn btn-lg" href="#/magaza">Buket seç ${I.arrow}</a>
          <a class="btn btn-ghost btn-lg" href="${wa('Salam! Sifariş vermək istəyirəm.')}" target="_blank" rel="noopener">${I.wa}<span>WhatsApp-da yazın</span></a></div>
      </div>
    </section>`;
    if (S.onHome) S.onHome(main, { P, card, money, wa, I });
  };

  pages.shop = (q) => {
    const st = {
      k: q.get('k') || 'all', min: Math.max(0, +q.get('min') || 0), max: Math.min(S.priceMax, +q.get('max') || S.priceMax), colors: [], sort: 'std',
    };
    const usedCats = S.categories.filter((c) => P.some((p) => p.cats.includes(c.id)));
    main.innerHTML = `
    <section class="sec shop">
      <nav class="crumbs" aria-label="Səhifə yolu"><a href="#/">Ana səhifə</a><span>/</span><span>Mağaza</span></nav>
      <div class="shop-head"><h1 class="h-page">Mağaza</h1><p id="count" class="muted"></p></div>
      <div class="shop-bar">
        <button class="btn btn-ghost btn-sm filters-btn" id="fOpen">${I.filter}<span>Filtrlər</span><span class="fdot" id="fDot" hidden></span></button>
        <div class="cat-pills" role="tablist" aria-label="Kateqoriyalar">${[{ id: 'all', label: 'Hamısı' }, ...usedCats].map((c) => `<button role="tab" data-k="${c.id}">${esc(c.label)}</button>`).join('')}</div>
        <label class="sort"><span>Sırala</span><select id="sort"><option value="std">Standart</option><option value="asc">Ucuzdan bahaya</option><option value="desc">Bahadan ucuza</option><option value="az">A → Z</option></select></label>
      </div>
      <div class="shop-layout">
        <aside class="filters" id="filters" aria-label="Filtrlər">
          <div class="filters-head"><h2>Filtrlər</h2><button class="icon-btn" id="fClose" aria-label="Filtrləri bağla">${I.close}</button></div>
          <fieldset><legend>Kateqoriya</legend>${[{ id: 'all', label: 'Hamısı' }, ...usedCats].map((c) => `
            <label class="radio"><input type="radio" name="k" value="${c.id}"><span>${esc(c.label)}</span><em>${c.id === 'all' ? P.length : P.filter((p) => p.cats.includes(c.id)).length}</em></label>`).join('')}</fieldset>
          <fieldset><legend>Qiymət aralığı</legend>
            <div class="range" id="range"><div class="range-track"><i id="rFill"></i></div>
              <input type="range" id="rMin" min="0" max="${S.priceMax}" step="5" value="${st.min}" aria-label="Minimum qiymət">
              <input type="range" id="rMax" min="0" max="${S.priceMax}" step="5" value="${st.max}" aria-label="Maksimum qiymət"></div>
            <div class="range-vals"><span id="vMin"></span><span id="vMax"></span></div></fieldset>
          ${COLORS.length ? `<fieldset><legend>Rəng</legend><div class="swatches">${COLORS.map((c) => `
            <label class="sw" title="${esc(c.label)}"><input type="checkbox" value="${c.id}"><i style="--c:${c.hex}"></i><span>${esc(c.label)}</span></label>`).join('')}</div></fieldset>` : ''}
          <div class="filters-foot"><button class="btn btn-ghost btn-sm" id="fReset">Sıfırla</button><button class="btn btn-sm" id="fApply">Nəticələri göstər</button></div>
        </aside>
        <div class="shop-main">
          <div class="active-chips" id="chips"></div>
          <div class="pgrid pgrid-3" id="grid"></div>
          <div class="empty" id="empty" hidden><p>Bu filtrlərə uyğun buket tapılmadı.</p><button class="btn btn-ghost btn-sm" id="eReset">Filtrləri sıfırla</button>
            <a class="btn btn-sm" href="${wa('Salam! Xüsusi buket sifariş etmək istəyirəm.')}" target="_blank" rel="noopener">${I.wa}<span>Fərdi sifariş</span></a></div>
        </div>
      </div>
      <div class="filters-bg" id="fBg"></div>
    </section>`;
    const grid = $('#grid'), rMin = $('#rMin'), rMax = $('#rMax');
    const apply = () => {
      let list = P.filter((p) => (st.k === 'all' || p.cats.includes(st.k)) && p.price >= st.min && p.price <= st.max
        && (!st.colors.length || st.colors.some((c) => p.colors.includes(c))));
      if (st.sort === 'asc') list = [...list].sort((a, b) => a.price - b.price);
      if (st.sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
      if (st.sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'az'));
      grid.innerHTML = list.map(card).join('');
      $('#count').textContent = `${list.length} məhsul tapıldı`;
      $('#empty').hidden = list.length > 0;
      $$('.cat-pills button').forEach((b) => b.setAttribute('aria-selected', b.dataset.k === st.k));
      $$('input[name=k]').forEach((r) => { r.checked = r.value === st.k; });
      const chips = [];
      if (st.k !== 'all') chips.push(`<button data-x="k">${esc(catLabel(st.k))} ${I.close}</button>`);
      if (st.min > 0 || st.max < S.priceMax) chips.push(`<button data-x="p">${st.min}–${st.max} ₼ ${I.close}</button>`);
      st.colors.forEach((c) => chips.push(`<button data-x="c" data-c="${c}">${esc(COLORS.find((x) => x.id === c).label)} ${I.close}</button>`));
      $('#chips').innerHTML = chips.join('');
      $('#fDot').hidden = !chips.length;
      const a = (st.min / S.priceMax) * 100, b = (st.max / S.priceMax) * 100;
      $('#rFill').style.left = a + '%'; $('#rFill').style.right = (100 - b) + '%';
      $('#vMin').textContent = money(st.min); $('#vMax').textContent = money(st.max);
      history.replaceState(null, '', st.k === 'all' ? '#/magaza' : `#/magaza?k=${st.k}`);
    };
    const reset = () => { st.k = 'all'; st.min = 0; st.max = S.priceMax; st.colors = []; rMin.value = 0; rMax.value = S.priceMax; $$('.sw input').forEach((c) => { c.checked = false; }); apply(); };
    $$('.cat-pills button').forEach((b) => b.addEventListener('click', () => { st.k = b.dataset.k; apply(); }));
    $$('input[name=k]').forEach((r) => r.addEventListener('change', () => { st.k = r.value; apply(); }));
    const onRange = (e) => {
      let a = +rMin.value, b = +rMax.value;
      if (a > b - 10) { if (e.target === rMin) a = b - 10; else b = a + 10; rMin.value = a; rMax.value = b; }
      st.min = a; st.max = b; apply();
    };
    rMin.addEventListener('input', onRange); rMax.addEventListener('input', onRange);
    $$('.sw input').forEach((c) => c.addEventListener('change', () => { st.colors = $$('.sw input:checked').map((x) => x.value); apply(); }));
    $('#sort').addEventListener('change', (e) => { st.sort = e.target.value; apply(); });
    $('#chips').addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.x === 'k') st.k = 'all';
      if (b.dataset.x === 'p') { st.min = 0; st.max = S.priceMax; rMin.value = 0; rMax.value = S.priceMax; }
      if (b.dataset.x === 'c') { st.colors = st.colors.filter((c) => c !== b.dataset.c); $(`.sw input[value="${b.dataset.c}"]`).checked = false; }
      apply();
    });
    const openF = (v) => { $('#filters').classList.toggle('open', v); $('#fBg').classList.toggle('open', v); document.body.classList.toggle('lock', v); };
    $('#fOpen').addEventListener('click', () => openF(true));
    $('#fClose').addEventListener('click', () => openF(false));
    $('#fBg').addEventListener('click', () => openF(false));
    $('#fApply').addEventListener('click', () => openF(false));
    $('#fReset').addEventListener('click', reset); $('#eReset').addEventListener('click', reset);
    apply();
  };

  pages.product = (id) => {
    const p = byId(id); if (!p) return pages.notFound();
    let size = 'std', qty = 1;
    const related = P.filter((x) => x.id !== p.id && x.cats.some((c) => p.cats.includes(c))).concat(P.filter((x) => x.id !== p.id)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 4);
    main.innerHTML = `
    <section class="sec product">
      <nav class="crumbs" aria-label="Səhifə yolu"><a href="#/">Ana səhifə</a><span>/</span><a href="#/magaza">Mağaza</a><span>/</span><span>${esc(p.name)}</span></nav>
      <div class="product-grid">
        <div class="product-media"><img src="${p.image}" alt="${esc(p.name)}" width="800" height="1000">${badgeHtml(p)}
          <button class="like like-lg${likes.includes(p.id) ? ' on' : ''}" data-like="${p.id}" aria-label="Bəyəndiklərimə əlavə et" aria-pressed="${likes.includes(p.id)}">${I.heart}</button></div>
        <div class="product-info">
          <p class="pcat">${p.cats.map(catLabel).filter(Boolean).join(' · ')}</p>
          <h1 class="h-page">${esc(p.name)}</h1>
          <p class="product-price" id="pPrice"></p>
          <p class="lead">${esc(p.desc)}</p>
          <fieldset class="sizes"><legend>Ölçü</legend>${SIZES.map((s) => `
            <label><input type="radio" name="size" value="${s.id}"${s.id === 'std' ? ' checked' : ''}><span><b>${esc(s.label)}</b><em>${money(sizePrice(p, s.id))}</em><small>${esc(s.note || '')}</small></span></label>`).join('')}</fieldset>
          <div class="buy-row">
            <div class="qty" aria-label="Miqdar"><button id="qM" aria-label="Azalt">${I.minus}</button><output id="qV">1</output><button id="qP" aria-label="Artır">${I.plus}</button></div>
            <button class="btn btn-lg grow" id="addBtn">${I.bag}<span>Səbətə əlavə et</span></button>
          </div>
          <button class="btn btn-ghost btn-lg wide" id="buyNow">İndi al</button>
          <ul class="product-perks">
            <li>${I.truck}<span>${esc(S.deliveryLine)}</span></li>
            <li>${I.gift}<span>Pulsuz vizitka və hədiyyə qablaşdırması</span></li>
            <li>${I.clock}<span>${esc(S.hoursShort)}</span></li>
          </ul>
        </div>
      </div>
    </section>
    <section class="sec"><div class="sec-head"><p class="eyebrow">Bunlara da baxın</p><h2>Oxşar <em>buketlər</em></h2></div>
      <div class="pgrid pgrid-4">${related.map(card).join('')}</div></section>`;
    const upd = () => { $('#pPrice').innerHTML = priceHtml(p, size) + (qty > 1 ? `<small> · cəmi ${money(sizePrice(p, size) * qty)}</small>` : ''); $('#qV').textContent = qty; };
    $$('input[name=size]').forEach((r) => r.addEventListener('change', () => { size = r.value; upd(); }));
    $('#qM').addEventListener('click', () => { qty = Math.max(1, qty - 1); upd(); });
    $('#qP').addEventListener('click', () => { qty = Math.min(20, qty + 1); upd(); });
    $('#addBtn').addEventListener('click', () => addToCart(p.id, size, qty));
    $('#buyNow').addEventListener('click', () => { addToCart(p.id, size, qty); location.hash = '#/sifaris'; });
    upd();
  };

  pages.cart = () => {
    if (!cart.length) {
      main.innerHTML = `<section class="sec narrow center"><h1 class="h-page">Səbət boşdur</h1><p class="lead">Kolleksiyadan bəyəndiyiniz buketi seçin.</p><a class="btn btn-lg" href="#/magaza">Mağazaya keç ${I.arrow}</a></section>`;
      return;
    }
    const sub = subtotal(), del = delivery(sub), left = S.freeDeliveryFrom - sub;
    main.innerHTML = `
    <section class="sec cart">
      <nav class="crumbs" aria-label="Səhifə yolu"><a href="#/">Ana səhifə</a><span>/</span><span>Səbət</span></nav>
      <h1 class="h-page">Səbət <small>(${cartCount()})</small></h1>
      <div class="checkout-grid">
        <div class="lines">${cart.map((l, i) => { const p = byId(l.id); return `
          <div class="line">
            <a href="#/mehsul/${p.id}"><img src="${p.image}" alt="" width="120" height="150"></a>
            <div class="line-info"><a href="#/mehsul/${p.id}"><b>${esc(p.name)}</b></a><span class="muted">${esc(SIZES.find((s) => s.id === l.size).label)} · ${money(sizePrice(p, l.size))}</span>
              <div class="qty qty-sm"><button data-q="-1" data-i="${i}" aria-label="Azalt">${I.minus}</button><output>${l.qty}</output><button data-q="1" data-i="${i}" aria-label="Artır">${I.plus}</button></div></div>
            <div class="line-end"><b>${money(lineTotal(l))}</b><button class="link-btn" data-rm="${i}">Sil</button></div>
          </div>`; }).join('')}</div>
        <aside class="summary">
          <h2>Sifarişin xülasəsi</h2>
          ${left > 0 ? `<div class="free-bar"><p>Pulsuz çatdırılmaya <b>${money(left)}</b> qaldı</p><i style="--w:${Math.min(100, (sub / S.freeDeliveryFrom) * 100)}%"></i></div>` : `<div class="free-bar done"><p>${I.check} Çatdırılma pulsuzdur</p><i style="--w:100%"></i></div>`}
          <dl><div><dt>Məhsullar</dt><dd>${money(sub)}</dd></div><div><dt>Çatdırılma</dt><dd>${del ? money(del) : 'Pulsuz'}</dd></div><div class="total"><dt>Cəmi</dt><dd>${money(sub + del)}</dd></div></dl>
          <a class="btn btn-lg wide" href="#/sifaris">Sifarişi rəsmiləşdir ${I.arrow}</a>
          <a class="link-arrow" href="#/magaza">${I.back} Alış-verişə davam et</a>
        </aside>
      </div>
    </section>`;
    main.addEventListener('click', function h(e) {
      if (document.body.dataset.page !== 'cart') { main.removeEventListener('click', h); return; }
      const q = e.target.closest('[data-q]'), r = e.target.closest('[data-rm]');
      if (!q && !r) return;
      if (q) { const l = cart[+q.dataset.i]; l.qty = Math.max(1, Math.min(20, l.qty + +q.dataset.q)); }
      if (r) cart.splice(+r.dataset.rm, 1);
      saveCart(); main.removeEventListener('click', h); pages.cart();
    });
  };

  pages.checkout = () => {
    if (!cart.length) { location.hash = '#/sebet'; return; }
    const d = new Date(); const iso = (x) => x.toISOString().slice(0, 10);
    const tomorrow = new Date(d.getTime() + 864e5);
    const slots = []; for (let h = S.slotFrom; h < S.slotTo; h += 2) slots.push(`${String(h).padStart(2, '0')}:00 – ${String(h + 2).padStart(2, '0')}:00`);
    let type = 'delivery', promo = 0;
    main.innerHTML = `
    <section class="sec checkout">
      <nav class="crumbs" aria-label="Səhifə yolu"><a href="#/">Ana səhifə</a><span>/</span><a href="#/sebet">Səbət</a><span>/</span><span>Sifariş</span></nav>
      <h1 class="h-page">Sifarişi rəsmiləşdir</h1>
      <ol class="steps-bar" aria-label="Addımlar"><li class="done">Səbət</li><li class="on">Məlumatlar</li><li>Təsdiq</li></ol>
      <form class="checkout-grid" id="co" novalidate>
        <div class="co-main">
          <fieldset class="co-block"><legend>Təhvil alma</legend>
            <div class="seg">
              <label><input type="radio" name="type" value="delivery" checked><span>${I.truck}<b>Ünvana çatdırılma</b><small>${esc(S.deliveryLine)}</small></span></label>
              <label><input type="radio" name="type" value="pickup"><span>${I.store}<b>Mağazadan götürəcəm</b><small>${esc(S.address)}</small></span></label>
            </div></fieldset>
          <fieldset class="co-block"><legend>Sifarişçi</legend>
            <div class="fields">
              <label class="f"><span>Ad və soyad</span><input name="name" autocomplete="name" required placeholder="Məs: Aysel Məmmədova"></label>
              <label class="f"><span>Telefon</span><input name="phone" type="tel" autocomplete="tel" required placeholder="050 000 00 00" inputmode="tel"></label>
            </div>
            <label class="check"><input type="checkbox" id="gift"><span>Gülü başqasına göndərirəm</span></label>
            <div class="fields" id="giftFields" hidden>
              <label class="f"><span>Qəbul edənin adı</span><input name="rname" placeholder="Məs: Leyla"></label>
              <label class="f"><span>Qəbul edənin telefonu</span><input name="rphone" type="tel" placeholder="055 000 00 00" inputmode="tel"></label>
              <label class="check full"><input type="checkbox" name="anon"><span>Gizli göndər (adımı demə)</span></label>
            </div></fieldset>
          <fieldset class="co-block" id="addrBlock"><legend>Çatdırılma</legend>
            <div class="fields">
              <label class="f full"><span>Ünvan</span><input name="addr" autocomplete="street-address" required placeholder="Küçə, bina, mənzil"></label>
              <label class="f"><span>Tarix</span><input name="date" type="date" required min="${iso(d)}" value="${iso(tomorrow)}"></label>
              <label class="f"><span>Vaxt</span><select name="slot">${slots.map((s) => `<option>${s}</option>`).join('')}</select></label>
            </div></fieldset>
          <fieldset class="co-block"><legend>Vizitka</legend>
            <label class="f full"><span>Vizitkaya yazı (istəyə bağlı)</span><textarea name="note" rows="3" maxlength="200" placeholder="Məs: Ad günün mübarək, əzizim!"></textarea><small class="muted" id="noteN">0 / 200</small></label></fieldset>
          <fieldset class="co-block"><legend>Ödəniş</legend>
            <div class="seg">
              <label><input type="radio" name="pay" value="card" checked><span>${I.card}<b>Kartla onlayn</b><small>Real saytda bankın təhlükəsiz ödəniş səhifəsi açılır</small></span></label>
              <label><input type="radio" name="pay" value="cash"><span>${I.cash}<b>Nağd, təhvil alanda</b><small>Kuryerə və ya mağazada</small></span></label>
            </div></fieldset>
        </div>
        <aside class="summary">
          <h2>Sifarişiniz (${cartCount()})</h2>
          <div class="mini-lines">${cart.map((l) => { const p = byId(l.id); return `<div class="mini"><img src="${p.image}" alt="" width="56" height="70"><span><b>${esc(p.name)}</b><small>${esc(SIZES.find((s) => s.id === l.size).label)} × ${l.qty}</small></span><em>${money(lineTotal(l))}</em></div>`; }).join('')}</div>
          <div class="promo"><input id="promo" placeholder="Promokod" aria-label="Promokod"><button type="button" class="btn btn-ghost btn-sm" id="promoBtn">Tətbiq et</button></div>
          <p class="muted promo-hint" id="promoMsg">Demo üçün: <b>DEMO10</b></p>
          <dl id="sum"></dl>
          <button class="btn btn-lg wide" type="submit" id="payBtn"></button>
          <p class="muted secure">${I.check} Bu demo saytdır: sifariş göndərilmir, kart məlumatı soruşulmur.</p>
        </aside>
      </form>
    </section>`;
    const form = $('#co');
    const sum = () => {
      const sub = subtotal(), del = delivery(sub, type), disc = Math.round(sub * promo);
      $('#sum').innerHTML = `<div><dt>Məhsullar</dt><dd>${money(sub)}</dd></div>${disc ? `<div class="disc"><dt>Promokod</dt><dd>−${money(disc)}</dd></div>` : ''}
        <div><dt>Çatdırılma</dt><dd>${type === 'pickup' ? 'Mağazadan' : del ? money(del) : 'Pulsuz'}</dd></div><div class="total"><dt>Yekun</dt><dd>${money(sub - disc + del)}</dd></div>`;
      $('#payBtn').innerHTML = `${form.pay.value === 'card' ? 'Ödə' : 'Sifarişi təsdiqlə'} · ${money(sub - disc + del)}`;
      return { sub, del, disc, total: sub - disc + del };
    };
    $$('input[name=type]').forEach((r) => r.addEventListener('change', () => { type = r.value; $('#addrBlock').hidden = type === 'pickup'; form.addr.required = type !== 'pickup'; sum(); }));
    $$('input[name=pay]').forEach((r) => r.addEventListener('change', sum));
    $('#gift').addEventListener('change', (e) => { $('#giftFields').hidden = !e.target.checked; });
    form.note.addEventListener('input', () => { $('#noteN').textContent = `${form.note.value.length} / 200`; });
    $('#promoBtn').addEventListener('click', () => {
      const ok = $('#promo').value.trim().toUpperCase() === 'DEMO10'; promo = ok ? 0.1 : 0;
      $('#promoMsg').innerHTML = ok ? `${I.check} Promokod tətbiq olundu: 10% endirim` : 'Bu promokod tapılmadı. Demo üçün: <b>DEMO10</b>';
      $('#promoMsg').classList.toggle('ok', ok); sum();
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      $$('.f.err', form).forEach((x) => x.classList.remove('err'));
      const bad = $$('input[required]', form).filter((i) => !i.closest('[hidden]') && (!i.value.trim() || (i.name === 'phone' && i.value.replace(/\D/g, '').length < 9)));
      if (bad.length) { bad.forEach((i) => i.closest('.f').classList.add('err')); bad[0].focus(); toast('Zəhmət olmasa qırmızı xanaları doldurun'); return; }
      const s = sum(), no = 'SS-' + String(Date.now()).slice(-6);
      const order = { no, type, ...s, lines: cart.map((l) => ({ name: byId(l.id).name, size: SIZES.find((z) => z.id === l.size).label, qty: l.qty, sum: lineTotal(l) })),
        name: form.name.value, phone: form.phone.value, addr: form.addr.value, date: form.date.value, slot: form.slot.value, note: form.note.value, pay: form.pay.value };
      store.set('lastOrder', order); cart = []; saveCart(); location.hash = '#/ugurlu';
    });
    sum();
  };

  const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];
  const azDate = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return y ? `${d} ${MONTHS[m - 1]}` : iso; };
  pages.success = () => {
    const o = store.get('lastOrder', null);
    if (!o) { location.hash = '#/'; return; }
    const msg = `Salam! Saytdan sifariş (${o.no}):\n${o.lines.map((l) => `• ${l.name} (${l.size}) × ${l.qty} = ${l.sum} ₼`).join('\n')}\nYekun: ${o.total} ₼\n${o.type === 'pickup' ? 'Mağazadan götürəcəm' : `Ünvan: ${o.addr}\nTarix: ${azDate(o.date)}, ${o.slot}`}${o.note ? `\nVizitka: ${o.note}` : ''}\nAd: ${o.name}, tel: ${o.phone}`;
    main.innerHTML = `
    <section class="sec narrow center success">
      <div class="success-mark">${I.check}</div>
      <p class="eyebrow center-eyebrow">Sifariş ${esc(o.no)}</p>
      <h1 class="h-page">Təşəkkür edirik, ${esc(o.name.split(' ')[0])}!</h1>
      <p class="lead">${o.type === 'pickup' ? 'Buketiniz hazır olanda sizə zəng edəcəyik.' : `Buketiniz ${esc(azDate(o.date))}, ${esc(o.slot)} aralığında çatdırılacaq.`}</p>
      <div class="receipt">${o.lines.map((l) => `<div><span>${esc(l.name)} <small>${esc(l.size)} × ${l.qty}</small></span><b>${money(l.sum)}</b></div>`).join('')}
        ${o.disc ? `<div><span>Promokod</span><b>−${money(o.disc)}</b></div>` : ''}<div><span>Çatdırılma</span><b>${o.del ? money(o.del) : o.type === 'pickup' ? 'Mağazadan' : 'Pulsuz'}</b></div>
        <div class="total"><span>Yekun</span><b>${money(o.total)}</b></div></div>
      <p class="demo-note">Bu, demo saytdır: sifariş heç yerə göndərilmədi. Real saytda sifariş admin panelə və sahibkarın telefonuna dərhal düşür.</p>
      <div class="center-row"><a class="btn btn-lg" href="${wa(msg)}" target="_blank" rel="noopener">${I.wa}<span>WhatsApp-da təsdiqlə</span></a><a class="btn btn-ghost btn-lg" href="#/">Ana səhifə</a></div>
    </section>`;
  };

  pages.notFound = () => { main.innerHTML = `<section class="sec narrow center"><h1 class="h-page">Səhifə tapılmadı</h1><a class="btn" href="#/">Ana səhifə</a></section>`; };

  /* ---------- marşrut ---------- */
  function route() {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [pathAndQ, anchor] = raw.split('#');
    const [path, qs] = pathAndQ.split('?');
    const q = new URLSearchParams(qs || '');
    const seg = path.split('/').filter(Boolean);
    document.body.classList.remove('nav-open', 'lock');
    const name = !seg.length ? 'home' : seg[0] === 'magaza' ? 'shop' : seg[0] === 'mehsul' ? 'product' : seg[0] === 'sebet' ? 'cart'
      : seg[0] === 'sifaris' ? 'checkout' : seg[0] === 'ugurlu' ? 'success' : 'notFound';
    document.body.dataset.page = name;
    $$('[data-nav]').forEach((a) => a.classList.toggle('on', (a.dataset.nav === 'home' && name === 'home' && !anchor) || (a.dataset.nav === 'shop' && ['shop', 'product'].includes(name))));
    pages[name](name === 'product' ? seg[1] : q);
    reveal();
    if (anchor) { const t = document.getElementById(anchor); if (t) { t.scrollIntoView(); return; } }
    window.scrollTo(0, 0);
    if (name !== 'home') main.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', route);

  /* ---------- görünəndə animasiya ---------- */
  const io = 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches
    ? new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -6% 0px' }) : null;
  function reveal() {
    $$('.sec-head, .pcard, .cat, .perk, .about-media, .about-txt, .finale-card, .sig', main).forEach((el) => {
      if (!io) return; el.classList.add('rv'); io.observe(el);
    });
  }
  route();
})();
