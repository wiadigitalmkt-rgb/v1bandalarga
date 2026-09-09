/* =========================================================
   V1 BANDA LARGA — main.js
   Este mesmo arquivo roda em todas as páginas do site.
   Cada bloco verifica se os elementos existem antes de usá-los,
   já que nem toda página tem os mesmos componentes.
   ========================================================= */

const anoEl = document.getElementById("ano");
if (anoEl) anoEl.textContent = new Date().getFullYear();

/* ---------------------------------------------------------
   Menu mobile (existe em todas as páginas)
--------------------------------------------------------- */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------
   Contador do hero (só existe na home)
--------------------------------------------------------- */
function animateCount(el, target, duration = 900) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
document.querySelectorAll(".readout-num[data-count]").forEach((el) => {
  animateCount(el, parseInt(el.dataset.count, 10));
});

/* ---------------------------------------------------------
   Tilt interativo no cartão do hero (só existe na home)
--------------------------------------------------------- */
const heroSection = document.getElementById("heroSection");
const deviceCard = document.getElementById("deviceCard");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroSection && deviceCard && !prefersReducedMotion && window.matchMedia("(min-width: 901px)").matches) {
  heroSection.addEventListener("mousemove", (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    deviceCard.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg)`;
  });
  heroSection.addEventListener("mouseleave", () => {
    deviceCard.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

/* ---------------------------------------------------------
   Verificador de área de cobertura
   (existe na home e na página cobertura.html)
   ---------------------------------------------------------
   1) Se as credenciais do Supabase abaixo estiverem preenchidas,
      consulta a tabela "cobertura_bairros" (ver /supabase/schema.sql).
   2) Se não estiverem, usa a lista local FALLBACK_BAIRROS como
      demonstração — troque pelos dados reais de cobertura da V1
      antes de publicar o site.
--------------------------------------------------------- */

// PREENCHA com os dados do seu projeto Supabase (Project Settings > API)
const SUPABASE_URL = "";      // ex: "https://xxxxxxxx.supabase.co"
const SUPABASE_ANON_KEY = ""; // ex: "eyJhbGciOi..."

const coverageForm = document.getElementById("coverageForm");

if (coverageForm) {
  let supabaseClient = null;
  if (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  // Lista de exemplo (bairros reais de Santa Rita-PB) — apenas para
  // o site funcionar antes de o Supabase estar configurado.
  // status: "disponivel" | "em_expansao" | undefined (desconhecido)
  const FALLBACK_BAIRROS = [
    { bairro: "Centro", status: "disponivel" },
    { bairro: "Tibiri", status: "disponivel" },
    { bairro: "Jardim Europa", status: "disponivel" },
    { bairro: "Jardins", status: "disponivel" },
    { bairro: "Liberdade", status: "em_expansao" },
    { bairro: "Marcos Moura", status: "em_expansao" },
    { bairro: "Popular", status: "disponivel" },
    { bairro: "Portal de Tibiri", status: "em_expansao" },
    { bairro: "Santo Amaro", status: "disponivel" },
    { bairro: "Vidal de Negreiros", status: "em_expansao" },
    { bairro: "Distrito Industrial", status: "em_expansao" },
  ];

  const coverageResult = document.getElementById("coverageResult");
  const bairroInput = document.getElementById("bairroInput");

  const normalize = (str) =>
    str
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const renderResult = (type, html) => {
    const cls = type === "ok" ? "result-ok" : type === "warn" ? "result-warn" : "result-unknown";
    coverageResult.innerHTML = `<div class="result-box ${cls}">${html}</div>`;
  };

  async function checkCoverage(bairroRaw) {
    const term = normalize(bairroRaw);

    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from("cobertura_bairros")
        .select("bairro, status")
        .ilike("bairro", `%${bairroRaw}%`)
        .limit(1);

      if (!error && data && data.length > 0) return data[0];
      if (!error) return null; // não encontrado no banco
    }

    // fallback local
    const found = FALLBACK_BAIRROS.find(
      (b) => normalize(b.bairro).includes(term) || term.includes(normalize(b.bairro))
    );
    return found || null;
  }

  coverageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const value = bairroInput.value.trim();
    if (!value) return;

    renderResult("unknown", "Verificando cobertura...");

    const result = await checkCoverage(value);
    const whatsUrl = `https://api.whatsapp.com/send/?phone=5583988858206&text=${encodeURIComponent(
      `Olá! Quero saber se a V1 atende o bairro ${value}.`
    )}&type=phone_number&app_absent=0`;

    if (!result) {
      renderResult(
        "unknown",
        `Ainda não temos esse bairro na nossa lista. <a href="${whatsUrl}" target="_blank" rel="noopener" style="text-decoration:underline">Fale com a gente no WhatsApp</a> pra confirmar.`
      );
      return;
    }

    if (result.status === "disponivel") {
      renderResult(
        "ok",
        `Boa notícia! A V1 já atende o bairro <strong>${result.bairro}</strong>. <a href="${whatsUrl}" target="_blank" rel="noopener" style="text-decoration:underline">Peça sua instalação</a>.`
      );
    } else if (result.status === "em_expansao") {
      renderResult(
        "warn",
        `Estamos expandindo a rede no bairro <strong>${result.bairro}</strong>. <a href="${whatsUrl}" target="_blank" rel="noopener" style="text-decoration:underline">Fale com a gente</a> pra saber a previsão.`
      );
    } else {
      renderResult(
        "unknown",
        `Encontramos o bairro <strong>${result.bairro}</strong>, mas precisamos confirmar a cobertura. <a href="${whatsUrl}" target="_blank" rel="noopener" style="text-decoration:underline">Fale com a gente no WhatsApp</a>.`
      );
    }
  });
}
