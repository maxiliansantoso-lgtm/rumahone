// js/pages/profile.js - Profile management and owner listings page
import { db, formatRupiah } from '../db.js?v=4';
import { showToast } from '../components/header.js?v=4';

export function renderProfile(container) {
    const profile = db.getUserProfile();
    
    if (!profile) {
        renderAuthForm(container);
    } else {
        renderProfileDetails(container, profile);
    }
}

// Render the registration/login interface
function renderAuthForm(container) {
    container.innerHTML = `
        <div class="container" style="padding-top: 48px; padding-bottom: 64px; max-width: 500px;">
            <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="font-size: 32px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px;">Daftar Akun Agen</h1>
                <p style="color: var(--text-secondary); margin-top: 8px;">Mulai pasang iklan properti dengan profil profesional Anda sendiri.</p>
            </div>
            
            <div style="background: var(--bg-card); padding: 36px; border-radius: var(--radius-md); box-shadow: var(--shadow-md); border: 1px solid var(--border-color);">
                <form id="register-form" style="display: flex; flex-direction: column; gap: 20px;">
                    <!-- Avatar Upload -->
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <div id="avatar-preview-container" style="width: 90px; height: 90px; border-radius: 50%; border: 3px solid var(--color-primary); overflow: hidden; background: rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: center; position: relative;">
                            <img id="avatar-preview-img" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop" style="width: 100%; height: 100%; object-fit: cover;">
                            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; font-size: 10px; font-weight: 600; padding: 2px 0; text-align: center; cursor: pointer;" id="btn-trigger-avatar">
                                GANTI
                            </div>
                        </div>
                        <input type="file" id="profile-avatar-input" accept="image/*" style="display: none;">
                        <span style="font-size: 12px; color: var(--text-muted);">Foto Profil Agen</span>
                    </div>

                    <div class="form-group">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Nama Lengkap <span style="color: red;">*</span></label>
                        <input type="text" id="reg-name" class="form-input" required placeholder="Contoh: Budi Santoso" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                    </div>

                    <div class="form-group">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Email <span style="color: red;">*</span></label>
                        <input type="email" id="reg-email" class="form-input" required placeholder="Contoh: budi@gmail.com" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                    </div>

                    <div class="form-group">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Nomor WhatsApp <span style="color: red;">*</span></label>
                        <input type="tel" id="reg-phone" class="form-input" required placeholder="Contoh: 628123456789" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                        <span style="font-size: 11px; color: var(--text-muted); display: block; margin-top: 4px;">Mulai dengan kode negara (62...) tanpa tanda '+' atau spasi.</span>
                    </div>

                    <div class="form-group">
                        <label style="display: block; font-weight: 600; margin-bottom: 6px; color: var(--text-primary);">Nama Kantor Agen (Agency)</label>
                        <input type="text" id="reg-agency" class="form-input" placeholder="Contoh: Ray White Kemang" style="width: 100%; padding: 12px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); font-size: 15px;">
                    </div>

                    <button type="submit" class="btn btn-primary" style="padding: 14px; font-size: 16px; font-weight: 700; border-radius: var(--radius-sm); margin-top: 10px;">
                        Buat Profil Agen Baru
                    </button>
                </form>
            </div>
        </div>
    `;

    // Avatar preview upload handler
    const avatarInput = container.querySelector('#profile-avatar-input');
    const avatarPreviewImg = container.querySelector('#avatar-preview-img');
    const triggerAvatar = container.querySelector('#btn-trigger-avatar');
    let avatarBase64 = '';

    triggerAvatar.addEventListener('click', () => avatarInput.click());

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // Compress profile image to small size
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 150;
                    let width = img.width;
                    let height = img.height;
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
                    avatarBase64 = canvas.toDataURL('image/jpeg', 0.85);
                    avatarPreviewImg.src = avatarBase64;
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Registration Form submit
    const form = container.querySelector('#register-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newProfile = {
            name: container.querySelector('#reg-name').value,
            email: container.querySelector('#reg-email').value,
            phone: container.querySelector('#reg-phone').value.replace('+', '').trim(),
            agency: container.querySelector('#reg-agency').value || 'SatuRumah Agen',
            avatar: avatarBase64 || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop'
        };

        db.saveUserProfile(newProfile);
        showToast('Profil Agen berhasil dibuat!');
        
        // Refresh to show profile details page
        renderProfile(container);
    });
}

