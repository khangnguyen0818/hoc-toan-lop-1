'use strict';
/* ===== Tiện ích chung ===== */
const R = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

const NAMES = ['Mai', 'Nam', 'An', 'Hoa', 'Bình', 'Lan', 'Minh', 'Hà', 'Việt', 'Linh', 'Khôi', 'Ngọc', 'Tú', 'Rô-bốt'];
const THINGS = [
  { n: 'quả bóng', e: '🎈' }, { n: 'bông hoa', e: '🌸' }, { n: 'cái kẹo', e: '🍬' }, { n: 'quyển vở', e: '📒' },
  { n: 'con cá', e: '🐟' }, { n: 'quả cam', e: '🍊' }, { n: 'ngôi sao', e: '⭐' }, { n: 'quả táo', e: '🍎' },
  { n: 'chiếc bút', e: '✏️' }, { n: 'cái bánh', e: '🧁' }, { n: 'viên bi', e: '🔵' }, { n: 'quả dâu', e: '🍓' }
];

/* Đọc số tiếng Việt (0 – 1000) */
const DV = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
function docSo(n) {
  if (n >= 1000) return 'một nghìn';
  if (n < 10) return DV[n];
  if (n < 100) {
    const c = Math.floor(n / 10), d = n % 10;
    const s = c === 1 ? 'mười' : DV[c] + ' mươi';
    if (d === 0) return s;
    if (d === 1) return s + (c === 1 ? ' một' : ' mốt');
    if (d === 4) return s + (c === 1 ? ' bốn' : ' tư');
    if (d === 5) return s + ' lăm';
    return s + ' ' + DV[d];
  }
  const t = Math.floor(n / 100), r = n % 100;
  const s = DV[t] + ' trăm';
  if (r === 0) return s;
  if (r < 10) return s + ' linh ' + DV[r];
  return s + ' ' + docSo(r);
}

/* Phương án nhiễu cho câu hỏi số */
function numChoices(ans, min = 0, max = 100000) {
  const s = new Set([ans]);
  for (const d of shuffle([1, -1, 2, -2, 10, -10, 3, -3])) {
    if (s.size >= 4) break;
    const v = ans + d; if (v >= min && v <= max) s.add(v);
  }
  let k = 4;
  while (s.size < 4 && k < 60) { if (ans + k <= max) s.add(ans + k); else if (ans - k >= min) s.add(ans - k); k++; }
  return shuffle([...s]).map(String);
}
function fill4(ans, cands, min = 0, max = 100000) {
  const s = new Set([String(ans)]);
  for (const c of shuffle(cands)) {
    if (s.size >= 4) break;
    if (typeof c !== 'number' || (c >= min && c <= max)) s.add(String(c));
  }
  if (s.size < 4 && !isNaN(+ans)) for (const c of numChoices(+ans, min, max)) { if (s.size >= 4) break; s.add(c); }
  return shuffle([...s]);
}
const mc = (q, a, choices, ex) => ({ q, a: String(a), choices: shuffle([...new Set([String(a), ...choices.map(String)])]), ex });
const inp = (q, a, ex) => ({ q, a: String(a), input: true, ex });

/* Câu hỏi tính toán */
function calcQ(a, b, op, o = {}) {
  const r = { '+': a + b, '-': a - b, '×': a * b, ':': a / b }[op];
  const sym = op === '-' ? '−' : op;
  const expr = `${a} ${sym} ${b}`;
  const u = o.unit ? ` ${o.unit}` : '';
  const q = o.col
    ? `<p>Đặt tính rồi tính:</p>${vCol(a, b, sym)}`
    : `<p class="eq">${a}${u} ${sym} ${b}${u} = <span class="slot">?</span>${u}</p>`;
  const base = { q, a: String(r), pair: [expr, String(r)], ex: o.ex || `${a}${u} ${sym} ${b}${u} = ${r}${u}` };
  const useInput = o.input === undefined ? Math.random() < 0.5 : o.input;
  return useInput ? { ...base, input: true } : { ...base, choices: numChoices(r, 0) };
}
function cmpQ(a, b, disp = x => x, ex) {
  const s = a > b ? '>' : a < b ? '<' : '=';
  const ent = s === '>' ? '&gt;' : s === '<' ? '&lt;' : '=';
  return { q: `<p>Chọn dấu thích hợp (&gt;, &lt;, =):</p><p class="eq">${disp(a)} <span class="slot">?</span> ${disp(b)}</p>`, a: s, choices: ['>', '<', '='], ex: ex || `${disp(a)} ${ent} ${disp(b)}` };
}
function giai(label, expr, ans, unit) {
  return `<div class="giai"><b>Bài giải</b><br>${label} là:<br>${expr} = ${ans} (${unit})<br>Đáp số: ${ans} ${unit}.</div>`;
}

