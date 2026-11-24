/* PreferenceScene project page. Data: static/data/play.json, method_ex.json (page_tools/build_play_data.py) and
   results.json (page_tools/build_results.py). URL parameters for screenshots and direct links: ?shot (no animation), ?ep=<id>&st=<0-3>&v=e&pool=random,
   ?step=<1-5> (method step), ?cmp=<slot> (side-by-side instance, e.g. sI2). */
(function app() {
  const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pct = (v) => Math.round(100 * v);
  const Q = new URLSearchParams(location.search), SHOT = Q.has("shot");
  const tip = $("#tip");
  const showTip = (e, h) => { tip.innerHTML = h; tip.style.opacity = 1; tip.style.left = e.clientX + 14 + "px"; tip.style.top = e.clientY + 14 + "px"; };
  const hideTip = () => { tip.style.opacity = 0; };
  const nav = $("#nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });
  const links = $$(".nav-links a");
  const secObs = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("section.s, header.hero").forEach((s) => secObs.observe(s));
  const rev = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); rev.unobserve(en.target); }
  }), { threshold: 0.08 });
  $$(".reveal").forEach((r) => (SHOT ? r.classList.add("in") : rev.observe(r)));
  if (SHOT) document.documentElement.style.scrollBehavior = "auto";

  /* ---------- teaser: the four users of the paper's first figure ---------- */
  const TEASER = [
    { ep: "living_room_g5_p1_s3_E", who: "Ceramic artist, 27", tag: "glazes pots, waters plants", room: "Living room", c: "#c0613a", img: "t_living",
      quote: "warm and natural, with clay-colored walls and light woven furniture … lots of plants" },
    { ep: "dining_room_g5_p1_s3_E", who: "Event planner, 34", tag: "treats dinner parties as a hobby", room: "Dining room", c: "#d6497f", img: "t_dining",
      quote: "glamorous and a little theatrical, with pale pink walls … a chessboard marble floor" },
    { ep: "kitchen_g7_p1_s2_E", who: "Restaurant consultant, 33", tag: "tests recipes at home", room: "Kitchen", c: "#b57a1e", img: "t_kitchen",
      quote: "pale natural oak cabinets … dark speckled granite counters … a freestanding island" },
    { ep: "bathroom_g3_p2_s2_E", who: "Tech consultant, 37", tag: "lives alone in a warehouse loft", room: "Bathroom", c: "#44546a", img: "t_bathroom",
      quote: "a thin wall-hung basin counter, open towel shelves … strong and uncluttered" },
  ];
  $("#teaser").innerHTML = TEASER.map((t) => '<div class="tp" style="--c:' + t.c + '" data-ep="' + t.ep + '" role="button" tabindex="0" aria-label="Follow the interaction of the ' + esc(t.who) + '">' +
    '<div class="who"><b>' + esc(t.who) + "</b><span>" + esc(t.tag) + "</span></div>" +
    '<div class="im"><img class="main" src="static/images/' + t.img + '.jpg" alt="Final scene: ' + esc(t.room.toLowerCase()) + '"><div class="ins"><img src="static/images/' + t.img + '_cut.jpg" alt="Cutaway of the whole room"></div><span class="go">follow this interaction →</span></div>' +
    '<div class="q"><span class="rt">' + esc(t.room) + "</span><i>“" + esc(t.quote) + "”</i></div></div>").join("");
  $$("#teaser .tp").forEach((p) => {
    p.onclick = () => openEpisode(p.dataset.ep, 3);
    p.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEpisode(p.dataset.ep, 3); } };
  });

  /* ---------- video ---------- */
  const vid = $("#vid"), poster = $("#poster");
  const startVideo = (t) => {
    poster.style.display = "none"; vid.hidden = false;
    if (t != null) { try { vid.currentTime = t; } catch (e) { /* not loaded yet */ } }
    const p = vid.play();
    if (p && p.catch) p.catch(() => { /* blocked autoplay: the controls stay visible */ });
  };
  poster.onclick = () => startVideo(0);
  poster.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); startVideo(0); } };
  const CH = [[0, "Final scenes of ten room types"], [24, "One interaction"], [58, "Hidden preferences and pAMR"], [90, "Method"], [136, "Results"]];
  $("#chapters").innerHTML = CH.map((c) => '<button data-t="' + c[0] + '"><b>' + Math.floor(c[0] / 60) + ":" + String(c[0] % 60).padStart(2, "0") + "</b>" + c[1] + "</button>").join("");
  $$("#chapters button").forEach((b) => (b.onclick = () => { startVideo(+b.dataset.t); $("#video").scrollIntoView({ behavior: "smooth" }); }));

  /* ---------- task section minis ---------- */
  const sq = (id, on, cls, never) => { $(id).innerHTML = Array.from({ length: 10 }, (_, i) => '<i class="' + (on.includes(i) ? cls : never && never.includes(i) ? "never" : "") + '"></i>').join(""); };
  sq("#sqE", [0, 2, 3, 6, 8], "on"); sq("#sqI", [], "on");
  const NEV = [3, 8, 9];
  sq("#sqT1", [0, 1, 2, 4, 6], "fb", NEV); sq("#sqT2", [0, 2, 5, 7], "fb", NEV); sq("#sqT3", [1, 4, 5, 7], "fb", NEV);

  /* ---------- SVG helpers ---------- */
  const SVGNS = "http://www.w3.org/2000/svg";
  const S = (tag, at, parent) => { const e = document.createElementNS(SVGNS, tag); for (const k in at) e.setAttribute(k, at[k]); if (parent) parent.appendChild(e); return e; };
  const T = (parent, x, y, txt, at) => { const t = S("text", Object.assign({ x, y, "font-size": 12, fill: "#55585f" }, at || {}), parent); t.textContent = txt; return t; };
  const COL = { "Holodeck": "#a9a7a1", "LayoutGPT": "#cfcbc3", "I-Design": "#b8946f", "LayoutVLM": "#7f8fa6", "R3L": "#a7a36f", "Holodeck-Edit": "#5f5e5a", "PreferenceScene": "#2d6cd2" };
  const isOurs = (s) => s === "PreferenceScene";
  // charts are drawn at the pixel width of their box (1 SVG unit = 1 CSS px), so text keeps its size on every screen
  const boxW = (box) => { const w = Math.floor(box.getBoundingClientRect().width); return w > 200 ? w : 560; };
  const REDRAW = [];
  let lastW = innerWidth, rt = 0;
  addEventListener("resize", () => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rt); rt = setTimeout(() => REDRAW.forEach((f) => f()), 150); });
  // splits a label into lines of at most n characters (word boundaries)
  const wrap = (s, n) => { const out = []; let cur = ""; String(s).split(" ").forEach((w) => { if (cur && (cur + " " + w).length > n) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; }); if (cur) out.push(cur); return out; };
  const TL = (parent, x, yMid, txt, maxCh, at, lh) => {
    const lines = wrap(txt, maxCh), h = lh || 14;
    const t = S("text", Object.assign({ x, y: yMid + 4 - (lines.length - 1) * h / 2, "font-size": 12, fill: "#55585f" }, at || {}), parent);
    lines.forEach((l, i) => { const sp = S("tspan", { x, dy: i ? h : 0 }, t); sp.textContent = l; });
    return t;
  };

  function hbarChart(box, rows, opt) {
    // rows: {name, v, sd, lo, hi, col, note}
    box.innerHTML = "";
    const W = boxW(box), rowH = opt.rowH || 34, top = 10, L = opt.L || 128, Rr = 70, H = top + rowH * rows.length + 26;
    const svg = S("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": opt.aria || "bar chart" }, box);
    const x = (v) => L + (W - L - Rr) * (v - opt.lo) / (opt.hi - opt.lo);
    for (let t = opt.lo; t <= opt.hi + 1e-9; t += opt.step) {
      S("line", { x1: x(t), x2: x(t), y1: top - 4, y2: H - 22, stroke: "#ece9e3" }, svg);
      T(svg, x(t), H - 6, String(t), { "text-anchor": "middle", "font-size": 11, fill: "#8c8e94" });
    }
    if (opt.ref != null) {
      S("line", { x1: x(opt.ref), x2: x(opt.ref), y1: top - 6, y2: H - 22, stroke: "#55585f", "stroke-dasharray": "4 4", "stroke-width": 1.2 }, svg);
    }
    rows.forEach((r, i) => {
      const y = top + rowH * i + rowH / 2, ours = isOurs(r.name);
      T(svg, 0, y + 4, r.label != null ? r.label : r.name, { "font-size": 13, fill: ours ? "#1d55ad" : "#15171c", "font-weight": ours ? 700 : 550 });
      const b = S("rect", { x: x(opt.lo), y: y - 9, height: 18, rx: 4, width: Math.max(0, x(r.v) - x(opt.lo)), fill: r.col || (ours ? "#2d6cd2" : "#b9b6af") }, svg);
      if (r.sd) S("line", { x1: x(r.v - r.sd), x2: x(r.v + r.sd), y1: y, y2: y, stroke: "#15171c", "stroke-width": 1.4 }, svg);
      if (r.lo != null) {
        S("line", { x1: x(r.lo), x2: x(r.hi), y1: y, y2: y, stroke: "#15171c", "stroke-width": 1.4 }, svg);
        [r.lo, r.hi].forEach((v) => S("line", { x1: x(v), x2: x(v), y1: y - 5, y2: y + 5, stroke: "#15171c", "stroke-width": 1.4 }, svg));
      }
      const ex = Math.max(x(r.v), r.hi != null ? x(r.hi) : 0, r.sd ? x(r.v + r.sd) : 0);
      T(svg, ex + 6, y + 4, r.text || r.v.toFixed(1), { "font-size": 12, "font-family": "JetBrains Mono", fill: ours ? "#1d55ad" : "#55585f", "font-weight": ours ? 700 : 400 });
      b.onmousemove = (e) => showTip(e, esc(r.name) + "<br>" + (r.tip || r.v.toFixed(1)));
      b.onmouseleave = hideTip;
    });
  }

  // grouped horizontal bars: groups [{label, strong, bars: [{name, v, sd, col, text, tip, ours}]}]
  function groupChart(box, groups, opt) {
    box.innerHTML = "";
    const W = boxW(box), bh = opt.bh || 17, gap = 4, gpad = 14, top = 6, Rr = 58;
    const L = Math.min(opt.L || 150, Math.round(W * 0.34)), maxCh = Math.max(8, Math.floor((L - 10) / 7));
    const gH = (g) => g.bars.length * (bh + gap) - gap;
    const H = top + groups.reduce((s, g) => s + gH(g) + gpad, 0) + 16;
    const svg = S("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": opt.aria || "bar chart" }, box);
    const x = (v) => L + (W - L - Rr) * (v - opt.lo) / (opt.hi - opt.lo);
    for (let t = opt.lo; t <= opt.hi + 1e-9; t += opt.step) {
      S("line", { x1: x(t), x2: x(t), y1: top - 2, y2: H - 20, stroke: "#ece9e3" }, svg);
      T(svg, x(t), H - 5, String(t), { "text-anchor": "middle", "font-size": 11, fill: "#8c8e94" });
    }
    let y = top;
    groups.forEach((g) => {
      const h = gH(g);
      TL(svg, 0, y + h / 2, g.label, maxCh, { "font-size": 12.5, fill: "#15171c", "font-weight": g.strong ? 700 : 550 });
      g.bars.forEach((b, j) => {
        const yy = y + j * (bh + gap), cy = yy + bh / 2;
        const rect = S("rect", { x: x(opt.lo), y: yy, height: bh, rx: 4, width: Math.max(0, x(b.v) - x(opt.lo)), fill: b.col }, svg);
        if (b.sd) S("line", { x1: x(b.v - b.sd), x2: x(b.v + b.sd), y1: cy, y2: cy, stroke: "#15171c", "stroke-width": 1.4 }, svg);
        const ex = Math.max(x(b.v), b.sd ? x(b.v + b.sd) : 0);
        T(svg, ex + 6, cy + 4, b.text || b.v.toFixed(1), { "font-size": 11.5, "font-family": "JetBrains Mono", fill: b.ours ? "#1d55ad" : "#55585f", "font-weight": b.ours ? 700 : 400 });
        rect.onmousemove = (e) => showTip(e, esc(g.label + " · " + b.name) + "<br>" + (b.tip || b.v.toFixed(1)));
        rect.onmouseleave = hideTip;
      });
      y += h + gpad;
    });
  }

  /* ---------- results ---------- */
  fetch("static/data/results.json").then((r) => r.json()).then((R) => {
    const SYS = R.systems;
    // oracle mini in the task section
    $("#mini-oracle").innerHTML = SYS.map((s) => '<div class="mini-row" style="grid-template-columns:96px 1fr 38px"><span' + (isOurs(s) ? ' style="color:var(--ps-ink);font-weight:700"' : "") + ">" + (isOurs(s) ? "Ours" : s) + '</span><div class="bar" style="width:' + (100 * R.main[s][4] / 65) + "%;background:" + (isOurs(s) ? "var(--ps)" : "var(--base)") + '"></div><span class="num">' + R.main[s][4].toFixed(1) + "</span></div>").join("") + '<div style="font-size:11.5px;color:var(--muted);margin-top:4px">pAMR (%) when the hidden values are given as text (oracle). Holodeck-Edit shows the scene of Holodeck.</div>';
    const mainChart = (k) => {
      const lab = { 0: "Implicit", 2: "Explicit", 4: "Oracle" }[k];
      hbarChart($("#main-chart"), SYS.map((s) => ({ name: s, label: s + (s === "LayoutGPT" ? " †" : "") + (k === 4 && s === "Holodeck-Edit" ? " *" : ""), v: R.main[s][k], sd: k === 4 ? null : R.main[s][k + 1],
        tip: lab + ": " + R.main[s][k].toFixed(1) + (k === 4 ? "" : " ± " + R.main[s][k + 1].toFixed(1) + " (4 seeds)") })), { lo: 0, hi: 70, step: 10, L: 128, aria: "pAMR per system, " + lab });
      $("#main-chart").insertAdjacentHTML("beforeend", '<p class="cap" style="margin-top:4px">† bedrooms and living rooms only (24 test instances per form).' + (k === 4 ? " * same scene as Holodeck." : "") + "</p>");
    };
    let mainK = 2, turnF = "Implicit", hsK = 0;
    mainChart(mainK);
    $$("#main-ctl button").forEach((b) => (b.onclick = () => { $$("#main-ctl button").forEach((x) => x.classList.toggle("on", x === b)); mainK = +b.dataset.k; mainChart(mainK); }));

    const turnChart = (f) => {
      const box = $("#turn-chart"); box.innerHTML = "";
      const W = boxW(box), narrow = W < 440, H = Math.round(Math.min(310, Math.max(230, W * 0.58))), L = narrow ? 50 : 62, Rr = narrow ? 84 : 128, top = 14, bot = 30;
      const svg = S("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "pAMR per turn, " + f }, box);
      const all = SYS.flatMap((s) => R.turns[f][s]);
      const lo = Math.floor(Math.min(...all) / 5) * 5 - 5, hi = Math.ceil(Math.max(...all) / 5) * 5;
      const x = (i) => L + (W - L - Rr) * i / 3, y = (v) => top + (H - top - bot) * (1 - (v - lo) / (hi - lo));
      for (let t = lo; t <= hi; t += 5) { S("line", { x1: L, x2: W - Rr, y1: y(t), y2: y(t), stroke: "#ece9e3" }, svg); T(svg, 0, y(t) + 4, String(t), { "font-size": 11, fill: "#8c8e94" }); }
      ["Turn 1", "Turn 2", "Turn 3", "Final"].forEach((l, i) => T(svg, x(i), H - 8, l, { "text-anchor": "middle", "font-size": 12, fill: "#55585f" }));
      const order = SYS.filter((s) => !isOurs(s)).concat(["PreferenceScene"]);
      order.forEach((s) => {
        const v = R.turns[f][s], ours = isOurs(s);
        S("polyline", { points: v.map((u, i) => x(i) + "," + y(u)).join(" "), fill: "none", stroke: COL[s], "stroke-width": ours ? 3.2 : 1.8, "stroke-dasharray": s === "LayoutGPT" ? "5 4" : "", "stroke-linejoin": "round" }, svg);
        v.forEach((u, i) => {
          const c = S("circle", { cx: x(i), cy: y(u), r: ours ? 5 : 3.5, fill: COL[s], stroke: "#fff", "stroke-width": 1.5 }, svg);
          c.onmousemove = (e) => showTip(e, esc(s) + " · " + ["turn 1", "turn 2", "turn 3", "final"][i] + "<br>pAMR " + u.toFixed(1));
          c.onmouseleave = hideTip;
        });
      });
      // end labels: ours and the highest baseline
      const ours = R.turns[f].PreferenceScene;
      const fs = narrow ? 10.5 : 12;
      T(svg, x(3) + 9, y(ours[3]) + 4, "Ours " + ours[3].toFixed(1), { "font-size": fs + 0.5, fill: "#1d55ad", "font-weight": 700, "font-family": "JetBrains Mono" });
      T(svg, x(0) - 8, y(ours[0]) + 4, ours[0].toFixed(1), { "font-size": fs, fill: "#1d55ad", "font-weight": 700, "font-family": "JetBrains Mono", "text-anchor": "end" });
      const bl = SYS.filter((s) => !isOurs(s)).sort((a, b) => R.turns[f][b][3] - R.turns[f][a][3])[0], bv = R.turns[f][bl][3];
      if (narrow) TL(svg, x(3) + 9, y(bv) + 6, "best baseline " + bv.toFixed(1), 13, { "font-size": fs, fill: "#55585f", "font-family": "JetBrains Mono" }, 13);
      else T(svg, x(3) + 9, y(bv) + 4, "best baseline " + bv.toFixed(1), { "font-size": fs - 0.5, fill: "#55585f", "font-family": "JetBrains Mono" });
      $("#turn-lg").innerHTML = SYS.map((s) => '<span><i style="background:' + COL[s] + (s === "LayoutGPT" ? ";opacity:.8" : "") + '"></i>' + (isOurs(s) ? "<b>PreferenceScene</b>" : s) + "</span>").join("");
    };
    turnChart(turnF);
    $$("#turn-ctl button").forEach((b) => (b.onclick = () => { $$("#turn-ctl button").forEach((x) => x.classList.toggle("on", x === b)); turnF = b.dataset.f; turnChart(turnF); }));

    const hsChart = (k) => {
      const names = ["Holodeck", "LayoutGPT", "I-Design", "LayoutVLM", "R3L", "Holodeck-Edit", "All"];
      hbarChart($("#hs-chart"), names.map((s) => {
        const h = R.human[s], ci = h[k + 1].split("–").map(Number);
        return { name: s, label: s === "All" ? "All 720 trials" : "vs " + s, v: h[k], lo: ci[0], hi: ci[1], col: s === "All" ? "#1d55ad" : "#7fa6e6", text: h[k].toFixed(1) + "%", tip: "chose PreferenceScene: " + h[k].toFixed(1) + "%<br>95% CI " + h[k + 1] };
      }), { lo: 40, hi: 100, step: 10, L: 128, ref: 50, aria: "user study win rates" });
    };
    hsChart(hsK);
    $$("#hs-ctl button").forEach((b) => (b.onclick = () => { $$("#hs-ctl button").forEach((x) => x.classList.toggle("on", x === b)); hsK = +b.dataset.k; hsChart(hsK); }));

    const qTable = (k) => {
      const vlm = k === "vlm";
      const H = vlm ? ["System", "Realism ↑", "Function ↑", "Instruction ↑", "Collisions % ↓", "s / scene ↓"] : ["System", "Realism ↑", "Function ↑", "Instruction ↑"];
      const data = SYS.map((s) => [s].concat(vlm ? R.quality[s] : R.ratings[s]));
      const dirs = vlm ? [1, 1, 1, -1, -1] : [1, 1, 1];
      const rank = dirs.map((d, j) => { const vals = [...new Set(data.map((r) => r[j + 1]))].sort((a, b) => d * (b - a)); return [vals[0], vals[1]]; });
      $("#q-sub").innerHTML = vlm ? "Final scenes of both forms. Realism, function and instruction following: 1–10 scores of R3L's evaluation prompt, answered by the evaluator (mean over four seeds). Collisions: % of objects in collision (SceneEval mesh test). Time: seconds per scene in a separate timing run. Bold: best; underline: second best." : "Mean ratings of the user-study participants on 40 scenes: five-point scale with R3L's rubric, mapped to 1–10. Bold: best; underline: second best.";
      let h = '<table class="res" style="min-width:0"><thead><tr>' + H.map((x) => "<th>" + x + "</th>").join("") + "</tr></thead><tbody>";
      data.forEach((r) => {
        h += '<tr class="' + (isOurs(r[0]) ? "ours" : "") + '"><td>' + (isOurs(r[0]) ? "PreferenceScene (ours)" : r[0] + (r[0] === "LayoutGPT" && vlm ? " †" : "")) + "</td>" +
          r.slice(1).map((v, j) => '<td class="' + (v === rank[j][0] ? "best" : v === rank[j][1] ? "second" : "") + '">' + (Number.isInteger(v) && j === 4 ? v : v.toFixed(1)) + "</td>").join("") + "</tr>";
      });
      $("#q-tbl").innerHTML = h + "</tbody></table>" + (vlm ? '<p class="cap">† bedrooms and living rooms only. An interaction of PreferenceScene makes six LLM calls and about 25 requests to Jev; none of its objects is out of bounds.</p>' : '<p class="cap">Kendall’s τ<sub>b</sub> between a scene’s mean rating and its evaluator score: 0.17, 0.33 and 0.36; between two random halves of the raters: 0.53, 0.42 and 0.48.</p>');
    };
    qTable("vlm");
    $$("#q-ctl button").forEach((b) => (b.onclick = () => { $$("#q-ctl button").forEach((x) => x.classList.toggle("on", x === b)); qTable(b.dataset.k); }));

    const ABL = [["Full method", 67.1, 1.3, 56.5, 2.9], ["No iteration (initial plan)", 64.0, 1.4, 40.6, 2.2], ["w/o older turns", 66.4, 2.9, 50.1, 2.9], ["w/o new values", 64.0, 2.8, 48.4, 2.4]];
    const ablBox = $("#abl-chart");
    ablBox.innerHTML = '<div class="lg2"><span><i style="background:#2d6cd2;height:10px"></i>Explicit</span><span><i style="background:#8fb3ee;height:10px"></i>Implicit</span></div><div id="abl-svg"></div>';
    const ablChart = () => groupChart($("#abl-svg"), ABL.map((a, i) => ({ label: a[0], strong: i === 0, bars: [
      { name: "Explicit", v: a[1], sd: a[2], col: "#2d6cd2", tip: "Explicit " + a[1].toFixed(1) + " ± " + a[2].toFixed(1) + " (4 seeds)" },
      { name: "Implicit", v: a[3], sd: a[4], col: "#8fb3ee", tip: "Implicit " + a[3].toFixed(1) + " ± " + a[4].toFixed(1) + " (4 seeds)" }] })),
      { lo: 30, hi: 70, step: 10, L: 168, aria: "ablation pAMR" });
    const unBox = $("#unnamed-chart");
    unBox.innerHTML = '<div class="lg2"><span><i style="background:#2d6cd2;height:10px"></i>PreferenceScene</span><span><i style="background:#b9b6af;height:10px"></i>best of the six baselines</span></div><div id="un-svg"></div>';
    const unChart = () => groupChart($("#un-svg"), [
      { label: "Explicit", bars: [{ name: "PreferenceScene", v: 54.0, col: "#2d6cd2", ours: true }, { name: "best baseline", v: 44.4, col: "#b9b6af" }] },
      { label: "Implicit", bars: [{ name: "PreferenceScene", v: 43.2, col: "#2d6cd2", ours: true }, { name: "best baseline", v: 37.6, col: "#b9b6af" }] }],
      { lo: 0, hi: 60, step: 10, L: 90, aria: "pAMR on never-named attributes" });
    ablChart(); unChart();
    REDRAW.push(() => mainChart(mainK), () => turnChart(turnF), () => hsChart(hsK), ablChart, unChart);
  });

  /* ---------- follow an interaction ---------- */
  let D = null, pool = "featured", room = "", form = "", list = [], idx = 0, stage = 3, view = "c", playing = null, front = "A";
  const STG = ["Turn 1", "Turn 2", "Turn 3", "Final scene"];
  const imgSrc = (h, v) => "static/play/img/" + h + "_" + v + ".jpg";
  const byId = {};
  const filtered = () => D.episodes.filter((e) => e.pools.includes(pool) && (!room || e.room === room) && (!form || e.form === form));
  function renderThumbs() {
    const box = $("#thumbs");
    if (!list.length) { box.innerHTML = '<div class="empty">No ' + (pool === "featured" ? "featured" : "randomly drawn") + " interaction for this room type and form. " + (pool === "featured" ? "Switch to “Random draw”, which has one per room type and form." : "") + "</div>"; return; }
    box.innerHTML = list.map((e, i) => '<button class="' + (i === idx ? "on" : "") + '" data-i="' + i + '" title="' + esc(e.room_name + " · " + e.form + " · seed " + e.seed + " · " + e.who) + '"><img loading="lazy" src="' + imgSrc(e.img[3], "t") + '" alt=""><span class="tl">' + esc(e.room_name.split(" ")[0].slice(0, 8)) + " · " + e.form[0] + "</span></button>").join("");
    $$("#thumbs button").forEach((b) => (b.onclick = () => { idx = +b.dataset.i; stopPlay(); renderEpisode(); }));
    const on = box.querySelector(".on");
    if (on) box.scrollTo({ left: on.offsetLeft - box.clientWidth / 2 + on.clientWidth / 2, behavior: SHOT ? "auto" : "smooth" });
  }
  function curveSvg(p, cur) {
    const W = 190, H = 58, x = (i) => 12 + i * (W - 24) / 3, y = (v) => 8 + (H - 22) * (1 - v);
    let s = '<svg viewBox="0 0 ' + W + " " + H + '" width="100%"><line x1="12" x2="' + (W - 12) + '" y1="' + y(0) + '" y2="' + y(0) + '" stroke="#ece9e3"/>' +
      '<polyline points="' + p.map((v, i) => x(i) + "," + y(v)).join(" ") + '" fill="none" stroke="#2d6cd2" stroke-width="2.2" stroke-linejoin="round"/>';
    p.forEach((v, i) => { s += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="' + (i === cur ? 5 : 3.2) + '" fill="' + (i === cur ? "#1d55ad" : "#fff") + '" stroke="#2d6cd2" stroke-width="2"/><text x="' + x(i) + '" y="' + (H - 2) + '" font-size="9.5" text-anchor="middle" fill="#8c8e94" font-family="JetBrains Mono">' + ["T1", "T2", "T3", "F"][i] + "</text>"; });
    return s + "</svg>";
  }
  function renderEpisode() {
    if (!list.length) { $("#ephead").innerHTML = ""; $("#stages").innerHTML = ""; $("#prefs").innerHTML = ""; $("#bubble").innerHTML = ""; return; }
    idx = (idx + list.length) % list.length;
    $$("#thumbs button").forEach((b, i) => b.classList.toggle("on", i === idx));
    const on = $("#thumbs .on");
    if (on) { const box = $("#thumbs"); box.scrollTo({ left: on.offsetLeft - box.clientWidth / 2 + on.clientWidth / 2, behavior: SHOT ? "auto" : "smooth" }); }
    const e = list[idx];
    e.img.forEach((h) => { ["c", "e"].forEach((v) => { const im = new Image(); im.src = imgSrc(h, v); }); });
    const src = e.pools.includes("featured") && e.src ? '<span class="tag f">featured · ' + esc(e.src) + "</span>" : "";
    const rnd = e.pools.includes("random") ? '<span class="tag r">random draw (seed 0)</span>' : "";
    $("#ephead").innerHTML = '<div><div class="tags"><span class="tag ' + e.form[0] + '">' + e.form + "</span><span class=\"tag\">" + esc(e.room_name) + '</span><span class="tag">instance ' + esc(e.iid) + " · seed " + e.seed + "</span>" + src + rnd + "</div>" +
      '<div class="who">' + esc(e.who) + '</div><p class="q">“' + esc(e.query) + "”</p></div>" +
      '<div class="ep-curve"><div class="k">pAMR per stage</div><div id="epcurve">' + curveSvg(e.pamr, stage) + "</div></div>" +
      "<details><summary>The simulated user's taste narrative (it conveys every hidden value; the system never sees it)</summary><p>" + esc(e.narrative) + "</p></details>";
    $("#stages").innerHTML = STG.map((l, i) => '<button class="stg" data-k="' + i + '"><div class="n">' + (i < 3 ? "scene " + (i + 1) : "after 3 turns") + '</div><div class="t">' + l + '</div><div class="v">' + pct(e.pamr[i]) + "<small>% pAMR</small></div>" +
      (i < 3 ? '<span class="sc" title="satisfaction score the user gave this scene">' + e.scores[i] + "/10</span>" : "") + '<div class="bar"><i style="width:' + pct(e.pamr[i]) + '%"></i></div></button>').join("") +
      '<button class="playbtn" id="playbtn" type="button"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>Play</button>';
    $$("#stages .stg").forEach((b) => (b.onclick = () => { stopPlay(); setStage(+b.dataset.k); }));
    $("#playbtn").onclick = () => (playing ? stopPlay() : startPlay());
    setStage(stage, true);
  }
  function setImg(src, instant) {
    const a = $("#imgA"), b = $("#imgB");
    const cur = front === "A" ? a : b, nxt = front === "A" ? b : a;
    if (cur.getAttribute("src") === src) return;
    if (instant || SHOT) { cur.src = src; cur.classList.remove("off"); nxt.classList.add("off"); return; }
    nxt.onload = () => { nxt.classList.remove("off"); cur.classList.add("off"); front = front === "A" ? "B" : "A"; };
    nxt.src = src;
  }
  function setStage(k, instant) {
    const e = list[idx];
    stage = k;
    $$("#stages .stg").forEach((b, i) => b.classList.toggle("on", i === k));
    $("#epcurve").innerHTML = curveSvg(e.pamr, k);
    setImg(imgSrc(e.img[k], view), instant);
    $("#imgA").alt = $("#imgB").alt = STG[k] + ", " + (view === "c" ? "cutaway" : "eye-level") + " view";
    $("#vlab").textContent = (k < 3 ? "Scene shown in turn " + (k + 1) : "Final scene") + " · " + (view === "c" ? "cutaway view" : "eye-level view");
    $("#vbadge").textContent = "pAMR " + pct(e.pamr[k]) + "%";
    $("#bubble").className = "bubble" + (k === 3 ? " final" : "");
    $("#bubble").innerHTML = k < 3
      ? '<div class="bh"><span>Feedback on the scene of turn ' + (k + 1) + "</span><span>satisfaction <b>" + e.scores[k] + "</b>/10</span></div><p>" + esc(e.feedback[k]) + "</p>"
      : '<div class="bh"><span>Final scene</span><span>no feedback</span></div><p>Built from the plan that the LLM wrote after the third feedback, then furnished by one more LLM call. The evaluator scores this scene; the paper reports its pAMR.</p>';
    const nHit = e.attrs.filter((a) => a.read[k] === 1).length, nHalf = e.attrs.filter((a) => a.read[k] === 0.5).length;
    const dot = (r, cur) => '<i class="dot ' + (r === 1 ? "r1" : r === 0.5 ? "r5" : "r0") + (cur ? " cur" : "") + '"></i>';
    let h = '<div class="ph"><div><h3>Hidden preferences of this user</h3><div style="font-size:12px;color:var(--ink2);margin-top:2px">' + (STG[k]) + ": " + nHit + " found in both option orders, " + nHalf + ' in one</div></div><div class="big2">' + pct(e.pamr[k]) + "<small>% pAMR</small></div></div>" +
      '<div class="lg"><span>' + dot(1) + " found</span><span>" + dot(0.5) + " found in one of two option orders</span><span>" + dot(0) + " not found</span></div>" +
      '<div class="arow h"><span class="an">attribute</span><span>hidden value · plan value</span><span class="ds"><b>T1</b><b>T2</b><b>T3</b><b>F</b></span></div>';
    e.attrs.forEach((a) => {
      const pv = a.plan[k], ch = k > 0 && a.plan[k] !== a.plan[k - 1];
      h += '<div class="arow' + (a.read[k] === 1 ? " hit" : "") + '"><span class="an">' + esc(a.name) + '</span><span><span class="hv">' + esc(a.hidden) + "</span>" + (a.stated ? '<span class="st" title="stated in the persona or instruction">stated</span>' : "") +
        '<span class="pv' + (ch ? " ch" : "") + '" title="' + esc(a.look[k]) + '">' + esc(pv) + (ch ? '<span class="chg">changed</span>' : "") + "</span></span>" +
        '<span class="ds">' + a.read.map((r, i) => dot(r, i === k)).join("") + "</span></div>";
    });
    $("#prefs").innerHTML = h;
  }
  function stopPlay() { if (playing) { clearInterval(playing); playing = null; } const b = $("#playbtn"); if (b) { b.classList.remove("on"); b.lastChild.textContent = "Play"; } }
  function startPlay() {
    const b = $("#playbtn"); b.classList.add("on"); b.lastChild.textContent = "Pause";
    if (stage === 3) setStage(0);
    playing = setInterval(() => { if (stage >= 3) { stopPlay(); return; } setStage(stage + 1); }, 2600);
  }
  function refilter(keepId) {
    list = filtered();
    idx = Math.max(0, keepId ? list.findIndex((e) => e.id === keepId) : 0);
    renderThumbs(); renderEpisode();
  }
  function openEpisode(id, st) {
    const e = byId[id];
    if (!e) return;
    pool = e.pools.includes("featured") ? "featured" : "random"; room = ""; form = "";
    $$("#pool button").forEach((x) => x.classList.toggle("on", x.dataset.p === pool));
    $$("#form button").forEach((x) => x.classList.toggle("on", x.dataset.f === ""));
    $("#room").value = "";
    stage = st == null ? 0 : st; stopPlay();
    refilter(id);
    $("#try").scrollIntoView({ behavior: SHOT ? "auto" : "smooth" });
  }
  self.openEpisode = openEpisode;
  fetch("static/data/play.json").then((r) => r.json()).then((d) => {
    D = d;
    D.episodes.forEach((e) => (byId[e.id] = e));
    const rooms = [...new Set(D.episodes.map((e) => e.room))].sort();
    $("#room").innerHTML = '<option value="">All room types</option>' + rooms.map((r) => '<option value="' + r + '">' + esc(D.episodes.find((e) => e.room === r).room_name) + "</option>").join("");
    const c = D.check;
    $("#flnote").innerHTML = "<b>Featured</b> (" + D.n_featured + "): the interactions shown in the paper's figures, namely the four users of the first figure, the example of the method figures, and the per-turn figure (3) and room-type gallery (10) of the supplementary material. " +
      "<b>Random draw</b> (" + D.n_random + "): one interaction per room type and form, drawn uniformly with Python's <span class=\"mono\">random.Random(0)</span> from the 48 test interactions of that room type and form (12 instances × 4 seeds); interactions whose match stays low or falls are kept. " +
      "Images are the renders that the evaluator read (1024 × 768, shown at 720 px). As in the paper's per-turn figures, the scenes of turns 1–3 are shown and scored after the furnishing step; the simulated user saw them without it. " +
      "Dots: share of the two option orders in which the evaluator picks the hidden value; pAMR is their mean. Over all 960 test interactions of the method, the stored outputs give a mean final pAMR of " + c["Explicit/final"].mean.toFixed(1) + "% (Explicit) and " + c["Implicit/final"].mean.toFixed(1) + "% (Implicit), the values of the paper.";
    if (Q.get("pool")) pool = Q.get("pool");
    $$("#pool button").forEach((x) => x.classList.toggle("on", x.dataset.p === pool));
    if (Q.get("st")) stage = +Q.get("st");
    if (Q.get("v")) { view = Q.get("v"); $$("#view button").forEach((x) => x.classList.toggle("on", x.dataset.v === view)); }
    refilter(Q.get("ep"));
    buildGallery();
    buildMethod();
  });
  $$("#pool button").forEach((b) => (b.onclick = () => { $$("#pool button").forEach((x) => x.classList.toggle("on", x === b)); pool = b.dataset.p; stopPlay(); refilter(); }));
  $$("#form button").forEach((b) => (b.onclick = () => { $$("#form button").forEach((x) => x.classList.toggle("on", x === b)); form = b.dataset.f; stopPlay(); refilter(); }));
  $("#room").onchange = (ev) => { room = ev.target.value; stopPlay(); refilter(); };
  $$("#view button").forEach((b) => (b.onclick = () => { $$("#view button").forEach((x) => x.classList.toggle("on", x === b)); view = b.dataset.v; setStage(stage); }));
  $("#prev").onclick = () => { idx--; stopPlay(); renderEpisode(); };
  $("#next").onclick = () => { idx++; stopPlay(); renderEpisode(); };
  $("#shuffle").onclick = () => { const n = list.length; let k = idx; while (n > 1 && k === idx) k = Math.floor(Math.random() * n); idx = k; stopPlay(); renderEpisode(); };
  $("#vimg").onclick = () => { const im = front === "A" ? $("#imgA") : $("#imgB"); $("#lbimg").src = im.src; $("#lb").showModal(); };
  $("#lb").onclick = () => $("#lb").close();

  /* ---------- gallery ---------- */
  function buildGallery() {
    const G = D.episodes.filter((e) => e.src && e.src.indexOf("gallery") >= 0).sort((a, b) => a.room.localeCompare(b.room));
    $("#gal").innerHTML = G.map((e) => '<div class="gt" data-ep="' + e.id + '" role="button" tabindex="0" aria-label="' + esc(e.room_name) + ', follow the interaction"><img loading="lazy" src="static/images/g_' + e.room + '_eye.jpg" alt="' + esc(e.room_name) + ', eye-level view of the final scene"><img class="cut" loading="lazy" src="static/images/g_' + e.room + '_cutaway.jpg" alt="' + esc(e.room_name) + ', cutaway view">' +
      '<span class="pm">' + pct(e.pamr[3]) + "%</span>" + '<div class="gl"><b>' + esc(e.room_name) + " · " + e.form + "</b><span>" + esc(e.who) + "</span></div></div>").join("");
    $$("#gal .gt").forEach((g) => {
      g.onclick = (ev) => { if (matchMedia("(hover: none)").matches && !g.classList.contains("flip")) { $$("#gal .gt").forEach((x) => x.classList.remove("flip")); g.classList.add("flip"); return; } openEpisode(g.dataset.ep, 3); };
      g.onkeydown = (ev) => { if (ev.key === "Enter") openEpisode(g.dataset.ep, 3); };
    });
  }

  /* ---------- method stepper (the interaction of the method figure) ---------- */
  function buildMethod() {
    fetch("static/data/method_ex.json").then((r) => r.json()).then((L) => {
      const ex = byId["dining_room_g5_p1_s1_I"];
      const firstObj = (txt, n) => { const o = JSON.parse(txt); const k = Object.keys(o).slice(0, n); const r = {}; k.forEach((x) => (r[x] = o[x])); return JSON.stringify(r, null, 1); };
      const diff = ex.attrs.filter((a) => a.plan[0] !== a.plan[1]).length;
      const STEPS = [
        { t: "Preference space and initial plan", d: "Before turn 1, an LLM lists the visible design aspects of the room with twelve candidate values each; Jev assigns the aspects to the ten attributes. A second LLM call chooses the initial plan, one value per attribute.",
          pane: () => '<p class="lead">The input of this interaction: a dining-room instruction (“' + esc(ex.query.slice(0, 92)) + '…”), the persona of a ' + esc((ex.who.charAt(0).toLowerCase() + ex.who.slice(1)).replace(/, (\d+)$/, ", aged $1")) + " and the list of ten attributes without their values. The initial plan:</p>" +
            '<table class="ptab"><thead><tr><th>attribute</th><th>value in the plan of turn 1</th></tr></thead><tbody>' + ex.attrs.map((a) => "<tr><td>" + esc(a.name) + "</td><td>" + esc(a.plan[0]) + ' <span style="color:var(--muted);font-size:12px">· ' + esc(a.look[0]) + "</span></td></tr>").join("") + "</tbody></table>" },
        { t: "Scene instantiation", d: "Jev answers fixed multiple-choice questions that turn each value into a specification: objects, placement, finish, color and light. The scene is built from the specifications, with retrieved assets and materials and procedurally rebuilt furniture.",
          pane: () => '<p class="lead">Specifications of two values of the turn-1 plan above (supplementary listing of the paper; retrieval queries, asset identifiers, empty fields and probabilities omitted). Objects come from 6,793 Objaverse assets, floor and wall materials from ambientCG, and a search places the furniture by the placement answers.</p><pre class="lst">' + esc(firstObj(L.spec, 2)) + '</pre><p class="lead" style="margin-top:12px">From what was built, templates write the scene description of each attribute that the next plan update reads, for example:</p><pre class="lst" style="max-height:120px">' + esc(L.descr.split("\n\n").slice(0, 2).join("\n\n")) + "</pre>" },
        { t: "User feedback", d: "The user sees only rendered images of the scene and replies with three to five sentences and a satisfaction score from 1 to 10. The user never sees the plan.",
          pane: () => '<div class="two"><img src="' + imgSrc(ex.img[0], "c") + '" alt="Scene of turn 1, cutaway"><img src="' + imgSrc(ex.img[0], "e") + '" alt="Scene of turn 1, eye level"></div><p class="cap" style="margin:6px 0 12px">Scene of turn 1 (shown after the furnishing step, as in the paper\'s per-turn figures).</p><div class="quote"><b>Feedback on turn 1 · satisfaction ' + ex.scores[0] + "/10</b>" + esc(ex.feedback[0]) + "</div>" },
        { t: "Plan update", d: "One LLM call reads the whole history and writes a complete new plan. For every attribute it keeps the value, switches to another candidate or writes a new value, including attributes that the feedback does not name.",
          pane: () => '<p class="lead">After turn 1, ' + diff + " of the ten values change. The window treatment, which the feedback does not name, moves to another candidate that fits the inferred taste.</p>" +
            '<table class="ptab"><thead><tr><th>attribute</th><th>turn 1 → turn 2</th></tr></thead><tbody>' + ex.attrs.map((a) => { const c = a.plan[0] !== a.plan[1]; return '<tr class="' + (c ? "ch" : "") + '"><td>' + esc(a.name) + "</td><td>" + (c ? '<span class="old">' + esc(a.plan[0]) + '</span> → <span class="new">' + esc(a.plan[1]) + "</span>" + (a.k === "window_treatment" ? '<span class="why u">not named in the feedback</span>' : "") : esc(a.plan[0])) + "</td></tr>"; }).join("") + "</tbody></table>" +
            '<p class="cap">pAMR of this interaction per stage: ' + ex.pamr.map(pct).join(", ") + " (turns 1–3, final).</p>" },
        { t: "Final furnishing", d: "After turn 3, one more LLM call adds furniture, objects on furniture tops and pieces for the walls without moving any object of the plan. Pieces of the types that a value rules out are dropped.",
          pane: () => '<div class="two"><img src="' + imgSrc(ex.img[3], "c") + '" alt="Final scene, cutaway"><img src="' + imgSrc(ex.img[3], "e") + '" alt="Final scene, eye level"></div><p class="cap" style="margin:6px 0 10px">Final scene of the same interaction (pAMR ' + pct(ex.pamr[3]) + '%). Below: excerpt of the furnishing reply for the same user in the Explicit form (seed 3; supplementary listing): the values of three attributes, the object types they rule out and the proposed pieces that were dropped.</p><pre class="lst" style="max-height:170px">' + esc(L.avoid) + "</pre>" },
      ];
      let cur = 0, auto = !SHOT, t0 = 0, raf = 0, inView = false;
      const DUR = 10000;
      $("#steps").innerHTML = STEPS.map((s, i) => '<button class="step" data-i="' + i + '"><div class="n">STEP ' + (i + 1) + " / " + STEPS.length + '</div><div class="t">' + s.t + '</div><div class="d">' + s.d + '</div><div class="prog"><i></i></div></button>').join("");
      const show = (i) => { cur = (i + STEPS.length) % STEPS.length; $$(".step").forEach((b, k) => b.classList.toggle("on", k === cur)); $("#stage").innerHTML = '<div class="pane on">' + STEPS[cur].pane() + "</div>"; t0 = performance.now(); };
      $$(".step").forEach((b) => (b.onclick = () => { auto = false; show(+b.dataset.i); $$(".step .prog i").forEach((p) => (p.style.width = 0)); }));
      const tick = (now) => { raf = 0; if (!(auto && inView)) return; const f = Math.min(1, (now - t0) / DUR); const p = $$(".step .prog i")[cur]; if (p) p.style.width = 100 * f + "%"; if (f >= 1) show(cur + 1); raf = requestAnimationFrame(tick); };
      const kick = () => { if (!raf && auto && inView) raf = requestAnimationFrame(tick); };
      new IntersectionObserver((es) => { inView = es[0].isIntersecting; if (inView) { t0 = performance.now(); kick(); } }, { threshold: 0.35 }).observe($("#stage"));
      if (Q.has("step")) { auto = false; show((+Q.get("step") || 1) - 1); } else show(0);
    });
  }

  /* ---------- side by side: cells of the paper's qualitative figures (page_tools/build_compare.py) ---------- */
  fetch("static/data/compare.json").then((r) => r.json()).then((C) => {
    let ci = Math.max(0, C.rows.findIndex((r) => r.slot === Q.get("cmp")));
    const tabs = $("#cmp-tabs");
    tabs.innerHTML = C.rows.map((r, i) => '<button role="tab" data-i="' + i + '">' + esc(r.room_name) + "<small>" + r.form + "</small></button>").join("");
    const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
    const show = (i) => {
      ci = i;
      const r = C.rows[i];
      $$("#cmp-tabs button").forEach((b, k) => { b.classList.toggle("on", k === i); b.setAttribute("aria-selected", k === i); });
      $("#cmp-head").innerHTML = '<div class="tags"><span class="tag ' + r.form[0] + '">' + r.form + '</span><span class="tag">' + esc(r.room_name) + '</span><span class="tag">instance ' + esc(r.iid) + " · seed " + r.seed + '</span><span class="tag f">' + (r.fig === "main" ? "qualitative figure of the paper" : "qualitative figure of the supplementary material") + "</span></div>" +
        '<div class="who">User: ' + esc(lc(r.who)) + '</div><p class="q">“… ' + r.excerpt.map(esc).join(" … ") + ' …”</p>' +
        (r.hidden.length ? '<p class="hid">Three hidden values that the instruction does not state: ' + r.hidden.map((h) => "<b>" + esc(h.attr) + "</b> " + esc(h.value)).join(" · ") + "</p>" : '<p class="hid">Explicit form: the instruction states four to six of the ten hidden values.</p>');
      $("#cmp-grid").innerHTML = C.cols.map((c) => '<figure class="' + (c.k === "ours" ? "us" : c.k === "gold" ? "gold" : "") + '"><img src="' + r.img[c.k] + '" alt="' + esc(c.name + ", " + r.room_name.toLowerCase() + ", cutaway view of the final scene") + '"><figcaption><span>' + esc(c.name) + (c.k === "ours" ? " (ours)" : "") + "</span><small>" + (c.k === "gold" ? "built from the hidden values" : "final scene after 3 turns") + "</small></figcaption></figure>").join("");
      $$("#cmp-grid img").forEach((im) => (im.onclick = () => { $("#lbimg").src = im.src; $("#lb").showModal(); }));
    };
    $$("#cmp-tabs button").forEach((b) => (b.onclick = () => show(+b.dataset.i)));
    show(ci);
  });

  /* ---------- BibTeX ---------- */
  $("#copy").onclick = () => navigator.clipboard.writeText($("#bibtex").innerText).then(() => { $("#copy").textContent = "Copied"; setTimeout(() => ($("#copy").textContent = "Copy"), 1500); });
})();