// Render the active logged in profile details
function renderProfileDetails(container, profile) {
    // Query custom listings created by this owner
    const allProps = db.getProperties();
    const myProps = allProps.filter(p => p.is_user_created === true);

    container.innerHTML = `
        <div class="container" style="padding-top: 48px; padding-bottom: 64px;">
            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 32px; align-items: start;">
                
                <!-- Left: Profile Details Card -->
                <div style="background: var(--bg-card); padding: 32px; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; box-shadow: var(--shadow-sm);">
                    <img src="${profile.avatar}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid var(--color-primary); box-shadow: var(--shadow-sm);">
                    <div>
                        <h2 style="font-size: 22px; font-weight: 800; color: var(--text-primary);">${profile.name}</h2>
                        <span style="background-color: var(--color-primary-light); color: var(--color-primary); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: var(--radius-sm); margin-top: 6px; display: inline-block; text-transform: uppercase;">Agen Mandiri</span>
                    </div>
                    
                    <div style="width: 100%; border-top: 1px solid var(--border-color); padding-top: 16px; display: flex; flex-direction: column; gap: 12px; text-align: left; font-size: 14px;">
                        <div>
                            <span style="color: var(--text-muted); display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                            <span style="color: var(--text-primary); font-weight: 600;">${profile.email}</span>
                        </div>
                        <div>
                            <span style="color: var(--text-muted); display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">WhatsApp</span>
                            <span style="color: var(--text-primary); font-weight: 600;">+${profile.phone}</span>
                        </div>
                        <div>
                            <span style="color: var(--text-muted); display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Perusahaan Agen (Agency)</span>
                            <span style="color: var(--text-primary); font-weight: 600;"><i class="fa-solid fa-building" style="margin-right: 6px; color: var(--color-primary);"></i> ${profile.agency}</span>
                        </div>
                    </div>

                    <button class="btn btn-outline" id="btn-logout" style="width: 100%; margin-top: 16px; border: 1.5px solid #dc3545; color: #dc3545; font-weight: 700;">
                        <i class="fa-solid fa-right-from-bracket" style="margin-right: 6px;"></i> Keluar Akun (Logout)
                    </button>
                </div>

                <!-- Right: Owner Listings Management -->
                <div style="background: var(--bg-card); padding: 32px; border-radius: var(--radius-md); border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); min-height: 400px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 16px; margin-bottom: 24px;">
                        <h3 style="font-size: 20px; font-weight: 800; color: var(--text-primary);">Kelola Iklan Properti Saya</h3>
                        <span style="background: var(--color-primary); color: white; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px;">${myProps.length} Iklan Aktif</span>
                    </div>

                    ${myProps.length === 0 ? `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 280px; text-align: center; gap: 16px;">
                            <i class="fa-solid fa-house-chimney-medical" style="font-size: 48px; color: var(--text-muted); opacity: 0.7;"></i>
                            <div>
                                <h4 style="font-size: 18px; font-weight: 700; color: var(--text-primary);">Belum Ada Iklan Properti</h4>
                                <p style="color: var(--text-secondary); max-width: 320px; margin-top: 6px; font-size: 14px;">Mulai pasang iklan pertama Anda dan pasarkan ke ribuan pembeli secara instan.</p>
                            </div>
                            <a href="#add-property" class="btn btn-primary" style="padding: 10px 20px; font-size: 14px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px;">
                                <i class="fa-solid fa-circle-plus"></i> Pasang Iklan Sekarang
                            </a>
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 16px;">
                            ${myProps.map(prop => `
                                <div style="display: flex; gap: 16px; padding: 16px; border: 1.5px solid var(--border-color); border-radius: var(--radius-sm); align-items: center;">
                                    <img src="${prop.images[0]}" style="width: 90px; height: 68px; border-radius: var(--radius-sm); object-fit: cover;">
                                    <div style="flex: 1; min-width: 0;">
                                        <h4 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                                            <a href="#property?id=${prop.id}" style="color: inherit; text-decoration: none;">${prop.title}</a>
                                        </h4>
                                        <p style="font-size: 13px; color: var(--color-primary); font-weight: 700; margin: 4px 0 0 0;">${formatRupiah(prop.price)}</p>
                                        <span style="font-size: 11px; color: var(--text-secondary); display: block; margin-top: 2px;">${prop.city} &bull; ${prop.transaction_type === 'sale' ? 'Dijual' : 'Disewa'}</span>
                                    </div>
                                    <button class="btn btn-takedown-profile" data-id="${prop.id}" style="background-color: rgba(220, 53, 69, 0.1); color: #dc3545; border: 1.5px solid rgba(220, 53, 69, 0.2); font-weight: 700; padding: 8px 12px; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s; font-size: 13px;">
                                        <i class="fa-solid fa-trash-can"></i> Turunkan
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            </div>
        </div>
    `;

    // Logout click binder
    container.querySelector('#btn-logout').addEventListener('click', () => {
        db.logout();
        showToast('Berhasil keluar akun');
        renderProfile(container);
    });

    // Profile take down actions
    container.querySelectorAll('.btn-takedown-profile').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const propId = btn.getAttribute('data-id');
            if (confirm('Apakah Anda yakin ingin menurunkan iklan properti ini dari SatuRumah?')) {
                const deleted = db.deleteProperty(propId);
                if (deleted) {
                    showToast('Iklan properti berhasil diturunkan!');
                    renderProfile(container); // Re-render profile list
                } else {
                    showToast('Gagal menurunkan iklan');
                }
            }
        });
    });
}
