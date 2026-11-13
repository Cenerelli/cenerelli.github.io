/* ==========================================================================
   INTERACOES DA PAGINA
   Organizacao: dados e elementos > textos > recursos da pagina > inicializacao.
   Para mudar textos, veja texts.js; para layout e cores, veja css/style.css.
   ========================================================================== */

/* ---------- Lista de secoes e textos alternados ---------- */
const sectionIds = ["inicio", "sobre", "trajetoria", "competencias", "servicos", "portfolio", "avaliacoes", "contato"];
const roleKeys = ["welcome.role1", "welcome.role2", "welcome.role3"];

/* ---------- Estado atual da pagina ---------- */
let language = "pt";
let welcomeActive = true;
let isSwitchingLanguage = false;

/* ---------- Elementos principais do HTML ---------- */
const root = document.documentElement;
const site = document.getElementById("conteudo-site");
const navbar = document.getElementById("barra-navegacao");
const hero = document.getElementById("inicio");
const heroInner = document.getElementById("conteudo-inicio");
const scrollHint = document.querySelector(".dica-rolagem");
const progressBar = document.getElementById("progresso-rolagem");
const navLinks = document.querySelectorAll(".links-navegacao a");
const earthIcons = document.querySelectorAll(".icone-terra");
const welcome = document.getElementById("boas-vindas");
const welcomeButton = document.getElementById("continuar-boas-vindas");
const lead = document.querySelector(".introducao-sobre");
const journeyCards = document.querySelectorAll(".cartao-trajetoria");
const journeyPrev = document.getElementById("trajetoria-anterior");
const journeyNext = document.getElementById("trajetoria-proximo");
const journeyNextLabel = document.getElementById("trajetoria-proximo-texto");
const journeyCount = document.getElementById("trajetoria-contador");
const topButton = document.getElementById("voltar-topo");
const footer = document.querySelector(".rodape");
let journeyIndex = 0;

/* ---------- Funcoes auxiliares reutilizadas ---------- */
function listen(nodeList, eventName, handler) {
  let i = 0;
  while (i < nodeList.length) {
    nodeList[i].addEventListener(eventName, handler);
    i = i + 1;
  }
}

function findAncestorWith(node, attribute) {
  do {
    if (node.nodeType === 1 && node.hasAttribute(attribute)) {
      return node;
    }
    node = node.parentNode;
  } while (node !== null && node !== document);
  return null;
}

function preventBrowserZoom(event) {
  if ((event.ctrlKey || event.metaKey) && event.cancelable) {
    event.preventDefault();
  }
}

function preventKeyboardZoom(event) {
  if (event.ctrlKey === false && event.metaKey === false) {
    return;
  }
  const zoomKeys = ["+", "-", "=", "_", "0"];
  const zoomCodes = ["Equal", "Minus", "NumpadAdd", "NumpadSubtract", "Numpad0", "Digit0"];
  if ((zoomKeys.includes(event.key) || zoomCodes.includes(event.code)) && event.cancelable) {
    event.preventDefault();
  }
}

function preventTouchZoom(event) {
  if (event.touches && event.touches.length > 1 && event.cancelable) {
    event.preventDefault();
  }
}

function preventGestureZoom(event) {
  if (event.cancelable) {
    event.preventDefault();
  }
}

/* ---------- Textos e troca de idioma (portugues / ingles) ---------- */
function getText(key, forcedLanguage) {
  let chosen = language;
  if (forcedLanguage !== undefined) {
    chosen = forcedLanguage;
  }
  let i = 0;
  while (i < texts.length) {
    if (texts[i][0] === key) {
      if (chosen === "pt") {
        return texts[i][1];
      } else {
        return texts[i][2];
      }
    }
    i = i + 1;
  }
  return key;
}

function wrapWords() {
  const words = lead.textContent.trim().split(" ");
  lead.textContent = "";
  let i = 0;
  while (i < words.length) {
    const span = document.createElement("span");
    span.className = "palavra";
    span.textContent = words[i];
    lead.appendChild(span);
    if (i < words.length - 1) {
      lead.appendChild(document.createTextNode(" "));
    }
    i = i + 1;
  }
}

