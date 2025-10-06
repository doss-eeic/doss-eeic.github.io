// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="preface.html"><strong aria-hidden="true">1.</strong> 前口上 (心の準備)</a></li><li class="chapter-item expanded "><a href="vm.html"><strong aria-hidden="true">2.</strong> (任意) 開発用の仮想環境の構築</a></li><li class="chapter-item expanded "><a href="download_source.html"><strong aria-hidden="true">3.</strong> ソースコードを入手</a></li><li class="chapter-item expanded "><a href="dbg_build.html"><strong aria-hidden="true">4.</strong> 開発・デバッグ用のビルド</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="autotools_cmake.html"><strong aria-hidden="true">4.1.</strong> C/C++ + autotools/cmake 編</a></li><li class="chapter-item expanded "><a href="python_venv_pip.html"><strong aria-hidden="true">4.2.</strong> Python + venv + pip 編</a></li><li class="chapter-item expanded "><a href="js_nvm_npm.html"><strong aria-hidden="true">4.3.</strong> Javascript (node.js) + nvm + npm 編</a></li></ol></li><li class="chapter-item expanded "><a href="search_src_code.html"><strong aria-hidden="true">5.</strong> ソースコードを検索する</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="grep.html"><strong aria-hidden="true">5.1.</strong> grep</a></li><li class="chapter-item expanded "><a href="xref.html"><strong aria-hidden="true">5.2.</strong> クロスリファレンスツール</a></li></ol></li><li class="chapter-item expanded "><a href="debugger.html"><strong aria-hidden="true">6.</strong> デバッガで動作を追跡する</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="gdb.html"><strong aria-hidden="true">6.1.</strong> C/C++ (gdb) 編</a></li><li class="chapter-item expanded "><a href="pdb.html"><strong aria-hidden="true">6.2.</strong> Python (pdb) 編</a></li><li class="chapter-item expanded "><a href="node_dbg.html"><strong aria-hidden="true">6.3.</strong> Javascript (node.js) 編</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
