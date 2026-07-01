// js/db.js - SatuRumah Database Layer with Seed Data

const CITIES = ['Jakarta Selatan', 'Jakarta Barat', 'Tangerang', 'Bandung', 'Surabaya', 'Depok'];

const COORDINATES = {
    'Jakarta Selatan': { lat: -6.2701, lng: 106.8123 },
    'Jakarta Barat': { lat: -6.1683, lng: 106.7588 },
    'Tangerang': { lat: -6.2230, lng: 106.6491 },
    'Bandung': { lat: -6.9175, lng: 107.6191 },
    'Surabaya': { lat: -7.2575, lng: 112.7521 },
    'Depok': { lat: -6.4025, lng: 106.7942 }
};

const DEVELOPERS = [
    { id: 'dev-1', name: 'Sinar Mas Land', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop' },
    { id: 'dev-2', name: 'Ciputra Group', logo: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=100&auto=format&fit=crop' },
    { id: 'dev-3', name: 'Pakuwon Group', logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop' }
];

const AGENTS = [
    { id: 'agent-1', name: 'Budi Santoso', phone: '628123456789', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop', agency: 'Ray White Kemang' },
    { id: 'agent-2', name: 'Dewi Lestari', phone: '628987654321', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop', agency: 'Century 21 Prima' },
    { id: 'agent-3', name: 'Hendra Wijaya', phone: '628112233445', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop', agency: 'ERA Indonesia' }
];

// Helper to get random item
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate simulated listing details with CRO extensions (flood history, transit minutes)
function generateSeedListings() {
    const list = [];
    const streetNames = {
        'Jakarta Selatan': ['Kemang Raya', 'Sudirman', 'Ampera', 'Senopati', 'Cilandak Tengah'],
        'Jakarta Barat': ['Puri Indah', 'Kebon Jeruk', 'Tanjung Duren', 'Meruya Ilir'],
        'Tangerang': ['BSD Boulevard', 'Gading Serpong', 'Karawaci', 'Alam Sutera'],
        'Bandung': ['Dago', 'Setiabudi', 'Cihampelas', 'Pasteur', 'Riau'],
        'Surabaya': ['Pakuwon Indah', 'Dharmahusada', 'Kertajaya', 'Graha Famili'],
        'Depok': ['Margonda Raya', 'Beji', 'Cinere', 'Sawangan']
    };

    const propertyImages = [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1602343168117-bb8ffd35f652?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop'
    ];

    // Seed 48 listings (8 per city to have nice variety)
    let idCounter = 1000;
    CITIES.forEach(city => {
        const center = COORDINATES[city];
        const streets = streetNames[city];

        for (let i = 0; i < 8; i++) {
            idCounter++;
            const type = pick(['house', 'apartment', 'shophouse', 'land']);
            const transaction_type = i % 4 === 0 ? 'rent' : 'sale'; // 25% rent, 75% sale
            const street = pick(streets);
            
            // Coordinates spread randomly around center (approx 3km radius)
            const lat = center.lat + (Math.random() - 0.5) * 0.05;
            const lng = center.lng + (Math.random() - 0.5) * 0.05;

            // Logical pricing structures
            let price;
            if (transaction_type === 'rent') {
                price = type === 'apartment' ? randRange(5, 20) * 10000000 : randRange(15, 120) * 1000000; // rental price per year
            } else {
                price = type === 'house' ? randRange(1200, 15000) * 1000000 :
                        type === 'apartment' ? randRange(600, 5000) * 1000000 :
                        type === 'shophouse' ? randRange(2000, 8000) * 1000000 :
                        randRange(300, 3000) * 1000000;
            }

            const land = type === 'apartment' ? 0 : randRange(60, 450);
            const building = type === 'land' ? 0 : (type === 'apartment' ? randRange(30, 180) : randRange(50, 350));
            const beds = type === 'land' ? 0 : randRange(1, 5);
            const baths = type === 'land' ? 0 : randRange(1, Math.max(1, beds - 1));
            
            // Random images list
            const imgCount = randRange(3, 5);
            const imgs = [];
            const offset = randRange(0, propertyImages.length - imgCount);
            for (let j = 0; j < imgCount; j++) {
                imgs.push(propertyImages[offset + j]);
            }

            const isVerified = Math.random() > 0.35;
            const isFeatured = Math.random() > 0.7;
            const transitMinutes = randRange(3, 15);
            const isFloodFree = Math.random() > 0.25;

            list.push({
                id: `listing-${idCounter}`,
                title: `${type === 'house' ? 'Rumah' : type === 'apartment' ? 'Apartemen' : type === 'shophouse' ? 'Ruko' : 'Tanah'} ${pick(['Modern', 'Minimalis', 'Luxury', 'Asri', 'Strategis'])} di ${street}`,
                description: `Dapatkan properti terbaik ini di lokasi strategis ${street}, ${city}. Sangat cocok untuk investasi jangka panjang maupun hunian keluarga. Didukung oleh akses jalan yang lebar, keamanan 24 jam, bebas banjir, serta dekat dengan berbagai fasilitas umum seperti sekolah, rumah sakit, dan pusat perbelanjaan. Kondisi bangunan masih sangat kokoh dan siap huni. Hubungi agen kami segera untuk jadwalkan survey.`,
                type,
                transaction_type,
                price,
                land_size: land,
                building_size: building,
                bedrooms: beds,
                bathrooms: baths,
                floors: type === 'land' ? 0 : randRange(1, 3),
                electricity: type === 'land' ? 0 : pick([1300, 2200, 3500, 4400, 6600]),
                certificate: pick(['SHM', 'HGB', 'Strata Title']),
                orientation: pick(['Utara', 'Selatan', 'Timur', 'Barat']),
                furnishing: type === 'land' ? 'Unfurnished' : pick(['Fully Furnished', 'Semi Furnished', 'Unfurnished']),
                address: `Jl. ${street} No. ${randRange(1, 99)}, ${city}, Indonesia`,
                city,
                lat,
                lng,
                is_verified: isVerified,
                is_featured: isFeatured,
                transit_distance: transitMinutes, // Minutes to MRT/KRL station
                is_flood_free: isFloodFree,       // Flood safety history status
                images: imgs,
                agent: pick(AGENTS),
                developer: isFeatured ? pick(DEVELOPERS) : null,
                created_at: new Date(Date.now() - randRange(1, 30) * 86400000).toISOString()
            });
        }
    });

    return list;
}

// Read/Write database state in localStorage
const STORAGE_KEY = 'rumahst_db';
const FAVORITES_KEY = 'rumahst_favs';
const INQUIRIES_KEY = 'rumahst_inqs';

export function initDatabase() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const seed = generateSeedListings();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    }
    if (!localStorage.getItem(FAVORITES_KEY)) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(INQUIRIES_KEY)) {
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify([]));
    }
}

// Database query API
export const db = {
    // Get listings with filters
    getProperties(filters = {}) {
        initDatabase();
        let list = JSON.parse(localStorage.getItem(STORAGE_KEY));

        if (filters.transaction_type) {
            list = list.filter(item => item.transaction_type === filters.transaction_type);
        }
        if (filters.type && filters.type !== 'all') {
            list = list.filter(item => item.type === filters.type);
        }
        if (filters.city) {
            list = list.filter(item => item.city.toLowerCase().includes(filters.city.toLowerCase()));
        }
        if (filters.query) {
            const q = filters.query.toLowerCase();
            list = list.filter(item => 
                item.title.toLowerCase().includes(q) || 
                item.description.toLowerCase().includes(q) ||
                item.address.toLowerCase().includes(q) ||
                item.city.toLowerCase().includes(q)
            );
        }
        if (filters.price_min) {
            list = list.filter(item => item.price >= Number(filters.price_min));
        }
        if (filters.price_max) {
            list = list.filter(item => item.price <= Number(filters.price_max));
        }
        if (filters.bedrooms && filters.bedrooms !== 'any') {
            list = list.filter(item => item.bedrooms >= Number(filters.bedrooms));
        }

        // Sorting
        if (filters.sort) {
            if (filters.sort === 'price-asc') {
                list.sort((a, b) => a.price - b.price);
            } else if (filters.sort === 'price-desc') {
                list.sort((a, b) => b.price - a.price);
            } else {
                // latest/created_at
                list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            }
        }

        return list;
    },

    // Get single listing
    getPropertyById(id) {
        initDatabase();
        const list = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return list.find(item => item.id === id) || null;
    },

    // Add new listing (CRUD)
    addProperty(data) {
        initDatabase();
        const list = JSON.parse(localStorage.getItem(STORAGE_KEY));
        const userProfile = this.getUserProfile();
        
        if (!userProfile) {
            throw new Error("Unauthorized: You must create an account first to publish listings.");
        }
        
        // Use user's profile as the agent info if logged in
        const agentInfo = {
            id: 'user-agent-active',
            name: userProfile.name,
            phone: userProfile.phone,
            avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop',
            agency: userProfile.agency || 'SatuRumah Agen'
        };

        const newListing = {
            id: `listing-${Date.now()}`,
            created_at: new Date().toISOString(),
            is_verified: false,
            is_featured: false,
            is_user_created: true, // Identify as user-created listing
            agent: agentInfo,
            images: [
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop'
            ],
            ...data
        };
        list.unshift(newListing);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        return newListing;
    },

    // Delete/Take down listing
    deleteProperty(id) {
        initDatabase();
        let list = JSON.parse(localStorage.getItem(STORAGE_KEY));
        const index = list.findIndex(item => item.id === id);
        if (index !== -1) {
            const property = list[index];
            
            // STRICT check: ONLY allow taking down if property is explicitly user_created.
            // Example seeded listings (which lack is_user_created) cannot be deleted.
            if (property.is_user_created === true) {
                list.splice(index, 1);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
                
                // Clean up from favorites
                let favs = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
                const favIndex = favs.indexOf(id);
                if (favIndex !== -1) {
                    favs.splice(favIndex, 1);
                    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
                    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
                }
                return true;
            }
        }
        return false;
    },

    // User Profile API
    getUserProfile() {
        const profile = localStorage.getItem('rumahst_profile');
        return profile ? JSON.parse(profile) : null;
    },

    saveUserProfile(profile) {
        localStorage.setItem('rumahst_profile', JSON.stringify(profile));
        window.dispatchEvent(new CustomEvent('profileUpdated'));
    },

    logout() {
        localStorage.removeItem('rumahst_profile');
        window.dispatchEvent(new CustomEvent('profileUpdated'));
    },

    // Bookmark/Favorites control
    getFavorites() {
        initDatabase();
        return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    },

    toggleFavorite(id) {
        initDatabase();
        let favs = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
        const index = favs.indexOf(id);
        if (index === -1) {
            favs.push(id);
        } else {
            favs.splice(index, 1);
        }
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
        
        // Dispatch custom event to let components (like header) know favorites updated
        window.dispatchEvent(new CustomEvent('favoritesUpdated'));
        return index === -1; // returns true if bookmarked, false if removed
    },

    isFavorite(id) {
        initDatabase();
        const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
        return favs.includes(id);
    },

    // Submit inquiry
    submitInquiry(inquiry) {
        initDatabase();
        const inqs = JSON.parse(localStorage.getItem(INQUIRIES_KEY)) || [];
        const newInq = {
            id: `inq-${Date.now()}`,
            created_at: new Date().toISOString(),
            ...inquiry
        };
        inqs.push(newInq);
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inqs));
        return newInq;
    },

    getDevelopers() {
        return DEVELOPERS;
    }
};

// Utility format rupiah
export function formatRupiah(number) {
    if (number >= 1000000000) {
        return 'Rp ' + (number / 1000000000).toFixed(1).replace('.0', '') + ' Miliar';
    }
    return 'Rp ' + (number / 1000000).toFixed(0) + ' Juta';
}

window.formatRupiah = formatRupiah;