function applyTexts() {
  const items = document.querySelectorAll("[data-i18n]");
  const images = document.querySelectorAll("[data-i18n-alt]");
  const labels = document.querySelectorAll("[data-i18n-aria]");
  const options = document.querySelectorAll(".opcao-idioma");
  const whatsappLinks = document.querySelectorAll("[data-whatsapp]");
  let i = 0;
  while (i < items.length) {
    items[i].textContent = getText(items[i].getAttribute("data-i18n"));
    i = i + 1;
  }
  wrapWords();
  i = 0;
  while (i < images.length) {
    images[i].alt = getText(images[i].getAttribute("data-i18n-alt"));
    i = i + 1;
  }
  i = 0;
  while (i < labels.length) {
    labels[i].setAttribute("aria-label", getText(labels[i].getAttribute("data-i18n-aria")));
    i = i + 1;
  }
  i = 0;
  while (i < options.length) {
    if (options[i].getAttribute("data-language") === language) {
      options[i].classList.add("ativo");
    } else {
      options[i].classList.remove("ativo");
    }
    i = i + 1;
  }
  i = 0;
  while (i < whatsappLinks.length) {
    whatsappLinks[i].href = "https://wa.me/5551990103313?text=" + encodeURIComponent(getText("whatsapp.message"));
    i = i + 1;
  }
  document.title = getText("page.title");
  if (language === "pt") {
    root.lang = "pt-BR";
  } else {
    root.lang = "en";
  }
  fillSubjects();
  updateJourneyControls();
  restartTypers();
}

function finishLanguageChange(newLanguage) {
  language = newLanguage;
  applyTexts();
  requestAnimationFrame(showTexts);
  setTimeout(unlockLanguage, 260);
}

function showTexts() {
  root.classList.remove("trocando-idioma");
}

function unlockLanguage() {
  isSwitchingLanguage = false;
}

function onLanguageClick() {
  if (isSwitchingLanguage) {
    return;
  }
  isSwitchingLanguage = true;
  let i = 0;
  while (i < earthIcons.length) {
    earthIcons[i].classList.remove("girando");
    earthIcons[i].getBoundingClientRect(); // restarts the animation
    earthIcons[i].classList.add("girando");
    i = i + 1;
  }
  root.classList.add("trocando-idioma"); // fades the texts out
  if (language === "pt") {
    setTimeout(finishLanguageChange, 240, "en");
  } else {
    setTimeout(finishLanguageChange, 240, "pt");
  }
}

function onEarthEnd(event) {
  event.currentTarget.classList.remove("girando");
}

/* ---------- Texto digitado: cargo animado nas telas de boas-vindas e inicio ---------- */
const typers = [
  [document.getElementById("funcao-digitada-boas-vindas"), 0, 0, "typing", 0],
  [document.getElementById("funcao-digitada-inicio"), 0, 0, "typing", 0],
];

function stepTyper(n, runId) {
  const typer = typers[n];
  if (runId !== typer[4]) {
    return; // an older timer: ignore it
  }
  if (n === 0 && welcomeActive === false) {
    return; // the welcome typewriter stops when the welcome screen closes
  }
  const text = getText(roleKeys[typer[1] % roleKeys.length]);
  let delay = 55;
  switch (typer[3]) {
    case "typing":
      typer[2] = typer[2] + 1;
      typer[0].textContent = text.slice(0, typer[2]);
      if (typer[2] >= text.length) {
        typer[3] = "holding";
        delay = 1500;
      }
      break;
    case "holding":
      typer[3] = "deleting";
      delay = 28;
      break;
    case "deleting":
      typer[2] = typer[2] - 1;
      typer[0].textContent = text.slice(0, typer[2]);
      if (typer[2] <= 0) {
        typer[3] = "typing";
        typer[1] = typer[1] + 1;
        delay = 400;
      } else {
        delay = 28;
      }
      break;
    default:
      typer[3] = "typing";
      break;
  }
  setTimeout(stepTyper, delay, n, runId);
}

