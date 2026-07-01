// js/pages/property.js - Property Detail Page (PDP) rendering and logic

import { db, formatRupiah } from '../db.js?v=5';

export function renderProperty(container, propertyId) {
    const property = db.getPropertyById(propertyId);

    if (!property) {
        container.innerHTML = `
            <div class="container section-padding text-center" style="min-height: 400px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <h2 style="font-size: 28px; font-weight: 800; color: var(--text-primary); margin-bottom: 12px;">Listing Properti Tidak Ditemukan</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">Kemungkinan properti telah terjual, disewakan, atau dinonaktifkan.</p>
                <a href="#search" class="btn btn-primary">Kembali ke Cari Properti</a>
            </div>
        `;
        return;
    }

    // Determine secondary images or fallback mock images
    const images = property.images;
    const mainImg = images[0];
    const sideImg1 = images[1] || 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&auto=format&fit=crop';
    const sideImg2 = images[2] || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&auto=format&fit=crop';
    const sideImg3 = images[3] || 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&auto=format&fit=crop';

    // Calculate initial estimated KPR monthly installment
    const estInstallment = Math.round((property.price * 0.8) * 0.0075);

    container.innerHTML = `
        <div class="container pdp-wrapper">
            <!-- Back Button and Breadcrumbs Header -->
            <div class="pdp-top-nav">
                <button class="pdp-back-btn" id="pdp-back-btn">
                    <i class="fa-solid fa-arrow-left"></i> Kembali
                </button>
                <div class="pdp-breadcrumbs">
                    <a href="#home">Beranda</a> &gt; 
                    <a href="#search?city=${encodeURIComponent(property.city)}">${property.city}</a> &gt; 
                    <a href="#search?type=${property.type}">${property.type === 'house' ? 'Rumah' : property.type === 'apartment' ? 'Apartemen' : 'Properti'}</a> &gt; 
                    <span style="color: var(--text-primary); font-weight: 600;">${property.title}</span>
                </div>
            </div>

            <!-- High-Res Photo Grid -->
            <div class="pdp-gallery-grid">
                <div class="pdp-gallery-main" id="pdp-gallery-trigger" data-index="0">
                    <img src="${mainImg}" alt="${property.title}">
                </div>
                <div class="pdp-gallery-side" data-index="1">
                    <img src="${sideImg1}" alt="Interior 1">
                </div>
                <div class="pdp-gallery-side" data-index="2" style="position: relative;">
                    <img src="${sideImg2}" alt="Interior 2">
                    <div class="pdp-view-all-overlay">
                        <i class="fa-solid fa-images" style="font-size: 22px; margin-bottom: 8px;"></i>
                        <span>Lihat Semua Foto (${images.length})</span>
                    </div>
                </div>
            </div>

            <!-- Main Flex Layout -->
            <div class="pdp-layout">
                <!-- Left Content Column -->
                <div class="pdp-left-col">
                    <div class="pdp-header">
                        <div class="pdp-price-row">
                            <div class="pdp-price">${formatRupiah(property.price)}</div>
                            <div class="pdp-price-monthly" id="pdp-monthly-badge">~ ${formatRupiah(estInstallment)}/bln</div>
                        </div>
                        <h1 class="pdp-title">${property.title}</h1>
                        <div class="pdp-address">
                            <i class="fa-solid fa-location-dot"></i> 
                            <span>${property.address}</span>
                        </div>
                        
                        <div class="pdp-badge-row">
                            <span class="pdp-badge" style="background-color: var(--color-primary-light); color: var(--color-primary);">
                                ${property.transaction_type === 'sale' ? 'DIJUAL' : 'DISEWA'}
                            </span>
                            ${property.is_verified ? `
                                <span class="pdp-badge" style="background-color: var(--accent-green-light); color: var(--accent-green);">
                                    <i class="fa-solid fa-circle-check"></i> Terverifikasi Lapangan
                                </span>
                            ` : ''}
                            <span class="pdp-badge" style="background-color: var(--accent-orange-light); color: var(--accent-orange);">
                                <i class="fa-solid fa-award"></i> SHM Bersertifikat
                            </span>
                        </div>
                    </div>

                    <!-- CRO: Trust & Neighborhood Proximity Alerts -->
                    <div class="trust-indicators-grid">
                        <div class="trust-alert-card flood-alert">
                            <i class="fa-solid fa-water-ladder trust-alert-icon"></i>
                            <div class="trust-alert-content">
                                <h5>Bebas Banjir</h5>
                                <p>${property.is_flood_free ? 'Sertifikasi aman dari risiko banjir dalam riwayat 10 tahun terakhir.' : 'Daerah dataran tinggi dengan penyerapan air yang sangat baik.'}</p>
                            </div>
                        </div>
                        <div class="trust-alert-card transit-alert">
                            <i class="fa-solid fa-train-subway trust-alert-icon"></i>
                            <div class="trust-alert-content">
                                <h5>Konektivitas MRT/Commuter</h5>
                                <p>Berjarak sekitar ${property.transit_distance || '8'} menit ke stasiun transportasi massal terdekat.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Specs Card -->
                    <div class="pdp-section-card">
                        <h3 class="pdp-section-title">Spesifikasi Properti</h3>
                        <div class="specs-detail-grid">
                            <div class="spec-detail-item">
                                <span class="spec-label">Kamar Tidur</span>
                                <span class="spec-val">${property.bedrooms || '-'}</span>
                            </div>
                            <div class="spec-detail-item">
                                <span class="spec-label">Kamar Mandi</span>
                                <span class="spec-val">${property.bathrooms || '-'}</span>
                            </div>
                            <div class="spec-detail-item">
                                <span class="spec-label">Luas Tanah</span>
                                <span class="spec-val">${property.land_size ? property.land_size + ' m²' : '-'}</span>
                            </div>
                            <div class="spec-detail-item">
                                <span class="spec-label">Luas Bangunan</span>
                                <span class="spec-val">${property.building_size ? property.building_size + ' m²' : '-'}</span>
                            </div>
                            <div class="spec-detail-item">
                                <span class="spec-label">Daya Listrik</span>
                                <span class="spec-val">${property.electricity ? property.electricity + ' VA' : '-'}</span>
                            </div>
                            <div class="spec-detail-item">
                                <span class="spec-label">Sertifikat</span>
                                <span class="spec-val">${property.certificate || 'SHM'}</span>
                            </div>
                            <div class="spec-detail-item">
                                <span class="spec-label">Arah Hadap</span>
                                <span class="spec-val">${property.orientation || '-'}</span>
                            </div>
                            <div class="spec-detail-item">
                                <span class="spec-label">Kondisi Perabotan</span>
                                <span class="spec-val">${property.furnishing || '-'}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Facilities Card -->
                    <div class="pdp-section-card">
                        <h3 class="pdp-section-title">Fasilitas Properti</h3>
                        <div class="facilities-flex">
                            <span class="facility-badge"><i class="fa-solid fa-shield-halved text-blue"></i> Keamanan 24 Jam</span>
                            <span class="facility-badge"><i class="fa-solid fa-car text-blue"></i> Garasi / Carport</span>
                            <span class="facility-badge"><i class="fa-solid fa-droplet text-blue"></i> PAM / Jetpump</span>
                            <span class="facility-badge"><i class="fa-solid fa-road text-blue"></i> Akses Jalan Lebar</span>
                            ${property.type === 'apartment' ? '<span class="facility-badge"><i class="fa-solid fa-dumbbell text-blue"></i> Gym & Kolam Renang</span>' : ''}
                        </div>
                    </div>

                    <!-- Description Card -->
                    <div class="pdp-section-card">
                        <h3 class="pdp-section-title">Deskripsi Lengkap</h3>
                        <div class="pdp-description">
                            ${property.description.replace(/\n/g, '<br>')}
                        </div>
                    </div>

                    <!-- CRO: Interactive Mortgage Simulator Widget -->
                    <div class="pdp-section-card">
                        <h3 class="pdp-section-title">Simulasi Kalkulator KPR</h3>
                        <div class="mortgage-widget-grid">
                            <!-- Left Controls Sliders -->
                            <div class="mortgage-controls">
                                <div class="slider-group">
                                    <div class="slider-header">
                                        <span>Harga Properti</span>
                                        <span class="slider-val">${formatRupiah(property.price)}</span>
                                    </div>
                                </div>
                                <div class="slider-group">
                                    <div class="slider-header">
                                        <span>Uang Muka / Down Payment</span>
                                        <span class="slider-val" id="mortgage-dp-val">Rp 0</span>
                                    </div>
                                    <input type="range" id="mortgage-dp-slider" class="form-range" min="10" max="80" step="5" value="20">
                                    <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;">Geser untuk menentukan persentase DP (Min 10%)</span>
                                </div>
                                <div class="slider-group">
                                    <div class="slider-header">
                                        <span>Suku Bunga Acuan</span>
                                        <span class="slider-val" id="mortgage-rate-val">7.5%</span>
                                    </div>
                                    <input type="range" id="mortgage-rate-slider" class="form-range" min="3" max="15" step="0.25" value="7.5">
                                </div>
                                <div class="slider-group">
                                    <div class="slider-header">
                                        <span>Tenor Kredit</span>
                                        <span class="slider-val" id="mortgage-term-val">20 Tahun</span>
                                    </div>
                                    <input type="range" id="mortgage-term-slider" class="form-range" min="5" max="30" step="5" value="20">
                                </div>
                            </div>

                            <!-- Right Calculation Output -->
                            <div class="mortgage-result">
                                <div class="mortgage-result-lbl"><i class="fa-solid fa-calculator"></i> Estimasi Cicilan Bulanan</div>
                                <div class="mortgage-result-val" id="mortgage-installment-output">Rp 0</div>
                                <p style="font-size: 11px; color: var(--text-secondary); margin-top: 14px; line-height: 1.5; font-weight: 500;">
                                    *Perhitungan ini merupakan estimasi awal bunga anuitas flat. Pengajuan resmi dapat dikoordinasikan langsung ke bank mitra SatuRumah.
                                </p>
                                <button class="mortgage-cta-btn" id="mortgage-submit-btn">Ajukan KPR Instan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Sticky Agent Column -->
                <div class="pdp-right-col">
                    <div class="agent-sidebar">
                        <div class="agent-profile">
                            <img src="${property.agent.avatar}" class="agent-avatar" alt="${property.agent.name}">
                            <div>
                                <h4 class="agent-name">${property.agent.name}</h4>
                                <p class="agent-title">${property.agent.agency}</p>
                                <div class="agent-badge-verified">
                                    <i class="fa-solid fa-circle-check"></i> Agen Terverifikasi
                                </div>
                            </div>
                        </div>

                        <!-- WhatsApp Call To Action (CRO: Auto template with listing specs) -->
                        <button class="agent-cta-btn agent-cta-wa" id="pdp-wa-btn">
                            <i class="fa-brands fa-whatsapp" style="font-size: 18px;"></i>
                            <span>Hubungi via WhatsApp</span>
                        </button>

                        <!-- Email Submission Form Callout -->
                        <button class="agent-cta-btn agent-cta-email" id="pdp-email-btn">
                            <i class="fa-regular fa-envelope" style="font-size: 16px;"></i>
                            <span>Kirim Penawaran Email</span>
                        </button>

                        <button class="agent-cta-btn agent-cta-phone" id="pdp-phone-btn" data-phone="${property.agent.phone}">
                            <i class="fa-solid fa-phone" style="font-size: 14px;"></i>
                            <span>Tampilkan Telepon</span>
                        </button>

                        <!-- Take Down Button (Owner/Admin Actions) -->
                        ${(property.is_user_created === true) ? `
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1.5px dashed var(--border-color);">
                            <span style="display: block; font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Aksi Pemilik (Owner)</span>
                            <button class="agent-cta-btn" id="pdp-takedown-btn" style="background-color: #dc3545; color: white; border: none; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; cursor: pointer; width: 100%; padding: 12px; border-radius: var(--radius-sm);">
                                <i class="fa-solid fa-trash-can"></i>
                                <span>Turunkan Iklan (Take Down)</span>
                            </button>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>

        <!-- Lightbox Gallery Modal -->
        <div id="lightbox-modal" class="lightbox-modal">
            <div class="lightbox-content">
                <button class="lightbox-close-btn" id="lightbox-close">&times;</button>
                <button class="lightbox-nav-btn lightbox-prev" id="lightbox-prev">&lt;</button>
                <img src="" id="lightbox-image" class="lightbox-img" alt="Enlarged photo">
                <button class="lightbox-nav-btn lightbox-next" id="lightbox-next">&gt;</button>
            </div>
        </div>

        <!-- Email Inquiry Form Modal -->
        <div id="inquiry-modal" class="inquiry-modal">
            <div class="inquiry-modal-body">
                <span class="inquiry-modal-close" id="inquiry-close">&times;</span>
                <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 20px; color: var(--text-primary);">Hubungi Agen Properti</h3>
                
                <form id="inquiry-form" style="display: flex; flex-direction: column; gap: 14px;">
                    <div class="form-group">
                        <label>Nama Lengkap</label>
                        <input type="text" id="inq-name" class="form-input" required placeholder="Masukkan nama lengkap Anda">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="inq-email" class="form-input" required placeholder="Masukkan alamat email Anda">
                    </div>
                    <div class="form-group">
                        <label>Nomor Telepon / WhatsApp</label>
                        <input type="tel" id="inq-phone" class="form-input" required placeholder="Masukkan nomor telepon aktif">
                    </div>
                    <div class="form-group">
                        <label>Pesan</label>
                        <textarea id="inq-message" class="form-input" rows="4" style="resize: none;" required>Halo ${property.agent.name}, saya sangat tertarik dengan properti "${property.title}" (${property.id}). Mohon kirimkan detail informasi lebih lanjut.</textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="margin-top: 10px; padding: 12px;">Kirim Pesan</button>
                </form>
            </div>
        </div>
    `;


    // Back button navigation
    const backBtn = container.querySelector('#pdp-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.hash = '#home';
            }
        });
    }

    
    // 1. Lightbox Navigation Setup
    let currentImgIndex = 0;
    const lightboxModal = container.querySelector('#lightbox-modal');
    const lightboxImg = container.querySelector('#lightbox-image');

    const showLightbox = (index) => {
        currentImgIndex = index;
        lightboxImg.src = images[currentImgIndex];
        lightboxModal.style.display = 'flex';
    };

    container.querySelector('.pdp-gallery-main').addEventListener('click', () => showLightbox(0));
    container.querySelectorAll('.pdp-gallery-side').forEach((el, i) => {
        el.addEventListener('click', () => showLightbox(i + 1));
    });

    container.querySelector('#lightbox-close').addEventListener('click', () => {
        lightboxModal.style.display = 'none';
    });

    container.querySelector('#lightbox-prev').addEventListener('click', () => {
        currentImgIndex = (currentImgIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImgIndex];
    });

    container.querySelector('#lightbox-next').addEventListener('click', () => {
        currentImgIndex = (currentImgIndex + 1) % images.length;
        lightboxImg.src = images[currentImgIndex];
    });

    // Close lightbox on click background
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.style.display = 'none';
        }
    });

    // 2. KPR Mortgage Simulator Slider Math
    const calculateKpr = () => {
        const price = Number(property.price);
        const dpPercent = Number(container.querySelector('#mortgage-dp-slider').value);
        const interestRate = Number(container.querySelector('#mortgage-rate-slider').value);
        const loanTermYears = Number(container.querySelector('#mortgage-term-slider').value);

        // Update Slider value displays
        const dpValue = Math.round(price * (dpPercent / 100));
        container.querySelector('#mortgage-dp-val').textContent = `Rp ${dpValue.toLocaleString('id-ID')} (${dpPercent}%)`;
        container.querySelector('#mortgage-rate-val').textContent = `${interestRate}%`;
        container.querySelector('#mortgage-term-val').textContent = `${loanTermYears} Tahun`;

        const principal = price - dpValue;
        const monthlyRate = (interestRate / 100) / 12;
        const totalMonths = loanTermYears * 12;

        let monthlyRepayment = 0;
        if (principal <= 0) {
            monthlyRepayment = 0;
        } else if (monthlyRate === 0) {
            monthlyRepayment = principal / totalMonths;
        } else {
            monthlyRepayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }

        // Output formatting
        container.querySelector('#mortgage-installment-output').textContent = 'Rp ' + Math.round(monthlyRepayment).toLocaleString('id-ID') + ' / bln';
        
        // Update header badge dynamically based on KPR simulation!
        const monthlyBadge = container.querySelector('#pdp-monthly-badge');
        if (monthlyBadge) {
            monthlyBadge.textContent = `~ Rp ${Math.round(monthlyRepayment / 1000000).toLocaleString('id-ID')} Jt/bln`;
        }
    };

    // Recalculation binders
    container.querySelector('#mortgage-dp-slider').addEventListener('input', calculateKpr);
    container.querySelector('#mortgage-rate-slider').addEventListener('input', calculateKpr);
    container.querySelector('#mortgage-term-slider').addEventListener('input', calculateKpr);
    calculateKpr(); // Initial render computation

    // KPR Submit lead
    container.querySelector('#mortgage-submit-btn').addEventListener('click', () => {
        showToast('Terima kasih. Pengajuan KPR Anda telah kami kirimkan ke tim analis KPR SatuRumah.');
    });

    // 3. Agent Sidebar Event Actions
    // WhatsApp contact deep-link compilation
    container.querySelector('#pdp-wa-btn').addEventListener('click', () => {
        const text = `Halo ${property.agent.name}, saya sangat tertarik dengan properti '${property.title}' (ID: ${property.id}) yang terdaftar seharga ${formatRupiah(property.price)}. Apakah unit ini masih tersedia untuk disurvei?`;
        const waUrl = `https://wa.me/${property.agent.phone}?text=${encodeURIComponent(text)}`;
        
        // Log query locally
        db.submitInquiry({
            property_id: property.id,
            name: 'Pengunjung Web',
            email: 'anonymous@visitor.com',
            phone_number: '0',
            message: text,
            channel: 'whatsapp'
        });

        window.open(waUrl, '_blank');
        showToast('Membuka aplikasi WhatsApp...');
    });

    // Reveal agent phone number
    const phoneBtn = container.querySelector('#pdp-phone-btn');
    phoneBtn.addEventListener('click', () => {
        const phone = phoneBtn.dataset.phone;
        phoneBtn.querySelector('span').textContent = '+' + phone;
        showToast('Nomor telepon agen ditampilkan');
    });

    // Take Down button handler (Owner Actions)
    const takedownBtn = container.querySelector('#pdp-takedown-btn');
    if (takedownBtn) {
        takedownBtn.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin menurunkan (menghapus) iklan properti ini dari SatuRumah?')) {
                const deleted = db.deleteProperty(property.id);
                if (deleted) {
                    showToast('Iklan properti berhasil diturunkan!');
                    setTimeout(() => {
                        window.location.hash = '#search';
                    }, 1200);
                } else {
                    showToast('Gagal menurunkan iklan properti');
                }
            }
        });
    }

    // 4. Email Inquiry Dialog Modal
    const inqModal = container.querySelector('#inquiry-modal');
    container.querySelector('#pdp-email-btn').addEventListener('click', () => {
        inqModal.style.display = 'flex';
    });

    container.querySelector('#inquiry-close').addEventListener('click', () => {
        inqModal.style.display = 'none';
    });

    // Submit inquiry form
    container.querySelector('#inquiry-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inqData = {
            property_id: property.id,
            name: container.querySelector('#inq-name').value,
            email: container.querySelector('#inq-email').value,
            phone_number: container.querySelector('#inq-phone').value,
            message: container.querySelector('#inq-message').value,
            channel: 'email'
        };

        db.submitInquiry(inqData);
        inqModal.style.display = 'none';
        showToast('Pesan penawaran Anda berhasil terkirim ke Agen!');
    });

    inqModal.addEventListener('click', (e) => {
        if (e.target === inqModal) {
            inqModal.style.display = 'none';
        }
    });
}
