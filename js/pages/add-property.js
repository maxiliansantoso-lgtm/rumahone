// js/pages/add-property.js - Render and handle the List Property page
import { db } from '../db.js?v=5';

export function renderAddProperty(container) {
    const cities = ['Jakarta Selatan', 'Jakarta Barat', 'Tangerang', 'Bandung', 'Surabaya', 'Depok'];
    
    // Preset Unsplash images to pick for demo
    const presetImages = {
        house: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop'
        ],
        apartment: [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop'
        ],
        shophouse: [
            'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop'
        ],
        land: [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop'
        ]
    };

    const coordinates = {
        'Jakarta Selatan': { lat: -6.2701, lng: 106.8123 },
        'Jakarta Barat': { lat: -6.1683, lng: 106.7588 },
        'Tangerang': { lat: -6.2230, lng: 106.6491 },
        'Bandung': { lat: -6.9175, lng: 107.6191 },
        'Surabaya': { lat: -7.2575, lng: 112.7521 },
        'Depok': { lat: -6.4025, lng: 106.7942 }
    };

    container.innerHTML = `
        <div class="container add-prop-wrapper" style="padding-top: 32px; padding-bottom: 64px; max-width: 800px;">
            <div class="add-prop-header" style="margin-bottom: 32px; text-align: center;">
                <h1 style="font-size: 32px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px;">Pasang Iklan Properti</h1>
                <p style="color: var(--text-secondary); margin-top: 8px;">Jangkau ribuan calon pembeli dan penyewa secara gratis dan instan.</p>
            </div>

            <form id="add-property-form" class="add-prop-form" style="background: var(--bg-card); padding: 36px; border-radius: var(--radius-md); box-shadow: var(--shadow-md); border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 28px;">
                
                <!-- Section 1: Basic Info -->
                <div class="form-section">
                    <h3 class="form-section-title" style="font-size: 18px; font-weight: 800; border-bottom: 2px solid var(--color-primary-light); padding-bottom: 8px; margin-bottom: 20px; color: var(--color-primary);">1. Informasi Dasar</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div class="form-group">
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Judul Iklan <span style="color: red;">*</span></label>
                            <input type="text" id="prop-title" class="form-input" required placeholder="Contoh: Rumah Minimalis Modern 2 Lantai di Kemang" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Tipe Properti <span style="color: red;">*</span></label>
                                <select id="prop-type" class="form-input" required style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                                    <option value="house">Rumah</option>
                                    <option value="apartment">Apartemen</option>
                                    <option value="shophouse">Ruko</option>
                                    <option value="land">Tanah</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Tipe Transaksi <span style="color: red;">*</span></label>
                                <select id="prop-transaction" class="form-input" required style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                                    <option value="sale">Dijual</option>
                                    <option value="rent">Disewakan</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Harga (Rupiah) <span style="color: red;">*</span></label>
                            <input type="number" id="prop-price" class="form-input" required placeholder="Contoh: 1500000000 (untuk Rp 1.5 Miliar)" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                            <span id="price-helper" style="font-size: 12px; color: var(--text-muted); font-weight: 500; display: block; margin-top: 4px;"></span>
                        </div>

                        <div class="form-group">
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Deskripsi Lengkap <span style="color: red;">*</span></label>
                            <textarea id="prop-desc" class="form-input" rows="5" required placeholder="Jelaskan kondisi bangunan, akses jalan, fasilitas terdekat, kelebihan properti Anda..." style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px; resize: none;"></textarea>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Location -->
                <div class="form-section">
                    <h3 class="form-section-title" style="font-size: 18px; font-weight: 800; border-bottom: 2px solid var(--color-primary-light); padding-bottom: 8px; margin-bottom: 20px; color: var(--color-primary);">2. Lokasi Properti</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div class="form-group">
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Kota <span style="color: red;">*</span></label>
                            <select id="prop-city" class="form-input" required style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                                ${cities.map(city => `<option value="${city}">${city}</option>`).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Alamat Lengkap <span style="color: red;">*</span></label>
                            <input type="text" id="prop-address" class="form-input" required placeholder="Contoh: Jl. Kemang Raya No. 42" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                        </div>
                    </div>
                </div>

                <!-- Section 3: Details/Specifications -->
                <div class="form-section">
                    <h3 class="form-section-title" style="font-size: 18px; font-weight: 800; border-bottom: 2px solid var(--color-primary-light); padding-bottom: 8px; margin-bottom: 20px; color: var(--color-primary);">3. Spesifikasi Detail</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Luas Tanah (m²)</label>
                                <input type="number" id="prop-land" class="form-input" placeholder="0" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                            </div>
                            <div class="form-group">
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Luas Bangunan (m²)</label>
                                <input type="number" id="prop-building" class="form-input" placeholder="0" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;" id="room-fields-row">
                            <div class="form-group">
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Kamar Tidur</label>
                                <input type="number" id="prop-beds" class="form-input" placeholder="0" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                            </div>
                            <div class="form-group">
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Kamar Mandi</label>
                                <input type="number" id="prop-baths" class="form-input" placeholder="0" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Jumlah Lantai</label>
                                <input type="number" id="prop-floors" class="form-input" placeholder="1" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                            </div>
                            <div class="form-group">
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Daya Listrik (VA)</label>
                                <input type="number" id="prop-electricity" class="form-input" placeholder="Contoh: 1300" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 16px;">
                            <div class="form-group">
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Sertifikat</label>
                                <select id="prop-certificate" class="form-input" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                                    <option value="SHM">SHM (Hak Milik)</option>
                                    <option value="HGB">HGB (Guna Bangunan)</option>
                                    <option value="Strata Title">Strata Title (Apartemen)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Hadap</label>
                                <select id="prop-orientation" class="form-input" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                                    <option value="Utara">Utara</option>
                                    <option value="Selatan">Selatan</option>
                                    <option value="Timur">Timur</option>
                                    <option value="Barat">Barat</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Kondisi Perabot</label>
                                <select id="prop-furnishing" class="form-input" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                                    <option value="Unfurnished">Unfurnished</option>
                                    <option value="Semi Furnished">Semi Furnished</option>
                                    <option value="Fully Furnished">Fully Furnished</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 4: Photo Selection & Upload -->
                <div class="form-section">
                    <h3 class="form-section-title" style="font-size: 18px; font-weight: 800; border-bottom: 2px solid var(--color-primary-light); padding-bottom: 8px; margin-bottom: 20px; color: var(--color-primary);">4. Foto Properti</h3>
                    
                    <div style="display: flex; flex-direction: column; gap: 20px;">
                        <!-- Drag and Drop Upload Zone -->
                        <div id="upload-zone" style="border: 2.5px dashed var(--border-color); border-radius: var(--radius-md); padding: 32px 20px; text-align: center; background: rgba(0, 0, 0, 0.01); cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; align-items: center; gap: 12px;">
                            <i class="fa-solid fa-cloud-arrow-up" style="font-size: 36px; color: var(--color-primary); opacity: 0.8;"></i>
                            <div>
                                <p style="font-weight: 700; color: var(--text-primary); margin: 0; font-size: 15px;">Unggah Foto Properti Anda</p>
                                <p style="font-size: 13px; color: var(--text-secondary); margin: 4px 0 0 0;">Seret & taruh file gambar di sini atau klik untuk memilih</p>
                            </div>
                            <input type="file" id="prop-images" multiple accept="image/*" style="display: none;">
                            <span style="font-size: 11px; color: var(--text-muted);">Format JPG, PNG (maksimal 5 foto, masing-masing maks 2MB)</span>
                        </div>

                        <!-- Uploaded Preview Grid -->
                        <div id="uploaded-preview-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                            <!-- Uploaded image cards with delete button will render here -->
                        </div>

                        <!-- Fallback / Preset Options if no custom photos uploaded -->
                        <div id="preset-container">
                            <p style="font-size: 14px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">
                                Atau gunakan set foto mockup premium default:
                            </p>
                            <div id="photo-preview-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; opacity: 0.85;">
                                <!-- Dynamic preview photos will render here based on selected type -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn btn-primary" style="padding: 16px; font-size: 16px; font-weight: 700; border-radius: var(--radius-md); box-shadow: 0 4px 14px var(--color-primary-glow); margin-top: 12px;">
                    <i class="fa-solid fa-house-circle-check" style="margin-right: 8px;"></i> Tayangkan Iklan Properti Sekarang
                </button>
            </form>
        </div>
    `;

    // 1. Live price formatter helper
    const priceInput = container.querySelector('#prop-price');
    const priceHelper = container.querySelector('#price-helper');
    
    priceInput.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        if (!val) {
            priceHelper.textContent = '';
            return;
        }
        
        // Format rupiah helper display
        if (val >= 1000000000) {
            priceHelper.textContent = 'Estimasi: Rp ' + (val / 1000000000).toFixed(2) + ' Miliar';
        } else if (val >= 1000000) {
            priceHelper.textContent = 'Estimasi: Rp ' + (val / 1000000).toFixed(0) + ' Juta';
        } else {
            priceHelper.textContent = 'Rp ' + val.toLocaleString('id-ID');
        }
    });

    // Image resizing utility helper
    function resizeAndCompressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    const MAX_SIZE = 1000;
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height = Math.round((height * MAX_SIZE) / width);
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width = Math.round((width * MAX_SIZE) / height);
                            height = MAX_SIZE;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = event.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    // 2. Image upload area functionality
    const uploadZone = container.querySelector('#upload-zone');
    const fileInput = container.querySelector('#prop-images');
    const uploadedGrid = container.querySelector('#uploaded-preview-grid');
    const presetContainer = container.querySelector('#preset-container');
    let uploadedImages = []; // Array of Base64 strings

    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--color-primary)';
        uploadZone.style.background = 'rgba(0, 0, 0, 0.03)';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = 'var(--border-color)';
        uploadZone.style.background = 'rgba(0, 0, 0, 0.01)';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--border-color)';
        uploadZone.style.background = 'rgba(0, 0, 0, 0.01)';
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    });

    const handleFiles = async (files) => {
        const remainingSlots = 5 - uploadedImages.length;
        if (remainingSlots <= 0) {
            showToast('Maksimal 5 foto diperbolehkan');
            return;
        }

        const filesToProcess = Array.from(files)
            .filter(file => file.type.startsWith('image/'))
            .slice(0, remainingSlots);

        if (filesToProcess.length === 0) return;

        showToast(`Memproses ${filesToProcess.length} foto...`);

        for (const file of filesToProcess) {
            try {
                const compressedBase64 = await resizeAndCompressImage(file);
                uploadedImages.push(compressedBase64);
            } catch (err) {
                console.error(err);
                showToast('Gagal memuat beberapa foto');
            }
        }

        updateUploadedPreviews();
    };

    const updateUploadedPreviews = () => {
        if (uploadedImages.length > 0) {
            presetContainer.style.display = 'none';
            uploadedGrid.innerHTML = uploadedImages.map((img, idx) => `
                <div style="position: relative; border-radius: var(--radius-sm); overflow: hidden; aspect-ratio: 4/3; border: 2.5px solid ${idx === 0 ? 'var(--color-primary)' : 'var(--border-color)'};">
                    <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                    <button type="button" class="btn-delete-img" data-index="${idx}" style="position: absolute; top: 4px; right: 4px; background: rgba(220, 53, 69, 0.9); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 11px; transition: all 0.2s;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    ${idx === 0 ? `
                        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: var(--color-primary); color: white; text-align: center; font-size: 11px; font-weight: 700; padding: 2px 0;">
                            Foto Utama
                        </div>
                    ` : ''}
                </div>
            `).join('');

            uploadedGrid.querySelectorAll('.btn-delete-img').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute('data-index'));
                    uploadedImages.splice(idx, 1);
                    updateUploadedPreviews();
                });
            });
        } else {
            presetContainer.style.display = 'block';
            uploadedGrid.innerHTML = '';
        }
    };

    // 3. Dynamic photo preview grid based on type
    const typeSelect = container.querySelector('#prop-type');
    const photoGrid = container.querySelector('#photo-preview-grid');
    const roomFieldsRow = container.querySelector('#room-fields-row');

    const updatePreviews = () => {
        const type = typeSelect.value;
        const images = presetImages[type] || presetImages['house'];
        
        photoGrid.innerHTML = images.map((img, idx) => `
            <div style="position: relative; border-radius: var(--radius-sm); overflow: hidden; aspect-ratio: 4/3; border: 2px solid ${idx === 0 ? 'var(--color-primary)' : 'transparent'};">
                <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                ${idx === 0 ? `
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: var(--color-primary); color: white; text-align: center; font-size: 11px; font-weight: 700; padding: 2px 0;">
                        Foto Utama
                    </div>
                ` : ''}
            </div>
        `).join('');

        // If land is selected, hide bedroom/bathroom inputs
        if (type === 'land') {
            roomFieldsRow.style.display = 'none';
        } else {
            roomFieldsRow.style.display = 'grid';
        }
    };

    typeSelect.addEventListener('change', updatePreviews);
    updatePreviews(); // initial render

    // 4. Form Submit handler
    const form = container.querySelector('#add-property-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = typeSelect.value;
        const selectedCity = container.querySelector('#prop-city').value;
        const cityCenter = coordinates[selectedCity] || { lat: -6.2088, lng: 106.8456 };

        const finalImages = uploadedImages.length > 0 ? uploadedImages : (presetImages[type] || presetImages['house']);

        const propertyData = {
            title: container.querySelector('#prop-title').value,
            description: container.querySelector('#prop-desc').value,
            type: type,
            transaction_type: container.querySelector('#prop-transaction').value,
            price: Number(priceInput.value),
            land_size: Number(container.querySelector('#prop-land').value) || 0,
            building_size: Number(container.querySelector('#prop-building').value) || 0,
            bedrooms: Number(container.querySelector('#prop-beds').value) || 0,
            bathrooms: Number(container.querySelector('#prop-baths').value) || 0,
            floors: Number(container.querySelector('#prop-floors').value) || 1,
            electricity: Number(container.querySelector('#prop-electricity').value) || 1300,
            certificate: container.querySelector('#prop-certificate').value,
            orientation: container.querySelector('#prop-orientation').value,
            furnishing: container.querySelector('#prop-furnishing').value,
            address: container.querySelector('#prop-address').value,
            city: selectedCity,
            lat: cityCenter.lat + (Math.random() - 0.5) * 0.01,
            lng: cityCenter.lng + (Math.random() - 0.5) * 0.01,
            is_flood_free: true,
            transit_distance: Math.floor(Math.random() * 12) + 3,
            images: finalImages
        };

        // Save listing using existing database layer
        const newProperty = db.addProperty(propertyData);

        // Show toast and redirect to detail page
        showToast('Iklan properti berhasil ditayangkan!');
        setTimeout(() => {
            window.location.hash = `#property?id=${newProperty.id}`;
        }, 1000);
    });
}
