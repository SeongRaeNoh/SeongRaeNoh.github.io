/* Core project page. Data: static/data/play.json and results.json (page_tools/build_page_data.py). */
(function app() {
    const $ = (s) => (document.querySelector(s)), $$ = (s) => ([...document.querySelectorAll(s)]);
    const el = (tag, cls, html) => {
      const e = document.createElement(tag);
      if (cls)
        e.className = cls;
      if (html != null)
        e.innerHTML = html;
      return e;
    };
    const f2 = (v) => ((v < 0 ? "−" : "") + Math.abs(v).toFixed(2));
    const sgn = (v) => ((v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2));
    const LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const OC = ["--oA", "--oB", "--oC", "--oD", "--oE", "--oF", "--oG", "--oH"];
    const ocol = (i) => ("var(" + OC[i % OC.length] + ")");
    const tip = $("#tip");
    const thumbCenter = (b) => { const T = b.parentElement; T.scrollTo({ left: b.offsetLeft - T.clientWidth / 2 + b.clientWidth / 2, behavior: "smooth" }); };
    const showTip = (e, html) => {
      tip.innerHTML = html;
      tip.style.opacity = 1;
      tip.style.left = e.clientX + 14 + "px";
      tip.style.top = e.clientY + 14 + "px";
    };
    const hideTip = () => {
      tip.style.opacity = 0;
    };
    const nav = $("#nav");
    addEventListener("scroll", () => (nav.classList.toggle("scrolled", scrollY > 10)), { passive: true });
    const links = $$(".nav-links a");
    const secObs = new IntersectionObserver((es) => (es.forEach((en) => {
      if (en.isIntersecting)
        links.forEach((a) => (a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id)));
    })), { rootMargin: "-45% 0px -50% 0px" });
    $$("section.s").forEach((s) => (secObs.observe(s)));
    const rev = new IntersectionObserver((es) => (es.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        rev.unobserve(en.target);
      }
    })), { threshold: 0.12 });
    $$(".reveal").forEach((r) => (rev.observe(r)));
    const T = {
      q1: [["upper left", 0.985, 0.973], ["bottom right", 0.001, 0.005], ["center", 0.014, 0.023]],
      q2: [["upper left or bottom right", 0.311, 0.932, 0.986, 0.978], ["center", 0.689, 0.068]]
    };
    const tg = $("#tgrid");
    const tcell = (p, kind, target) => {
      let h = '<div class="tval"><div class="tbar"><div class="f ' + kind + '" data-w="' + p + '"></div>';
      if (target != null)
        h += '<div class="tg ' + (target - p > 0.1 ? "bad" : "") + '" style="width:' + 100 * target + '%"></div>';
      h += '</div><span class="num">' + p.toFixed(2) + "</span></div>";
      if (target != null) {
        const d = p - target;
        h += '<div class="delta ' + (d < -0.1 ? "bad" : "ok") + '">' + sgn(d) + (d < -0.1 ? " ✗" : " ✓") + "</div>";
      }
      return "<div>" + h + "</div>";
    };
    let th = '<div></div><div class="h">Base</div><div class="h c">Core</div>';
    th += '<div class="sec"><span>Question 1: original</span><span class="mono">3 options</span></div>';
    T.q1.forEach((r) => {
      th += '<div class="opt">' + r[0] + "</div>" + tcell(r[1], "b") + tcell(r[2], "c");
    });
    th += '<div class="sec"><span>Question 2: two options merged</span><span class="mono">2 options</span></div>';
    T.q2.forEach((r) => {
      th += '<div class="opt">' + r[0] + "</div>" + tcell(r[1], "b", r[3]) + tcell(r[2], "c", r[4]);
    });
    tg.innerHTML = th;
    const shares = [["Base", 31, "var(--base)"], ["SFT", 32, "var(--orange)"], ["LLM-as-Jev", 29, "var(--orange)"], ["LLM-as-Jev<sup>†</sup>", 15, "var(--orange-l)"], ['<span class="core-name">Core</span>', 7, "var(--core)"]];
    $("#shares").innerHTML = shares.map((s) => ('<div class="share-row"><span>' + s[0] + '</span><div class="tbar"><div class="f" data-w="' + s[1] / 35 + '" style="background:' + s[2] + '"></div></div><span class="num">' + s[1] + "%</span></div>")).join("");
    const playTeaser = () => {
      const card = $("#teaser");
      card.classList.remove("show");
      $$("#teaser .f").forEach((f) => {
        f.style.transition = "none";
        f.style.width = 0;
      });
      void card.offsetWidth;
      $$("#teaser .f").forEach((f, i) => {
        f.style.transition = "";
        setTimeout(() => {
          f.style.width = 100 * f.dataset.w + "%";
        }, 120 + i * 70);
      });
      setTimeout(() => (card.classList.add("show")), 900);
    };
    const Q = new URLSearchParams(location.search), SHOT = Q.has("shot");
    if (SHOT) {
      document.documentElement.style.scrollBehavior = "auto";
      $$(".reveal").forEach((r) => r.classList.add("in"));
      $$("#teaser .f").forEach((f) => { f.style.transition = "none"; f.style.width = 100 * f.dataset.w + "%"; });
      $("#teaser").classList.add("show");
    }
    const tObs = SHOT ? { observe() {}, disconnect() {} } : new IntersectionObserver((es) => {
      if (es[0].isIntersecting) {
        playTeaser();
        tObs.disconnect();
      }
    }, { threshold: 0.3 });
    tObs.observe($("#teaser"));
    $("#replay").onclick = playTeaser;
    const vid = $("#vid"), poster = $("#poster");
    const startVideo = (t) => {
      poster.style.display = "none";
      vid.hidden = false;
      if (t != null) {
        try {
          vid.currentTime = t;
        } catch (e) {}
      }
      vid.play();
    };
    poster.onclick = () => (startVideo(0));
    poster.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        startVideo(0);
      }
    };
    const CH = [[0, "Title"], [4, "The problem"], [58, "Regroupings and partition violation"], [97, "Method"], [150, "Results"], [199, "Scope"]];
    $("#chapters").innerHTML = CH.map((c) => ('<button data-t="' + c[0] + '"><b>' + Math.floor(c[0] / 60) + ":" + String(c[0] % 60).padStart(2, "0") + "</b>" + c[1] + "</button>")).join("");
    $$("#chapters button").forEach((b) => (b.onclick = () => {
      startVideo(+b.dataset.t);
      $("#video").scrollIntoView({ behavior: "smooth" });
    }));
    fetch("static/data/results.json").then((r) => (r.json())).then((R) => {
      const ms = $("#mini-sizes");
      ms.innerHTML = R.sizes.map((s) => ('<div class="mini-row"><span>' + s.size + '</span><div style="display:grid;gap:2px"><div class="bar" style="width:' + 100 * Math.abs(s.gap_base[0]) / 12 + '%;background:var(--base)"></div><div class="bar" style="height:6px;width:' + Math.max(1.5, 100 * Math.abs(s.gap_core[0]) / 12) + '%;background:var(--core)"></div></div><span class="num">' + s.gap_base[0].toFixed(1).replace("-", "−") + "</span></div>")).join("") + '<div style="font-size:11.5px;color:var(--muted);margin-top:4px">gray: base · blue: <span class="sc">Core</span> · points</div>';
      $("#mini-mono").innerHTML = [["Base", 31, "var(--base)"], ["SFT", 32, "var(--orange)"], ["Core", 7, "var(--core)"]].map((s) => ('<div class="mini-row"><span>' + (s[0] === "Core" ? '<span class="sc" style="color:var(--core-ink)">Core</span>' : s[0]) + '</span><div class="bar" style="width:' + 100 * s[1] / 35 + "%;background:" + s[2] + '"></div><span class="num">' + s[1] + "%</span></div>")).join("");
      sizesChart(R, "partition_tv/merge");
      regChart(R, "partition_tv/merge");
      table(R, "lite");
      wordChart();
      xdataChart();
      $$("#size-ctl button").forEach((b) => (b.onclick = () => {
        $$("#size-ctl button").forEach((x) => (x.classList.toggle("on", x === b)));
        sizesChart(R, b.dataset.m);
      }));
      $$("#reg-ctl button").forEach((b) => (b.onclick = () => {
        $$("#reg-ctl button").forEach((x) => (x.classList.toggle("on", x === b)));
        regChart(R, b.dataset.m);
      }));
      $$("#tbl-ctl button").forEach((b) => (b.onclick = () => {
        $$("#tbl-ctl button").forEach((x) => (x.classList.toggle("on", x === b)));
        table(R, b.dataset.t);
      }));
    });
    const SVGNS = "http://www.w3.org/2000/svg";
    const S = (tag, at, parent) => {
      const e = document.createElementNS(SVGNS, tag);
      for (const k in at)
        {e.setAttribute(k, at[k]);}
      if (parent)
        parent.appendChild(e);
      return e;
    };
    const nice = (lo, hi, n) => {
      const step0 = (hi - lo) / n, p = Math.pow(10, Math.floor(Math.log10(step0)));
      const m = step0 / p;
      const st = (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
      const a = Math.floor(lo / st) * st, b = Math.ceil(hi / st) * st;
      const t = [];
      for (let v = a;v <= b + 0.000000001; v += st)
        {t.push(+v.toFixed(6));}
      return t;
    };
    function axisFrame(svg, W, H, L, Rr, top, ticks, x, label) {
      ticks.forEach((t) => {
        S("line", { x1: x(t), x2: x(t), y1: top - 6, y2: H - 22, stroke: "#ece9e3" }, svg);
        const tx = S("text", { x: x(t), y: H - 6, "text-anchor": "middle", "font-size": 11.5, fill: "#8c8e94" }, svg);
        tx.textContent = t;
      });
      if (label) {
        const l = S("text", { x: W - Rr, y: top - 12, "text-anchor": "end", "font-size": 11.5, fill: "#8c8e94" }, svg);
        l.textContent = label;
      }
    }
    function sizesChart(R, m) {
      const box = $("#size-chart");
      box.innerHTML = "";
      const W = 620, rowH = 46, top = 26, L = 70, Rr = 54, H = top + rowH * R.sizes.length + 24;
      const svg = S("svg", { viewBox: "0 0 " + W + " " + H }, box);
      const vals = R.sizes.flatMap((s) => ([s["base_" + m][0], s["core_" + m][0] - s["core_" + m][1], s["core_" + m][0] + s["core_" + m][1]]));
      const ticks = nice(Math.min(...vals) - 1, Math.max(...vals) + 1, 5);
      const lo = ticks[0], hi = ticks[ticks.length - 1], x = (v) => (L + (W - L - Rr) * (v - lo) / (hi - lo));
      axisFrame(svg, W, H, L, Rr, top, ticks, x, m.startsWith("acc") ? "accuracy (×100) →" : "← lower is better (×100)");
      R.sizes.forEach((s, i) => {
        const y = top + rowH * i + rowH / 2, b = s["base_" + m][0], c = s["core_" + m];
        const lab = S("text", { x: 0, y: y + 4, "font-size": 13, fill: "#15171c", "font-weight": 600 }, svg);
        lab.textContent = s.size;
        const sub = S("text", { x: 0, y: y + 18, "font-size": 10.5, fill: "#8c8e94" }, svg);
        sub.textContent = s.model;
        S("line", { x1: x(b), x2: x(c[0]), y1: y, y2: y, stroke: "#dcd8cf", "stroke-width": 5, "stroke-linecap": "round" }, svg);
        S("line", { x1: x(c[0] - c[1]), x2: x(c[0] + c[1]), y1: y, y2: y, stroke: "#2a78d6", "stroke-width": 2 }, svg);
        const gb = S("circle", { cx: x(b), cy: y, r: 7, fill: "#9a9893", stroke: "#fff", "stroke-width": 2 }, svg);
        const gc = S("circle", { cx: x(c[0]), cy: y, r: 8, fill: "#2a78d6", stroke: "#fff", "stroke-width": 2 }, svg);
        const tb = S("text", { x: x(b), y: y - 12, "text-anchor": "middle", "font-size": 11.5, fill: "#55585f", "font-family": "JetBrains Mono" }, svg);
        tb.textContent = b.toFixed(1);
        const tc = S("text", { x: x(c[0]), y: y - 12, "text-anchor": "middle", "font-size": 11.5, fill: "#1b5fb3", "font-weight": 600, "font-family": "JetBrains Mono" }, svg);
        tc.textContent = c[0].toFixed(1);
        [gb, gc].forEach((g) => {
          g.style.cursor = "default";
          g.onmousemove = (e) => (showTip(e, s.model + " (" + s.size + ")<br>Base " + b.toFixed(1) + "<br>Core " + c[0].toFixed(1) + " ± " + c[1].toFixed(1) + " (95%, " + c[2] + " seeds)"));
          g.onmouseleave = hideTip;
        });
      });
    }
    function regChart(R, m) {
      const box = $("#reg-chart");
      box.innerHTML = "";
      const rows = R.regrouped_lite, core = R.sizes[0]["core_" + m][0];
      const W = 480, rowH = 50, top = 26, L = 92, Rr = 20, H = top + rowH * rows.length + 24;
      const svg = S("svg", { viewBox: "0 0 " + W + " " + H }, box);
      const vals = rows.flatMap((r) => ([r["pub_" + m], r["dag_" + m]])).concat([core]);
      const ticks = nice(Math.min(...vals) - 1, Math.max(...vals) + 1, 4);
      const lo = ticks[0], hi = ticks[ticks.length - 1], x = (v) => (L + (W - L - Rr) * (v - lo) / (hi - lo));
      axisFrame(svg, W, H, L, Rr, top, ticks, x, null);
      S("line", { x1: x(core), x2: x(core), y1: top - 8, y2: H - 22, stroke: "#2a78d6", "stroke-width": 2, "stroke-dasharray": "5 4" }, svg);
      const ct = S("text", { x: x(core) + 5, y: top - 10, "font-size": 11.5, fill: "#1b5fb3", "font-weight": 700 }, svg);
      ct.textContent = "Core " + core.toFixed(1);
      rows.forEach((r, i) => {
        const y = top + rowH * i + rowH / 2, a = r["pub_" + m], b = r["dag_" + m];
        const lab = S("text", { x: 0, y: y + 4, "font-size": 13, fill: "#15171c", "font-weight": 600 }, svg);
        lab.textContent = r.name;
        S("line", { x1: x(a), x2: x(b), y1: y, y2: y, stroke: "#f3c7b2", "stroke-width": 5, "stroke-linecap": "round" }, svg);
        const ga = S("circle", { cx: x(a), cy: y, r: 7, fill: "#9a9893", stroke: "#fff", "stroke-width": 2 }, svg);
        const gb = S("circle", { cx: x(b), cy: y, r: 7.5, fill: "#eb6834", stroke: "#fff", "stroke-width": 2 }, svg);
        [ga, gb].forEach((g) => {
          g.onmousemove = (e) => (showTip(e, r.name + "<br>as published " + a.toFixed(1) + "<br>+ regrouped questions " + b.toFixed(1) + "<br>Core " + core.toFixed(1)));
          g.onmouseleave = hideTip;
        });
      });
    }
    function hbars(boxSel, groups, max, unit) {
      const box = $(boxSel);
      box.innerHTML = groups.map((g) => ('<div style="display:grid;grid-template-columns:118px 1fr;gap:10px;align-items:center;margin:9px 0"><div style="font-size:13.5px;font-weight:600">' + g.name + '</div><div style="display:grid;gap:3px">' + g.bars.map((b) => ('<div style="display:flex;align-items:center;gap:8px"><div style="height:13px;border-radius:3px;width:' + 100 * b.v / max + "%;background:" + b.c + '"></div><span class="mono" style="font-size:12px;color:' + (b.tc || "var(--ink2)") + '">' + b.v.toFixed(1) + (unit || "") + "</span></div>")).join("") + "</div></div>")).join("");
    }
    function wordChart() {
      const W = [["“X or Y”", 14.8, 5.8], ["“one of”", 14.1, 6.6], ["“either”", 15.1, 6.7], ["“any of”", 15.1, 7], ["“X / Y”", 17.9, 11.7]];
      hbars("#word-chart", W.map((w) => (({ name: w[0], bars: [{ v: w[1], c: "var(--base)" }, { v: w[2], c: "var(--core)", tc: "var(--core-ink)" }] }))), 19);
      $("#word-chart").insertAdjacentHTML("beforeend", '<p class="cap" style="margin-top:6px">Gray: base model. Blue: <span class="sc">Core</span> (mean over 2 seeds). “X or Y” is the wording used in training.</p>');
    }
    function xdataChart() {
      const X = [["Base model", 14.8, "var(--base)"], ["SFT · A-OKVQA", 12, "var(--orange)"], ["Core · A-OKVQA", 8.3, "var(--core)"], ["Core · our items", 5.8, "var(--core)"]];
      hbars("#xdata-chart", X.map((w) => (({ name: w[0].replace("Core", '<span class="sc" style="color:var(--core-ink)">Core</span>'), bars: [{ v: w[1], c: w[2], tc: w[0].startsWith("Core") ? "var(--core-ink)" : null }] }))), 16);
      $("#xdata-chart").insertAdjacentHTML("beforeend", '<p class="cap" style="margin-top:6px">Hard items: 25.7 (base) → 14.8 (<span class="sc">Core</span> trained on A-OKVQA); ECE 2.4. Means over 3 seeds.</p>');
    }
    function table(R, which) {
      const rows = which === "lite" ? R.table_lite : R.table_flash;
      const H = which === "lite" ? ["Method", "Acc. ↑", "ECE ↓", "Brier ↓", "Partition ↓<br>all", "Partition ↓<br>hard", "Order TV ↓", "IIA ↓<br>add", "IIA ↓<br>drop"] : ["Method", "Acc. ↑", "Orig. acc. ↑", "ECE ↓", "Brier ↓", "Partition ↓<br>all", "Partition ↓<br>hard", "Order TV ↓", "IIA ↓<br>add", "IIA ↓<br>drop"];
      $("#tbl-sub").innerHTML = which === "lite" ? '×100. Mean ± standard deviation over 3 seeds per baseline and 5 for <span class="sc">Core</span>. Bold: best; underline: second best; the base model is not ranked.' : "×100. Mean ± standard deviation over 3 seeds. Orig. acc.: accuracy on the original questions only. †: also trained on our regrouped questions.";
      let h = '<table class="res"><thead><tr>' + H.map((x) => ("<th>" + x + "</th>")).join("") + "</tr></thead><tbody>";
      rows.forEach((r, i) => {
        const name = r.cells[0].text.replace("$^\\dagger$", "†").replace(/\$\^\\dagger\$/g, "†").replace("Core (ours)", "Core (ours)");
        h += '<tr class="' + (r.ours ? "ours" : "") + (i === 0 ? " base" : "") + '"><td>' + (r.ours ? '<span class="sc">Core</span> (ours)' : name) + "</td>" + r.cells.slice(1).map((c) => ('<td class="' + (c.best ? "best" : c.second ? "second" : "") + '">' + c.v + (c.sd ? '<span class="sd">±' + c.sd + "</span>" : "") + "</td>")).join("") + "</tr>";
      });
      $("#tbl").innerHTML = h + "</tbody></table>";
    }
    const FORMS = [["original", "Original"], ["merge_pair0", "Merge 1"], ["merge_pair1", "Merge 2"], ["merge_part0", "Split"], ["iia_drop", "Drop one"], ["iia_add", "Add one"]];
    const DMEAN = { merge: [14.8, 5.8, "Partition violation"], split: [14.8, 5.8, "Partition violation"], drop: [6.4, 5.2, "Ratio change (IIA, drop)"], add: [5.5, 4.5, "Ratio change (IIA, add)"] };
    let D = null, pool = "featured", idx = 0, fid = null;
    const items = () => (D.items.filter((it) => (it.pool === pool)));
    const nm = (it, i) => (it.short ? it.short[i] : it.names[i]);
    const chipFor = (members) => ('<span class="chip">' + members.map((i) => (i < 0 ? '<b class="x">+</b>' : '<b style="background:' + ocol(i) + '">' + LET[i] + "</b>")).join("") + "</span>");
    function renderThumbs() {
      const T = $("#thumbs");
      const L = items();
      T.innerHTML = L.map((it, i) => ('<button class="' + (i === idx ? "on" : "") + '" data-i="' + i + '" title="' + it.bench + " · item " + it.item + '"><img loading="lazy" src="static/play/img/' + it.item + '_t.jpg" alt=""></button>')).join("");
      $$("#thumbs button").forEach((b) => (b.onclick = () => {
        idx = +b.dataset.i;
        fid = null;
        renderItem();
      }));
      const on = T.querySelector(".on");
      if (on)
        thumbCenter(on);
    }
    function bar(p, t, who) {
      const d = t == null ? null : p - t;
      let h = '<div class="brow"><span class="who ' + (who === "c" ? "c" : "") + '">' + (who === "c" ? "Core" : "Base") + '</span><div class="tbar"><div class="f ' + who + '" style="width:' + 100 * p + '%"></div>';
      if (t != null)
        h += '<div class="tg ' + (Math.abs(d) >= 0.1 ? "bad" : "") + '" style="width:' + 100 * t + '%;opacity:1"></div>';
      h += '</div><span class="val">' + p.toFixed(2) + (d != null && Math.abs(d) >= 0.05 ? '<span class="d ' + (Math.abs(d) >= 0.1 ? "bad" : "") + '">' + sgn(d) + "</span>" : "") + "</span></div>";
      return h;
    }
    function renderItem() {
      const L = items();
      idx = (idx + L.length) % L.length;
      const it = L[idx];
      if (!fid || fid !== "original" && !it.forms[fid])
        fid = it.start && it.forms[it.start] ? it.start : "original";
      $$("#thumbs button").forEach((b, i) => (b.classList.toggle("on", i === idx)));
      const on = $("#thumbs .on");
      if (on)
        thumbCenter(on);
      $("#pimgs").innerHTML = it.images.map((im) => ('<img src="static/play/img/' + im.f + '" width="' + im.w + '" height="' + im.h + '" alt="Evaluation image of item ' + it.item + '">')).join("");
      $$("#pimgs img").forEach((im) => (im.onclick = () => {
        $("#lbimg").src = im.src;
        $("#lb").showModal();
      }));
      $("#pmeta").innerHTML = '<span class="tag">' + it.bench + "</span>" + (it.subtask && it.subtask !== "mc" ? '<span class="tag">' + it.subtask + "</span>" : "") + '<span class="tag">item ' + it.item + '</span><span class="tag ' + (it.pool === "featured" ? "f" : "r") + '">' + (it.pool === "featured" ? "featured" : "random draw") + "</span>";
      $("#pq").textContent = it.q;
      $("#forms").innerHTML = FORMS.map((f) => ('<button data-f="' + f[0] + '" class="' + (f[0] === fid ? "on" : "") + '"' + (f[0] !== "original" && !it.forms[f[0]] ? " disabled" : "") + ">" + f[1] + "</button>")).join("");
      $$("#forms button").forEach((b) => (b.onclick = () => {
        fid = b.dataset.f;
        renderItem();
      }));
      renderForm(it);
    }
    function mathify(it) {
      const txt = it.q + it.names.join(" ");
      if (!window.renderMathInElement || !/\$[^$]*\\[a-zA-Z]+/.test(txt)) return;
      [$("#pq"), $("#orows")].forEach((e) => renderMathInElement(e, { delimiters: [{ left: "$$", right: "$$", display: false }, { left: "$", right: "$", display: false }], throwOnError: false }));
    }
    function renderForm(it) {
      const rows = [], gold = it.label;
      let desc = "", metric = "";
      if (fid === "original") {
        desc = "The question as it is in the benchmark. Probabilities are averaged over three option orders, as in the paper. This is the answer that every regrouped question is compared with.";
        it.names.forEach((n, i) => (rows.push({ mem: [i], text: nm(it, i), b: it.base.P[i], c: it.core.P[i], gold: i === gold })));
        const tb = it.base.P.indexOf(Math.max(...it.base.P)), tc = it.core.P.indexOf(Math.max(...it.core.P));
        metric = '<div><div class="k">Base answer</div><div class="v">' + LET[tb] + '</div><div class="s">' + (tb === gold ? "correct" : "wrong") + " · p = " + it.base.P[tb].toFixed(2) + '</div></div><div class="c"><div class="k">Core answer</div><div class="v">' + LET[tc] + '</div><div class="s">' + (tc === gold ? "correct" : "wrong") + " · p = " + it.core.P[tc].toFixed(2) + "</div></div>";
      } else {
        const fm = it.forms[fid], kind = fm.kind, B = it.base.forms[fid], C = it.core.forms[fid];
        fm.blocks.forEach((bl, j) => (rows.push({ mem: bl, text: bl[0] < 0 ? fm.labels[j] : bl.map((i) => (nm(it, i))).join(' <i style="color:var(--muted)">or</i> '), b: B.p[j], c: C.p[j], tb: B.t[j], tc: C.t[j], gold: fm.gold.includes(j), added: bl[0] < 0 })));
        if (kind === "merge")
          desc = "Two options are merged into one. A coherent model gives the merged option the sum of what it gave its members on the original question (dashed). Red: off by 0.1 or more.";
        if (kind === "split")
          desc = "All options are split into groups. Each group should receive the sum of its members (dashed).";
        if (kind === "drop") {
          const kept = new Set(fm.blocks.map((b) => (b[0])));
          const dr = it.names.map((n, i) => (i)).filter((i) => (!kept.has(i)));
          desc = "Option " + dr.map((i) => (LET[i])).join(", ") + " is removed. The remaining options should keep their ratios (dashed: the original answer renormalized).";
        }
        if (kind === "add")
          desc = "An option from another item is added (gray +). The original options should keep their ratios; the dashed boxes rescale the original answer to the probability left after the added option.";
        const dm = DMEAN[kind];
        metric = '<div><div class="k">' + dm[2] + ' · Base</div><div class="v">' + (100 * B.V).toFixed(1) + '</div><div class="s">points on this question · dataset mean ' + dm[0] + '</div></div><div class="c"><div class="k">' + dm[2] + ' · Core</div><div class="v">' + (100 * C.V).toFixed(1) + '</div><div class="s">points on this question · dataset mean ' + dm[1] + "</div></div>";
      }
      $("#fdesc").textContent = desc;
      $("#orows").innerHTML = rows.map((r) => ('<div class="orow"><div class="olab">' + chipFor(r.mem) + "<span>" + r.text + (r.gold ? '<span class="gold">✓ correct</span>' : "") + '</span></div><div class="bars">' + bar(r.b, fid === "original" ? null : r.tb, "b") + bar(r.c, fid === "original" ? null : r.tc, "c") + "</div></div>")).join("");
      $("#metric").innerHTML = metric;
      mathify(it);
    }
    fetch("static/data/play.json").then((r) => (r.json())).then((d) => {
      D = d;
      $("#pnote").innerHTML = 'Answers of d3-lite (0.85B): the base model and <span class="sc">Core</span> (seed 0 of 5). Featured items follow a fixed rule: the base model is under-additive by at least 0.15 on a pair merge and <span class="sc">Core</span> is within 0.05 of coherence on it; one item per benchmark with the largest difference, plus the item of Fig. 1. Random items are 48 items drawn uniformly from the 1,050 evaluation items, including ones where <span class="sc">Core</span> stays incoherent. Option texts of the Fig. 1 item are abbreviated.';
      const Q2 = new URLSearchParams(location.search);
      if (Q2.get("pool")) { pool = Q2.get("pool"); $$("#pool button").forEach((x) => x.classList.toggle("on", x.dataset.p === pool)); }
      if (Q2.get("i")) idx = +Q2.get("i");
      if (Q2.get("f")) fid = Q2.get("f");
      renderThumbs();
      renderItem();
    });
    $$("#pool button").forEach((b) => (b.onclick = () => {
      $$("#pool button").forEach((x) => (x.classList.toggle("on", x === b)));
      pool = b.dataset.p;
      idx = 0;
      fid = null;
      renderThumbs();
      renderItem();
    }));
    $("#prev").onclick = () => {
      idx--;
      fid = null;
      renderItem();
    };
    $("#next").onclick = () => {
      idx++;
      fid = null;
      renderItem();
    };
    $("#shuffle").onclick = () => {
      const n = items().length;
      let k = idx;
      while (n > 1 && k === idx)
        {k = Math.floor(Math.random() * n);}
      idx = k;
      fid = null;
      renderItem();
    };
    $("#lb").onclick = () => ($("#lb").close());
    const OCOL = { A: "var(--oA)", B: "var(--oB)", C: "var(--oC)", D: "var(--oD)", E: "var(--oE)" };
    const ochip = (lab) => {
      const mem = lab.split(" or ");
      return '<span class="ochip"><span class="sw">' + mem.map((m) => ('<i style="background:' + OCOL[m] + '"></i>')).join("") + "</span>" + lab + "</span>";
    };
    const segBg = (lab) => {
      const mem = lab.split(" or ");
      return mem.length === 1 ? OCOL[mem[0]] : "linear-gradient(90deg," + mem.map((m) => (OCOL[m])).join(",") + ")";
    };
    const sbar = (parts, id) => ('<div class="sbar"' + (id ? ' id="' + id + '"' : "") + ">" + parts.map((p) => ('<div style="flex-grow:' + p[1] + ";background:" + segBg(p[0]) + '">' + (p[1] >= 0.07 ? p[0] + " " + p[1].toFixed(2).replace(/^0/, "") : "") + "</div>")).join("") + "</div>");
    const QREG = { merge: [["A or B", 0.78], ["C", 0.14], ["D", 0.08]], split: [["A or D", 0.36], ["B or C", 0.64]], drop: [["A", 0.33], ["B", 0.58], ["D", 0.09]], add: [["A", 0.28], ["B", 0.5], ["C", 0.14], ["D", 0.08], ["E", 0.0001]] };
    const STEPS = [
      {
        t: "Regroup the question",
        d: "Each training item is asked as its original question and as regrouped questions: options reordered, merged, split into groups, dropped, or added from another item.",
        pane: () => ('<div class="mq"><div class="ph"></div><div>Which object is closest to the camera? <span class="mono" style="color:var(--muted);font-weight:500">(gold: B)</span></div></div>' + [["original", ["A", "B", "C", "D"]], ["reordered", ["C", "A", "D", "B"]], ["merged", ["A or B", "C", "D"]], ["split", ["A or D", "B or C"]], ["dropped", ["A", "B", "D"]], ["added", ["A", "B", "C", "D", "E"]]].map((r, i) => ('<div class="mrow" style="animation-delay:' + i * 0.12 + 's"><span class="k">' + r[0] + '</span><div class="ochips">' + r[1].map(ochip).join("") + "</div></div>")).join("") + '<p class="cap" style="margin-top:12px">E: an option of another item. A merged option lists its members (“A or B”).</p>')
      },
      {
        t: "One target for all regroupings",
        d: "The frozen model’s answer to the original question, mixed 0.7 to 0.3 with the smoothed label, gives one target q over the original options. Each regrouped question gets q regrouped the same way.",
        pane: () => ('<div class="slab"><span><b>Frozen model’s answer P₀</b> to the original question</span></div>' + sbar([["A", 0.4], ["B", 0.3], ["C", 0.19], ["D", 0.11]]) + '<div class="slab"><span><b>Target q</b> = 0.7 · P₀ + 0.3 · smoothed label (gold B)</span></div>' + sbar([["A", 0.28], ["B", 0.5], ["C", 0.14], ["D", 0.08]]) + '<div class="slab"><span><b>q regrouped</b> for the</span><span class="mini-sel" id="qsel"><button data-k="merge" class="on">merged</button><button data-k="split">split</button><button data-k="drop">dropped</button><button data-k="add">added</button></span></div><div id="qreg">' + sbar(QREG.merge) + "</div>" + '<p class="cap" style="margin-top:12px">A merged option’s target is the sum of its members: q(A or B) = .28 + .50 = .78. A dropped option’s mass is renormalized away; an added option gets 0.</p>'),
        after: () => ($$("#qsel button").forEach((b) => (b.onclick = () => {
          $$("#qsel button").forEach((x) => (x.classList.toggle("on", x === b)));
          $("#qreg").innerHTML = sbar(QREG[b.dataset.k]);
        })))
      },
      {
        t: "Sample answers",
        d: "The model being trained (d3 with LoRA adapters) answers the regrouped question, and 16 answers are sampled from its probabilities.",
        pane: () => ('<div class="slab"><span><b>Model answer p<sub>f</sub></b> to the merged question</span><span class="mono">d3 + LoRA</span></div>' + sbar([["A or B", 0.55], ["C", 0.28], ["D", 0.17]]) + '<div class="slab"><span><b>Target q<sub>f</sub></b> for the same question</span></div>' + sbar(QREG.merge) + '<div class="slab"><span><b>16 sampled answers</b></span></div><div class="dots">' + ["A or B", "C", "A or B", "D", "A or B", "A or B", "C", "A or B", "D", "A or B", "C", "A or B", "A or B", "D", "C", "A or B"].map((a, i) => ('<i title="' + a + '" style="background:' + segBg(a) + ";animation-delay:" + i * 0.06 + 's"></i>')).join("") + "</div>" + '<p class="cap">The merged option is under-weighted: the model gives it .55, the target .78.</p>')
      },
      {
        t: "Reward each sample",
        d: "Each sample is rewarded with log q − log p. In expectation this is the negative KL divergence to the target, so under-weighted answers such as the merged option are pushed up.",
        pane: () => ('<div class="eq" id="eq1">r(a) = log q_f(a) − log p_f(a),   E_{a~p_f}[r] = −KL(p_f ‖ q_f)</div>' + '<table class="rtab"><thead><tr><th>answer a</th><th>p<sub>f</sub></th><th>q<sub>f</sub></th><th>r(a)</th></tr></thead><tbody>' + [["A or B", 0.55, 0.78], ["C", 0.28, 0.14], ["D", 0.17, 0.08]].map((r) => {
          const v = Math.log(r[2]) - Math.log(r[1]);
          return "<tr><td>" + ochip(r[0]) + "</td><td>" + r[1].toFixed(2) + "</td><td>" + r[2].toFixed(2) + '</td><td class="' + (v > 0 ? "pos" : "neg") + '">' + sgn(v) + "</td></tr>";
        }).join("") + "</tbody></table>" + '<p class="cap" style="margin-top:14px">Advantages (r − r̄)/σ̂ use one reward scale σ̂ shared by all questions, and the LoRA weights are updated. At inference: one forward pass, no parser and no original question.</p>'),
        after: () => {
          if (window.katex)
            katex.render("r(a)=\\log q_f(a)-\\log p_f(a),\\qquad \\mathbb{E}_{a\\sim p_f}\\big[r(a)\\big]=-\\mathrm{KL}\\big(p_f\\,\\|\\,q_f\\big)", $("#eq1"), { throwOnError: false, displayMode: true });
        }
      }
    ];
    let cur = 0, auto = true, timer = null, t0 = 0;
    const DUR = 9000;
    $("#steps").innerHTML = STEPS.map((s, i) => ('<button class="step" data-i="' + i + '"><div class="n">STEP ' + (i + 1) + ' / 4</div><div class="t">' + s.t + '</div><div class="d">' + s.d + '</div><div class="prog"><i></i></div></button>')).join("");
    const showStep = (i) => {
      cur = (i + STEPS.length) % STEPS.length;
      $$(".step").forEach((b, k) => (b.classList.toggle("on", k === cur)));
      $("#stage").innerHTML = '<div class="pane on">' + STEPS[cur].pane() + "</div>";
      if (STEPS[cur].after)
        STEPS[cur].after();
      t0 = performance.now();
    };
    $$(".step").forEach((b) => (b.onclick = () => {
      auto = false;
      showStep(+b.dataset.i);
      $$(".step .prog i").forEach((p) => (p.style.width = 0));
    }));
    let inView = false;
    new IntersectionObserver((es) => {
      inView = es[0].isIntersecting;
      if (inView) { t0 = performance.now(); kick(); }
    }, { threshold: 0.35 }).observe($("#stage"));
    let raf = 0;
    const tick = (now) => {
      raf = 0;
      if (!(auto && inView)) return;
      const f = Math.min(1, (now - t0) / DUR);
      const p = $$(".step .prog i")[cur];
      if (p) p.style.width = 100 * f + "%";
      if (f >= 1) showStep(cur + 1);
      raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf && auto && inView) raf = requestAnimationFrame(tick); };
    if (Q.has("step")) { auto = false; showStep((+Q.get("step") || 1) - 1); } else showStep(0);
    addEventListener("load", () => {
      if (cur === 3 && STEPS[3].after)
        STEPS[3].after();
    });
    $("#copy").onclick = () => (navigator.clipboard.writeText($("#bibtex").innerText).then(() => {
      $("#copy").textContent = "Copied";
      setTimeout(() => ($("#copy").textContent = "Copy"), 1500);
    }));
  })();
