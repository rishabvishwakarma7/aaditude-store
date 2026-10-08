/* Shared Aaditude storefront logic. No libraries or build step required. */
(function () {
  "use strict";
  const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  const config = window.STORE_CONFIG || {};
  const cartKey = "aaditude-cart-v1";
  let cart = readCart();

  function productById(id) { return products.find(function (p) { return p.id === Number(id); }); }
  function rupees(amount) { return "₹" + Number(amount || 0).toLocaleString("en-IN"); }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }
  function whatsappNumber() { return String(config.whatsappNumber || "").replace(/\D/g, ""); }
  function storeReady() {
    return config.ordersEnabled === true && config.catalogIsSample === false &&
      /^\d{11,15}$/.test(whatsappNumber()) && String(config.upiId || "").includes("@");
  }
  function readCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(cartKey) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.filter(function (line) {
        const p = productById(line.id);
        return p && p.sizes.includes(line.size) && Number.isInteger(line.qty) && line.qty > 0;
      }).map(function (line) { return { id: Number(line.id), size: line.size, qty: Math.min(line.qty, 10) }; });
    } catch (error) { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(cartKey, JSON.stringify(cart)); } catch (error) { /* Cart still works for this tab. */ }
    updateCartCount();
  }
  function cartCount() { return cart.reduce(function (total, line) { return total + line.qty; }, 0); }
  function cartTotal() {
    return cart.reduce(function (total, line) {
      const p = productById(line.id);
      return total + (p ? p.price * line.qty : 0);
    }, 0);
  }
  function updateCartCount() {
    document.querySelectorAll("[data-cart-count]").forEach(function (node) { node.textContent = cartCount(); });
  }
  function notify(message) {
    const toast = document.getElementById("site-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(notify.timer);
    notify.timer = setTimeout(function () { toast.classList.remove("is-visible"); }, 3500);
  }
  function addToCart(id, size) {
    const p = productById(id);
    if (!p || !p.sizes.includes(size)) return;
    const existing = cart.find(function (line) { return line.id === p.id && line.size === size; });
    if (existing) existing.qty = Math.min(10, existing.qty + 1);
    else cart.push({ id: p.id, size: size, qty: 1 });
    saveCart();
    notify(p.name + " added to your bag.");
  }

  function renderShell() {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    if (header) header.innerHTML =
      '<div class="topline">LUXURY WITH ATTITUDE / MENSWEAR</div>' +
      '<div class="nav-wrap"><a class="logo" href="index.html" aria-label="Aaditude home">AADITUDE<span>®</span></a>' +
      '<button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span></button>' +
      '<nav id="main-nav" class="main-nav" aria-label="Main navigation"><a href="shop.html">Shop</a><a href="about.html">About</a><a href="size-guide.html">Size guide</a><a href="faq.html">FAQ</a><a href="contact.html">Contact</a></nav>' +
      '<a class="bag-link" href="cart.html" aria-label="Shopping bag">Bag <span data-cart-count>0</span></a></div>';
    if (footer) footer.innerHTML =
      '<div class="footer-grid"><div><a class="footer-logo" href="index.html">AADITUDE.</a><p>Luxury with attitude.</p></div>' +
      '<div><h2>Explore</h2><a href="shop.html">Shop all</a><a href="about.html">Our story</a><a href="size-guide.html">Size guide</a></div>' +
      '<div><h2>Help</h2><a href="faq.html">FAQ</a><a href="contact.html">Contact</a><a href="cart.html">Shopping bag</a><a href="https://www.instagram.com/aaditude.vibe/" target="_blank" rel="noopener">Instagram</a></div></div>' +
      '<div class="footer-bottom"><span>© Aaditude 2026</span><span>Made for your everyday move.</span></div>';
    const menu = document.querySelector(".menu-toggle");
    const nav = document.getElementById("main-nav");
    if (menu && nav) {
      menu.addEventListener("click", function () {
        const open = menu.getAttribute("aria-expanded") !== "true";
        menu.setAttribute("aria-expanded", String(open));
        menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        nav.classList.toggle("is-open", open);
      });
      nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) { nav.classList.remove("is-open"); menu.setAttribute("aria-expanded", "false"); }
      });
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") { nav.classList.remove("is-open"); menu.setAttribute("aria-expanded", "false"); }
      });
    }
    const wa = document.getElementById("whatsapp-float");
    if (wa) {
      wa.setAttribute("aria-label", "Chat with Aaditude on WhatsApp");
      wa.innerHTML = '<span aria-hidden="true">✆</span><span>WhatsApp</span>';
      wa.addEventListener("click", function (event) {
        event.preventDefault();
        if (!/^\d{11,15}$/.test(whatsappNumber())) { notify("WhatsApp chat is coming soon. You can message Aaditude on Instagram meanwhile."); return; }
        window.open("https://wa.me/" + whatsappNumber(), "_blank", "noopener");
      });
    }
    updateCartCount();
  }
  function productCard(product) {
    const alt = product.alt || (product.name + " in " + product.color);
    return '<a class="product-card" href="product.html?id=' + product.id + '">' +
      '<div class="product-image"><img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(alt) + '" loading="lazy"><span class="card-badge">' + (config.catalogIsSample ? "SAMPLE STYLE" : "AADITUDE") + '</span></div>' +
      '<div class="product-meta"><span>' + escapeHtml(product.category) + ' / ' + escapeHtml(product.fit) + '</span><span>' + escapeHtml(product.color) + '</span></div>' +
      '<div class="product-name-row"><h3>' + escapeHtml(product.name) + '</h3><strong>' + rupees(product.price) + (config.catalogIsSample ? '*' : '') + '</strong></div></a>';
  }
  function renderHome() {
    const grid = document.getElementById("featured-products");
    if (grid) grid.innerHTML = products.slice(0, 4).map(productCard).join("");
  }
  function renderShop() {
    const grid = document.getElementById("shop-products");
    if (!grid) return;
    const category = document.getElementById("category-filter");
    const sort = document.getElementById("sort-filter");
    const categories = [...new Set(products.map(function (p) { return p.category; }))];
    category.innerHTML = '<option value="all">All styles</option>' + categories.map(function (name) { return '<option value="' + escapeHtml(name) + '">' + escapeHtml(name) + '</option>'; }).join("");
    function update() {
      let shown = products.filter(function (p) { return category.value === "all" || p.category === category.value; });
      if (sort.value === "price-asc") shown.sort(function (a, b) { return a.price - b.price; });
      if (sort.value === "price-desc") shown.sort(function (a, b) { return b.price - a.price; });
      grid.innerHTML = shown.map(productCard).join("");
      document.getElementById("product-count").textContent = shown.length + " styles";
    }
    const urlCategory = new URLSearchParams(window.location.search).get("category");
    if (categories.includes(urlCategory)) category.value = urlCategory;
    category.addEventListener("change", update);
    sort.addEventListener("change", update);
    update();
  }
  function renderProduct() {
    const mount = document.getElementById("product-detail");
    if (!mount) return;
    const id = new URLSearchParams(window.location.search).get("id");
    const p = productById(id);
    if (!p) { mount.innerHTML = '<div class="not-found"><h1>Style not found.</h1><p>That product is not in the current collection.</p><a class="button button-dark" href="shop.html">Back to shop</a></div>'; return; }
    document.title = p.name + " | Aaditude";
    document.querySelector('meta[name="description"]').setAttribute("content", p.name + " in " + p.color + ". Explore this Aaditude style from Instagram.");
    document.querySelector('meta[property="og:title"]').setAttribute("content", p.name + " | Aaditude");
    document.querySelector('meta[property="og:description"]').setAttribute("content", p.name + " in " + p.color + ". Explore this Aaditude style from Instagram.");
    const alt = p.alt || (p.name + " in " + p.color);
    function inquiryUrl(size) {
      const message = "Hi Aaditude, I am interested in " + p.name + (size ? " in size " + size : "") +
        ". Please confirm the exact style, availability and price." +
        (p.instagramUrl ? "\nInstagram post: " + p.instagramUrl : "");
      return "https://wa.me/" + whatsappNumber() + "?text=" + encodeURIComponent(message);
    }
    mount.innerHTML = '<div class="breadcrumbs"><a href="shop.html">SHOP</a><span>/</span><span>' + escapeHtml(p.name.toUpperCase()) + '</span></div>' +
      '<div class="product-layout"><div class="detail-image"><img src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(alt) + '"></div>' +
      '<div class="detail-info"><p class="eyebrow dark">AADITUDE / ' + escapeHtml(p.category.toUpperCase()) + '</p><h1>' + escapeHtml(p.name) + '</h1><p class="detail-price">' + rupees(p.price) + (config.catalogIsSample ? ' <small>guide price</small>' : '') + '</p>' +
      '<p class="detail-description">' + escapeHtml(p.description) + '</p><div class="detail-attribute"><span>COLOUR</span><strong>' + escapeHtml(p.color) + '</strong></div>' +
      '<div class="size-heading"><strong>SELECT SIZE</strong><a href="size-guide.html">Size guide</a></div><div class="size-options" role="group" aria-label="Select size">' +
      p.sizes.map(function (size) { return '<button type="button" data-size="' + escapeHtml(size) + '" aria-pressed="false">' + escapeHtml(size) + '</button>'; }).join("") +
      '</div><button id="add-to-cart" class="button button-dark full" type="button" disabled>Choose a size</button>' +
      (/^\d{11,15}$/.test(whatsappNumber()) ? '<a id="ask-on-whatsapp" class="button full inquiry-link" href="' + escapeHtml(inquiryUrl("")) + '" target="_blank" rel="noopener">Ask about this style on WhatsApp</a>' : '') +
      '<p class="detail-note">Photo from Aaditude Instagram. Exact item, price, fit and availability must be confirmed before orders open. ' + (p.instagramUrl ? '<a href="' + escapeHtml(p.instagramUrl) + '" target="_blank" rel="noopener">View original post</a>' : '') + '</p></div></div>';
    let selectedSize = "";
    mount.querySelectorAll("[data-size]").forEach(function (button) {
      button.addEventListener("click", function () {
        selectedSize = button.dataset.size;
        mount.querySelectorAll("[data-size]").forEach(function (other) { other.setAttribute("aria-pressed", String(other === button)); });
        const add = document.getElementById("add-to-cart");
        add.disabled = false; add.textContent = "Add to bag";
        const ask = document.getElementById("ask-on-whatsapp");
        if (ask) ask.href = inquiryUrl(selectedSize);
      });
    });
    document.getElementById("add-to-cart").addEventListener("click", function () { if (selectedSize) addToCart(p.id, selectedSize); });
  }

  function renderCart() {
    const mount = document.getElementById("cart-items");
    if (!mount) return;
    if (cart.length === 0) {
      mount.innerHTML = '<div class="empty-cart"><h2>Your bag is empty.</h2><p>Start with a tee or a lower from the first drop.</p><a class="button button-dark" href="shop.html">Browse styles</a></div>';
    } else {
      mount.innerHTML = cart.map(function (line) {
        const p = productById(line.id);
        if (!p) return "";
        const alt = p.alt || (p.name + " in " + p.color);
        return '<article class="cart-item"><img src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(alt) + '">' +
          '<div class="cart-item-details"><a href="product.html?id=' + p.id + '"><h2>' + escapeHtml(p.name) + '</h2></a><p>' + escapeHtml(p.color) + ' / Size ' + escapeHtml(line.size) + '</p>' +
          '<div class="cart-actions"><div class="quantity"><button type="button" data-action="decrease" data-id="' + p.id + '" data-size="' + escapeHtml(line.size) + '" aria-label="Decrease ' + escapeHtml(p.name) + ' quantity">−</button><span>' + line.qty + '</span><button type="button" data-action="increase" data-id="' + p.id + '" data-size="' + escapeHtml(line.size) + '" aria-label="Increase ' + escapeHtml(p.name) + ' quantity">+</button></div>' +
          '<button class="remove-button" type="button" data-action="remove" data-id="' + p.id + '" data-size="' + escapeHtml(line.size) + '">Remove</button></div></div>' +
          '<strong>' + rupees(p.price * line.qty) + '</strong></article>';
      }).join("");
    }
    document.querySelectorAll("[data-cart-total]").forEach(function (node) { node.textContent = rupees(cartTotal()); });
    const count = document.getElementById("cart-item-count");
    if (count) count.textContent = cartCount() + (cartCount() === 1 ? " item" : " items");
    updateCheckout();
  }
  function initCartActions() {
    const mount = document.getElementById("cart-items");
    if (!mount) return;
    mount.addEventListener("click", function (event) {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const id = Number(button.dataset.id), size = button.dataset.size;
      const line = cart.find(function (item) { return item.id === id && item.size === size; });
      if (!line) return;
      if (button.dataset.action === "remove") cart = cart.filter(function (item) { return item !== line; });
      if (button.dataset.action === "increase") line.qty = Math.min(10, line.qty + 1);
      if (button.dataset.action === "decrease") line.qty = Math.max(1, line.qty - 1);
      saveCart();
      renderCart();
    });
  }
  function updateCheckout() {
    const status = document.getElementById("checkout-status");
    const upiId = document.getElementById("upi-id");
    const qr = document.getElementById("upi-qr");
    const submit = document.querySelector("#checkout-form button[type='submit']");
    if (upiId) upiId.textContent = config.upiId || "YOUR-UPI-ID@BANK";
    if (qr) {
      qr.src = config.qrImage || "images/upi-qr-placeholder.svg";
      qr.alt = config.qrImage && !config.qrImage.includes("placeholder") ? "Aaditude UPI payment QR code" : "Placeholder for Aaditude UPI payment QR code";
    }
    if (status) status.textContent = storeReady()
      ? "Send your order request on WhatsApp. Wait for confirmation before paying by UPI."
      : "Checkout preview: add your WhatsApp number, UPI ID, final products and delivery terms before accepting orders.";
    if (submit) submit.disabled = !storeReady() || cart.length === 0;
  }
  function initCheckout() {
    const form = document.getElementById("checkout-form");
    if (!form) return;
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!storeReady()) { notify("Checkout is not configured yet."); return; }
      if (cart.length === 0) { notify("Add a product to your bag first."); return; }
      if (!form.reportValidity()) return;
      const name = form.elements.customerName.value.trim();
      const phone = form.elements.customerPhone.value.replace(/\D/g, "");
      const address = form.elements.customerAddress.value.trim();
      if (name.length < 2 || phone.length !== 10 || address.length < 10) {
        notify("Please enter your full name, 10-digit phone number and delivery address."); return;
      }
      const items = cart.map(function (line) {
        const p = productById(line.id);
        return "• " + p.name + " / " + line.size + " × " + line.qty + " — " + rupees(p.price * line.qty);
      }).join("\n");
      const message = "Hello Aaditude, I would like to request an order.\n\n" +
        "Name: " + name + "\nPhone: " + phone + "\nAddress: " + address + "\n\n" +
        "Items:\n" + items + "\n\nMerchandise total: " + rupees(cartTotal()) +
        "\n\nPlease confirm availability, shipping cost and final UPI payment details before I pay.";
      window.open("https://wa.me/" + whatsappNumber() + "?text=" + encodeURIComponent(message), "_blank", "noopener");
      notify("Your WhatsApp order request is ready. Wait for confirmation before paying.");
    });
  }
  function renderContact() {
    const details = document.getElementById("contact-details");
    if (!details) return;
    const email = String(config.contactEmail || "");
    const phone = whatsappNumber();
    details.innerHTML = '<div class="contact-card"><span>WHATSAPP</span>' +
      (phone ? '<a href="https://wa.me/' + phone + '" target="_blank" rel="noopener">+' + phone + '</a>' : '<p>WhatsApp chat is coming soon.</p>') +
      '</div><div class="contact-card"><span>INSTAGRAM</span><a href="https://www.instagram.com/aaditude.vibe/" target="_blank" rel="noopener">@aaditude.vibe</a></div>' +
      (email && email.includes("@") ? '<div class="contact-card"><span>EMAIL</span><a href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + '</a></div>' : '');
  }

  renderShell();
  renderHome();
  renderShop();
  renderProduct();
  initCartActions();
  renderCart();
  initCheckout();
  renderContact();
})();