function restartTypers() {
  let n = 0;
  while (n < typers.length) {
    typers[n][2] = 0;
    typers[n][3] = "typing";
    typers[n][4] = typers[n][4] + 1;
    stepTyper(n, typers[n][4]);
    n = n + 1;
  }
}

/* ---------- Rolagem suave ate uma secao ---------- */
let smoothing = false;
let smoothFrom = 0;
let smoothTo = 0;
let smoothStart = 0;
let smoothDuration = 0;

function scrollToSection(id) {
  switch (id) {
    case "inicio":
      smoothTo = 0;
      break;
    default:
      smoothTo = document.getElementById(id).getBoundingClientRect().top + window.scrollY - navbar.offsetHeight + 1;
      break;
  }
  smoothFrom = window.scrollY;
  smoothStart = performance.now();
  smoothDuration = 650 + Math.abs(smoothTo - smoothFrom) * 0.2;
  if (smoothDuration > 1500) {
    smoothDuration = 1500;
  }
  smoothing = true;
  requestAnimationFrame(smoothStep);
}

function smoothStep(now) {
  if (smoothing === false) {
    return;
  }
  let progress = (now - smoothStart) / smoothDuration;
  let eased = 0;
  if (progress > 1) {
    progress = 1;
  }
  if (progress < 0.5) {
    eased = 4 * progress * progress * progress; // ease-in-out cubic
  } else {
    eased = 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }
  window.scrollTo(0, smoothFrom + (smoothTo - smoothFrom) * eased);
  if (progress < 1) {
    requestAnimationFrame(smoothStep);
  } else {
    smoothing = false;
  }
}

function onGotoClick(event) {
  event.preventDefault();
  if (welcomeActive === false) {
    scrollToSection(event.currentTarget.getAttribute("data-goto"));
  }
}

function stopSmooth() {
  smoothing = false; // the user takes over the scroll
}

/* ---------- Efeitos de rolagem: progresso, entrada, paralaxe e trajetoria ---------- */
let scrollTicking = false;

function updateProgressBar() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  let amount = 0;
  if (total > 0) {
    amount = window.scrollY / total;
  }
  progressBar.style.transform = "scaleX(" + amount + ")";
}

function updateHeroLinked() {
  let p = window.scrollY / hero.offsetHeight;
  if (p > 1) {
    p = 1;
  }
  if (p < 0) {
    p = 0;
  }
  let fade = 1 - p * 1.1;
  if (fade < 0) {
    fade = 0;
  }
  heroInner.style.opacity = String(fade);
  heroInner.style.translate = "0 " + (p * 70).toFixed(1) + "px";
  const hintProgress = p / 0.18;
  scrollHint.style.opacity = String(Math.max(0, 1 - hintProgress));
  scrollHint.style.visibility = p >= 0.18 ? "hidden" : "visivel";
  scrollHint.style.pointerEvents = p >= 0.18 ? "none" : "";
}

function updateActiveLink() {
  let currentId = "inicio";
  let i = 0;
  while (i < sectionIds.length) {
    if (document.getElementById(sectionIds[i]).getBoundingClientRect().top <= window.innerHeight * 0.35) {
      currentId = sectionIds[i];
    }
    i = i + 1;
  }
  i = 0;
  while (i < navLinks.length) {
    if (navLinks[i].getAttribute("data-goto") === currentId) {
      navLinks[i].classList.add("ativo");
    } else {
      navLinks[i].classList.remove("ativo");
    }
    i = i + 1;
  }
}

function updateScrollEffects() {
  scrollTicking = false;
  updateProgressBar();
  updateHeroLinked();
  updateActiveLink();
}

function onScroll() {
  if (scrollTicking === false) {
    scrollTicking = true;
    requestAnimationFrame(updateScrollEffects);
  }
}

