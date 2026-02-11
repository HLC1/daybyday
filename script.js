const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const cart = [];
const cartBtn = $("#cartBtn");
const cartModal = $("#cartModal");
const closeCart = $("#closeCart");
const cartItems = $("#cartItems");
const cartTotal = $("#cartTotal");
const cartCount = $("#cartCount");

const drawer = $("#drawer");
const menuBtn = $("#menuBtn");
const drawerClose = $("#drawerClose");

$("#year").textContent = new Date().getFullYear();

// Mobile menu
menuBtn?.addEventListener("click", () => {
    drawer.classList.add("show");
    drawer.setAttribute("aria-hidden", "false");
});
drawerClose?.addEventListener("click", () => {
    drawer.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
});
drawer?.addEventListener("click", (e) => {
    if (e.target === drawer) {
        drawer.classList.remove("show");
        drawer.setAttribute("aria-hidden", "true");
    }
});
$$(".drawerLink").forEach(a => a.addEventListener("click", () => {
    drawer.classList.remove("show");
    drawer.setAttribute("aria-hidden", "true");
}));

// Cart modal
function openCart() {
    cartModal.classList.add("show");
    cartModal.setAttribute("aria-hidden", "false");
    renderCart();
}
function closeCartModal() {
    cartModal.classList.remove("show");
    cartModal.setAttribute("aria-hidden", "true");
}
cartBtn?.addEventListener("click", openCart);
closeCart?.addEventListener("click", closeCartModal);
cartModal?.addEventListener("click", (e) => {
    if (e.target === cartModal) closeCartModal();
});

// Add to cart
$$("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
        const name = btn.getAttribute("data-add");
        const price = Number(btn.getAttribute("data-price") || 0);

        const sizeSel = btn.getAttribute("data-size");
        const colorSel = btn.getAttribute("data-color");
        const size = sizeSel ? $(sizeSel)?.value : "";
        const color = colorSel ? $(colorSel)?.value : "";

        cart.push({ id: crypto.randomUUID(), name, price, size, color });
        cartCount.textContent = cart.length;
        openCart();
    });
});

function money(n) { return `$${n.toFixed(2)}`; }

