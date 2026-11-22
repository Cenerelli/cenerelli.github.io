const sectionIds = ["inicio", "sobre", "trajetoria", "competencias", "portfolio", "avaliacoes", "contato"];
const roleKeys = ["welcome.role1", "welcome.role2"];

let language = "pt";
let welcomeActive = true;
let isSwitchingLanguage = false;

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
const githubProjects = document.getElementById("projetos-github");
const detailDialog = document.getElementById("modal-detalhe-mobile");
const detailDialogTitle = document.getElementById("titulo-detalhe-mobile");
const detailDialogText = document.getElementById("texto-detalhe-mobile");
const detailDialogClose = document.getElementById("fechar-detalhe-mobile");
const mobileScreen = window.matchMedia("(max-width: 600px)");
let journeyIndex = 0;

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
    earthIcons[i].getBoundingClientRect(); 
    earthIcons[i].classList.add("girando");
    i = i + 1;
  }
  root.classList.add("trocando-idioma"); 
  if (language === "pt") {
    setTimeout(finishLanguageChange, 240, "en");
  } else {
    setTimeout(finishLanguageChange, 240, "pt");
  }
}

function onEarthEnd(event) {
  event.currentTarget.classList.remove("girando");
}

const typers = [
  [document.getElementById("funcao-digitada-boas-vindas"), 0, 0, "typing", 0],
  [document.getElementById("funcao-digitada-inicio"), 0, 0, "typing", 0],
];

function stepTyper(n, runId) {
  const typer = typers[n];
  if (runId !== typer[4]) {
    return;
  }
  if (n === 0 && welcomeActive === false) {
    return;
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
    eased = 4 * progress * progress * progress;
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
  smoothing = false;
}

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
  updateBackToTop();
}

function onScroll() {
  if (scrollTicking === false) {
    scrollTicking = true;
    requestAnimationFrame(updateScrollEffects);
  }
}

