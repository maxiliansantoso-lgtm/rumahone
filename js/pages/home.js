// js/pages/home.js - Homepage rendering and interactions

import { db, formatRupiah } from '../db.js?v=4';

export function renderHome(container) {
    let currentTab = 'sale'; // 'sale' | 'rent' | 'new-launch'

    container.innerHTML = `
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="container">
                <h1 class="hero-title">Temukan Properti Impian Anda Di Sini</h1>
                <p class="hero-subtitle">Cari Rumah, Apartemen, Ruko, dan Tanah 100% Terverifikasi di Indonesia</p>
                
                <div class="search-box-container">
                    <div class="search-tabs">
                        <button class="search-tab active" data-tab="sale">Beli</button>
                        <button class="search-tab" data-tab="rent">Sewa</button>
                        <button class="search-tab" data-tab="new-launch">Proyek Baru</button>
                    </div>
                    
                    <div class="search-form-grid">
                        <div class="form-group">
                            <label for="search-input">Lokasi / Nama Proyek</label>
                            <input type="text" id="search-input" class="form-input" placeholder="Masukkan kota, wilayah, atau proyek..." autocomplete="off">
                            <div id="autocomplete-suggestions" class="autocomplete-box"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="type-select">Tipe Properti</label>
                            <select id="type-select" class="form-input">
                                <option value="all">Semua Tipe</option>
                                <option value="house">Rumah</option>
                                <option value="apartment">Apartemen</option>
                                <option value="shophouse">Ruko</option>
                                <option value="land">Tanah</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="price-select">Kisaran Harga</label>
                            <select id="price-select" class="form-input">
                                <option value="all">Semua Harga</option>
                                <option value="0-500000000">s/d Rp 500 Jt</option>
                                <option value="500000000-1500000000">Rp 500 Jt - Rp 1.5 M</option>
                                <option value="1500000000-3000000000">Rp 1.5 M - Rp 3 M</option>
                                <option value="3000000000-10000000000">Rp 3 M - Rp 10 M</option>
                                <option value="10000000000-999999999999">Di atas Rp 10 M</option>
                            </select>
                        </div>
                        
                        <button id="hero-search-btn" class="search-submit-btn">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </div>

                    <!-- CRO Instant KPR Pre-Check Hook -->
                    <div class="kpr-hook-widget">
                        <div class="kpr-hook-left">
                            <div class="kpr-hook-icon">
                                <i class="fa-solid fa-calculator"></i>
                            </div>
                            <div>
                                <div class="kpr-hook-title">Cek Limit KPR Instan</div>
                                <div class="kpr-hook-desc">Ketahui kemampuan beli hunian Anda dalam 3 menit, kerja sama dengan bank mitra SatuRumah.</div>
                            </div>
                        </div>
                        <button class="kpr-hook-btn" id="home-kpr-btn">Cek Sekarang</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Featured Projects Section -->
        <section class="section-padding container">
            <div class="section-header">
                <div>
                    <h2 class="section-title">Proyek Pengembang Pilihan</h2>
                    <p style="color: var(--text-secondary); margin-top: 4px; font-weight: 500;">Pilihan perumahan dan apartemen baru dari developer ternama</p>
                </div>
                <a href="#search?is_featured=true" class="section-link">Lihat Semua <i class="fa-solid fa-arrow-right"></i></a>
            </div>
            
            <div class="featured-grid" id="featured-projects-mount"></div>
        </section>

        <!-- Regional Cities Section -->
        <section class="section-padding" style="background-color: var(--bg-card); border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
            <div class="container">
                <div class="section-header">
                    <div>
                        <h2 class="section-title">Cari Properti di Kota Populer</h2>
                        <p style="color: var(--text-secondary); margin-top: 4px; font-weight: 500;">Telusuri listing terbaik di kota-kota besar di Indonesia</p>
                    </div>
                </div>
                
                <div class="regional-grid">
                    <div class="regional-card grid-span-2-row" data-city="Jakarta Selatan">
                        <img src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c26e?w=800&auto=format&fit=crop" class="regional-bg" alt="Jakarta Selatan">
                        <div class="regional-content">
                            <h3 class="regional-name">Jakarta Selatan</h3>
                            <span class="regional-count">Temukan 8,240 properti</span>
                        </div>
                    </div>
                    
                    <div class="regional-card" data-city="Surabaya">
                        <img src="https://images.unsplash.com/photo-1596436889106-be35e843f974?w=500&auto=format&fit=crop" class="regional-bg" alt="Surabaya">
                        <div class="regional-content">
                            <h3 class="regional-name">Surabaya</h3>
                            <span class="regional-count">5,110 properti</span>
                        </div>
                    </div>

                    <div class="regional-card" data-city="Bandung">
                        <img src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop" class="regional-bg" alt="Bandung">
                        <div class="regional-content">
                            <h3 class="regional-name">Bandung</h3>
                            <span class="regional-count">4,930 properti</span>
                        </div>
                    </div>

                    <div class="regional-card" data-city="Tangerang">
                        <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop" class="regional-bg" alt="Tangerang">
                        <div class="regional-content">
                            <h3 class="regional-name">Tangerang</h3>
                            <span class="regional-count">3,850 properti</span>
                        </div>
                    </div>

                    <div class="regional-card" data-city="Depok">
                        <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&auto=format&fit=crop" class="regional-bg" alt="Depok">
                        <div class="regional-content">
                            <h3 class="regional-name">Depok</h3>
                            <span class="regional-count">2,410 properti</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;

    // 1. Tab Event Listeners
    const tabs = container.querySelectorAll('.search-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.tab;
            
            // Adjust input placeholder based on context
            const input = container.querySelector('#search-input');
            if (currentTab === 'new-launch') {
                input.placeholder = 'Cari proyek apartemen, klaster perumahan baru...';
            } else {
                input.placeholder = 'Masukkan kota, wilayah, atau proyek...';
            }
        });
    });

    // 2. Autocomplete Mechanics
    const searchInput = container.querySelector('#search-input');
    const suggestionsBox = container.querySelector('#autocomplete-suggestions');
    const availableLocations = ['Jakarta Selatan', 'Jakarta Barat', 'Tangerang', 'Bandung', 'Surabaya', 'Depok', 'Kemang', 'Margonda', 'Dago', 'Pakuwon'];

    searchInput.addEventListener('input', (e) => {
        const value = e.target.value.trim().toLowerCase();
        if (!value) {
            suggestionsBox.style.display = 'none';
            return;
        }

        const filtered = availableLocations.filter(loc => loc.toLowerCase().includes(value));
        if (filtered.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }

        suggestionsBox.innerHTML = filtered.map(loc => `
            <div class="autocomplete-item" data-value="${loc}">
                <i class="fa-solid fa-location-dot text-blue"></i>
                <span>${loc}</span>
            </div>
        `).join('');
        suggestionsBox.style.display = 'block';

        // Bind clicks on items
        suggestionsBox.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                searchInput.value = item.dataset.value;
                suggestionsBox.style.display = 'none';
            });
        });
    });

    // Hide autocomplete on click outside
    document.addEventListener('click', (e) => {
        if (e.target !== searchInput && e.target !== suggestionsBox) {
            suggestionsBox.style.display = 'none';
        }
    });

    // 3. Search Action Redirection
    const searchBtn = container.querySelector('#hero-search-btn');
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        const type = container.querySelector('#type-select').value;
        const priceRange = container.querySelector('#price-select').value;

        let hash = `#search?transaction_type=${currentTab === 'new-launch' ? 'sale' : currentTab}`;
        if (query) hash += `&query=${encodeURIComponent(query)}`;
        if (type && type !== 'all') hash += `&type=${type}`;
        
        if (priceRange && priceRange !== 'all') {
            const [min, max] = priceRange.split('-');
            hash += `&price_min=${min}&price_max=${max}`;
        }
        if (currentTab === 'new-launch') {
            hash += `&is_featured=true`;
        }

        window.location.hash = hash;
    });

    // KPR Precheck dialog trigger
    container.querySelector('#home-kpr-btn').addEventListener('click', () => {
        showToast('Form pre-approval KPR sedang disiapkan oleh bank mitra kami.');
    });

    // 4. Render Featured Project Cards
    const featuredMount = container.querySelector('#featured-projects-mount');
    const featuredListings = db.getProperties({ sort: 'latest' }).filter(item => item.is_featured).slice(0, 3);

    featuredMount.innerHTML = featuredListings.map(item => {
        // Calculate monthly installment estimate for featured listings
        const estInstallment = Math.round((item.price * 0.8) * 0.0075); 
        return `
            <div class="property-card" data-id="${item.id}">
                <div class="card-img-wrapper">
                    <img src="${item.images[0]}" class="card-img" alt="${item.title}">
                    <div class="card-badge verified">
                        <i class="fa-solid fa-circle-check"></i> Proyek Pilihan
                    </div>
                    <button class="card-favorite-btn ${db.isFavorite(item.id) ? 'active' : ''}" data-id="${item.id}">
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
                <div class="card-content">
                    <div class="card-price-row">
                        <div class="card-price">Mulai ${formatRupiah(item.price)}</div>
                        <div class="card-price-est">~ ${formatRupiah(estInstallment)}/bln</div>
                    </div>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-address"><i class="fa-solid fa-location-dot"></i> ${item.address}</p>
                    
                    <!-- Micro-Badges for Proximity and Flood Safety -->
                    <div class="card-micro-badges">
                        ${item.is_flood_free ? `<span class="micro-badge flood-free"><i class="fa-solid fa-circle-check text-green"></i> Aman Banjir</span>` : ''}
                        ${item.transit_distance ? `<span class="micro-badge commute-close"><i class="fa-solid fa-train text-blue"></i> ${item.transit_distance} mnt ke MRT</span>` : ''}
                    </div>

                    <div class="card-specs">
                        ${item.bedrooms ? `<span class="spec-item"><i class="fa-solid fa-bed"></i> ${item.bedrooms} KT</span>` : ''}
                        ${item.bathrooms ? `<span class="spec-item"><i class="fa-solid fa-bath"></i> ${item.bathrooms} KM</span>` : ''}
                        ${item.building_size ? `<span class="spec-item"><i class="fa-solid fa-ruler-combined"></i> ${item.building_size}m²</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Bind card detail navigation clicks
    featuredMount.querySelectorAll('.property-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Avoid navigation if clicking the favorite button
            if (e.target.closest('.card-favorite-btn')) return;
            window.location.hash = `#property?id=${card.dataset.id}`;
        });
    });

    // Bind favorite buttons
    featuredMount.querySelectorAll('.card-favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const isFav = db.toggleFavorite(id);
            btn.classList.toggle('active', isFav);
            showToast(isFav ? 'Properti disimpan ke favorit' : 'Properti dihapus dari favorit');
        });
    });

    // 5. Bind Regional Cards click
    container.querySelectorAll('.regional-card').forEach(card => {
        card.addEventListener('click', () => {
            window.location.hash = `#search?city=${encodeURIComponent(card.dataset.city)}`;
        });
    });
}