function renderCart() {
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="cartItem"><strong>Your cart is empty.</strong><div class="muted">Add something from the drop.</div></div>`;
        cartTotal.textContent = "$0.00";
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price;

        const div = document.createElement("div");
        div.className = "cartItem";
        div.innerHTML = `
      <div class="row">
        <strong>${escapeHtml(item.name)}</strong>
        <span class="mono">${money(item.price)}</span>
      </div>
      <div class="muted">Size: ${escapeHtml(item.size || "-")} • Color: ${escapeHtml(item.color || "-")}</div>
      <button class="removeBtn" type="button">Remove</button>
    `;
        div.querySelector(".removeBtn").addEventListener("click", () => {
            const idx = cart.findIndex(x => x.id === item.id);
            if (idx >= 0) cart.splice(idx, 1);
            cartCount.textContent = cart.length;
            renderCart();
        });

        cartItems.appendChild(div);
    });

    cartTotal.textContent = money(total);
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[m]));
}

// Newsletter demo
$("#notifyBtn")?.addEventListener("click", () => {
    const email = $("#email").value.trim();
    const msg = $("#notifyMsg");
    if (!email || !email.includes("@")) {
        msg.textContent = "Enter a real email to get notified.";
        return;
    }
    msg.textContent = "You’re on the list. Day by day.";
    $("#email").value = "";
});

// Checkout demo button
$("#checkoutBtn")?.addEventListener("click", () => {
    alert("Checkout is a demo right now. Tell me if you want Shopify or Stripe and I’ll wire it up.");
});
/* ===== SCROLL REVEAL ===== */
const reveals = document.querySelectorAll(".section, .card, .heroCopy");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("active");
    });
}, { threshold: 0.15 });

reveals.forEach(el => {
    el.classList.add("reveal");
    observer.observe(el);
});

/* ===== FLOATING BATS SPAWNER ===== */
setInterval(() => {
    const bat = document.createElement("div");
    bat.className = "bat";
    bat.style.top = Math.random() * 100 + "vh";
    bat.style.animationDuration = (8 + Math.random() * 8) + "s";
    document.body.appendChild(bat);

    setTimeout(() => bat.remove(), 16000);
}, 4000);

/* ===== COUNTDOWN TIMER ===== */
function startCountdownColoradoTop(dateStr) {
    const el = document.getElementById("countdownTop");
    if (!el) return;

    const target = new Date(
        new Date(dateStr).toLocaleString("en-US", {
            timeZone: "America/Denver"
        })
    ).getTime();

    setInterval(() => {
        const now = new Date(
            new Date().toLocaleString("en-US", {
                timeZone: "America/Denver"
            })
        ).getTime();

        const diff = target - now;

        if (diff <= 0) {
            el.innerText = "LIVE";
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor(diff / (1000 * 60 * 60)) % 24;
        const m = Math.floor(diff / (1000 * 60)) % 60;

        el.innerText = `${d}D ${h}H ${m}M`;
    }, 1000);
}

startCountdownColoradoTop("2026-02-08T18:00:00");



/* ===== LIMITED STOCK ===== */




updateStock();

/* ===== IMAGE ZOOM MODAL ===== */
const modal = document.createElement("div");
modal.className = "imgModal";
modal.innerHTML = "<img />";
document.body.appendChild(modal);

document.querySelectorAll(".card img").forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
        modal.querySelector("img").src = img.src;
        modal.classList.add("show");
    });
});

modal.addEventListener("click", () => modal.classList.remove("show"));
// Front/Back swapper for product cards
document.querySelectorAll(".cardMedia").forEach(media => {
    const img = media.querySelector(".swapImg");
    const btns = media.querySelectorAll(".swapBtn");
    if (!img || btns.length === 0) return;

    const front = img.getAttribute("data-front");
    const back = img.getAttribute("data-back");
    if (!front || !back) return;

    btns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const side = btn.getAttribute("data-side");
            img.src = (side === "back") ? back : front;

            btns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
});
window.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".cardMedia").forEach(media => {
        const img = media.querySelector(".swapImg");
        const btns = media.querySelectorAll(".swapBtn");
        if (!img || btns.length === 0) return;

        const front = img.getAttribute("data-front");
        const back = img.getAttribute("data-back");
        if (!front || !back) return;

        btns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const side = btn.getAttribute("data-side");
                img.src = (side === "back") ? back : front;

                btns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
            });
        });
    });
});
/* ===== Render Admin Products into Shop ===== */
(() => {
    const PRODUCTS_KEY = "DAYBYDAY_PRODUCTS";

    function loadProducts() {
        try { return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"); }
        catch { return []; }
    }

    function escapeHtml(s) {
        return String(s ?? "").replace(/[&<>"']/g, (c) =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
        );
    }

    function renderShop() {
        const grid = document.getElementById("shopGrid");
        if (!grid) return;

        const products = loadProducts().filter(p => p.status !== "hidden");

        // If none in admin yet, don't wipe your shop (optional):
        if (products.length === 0) {
            grid.innerHTML = `<p class="muted">No products added yet. Add them in admin.html</p>`;
            return;
        }

        grid.innerHTML = products.map((p, i) => {
            const id = p.id || `p${i}`;
            const sizeId = `${id}_size`;
            const colorId = `${id}_color`;

            const title = escapeHtml(p.title);
            const desc = escapeHtml(p.desc);
            const badge = escapeHtml(p.badge || "");
            const price = Number(p.price || 0);

            const imgFront = escapeHtml(p.imgFront);
            const imgBack = escapeHtml(p.imgBack);

            // default image = back (like your example). change to imgFront if you want.
            const imgStart = imgBack || imgFront;

            // "coming soon" card style
            const comingSoon = p.status === "coming_soon";

            return `
        <article class="card product">
          <div class="cardMedia">
            <img
              class="swapImg"
              src="${imgStart}"
              data-front="${imgFront}"
              data-back="${imgBack}"
              alt="${title}"
              loading="lazy"
            >
            ${badge ? `<div class="stamp">${badge}</div>` : ``}

            ${comingSoon ? `
              <div class="comingOverlay">
                <div class="comingBox">
                  <div class="comingTitle">Coming Soon</div>
                  <div class="muted tiny">Drop soon — get notified.</div>
                </div>
              </div>
            ` : ``}
          </div>

          <div class="cardBody">
            <div class="row">
              <h3>${title}</h3>
              <span class="price">$${price}</span>
            </div>
            <p class="muted">${desc}</p>

            <div class="options">
              <label>
                Size
                <select id="${sizeId}">
                  <option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option>
                </select>
              </label>
              <label>
                Color
                <select id="${colorId}">
                  <option>White</option><option>Black</option>
                </select>
              </label>
            </div>

            ${comingSoon ? `
              <button class="btn ghost full" type="button">Get notified</button>
            ` : `
              <button
                class="btn primary full"
                data-add="${title}"
                data-price="${price}"
                data-size="#${sizeId}"
                data-color="#${colorId}"
              >Add to Cart</button>
            `}
          </div>
        </article>
      `;
        }).join("");

        // Optional: make front/back swap by clicking the image (simple + reliable)
        document.querySelectorAll("#shopGrid .swapImg").forEach(img => {
            img.style.cursor = "pointer";
            img.addEventListener("click", () => {
                const front = img.getAttribute("data-front");
                const back = img.getAttribute("data-back");
                if (!front || !back) return;

                const showingBack = img.src.includes(back.split("/").pop());
                img.src = showingBack ? front : back;
            });
        });
    }

    window.addEventListener("DOMContentLoaded", renderShop);
})();
window.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("shopGrid");
    if (!grid) return;

    const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

    try {
        // cache-bust so GitHub Pages updates show faster
        const res = await fetch(`products.json?v=${Date.now()}`);
        if (!res.ok) throw new Error("Failed to load products.json");
        let products = await res.json();

        products = (products || []).filter(p => p.status !== "hidden");

        if (products.length === 0) {
            grid.innerHTML = `<p class="muted">No products yet.</p>`;
            return;
        }

        grid.innerHTML = products.map((p, i) => {
            const id = esc(p.id || `p${i}`);
            const title = esc(p.title);
            const desc = esc(p.desc || "");
            const badge = esc(p.badge || "");
            const price = Number(p.price || 0);

            const stock = Number.isFinite(p.stock) ? p.stock : 0;
            const soldOut = stock <= 0;
            const low = stock > 0 && stock <= 5;

            const front = esc(p.imgFront || "");
            const back = esc(p.imgBack || "");

            const sizeId = `${id}_size`;
            const colorId = `${id}_color`;

            return `
        <article class="card product">
          <div class="cardMedia">
            <img class="swapImg"
              src="${back || front}"
              data-front="${front}"
              data-back="${back}"
              alt="${title}"
              loading="lazy"
            >
            ${badge ? `<div class="stamp">${badge}</div>` : ``}

            <div class="swapToggle">
              <button type="button" class="swapBtn active" data-side="back">BACK</button>
              <button type="button" class="swapBtn" data-side="front">FRONT</button>
            </div>
          </div>

          <div class="cardBody">
            <div class="row">
              <h3>${title}</h3>
              <span class="price">$${price}</span>
            </div>

            <p class="muted">${desc}</p>

            <div class="stockPill ${soldOut ? "sold" : (low ? "low" : "")}">
              ${soldOut ? "SOLD OUT" : (low ? `Only ${stock} left` : `${stock} in stock`)}
            </div>

            <div class="options">
              <label>Size
                <select id="${sizeId}">
                  <option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option>
                </select>
              </label>
              <label>Color
                <select id="${colorId}">
                  <option>White</option><option>Black</option>
                </select>
              </label>
            </div>

            ${soldOut
                    ? `<button class="btn ghost full" type="button" disabled>Sold Out</button>`
                    : `<button class="btn primary full"
                     data-add="${title}"
                     data-price="${price}"
                     data-size="#${sizeId}"
                     data-color="#${colorId}">
                     Add to Cart
                   </button>`
                }
          </div>
        </article>
      `;
        }).join("");

        // Make FRONT/BACK buttons swap the image
        document.querySelectorAll("#shopGrid .cardMedia").forEach(media => {
            const img = media.querySelector(".swapImg");
            const btns = media.querySelectorAll(".swapBtn");
            if (!img || btns.length === 0) return;

            const front = img.getAttribute("data-front");
            const back = img.getAttribute("data-back");

            btns.forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const side = btn.getAttribute("data-side");
                    img.src = (side === "front") ? front : back;

                    btns.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                }, true);
            });
        });

    } catch (err) {
        console.error(err);
        grid.innerHTML = `<p class="muted">Couldn’t load products. Check products.json path.</p>`;
    }
});