function onResize() {
  updateScrollEffects();
}

function setupReviewsWidget() {
  const embed = document.querySelector("[data-trustindex-src]");
  if (embed === null) {
    return;
  }
  const loadWidget = function () {
    const script = document.createElement("script");
    script.async = true;
    script.src = embed.getAttribute("data-trustindex-src");
    embed.appendChild(script);
    embed.removeAttribute("data-trustindex-src");
  };
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          loadWidget();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(embed);
  } else {
    loadWidget();
  }
}

/* ---------- Inclinacao 3D dos cartoes ao mover o mouse ---------- */
let tiltTarget = null;

function resetTilt(element) {
  element.style.setProperty("--rx", "0deg");
  element.style.setProperty("--ry", "0deg");
}

function onTiltMove(event) {
  if (event.pointerType !== "mouse") {
    return;
  }
  const element = findAncestorWith(event.target, "data-tilt");
  if (element !== tiltTarget) {
    if (tiltTarget !== null) {
      resetTilt(tiltTarget);
    }
    tiltTarget = element;
  }
  if (element === null) {
    return;
  }
  const maxTilt = parseFloat(element.getAttribute("data-tilt"));
  const rect = element.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  element.style.setProperty("--ry", (x * maxTilt * 2).toFixed(2) + "deg");
  element.style.setProperty("--rx", (-y * maxTilt * 2).toFixed(2) + "deg");
}

function onPageLeave() {
  if (tiltTarget !== null) {
    resetTilt(tiltTarget);
    tiltTarget = null;
  }
}

/* ---------- Formulario de contato enviado pelo FormSubmit ---------- */
const subjectKeys = ["form.subject.1", "form.subject.2", "form.subject.3", "form.subject.4"];

function fillSubjects() {
  const select = document.getElementById("campo-assunto");
  const selected = select.selectedIndex;
  select.innerHTML = "";
  let i = 0;
  while (i < subjectKeys.length) {
    const option = document.createElement("option");
    option.value = getText(subjectKeys[i], "pt"); // the email always arrives in Portuguese
    option.textContent = getText(subjectKeys[i]);
    select.appendChild(option);
    i = i + 1;
  }
  if (selected > 0) {
    select.selectedIndex = selected;
  }
}

function onFormSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("campo-nome").value.trim();
  const email = document.getElementById("campo-email").value.trim();
  const message = document.getElementById("campo-mensagem").value.trim();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const status = document.getElementById("estado-formulario");
  let errorKey = "";
  if (name.length < 2) {
    errorKey = "form.erro.name";
  } else if (email.indexOf("@") < 1 || email.lastIndexOf(".") < email.indexOf("@") + 2 || email.lastIndexOf(".") > email.length - 2) {
    errorKey = "form.erro.email";
  } else if (message.length < 5) {
    errorKey = "form.erro.message";
  }
  if (errorKey !== "") {
    status.textContent = getText(errorKey);
    status.className = "estado-formulario erro";
  } else {
    status.textContent = getText("form.sending");
    status.className = "estado-formulario";
    submitButton.disabled = true;
    fetch(form.action, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    })
      .then(function (response) {
        return response.json().then(function (result) {
          if (!response.ok || (result.success !== true && result.success !== "true")) {
            throw new Error("FormSubmit rejected the submission.");
          }
          status.textContent = getText("form.success");
          status.className = "estado-formulario";
          form.reset();
          fillSubjects();
        });
      })
      .catch(function () {
        status.textContent = getText("form.erro.submit");
        status.className = "estado-formulario erro";
      })
      .finally(function () {
        submitButton.disabled = false;
      });
  }
}

/* ---------- Trajetoria: um card por vez, com botoes ---------- */
function updateJourneyControls() {
  const last = journeyIndex === journeyCards.length - 1;
  journeyPrev.disabled = journeyIndex === 0;
  journeyCount.textContent = journeyIndex + 1 + " / " + journeyCards.length;
  journeyNextLabel.textContent = getText(last ? "journey.restart" : "journey.next");
  journeyNext.classList.toggle("ultimo", last);
}

