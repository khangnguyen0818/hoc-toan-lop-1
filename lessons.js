'use strict';
/* Nội dung bám theo SGK Toán 1 – bộ sách Kết nối tri thức với cuộc sống (NXB Giáo dục Việt Nam).
   Mỗi bài: learn (thẻ bài học), game (trò chơi), gen() sinh câu hỏi cho trò chơi & bài kiểm tra.
   Lớp 1: câu hỏi ngắn, nhiều hình; ứng dụng tự đọc to câu hỏi. */

const memoList = ids => '<ul class="recap">' + ids.map(id => { const l = BYID_RAW[id]; return `<li><b>Bài ${l.so}. ${l.title}</b><br>${l.memo}</li>`; }).join('') + '</ul>';
const BYID_RAW = {};
const EMO = ['🍎', '🍊', '⭐', '🐟', '🌸', '🎈', '🐥', '🍬', '🚗', '🐞', '🥕', '🍓', '🐰', '🦋'];

/* ---- hình minh hoạ riêng lớp 1 ---- */
const SH1 = {
  vuong: c => `<rect x="14" y="8" width="56" height="56" fill="${c}"/>`,
  tron: c => `<circle cx="42" cy="36" r="29" fill="${c}"/>`,
  tamgiac: c => `<polygon points="42,6 76,66 8,66" fill="${c}"/>`,
  chunhat: c => `<rect x="4" y="18" width="76" height="40" fill="${c}"/>`
};
const SHN = { vuong: 'Hình vuông', tron: 'Hình tròn', tamgiac: 'Hình tam giác', chunhat: 'Hình chữ nhật' };
const COLORS = ['var(--h1)', 'var(--h2)', 'var(--h3)', 'var(--h5)', 'var(--h4)', 'var(--h6)'];
function vSh(list, labels = false) {
  return '<div class="sh1">' + list.map((k, i) => `<figure><svg viewBox="0 0 84 72" aria-hidden="true">${SH1[k](COLORS[i % COLORS.length])}</svg>${labels === true ? `<figcaption>${SHN[k]}</figcaption>` : labels ? `<figcaption>${labels[i]}</figcaption>` : ''}</figure>`).join('') + '</div>';
}
const vCol3 = (top, mid, bot) => `<div class="scene-v" role="img"><span>${top}</span><span>${mid}</span><span>${bot}</span></div>`;
const vRow = (items, caps) => `<div class="scene-h" role="img">${items.map((e, i) => `<figure>${e}${caps ? `<figcaption>${caps[i]}</figcaption>` : ''}</figure>`).join('')}</div>`;
function vLens(lens, names) { const mx = Math.max(...lens); return '<div class="lens">' + lens.map((l, i) => `<div><span>${names[i]}</span><i class="l${i % 4}" style="width:${(l / mx) * 100 * 0.8}%"></i></div>`).join('') + '</div>'; }
function vT100(from, rows, q = [], hl = []) {
  let s = '<div class="t100" role="img" aria-label="Bảng số">';
  for (let v = from; v < from + rows * 10; v++) s += `<span class="${q.includes(v) ? 'q' : hl.includes(v) ? 'hl' : ''}">${q.includes(v) ? '?' : v}</span>`;
  return s + '</div>';
}
const WEEK = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ nhật'];
const vWeek = hl => '<div class="week">' + WEEK.map((d, i) => `<span class="${i === hl ? 'hl' : ''}${i === 6 ? ' sun' : ''}">${d}</span>`).join('') + '</div>';

function addNC2() { const t1 = R(1, 8), o1 = R(0, 9), t2 = R(1, 9 - t1), o2 = R(0, 9 - o1); return [t1 * 10 + o1, t2 * 10 + o2]; }
function subNB2() { const t1 = R(2, 9), o1 = R(1, 9), t2 = R(1, t1 - 1), o2 = R(0, o1); return [t1 * 10 + o1, t2 * 10 + o2]; }

