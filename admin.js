// admin.js — DAY BY DAY admin (localStorage)

const REQUIRED_KEY = "hlc"; // <-- CHANGE THIS
const SESSION_KEY = "DAYBYDAY_ADMIN_SESSION";
const PRODUCTS_KEY = "DAYBYDAY_PRODUCTS";

const $ = (id) => document.getElementById(id);

function uid() { return "p_" + Math.random().toString(16).slice(2) + "_" + Date.now(); }

function loadProducts() {
    try { return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"); }
    catch { return []; }
}
function saveProducts(list) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
}

function setLoggedIn(v) {
    localStorage.setItem(SESSION_KEY, v ? "1" : "0");
}
function isLoggedIn() {
    return localStorage.getItem(SESSION_KEY) === "1";
}

function showDash() {
    $("loginCard").classList.add("hide");
    $("dash").classList.remove("hide");
}
function showLogin() {
    $("dash").classList.add("hide");
    $("loginCard").classList.remove("hide");
}

function resetForm() {
    $("formTitle").textContent = "Add Product";
    $("editId").value = "";
    $("title").value = "";
    $("price").value = "";
    $("stock").value = "";
    $("badge").value = "";
    $("desc").value = "";
    $("imgFront").value = "";
    $("imgBack").value = "";
    $("status").value = "live";
    $("sku").value = "";
    $("deleteBtn").classList.add("hide");
    $("saveMsg").textContent = "";
    updatePreviews();
}

function fillForm(p) {
    $("formTitle").textContent = "Edit Product";
    $("editId").value = p.id || "";
    $("title").value = p.title || "";
    $("price").value = String(p.price ?? "");
    $("stock").value = String(p.stock ?? "");
    $("badge").value = p.badge || "";
    $("desc").value = p.desc || "";
    $("imgFront").value = p.imgFront || "";
    $("imgBack").value = p.imgBack || "";
    $("status").value = p.status || "live";
    $("sku").value = p.sku || "";
    $("deleteBtn").classList.remove("hide");
    $("saveMsg").textContent = "";
    updatePreviews();
}

function escapeHtml(s) {
    return String(s ?? "").replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
}

function renderTable() {
    const tbody = $("prodTbody");
    const products = loadProducts();
    tbody.innerHTML = "";

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="muted">No products yet.</td></tr>`;
        return;
    }

    products.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>
        <div><strong>${escapeHtml(p.title || "")}</strong></div>
        <div class="tiny muted">${escapeHtml(p.badge || "")}</div>
        <div class="tiny muted">${escapeHtml(p.sku || "")}</div>
      </td>
      <td>${Number.isFinite(p.price) ? `$${Number(p.price).toFixed(2)}` : "-"}</td>
      <td>${Number.isFinite(p.stock) ? p.stock : "-"}</td>
      <td><span class="pillMini">${escapeHtml(p.status || "live")}</span></td>
      <td class="rowActions">
        <button class="btnA" type="button" data-edit="${escapeHtml(p.id)}">Edit</button>
      </td>
    `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll("[data-edit]").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-edit");
            const p = loadProducts().find(x => x.id === id);
            if (p) fillForm(p);
        });
    });
}

function updatePreviews() {
    const f = $("imgFront").value.trim();
    const b = $("imgBack").value.trim();

    const pf = $("prevFront");
    const pb = $("prevBack");

    pf.src = f || "";
    pb.src = b || "";

    pf.style.opacity = f ? "1" : ".35";
    pb.style.opacity = b ? "1" : ".35";
}

function parseNumber(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

window.addEventListener("DOMContentLoaded", () => {
    // login wiring
    $("loginBtn").addEventListener("click", () => {
        const key = $("adminKey").value.trim();
        if (key === REQUIRED_KEY) {
            setLoggedIn(true);
            $("loginMsg").textContent = "";
            showDash();
            renderTable();
            resetForm();
        } else {
            $("loginMsg").textContent = "Wrong key.";
        }
    });

    $("logoutBtn").addEventListener("click", () => {
        setLoggedIn(false);
        showLogin();
    });

    // previews
    $("imgFront").addEventListener("input", updatePreviews);
    $("imgBack").addEventListener("input", updatePreviews);

    // save
    $("saveBtn").addEventListener("click", () => {
        const products = loadProducts();
        const id = $("editId").value.trim();

        const p = {
            id: id || uid(),
            title: $("title").value.trim(),
            price: parseNumber($("price").value, 0),
            stock: Math.max(0, parseInt($("stock").value || "0", 10)),
            badge: $("badge").value.trim(),
            desc: $("desc").value.trim(),
            imgFront: $("imgFront").value.trim(),
            imgBack: $("imgBack").value.trim(),
            status: $("status").value,
            sku: $("sku").value.trim()
        };

        if (!p.title) {
            $("saveMsg").textContent = "Title is required.";
            return;
        }
        if (!p.imgFront || !p.imgBack) {
            $("saveMsg").textContent = "Add BOTH front and back image paths.";
            return;
        }

        const idx = products.findIndex(x => x.id === p.id);
        if (idx >= 0) products[idx] = p;
        else products.unshift(p);

        saveProducts(products);
        $("saveMsg").textContent = "Saved.";
        renderTable();
        resetForm();
    });

    // delete
    $("deleteBtn").addEventListener("click", () => {
        const id = $("editId").value.trim();
        if (!id) return;

        saveProducts(loadProducts().filter(p => p.id !== id));
        $("saveMsg").textContent = "Deleted.";
        renderTable();
        resetForm();
    });

    $("resetBtn").addEventListener("click", resetForm);

    // export
    $("exportBtn").addEventListener("click", async () => {
        const json = JSON.stringify(loadProducts(), null, 2);
        try {
            await navigator.clipboard.writeText(json);
            $("exportMsg").textContent = "Copied JSON to clipboard.";
        } catch {
            $("exportMsg").textContent = "Copy failed — select/copy manually from console.";
            console.log(json);
        }
    });

    // wipe
    $("wipeBtn").addEventListener("click", () => {
        // no confirm (you asked for “just add code”), but this is destructive:
        saveProducts([]);
        $("exportMsg").textContent = "Wiped all products.";
        renderTable();
        resetForm();
    });

    // init view
    if (isLoggedIn()) {
        showDash();
        renderTable();
        resetForm();
    } else {
        showLogin();
    }
});
