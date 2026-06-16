<h1 align="center">

![Extract CRX](https://MainRoute-Core.github.io/Extract-CRX/icons/192.png)

[Extract CRX](https://MainRoute-Core.github.io/Extract-CRX/)

</h1>

Effortlessly **download**, **explore**, and **audit** source code for browser extensions with **Extract CRX**.

Whether it's for **Chrome**, **Firefox**, **Edge**, or **Opera**, simply enter the extension ID or URL, select your desired format, and download the extension with ease, or upload a local CRX/XPI file to inspect and convert it.

---

## 🚀 Features

### 📥 Multi-Store Downloader
- **Universal URL Parsing**: Input raw extension URLs from the Chrome Web Store, Mozilla Add-ons, Microsoft Edge Add-ons, or Opera Add-ons.
- **Auto-Browser Detection**: Automatically recognizes the target browser from the pasted URL.
- **Format Flexibility**: Download packages in their native formats (`.crx`, `.xpi`) or package them as a standard `.zip` file.
- **CORS Fallback Proxy**: Includes a bypass option (`Route via CORS Fallback Proxy`) to fetch assets when standard browser requests are blocked by CORS policies.

### 📁 In-Browser File Explorer
- **Interactive Directory Tree**: Browse the internal structure of any uploaded `.crx` or `.xpi` package without extracting files to your local machine.
- **Dynamic File Filtering**: Search for specific files inside the package tree with real-time filtering.
- **Asset Download**: Export individual files from the extension tree directly to your disk.

### 🔍 Code & Media Viewer
- **Syntax Highlighting**: View source code (JavaScript, JSON, CSS, HTML) with native coloring powered by PrismJS.
- **Interactive Code Search**: Search within files with live highlight markers and match counters.
- **Code Beautifier**: De-minify and format compressed JavaScript, JSON, or CSS layouts with one click.
- **Visual Asset Previewer**: Preview images (PNG, JPG, GIF, WEBP, ICO, SVG) with auto-calculated pixel dimensions and file type readouts.

### 🛡️ Manifest Security & Migration Audit
- **Risk Assessment**: Analyzes the extension's declared permissions and rates the overall risk level (Low, Medium, or High).
- **Permission Breakdown**: Explains exactly what each permission can access in plain language.
- **Manifest V3 Migration Guide**: Identifies deprecated Manifest V2 declarations (such as background scripts, blocking web requests, or browser actions) and recommends equivalent Manifest V3 updates.

### 🕰️ local Extraction History
- **Access Logs**: Keeps track of your last 20 downloaded extensions in a locally cached dashboard.
- **Quick Re-extraction**: Re-download or audit previous extensions with a single click.

---

## ⌨️ Keyboard Shortcuts

Improve your workflow with built-in keyboard actions:
*   Press `/` to automatically navigate to the **Extract** tab and focus on the input bar.
*   Use `Left Arrow` or `Right Arrow` to switch active tabs when focused on the tab bar.

---

## 🔹 How To Use

### **1. Downloading Extension Source Files**
1. Paste the **extension ID** or **URL** into the input field.
2. The correct browser and metadata card will be generated automatically.
3. Select your desired format (e.g., `ZIP` or `CRX`).
4. Click **Start Download** (toggle the *CORS Fallback Proxy* if the direct download is blocked).

### **2. Inspecting or Converting a Package**
1. Drag and drop any `.crx` or `.xpi` file anywhere on the interface (or select it from the **Convert** tab).
2. Browse the extracted file system using the directory tree.
3. Click any text or image file to open the interactive code viewer and audit permissions inside the security panel.
4. Click **Convert and Download** to package the entire source directory into a standard `.zip` archive.

---

## 📜 License

📄 Licensed under the Apache License v2.0
© 2026 [MainRoute Core](https://MainRoute-Core.github.io/)