function onResize() {
  updateScrollEffects();
  updateMobileDetailTriggers();
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

function showGithubProjectsMessage(key) {
  const message = document.createElement("p");
  message.className = "estado-projetos";
  message.setAttribute("data-i18n", key);
  message.textContent = getText(key);
  githubProjects.append(message);
}

function getGithubProjectIcon(projectName) {
  const icons = {
    "cenerelli": "icone-github",
    "pong-2-players": "icone-pingpong",
    "about-me-html-css": "icone-primeiro-projeto",
    "cenerelli.github.io": "icone-site",
  };
  return icons[projectName] || "icone-codigo";
}

function createGithubProjectCard(project) {
  const card = document.createElement("a");
  card.className = "cartao-link grande";
  if (project.name === "pong-2-players") {
    card.classList.add("projeto-pong");
  }
  if (project.name === "about-me-html-css") {
    card.classList.add("projeto-primeiro");
  }
  card.href = project.html_url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";

  const iconBlock = document.createElement("span");
  iconBlock.className = "bloco-icone";
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("aria-hidden", "true");
  const iconUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
  iconUse.setAttribute("href", "assets/icones.svg?v=20261122-3#" + getGithubProjectIcon(project.name));
  icon.append(iconUse);
  iconBlock.append(icon);

  const title = document.createElement("h3");
  if (project.name === "cenerelli.github.io") {
    title.setAttribute("data-i18n", "projects.landing.title");
    title.textContent = getText("projects.landing.title");
  } else {
    title.textContent = project.name;
  }

  const description = document.createElement("p");
  if (project.name === "cenerelli.github.io") {
    description.setAttribute("data-i18n", "projects.landing.description");
    description.textContent = getText("projects.landing.description");
  } else if (project.name === "about-me-html-css") {
    description.setAttribute("data-i18n", "projects.about.description");
    description.textContent = getText("projects.about.description");
  } else if (project.description) {
    description.textContent = project.description;
  } else {
    description.setAttribute("data-i18n", "projects.noDescription");
    description.textContent = getText("projects.noDescription");
  }

  card.append(iconBlock, title, description);
  return card;
}

async function loadGithubProjects() {
  if (!githubProjects) {
    return;
  }

  try {
    const response = await fetch("https://api.github.com/users/Cenerelli/repos?sort=updated&per_page=100");
    if (!response.ok) {
      throw new Error("GitHub API request failed");
    }

    const repositories = await response.json();
    const projects = repositories.filter(function (repository) {
      return !repository.fork && !repository.archived;
    }).slice(0, 6);

    if (projects.length === 0) {
      showGithubProjectsMessage("projects.empty");
      return;
    }

    githubProjects.replaceChildren(...projects.map(createGithubProjectCard));
  } catch (error) {
    showGithubProjectsMessage("projects.error");
  } finally {
    githubProjects.setAttribute("aria-busy", "false");
  }
}

function updateMobileDetailTriggers() {
  const detailCards = document.querySelectorAll(".linha-competencia");
  let i = 0;
  while (i < detailCards.length) {
    if (mobileScreen.matches) {
      detailCards[i].setAttribute("role", "button");
      detailCards[i].setAttribute("aria-haspopup", "dialog");
    } else {
      detailCards[i].removeAttribute("role");
      detailCards[i].removeAttribute("aria-haspopup");
    }
    i = i + 1;
  }
}

function openDetailDialog(card) {
  const title = card.querySelector(".cabecalho-competencia h3");
  const description = card.querySelector(".corpo-competencia");
  if (!title || !description) {
    return;
  }

  detailDialogTitle.textContent = title.textContent;
  detailDialogText.replaceChildren(description.cloneNode(true));
  detailDialog.showModal();
}

function onDetailCardClick(event) {
  if (!mobileScreen.matches) {
    return;
  }
  const card = event.target.closest(".linha-competencia");
  if (card) {
    openDetailDialog(card);
  }
}

function onDetailCardKeyDown(event) {
  if (!mobileScreen.matches || (event.key !== "Enter" && event.key !== " ")) {
    return;
  }
  const card = event.target.closest(".linha-competencia");
  if (card) {
    event.preventDefault();
    openDetailDialog(card);
  }
}

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

const subjectKeys = ["form.subject.1", "form.subject.2", "form.subject.3"];

function fillSubjects() {
  const select = document.getElementById("campo-assunto");
  const selected = select.selectedIndex;
  select.innerHTML = "";
  let i = 0;
  while (i < subjectKeys.length) {
    const option = document.createElement("option");
    option.value = getText(subjectKeys[i], "pt");
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

function onTopClick() {
  scrollToSection("inicio");
}

function setupBackToTop() {
  updateBackToTop();
}

function updateBackToTop() {
  const aboutTop = document.getElementById("sobre").getBoundingClientRect().top;
  const navigationBottom = navbar.getBoundingClientRect().bottom;
  topButton.classList.toggle("visivel", aboutTop <= navigationBottom);
}

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

function onWelcomeButtonMove(event) {
  if (event.pointerType !== "mouse") {
    return;
  }
  const rect = welcomeButton.getBoundingClientRect();
  welcomeButton.style.setProperty("--bx", ((event.clientX - rect.left - rect.width / 2) * 0.1).toFixed(1) + "px");
  welcomeButton.style.setProperty("--by", ((event.clientY - rect.top - rect.height / 2) * 0.1).toFixed(1) + "px");
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

const ARROW = "M6 6L28 14L18 18L14 28Z";
const TIP = 6;
const SMOOTHING = 0.5;
let cursor = null;
let cursorTargetX = 0;
let cursorTargetY = 0;
let cursorX = 0;
let cursorY = 0;
let cursorRendering = false;

function getCursorMode(node) {
  do {
    if (node.nodeType === 1) {
      if (node.isContentEditable || node.tagName === "TEXTAREA") {
        return "texto";
      }
      if (node.tagName === "INPUT") {
        const textInputTypes = ["email", "number", "password", "search", "tel", "text", "url"];
        if (textInputTypes.includes(node.type)) {
          return "texto";
        }
      }
      switch (node.tagName) {
        case "A":
        case "BUTTON":
        case "SELECT":
          return "hover";
        default:
          break;
      }
      if (node.hasAttribute("data-tilt") || node.hasAttribute("tabindex") || node.classList.contains("star") || node.classList.contains("letra") || node.classList.contains("palavra")) {
        return "hover";
      }
    }
    node = node.parentNode;
  } while (node !== null && node !== document);
  return "seta";
}

function cursorRender() {
  const dx = cursorTargetX - cursorX;
  const dy = cursorTargetY - cursorY;
  let follow = SMOOTHING + Math.sqrt(dx * dx + dy * dy) / 120;
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
  const mode = getCursorMode(event.target);
  cursor.classList.toggle("modo-hover", mode === "hover");
  cursor.classList.toggle("modo-texto", mode === "texto");
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
  cursor.innerHTML = '<svg class="icone-cursor cursor-seta" viewBox="0 0 32 32" aria-hidden="true"><path d="' + ARROW + '"/></svg><svg class="icone-cursor cursor-mao" viewBox="0 0 32 32" aria-hidden="true"><path d="M11 14V7a2 2 0 0 1 4 0v5-2a2 2 0 0 1 4 0v2-1a2 2 0 0 1 4 0v6c0 4-2.8 7-7 7h-1c-1.6 0-3-.8-4-2l-3.7-4.5a1.8 1.8 0 0 1 2.8-2.3L11 16z"/></svg><svg class="icone-cursor cursor-texto" viewBox="0 0 12 28" aria-hidden="true"><path d="M2 2h8M6 2v24M2 26h8"/></svg>';
  document.body.appendChild(cursor);
  root.classList.add("ponteiro-personalizado");
  document.addEventListener("pointermove", onCursorMove);
  document.addEventListener("pointerover", onCursorOver);
  document.addEventListener("pointerdown", onCursorDown);
  document.addEventListener("pointerup", onCursorUp);
  document.addEventListener("pointercancel", onCursorUp);
  root.addEventListener("mouseleave", onCursorHide);
}

if (navigator.language.indexOf("pt") === 0) {
  language = "pt";
} else {
  language = "en";
}
site.inert = true;
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
document.addEventListener("click", onDetailCardClick);
document.addEventListener("keydown", onDetailCardKeyDown);
detailDialogClose.addEventListener("click", function () {
  detailDialog.close();
});
detailDialog.addEventListener("click", function (event) {
  if (event.target === detailDialog) {
    detailDialog.close();
  }
});

startCursor();
applyTexts();
updateMobileDetailTriggers();
loadGithubProjects();
setupReviewsWidget();
setupBackToTop();
updateScrollEffects();
welcomeButton.focus({ preventScroll: true });
