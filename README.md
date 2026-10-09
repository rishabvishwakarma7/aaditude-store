# Aaditude static store

Open [index.html](index.html) in Chrome or Edge to preview the store. No installation, command, server, or build step is needed. All pages use relative links, so they also work on a static host.

## Catalogue and photos

The 11 preview listings in [js/products.js](js/products.js) use photos from [@aaditude.vibe](https://www.instagram.com/aaditude.vibe/). [INSTAGRAM_SOURCES.md](INSTAGRAM_SOURCES.md) maps each local photo to its post. The downloaded images are public Instagram previews; replace them with your original, higher-resolution product photos where possible.

Product names and prices are **guide values**, because the Instagram posts do not publish confirmed prices or live stock. Confirm each exact item, brand, size, fabric, inventory and selling price before accepting orders.

## Before taking real orders

1. Open [js/products.js](js/products.js). Confirm or replace the product names, prices, descriptions, sizes and image paths.
2. Add original product photos to `images/` and point each product's `image` field to its file.
3. The confirmed WhatsApp number is configured. In `STORE_CONFIG`, add the UPI ID, support email and QR image path.
4. Confirm size measurements, delivery coverage, shipping charges, returns and contact details in the relevant HTML pages.
5. Set `catalogIsSample: false`, then set `ordersEnabled: true`. Test a WhatsApp order from your own phone before sharing the site.

Each product page can now send a WhatsApp availability enquiry to the confirmed store number. When enabled, checkout sends an **order request** to WhatsApp. It does not verify a UPI transfer or create a server-side order. Confirm stock, shipping and payment manually before fulfilling an order.

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

The live GitHub Pages site is https://rishabvishwakarma7.github.io/aaditude-store/. Its social preview images use absolute public URLs; update them if the hosting URL changes. Google Fonts require an internet connection; the fallback fonts work offline.

## Live deployment

Live site: https://rishabvishwakarma7.github.io/aaditude-store/

GitHub repository: https://github.com/rishabvishwakarma7/aaditude-store

GitHub Pages publishes the master branch from /(root). The .nojekyll file serves these static files without a build step. To publish future changes from this folder, commit the edits and run: git push origin master.

The live site is currently a catalogue preview. WhatsApp product enquiries work, but checkout remains disabled until the UPI ID, QR code, exact products, prices, stock and store policies are confirmed. After changing the public hosting address, update the absolute og:image URLs in every HTML page.

GitHub Pages source documentation: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
