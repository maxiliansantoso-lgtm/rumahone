// js/components/header.js - Navigation Header component

import { db } from '../db.js?v=4';

export function renderHeader() {
    const container = document.getElementById('header-mount');
    if (!container) return;

    const profile = db.getUserProfile();
    let navActionsHtml = `
        <a href="#add-property" class="btn btn-outline" id="btn-add-property" style="display: flex; align-items: center; gap: 8px; border: 1.5px solid var(--color-primary); color: var(--color-primary); font-weight: 600; padding: 8px 16px; border-radius: var(--radius-sm); transition: all 0.2s;">
            <i class="fa-solid fa-circle-plus"></i> Pasang Iklan
        </a>
    `;

    if (profile) {
        navActionsHtml += `
            <a href="#profile" class="nav-profile-link" style="display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--text-primary); font-weight: 600; padding: 4px 8px; border-radius: var(--radius-sm); transition: background 0.2s;">
                <img src="${profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop'}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-primary);">
                <span>${profile.name}</span>
            </a>
        `;
    } else {
        navActionsHtml += `
            <a href="#profile" class="btn btn-outline" style="text-decoration: none; display: flex; align-items: center; justify-content: center; height: 38px;">Masuk</a>
            <a href="#profile" class="btn btn-primary" style="text-decoration: none; display: flex; align-items: center; justify-content: center; height: 38px;">Daftar</a>
        `;
    }

    container.innerHTML = `
        <header class="main-header">
            <div class="container header-container">
                <a href="#home" class="logo-link">
                    <span class="logo-icon">S</span>
                    <span>SatuRumah</span>
                </a>
                <nav>
                    <ul class="nav-links">
                        <li><a href="#search?transaction_type=sale" class="nav-link" id="nav-buy">Beli</a></li>
                        <li><a href="#search?transaction_type=rent" class="nav-link" id="nav-rent">Sewa</a></li>
                        <li>
                            <a href="#favorites" class="nav-link" id="nav-favs" style="display: flex; align-items: center; gap: 6px;">
                                <i class="fa-regular fa-heart"></i> Favorit 
                                <span id="header-fav-count" style="background-color: var(--color-primary); color: white; font-size: 11px; padding: 2px 6px; border-radius: 10px; font-weight: 700; display: none;">0</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                <div class="nav-actions">
                    ${navActionsHtml}
                </div>
            </div>
        </header>
    `;

    const favBadge = document.getElementById('header-fav-count');

    // Update Favorites count in Header
    const updateFavCount = () => {
        const favs = db.getFavorites();
        if (favBadge) {
            if (favs.length > 0) {
                favBadge.textContent = favs.length;
                favBadge.style.display = 'inline-block';
            } else {
                favBadge.style.display = 'none';
            }
        }
    };

    // Highlight active nav item based on route
    const updateActiveNav = () => {
        const hash = window.location.hash;
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        
        if (hash.includes('transaction_type=sale')) {
            document.getElementById('nav-buy')?.classList.add('active');
        } else if (hash.includes('transaction_type=rent')) {
            document.getElementById('nav-rent')?.classList.add('active');
        } else if (hash === '#favorites') {
            document.getElementById('nav-favs')?.classList.add('active');
        }
    };

    window.addEventListener('hashchange', updateActiveNav);
    window.addEventListener('favoritesUpdated', updateFavCount);
    
    // Bind profile updates to refresh header dynamically
    window.removeEventListener('profileUpdated', renderHeader);
    window.addEventListener('profileUpdated', renderHeader);
    
    updateActiveNav();
    updateFavCount();
}

// Global utility for showing toast notifications
export function showToast(message) {
    const mount = document.getElementById('toast-mount');
    if (!mount) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info text-blue"></i> <span>${message}</span>`;
    
    mount.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
window.showToast = showToast; // Bind globally for convenience