function showJourney(index) {
  journeyIndex = index;
  let i = 0;
  while (i < journeyCards.length) {
    journeyCards[i].classList.toggle("ativo", i === index);
    i = i + 1;
  }
  updateJourneyControls();
}

function onJourneyNext() {
  showJourney(journeyIndex === journeyCards.length - 1 ? 0 : journeyIndex + 1);
}

function onJourneyPrev() {
  if (journeyIndex > 0) {
    showJourney(journeyIndex - 1);
  }
}

/* ---------- Botao de voltar ao topo (aparece quando o rodape entra na tela) ---------- */
function onTopClick() {
  scrollToSection("inicio");
}

function setupBackToTop() {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(function (entries) {
      topButton.classList.toggle("visivel", entries[0].isIntersecting);
    });
    observer.observe(footer);
  } else {
    topButton.classList.add("visivel");
  }
}

/* ---------- Teclado: tecla Enter na tela de boas-vindas ---------- */
function onKeyDown(event) {
  switch (event.key) {
    case "Enter":
    case " ":
      if (welcomeActive && document.activeElement !== welcomeButton) {
        event.preventDefault();
        welcomeButton.click();
      }
      break;
    default:
      break;
  }
}

/* ---------- Tela de boas-vindas ---------- */
function onWelcomeButtonMove(event) {
  // the button leans toward the mouse
  const rect = welcomeButton.getBoundingClientRect();
  welcomeButton.style.setProperty("--bx", ((event.clientX - rect.left - rect.width / 2) * 0.25).toFixed(1) + "px");
  welcomeButton.style.setProperty("--by", ((event.clientY - rect.top - rect.height / 2) * 0.25).toFixed(1) + "px");
}

function onWelcomeButtonLeave() {
  welcomeButton.style.setProperty("--bx", "0px");
  welcomeButton.style.setProperty("--by", "0px");
}

function onWelcomeContinue() {
  if (welcomeActive === false) {
    return;
  }
  welcomeActive = false;
  site.inert = false;
  document.body.classList.remove("na-tela-boas-vindas");
  welcome.classList.add("saindo");
  updateScrollEffects();
}

function onWelcomeEnd(event) {
  if (event.animationName === "welcome-out") {
    welcome.remove();
  }
}

/* ---------- Cursor personalizado para mouse ---------- */
const ARROW = "M6 6L28 14L18 18L14 28Z";
const TIP = 6; // the tip of the arrow is the click point
const SMOOTHING = 0.5; // base follow speed per frame: lower = smoother, higher = more responsive
let cursor = null;
let cursorTargetX = 0;
let cursorTargetY = 0;
let cursorX = 0;
let cursorY = 0;
let cursorRendering = false;

function isInteractive(node) {
  do {
    if (node.nodeType === 1) {
      switch (node.tagName) {
        case "A":
        case "BUTTON":
          return true;
        default:
          break;
      }
      if (node.hasAttribute("data-tilt") || node.hasAttribute("tabindex") || node.classList.contains("star") || node.classList.contains("letra")) {
        return true;
      }
    }
    node = node.parentNode;
  } while (node !== null && node !== document);
  return false;
}

function cursorRender() {
  const dx = cursorTargetX - cursorX;
  const dy = cursorTargetY - cursorY;
  let follow = SMOOTHING + Math.sqrt(dx * dx + dy * dy) / 120; // fast movements catch up almost instantly
  if (follow > 1) {
    follow = 1;
  }
  cursorX = cursorX + dx * follow;
  cursorY = cursorY + dy * follow;
  cursor.style.transform = "translate3d(" + (cursorX - TIP) + "px, " + (cursorY - TIP) + "px, 0)";
  if (Math.abs(cursorTargetX - cursorX) > 0.1 || Math.abs(cursorTargetY - cursorY) > 0.1) {
    requestAnimationFrame(cursorRender);
  } else {
    cursorRendering = false;
  }
}

