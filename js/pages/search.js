// js/pages/search.js - Search Results Page split screen with Leaflet Map

import { db, formatRupiah } from '../db.js?v=4';

let srpMap = null;
let srpMarkers = {};

export function renderSearch(container, params = {}) {
    // 1. Prepare Initial Filters from URL parameters
    const filterState = {
        transaction_type: params.transaction_type || 'sale',
        type: params.type || 'all',
        city: params.city || '',
        query: params.query || '',
        price_min: params.price_min || '',
        price_max: params.price_max || '',
        bedrooms: params.bedrooms || 'any',
        sort: params.sort || 'latest',
        favoritesOnly: params.favoritesOnly === 'true'
    };

    // Clean up map instance if already active to prevent duplicates
    if (srpMap) {
        srpMap.remove();
        srpMap = null;
        srpMarkers = {};
    }

    container.innerHTML = `
        <!-- Sticky Sub-Filter Header -->
        <div class="srp-sticky-filters">
            <select id="srp-filter-transaction" class="filter-select">
                <option value="sale" ${filterState.transaction_type === 'sale' ? 'selected' : ''}>Dijual</option>
                <option value="rent" ${filterState.transaction_type === 'rent' ? 'selected' : ''}>Disewakan</option>
            </select>
            
            <input type="text" id="srp-filter-query" class="filter-select" style="width: 180px; text-align: left; cursor: text;" placeholder="Cari kota/wilayah..." value="${filterState.query || filterState.city}">

            <select id="srp-filter-type" class="filter-select">
                <option value="all" ${filterState.type === 'all' ? 'selected' : ''}>Semua Tipe</option>
                <option value="house" ${filterState.type === 'house' ? 'selected' : ''}>Rumah</option>
                <option value="apartment" ${filterState.type === 'apartment' ? 'selected' : ''}>Apartemen</option>
                <option value="shophouse" ${filterState.type === 'shophouse' ? 'selected' : ''}>Ruko</option>
                <option value="land" ${filterState.type === 'land' ? 'selected' : ''}>Tanah</option>
            </select>

            <select id="srp-filter-price" class="filter-select">
                <option value="all">Semua Harga</option>
                <option value="0-500000000" ${filterState.price_max === '500000000' ? 'selected' : ''}>s/d 500 Jt</option>
                <option value="500000000-1500000000" ${filterState.price_min === '500000000' && filterState.price_max === '1500000000' ? 'selected' : ''}>500 Jt - 1.5 M</option>
                <option value="1500000000-3000000000" ${filterState.price_min === '1500000000' && filterState.price_max === '3000000000' ? 'selected' : ''}>1.5 M - 3 M</option>
                <option value="3000000000-10000000000" ${filterState.price_min === '3000000000' && filterState.price_max === '10000000000' ? 'selected' : ''}>3 M - 10 M</option>
                <option value="10000000000-999999999999" ${filterState.price_min === '10000000000' ? 'selected' : ''}>Di atas 10 M</option>
            </select>

            <select id="srp-filter-beds" class="filter-select">
                <option value="any" ${filterState.bedrooms === 'any' ? 'selected' : ''}>Semua Kamar</option>
                <option value="1" ${filterState.bedrooms === '1' ? 'selected' : ''}>1+ Kamar</option>
                <option value="2" ${filterState.bedrooms === '2' ? 'selected' : ''}>2+ Kamar</option>
                <option value="3" ${filterState.bedrooms === '3' ? 'selected' : ''}>3+ Kamar</option>
                <option value="4" ${filterState.bedrooms === '4' ? 'selected' : ''}>4+ Kamar</option>
            </select>
        </div>

        <div class="srp-container">
            <!-- Left Listings Panel -->
            <div class="srp-left-panel">
                <div class="srp-results-header">
                    <div class="srp-results-count">
                        Menampilkan <span id="results-count-num">0</span> Properti
                        ${filterState.favoritesOnly ? ' <span class="text-blue">(Favorit Anda)</span>' : ''}
                    </div>
                    <div>
                        <label for="srp-sort" style="font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-right: 6px;">Urutkan:</label>
                        <select id="srp-sort" class="filter-select" style="padding: 6px 12px;">
                            <option value="latest" ${filterState.sort === 'latest' ? 'selected' : ''}>Terbaru</option>
                            <option value="price-asc" ${filterState.sort === 'price-asc' ? 'selected' : ''}>Harga Terendah</option>
                            <option value="price-desc" ${filterState.sort === 'price-desc' ? 'selected' : ''}>Harga Tertinggi</option>
                        </select>
                    </div>
                </div>
                
                <div class="srp-listings-grid" id="srp-listings-mount">
                    <!-- Cards will render here -->
                </div>
            </div>

            <!-- Right Map Panel -->
            <div class="srp-right-panel">
                <label class="map-search-control" id="map-bounds-toggle">
                    <input type="checkbox" id="map-bounds-checkbox" checked>
                    <span>Cari seiring peta digeser</span>
                </label>
                <div id="map"></div>
            </div>
        </div>
    `;

    // Fetch and render initial data
    updateListings();
    initSrpMap();

    // 2. Initialize Leaflet Map
    function initSrpMap() {
        const listings = getFilteredData();
        
        // Default center is Jakarta
        let mapCenter = [-6.2088, 106.8456]; 
        
        // If results exist, center on the first listing
        if (listings.length > 0) {
            mapCenter = [listings[0].lat, listings[0].lng];
        }

        srpMap = L.map('map', {
            zoomControl: false
        }).setView(mapCenter, 12);

        // Add Zoom Control to bottom-right
        L.control.zoom({ position: 'bottomright' }).addTo(srpMap);

        // Add OSM Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(srpMap);

        plotMarkers(listings);

        // Map pan/zoom listener
        srpMap.on('dragend zoomend', () => {
            const checkbox = document.getElementById('map-bounds-checkbox');
            if (checkbox && checkbox.checked) {
                updateListingsByMapBounds();
            }
        });
    }

    // Retrieve active listings from DB based on current filter state
    function getFilteredData() {
        let data = db.getProperties(filterState);

        if (filterState.favoritesOnly) {
            const favIds = db.getFavorites();
            data = data.filter(item => favIds.includes(item.id));
        }

        return data;
    }

    // Helper to bind all interactive events on listing cards
    function bindCardEvents(mount) {
        if (!mount) return;

        // Bind clicks on listing cards
        mount.querySelectorAll('.property-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.card-favorite-btn') || e.target.closest('a')) return;
                window.location.hash = `#property?id=${card.dataset.id}`;
            });

            // Sync Hover states to map markers
            card.addEventListener('mouseenter', () => {
                const id = card.dataset.id;
                const marker = srpMarkers[id];
                if (marker) {
                    const el = marker.getElement()?.querySelector('.price-marker-label');
                    if (el) el.classList.add('active');
                }
            });

            card.addEventListener('mouseleave', () => {
                const id = card.dataset.id;
                const marker = srpMarkers[id];
                if (marker) {
                    const el = marker.getElement()?.querySelector('.price-marker-label');
                    if (el) el.classList.remove('active');
                }
            });
        });

        // Bind favorite buttons
        mount.querySelectorAll('.card-favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const isFav = db.toggleFavorite(id);
                btn.classList.toggle('active', isFav);
                showToast(isFav ? 'Properti disimpan ke favorit' : 'Properti dihapus dari favorit');
                
                if (filterState.favoritesOnly) {
                    // Refresh listing if in favorites page
                    updateListings();
                    if (srpMap) plotMarkers(getFilteredData());
                }
            });
        });
    }

    // Renders the list items and updates markers
    function updateListings() {
        const mount = document.getElementById('srp-listings-mount');
        const countSpan = document.getElementById('results-count-num');
        if (!mount) return;

        const data = getFilteredData();
        countSpan.textContent = data.length;

        if (data.length === 0) {
            mount.innerHTML = `
                <div style="text-align: center; padding: 60px 0; color: var(--text-secondary);">
                    <i class="fa-solid fa-house-circle-xmark" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
                    <p style="font-size: 16px; font-weight: 700;">Properti Tidak Ditemukan</p>
                    <p style="font-size: 14px; margin-top: 4px;">Cobalah memperluas jangkauan filter pencarian Anda.</p>
                </div>
            `;
            return;
        }

        mount.innerHTML = data.map(item => {
            // Calculate KPR Monthly Installment
            const estInstallment = Math.round((item.price * 0.8) * 0.0075);
            return `
                <div class="property-card horizontal-card" data-id="${item.id}" id="card-${item.id}">
                    <div class="card-img-wrapper">
                        <img src="${item.images[0]}" class="card-img" alt="${item.title}">
                        <span class="card-badge ${item.transaction_type === 'rent' ? 'rent' : ''}">
                            ${item.transaction_type === 'sale' ? 'DIJUAL' : 'DISEWA'}
                        </span>
                        <button class="card-favorite-btn ${db.isFavorite(item.id) ? 'active' : ''}" data-id="${item.id}">
                            <i class="fa-solid fa-heart"></i>
                        </button>
                    </div>
                    <div class="card-content">
                        <div class="card-price-row">
                            <div class="card-price">${formatRupiah(item.price)}${item.transaction_type === 'rent' ? '/thn' : ''}</div>
                            <div class="card-price-est">~ ${formatRupiah(estInstallment)}/bln</div>
                        </div>
                        <h3 class="card-title">${item.title}</h3>
                        <p class="card-address"><i class="fa-solid fa-location-dot"></i> ${item.address}</p>
                        
                        <!-- Micro-Badges for Proximity and Flood Safety -->
                        <div class="card-micro-badges">
                            ${item.is_flood_free ? `<span class="micro-badge flood-free"><i class="fa-solid fa-circle-check text-green"></i> Aman Banjir</span>` : ''}
                            ${item.transit_distance ? `<span class="micro-badge commute-close"><i class="fa-solid fa-train text-blue"></i> ${item.transit_distance} mnt ke MRT</span>` : ''}
                        </div>

                        <div class="card-specs" style="padding-top: 10px; margin-top: auto;">
                            <span class="spec-item"><i class="fa-solid fa-bed"></i> ${item.bedrooms} KT</span>
                            <span class="spec-item"><i class="fa-solid fa-bath"></i> ${item.bathrooms} KM</span>
                            <span class="spec-item"><i class="fa-solid fa-ruler-combined"></i> ${item.building_size}m²</span>
                            
                            <a href="https://wa.me/${item.agent.phone}?text=${encodeURIComponent('Halo ' + item.agent.name + ', saya ingin bertanya mengenai properti: ' + item.title + ' (' + item.id + ')')}" 
                               target="_blank" 
                               class="btn btn-primary btn-sm flex-center" 
                               style="padding: 6px 12px; font-weight: 700; border-radius: var(--radius-sm); margin-left: auto; background-color: #25D366; gap: 4px; border: none; color: white;">
                                <i class="fa-brands fa-whatsapp" style="font-size:14px"></i> WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        bindCardEvents(mount);
    }

    // Plots marker overlays on the Leaflet map canvas
    function plotMarkers(listings) {
        // Clear existing markers
        Object.keys(srpMarkers).forEach(id => {
            srpMap.removeLayer(srpMarkers[id]);
        });
        srpMarkers = {};

        listings.forEach(item => {
            const shortPrice = formatShortPrice(item.price);
            
            // Custom HTML DIV Marker matching our wireframe design guidelines
            const customIcon = L.divIcon({
                className: 'custom-leaflet-marker',
                html: `<div class="price-marker-label" id="marker-${item.id}">${shortPrice}</div>`,
                iconSize: [60, 30],
                iconAnchor: [30, 15]
            });

            const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(srpMap);

            // Pop up trigger on click
            marker.bindPopup(`
                <div class="price-marker-popup" style="width: 190px;">
                    <img src="${item.images[0]}" style="width: 100%; height: 96px; object-fit: cover; border-radius: var(--radius-sm); margin-bottom: 8px;">
                    <strong style="color: var(--color-primary); font-size: 15px; display: block; margin-bottom: 2px;">${formatRupiah(item.price)}</strong>
                    <div style="font-size: 12px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; color: var(--text-primary); margin-bottom: 6px;">${item.title}</div>
                    <a href="#property?id=${item.id}" style="color: var(--color-primary); font-size: 12px; font-weight: 800; text-decoration: none; display: block;">Lihat Rincian &rarr;</a>
                </div>
            `);

            // Link hovers to highlight target listing card
            marker.on('mouseover', () => {
                const card = document.getElementById(`card-${item.id}`);
                if (card) {
                    card.style.borderColor = 'var(--color-primary)';
                    card.style.transform = 'translateY(-4px)';
                    card.style.boxShadow = 'var(--shadow-lg)';
                }
            });

            marker.on('mouseout', () => {
                const card = document.getElementById(`card-${item.id}`);
                if (card) {
                    card.style.borderColor = '';
                    card.style.transform = '';
                    card.style.boxShadow = '';
                }
            });

            srpMarkers[item.id] = marker;
        });
    }

    // Dynamic filtering within spatial coordinate bounds
    function updateListingsByMapBounds() {
        const bounds = srpMap.getBounds();
        const listings = getFilteredData();

        const filtered = listings.filter(item => {
            return bounds.contains([item.lat, item.lng]);
        });

        // Re-render list panel
        const mount = document.getElementById('srp-listings-mount');
        const countSpan = document.getElementById('results-count-num');
        if (mount && countSpan) {
            countSpan.textContent = filtered.length;
            if (filtered.length === 0) {
                mount.innerHTML = `
                    <div style="text-align: center; padding: 60px 0; color: var(--text-secondary);">
                        <p style="font-size: 14px;">Tidak ada properti di area peta ini.</p>
                    </div>
                `;
                return;
            }

            mount.innerHTML = filtered.map(item => {
                const estInstallment = Math.round((item.price * 0.8) * 0.0075);
                return `
                    <div class="property-card horizontal-card" data-id="${item.id}" id="card-${item.id}">
                        <div class="card-img-wrapper">
                            <img src="${item.images[0]}" class="card-img" alt="${item.title}">
                            <span class="card-badge ${item.transaction_type === 'rent' ? 'rent' : ''}">
                                ${item.transaction_type === 'sale' ? 'DIJUAL' : 'DISEWA'}
                            </span>
                            <button class="card-favorite-btn ${db.isFavorite(item.id) ? 'active' : ''}" data-id="${item.id}">
                                <i class="fa-solid fa-heart"></i>
                            </button>
                        </div>
                        <div class="card-content">
                            <div class="card-price-row">
                                <div class="card-price">${formatRupiah(item.price)}${item.transaction_type === 'rent' ? '/thn' : ''}</div>
                                <div class="card-price-est">~ ${formatRupiah(estInstallment)}/bln</div>
                            </div>
                            <h3 class="card-title">${item.title}</h3>
                            <p class="card-address"><i class="fa-solid fa-location-dot"></i> ${item.address}</p>
                            
                            <!-- Micro-Badges for Proximity and Flood Safety -->
                            <div class="card-micro-badges">
                                ${item.is_flood_free ? `<span class="micro-badge flood-free"><i class="fa-solid fa-circle-check text-green"></i> Aman Banjir</span>` : ''}
                                ${item.transit_distance ? `<span class="micro-badge commute-close"><i class="fa-solid fa-train text-blue"></i> ${item.transit_distance} mnt ke MRT</span>` : ''}
                            </div>

                            <div class="card-specs" style="padding-top: 10px; margin-top: auto;">
                                <span class="spec-item"><i class="fa-solid fa-bed"></i> ${item.bedrooms} KT</span>
                                <span class="spec-item"><i class="fa-solid fa-bath"></i> ${item.bathrooms} KM</span>
                                <span class="spec-item"><i class="fa-solid fa-ruler-combined"></i> ${item.building_size}m²</span>
                                
                                <a href="https://wa.me/${item.agent.phone}?text=${encodeURIComponent('Halo ' + item.agent.name + ', saya tertarik pada listing: ' + item.title)}" 
                                   target="_blank" 
                                   class="btn btn-primary btn-sm flex-center" 
                                   style="padding: 6px 12px; font-weight: 700; border-radius: var(--radius-sm); margin-left: auto; background-color: #25D366; gap: 4px; border: none; color: white;">
                                    <i class="fa-brands fa-whatsapp" style="font-size:14px"></i> WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            bindCardEvents(mount);
        }
    }

    // Helper format short price for map marker (e.g. 1.2M, 850Jt)
    function formatShortPrice(price) {
        if (price >= 1000000000) {
            return (price / 1000000000).toFixed(1).replace('.0', '') + ' M';
        }
        return (price / 1000000).toFixed(0) + ' Jt';
    }

    // 3. Binding Sticky Filters Interactions
    const bindFilter = (elementId, stateKey) => {
        document.getElementById(elementId)?.addEventListener('change', (e) => {
            filterState[stateKey] = e.target.value;
            updateListings();
            const refreshed = getFilteredData();
            if (srpMap) {
                plotMarkers(refreshed);
                if (refreshed.length > 0) {
                    srpMap.panTo([refreshed[0].lat, refreshed[0].lng]);
                }
            }
        });
    };

    bindFilter('srp-filter-transaction', 'transaction_type');
    bindFilter('srp-filter-type', 'type');
    bindFilter('srp-sort', 'sort');

    // Query text box (debounced trigger)
    let queryTimeout = null;
    document.getElementById('srp-filter-query')?.addEventListener('input', (e) => {
        clearTimeout(queryTimeout);
        queryTimeout = setTimeout(() => {
            filterState.query = e.target.value.trim();
            updateListings();
            const refreshed = getFilteredData();
            if (srpMap) {
                plotMarkers(refreshed);
                if (refreshed.length > 0) {
                    srpMap.panTo([refreshed[0].lat, refreshed[0].lng]);
                }
            }
        }, 400);
    });

    // Price Filter
    document.getElementById('srp-filter-price')?.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'all') {
            filterState.price_min = '';
            filterState.price_max = '';
        } else {
            const [min, max] = val.split('-');
            filterState.price_min = min;
            filterState.price_max = max;
        }
        updateListings();
        if (srpMap) plotMarkers(getFilteredData());
    });

    // Bedroom Filter
    document.getElementById('srp-filter-beds')?.addEventListener('change', (e) => {
        filterState.bedrooms = e.target.value;
        updateListings();
        if (srpMap) plotMarkers(getFilteredData());
    });
}
