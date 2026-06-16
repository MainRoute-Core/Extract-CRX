

document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".md3-tab");
    const panels = document.querySelectorAll(".md3-panel");
    const inputField = document.getElementById("extensionInput");
    const inputContainer = document.getElementById("inputContainer");
    const clearInputBtn = document.getElementById("clearInput");
    const browserRadios = document.querySelectorAll('input[name="browser"]');
    const downloadTypeSelect = document.getElementById("downloadType");
    const downloadForm = document.getElementById("extensionForm");
    const downloadProgressBar = document.getElementById("downloadProgressBar");
    const metadataCard = document.getElementById("metadataCard");
    const metaIcon = document.getElementById("metaIcon");
    const metaTitle = document.getElementById("metaTitle");
    const metaVersion = document.getElementById("metaVersion");
    const startDownloadBtn = document.getElementById("downloadButton");
    const corsProxyToggle = document.getElementById("corsProxyToggle");
    const themeToggleButton = document.getElementById("themeToggleButton");

    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const browseButton = document.getElementById("browseButton");
    const selectedFileCard = document.getElementById("selectedFileCard");
    const fileNameDisplay = document.getElementById("fileName");
    const fileSizeDisplay = document.getElementById("fileSize");
    const removeFileButton = document.getElementById("removeFileButton");
    const explorerContainer = document.getElementById("explorerContainer");
    const fileTree = document.getElementById("fileTree");
    const explorerCollapseAll = document.getElementById("explorerCollapseAll");
    const convertButton = document.getElementById("convertButton");
    const treeSearchInput = document.getElementById("treeSearchInput");

    const securityAuditCard = document.getElementById("securityAuditCard");
    const manifestVersionBadge = document.getElementById("manifestVersionBadge");
    const riskLevelBadge = document.getElementById("riskLevelBadge");
    const permissionsAuditList = document.getElementById("permissionsAuditList");
    const migrationAuditSection = document.getElementById("migrationAuditSection");
    const migrationWarningsList = document.getElementById("migrationWarningsList");

    const historyPlaceholder = document.getElementById("historyPlaceholder");
    const historyList = document.getElementById("historyList");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");

    const codeDialog = document.getElementById("codeViewerDialog");
    const closeDialogButton = document.getElementById("closeDialogButton");
    const copyCodeButton = document.getElementById("copyCodeButton");
    const codeViewerArea = document.getElementById("codeViewerArea");
    const dialogBreadcrumbs = document.getElementById("dialogBreadcrumbs");
    const beautifyCodeButton = document.getElementById("beautifyCodeButton");
    const downloadFileButton = document.getElementById("downloadFileButton");
    const preContainer = document.getElementById("preContainer");

    const codeSearchContainer = document.getElementById("codeSearchContainer");
    const codeSearchInput = document.getElementById("codeSearchInput");
    const codeSearchPrev = document.getElementById("codeSearchPrev");
    const codeSearchNext = document.getElementById("codeSearchNext");
    const codeSearchCount = document.getElementById("codeSearchCount");

    const mediaPreviewContainer = document.getElementById("mediaPreviewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const imageResolution = document.getElementById("imageResolution");
    const imageType = document.getElementById("imageType");

    let selectedPackageFile = null;
    let activeZipInstance = null;
    let currentOpenCodeText = "";
    let currentOpenEntry = null;
    let searchMatches = [];
    let currentSearchIndex = -1;

    function initializeTheme() {
        const storedTheme = localStorage.getItem("theme_mode");
        const systemPreference = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
        const targetTheme = storedTheme || systemPreference;

        if (targetTheme === "light") {
            document.body.classList.add("light-theme");
            themeToggleButton.querySelector(".material-symbols-rounded").textContent = "light_mode";
        } else {
            document.body.classList.remove("light-theme");
            themeToggleButton.querySelector(".material-symbols-rounded").textContent = "dark_mode";
        }
    }

    themeToggleButton.addEventListener("click", () => {
        const isLightTheme = document.body.classList.toggle("light-theme");
        localStorage.setItem("theme_mode", isLightTheme ? "light" : "dark");
        themeToggleButton.querySelector(".material-symbols-rounded").textContent = isLightTheme ? "light_mode" : "dark_mode";
    });

    initializeTheme();

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const targetPanelId = tab.getAttribute("aria-controls");

            tabs.forEach(t => {
                t.classList.remove("active");
                t.setAttribute("aria-selected", "false");
                t.setAttribute("tabindex", "-1");
            });
            tab.classList.add("active");
            tab.setAttribute("aria-selected", "true");
            tab.setAttribute("tabindex", "0");

            panels.forEach(p => {
                p.style.display = "none";
                p.classList.remove("active");
            });
            const targetPanel = document.getElementById(targetPanelId);
            targetPanel.style.display = "flex";
            setTimeout(() => targetPanel.classList.add("active"), 10);

            if (targetPanelId === "panel-history") {
                renderHistory();
            }
        });
    });

    const tabList = document.querySelector('[role="tablist"]');
    if (tabList) {
        tabList.addEventListener("keydown", (e) => {
            const activeTab = document.activeElement;
            if (!activeTab.classList.contains("md3-tab")) return;

            let nextTab = null;
            if (e.key === "ArrowRight") {
                nextTab = activeTab.nextElementSibling || tabList.firstElementChild;
            } else if (e.key === "ArrowLeft") {
                nextTab = activeTab.previousElementSibling || tabList.lastElementChild;
            }

            if (nextTab) {
                nextTab.focus();
                nextTab.click();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "SELECT") {
            e.preventDefault();
            const extractTab = document.getElementById("tab-extract");
            extractTab.click();
            setTimeout(() => inputField.focus(), 150);
        }
    });

    let dragCounter = 0;
    const globalDropOverlay = document.getElementById("globalDropOverlay");

    window.addEventListener("dragenter", (e) => {
        e.preventDefault();
        dragCounter++;
        if (dragCounter === 1) {
            globalDropOverlay.style.display = "flex";
        }
    });

    window.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dragCounter--;
        if (dragCounter === 0) {
            globalDropOverlay.style.display = "none";
        }
    });

    window.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    window.addEventListener("drop", (e) => {
        e.preventDefault();
        dragCounter = 0;
        globalDropOverlay.style.display = "none";

        if (e.dataTransfer.files.length > 0) {
            const dropFile = e.dataTransfer.files[0];
            const ext = dropFile.name.split('.').pop().toLowerCase();

            if (ext === "crx" || ext === "xpi") {
                document.getElementById("tab-convert").click();
                fileInput.files = e.dataTransfer.files;
                handlePackageUpload();
            } else {
                alert("Please drop a valid .crx or .xpi file.");
            }
        }
    });

    function updateDownloadOptions() {
        const browser = document.querySelector('input[name="browser"]:checked').value;
        downloadTypeSelect.innerHTML = "";

        const formats = {
            chrome: ['crx', 'zip'],
            firefox: ['xpi', 'zip'],
            opera: ['crx', 'zip'],
            edge: ['crx', 'zip']
        };

        formats[browser].forEach(fmt => {
            const opt = document.createElement("option");
            opt.value = fmt;
            opt.textContent = `Download as ${fmt.toUpperCase()}`;
            downloadTypeSelect.appendChild(opt);
        });
    }

    inputField.addEventListener("input", function () {
        const val = this.value.trim();
        clearInputBtn.style.display = val.length > 0 ? "flex" : "none";
        inputContainer.classList.remove("invalid");

        if (val) {
            detectBrowserAndValidate(val);
        } else {
            metadataCard.style.display = "none";
        }
    });

    clearInputBtn.addEventListener("click", () => {
        inputField.value = "";
        clearInputBtn.style.display = "none";
        metadataCard.style.display = "none";
        inputContainer.classList.remove("invalid");
        inputField.focus();
    });

    browserRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            updateDownloadOptions();
            if (inputField.value.trim()) {
                detectBrowserAndValidate(inputField.value.trim());
            }
        });
    });

    function detectBrowserAndValidate(input) {
        const urlPatterns = {
            chrome: [
                /chrome\.google\.com\/webstore\/detail\//,
                /chromewebstore\.google\.com\/detail\//
            ],
            edge: [/microsoftedge\.microsoft\.com\/addons\/detail\//],
            opera: [/addons\.opera\.com\/.*extensions\/details\//],
            firefox: [
                /addons\.mozilla\.org\/.*addon\//,
                /addons\.allizom\.org\/.*addon\//,
                /addons-dev\.allizom\.org\/.*addon\//,
                /addons\.thunderbird\.net\/.*addon\//
            ]
        };

        let matchedBrowser = null;
        for (const [browser, patterns] of Object.entries(urlPatterns)) {
            if (patterns.some(pattern => pattern.test(input))) {
                matchedBrowser = browser;
                break;
            }
        }

        if (matchedBrowser) {
            document.getElementById(matchedBrowser).checked = true;
            updateDownloadOptions();
        }

        const currentBrowser = document.querySelector('input[name="browser"]:checked').value;
        const extensionId = extractExtensionId(input, currentBrowser);

        if (extensionId) {
            inputContainer.classList.remove("invalid");
            displayMetadataCard(input, currentBrowser, extensionId);
        }
    }

    function extractExtensionId(input, browser) {
        const patterns = {
            chrome: /([a-z]{32})/,
            edge: /([a-z]{32})/,
            firefox: /addons(?:-dev)?\.(?:mozilla\.org|allizom\.org|thunderbird\.net)\/[^\/]+\/(?:firefox|thunderbird)\/addon\/([^\/?]+)/,
            opera: /(?:addons.opera.com\/.*?\/extensions\/details\/)([a-zA-Z0-9_-]+)(?=\/|$)/
        };

        if ((browser === "firefox" || browser === "opera") && /^[a-zA-Z0-9_-]+$/.test(input)) {
            return input;
        }

        const match = patterns[browser]?.exec(input);
        return match ? match[1] : null;
    }

    function parseSlugToName(input, browser, id) {
        try {
            const url = new URL(input);
            const pathname = url.pathname;
            let slug = "";

            if (browser === "chrome" || browser === "edge") {
                const match = pathname.match(/detail\/([^\/]+)/);
                if (match) slug = match[1];
            } else if (browser === "firefox") {
                const match = pathname.match(/addon\/([^\/]+)/);
                if (match) slug = match[1];
            } else if (browser === "opera") {
                const match = pathname.match(/details\/([^\/]+)/);
                if (match) slug = match[1];
            }

            if (slug) {
                return slug
                    .split(/[-_]+/)
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ");
            }
        } catch (e) { }

        const displayTitles = {
            chrome: "Chrome Extension",
            firefox: "Firefox Add-on",
            opera: "Opera Extension",
            edge: "Edge Add-on"
        };
        return `${displayTitles[browser]} (${id.slice(0, 8)}...)`;
    }

    function displayMetadataCard(input, browser, id) {
        downloadProgressBar.style.display = "block";
        metadataCard.style.display = "none";

        setTimeout(() => {
            downloadProgressBar.style.display = "none";
            const computedName = parseSlugToName(input, browser, id);

            metaTitle.textContent = computedName;
            metaVersion.textContent = `Extension ID: ${id}`;

            const browserIconsMap = {
                chrome: 'chrome-icon',
                firefox: 'firefox-icon',
                opera: 'opera-icon',
                edge: 'edge-icon'
            };
            metaIcon.className = `metadata-icon browser-icon ${browserIconsMap[browser]}`;

            metadataCard.style.display = "flex";
        }, 500);
    }

    function getDownloadUrl(browser, extensionId) {
        const baseUrls = {
            chrome: `https://clients2.google.com/service/update2/crx?response=redirect&os=win&arch=x86-64&os_arch=x86-64&nacl_arch=x86-64&prod=chromiumcrx&prodchannel=unknown&prodversion=132.0.0.0&acceptformat=crx2,crx3&x=id%3D${extensionId}%26uc`,
            edge: `https://edge.microsoft.com/extensionwebstorebase/v1/crx?response=redirect&x=id%3D${extensionId}%26installsource%3Dondemand%26uc`,
            opera: `https://addons.opera.com/extensions/download/${extensionId}`,
        };

        const inputUrl = inputField.value.trim();
        if (browser === "firefox") {
            if (inputUrl.includes("addons.allizom.org")) {
                return `https://addons.allizom.org/firefox/downloads/latest/${extensionId}/platform:5/${extensionId}.xpi`;
            }
            if (inputUrl.includes("addons-dev.allizom.org")) {
                return `https://addons-dev.allizom.org/firefox/downloads/latest/${extensionId}/platform:5/${extensionId}.xpi`;
            }
            if (inputUrl.includes("addons.thunderbird.net")) {
                return `https://addons.thunderbird.net/firefox/downloads/latest/${extensionId}/platform:5/${extensionId}.xpi`;
            }
            return `https://addons.mozilla.org/firefox/downloads/latest/${extensionId}/platform:5/${extensionId}.xpi`;
        }

        return baseUrls[browser];
    }

    downloadForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const input = inputField.value.trim();
        const browser = document.querySelector('input[name="browser"]:checked').value;
        const format = downloadTypeSelect.value;
        const extensionId = extractExtensionId(input, browser);

        if (!input) return;

        if (!extensionId) {
            inputContainer.classList.add("invalid");
            return;
        }

        let downloadUrl = getDownloadUrl(browser, extensionId);
        const name = parseSlugToName(input, browser, extensionId);

        saveToHistory(extensionId, name, browser);

        if (format === "zip") {
            downloadProgressBar.style.display = "block";
            startDownloadBtn.disabled = true;

            const isProxyEnabled = corsProxyToggle.checked;
            const targetUrl = isProxyEnabled ? `https://corsproxy.io/?${encodeURIComponent(downloadUrl)}` : downloadUrl;

            fetch(targetUrl)
                .then(res => {
                    if (!res.ok) throw new Error("Network response blocked or server returned error.");
                    return res.arrayBuffer();
                })
                .then(arrayBuffer => {
                    let zipBlob;
                    if (browser === "firefox") {
                        zipBlob = new Blob([arrayBuffer], { type: "application/zip" });
                    } else {
                        zipBlob = stripCrxHeaderToBlob(arrayBuffer);
                    }

                    const zipUrl = URL.createObjectURL(zipBlob);
                    const link = document.createElement("a");
                    link.href = zipUrl;
                    link.download = `${extensionId}.zip`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(zipUrl);
                })
                .catch(() => {
                    if (!isProxyEnabled) {
                        alert(`Download blocked by CORS restrictions. Try enabling the "Route via CORS Fallback Proxy" setting and download again.`);
                    } else {
                        alert(`Direct download failed even with proxy. Please download as ${format.toUpperCase()} and convert locally.`);
                    }
                })
                .finally(() => {
                    downloadProgressBar.style.display = "none";
                    startDownloadBtn.disabled = false;
                });
        } else {
            window.location.href = downloadUrl;
        }
    });

    updateDownloadOptions();

    browseButton.addEventListener("click", () => fileInput.click());
    dropZone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", handlePackageUpload);

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            handlePackageUpload();
        }
    });

    function handlePackageUpload() {
        if (fileInput.files.length === 0) return;

        const file = fileInput.files[0];
        const ext = file.name.split('.').pop().toLowerCase();

        if (ext !== "crx" && ext !== "xpi") {
            alert("Please select a valid .crx or .xpi package.");
            fileInput.value = "";
            return;
        }

        selectedPackageFile = file;

        fileNameDisplay.textContent = file.name;
        fileSizeDisplay.textContent = formatBytes(file.size);
        dropZone.style.display = "none";
        selectedFileCard.style.display = "flex";
        convertButton.disabled = false;

        unpackZipStructure(file);
    }

    removeFileButton.addEventListener("click", () => {
        resetConverterView();
    });

    function resetConverterView() {
        selectedPackageFile = null;
        activeZipInstance = null;
        fileInput.value = "";
        dropZone.style.display = "block";
        selectedFileCard.style.display = "none";
        explorerContainer.style.display = "none";
        securityAuditCard.style.display = "none";
        fileTree.innerHTML = "";
        convertButton.disabled = true;
        treeSearchInput.value = "";
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function stripCrxHeaderToBlob(arrayBuffer) {
        const buf = new Uint8Array(arrayBuffer);

        const isCrx = (buf[0] === 0x43 && buf[1] === 0x72 && buf[2] === 0x32 && buf[3] === 0x34);
        if (!isCrx) {
            return new Blob([arrayBuffer], { type: "application/zip" });
        }

        let publicKeyLength, signatureLength, zipStartOffset;

        if (buf[4] === 2) {
            publicKeyLength = (buf[8] + (buf[9] << 8) + (buf[10] << 16) + (buf[11] << 24)) >>> 0;
            signatureLength = (buf[12] + (buf[13] << 8) + (buf[14] << 16) + (buf[15] << 24)) >>> 0;
            zipStartOffset = 16 + publicKeyLength + signatureLength;
        } else {
            publicKeyLength = (buf[8] + (buf[9] << 8) + (buf[10] << 16) + (buf[11] << 24)) >>> 0;
            zipStartOffset = 12 + publicKeyLength;
        }

        return new Blob([new Uint8Array(arrayBuffer, zipStartOffset)], { type: "application/zip" });
    }

    function unpackZipStructure(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const arrayBuffer = e.target.result;
            let zipData = arrayBuffer;

            if (file.name.endsWith(".crx")) {
                const zipBlob = stripCrxHeaderToBlob(arrayBuffer);
                zipData = zipBlob;
            }

            JSZip.loadAsync(zipData)
                .then(zip => {
                    activeZipInstance = zip;
                    generateFileTree(zip);
                    performSecurityAudit(zip);
                })
                .catch(err => {
                    console.error("Error unpacking structure:", err);
                    alert("Could not load directory tree. The package may be corrupted or encrypted.");
                });
        };
        reader.readAsArrayBuffer(file);
    }

    function performSecurityAudit(zip) {
        permissionsAuditList.innerHTML = "";
        migrationWarningsList.innerHTML = "";
        migrationAuditSection.style.display = "none";
        securityAuditCard.style.display = "none";

        const manifestEntry = zip.file("manifest.json");
        if (!manifestEntry) return;

        manifestEntry.async("string")
            .then(content => {
                const manifest = JSON.parse(content);
                const version = manifest.manifest_version || 2;
                manifestVersionBadge.textContent = `MV${version}`;

                const rules = {
                    high: ["<all_urls>", "*://*/*", "http://*/*", "https://*/*", "webRequest", "webRequestBlocking", "debugger", "proxy"],
                    medium: ["activeTab", "cookies", "tabs", "management", "declarativeNetRequest", "scripting"]
                };

                const parsedPermissions = [
                    ...(manifest.permissions || []),
                    ...(manifest.host_permissions || []),
                    ...(manifest.optional_permissions || [])
                ];

                let highestRisk = "low";

                if (parsedPermissions.length === 0) {
                    const li = document.createElement("li");
                    li.className = "audit-item";
                    li.innerHTML = `<span class="audit-item-bullet risk-low"></span> No permissions declared inside manifest.`;
                    permissionsAuditList.appendChild(li);
                }

                parsedPermissions.forEach(perm => {
                    let risk = "low";
                    if (rules.high.some(r => perm.includes(r) || perm === r)) {
                        risk = "high";
                        highestRisk = "high";
                    } else if (rules.medium.includes(perm) && highestRisk !== "high") {
                        risk = "medium";
                        highestRisk = "medium";
                    }

                    const li = document.createElement("li");
                    li.className = "audit-item";
                    li.innerHTML = `
                        <span class="audit-item-bullet risk-${risk}"></span>
                        <strong>${perm}</strong> - ${getPermissionSummary(perm, risk)}
                    `;
                    permissionsAuditList.appendChild(li);
                });

                riskLevelBadge.textContent = highestRisk;
                riskLevelBadge.className = `risk-pill risk-${highestRisk}`;

                if (version === 2) {
                    migrationAuditSection.style.display = "block";

                    const addWarning = (warn) => {
                        const li = document.createElement("li");
                        li.className = "audit-item";
                        li.innerHTML = `<span class="audit-item-bullet risk-medium"></span> ${warn}`;
                        migrationWarningsList.appendChild(li);
                    };

                    addWarning("Manifest version 2 is deprecated. Update 'manifest_version' to 3.");

                    if (manifest.background) {
                        if (manifest.background.scripts || manifest.background.page) {
                            addWarning("Background page/scripts must be migrated to a Manifest V3 Service Worker.");
                        }
                    }
                    if (parsedPermissions.includes("webRequestBlocking")) {
                        addWarning("Replace blocking webRequest calls with declarativeNetRequest dynamic actions.");
                    }
                    if (manifest.browser_action || manifest.page_action) {
                        addWarning("Merge action declarations into the singular 'action' API key structure.");
                    }
                }

                securityAuditCard.style.display = "flex";
            })
            .catch(err => {
                console.warn("Could not perform static security manifest audit:", err);
            });
    }

    function getPermissionSummary(permission, risk) {
        const descriptions = {
            "<all_urls>": "Full read/write capabilities across every web domain without exceptions.",
            "activeTab": "Access content only on the single active web page when clicked.",
            "cookies": "Read, modify, or block browser cookie stores.",
            "tabs": "Query, open, close, and monitor activity of tabs and web addresses.",
            "storage": "Store local or cloud configuration parameters directly inside the browser.",
            "webRequest": "Inspect ongoing network traffic requests on-the-fly.",
            "webRequestBlocking": "Intercept and block active network requests globally."
        };
        return descriptions[permission] || `${risk.charAt(0).toUpperCase() + risk.slice(1)} risk permission access.`;
    }

    function generateFileTree(zip) {
        fileTree.innerHTML = "";
        const root = {};

        zip.forEach((relativePath, zipEntry) => {
            const parts = relativePath.split('/');
            let current = root;

            parts.forEach((part, index) => {
                if (!part) return;
                const isLast = (index === parts.length - 1);

                if (isLast && !zipEntry.dir) {
                    current[part] = { _type: 'file', entry: zipEntry };
                } else {
                    if (!current[part]) {
                        current[part] = { _type: 'dir', _children: {} };
                    }
                    current = current[part]._children;
                }
            });
        });

        function buildTreeHTML(node, container) {
            const sortedNodes = Object.keys(node).sort((a, b) => {
                const isADir = node[a]._type === 'dir';
                const isBDir = node[b]._type === 'dir';
                if (isADir && !isBDir) return -1;
                if (!isADir && isBDir) return 1;
                return a.localeCompare(b);
            });

            sortedNodes.forEach(key => {
                const item = node[key];

                if (item._type === 'dir') {
                    const wrapper = document.createElement("div");
                    wrapper.className = "tree-folder-wrapper";

                    const folderNode = document.createElement("div");
                    folderNode.className = "tree-node folder";
                    folderNode.innerHTML = `
                        <span class="material-symbols-rounded tree-node-icon">folder</span>
                        <span class="tree-node-label">${key}</span>
                    `;

                    const childrenContainer = document.createElement("div");
                    childrenContainer.className = "tree-children";
                    childrenContainer.style.display = "none";

                    folderNode.addEventListener("click", () => {
                        const collapsed = childrenContainer.style.display === "none";
                        childrenContainer.style.display = collapsed ? "block" : "none";
                        folderNode.querySelector(".tree-node-icon").textContent = collapsed ? "folder_open" : "folder";
                    });

                    buildTreeHTML(item._children, childrenContainer);
                    wrapper.appendChild(folderNode);
                    wrapper.appendChild(childrenContainer);
                    container.appendChild(wrapper);
                } else if (item._type === 'file') {
                    const fileNode = document.createElement("div");
                    fileNode.className = "tree-node file";
                    fileNode.innerHTML = `
                        <span class="material-symbols-rounded tree-node-icon">insert_drive_file</span>
                        <span class="tree-node-label">${key}</span>
                    `;

                    fileNode.addEventListener("click", () => {
                        openCodeInspector(item.entry);
                    });

                    container.appendChild(fileNode);
                }
            });
        }

        buildTreeHTML(root, fileTree);
        explorerContainer.style.display = "block";
    }

    treeSearchInput.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();
        const fileNodes = fileTree.querySelectorAll(".tree-node.file");

        fileNodes.forEach(node => {
            const label = node.querySelector(".tree-node-label").textContent.toLowerCase();
            const wrapper = node.closest(".tree-folder-wrapper") || node;

            if (label.includes(query)) {
                node.style.display = "flex";
                if (query !== "") {
                    expandParentTreeFolders(node);
                }
            } else {
                node.style.display = "none";
            }
        });

        const folderWrappers = fileTree.querySelectorAll(".tree-folder-wrapper");
        folderWrappers.forEach(folder => {
            const matchesCount = folder.querySelectorAll(".tree-node.file[style='display: flex;']").length;
            const folderNode = folder.querySelector(".tree-node.folder");
            const childrenContainer = folder.querySelector(".tree-children");

            if (matchesCount > 0 || query === "") {
                folder.style.display = "block";
                folderNode.style.display = "flex";
                if (query === "") {
                    childrenContainer.style.display = "none";
                    folderNode.querySelector(".tree-node-icon").textContent = "folder";
                }
            } else {
                folder.style.display = "none";
            }
        });
    });

    function expandParentTreeFolders(element) {
        let parent = element.parentElement;
        while (parent && parent !== fileTree) {
            if (parent.classList.contains("tree-children")) {
                parent.style.display = "block";
                const folderWrapper = parent.parentElement;
                if (folderWrapper) {
                    const folderNode = folderWrapper.querySelector(".tree-node.folder");
                    if (folderNode) {
                        folderNode.querySelector(".tree-node-icon").textContent = "folder_open";
                    }
                }
            }
            parent = parent.parentElement;
        }
    }

    explorerCollapseAll.addEventListener("click", () => {
        const openedFolders = fileTree.querySelectorAll(".tree-children");
        openedFolders.forEach(folder => {
            folder.style.display = "none";
        });
        const icons = fileTree.querySelectorAll(".folder .tree-node-icon");
        icons.forEach(icon => {
            icon.textContent = "folder";
        });
        treeSearchInput.value = "";
        fileTree.querySelectorAll(".tree-node").forEach(node => node.style.display = "flex");
        fileTree.querySelectorAll(".tree-folder-wrapper").forEach(wrapper => wrapper.style.display = "block");
    });

    convertButton.addEventListener("click", () => {
        if (!selectedPackageFile) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const arrayBuffer = e.target.result;
            let zipBlob;

            if (selectedPackageFile.name.endsWith(".crx")) {
                zipBlob = stripCrxHeaderToBlob(arrayBuffer);
            } else {
                zipBlob = new Blob([arrayBuffer], { type: "application/zip" });
            }

            const downloadName = selectedPackageFile.name.replace(/\.[^.]+$/, ".zip");
            const link = document.createElement("a");
            link.href = URL.createObjectURL(zipBlob);
            link.download = downloadName;
            link.click();
            URL.revokeObjectURL(link.href);
        };
        reader.readAsArrayBuffer(selectedPackageFile);
    });

    function openCodeInspector(zipEntry) {
        currentOpenEntry = zipEntry;
        codeViewerArea.textContent = "Loading file content...";
        dialogBreadcrumbs.textContent = zipEntry.name;
        codeDialog.style.display = "flex";
        document.getElementById("dialogTitle").textContent = zipEntry.name.split('/').pop();
        codeSearchInput.value = "";
        codeSearchCount.textContent = "0 of 0";

        preContainer.style.display = "block";
        mediaPreviewContainer.style.display = "none";
        beautifyCodeButton.disabled = false;

        const ext = zipEntry.name.split('.').pop().toLowerCase();
        const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'svg'];
        const binaryExtensions = ['woff', 'woff2', 'ttf', 'zip', 'crx', 'xpi', 'wasm', 'map'];

        if (imageExtensions.includes(ext)) {
            beautifyCodeButton.disabled = true;
            zipEntry.async("blob")
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    imagePreview.src = blobUrl;
                    imageType.textContent = `Type: image/${ext === 'svg' ? 'svg+xml' : ext}`;

                    imagePreview.onload = () => {
                        imageResolution.textContent = `${imagePreview.naturalWidth} x ${imagePreview.naturalHeight} pixels`;
                    };

                    preContainer.style.display = "none";
                    mediaPreviewContainer.style.display = "flex";
                });
            return;
        }

        if (binaryExtensions.includes(ext)) {
            codeViewerArea.textContent = `[Binary Asset: .${ext}]\nCannot read raw binary configurations directly inside the browser.`;
            document.getElementById("dialogFileIcon").textContent = "image";
            currentOpenCodeText = "";
            beautifyCodeButton.disabled = true;
            return;
        }

        document.getElementById("dialogFileIcon").textContent = "description";

        zipEntry.async("string")
            .then(text => {
                currentOpenCodeText = text;
                codeViewerArea.textContent = text;
                codeViewerArea.className = "code-box";
                if (ext === "js") codeViewerArea.classList.add("language-javascript");
                else if (ext === "json") codeViewerArea.classList.add("language-json");
                else if (ext === "css") codeViewerArea.classList.add("language-css");
                else if (ext === "html" || ext === "htm") codeViewerArea.classList.add("language-markup");

                if (window.Prism) {
                    Prism.highlightElement(codeViewerArea);
                }
            })
            .catch(err => {
                codeViewerArea.textContent = `Error rendering file content: ${err.message}`;
                currentOpenCodeText = "";
            });
    }

    downloadFileButton.addEventListener("click", () => {
        if (!currentOpenEntry) return;

        currentOpenEntry.async("blob")
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = currentOpenEntry.name.split('/').pop();
                a.click();
                URL.revokeObjectURL(url);
            });
    });

    beautifyCodeButton.addEventListener("click", () => {
        if (!currentOpenCodeText) return;
        const ext = currentOpenEntry.name.split('.').pop().toLowerCase();

        try {
            if (ext === "json") {
                const parsed = JSON.parse(currentOpenCodeText);
                currentOpenCodeText = JSON.stringify(parsed, null, 4);
            } else if (ext === "js" || ext === "css") {
                currentOpenCodeText = beautifyClientCode(currentOpenCodeText);
            }
            codeViewerArea.textContent = currentOpenCodeText;
            if (window.Prism) Prism.highlightElement(codeViewerArea);
        } catch (e) {
            alert("Beautifying failed. Content format error.");
        }
    });

    function beautifyClientCode(code) {
        let formatted = '';
        let indent = 0;
        const lines = code.split('\n');

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line.startsWith('}')) indent = Math.max(0, indent - 1);
            formatted += '    '.repeat(indent) + line + '\n';
            if (line.endsWith('{') || line.endsWith('[') || (line.includes('{') && !line.includes('}'))) indent++;
        }
        return formatted.trim();
    }

    codeSearchInput.addEventListener("input", performCodeSearch);

    function performCodeSearch() {
        const query = codeSearchInput.value;
        if (!query || !currentOpenCodeText) {
            codeViewerArea.textContent = currentOpenCodeText;
            if (window.Prism) Prism.highlightElement(codeViewerArea);
            codeSearchCount.textContent = "0 of 0";
            searchMatches = [];
            currentSearchIndex = -1;
            return;
        }

        const escapedText = currentOpenCodeText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${safeQuery})`, "gi");

        const highlightedHTML = escapedText.replace(regex, '<mark class="search-highlight">$1</mark>');
        codeViewerArea.innerHTML = highlightedHTML;

        searchMatches = Array.from(codeViewerArea.querySelectorAll(".search-highlight"));
        currentSearchIndex = searchMatches.length > 0 ? 0 : -1;
        updateSearchCounter();
    }

    function updateSearchCounter() {
        if (searchMatches.length === 0) {
            codeSearchCount.textContent = "0 of 0";
            return;
        }

        codeSearchCount.textContent = `${currentSearchIndex + 1} of ${searchMatches.length}`;

        searchMatches.forEach((m, idx) => {
            m.classList.remove("active-match");
            if (idx === currentSearchIndex) {
                m.classList.add("active-match");
                m.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    }

    codeSearchPrev.addEventListener("click", () => {
        if (searchMatches.length === 0) return;
        currentSearchIndex = (currentSearchIndex - 1 + searchMatches.length) % searchMatches.length;
        updateSearchCounter();
    });

    codeSearchNext.addEventListener("click", () => {
        if (searchMatches.length === 0) return;
        currentSearchIndex = (currentSearchIndex + 1) % searchMatches.length;
        updateSearchCounter();
    });

    closeDialogButton.addEventListener("click", () => {
        codeDialog.style.display = "none";
    });

    codeDialog.addEventListener("click", (e) => {
        if (e.target === codeDialog) {
            codeDialog.style.display = "none";
        }
    });

    copyCodeButton.addEventListener("click", () => {
        if (!currentOpenCodeText) return;
        navigator.clipboard.writeText(currentOpenCodeText)
            .then(() => {
                const origIcon = copyCodeButton.querySelector(".material-symbols-rounded") ? "check" : null;
                if (origIcon) {
                    const prevSymbol = copyCodeButton.querySelector(".material-symbols-rounded").textContent;
                    copyCodeButton.querySelector(".material-symbols-rounded").textContent = "check";
                    setTimeout(() => {
                        copyCodeButton.querySelector(".material-symbols-rounded").textContent = prevSymbol;
                    }, 1500);
                }
            })
            .catch(err => {
                console.error("Copy failed: ", err);
            });
    });

    function saveToHistory(extensionId, name, browser) {
        const history = JSON.parse(localStorage.getItem("extract_crx_history") || "[]");

        const filtered = history.filter(item => !(item.id === extensionId && item.browser === browser));

        filtered.unshift({
            id: extensionId,
            name: name,
            browser: browser,
            timestamp: Date.now()
        });

        if (filtered.length > 20) {
            filtered.pop();
        }

        localStorage.setItem("extract_crx_history", JSON.stringify(filtered));
    }

    function renderHistory() {
        const history = JSON.parse(localStorage.getItem("extract_crx_history") || "[]");

        if (history.length === 0) {
            historyPlaceholder.style.display = "flex";
            historyList.style.display = "none";
            clearHistoryBtn.style.display = "none";
            return;
        }

        historyPlaceholder.style.display = "none";
        historyList.innerHTML = "";

        const browserIconsMap = {
            chrome: 'chrome-icon',
            firefox: 'firefox-icon',
            opera: 'opera-icon',
            edge: 'edge-icon'
        };

        history.forEach(item => {
            const listItem = document.createElement("div");
            listItem.className = "md3-list-item";
            listItem.setAttribute("role", "listitem");

            const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            listItem.innerHTML = `
                <div class="list-item-avatar">
                    <span class="browser-icon ${browserIconsMap[item.browser]}"></span>
                </div>
                <div class="list-item-content">
                    <span class="list-item-headline">${item.name}</span>
                    <span class="list-item-subhead">ID: ${item.id} &bull; ${dateStr}</span>
                </div>
                <div class="list-item-actions">
                    <button type="button" class="md3-icon-button download-history-btn" title="Extract Again">
                        <span class="material-symbols-rounded">download</span>
                    </button>
                    <button type="button" class="md3-icon-button delete-history-btn" title="Delete Entry">
                        <span class="material-symbols-rounded">delete</span>
                    </button>
                </div>
            `;

            listItem.querySelector(".download-history-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                document.getElementById("tab-extract").click();
                document.getElementById(item.browser).checked = true;
                updateDownloadOptions();
                inputField.value = item.id;
                clearInputBtn.style.display = "flex";
                detectBrowserAndValidate(item.id);
            });

            listItem.querySelector(".delete-history-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                const freshHistory = JSON.parse(localStorage.getItem("extract_crx_history") || "[]");
                const remaining = freshHistory.filter(h => !(h.id === item.id && h.browser === item.browser));
                localStorage.setItem("extract_crx_history", JSON.stringify(remaining));
                renderHistory();
            });

            historyList.appendChild(listItem);
        });

        historyList.style.display = "flex";
        clearHistoryBtn.style.display = "inline-flex";
    }

    clearHistoryBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your download history?")) {
            localStorage.removeItem("extract_crx_history");
            renderHistory();
        }
    });

});