const packages = {
  coins: [
    {id:"c50", name:"50 Coins", price:20, icon:"🪙"},
    {id:"c200", name:"200 Coins", price:70, icon:"🪙"},
    {id:"c500", name:"500 Coins", price:150, icon:"🪙"},
    {id:"c1000", name:"1,000 Coins", price:280, icon:"🪙"}
  ],
  gems: [
    {id:"g100", name:"100 Gems", price:50, icon:"💎"},
    {id:"g250", name:"250 Gems", price:120, icon:"💎"},
    {id:"g500", name:"500 Gems", price:220, icon:"💎"},
    {id:"g1000", name:"1,000 Gems", price:400, icon:"💎"}
  ]
};

const grid = document.getElementById("packageGrid");
const select = document.getElementById("packageSelect");
const total = document.getElementById("total");
const tabs = document.querySelectorAll(".tab");
const pays = document.querySelectorAll(".pay");
let currentType = "coins";
let payment = "bKash";

function render(type) {
  currentType = type;
  const list = packages[type];
  grid.innerHTML = list.map(p => `
    <article class="package">
      <div class="pkg-icon">${p.icon}</div>
      <h3>${p.name}</h3>
      <div class="price">৳ ${p.price}</div>
      <button class="buy" data-id="${p.id}">Buy Now</button>
    </article>`).join("");

  select.innerHTML = '<option value="">Choose a package</option>' +
    list.map(p => `<option value="${p.id}">${p.name} — ৳${p.price}</option>`).join("");
  updateTotal();
}

function findPackage(id) {
  return [...packages.coins, ...packages.gems].find(p => p.id === id);
}

function updateTotal() {
  const p = findPackage(select.value);
  total.textContent = p ? `৳${p.price}` : "৳0";
}

tabs.forEach(tab => tab.addEventListener("click", () => {
  tabs.forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  render(tab.dataset.type);
}));

grid.addEventListener("click", e => {
  if (!e.target.classList.contains("buy")) return;
  select.value = e.target.dataset.id;
  updateTotal();
  document.querySelector(".order-card").scrollIntoView({behavior:"smooth", block:"center"});
});

select.addEventListener("change", updateTotal);

pays.forEach(btn => btn.addEventListener("click", () => {
  pays.forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  payment = btn.dataset.pay;
}));

const modal = document.getElementById("modal");
const orderText = document.getElementById("orderText");

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  const playerId = document.getElementById("playerId").value.trim();
  const p = findPackage(select.value);
  if (!playerId || !p) return;

  orderText.innerHTML =
    `<b>Player ID:</b> ${escapeHtml(playerId)}<br>
     <b>Package:</b> ${p.name}<br>
     <b>Payment:</b> ${payment}<br>
     <b>Total:</b> ৳${p.price}`;
  modal.classList.add("show");
});

document.getElementById("closeModal").addEventListener("click", () => modal.classList.remove("show"));
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("show"); });

document.getElementById("copyOrder").addEventListener("click", async () => {
  const text = orderText.innerText;
  try {
    await navigator.clipboard.writeText(text);
    document.getElementById("copyOrder").textContent = "Copied ✓";
    setTimeout(() => document.getElementById("copyOrder").textContent = "Copy Order Details", 1400);
  } catch {
    alert("Copy করা যায়নি; order details manually copy করুন।");
  }
});

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("menuBtn").addEventListener("click", () => {
  const nav = document.querySelector(".navbar nav");
  const visible = getComputedStyle(nav).display !== "none";
  nav.style.display = visible ? "none" : "flex";
  if (!visible) {
    nav.style.position = "absolute";
    nav.style.top = "65px";
    nav.style.left = "0";
    nav.style.right = "0";
    nav.style.padding = "18px 5%";
    nav.style.background = "#07111d";
    nav.style.flexDirection = "column";
  }
});

render("coins");