const BOOK = [
/* ================= TẬP MỘT ================= */
{ tap: 1, name: 'Tập một', topics: [

{ id: 'c1', no: 1, name: 'Các số từ 0 đến 10', hue: 1, lessons: [
{ id: 'b1', so: 1, title: 'Các số 0, 1, 2, 3, 4, 5', game: 'balloon',
  memo: 'Đếm đồ vật rồi viết số: 0, 1, 2, 3, 4, 5.',
  learn: [
    { t: 'Đếm từ 1 đến 5', h: `<div class="scrollx"><table class="tbl"><tr><td>${vObjs('🍎', 1)}</td><td class="eq">1</td><td>một</td></tr><tr><td>${vObjs('🍎', 2)}</td><td class="eq">2</td><td>hai</td></tr><tr><td>${vObjs('🍎', 3)}</td><td class="eq">3</td><td>ba</td></tr><tr><td>${vObjs('🍎', 4)}</td><td class="eq">4</td><td>bốn</td></tr><tr><td>${vObjs('🍎', 5)}</td><td class="eq">5</td><td>năm</td></tr></table></div>` },
    { t: 'Số 0', h: `<div class="objs"><span class="og" style="min-width:120px;min-height:44px"></span></div><p>Đĩa không có quả nào. Ta dùng số <b class="hl eq">0</b> (đọc là <i>không</i>).</p>${vLine(0, 1, [], 0)}` },
    { t: 'Ghi nhớ', h: `<div class="memo">Đếm lần lượt từng đồ vật, đồ vật cuối cùng đếm được ứng với số nào thì có bấy nhiêu đồ vật.</div><p class="eq">0 · 1 · 2 · 3 · 4 · 5</p>` }
  ],
  gen() { const e = pick(EMO); return pick([
    () => { const n = R(0, 5); return n ? mc(`<p>Có mấy ${e}?</p>${vObjs(e, n)}`, n, fill4(n, [n + 1, n - 1, n + 2], 0, 5), `Đếm được ${n}.`) : mc('<p>Đĩa không có quả nào. Viết số mấy?</p><div class="objs"><span class="og" style="min-width:120px;min-height:44px"></span></div>', 0, [0, 1, 2, 3], 'Không có quả nào: số 0.'); },
    () => { const n = R(1, 5); return inp(`<p>Đếm và viết số:</p>${vObjs(e, n)}`, n, `Có ${n} ${e}.`); },
    () => { const s = R(0, 1); const k = R(1, 4); const seq = [0, 1, 2, 3, 4, 5].slice(s, s + 5); return inp(`<p>Số nào còn thiếu?</p><p class="eq">${seq.map((v, i) => i === k ? '<span class="slot">?</span>' : v).join(' , ')}</p>`, seq[k], `Đếm: ${seq.join(', ')}.`); },
    () => { const n = R(1, 5); return mc(`<p>Chọn hình có <b>${n}</b> ${e}:</p>`, vObjs(e, n), [vObjs(e, n), vObjs(e, n === 5 ? 3 : n + 1), vObjs(e, n === 1 ? 2 : n - 1)], `Hình có ${n} ${e}.`); }
  ])(); } },

{ id: 'b2', so: 2, title: 'Các số 6, 7, 8, 9, 10', game: 'fish',
  memo: 'Đếm tiếp: 6, 7, 8, 9, 10. Số 10 có hai chữ số: 1 và 0.',
  learn: [
    { t: 'Đếm từ 6 đến 10', h: `<div class="scrollx"><table class="tbl"><tr><td>${vObjs('⭐', 6)}</td><td class="eq">6</td><td>sáu</td></tr><tr><td>${vObjs('⭐', 7)}</td><td class="eq">7</td><td>bảy</td></tr><tr><td>${vObjs('⭐', 8)}</td><td class="eq">8</td><td>tám</td></tr><tr><td>${vObjs('⭐', 9)}</td><td class="eq">9</td><td>chín</td></tr><tr><td>${vObjs('⭐', 10)}</td><td class="eq">10</td><td>mười</td></tr></table></div><p class="tip">Mẹo: đếm theo nhóm 5 cho nhanh.</p>` },
    { t: 'Dãy số từ 0 đến 10', h: `${vLine(0, 1)}<p>Đếm xuôi: 0, 1, 2, …, 10. Đếm ngược: 10, 9, 8, …, 0.</p>` }
  ],
  gen() { const e = pick(EMO); return pick([
    () => { const n = R(6, 10); return mc(`<p>Có mấy ${e}?</p>${vObjs(e, n)}`, n, fill4(n, [n + 1, n - 1, n - 2], 0, 10), `Đếm được ${n}.`); },
    () => { const n = R(6, 10); return inp(`<p>Đếm và viết số:</p>${vTen(n)}`, n, `Có ${n} chấm.`); },
    () => { const k = R(1, 9); return inp(`<p>Số nào còn thiếu trên tia số?</p>${vLine(0, 1, [k])}`, k, `Số đứng giữa ${k - 1} và ${k + 1} là ${k}.`); },
    () => { const down = Math.random() < .5, s = R(5, 10), seq = down ? [s, s - 1, s - 2, s - 3, s - 4] : [s - 4, s - 3, s - 2, s - 1, s]; const k = R(1, 3); return inp(`<p>Đếm ${down ? 'ngược' : 'xuôi'}. Số nào còn thiếu?</p><p class="eq">${seq.map((v, i) => i === k ? '<span class="slot">?</span>' : v).join(' , ')}</p>`, seq[k], seq.join(', ')); }
  ])(); } },

{ id: 'b3', so: 3, title: 'Nhiều hơn, ít hơn, bằng nhau', game: 'race',
  memo: 'Nối từng cặp: bên nào còn thừa thì nhiều hơn.',
  learn: [
    { t: 'Nối từng cặp', h: `${vRows([{ label: 'Cốc', e: '🥛', n: 5 }, { label: 'Thìa', e: '🥄', n: 3 }])}<p>Nối mỗi cốc với một thìa: còn thừa cốc. Số cốc <b>nhiều hơn</b> số thìa; số thìa <b>ít hơn</b> số cốc.</p>` },
    { t: 'Bằng nhau', h: `${vRows([{ label: 'Thỏ', e: '🐰', n: 4 }, { label: 'Cà rốt', e: '🥕', n: 4 }])}<p>Mỗi bạn thỏ có đúng một củ cà rốt: số thỏ và số cà rốt <b>bằng nhau</b>.</p>` }
  ],
  gen() { const pairs = [['🐰', '🥕', 'thỏ', 'cà rốt'], ['🐝', '🌸', 'ong', 'bông hoa'], ['🐶', '🦴', 'chó', 'khúc xương'], ['🐥', '🐛', 'gà con', 'con sâu']]; const p = pick(pairs); const a = R(2, 8), b = pick([a, R(2, 8)]); const rows = vRows([{ label: '', e: p[0], n: a }, { label: '', e: p[1], n: b }]); return pick([
    () => mc(`<p>So sánh số ${p[2]} và số ${p[3]}:</p>${rows}`, a > b ? `Số ${p[2]} nhiều hơn` : a < b ? `Số ${p[2]} ít hơn` : 'Bằng nhau', [`Số ${p[2]} nhiều hơn`, `Số ${p[2]} ít hơn`, 'Bằng nhau'], `Có ${a} ${p[2]} và ${b} ${p[3]}.`),
    () => { const x = R(2, 7), y = R(x + 1, 9), top = Math.random() < .5, A = top ? y : x, B = top ? x : y; return mc(`<p>Hàng nào có <b>nhiều</b> ${p[2]} hơn?</p>${vRows([{ label: 'A', e: p[0], n: A }, { label: 'B', e: p[0], n: B }])}`, A > B ? 'Hàng A' : 'Hàng B', ['Hàng A', 'Hàng B'], `Hàng A có ${A}, hàng B có ${B}.`); }
  ])(); } },

{ id: 'b4', so: 4, title: 'So sánh số', game: 'balloon',
  memo: 'Dấu > đọc là “lớn hơn”, dấu < đọc là “bé hơn”, dấu = đọc là “bằng”.',
  learn: [
    { t: 'Lớn hơn, bé hơn', h: `<div class="row-c">${vObjs('🍓', 5)}<span class="eq">&gt;</span>${vObjs('🍓', 3)}</div><p class="eq">5 &gt; 3 &nbsp; 3 &lt; 5</p><p>5 <b>lớn hơn</b> 3; 3 <b>bé hơn</b> 5.</p>` },
    { t: 'Bằng nhau', h: `<div class="row-c">${vObjs('🐟', 4)}<span class="eq">=</span>${vObjs('🐟', 4)}</div><p class="eq">4 = 4</p><div class="memo">Đầu nhọn của dấu &gt;, &lt; luôn quay về số bé hơn.</div>` }
  ],
  gen() { const e = pick(EMO); return pick([
    () => { const a = R(0, 10), b = R(0, 10); const q = cmpQ(a, b); if (a <= 6 && b <= 6) q.q += `<div class="row-c">${vObjs(e, a || 0)}<span class="eq">?</span>${vObjs(e, b || 0)}</div>`; return q; },
    () => { const s = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 3); const big = Math.random() < .5; const v = big ? Math.max(...s) : Math.min(...s); return mc(`<p>Số nào <b>${big ? 'lớn nhất' : 'bé nhất'}</b>?</p><p class="eq">${s.join(' , ')}</p>`, v, s, `Số ${big ? 'lớn nhất' : 'bé nhất'} là ${v}.`); },
    () => { const a = R(1, 9); const big = Math.random() < .5; return mc(`<p>Số nào ${big ? 'lớn hơn' : 'bé hơn'} <b>${a}</b>?</p>`, big ? a + 1 : a - 1, [a + 1, a - 1, a].filter((v, i, x) => x.indexOf(v) === i), `${big ? a + 1 : a - 1} ${big ? '&gt;' : '&lt;'} ${a}.`); }
  ])(); } },

{ id: 'b5', so: 5, title: 'Mấy và mấy', game: 'memory',
  memo: 'Tách một số thành hai phần: 6 gồm 4 và 2; 6 gồm 5 và 1…',
  learn: [
    { t: 'Tách và gộp', h: `${vTen(4, 2)}<p>Có 4 chấm cam và 2 chấm xanh. <b>6 gồm 4 và 2</b>.</p>` },
    { t: 'Các cách tách số 5', h: `<p class="eq">5 gồm 4 và 1 · 5 gồm 3 và 2 · 5 gồm 2 và 3 · 5 gồm 1 và 4</p>${vTen(3, 2)}` }
  ],
  gen() { const n = R(3, 10), a = R(1, n - 1); return pick([
    () => ({ ...inp(`<p class="eq">${n} gồm ${a} và <span class="slot">?</span></p>${vTen(a, n - a)}`, n - a, `${n} gồm ${a} và ${n - a}.`), pair: [`${n} gồm ${a} và ?`, String(n - a)] }),
    () => ({ ...inp(`<p class="eq"><span class="slot">?</span> gồm ${a} và ${n - a}</p>${vTen(a, n - a)}`, n, `Gộp ${a} và ${n - a} được ${n}.`), pair: [`${a} và ${n - a} là ?`, String(n)] }),
    () => { const e = pick(EMO); return inp(`<p>Có tất cả mấy ${e}?</p>${vObjs(e, a)}<p class="plus-sign">và</p>${vObjs(e, n - a)}`, n, `${a} và ${n - a} gộp lại được ${n}.`); }
  ])(); } },

{ id: 'b6', so: 6, title: 'Luyện tập chung', game: 'race', mix: ['b1', 'b2', 'b3', 'b4', 'b5'] }
]},

{ id: 'c2', no: 2, name: 'Làm quen với một số hình phẳng', hue: 2, lessons: [
{ id: 'b7', so: 7, title: 'Hình vuông, hình tròn, hình tam giác, hình chữ nhật', game: 'fish',
  memo: 'Nhận biết hình vuông, hình tròn, hình tam giác, hình chữ nhật.',
  learn: [
    { t: 'Bốn hình phẳng', h: `${vSh(['vuong', 'tron', 'tamgiac', 'chunhat'], true)}` },
    { t: 'Quanh em có hình gì?', h: `<p>🪟 Ô cửa sổ: hình vuông · 🕐 Mặt đồng hồ: hình tròn · 🚩 Lá cờ đuôi nheo: hình tam giác · 📱 Màn hình điện thoại: hình chữ nhật</p><div class="memo">Hình tam giác có 3 cạnh. Hình vuông và hình chữ nhật có 4 cạnh. Hình tròn không có cạnh thẳng.</div>` }
  ],
  gen() { const K = Object.keys(SH1); return pick([
    () => { const k = pick(K); return mc(`<p>Đây là hình gì?</p>${vSh([k])}`, SHN[k], K.map(x => SHN[x]), `Đây là ${SHN[k].toLowerCase()}.`); },
    () => { const k = pick(K); const list = shuffle([k, ...shuffle(K.filter(x => x !== k)).slice(0, 3)]); const i = list.indexOf(k); return mc(`<p>Hình nào là <b>${SHN[k].toLowerCase()}</b>?</p>${vSh(list, ['A', 'B', 'C', 'D'])}`, 'ABCD'[i], ['A', 'B', 'C', 'D'], `Hình ${'ABCD'[i]} là ${SHN[k].toLowerCase()}.`); },
    () => { const k = pick(K); const list = shuffle(Array.from({ length: 7 }, () => pick(K))); const c = list.filter(x => x === k).length; return c ? inp(`<p>Có mấy <b>${SHN[k].toLowerCase()}</b>?</p>${vSh(list)}`, c, `Đếm được ${c} ${SHN[k].toLowerCase()}.`) : inp(`<p>Có tất cả mấy hình?</p>${vSh(list)}`, list.length, `Có ${list.length} hình.`); },
    () => { const c = pick([['Hình tam giác', 3], ['Hình vuông', 4], ['Hình chữ nhật', 4]]); return inp(`<p>${c[0]} có mấy cạnh?</p>`, c[1], `${c[0]} có ${c[1]} cạnh.`); }
  ])(); } },

{ id: 'b9', so: 9, title: 'Luyện tập chung', game: 'balloon', mix: ['b7', 'b4', 'b5'] }
]},

{ id: 'c3', no: 3, name: 'Phép cộng, phép trừ trong phạm vi 10', hue: 3, lessons: [
{ id: 'b10', so: 10, title: 'Phép cộng trong phạm vi 10', game: 'balloon',
  memo: 'Gộp lại, thêm vào thì làm phép cộng. Dấu + đọc là “cộng”.',
  learn: [
    { t: 'Gộp lại', h: `${vObjs('🐥', 3)}<p class="plus-sign">+</p>${vObjs('🐥', 2)}<p class="eq">3 + 2 = 5</p><p>Có 3 bạn gà, thêm 2 bạn gà. Có tất cả 5 bạn gà. Đọc là: <i>ba cộng hai bằng năm</i>.</p>` },
    { t: 'Đổi chỗ các số', h: `<p class="eq">4 + 1 = 5 &nbsp; 1 + 4 = 5</p><div class="memo">Đổi chỗ hai số trong phép cộng thì kết quả không thay đổi. Số nào cộng với 0 cũng bằng chính số đó.</div>` }
  ],
  gen() { const a = R(0, 9), b = R(0, 10 - a), e = pick(EMO); return pick([
    () => { const q = calcQ(a, b, '+'); if (a + b <= 10 && a && b) q.q += `${vObjs(e, a)}<p class="plus-sign">+</p>${vObjs(e, b)}`; return q; },
    () => calcQ(a, b, '+'),
    () => inp(`<p class="wp">Có ${a || 1} ${e}, thêm ${b || 1} ${e}. Có tất cả mấy ${e}?</p>${vObjs(e, a || 1)}<p class="plus-sign">+</p>${vObjs(e, b || 1)}`, (a || 1) + (b || 1), `${a || 1} + ${b || 1} = ${(a || 1) + (b || 1)}`),
    () => { const c = R(2, 10), x = R(0, c); return inp(`<p class="eq">${x} + <span class="slot">?</span> = ${c}</p>`, c - x, `${x} + ${c - x} = ${c}`); }
  ])(); } },

{ id: 'b11', so: 11, title: 'Phép trừ trong phạm vi 10', game: 'fish',
  memo: 'Bớt đi, bay đi, ăn mất thì làm phép trừ. Dấu − đọc là “trừ”.',
  learn: [
    { t: 'Bớt đi', h: `${vTen(6, 0, 2)}<p class="eq">6 − 2 = 4</p><p>Có 6 quả bóng, bay mất 2 quả. Còn lại 4 quả. Đọc là: <i>sáu trừ hai bằng bốn</i>.</p>` },
    { t: 'Ghi nhớ', h: `<div class="memo">Số nào trừ đi 0 cũng bằng chính số đó. Số nào trừ đi chính nó thì bằng 0.</div><p class="eq">7 − 0 = 7 &nbsp; 7 − 7 = 0</p>` }
  ],
  gen() { const a = R(1, 10), b = R(0, a); return pick([
    () => { const q = calcQ(a, b, '-'); if (b) q.q += vTen(a, 0, b); return q; },
    () => calcQ(a, b, '-'),
    () => { const e = pick(['🐦', '🎈', '🦋']); return inp(`<p class="wp">Có ${a} ${e}, ${b || 1} ${e} bay đi. Còn lại mấy ${e}?</p>${vTen(a, 0, b || 1)}`, a - (b || 1), `${a} − ${b || 1} = ${a - (b || 1)}`); },
    () => inp(`<p class="eq">${a} − <span class="slot">?</span> = ${a - b}</p>`, b, `${a} − ${b} = ${a - b}`)
  ])(); } },

{ id: 'b12', so: 12, title: 'Bảng cộng, bảng trừ trong phạm vi 10', game: 'memory',
  memo: 'Từ một phép cộng có hai phép trừ: 3 + 4 = 7 → 7 − 3 = 4; 7 − 4 = 3.',
  learn: [
    { t: 'Bảng cộng', h: `<div class="mtab">${[[1, 9], [2, 8], [3, 7], [4, 6], [5, 5], [6, 4], [7, 3], [8, 2], [9, 1]].map(([a, b]) => `<span>${a} + ${b} = <b>10</b></span>`).join('')}</div><p class="tip">Các cặp số cộng lại bằng 10 rất hay dùng!</p>` },
    { t: 'Cộng và trừ', h: `<p class="eq">3 + 4 = 7</p><p class="eq">7 − 3 = 4 &nbsp; 7 − 4 = 3</p>` }
  ],
  gen() { return pick([
    () => { const a = R(0, 9), b = R(0, 10 - a); return calcQ(a, b, '+'); },
    () => { const a = R(1, 10), b = R(0, a); return calcQ(a, b, '-'); },
    () => { const s = R(4, 10); const a = R(1, s - 1); const ch = new Set([`${a} + ${s - a}`]); while (ch.size < 3) { const x = R(0, 9), y = R(0, 9); if (x + y !== s && x + y <= 10) ch.add(`${x} + ${y}`); } return mc(`<p>Phép tính nào có kết quả bằng <b>${s}</b>?</p>`, `${a} + ${s - a}`, [...ch], `${a} + ${s - a} = ${s}`); }
  ])(); } },

{ id: 'b13', so: 13, title: 'Luyện tập chung', game: 'race', mix: ['b10', 'b11', 'b12'] }
]},

{ id: 'c4', no: 4, name: 'Làm quen với một số hình khối', hue: 4, lessons: [
{ id: 'b14', so: 14, title: 'Khối lập phương, khối hộp chữ nhật', game: 'balloon',
  memo: 'Con xúc xắc có dạng khối lập phương; hộp quà, viên gạch có dạng khối hộp chữ nhật.',
  learn: [
    { t: 'Khối lập phương', h: `<p class="big-e">🎲 🧊</p><p>Con xúc xắc, viên đá lạnh có dạng <b>khối lập phương</b>. Các mặt đều là hình vuông.</p>` },
    { t: 'Khối hộp chữ nhật', h: `<p class="big-e">📦 🎁 🧱</p><p>Hộp quà, thùng hàng, viên gạch có dạng <b>khối hộp chữ nhật</b>.</p><div class="memo">Quả bóng ⚽ không phải khối lập phương hay khối hộp chữ nhật vì nó tròn, lăn được.</div>` }
  ],
  gen() { const LP = ['🎲', '🧊'], HCN = ['📦', '🎁', '🧱'], OTHER = ['⚽', '🥫', '🏀', '🍉']; return pick([
    () => { const a = pick(LP); return mc('<p>Đồ vật nào có dạng <b>khối lập phương</b>?</p>', a, [a, pick(HCN), pick(OTHER)], `${a} có dạng khối lập phương.`); },
    () => { const a = pick(HCN); return mc('<p>Đồ vật nào có dạng <b>khối hộp chữ nhật</b>?</p>', a, [a, pick(OTHER), pick(OTHER.filter(x => x !== '⚽'))], `${a} có dạng khối hộp chữ nhật.`); },
    () => { const c1 = R(1, 4), c2 = R(1, 4); const items = shuffle([...Array(c1).fill(0).map(() => pick(LP)), ...Array(c2).fill(0).map(() => pick(HCN)), pick(OTHER)]); const askLP = Math.random() < .5; return inp(`<p>Có mấy đồ vật dạng <b>${askLP ? 'khối lập phương' : 'khối hộp chữ nhật'}</b>?</p><div class="big-e mix">${items.join(' ')}</div>`, askLP ? c1 : c2, `Có ${askLP ? c1 : c2} đồ vật.`); }
  ])(); } },

{ id: 'b15', so: 15, title: 'Vị trí, định hướng trong không gian', game: 'race',
  memo: 'Trên – dưới, phải – trái, trước – sau, ở giữa.',
  learn: [
    { t: 'Trên – dưới', h: `${vCol3('🐦', '🌳', '🐱')}<p>Con chim ở <b>trên</b> cây. Con mèo ở <b>dưới</b> gốc cây.</p>` },
    { t: 'Trái – phải, ở giữa', h: `${vRow(['🐶', '🐱', '🐰'], ['bên trái', 'ở giữa', 'bên phải'])}<p>Chó ở <b>bên trái</b>, thỏ ở <b>bên phải</b>, mèo ở <b>giữa</b> chó và thỏ.</p><p class="tip">Tay cầm bút là tay phải.</p>` },
    { t: 'Trước – sau', h: `${vRow(['🚌', '🚗', '🚲'])}<p>Các xe đi về bên trái. Xe buýt đi <b>trước</b>, xe đạp đi <b>sau</b> cùng.</p>` }
  ],
  gen() { const A = shuffle(['🐶', '🐱', '🐰', '🐻', '🐸', '🐵']).slice(0, 3); const NM = { '🐶': 'con chó', '🐱': 'con mèo', '🐰': 'con thỏ', '🐻': 'con gấu', '🐸': 'con ếch', '🐵': 'con khỉ' }; return pick([
    () => mc(`<p>Con vật nào ở <b>giữa</b>?</p>${vRow(A)}`, A[1], A, `${NM[A[1]]} ở giữa.`),
    () => { const right = Math.random() < .5; return mc(`<p>Con vật nào ở <b>bên ${right ? 'phải' : 'trái'}</b> ${NM[A[1]]}?</p>${vRow(A)}`, right ? A[2] : A[0], A, `${NM[right ? A[2] : A[0]]} ở bên ${right ? 'phải' : 'trái'} ${NM[A[1]]}.`); },
    () => { const s = pick([['🐦', '🏠', '🐕'], ['☁️', '⛰️', '🐄'], ['🍎', '🧺', '🐈'], ['🎈', '👦', '⚽']]); const up = Math.random() < .5; return mc(`<p>Vật nào ở <b>${up ? 'trên' : 'dưới'}</b>?</p>${vCol3(...s)}`, up ? s[0] : s[2], s, `${up ? s[0] : s[2]} ở ${up ? 'trên' : 'dưới'}.`); },
    () => mc(`<p>Các bạn xếp hàng đi về bên trái. Bạn nào đi <b>đầu tiên</b>?</p>${vRow(A)}`, A[0], A, `${NM[A[0]]} đi trước tiên.`)
  ])(); } },

{ id: 'b16', so: 16, title: 'Luyện tập chung', game: 'fish', mix: ['b14', 'b15', 'b7'] }
]},

{ id: 'c5', no: 5, name: 'Ôn tập học kì 1', hue: 7, lessons: [
{ id: 'on1', so: '17–20', title: 'Ôn tập học kì 1', game: 'race', mixTopics: ['c1', 'c2', 'c3', 'c4'] }
]}
]},

