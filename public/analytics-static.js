/* Microsoft Clarity for the static pages (blog, thank-you), with the same choice as the main site.
   Nothing loads until the visitor accepts. The choice is shared through localStorage key docket_analytics_choice.
   Script attributes: data-clarity (project id), data-page (page type), data-post (post slug), data-event (event name). */
(function () {
  var me = document.currentScript;
  if (!me) return;
  var id = (me.getAttribute('data-clarity') || '').trim();
  if (!id) return;
  var KEY = 'docket_analytics_choice';
  function get() {
    try { var v = localStorage.getItem(KEY); return v === 'granted' || v === 'denied' ? v : null; } catch (e) { return null; }
  }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* choice lasts for this visit only */ } }

  var stub = function () { (stub.q = stub.q || []).push(Array.prototype.slice.call(arguments)); };
  window.clarity = stub;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.clarity.ms/tag/' + encodeURIComponent(id);
  document.head.appendChild(s);
  function consent(v) { window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: v }); }
  consent(get() || 'denied');

  var page = me.getAttribute('data-page');
  var post = me.getAttribute('data-post');
  var ev = me.getAttribute('data-event');
  if (page) window.clarity('set', 'page_type', page);
  if (post) window.clarity('set', 'post', post);
  if (ev) window.clarity('event', ev);

  if (get()) return;
  var bar = document.createElement('div');
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Analytics choice');
  bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:50;background:#FAF8F3;border-top:2px solid #1A1714;padding:12px 20px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;font:14px/1.5 system-ui,sans-serif;color:#4A443B';
  var p = document.createElement('p');
  p.style.cssText = 'margin:0;max-width:760px';
  p.appendChild(document.createTextNode('We use Microsoft Clarity to count visitors and see how this page is used. If you accept, it sets cookies and may record where you scroll and click. '));
  var a = document.createElement('a');
  a.href = '/privacy/'; a.textContent = 'Privacy'; a.style.color = '#0D4952';
  p.appendChild(a);
  var row = document.createElement('div');
  row.style.cssText = 'display:flex;gap:8px';
  function btn(label, v, primary) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = label;
    b.style.cssText = 'cursor:pointer;padding:8px 16px;font:600 12px ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;border:1px solid ' + (primary ? '#0D4952' : '#1A1714') + ';background:' + (primary ? '#0D4952' : '#fff') + ';color:' + (primary ? '#fff' : '#1A1714');
    b.onclick = function () { save(v); consent(v); bar.remove(); };
    return b;
  }
  row.appendChild(btn('Decline', 'denied', false));
  row.appendChild(btn('Accept', 'granted', true));
  bar.appendChild(p); bar.appendChild(row);
  document.body.appendChild(bar);
})();