function onCursorMove(event) {
  if (event.pointerType !== "mouse") {
    return;
  }
  if (cursor.classList.contains("visivel") === false) {
    cursorX = event.clientX;
    cursorY = event.clientY;
    cursor.classList.add("visivel");
  }
  cursorTargetX = event.clientX;
  cursorTargetY = event.clientY;
  if (cursorRendering === false) {
    cursorRendering = true;
    requestAnimationFrame(cursorRender);
  }
}

function onCursorOver(event) {
  if (isInteractive(event.target)) {
    cursor.classList.add("com-ponteiro-sobre");
  } else {
    cursor.classList.remove("com-ponteiro-sobre");
  }
}

function onCursorDown(event) {
  if (event.pointerType !== "mouse") {
    return;
  }
  cursor.classList.add("pressionado");
}

function onCursorUp() {
  cursor.classList.remove("pressionado");
}

function onCursorHide() {
  cursor.classList.remove("visivel");
}

function startCursor() {
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches === false) {
    return;
  }
  cursor = document.createElement("div");
  cursor.className = "ponteiro";
  cursor.innerHTML = '<svg class="seta-ponteiro" viewBox="0 0 32 32"><path class="contorno" d="' + ARROW + '"/><path class="corpo-vetor" d="' + ARROW + '"/></svg>';
  document.body.appendChild(cursor);
  root.classList.add("ponteiro-personalizado");
  document.addEventListener("pointermove", onCursorMove);
  document.addEventListener("pointerover", onCursorOver);
  document.addEventListener("pointerdown", onCursorDown);
  document.addEventListener("pointerup", onCursorUp);
  document.addEventListener("pointercancel", onCursorUp);
  root.addEventListener("mouseleave", onCursorHide);
}

/* ---------- Inicializacao: eventos e recursos da pagina ---------- */
if (navigator.language.indexOf("pt") === 0) {
  language = "pt";
} else {
  language = "en";
}
site.inert = true; // nothing behind the welcome screen is reachable
document.getElementById("ano-atual").textContent = new Date().getFullYear();

listen(document.querySelectorAll("[data-goto]"), "click", onGotoClick);
document.getElementById("formulario-contato").addEventListener("submit", onFormSubmit);
journeyNext.addEventListener("click", onJourneyNext);
journeyPrev.addEventListener("click", onJourneyPrev);
topButton.addEventListener("click", onTopClick);
listen(earthIcons, "animationend", onEarthEnd);
listen(document.querySelectorAll("#alternar-idioma, #idioma-boas-vindas"), "click", onLanguageClick);
welcome.addEventListener("animationend", onWelcomeEnd);
welcomeButton.addEventListener("pointermove", onWelcomeButtonMove);
welcomeButton.addEventListener("pointerleave", onWelcomeButtonLeave);
welcomeButton.addEventListener("click", onWelcomeContinue);
document.addEventListener("pointermove", onTiltMove);
document.addEventListener("keydown", onKeyDown, true);
document.addEventListener("wheel", stopSmooth, { passive: true, capture: true });
document.addEventListener("touchstart", stopSmooth);
document.addEventListener("wheel", preventBrowserZoom, { passive: false, capture: true });
document.addEventListener("keydown", preventKeyboardZoom, true);
document.addEventListener("touchstart", preventTouchZoom, { passive: false, capture: true });
document.addEventListener("touchmove", preventTouchZoom, { passive: false, capture: true });
document.addEventListener("gesturestart", preventGestureZoom, { passive: false, capture: true });
document.addEventListener("gesturechange", preventGestureZoom, { passive: false, capture: true });
root.addEventListener("mouseleave", onPageLeave);
window.addEventListener("scroll", onScroll);
window.addEventListener("resize", onResize);
window.addEventListener("load", onResize);

startCursor();
applyTexts();
setupReviewsWidget();
setupBackToTop();
updateScrollEffects();
welcomeButton.focus({ preventScroll: true });