/* ================= TẬP HAI ================= */
{ tap: 2, name: 'Tập hai', topics: [

{ id: 'c6', no: 6, name: 'Các số đến 100', hue: 1, lessons: [
{ id: 'b21', so: 21, title: 'Số có hai chữ số', game: 'balloon',
  memo: 'Số có hai chữ số gồm chục và đơn vị: 34 gồm 3 chục và 4 đơn vị.',
  learn: [
    { t: 'Chục và đơn vị', h: `${vBlocks(0, 3, 4)}<p>Mỗi thanh là <b>1 chục</b> (10 khối nhỏ). Có 3 chục và 4 đơn vị: viết <b class="hl">34</b>, đọc là <i>ba mươi tư</i>.</p>` },
    { t: 'Các số tròn chục', h: `<p class="eq">10, 20, 30, 40, 50, 60, 70, 80, 90</p><p>${vBlocks(0, 5, 0)} 5 chục = 50 (năm mươi).</p><p class="tip">10 chục là 100 (một trăm).</p>` }
  ],
  gen() { const n = R(10, 99), t = Math.floor(n / 10), o = n % 10; return pick([
    () => inp(`<p>Viết số:</p>${vBlocks(0, t, o)}`, n, `${t} chục và ${o} đơn vị: ${n}.`),
    () => mc(`<p>Số “<b>${docSo(n)}</b>” viết là:</p>`, n, fill4(n, [o * 10 + t || n + 1, n + 1, n + 10], 10, 99), `Viết là ${n}.`),
    () => inp(`<p>Số <b>${n}</b> gồm mấy chục?</p>`, t, `${n} gồm ${t} chục và ${o} đơn vị.`),
    () => { const k = R(1, 9); return inp(`<p>Có mấy chục que tính? Viết số:</p>${vBlocks(0, k, 0)}`, k * 10, `${k} chục là ${k * 10}.`); }
  ])(); } },

{ id: 'b22', so: 22, title: 'So sánh số có hai chữ số', game: 'sort', sort: [10, 99],
  memo: 'So sánh số chục trước; số chục bằng nhau thì so sánh số đơn vị.',
  learn: [
    { t: 'So sánh số chục', h: `<div class="row-c">${vBlocks(0, 4, 2)}<span class="eq">&lt;</span>${vBlocks(0, 5, 1)}</div><p class="eq">42 &lt; 51</p><p>4 chục bé hơn 5 chục.</p>` },
    { t: 'Số chục bằng nhau', h: `<p class="eq">36 &gt; 33</p><p>Cùng 3 chục, so sánh số đơn vị: 6 &gt; 3.</p>` }
  ],
  gen() { return pick([
    () => { const a = R(10, 99), b = pick([R(10, 99), Math.floor(a / 10) * 10 + R(0, 9)]); return cmpQ(a, b); },
    () => { const s = [...new Set(Array.from({ length: 5 }, () => R(10, 99)))].slice(0, 3); const big = Math.random() < .5; const v = big ? Math.max(...s) : Math.min(...s); return mc(`<p>Số nào <b>${big ? 'lớn nhất' : 'bé nhất'}</b>?</p><p class="eq">${s.join(' , ')}</p>`, v, s, `Số ${big ? 'lớn nhất' : 'bé nhất'} là ${v}.`); }
  ])(); } },

{ id: 'b23', so: 23, title: 'Bảng các số từ 1 đến 100', game: 'race',
  memo: 'Trong bảng số, đi sang phải thêm 1, đi xuống dưới thêm 10.',
  learn: [
    { t: 'Bảng số', h: `${vT100(1, 10)}` },
    { t: 'Đọc bảng số', h: `${vT100(31, 3, [], [44, 45, 54])}<p>Số liền sau 44 là <b>45</b> (bên phải). Số ở ngay dưới 44 là <b>54</b> (thêm 1 chục).</p><div class="memo">Số liền trước: bớt 1. Số liền sau: thêm 1.</div>` }
  ],
  gen() { const start = R(0, 7) * 10 + 1; return pick([
    () => { const v = start + R(0, 29); return inp(`<p>Số nào ở ô <b>?</b></p>${vT100(start, 3, [v])}`, v, `Đếm trong bảng: ${v}.`); },
    () => { const n = R(10, 98); return inp(`<p>Số liền sau của <b>${n}</b> là số nào?</p>`, n + 1, `${n} + 1 = ${n + 1}`); },
    () => { const n = R(11, 99); return inp(`<p>Số liền trước của <b>${n}</b> là số nào?</p>`, n - 1, `${n} − 1 = ${n - 1}`); },
    () => { const n = R(1, 89); return inp(`<p>Trong bảng số, số ở <b>ngay dưới</b> số ${n} là số nào?</p>${vT100(Math.floor((n - 1) / 10) * 10 + 1, 2, [n + 10], [n])}`, n + 10, `Đi xuống một hàng thì thêm 10: ${n + 10}.`); }
  ])(); } },

{ id: 'b24', so: 24, title: 'Luyện tập chung', game: 'fish', mix: ['b21', 'b22', 'b23'] }
]},

{ id: 'c7', no: 7, name: 'Độ dài và đo độ dài', hue: 2, lessons: [
{ id: 'b25', so: 25, title: 'Dài hơn, ngắn hơn', game: 'balloon',
  memo: 'Đặt các vật thẳng hàng ở một đầu để so sánh dài hơn, ngắn hơn, cao hơn, thấp hơn.',
  learn: [
    { t: 'So sánh độ dài', h: `${vLens([8, 5], ['Bút chì đỏ', 'Bút chì xanh'])}<p>Bút chì đỏ <b>dài hơn</b> bút chì xanh. Bút chì xanh <b>ngắn hơn</b> bút chì đỏ.</p>` },
    { t: 'Cao hơn, thấp hơn', h: `<p class="big-e">🦒 🐘 🐕</p><p>Hươu cao cổ <b>cao hơn</b> con voi. Con chó <b>thấp hơn</b> con voi.</p>` }
  ],
  gen() { const L = shuffle([3, 5, 7, 9, 11]).slice(0, 3), N = ['A', 'B', 'C']; return pick([
    () => { const i = L.indexOf(Math.max(...L)); return mc(`<p>Bút chì nào <b>dài nhất</b>?</p>${vLens(L, N)}`, N[i], N, `Bút chì ${N[i]} dài nhất.`); },
    () => { const i = L.indexOf(Math.min(...L)); return mc(`<p>Bút chì nào <b>ngắn nhất</b>?</p>${vLens(L, N)}`, N[i], N, `Bút chì ${N[i]} ngắn nhất.`); },
    () => mc(`<p>Bút chì A dài hơn hay ngắn hơn bút chì B?</p>${vLens(L.slice(0, 2), N)}`, L[0] > L[1] ? 'Dài hơn' : 'Ngắn hơn', ['Dài hơn', 'Ngắn hơn'], `So sánh hai đầu bút chì.`),
    () => { const s = pick([['🦒', '🐕', 'Hươu cao cổ', 'Con chó'], ['🌳', '🌷', 'Cây xanh', 'Bông hoa'], ['🏠', '🐈', 'Ngôi nhà', 'Con mèo']]); return mc(`<p>Vật nào <b>cao hơn</b>?</p><p class="big-e">${s[0]} ${s[1]}</p>`, s[0], [s[0], s[1]], `${s[2]} cao hơn ${s[3].toLowerCase()}.`); }
  ])(); } },

{ id: 'b26', so: 26, title: 'Đơn vị đo độ dài', game: 'fish',
  memo: 'Xăng-ti-mét viết tắt là cm. Đặt vạch 0 của thước trùng một đầu vật cần đo.',
  learn: [
    { t: 'Xăng-ti-mét', h: `${vRuler(6)}<p>Bút chì dài <b>6 cm</b>. Xăng-ti-mét là đơn vị đo độ dài, viết tắt là <b class="hl">cm</b>.</p>` },
    { t: 'Cách đo', h: `<div class="memo">1. Đặt vạch <b>0</b> của thước trùng với một đầu của vật.<br>2. Đầu kia của vật trùng với vạch nào thì vật dài bấy nhiêu xăng-ti-mét.</div>` }
  ],
  gen() { const L = R(2, 10); return pick([
    () => inp(`<p>Bút chì dài mấy xăng-ti-mét?</p>${vRuler(L)}`, L, `Ngòi bút ở vạch ${L}: dài ${L} cm.`),
    () => { const a = R(1, 9), b = R(0, 10 - a); return calcQ(a, b, '+', { unit: 'cm' }); },
    () => { const o = R(1, 9), a = R(1, 9) * 10 + o; return calcQ(a, R(1, o), '-', { unit: 'cm' }); }
  ])(); } },

{ id: 'b28', so: 28, title: 'Luyện tập chung', game: 'race', mix: ['b25', 'b26'] }
]},

{ id: 'c8', no: 8, name: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100', hue: 3, lessons: [
{ id: 'b29', so: 29, title: 'Phép cộng số có hai chữ số với số có một chữ số', game: 'balloon',
  memo: 'Đặt tính thẳng cột: đơn vị thẳng đơn vị. Cộng đơn vị trước, hạ chục xuống.',
  learn: [
    { t: 'Đặt tính 32 + 5', h: `<div class="pair2">${vCol(32, 5, '+', '37')}<div><p>• 2 cộng 5 bằng 7, viết 7.</p><p>• Hạ 3, viết 3.</p><p>Vậy <b>32 + 5 = 37</b>.</p></div></div>` },
    { t: 'Nhìn bằng que tính', h: `${vBlocks(0, 3, 2)}<p class="plus-sign">+</p>${vBlocks(0, 0, 5)}<p>3 chục và 7 que lẻ: <b>37</b>.</p>` }
  ],
  gen() { const t = R(1, 9), o = R(0, 8), b = R(1, 9 - o), a = t * 10 + o; return pick([
    () => calcQ(a, b, '+', { col: true }),
    () => calcQ(a, b, '+'),
    () => inp(`<p class="wp">Rổ có ${a} quả cam, mẹ bỏ thêm ${b} quả. Rổ có tất cả bao nhiêu quả cam?</p>`, a + b, `${a} + ${b} = ${a + b}`)
  ])(); } },

{ id: 'b30', so: 30, title: 'Phép cộng số có hai chữ số với số có hai chữ số', game: 'memory',
  memo: 'Cộng đơn vị với đơn vị, chục với chục.',
  learn: [
    { t: 'Đặt tính 41 + 35', h: `<div class="pair2">${vCol(41, 35, '+', '76')}<div><p>• 1 cộng 5 bằng 6, viết 6.</p><p>• 4 cộng 3 bằng 7, viết 7.</p><p>Vậy <b>41 + 35 = 76</b>.</p></div></div>` },
    { t: 'Cộng số tròn chục', h: `<p class="eq">20 + 30 = 50</p><p>2 chục cộng 3 chục bằng 5 chục.</p>` }
  ],
  gen() { const [a, b] = addNC2(); return pick([
    () => calcQ(a, b, '+', { col: true }),
    () => calcQ(a, b, '+'),
    () => { const x = R(1, 8) * 10, y = R(1, 9 - x / 10) * 10; return calcQ(x, y, '+'); }
  ])(); } },

{ id: 'b31', so: 31, title: 'Phép trừ số có hai chữ số cho số có một chữ số', game: 'fish',
  memo: 'Trừ đơn vị trước, hạ chục xuống.',
  learn: [
    { t: 'Đặt tính 48 − 3', h: `<div class="pair2">${vCol(48, 3, '−', '45')}<div><p>• 8 trừ 3 bằng 5, viết 5.</p><p>• Hạ 4, viết 4.</p><p>Vậy <b>48 − 3 = 45</b>.</p></div></div>` }
  ],
  gen() { const t = R(1, 9), o = R(1, 9), b = R(1, o), a = t * 10 + o; return pick([
    () => calcQ(a, b, '-', { col: true }),
    () => calcQ(a, b, '-'),
    () => inp(`<p class="wp">Trên cây có ${a} quả, bạn sóc hái ${b} quả. Trên cây còn lại bao nhiêu quả?</p>`, a - b, `${a} − ${b} = ${a - b}`)
  ])(); } },

{ id: 'b32', so: 32, title: 'Phép trừ số có hai chữ số cho số có hai chữ số', game: 'race',
  memo: 'Trừ đơn vị với đơn vị, chục với chục.',
  learn: [
    { t: 'Đặt tính 75 − 32', h: `<div class="pair2">${vCol(75, 32, '−', '43')}<div><p>• 5 trừ 2 bằng 3, viết 3.</p><p>• 7 trừ 3 bằng 4, viết 4.</p><p>Vậy <b>75 − 32 = 43</b>.</p></div></div>` },
    { t: 'Trừ số tròn chục', h: `<p class="eq">80 − 30 = 50</p><p>8 chục trừ 3 chục bằng 5 chục.</p>` }
  ],
  gen() { const [a, b] = subNB2(); return pick([
    () => calcQ(a, b, '-', { col: true }),
    () => calcQ(a, b, '-'),
    () => { const x = R(2, 9) * 10, y = R(1, x / 10 - 1) * 10; return calcQ(x, y, '-'); }
  ])(); } },

{ id: 'b33', so: 33, title: 'Luyện tập chung', game: 'balloon', mix: ['b29', 'b30', 'b31', 'b32'] }
]},

{ id: 'c9', no: 9, name: 'Thời gian. Giờ và lịch', hue: 4, lessons: [
{ id: 'b34', so: 34, title: 'Xem giờ đúng trên đồng hồ', game: 'balloon',
  memo: 'Giờ đúng: kim dài chỉ số 12, kim ngắn chỉ số giờ.',
  learn: [
    { t: 'Đồng hồ', h: `<div class="row-c">${vClock(9, 0, 160)}</div><p>Đồng hồ có <b>kim ngắn</b> (kim giờ) và <b>kim dài</b> (kim phút).</p><p>Kim dài chỉ số 12, kim ngắn chỉ số 9: đồng hồ chỉ <b>9 giờ</b>.</p>` },
    { t: 'Giờ trong ngày', h: `<div class="row-c">${vClock(6, 0, 120)}${vClock(11, 0, 120)}${vClock(8, 0, 120)}</div><p>6 giờ sáng em thức dậy, 11 giờ trưa em ăn cơm, 8 giờ tối em đi ngủ.</p>` }
  ],
  gen() { const h = R(1, 12); return pick([
    () => mc(`<p>Đồng hồ chỉ mấy giờ?</p><div class="row-c">${vClock(h, 0)}</div>`, `${h} giờ`, [`${h} giờ`, `${h % 12 + 1} giờ`, `${(h + 5) % 12 + 1} giờ`, `${h === 12 ? 6 : 12} giờ`], `Kim ngắn chỉ số ${h}, kim dài chỉ số 12: ${h} giờ.`),
    () => inp(`<p>Kim ngắn chỉ số mấy?</p><div class="row-c">${vClock(h, 0)}</div>`, h, `Kim ngắn chỉ số ${h}.`),
    () => { const k = R(1, 3), x = R(1, 12 - k); return inp(`<p>Bây giờ là ${x} giờ. Sau ${k} giờ nữa là mấy giờ?</p><div class="row-c">${vClock(x, 0, 130)}</div>`, x + k, `${x} + ${k} = ${x + k} giờ.`); },
    () => mc('<p>Lúc giờ đúng, kim dài chỉ vào số mấy?</p>', '12', ['12', '6', '3', '9'], 'Giờ đúng thì kim dài chỉ số 12.')
  ])(); } },

{ id: 'b35', so: 35, title: 'Các ngày trong tuần', game: 'race',
  memo: 'Một tuần có 7 ngày: thứ Hai, thứ Ba, thứ Tư, thứ Năm, thứ Sáu, thứ Bảy, Chủ nhật.',
  learn: [
    { t: 'Một tuần lễ', h: `${vWeek(-1)}<p>Một tuần có <b>7 ngày</b>. Em đi học từ thứ Hai đến thứ Sáu. Thứ Bảy và Chủ nhật em được nghỉ.</p>` },
    { t: 'Hôm qua, hôm nay, ngày mai', h: `${vWeek(2)}<p>Nếu hôm nay là <b>thứ Tư</b> thì hôm qua là thứ Ba, ngày mai là thứ Năm.</p>` }
  ],
  gen() { const i = R(0, 6); return pick([
    () => mc(`<p>Hôm nay là <b>${WEEK[i]}</b>. Ngày mai là thứ mấy?</p>${vWeek(i)}`, WEEK[(i + 1) % 7], [WEEK[(i + 1) % 7], WEEK[(i + 6) % 7], WEEK[(i + 2) % 7], WEEK[i]], `Sau ${WEEK[i]} là ${WEEK[(i + 1) % 7]}.`),
    () => mc(`<p>Hôm nay là <b>${WEEK[i]}</b>. Hôm qua là thứ mấy?</p>${vWeek(i)}`, WEEK[(i + 6) % 7], [WEEK[(i + 1) % 7], WEEK[(i + 6) % 7], WEEK[(i + 5) % 7], WEEK[i]], `Trước ${WEEK[i]} là ${WEEK[(i + 6) % 7]}.`),
    () => inp('<p>Một tuần có mấy ngày?</p>', 7, 'Một tuần có 7 ngày.'),
    () => { const d = R(1, 20); return inp(`<p>Hôm nay là thứ Hai ngày ${d}. Thứ Hai tuần sau là ngày bao nhiêu?</p>`, d + 7, `${d} + 7 = ${d + 7}`); }
  ])(); } },

{ id: 'b37', so: 37, title: 'Luyện tập chung', game: 'fish', mix: ['b34', 'b35'] }
]},

{ id: 'c10', no: 10, name: 'Ôn tập cuối năm', hue: 7, lessons: [
{ id: 'on2', so: '38–42', title: 'Ôn tập cuối năm', game: 'race', mixTopics: ['c6', 'c7', 'c8', 'c9', 'c3'] }
]}
]}
];

/* Gắn bài luyện tập chung / ôn tập */
BOOK.forEach(t => t.topics.forEach(tp => tp.lessons.forEach(l => { BYID_RAW[l.id] = l; l.topicRef = tp; })));
BOOK.forEach(t => t.topics.forEach(tp => tp.lessons.forEach(l => {
  let ids = null;
  if (l.mix) ids = l.mix;
  if (l.mixTopics) ids = BOOK.flatMap(b => b.topics).filter(x => l.mixTopics.includes(x.id)).flatMap(x => x.lessons).filter(x => !x.mix && !x.mixTopics).map(x => x.id);
  if (!ids) return;
  l.mixIds = ids;
  l.gen = () => BYID_RAW[pick(ids)].gen();
  l.memo = 'Ôn lại các bài đã học.';
  l.learn = [{ t: 'Nhớ lại kiến thức', h: `<p>Trong phần này con sẽ ôn lại:</p>${memoList(l.mixIds.slice(0, 10))}${l.mixIds.length > 10 ? `<p class="tip">… và ${l.mixIds.length - 10} bài khác.</p>` : ''}` }];
})));
