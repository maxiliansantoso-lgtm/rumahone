// js/router.js - ES6 Router implementation

import { renderHeader } from './components/header.js?v=4';
import { renderFooter } from './components/footer.js?v=4';
import { renderHome } from './pages/home.js?v=4';
import { renderSearch } from './pages/search.js?v=4';
import { renderProperty } from './pages/property.js?v=4';
import { renderAddProperty } from './pages/add-property.js?v=4';
import { renderProfile } from './pages/profile.js?v=4';

// Simple URL Hash parser helper
// E.g., "#search?transaction_type=sale&city=Jakarta"
// Returns: { route: "search", params: { transaction_type: "sale", city: "Jakarta" } }
function parseHash(hash) {
    if (!hash || hash === '#') {
        return { route: 'home', params: {} };
    }

    const pathParts = hash.slice(1).split('?');
    const route = pathParts[0];
    const params = {};

    if (pathParts[1]) {
        const urlParams = new URLSearchParams(pathParts[1]);
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
    }

    return { route, params };
}

// Router handler mapping paths to specific render functions
function router() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    // Reset view container scroll
    window.scrollTo(0, 0);

    const { route, params } = parseHash(window.location.hash);

    switch (route) {
        case 'home':
            renderHome(appContainer);
            break;
        case 'search':
            renderSearch(appContainer, params);
            break;
        case 'property':
            if (params.id) {
                renderProperty(appContainer, params.id);
            } else {
                window.location.hash = '#home';
            }
            break;
        case 'favorites':
            renderSearch(appContainer, { favoritesOnly: 'true' });
            break;
        case 'add-property':
            renderAddProperty(appContainer);
            break;
        case 'profile':
            renderProfile(appContainer);
            break;
        default:
            appContainer.innerHTML = `
                <div class="container section-padding text-center" style="min-height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <h2 style="font-size: 32px; font-weight: 800; margin-bottom: 12px; color: var(--text-primary);">Halaman Tidak Ditemukan</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 24px;">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
                    <a href="#home" class="btn btn-primary">Kembali ke Beranda</a>
                </div>
            `;
    }
}

function init() {
    renderHeader();
    renderFooter();
    router();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

window.addEventListener('hashchange', router);
