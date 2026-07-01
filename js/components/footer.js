// js/components/footer.js - Footer component

export function renderFooter() {
    const container = document.getElementById('footer-mount');
    if (!container) return;

    container.innerHTML = `
        <footer class="main-footer">
            <div class="container footer-grid">
                <div class="footer-brand">
                    <a href="#home" class="logo-link" style="color: white;">
                        <span class="logo-icon">S</span>
                        <span>SatuRumah</span>
                    </a>
                    <p>Portal pencarian properti nomor satu di Indonesia. Temukan hunian impian Anda bersama kami secara cepat, aman, dan 100% terverifikasi.</p>
                </div>
                <div>
                    <h4 class="footer-title">Menu Cepat</h4>
                    <ul class="footer-links">
                        <li><a href="#search?transaction_type=sale">Beli Properti</a></li>
                        <li><a href="#search?transaction_type=rent">Sewa Properti</a></li>
                        <li><a href="#search?type=apartment">Apartemen Baru</a></li>
                        <li><a href="#favorites">Simpanan Properti</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-title">Layanan Kami</h4>
                    <ul class="footer-links">
                        <li><a href="#home">Pasang Iklan</a></li>
                        <li><a href="#home">Cari Agen</a></li>
                        <li><a href="#home">Kalkulator KPR</a></li>
                        <li><a href="#home">Kebijakan Privasi</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-title">Hubungi Kami</h4>
                    <ul class="footer-contact">
                        <li><i class="fa-solid fa-location-dot"></i> Jl. Senopati No. 12, Jakarta Selatan</li>
                        <li><i class="fa-solid fa-phone"></i> +62 21-555-888</li>
                        <li><i class="fa-solid fa-envelope"></i> support@saturumah.com</li>
                    </ul>
                </div>
            </div>
            <div class="container footer-bottom">
                <p>&copy; 2026 SatuRumah. Dibuat dengan penuh dedikasi untuk industri properti Indonesia.</p>
            </div>
        </footer>
    `;
}
