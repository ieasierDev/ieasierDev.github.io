const API_URL = "http://localhost:8787";

async function get(path) {
  const response = await fetch(path);
  if (!response.ok) throw Error(`Falha ao carregar ${path}`);
  return response.json();
}

const byId = (id) => document.getElementById(id);
byId("year").textContent = new Date().getFullYear();

const menu = byId("menu");
const nav = byId("nav");
menu.onclick = () => {
  const isOpen = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(isOpen));
};
nav.querySelectorAll("a").forEach((link) => {
  link.onclick = () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  };
});

const donateDialog = byId("donateDialog");
byId("donateOpen").onclick = () => donateDialog.showModal();
byId("donateClose").onclick = () => donateDialog.close();
donateDialog.onclick = (event) => {
  if (event.target === donateDialog) donateDialog.close();
};

(async () => {
  try {
    const profile = await get("data/profile.json");
    document.title = `${profile.name} — Portfólio`;
    document.querySelector(".brand").innerHTML =
      `${profile.name.split(" ")[0].toUpperCase()}<span>.</span>${profile.name.split(" ").slice(1).join("").toUpperCase()}`;
    byId("description").textContent = profile.description;
    byId("avatar").textContent = profile.initials;
    byId("role").textContent = profile.role;
    byId("location").textContent = profile.location;
    byId("aboutText").textContent = profile.about;
    byId("specialty").textContent = profile.specialty;
    byId("focus").textContent = profile.focus;
    byId("resumeContent").innerHTML = profile.experience.map((item) => `
      <article class="card">
        <h3>${item.title}</h3>
        <p><b>${item.company}</b><br>${item.period}</p>
        <p>${item.description}</p>
      </article>
    `).join("");
    byId("educationContent").innerHTML = profile.education.map((item) => `
      <article class="card">
        <h3>${item.title}</h3>
        <p>${item.institution}</p>
        <small>${item.period}</small>
      </article>
    `).join("");
    byId("skillsContent").innerHTML = profile.skills
      .map((skill) => `<span class="tag">${skill}</span>`)
      .join("");
  } catch (error) {
    console.error(error);
  }
})();

(async () => {
  try {
    const gallery = await get("data/gallery.json");
    byId("galleryGrid").innerHTML = gallery
      .map((item) => `<img src="${item.image}" alt="${item.alt || ""}" loading="lazy">`)
      .join("");
  } catch (error) {
    console.error(error);
  }
})();

(async () => {
  try {
    const social = await get("data/social.json");
    byId("socialGrid").innerHTML = social
      .map((item) => `<a class="socialCard" href="${item.url}" target="_blank" rel="noopener">${item.name}<span>${item.handle}</span></a>`)
      .join("");
  } catch (error) {
    console.error(error);
  }
})();

let amount = 10;
document.querySelectorAll("[data-amount]").forEach((button) => {
  button.onclick = () => {
    amount = Number(button.dataset.amount);
    document.querySelectorAll("[data-amount]").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
  };
});

byId("custom").oninput = (event) => {
  if (event.target.value) {
    amount = Number(event.target.value);
    document.querySelectorAll("[data-amount]").forEach((button) => button.classList.remove("selected"));
  } else {
    amount = 10;
    document.querySelectorAll("[data-amount]").forEach((button) => {
      button.classList.toggle("selected", button.dataset.amount === "10");
    });
  }
};

byId("donateBtn").onclick = async () => {
  const status = byId("status");
  if (!amount || amount < 1 || amount > 10000) {
    status.textContent = "Informe um valor entre R$ 1 e R$ 10.000.";
    return;
  }

  status.textContent = "Preparando pagamento...";
  try {
    const response = await fetch(`${API_URL}/api/donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: "BRL" }),
    });
    const data = await response.json();
    if (!response.ok) throw Error(data.error || "Erro ao iniciar doação.");
    status.textContent = data.checkoutUrl
      ? "Redirecionando..."
      : "Sessão criada em modo DEMO. Configure um gateway real.";
    if (data.checkoutUrl) location.href = data.checkoutUrl;
  } catch (error) {
    status.textContent = error.message || "Erro ao iniciar doação.";
  }
};
