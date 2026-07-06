const state = {
  data: null,
  selectedPackage: ""
};

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function renderHighlights(items) {
  const root = qs("#highlights");
  root.innerHTML = "";
  items.forEach((item) => {
    const card = createElement("article", "highlight");
    card.append(createElement("b", "", item.title));
    if (item.titleZh) card.append(createElement("b", "zh-title", item.titleZh));
    card.append(createElement("p", "", item.text));
    if (item.textZh) card.append(createElement("p", "zh", item.textZh));
    root.append(card);
  });
}

function setPackage(packageName) {
  state.selectedPackage = packageName;
  qs("#package-select").value = packageName;
  qs("#menu-package-select").value = packageName;
  renderPackageMenu(packageName);
}

function renderPackages(packages) {
  const root = qs("#package-list");
  const formSelect = qs("#package-select");
  const menuSelect = qs("#menu-package-select");
  root.innerHTML = "";
  formSelect.innerHTML = '<option value="">Select package / 选择配套</option>';
  menuSelect.innerHTML = "";

  packages.forEach((pkg) => {
    const card = createElement("article", "package-card");
    card.dataset.accent = pkg.accent || "soft";
    card.append(createElement("h3", "", pkg.name));
    if (pkg.nameZh) card.append(createElement("p", "package-zh", pkg.nameZh));

    const priceRow = createElement("div", "price-row");
    priceRow.append(createElement("strong", "", pkg.price));
    priceRow.append(createElement("span", "", pkg.pax));
    card.append(priceRow);

    card.append(createElement("p", "", pkg.rate));
    card.append(createElement("p", "", pkg.summary));
    if (pkg.summaryZh) card.append(createElement("p", "zh", pkg.summaryZh));

    const list = createElement("ul");
    pkg.includes.forEach((item) => list.append(createElement("li", "", item)));
    card.append(list);

    const button = createElement("button", "button package-pick", "Choose this package 选择这个配套");
    button.type = "button";
    button.addEventListener("click", () => {
      setPackage(pkg.name);
      qs("#menu").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    card.append(button);
    root.append(card);

    const label = `${pkg.name}${pkg.nameZh ? " / " + pkg.nameZh : ""} - ${pkg.price}`;
    const formOption = document.createElement("option");
    formOption.value = pkg.name;
    formOption.textContent = label;
    formSelect.append(formOption);

    const menuOption = document.createElement("option");
    menuOption.value = pkg.name;
    menuOption.textContent = label;
    menuSelect.append(menuOption);
  });

  formSelect.addEventListener("change", (event) => setPackage(event.target.value || packages[0].name));
  menuSelect.addEventListener("change", (event) => setPackage(event.target.value));
}

function updatePickState(sectionKey) {
  const group = qs(`[data-section-key="${sectionKey}"]`);
  if (!group) return;

  const limit = Number(group.dataset.pick || "0");
  const checked = qsa('input[name="menuChoice"]:checked', group);
  const checkboxes = qsa('input[name="menuChoice"]', group);
  const count = qs(".choice-count", group);

  if (count) {
    count.textContent = limit > 0 ? `${checked.length}/${limit}` : `${checked.length}`;
    count.classList.toggle("complete", limit > 0 && checked.length === limit);
  }

  if (limit <= 0) return;
  checkboxes.forEach((box) => {
    box.disabled = !box.checked && checked.length >= limit;
  });
}

function renderPackageMenu(packageName) {
  const root = qs("#menu-sections");
  const note = qs("#menu-package-note");
  const packageMenu = state.data.packageMenus?.[packageName];

  root.innerHTML = "";
  if (!packageMenu) {
    note.textContent = "Please select a package first. | 请先选择配套。";
    return;
  }

  note.textContent = packageMenu.note || "";

  packageMenu.sections.forEach((section, index) => {
    const details = document.createElement("details");
    details.dataset.sectionKey = section.key || `section-${index}`;
    details.dataset.pick = section.pick || 0;
    if (index < 3) details.open = true;

    const summary = document.createElement("summary");
    const titleWrap = createElement("strong", "summary-title");
    titleWrap.append(document.createTextNode(section.title));
    if (section.titleZh) titleWrap.append(createElement("small", "", section.titleZh));
    summary.append(titleWrap);

    const rule = createElement("span", "summary-rule");
    rule.append(createElement("span", "", section.note || ""));
    rule.append(createElement("b", "choice-count", "0"));
    summary.append(rule);
    details.append(summary);

    const list = createElement("ul", "menu-items selectable-menu");
    section.items.forEach((item, itemIndex) => {
      const listItem = document.createElement("li");
      const label = createElement("label", "menu-choice");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "menuChoice";
      checkbox.value = `${section.title}: ${item}`;
      checkbox.dataset.sectionKey = details.dataset.sectionKey;
      checkbox.id = `menu-${details.dataset.sectionKey}-${itemIndex}`;
      checkbox.addEventListener("change", () => updatePickState(details.dataset.sectionKey));
      label.append(checkbox);
      label.append(createElement("span", "", item));
      listItem.append(label);
      list.append(listItem);
    });
    details.append(list);
    root.append(details);
    updatePickState(details.dataset.sectionKey);
  });
}

function renderGallery(items) {
  const root = qs("#gallery-grid");
  root.innerHTML = "";

  items.forEach((item, index) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.alt;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";
    figure.append(image);
    root.append(figure);
  });
}

function renderTerms(terms) {
  const root = qs("#terms-list");
  root.innerHTML = "";
  terms.forEach((term) => root.append(createElement("li", "", term)));
}

function buildWhatsAppUrl(message) {
  const number = state.data.contact.mainWhatsApp;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function getSelectedMenuChoices() {
  return qsa('input[name="menuChoice"]:checked').map((input) => input.value);
}

function getSelectionProgress() {
  return qsa("[data-section-key]").map((section) => {
    const title = qs(".summary-title", section)?.childNodes[0]?.textContent || "";
    const limit = Number(section.dataset.pick || "0");
    const selected = qsa('input[name="menuChoice"]:checked', section).length;
    return `${title}: ${selected}/${limit}`;
  });
}

function wireWhatsApp() {
  const float = qs("#whatsapp-float");
  const defaultMessage = "Hi La Taste x 3 Yue, I would like to enquire about the buffet event menu. 你好，我想询问自助餐活动配套。";
  float.href = buildWhatsAppUrl(defaultMessage);

  qs("#enquiry-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selectedMenu = getSelectedMenuChoices();
    const progress = getSelectionProgress();
    const selectedPackage = form.get("package") || state.selectedPackage || "-";
    const message = [
      "Hi La Taste x 3 Yue, I would like to enquire about buffet catering.",
      "你好，我想询问自助餐活动配套。",
      "",
      `Name 姓名: ${form.get("name")}`,
      `Event date 活动日期: ${form.get("date")}`,
      `Pax 人数: ${form.get("pax")}`,
      `Package 配套: ${selectedPackage}`,
      "",
      "Menu selection progress / 菜单选择进度:",
      progress.length ? progress.map((item) => `- ${item}`).join("\n") : "- Not selected yet / 暂未选择",
      "",
      "Selected menu choices / 已选择菜单:",
      selectedMenu.length ? selectedMenu.map((item) => `- ${item}`).join("\n") : "- Not selected yet / 暂未选择",
      "",
      `Message 备注: ${form.get("message") || "-"}`
    ].join("\n");
    window.open(buildWhatsAppUrl(message), "_blank", "noopener");
  });
}

function render(data) {
  state.data = data;
  document.title = `${data.brand.name} ${data.brand.title}`;
  qs("#hero-image").src = data.brand.heroImage;
  qs("#hero-tagline").textContent = data.brand.tagline;
  qs("#hero-tagline-zh").textContent = data.brand.taglineZh || "";
  qs("#footer-contact").textContent = `${data.contact.mainBranch}: ${data.contact.mainPhone} · ${data.contact.secondBranch}: ${data.contact.secondPhone}`;

  renderHighlights(data.highlights);
  renderPackages(data.packages);
  setPackage(data.packages[0].name);
  renderGallery(data.gallery);
  renderTerms(data.terms);
  wireWhatsApp();
}

fetch("data/menu-data.json?v=package-menu-20260706")
  .then((response) => {
    if (!response.ok) throw new Error("Menu data could not be loaded.");
    return response.json();
  })
  .then(render)
  .catch((error) => {
    console.error(error);
    qs("main").insertAdjacentHTML(
      "afterbegin",
      '<section class="band"><h1>Menu data could not be loaded.</h1><p>Please open this site through a static server or upload it to Netlify / GitHub Pages.</p></section>'
    );
  });
