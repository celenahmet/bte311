// Helper: qs
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

// Smooth nav scroll with offset
$$('.nav-link[data-scroll], [data-scroll]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = a.getAttribute('data-scroll');
    const el = $(target);
    if(!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

// Ranges -> output bubbles
const ram = $('#ram'), ramOut = $('#ramOut');
const budget = $('#budget'), budgetOut = $('#budgetOut');

const budgetLabel = v => {
  v = Number(v);
  if (v <= 20) return 'Düşük';
  if (v <= 40) return 'Düşük‑Orta';
  if (v <= 60) return 'Orta';
  if (v <= 80) return 'Orta‑Yüksek';
  return 'Yüksek';
};

if (ram) ram.addEventListener('input', () => ramOut.textContent = `${ram.value} GB`);
if (budget) budget.addEventListener('input', () => budgetOut.textContent = budgetLabel(budget.value));

// Modal
const modal = $('#modal');
const summaryBox = $('#summary');
$$('[data-close]').forEach(btn => btn.addEventListener('click', () => closeModal()));
function openModal(){ modal.setAttribute('aria-hidden', 'false'); }
function closeModal(){ modal.setAttribute('aria-hidden', 'true'); }

// Form submit -> show preview (no backend)
const form = $('#pcForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const getUses = () => $$('#form input[name="uses"]:checked').map(i => i.value).join(', ') || 'Belirtilmedi';

  const details = [
    ['Ad Soyad', data.get('name')],
    ['E‑posta', data.get('email') || 'Belirtilmedi'],
    ['İşletim Sistemi', data.get('os')],
    ['Satın Alma Yılı', data.get('purchaseYear') || 'Belirtilmedi'],
    ['CPU', data.get('cpu') || 'Belirtilmedi'],
    ['GPU Tipi', data.get('gpuType') || 'Belirtilmedi'],
    ['GPU Modeli', data.get('gpu') || 'Belirtilmedi'],
    ['RAM', `${$('#ram')?.value || '—'} GB`],
    ['Depolama', `${data.get('storageSize') || '—'} ${data.get('storageUnit') || ''} ${data.get('storageType') ? '('+data.get('storageType')+')' : ''}`.trim()],
    ['Ekran', `${data.get('screen') || '—'} inç`],
    ['Çözünürlük', data.get('resolution') || 'Belirtilmedi'],
    ['Kullanım', getUses()],
    ['Bütçe Tercihi', budgetLabel($('#budget')?.value ?? 50)],
    ['Notlar', data.get('notes') || '—']
  ];

  // Render summary
  summaryBox.innerHTML = `<dl>${details.map(([k,v]) => `<dt>${k}</dt><dd>${String(v)}</dd>`).join('')}</dl>`;

  openModal();
});

// Footer quick open
$('#viewSummary')?.addEventListener('click', (e) => {
  e.preventDefault();
  openModal();
});

// Reset -> update bubbles
form?.addEventListener('reset', () => {
  setTimeout(() => {
    ramOut.textContent = `${ram.value} GB`;
    budgetOut.textContent = budgetLabel(budget.value);
  }, 0);
});
