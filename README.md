# Aaditude static store

Open [index.html](index.html) in Chrome or Edge to preview the store. No installation, command, server, or build step is needed. All pages use relative links, so they also work on a static host.

## Catalogue and photos

The 11 preview listings in [js/products.js](js/products.js) use photos from [@aaditude.vibe](https://www.instagram.com/aaditude.vibe/). [INSTAGRAM_SOURCES.md](INSTAGRAM_SOURCES.md) maps each local photo to its post. The downloaded images are public Instagram previews; replace them with your original, higher-resolution product photos where possible.

Product names and prices are **guide values**, because the Instagram posts do not publish confirmed prices or live stock. Confirm each exact item, brand, size, fabric, inventory and selling price before accepting orders.

## Before taking real orders

1. Open [js/products.js](js/products.js). Confirm or replace the product names, prices, descriptions, sizes and image paths.
2. Add original product photos to `images/` and point each product's `image` field to its file.
3. In `STORE_CONFIG`, add the WhatsApp order number with country code (digits only), UPI ID, support email and QR image path.
4. Confirm size measurements, delivery coverage, shipping charges, returns and contact details in the relevant HTML pages.
5. Set `catalogIsSample: false`, then set `ordersEnabled: true`. Test a WhatsApp order from your own phone before sharing the site.

The checkout sends an **order request** to WhatsApp. It does not verify a UPI transfer or create a server-side order. Confirm stock, shipping and payment manually before fulfilling an order.

## Files

- `index.html` — home
- `shop.html` — collection and filters
- `product.html?id=1` — product details; the number comes from the product's `id`
- `cart.html` — shopping bag, checkout form and UPI section
- `about.html`, `contact.html`, `size-guide.html`, `faq.html` — information pages
- `css/style.css` — all styling
- `js/products.js` — catalogue and store settings
- `js/main.js` — navigation, cart, filters and checkout
- `images/` — locally saved Aaditude Instagram photos and replaceable placeholders

When you publish on a host, change each page's `og:image` to the full public image URL so WhatsApp and other social sites can reliably make previews. Google Fonts require an internet connection; the fallback fonts work offline.
