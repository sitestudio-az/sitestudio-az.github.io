/* sitestudio.az — demo gül mağazası şablonu.
   Hər sayt öz index.html-ində window.SITE obyektini təyin edir, bu fayl səhifəni ondan qurur. */
(function () {
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wa = (text) => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}`;
  const icon = {
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-2Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    truck: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 6h11v9H3zM14 9h4l3 3v3h-7"/><circle cx="7" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="17" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2"/></svg>',
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8"/></svg>',
    card: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 10h18" stroke="currentColor" stroke-width="1.8"/></svg>',
    gift: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7S10 3 8 4s0 3 4 3Zm0 0s2-4 4-3 0 3-4 3Z"/></svg>',
  };
  const featIcon = (k) => icon[k] || icon.gift;

  /* ---------- səhifə ---------- */
  document.title = `${S.name} — ${S.tagline}`;
  const cats = S.categories || [];
  const filters = [{ id: 'all', label: 'Hamısı' }, ...(S.filters || cats.map((c) => ({ id: c.id, label: c.label })))];

  document.body.innerHTML = `
  <div class="demo-bar">
    <span><b>Demo sayt.</b> <a href="https://www.instagram.com/sitestudio.az/" target="_blank" rel="noopener">sitestudio.az</a> tərəfindən ${esc(S.name)} üçün təklif kimi hazırlanıb.</span>
  </div>

  <header class="hdr" id="top">
    <a class="logo" href="#top" aria-label="${esc(S.name)}">${S.logoHtml}</a>
    <nav class="nav" id="nav">
      <a href="#kolleksiya">Kolleksiya</a>
      ${cats.length ? '<a href="#kateqoriyalar">Kateqoriyalar</a>' : ''}
      <a href="#haqqimizda">Haqqımızda</a>
      <a href="#elaqe">Əlaqə</a>
    </nav>
    <div class="hdr-actions">
      <button class="icon-btn bag-btn" id="bagBtn" aria-label="Seçdiklərim">${icon.bag}<span class="bag-n" id="bagN">0</span></button>
      <a class="btn btn-sm hide-sm" href="${wa('Salam! Buket sifariş etmək istəyirəm.')}" target="_blank" rel="noopener">${icon.wa}<span>Sifariş et</span></a>
      <button class="icon-btn menu-btn" id="menuBtn" aria-label="Menyu">${icon.menu}</button>
    </div>
  </header>

  <section class="hero">
    <div class="hero-txt">
      <p class="eyebrow">${esc(S.hero.eyebrow)}</p>
      <h1>${S.hero.title}</h1>
      <p class="lead">${esc(S.hero.text)}</p>
      <div class="hero-cta">
        <a class="btn" href="#kolleksiya">Kolleksiyaya bax</a>
        <a class="btn btn-ghost" href="${wa('Salam! Buket sifariş etmək istəyirəm.')}" target="_blank" rel="noopener">${icon.wa}<span>WhatsApp</span></a>
      </div>
      <ul class="hero-facts">${S.facts.map((f) => `<li>${featIcon(f.icon)}<span><b>${esc(f.title)}</b>${esc(f.text)}</span></li>`).join('')}</ul>
    </div>
    <div class="hero-media">
      <img src="${S.hero.image}" alt="${esc(S.hero.alt || S.name)}" fetchpriority="high">
      ${S.hero.badge ? `<div class="hero-badge">${S.hero.badge}</div>` : ''}
    </div>
  </section>

  ${cats.length ? `
  <section class="sec" id="kateqoriyalar">
    <div class="sec-head"><p class="eyebrow">Kateqoriyalar</p><h2>${S.catTitle || 'Hər an üçün <em>öz buketi</em>'}</h2></div>
    <div class="cats">${cats.map((c) => `
      <button class="cat" data-filter="${c.id}">
        <span class="cat-img"><img src="${c.image}" alt="" loading="lazy"></span>
        <span class="cat-label">${esc(c.label)}</span>
      </button>`).join('')}</div>
  </section>` : ''}

  <section class="sec" id="kolleksiya">
    <div class="sec-head row">
      <div><p class="eyebrow">Kolleksiya</p><h2>${S.collectionTitle || 'Seçilmiş <em>kompozisiyalar</em>'}</h2></div>
      <div class="chips" id="chips">${filters.map((f, i) => `<button class="chip${i ? '' : ' on'}" data-filter="${f.id}">${esc(f.label)}</button>`).join('')}</div>
    </div>
    <div class="grid" id="grid">${S.products.map((p, i) => `
      <article class="card" data-cat="${p.cat}" style="--d:${i * 40}ms">
        <div class="card-img"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy">
          ${p.tag ? `<span class="card-tag">${esc(p.tag)}</span>` : ''}</div>
        <div class="card-body">
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.desc)}</p>
          <div class="card-foot">
            <span class="price">${esc(p.price || 'Qiymət sorğu ilə')}</span>
            <button class="add" data-i="${i}" aria-label="${esc(p.name)} seçdiklərimə əlavə et">${icon.bag}<span>Seç</span></button>
          </div>
        </div>
      </article>`).join('')}</div>
    <p class="empty-msg" id="emptyMsg" hidden></p>
    ${S.priceNote ? `<p class="note">${S.priceNote}</p>` : ''}
  </section>

  ${S.extraHtml || ''}

  <section class="sec steps-sec">
    <div class="sec-head"><p class="eyebrow">Sadə və rahat</p><h2>Sifariş <em>3 addımda</em></h2></div>
    <ol class="steps">
      <li><span>01</span><h3>Seçin</h3><p>Kolleksiyadan bəyəndiyiniz buketi “Seç” ilə əlavə edin.</p></li>
      <li><span>02</span><h3>Göndərin</h3><p>Seçdikləriniz hazır mesaj kimi WhatsApp-a gedir. Ünvan və vaxtı yazırsınız.</p></li>
      <li><span>03</span><h3>Təhvil alın</h3><p>${esc(S.deliveryText)}</p></li>
    </ol>
  </section>

  <section class="sec about" id="haqqimizda">
    <div class="about-media">${S.about.images.map((src) => `<img src="${src}" alt="" loading="lazy">`).join('')}</div>
    <div class="about-txt">
      <p class="eyebrow">Haqqımızda</p>
      <h2>${S.about.title}</h2>
      ${S.about.paragraphs.map((t) => `<p class="lead">${esc(t)}</p>`).join('')}
      <a class="btn btn-ghost" href="https://www.instagram.com/${S.instagram}/" target="_blank" rel="noopener">${icon.ig}<span>@${esc(S.instagram)}</span></a>
    </div>
  </section>

  <section class="sec contact" id="elaqe">
    <div class="contact-card">
      <div>
        <p class="eyebrow">Əlaqə</p>
        <h2>${S.contactTitle || 'Sifariş üçün <em>yazın</em>'}</h2>
        <ul class="contact-list">
          ${S.phones.map((p) => `<li>${icon.phone}<a href="tel:${p.replace(/[^\d+]/g, '')}">${esc(p)}</a></li>`).join('')}
          <li>${icon.pin}<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(S.mapQuery)}" target="_blank" rel="noopener">${esc(S.address)}</a></li>
          <li>${icon.clock}<span>${esc(S.hours)}</span></li>
        </ul>
      </div>
      <div class="contact-cta">
        <a class="btn btn-lg" href="${wa('Salam! Buket sifariş etmək istəyirəm.')}" target="_blank" rel="noopener">${icon.wa}<span>WhatsApp-da yazın</span></a>
        <a class="btn btn-ghost btn-lg" href="tel:${S.phones[0].replace(/[^\d+]/g, '')}">${icon.phone}<span>Zəng edin</span></a>
      </div>
    </div>
  </section>

  <footer class="ftr">
    <div class="ftr-logo">${S.logoHtml}</div>
    <p>© 2026 ${esc(S.name)}</p>
    <p class="made">Demo: <a href="https://www.instagram.com/sitestudio.az/" target="_blank" rel="noopener">sitestudio.az</a></p>
  </footer>

  <a class="wa-float" href="${wa('Salam! Buket sifariş etmək istəyirəm.')}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon.wa}</a>

  <div class="drawer-bg" id="drawerBg"></div>
  <aside class="drawer" id="drawer" aria-label="Seçdiklərim">
    <div class="drawer-head"><h3>Seçdiklərim</h3><button class="icon-btn" id="drawerClose" aria-label="Bağla">${icon.close}</button></div>
    <div class="drawer-list" id="drawerList"></div>
    <div class="drawer-foot">
      <label>Çatdırılma ünvanı və vaxtı<textarea id="drawerNote" rows="2" placeholder="Məs: Nərimanov, sabah 18:00"></textarea></label>
      <a class="btn btn-lg" id="drawerSend" target="_blank" rel="noopener">${icon.wa}<span>WhatsApp ilə göndər</span></a>
    </div>
  </aside>
  <div class="toast" id="toast"></div>`;

  /* ---------- filtr ---------- */
  const grid = $('#grid');
  const setFilter = (id) => {
    document.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.dataset.filter === id));
    let n = 0;
    grid.querySelectorAll('.card').forEach((card) => {
      const show = id === 'all' || card.dataset.cat.split(' ').includes(id);
      card.hidden = !show; if (show) n++;
    });
    const label = (filters.find((f) => f.id === id) || {}).label || '';
    $('#emptyMsg').hidden = n > 0;
    $('#emptyMsg').innerHTML = `“${esc(label)}” bölməsinin məhsulları real saytda əlavə olunacaq. İndi <a href="${wa('Salam! ' + label + ' ilə maraqlanıram.')}" target="_blank" rel="noopener">WhatsApp-da soruşun</a>.`;
  };
  document.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    setFilter(b.dataset.filter);
    if (b.classList.contains('cat')) $('#kolleksiya').scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- seçdiklərim ---------- */
  const bag = [];
  const toast = (t) => { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 1800); };
  const render = () => {
    $('#bagN').textContent = bag.length;
    $('#bagN').classList.toggle('on', bag.length > 0);
    $('#drawerList').innerHTML = bag.length ? bag.map((i, k) => `
      <div class="d-item"><img src="${S.products[i].image}" alt=""><span>${esc(S.products[i].name)}</span>
      <button class="icon-btn" data-rm="${k}" aria-label="Sil">${icon.close}</button></div>`).join('')
      : '<p class="empty">Hələ heç nə seçməmisiniz. Kolleksiyadan “Seç” düyməsi ilə əlavə edin.</p>';
    const note = $('#drawerNote').value.trim();
    const msg = `Salam! Saytdan sifariş:\n${bag.map((i) => '• ' + S.products[i].name).join('\n')}${note ? '\n\nÜnvan / vaxt: ' + note : ''}`;
    $('#drawerSend').href = wa(bag.length ? msg : 'Salam! Buket sifariş etmək istəyirəm.');
  };
  const open = (v) => { $('#drawer').classList.toggle('open', v); $('#drawerBg').classList.toggle('open', v); };
  grid.addEventListener('click', (e) => {
    const b = e.target.closest('.add'); if (!b) return;
    bag.push(+b.dataset.i); render(); toast('Seçdiklərimə əlavə olundu');
  });
  $('#drawerList').addEventListener('click', (e) => { const b = e.target.closest('[data-rm]'); if (b) { bag.splice(+b.dataset.rm, 1); render(); } });
  $('#drawerNote').addEventListener('input', render);
  $('#bagBtn').addEventListener('click', () => open(true));
  $('#drawerClose').addEventListener('click', () => open(false));
  $('#drawerBg').addEventListener('click', () => open(false));
  render();

  /* ---------- mobil menyu ---------- */
  $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  $('#nav').addEventListener('click', (e) => { if (e.target.tagName === 'A') document.body.classList.remove('nav-open'); });

  /* ---------- görünəndə animasiya ---------- */
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' }) : null;
  document.querySelectorAll('.sec-head, .card, .cat, .steps li, .about-media, .about-txt, .contact-card').forEach((el) => {
    el.classList.add('rv'); io ? io.observe(el) : el.classList.add('in');
  });
})();
