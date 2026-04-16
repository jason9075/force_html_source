# Force HTML Source Viewer

A Firefox extension that empowers you to easily view the exact, currently rendered HTML source code of any webpage, bypassing common anti-scraping and anti-debugging restrictions.

## Features

- **Bypass Restrictions**: Expertly circumvents disabled right-clicks (context menus), disabled keyboard shortcuts (like `F12` and `Ctrl+U`), and text selection blocking.
- **Dynamic DOM Rendering**: Unlike traditional "View Page Source", this extension captures the live, rendered DOM structure, ensuring that you see exactly what is on the page—even if the content was generated dynamically via JavaScript.
- **Auto Code Beautification**: Extracted HTML is automatically formatted and prettified for clean, readable code.
- **Built-in Text Search**: Navigate the source code effortlessly with a built-in search bar, complete with "Next" and "Previous" navigation buttons and match highlighting.
- **Copy to Clipboard**: A single-click button safely copies the formatted HTML source directly to your clipboard.

## Installation (Firefox Temporary Add-on)

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox` in the URL bar.
2. Click the **Load Temporary Add-on...** button.
3. Choose the `manifest.json` file located in this directory.
4. *(Optional but recommended)* Pin the extension to your toolbar for quick access.

## Development

This project natively supports a Reproducible Environment via Nix and `flake.nix`.

To package the extension into a deployable `.zip` file, you can run:

```bash
# This will execute mozilla's web-ext build command within the nix shell
nix develop -c web-ext build
```

The resulting extension package will be outputted into the `web-ext-artifacts` directory.

## Usage

1. Navigate to any website whose source code you wish to examine.
2. Click the "Force HTML Source" extension icon in your toolbar.
3. A new tab will seamlessly open displaying the meticulously formatted HTML DOM. You can search within the text or copy everything to your clipboard using the top toolbar.