/* ===== Hình minh hoạ ===== */
function vObjs(e, n, per = 5) {
  let h = '<div class="objs">';
  for (let i = 0; i < n; i += per) h += `<span class="og">${Array(Math.min(per, n - i)).fill(e).join('')}</span>`;
  return h + '</div>';
}
function vRows(rows) {
  return '<div class="rows">' + rows.map(r => `<div class="row"><span class="rl">${r.label}</span>${Array(r.n).fill(`<i>${r.e}</i>`).join('')}</div>`).join('') + '</div>';
}
function vGroups(e, k, n) {
  let h = '<div class="groups">';
  for (let i = 0; i < n; i++) h += `<span class="grp">${Array(k).fill(e).join('')}</span>`;
  return h + '</div>';
}
function vBlocks(h, t, o) {
  let s = `<div class="blocks" role="img" aria-label="${h} trăm, ${t} chục, ${o} đơn vị">`;
  for (let i = 0; i < h; i++) s += '<i class="bh"></i>';
  for (let i = 0; i < t; i++) s += '<i class="bt"></i>';
  if (o) s += '<span class="bos">' + '<i class="bo"></i>'.repeat(o) + '</span>';
  return s + '</div>';
}
/* Khung 10 ô: a chấm cam, b chấm xanh, cross chấm cuối bị gạch */
function vTen(a, b = 0, cross = 0) {
  const tot = a + b; let s = '<div class="tens">';
  for (let f = 0; f < 2; f++) {
    if (f === 1 && tot <= 10) break;
    s += '<div class="tf">';
    for (let i = f * 10; i < f * 10 + 10; i++) {
      let c = i < a ? 'ca' : i < tot ? 'cb' : '';
      if (cross && i >= tot - cross && i < tot) c += ' cx';
      s += `<i class="${c}"></i>`;
    }
    s += '</div>';
  }
  return s + '</div>';
}
function vLine(start, step = 1, hide = [], hl = null) {
  const W = 580, gap = 52, x0 = 22;
  let s = `<div class="scrollx"><svg class="nl" viewBox="0 0 ${W} 72" role="img" aria-label="Tia số"><line x1="${x0 - 8}" y1="24" x2="${W - 6}" y2="24" class="nl-ax"/><path d="M${W - 16} 16 L${W - 4} 24 L${W - 16} 32" class="nl-ar"/>`;
  for (let i = 0; i < 11; i++) {
    const v = start + i * step, x = x0 + i * gap;
    s += `<line x1="${x}" y1="15" x2="${x}" y2="33" class="nl-tk"/>`;
    if (hide.includes(v)) s += `<rect x="${x - 19}" y="40" width="38" height="28" rx="7" class="nl-box"/><text x="${x}" y="61" class="nl-q">?</text>`;
    else s += `<text x="${x}" y="60" class="nl-t${v === hl ? ' nl-hl' : ''}">${v}</text>`;
  }
  return s + '</svg></div>';
}
function vClock(h, m, size = 170) {
  let s = `<svg class="clock" viewBox="0 0 200 200" width="${size}" height="${size}" role="img" aria-label="Đồng hồ"><circle cx="100" cy="100" r="94" class="ck-rim"/><circle cx="100" cy="100" r="86" class="ck-face"/>`;
  for (let i = 0; i < 60; i++) {
    const a = i * 6 * Math.PI / 180, r1 = i % 5 ? 80 : 75;
    s += `<line x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}" x2="${100 + 85 * Math.sin(a)}" y2="${100 - 85 * Math.cos(a)}" class="ck-tk${i % 5 ? '' : ' big'}"/>`;
  }
  for (let i = 1; i <= 12; i++) {
    const a = i * 30 * Math.PI / 180;
    s += `<text x="${100 + 62 * Math.sin(a)}" y="${100 - 62 * Math.cos(a) + 7}" class="ck-n">${i}</text>`;
  }
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  s += `<line x1="100" y1="100" x2="100" y2="55" transform="rotate(${ha} 100 100)" class="ck-h"/><line x1="100" y1="100" x2="100" y2="30" transform="rotate(${ma} 100 100)" class="ck-m"/><circle cx="100" cy="100" r="6" class="ck-c"/>`;
  return s + '</svg>';
}
const THU = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
function vCal(y, m, hl) {
  const first = new Date(y, m - 1, 1).getDay(), days = new Date(y, m, 0).getDate(), off = (first + 6) % 7;
  let s = `<div class="cal"><div class="cal-h">Tháng ${m} năm ${y}</div><div class="cal-g">`;
  ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach((d, i) => s += `<b class="${i === 6 ? 'sun' : ''}">${d}</b>`);
  for (let i = 0; i < off; i++) s += '<span></span>';
  for (let d = 1; d <= days; d++) { const wd = (off + d - 1) % 7; s += `<span class="${wd === 6 ? 'sun' : ''}${d === hl ? ' hl' : ''}">${d}</span>`; }
  return s + '</div></div>';
}
const KG = n => `<span class="kg">${n} kg</span>`;
function vScale(L, Rt, tilt = 0) {
  const dy = tilt * 14;
  return `<div class="scale"><svg viewBox="0 0 300 180" aria-hidden="true"><path d="M150 62 L150 166 M108 170 L192 170" class="sc-st"/><line x1="50" y1="${60 + dy}" x2="250" y2="${60 - dy}" class="sc-bm"/><circle cx="150" cy="60" r="7" class="sc-pv"/><path d="M50 ${60 + dy} L18 ${122 + dy} M50 ${60 + dy} L82 ${122 + dy} M250 ${60 - dy} L218 ${122 - dy} M250 ${60 - dy} L282 ${122 - dy}" class="sc-str"/><path d="M12 ${122 + dy} Q50 ${146 + dy} 88 ${122 + dy} Z M212 ${122 - dy} Q250 ${146 - dy} 288 ${122 - dy} Z" class="sc-pan"/></svg><div class="sc-it" style="left:1%;bottom:${(58 - dy) / 1.8}%">${L}</div><div class="sc-it" style="left:67.7%;bottom:${(58 + dy) / 1.8}%">${Rt}</div></div>`;
}
function vJugs(arr) {
  return '<div class="jugs">' + arr.map(l => `<span class="jug"><svg viewBox="0 0 44 64" aria-hidden="true"><path d="M14 4h16v9l7 9v38H7V22l7-9z" class="jg-b"/><path d="M8 30h28v29H8z" class="jg-w"/></svg><b>${l} l</b></span>`).join('') + '</div>';
}
const vNote = v => `<span class="note n${v}"><b>${v}</b><small>đồng</small></span>`;
function vCol(a, b, op, res = '?') {
  return `<div class="colc" role="img" aria-label="${a} ${op} ${b}"><span class="cop">${op}</span><span class="cn">${a}</span><span class="cn">${b}</span><span class="cl"></span><span class="cn cr">${res}</span></div>`;
}
function vPoly(lens, unit = 'cm') {
  const L = 'ABCDEF', pts = [[30, 110]];
  lens.forEach((_, i) => pts.push([30 + 95 * (i + 1), i % 2 ? 110 : 30]));
  const W = 60 + 95 * lens.length;
  let s = `<div class="scrollx"><svg class="fig" viewBox="0 0 ${W} 140" style="max-width:${W * 1.1}px" role="img" aria-label="Đường gấp khúc"><polyline points="${pts.map(p => p.join(',')).join(' ')}" class="f-ln" fill="none"/>`;
  pts.forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="5" class="f-dot"/><text x="${x}" y="${y < 60 ? y - 12 : y + 26}" class="f-lb">${L[i]}</text>`; });
  lens.forEach((l, i) => { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; s += `<text x="${(x1 + x2) / 2 + (i % 2 ? 22 : -22)}" y="${(y1 + y2) / 2 + 5}" class="f-len">${l} ${unit}</text>`; });
  return s + '</svg></div>';
}
function vFig(k) {
  const S = b => `<svg class="fig" viewBox="0 0 360 100" role="img" aria-label="Hình vẽ">${b}</svg>`;
  const dot = (x, y, l) => `<circle cx="${x}" cy="${y}" r="5" class="f-dot"/><text x="${x}" y="${y - 13}" class="f-lb">${l}</text>`;
  if (k === 'seg') return S(`<line x1="80" y1="62" x2="280" y2="62" class="f-ln"/>${dot(80, 62, 'A')}${dot(280, 62, 'B')}`);
  if (k === 'line') return S(`<line x1="6" y1="62" x2="354" y2="62" class="f-ln"/>${dot(120, 62, 'A')}${dot(240, 62, 'B')}`);
  if (k === 'curve') return S(`<path d="M30 70 C 100 0, 160 110, 220 45 S 320 70, 335 30" class="f-ln" fill="none"/>`);
  if (k === 'pt') return S(`${dot(180, 62, 'M')}`);
  return '';
}
function vPts(col) {
  const off = pick([-34, 30]);
  const p = [[60, 78], [180, col ? 56 : 56 + off], [300, 34]];
  const names = shuffle(['A', 'B', 'C']);
  return `<svg class="fig" viewBox="0 0 360 110" role="img" aria-label="Ba điểm">${p.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="6" class="f-dot"/><text x="${x}" y="${y - 13}" class="f-lb">${names[i]}</text>`).join('')}</svg>`;
}
const SHP = {
  tri: () => '<polygon points="8,72 46,8 84,72"/>',
  circ: () => '<circle cx="46" cy="42" r="33"/>',
  pent: () => '<polygon points="46,6 84,34 70,78 22,78 8,34"/>',
  hex: () => '<polygon points="24,8 68,8 88,42 68,76 24,76 4,42"/>',
  quad: () => `<polygon points="${pick(['10,20 75,10 84,70 18,64', '22,12 82,26 70,74 8,60', '46,4 86,42 46,80 6,42', '10,16 82,16 82,70 10,70', '24,12 70,12 86,70 8,70'])}"/>`
};
function vShapes(types) {
  return '<div class="shapes">' + types.map((t, i) => `<figure><svg viewBox="0 0 92 84" aria-hidden="true" class="shp">${SHP[t]()}</svg><figcaption>${'ABCD'[i]}</figcaption></figure>`).join('') + '</div>';
}
function vRuler(len) {
  const u = 44, W = 30 + u * 10 + 20;
  let s = `<div class="scrollx"><svg class="ruler" viewBox="0 0 ${W} 110" style="max-width:${W}px" role="img" aria-label="Thước kẻ">`;
  s += `<rect x="${30}" y="18" width="${u * len}" height="22" rx="4" class="pc-body"/><polygon points="${30 + u * len},18 ${30 + u * len + 22},29 ${30 + u * len},40" class="pc-tip"/>`;
  s += `<rect x="10" y="50" width="${W - 20}" height="54" rx="6" class="rl-b"/>`;
  for (let i = 0; i <= 10; i++) {
    const x = 30 + i * u; s += `<line x1="${x}" y1="50" x2="${x}" y2="72" class="rl-t"/><text x="${x}" y="94" class="rl-n">${i}</text>`;
    if (i < 10) for (let j = 1; j < 10; j++) { const xx = x + j * u / 10; s += `<line x1="${xx}" y1="50" x2="${xx}" y2="${j === 5 ? 64 : 58}" class="rl-t thin"/>`; }
  }
  return s + `<text x="${W - 30}" y="94" class="rl-n">cm</text></svg></div>`;
}
function vGraph(rows, title) {
  return `<div class="graph"><div class="gr-t">${title}</div>` + rows.map(r => `<div class="gr-r"><span class="gr-l">${r.e} ${r.label}</span><span class="gr-v">${Array(r.n).fill(`<i>${r.icon || '🙂'}</i>`).join('')}</span></div>`).join('') + `<div class="gr-k">Mỗi 🙂 là 1 bạn</div></div>`;
}
function vBox(balls) {
  return `<div class="box3"><div class="box-in">${shuffle(balls).map(b => `<i>${b}</i>`).join('')}</div></div>`;
}

/* ===== Linh vật: bạn Cú Mèo "Bông" ===== */
function owl(mood = 'happy', size = 120) {
  const mouth = mood === 'sad' ? 'M52 86 Q60 80 68 86' : mood === 'wow' ? 'M56 84 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0' : 'M50 82 Q60 92 70 82';
  return `<svg class="owl ${mood}" viewBox="0 0 120 130" width="${size}" height="${size * 130 / 120}" aria-hidden="true">
  <path d="M22 30 L30 6 L44 24 Z M98 30 L90 6 L76 24 Z" class="ow-ear"/>
  <ellipse cx="60" cy="72" rx="46" ry="52" class="ow-body"/>
  <ellipse cx="60" cy="92" rx="28" ry="30" class="ow-belly"/>
  <path d="M40 92 q4 4 8 0 M52 102 q4 4 8 0 M64 92 q4 4 8 0 M58 112 q4 4 8 0" class="ow-feather"/>
  <circle cx="42" cy="52" r="17" class="ow-eyew"/><circle cx="78" cy="52" r="17" class="ow-eyew"/>
  <circle cx="44" cy="54" r="8" class="ow-pupil"/><circle cx="76" cy="54" r="8" class="ow-pupil"/>
  <circle cx="47" cy="51" r="2.6" class="ow-shine"/><circle cx="79" cy="51" r="2.6" class="ow-shine"/>
  <path d="M54 66 L60 76 L66 66 Z" class="ow-beak"/>
  <path d="${mouth}" class="ow-mouth"/>
  <path d="M30 6 L60 -4 L90 6 L60 16 Z" class="ow-cap" transform="translate(0 4)"/>
  <path d="M90 10 L94 30" class="ow-tassel"/><circle cx="94" cy="32" r="3" class="ow-tasselb"/>
  <ellipse cx="36" cy="122" rx="10" ry="5" class="ow-feet"/><ellipse cx="84" cy="122" rx="10" ry="5" class="ow-feet"/>
</svg>`;
}
