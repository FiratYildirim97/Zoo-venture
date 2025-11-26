
import React from 'react';
import { Animal, BuildingItem, MarketItem, Task, SpecialEvent, ExplorationRegion } from './types';

// --- IMAGES & ASSETS ---
// Corrected and specific images for animals
export const IMAGES = {
  LION: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=400&h=400",
  ZEBRA: "https://images.unsplash.com/photo-1501706362039-c06b2d715385?auto=format&fit=crop&w=400&h=400",
  GIRAFFE: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=400&h=400",
  ELEPHANT: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=400&h=400",
  RHINO: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=400&h=400",
  HIPPO: "https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&w=400&h=400", 
  CHEETAH: "https://images.unsplash.com/photo-1547406798-25f0e908b97d?auto=format&fit=crop&w=400&h=400",
  
  TIGER: "https://images.unsplash.com/photo-1508811792946-7dc4c27447db?auto=format&fit=crop&w=400&h=400",
  MONKEY: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=400&h=400",
  GORILLA: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=400&h=400",
  PARROT: "https://images.unsplash.com/photo-1552728089-57bdde30ebd1?auto=format&fit=crop&w=400&h=400",
  TOUCAN: "https://images.unsplash.com/photo-1550949826-62021666dd93?auto=format&fit=crop&w=400&h=400",
  
  POLAR_BEAR: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=400&h=400",
  PENGUIN: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=400&h=400",
  SEAL: "https://images.unsplash.com/photo-1555547820-2c707d8d2644?auto=format&fit=crop&w=400&h=400",
  
  DOLPHIN: "https://images.unsplash.com/photo-1623944890664-d42721869bb5?auto=format&fit=crop&w=400&h=400",
  SHARK: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=400&h=400",
  TURTLE: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=400&h=400",
  
  BEAR: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=400&h=400",
  DEER: "https://images.unsplash.com/photo-1484406566174-9da000fea645?auto=format&fit=crop&w=400&h=400",
  PANDA: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=400&h=400",
  RED_PANDA: "https://images.unsplash.com/photo-1541336032412-2048a678540d?auto=format&fit=crop&w=400&h=400",
};

// Helper to get image
const getAnimalImage = (species: string, baseType?: string) => {
    const key = baseType || Object.keys(IMAGES).find(k => species.toUpperCase().includes(k));
    if (key && (IMAGES as any)[key]) return (IMAGES as any)[key];
    return `https://placehold.co/400x400/e2e8f0/1e293b?text=${encodeURIComponent(species)}`;
};

export const ANIMAL_NAMES_POOL = [
  "Boncuk", "Pamuk", "Limon", "Zeytin", "Gölge", "Rüzgar", "Şimşek", "Fıstık", "Karamel", "Benekli",
  "Cesur", "Kral", "Prenses", "Şanslı", "Çiko", "Maviş", "Bambi", "Herkül", "Zeus", "Hera",
  "Atlas", "Duman", "Gece", "Güneş", "Toprak", "Yağmur", "Bulut", "Mars", "Venüs", "Jüpiter"
];

// --- EXTENDED SPECIES LIST ---
const SPECIES_LIST = [
  // Savanna
  { name: 'Aslan', habitat: 'Savanna', rarity: 'Rare', base: 'LION', price: 500, minLvl: 3 },
  { name: 'Zebra', habitat: 'Savanna', rarity: 'Common', base: 'ZEBRA', price: 300, minLvl: 1 },
  { name: 'Zürafa', habitat: 'Savanna', rarity: 'Rare', base: 'GIRAFFE', price: 600, minLvl: 4 },
  { name: 'Fil', habitat: 'Savanna', rarity: 'Epic', base: 'ELEPHANT', price: 1000, minLvl: 8 },
  { name: 'Gergedan', habitat: 'Savanna', rarity: 'Epic', base: 'RHINO', price: 950, minLvl: 9 },
  { name: 'Su Aygırı', habitat: 'Savanna', rarity: 'Rare', base: 'HIPPO', price: 700, minLvl: 6 },
  { name: 'Çita', habitat: 'Savanna', rarity: 'Epic', base: 'CHEETAH', price: 850, minLvl: 7 },
  
  // Jungle
  { name: 'Kaplan', habitat: 'Jungle', rarity: 'Rare', base: 'TIGER', price: 650, minLvl: 5 },
  { name: 'Maymun', habitat: 'Jungle', rarity: 'Common', base: 'MONKEY', price: 200, minLvl: 1 },
  { name: 'Goril', habitat: 'Jungle', rarity: 'Epic', base: 'GORILLA', price: 1100, minLvl: 10 },
  { name: 'Papağan', habitat: 'Jungle', rarity: 'Common', base: 'PARROT', price: 150, minLvl: 1 },
  { name: 'Tukan', habitat: 'Jungle', rarity: 'Rare', base: 'TOUCAN', price: 400, minLvl: 3 },
  
  // Polar
  { name: 'Kutup Ayısı', habitat: 'Polar', rarity: 'Epic', base: 'POLAR_BEAR', price: 1200, minLvl: 12 },
  { name: 'Penguen', habitat: 'Polar', rarity: 'Common', base: 'PENGUIN', price: 300, minLvl: 2 },
  { name: 'Fok', habitat: 'Polar', rarity: 'Rare', base: 'SEAL', price: 550, minLvl: 5 },
  
  // Aquatic
  { name: 'Yunus', habitat: 'Aquatic', rarity: 'Rare', base: 'DOLPHIN', price: 800, minLvl: 6 },
  { name: 'Köpekbalığı', habitat: 'Aquatic', rarity: 'Epic', base: 'SHARK', price: 1500, minLvl: 15 },
  { name: 'Deniz Kaplumbağası', habitat: 'Aquatic', rarity: 'Rare', base: 'TURTLE', price: 650, minLvl: 5 },
  
  // Forest
  { name: 'Boz Ayı', habitat: 'Forest', rarity: 'Rare', base: 'BEAR', price: 600, minLvl: 4 },
  { name: 'Geyik', habitat: 'Forest', rarity: 'Common', base: 'DEER', price: 250, minLvl: 1 },
  { name: 'Kızıl Panda', habitat: 'Forest', rarity: 'Epic', base: 'RED_PANDA', price: 800, minLvl: 8 },
  { name: 'Panda', habitat: 'Forest', rarity: 'Legendary', base: 'PANDA', price: 2000, minLvl: 20 },
];

// --- MARKET ITEMS GENERATION (Used for Data Reference) ---
export const MARKET_ITEMS: MarketItem[] = SPECIES_LIST.map((spec, index) => ({
    id: `market-${index}`,
    species: spec.name,
    cost: spec.price,
    minLevel: spec.minLvl,
    habitatType: spec.habitat as any,
    rarity: spec.rarity as any,
    image: getAnimalImage(spec.name, spec.base),
    stock: 10,
    maxStock: 10
}));

// --- SAFARI REGIONS ---
export const EXPLORATION_REGIONS: ExplorationRegion[] = [
  {
    id: 'reg-savanna',
    name: 'Serengeti Ovaları',
    description: 'Uçsuz bucaksız savanlarda vahşi yaşamı keşfet.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=600&h=400',
    cost: 500,
    minLevel: 1,
    habitatType: 'Savanna',
    availableAnimals: ['Aslan', 'Zebra', 'Zürafa', 'Fil', 'Gergedan', 'Su Aygırı', 'Çita']
  },
  {
    id: 'reg-jungle',
    name: 'Amazon Ormanları',
    description: 'Sık ağaçların arasında egzotik türleri ara.',
    image: 'https://images.unsplash.com/photo-1469550702672-0051187d903f?auto=format&fit=crop&w=600&h=400',
    cost: 800,
    minLevel: 3,
    habitatType: 'Jungle',
    availableAnimals: ['Kaplan', 'Maymun', 'Goril', 'Papağan', 'Tukan']
  },
  {
    id: 'reg-forest',
    name: 'Kara Orman',
    description: 'Sisli ormanlarda saklanan utangaç hayvanlar.',
    image: 'https://images.unsplash.com/photo-1448375240586-dfd8f3793300?auto=format&fit=crop&w=600&h=400',
    cost: 600,
    minLevel: 2,
    habitatType: 'Forest',
    availableAnimals: ['Boz Ayı', 'Geyik', 'Kızıl Panda', 'Panda']
  },
  {
    id: 'reg-polar',
    name: 'Antarktika Buzulları',
    description: 'Dondurucu soğukta yaşayan dayanıklı türler.',
    image: 'https://images.unsplash.com/photo-1478562853135-c3c9e3ef7905?auto=format&fit=crop&w=600&h=400',
    cost: 1200,
    minLevel: 5,
    habitatType: 'Polar',
    availableAnimals: ['Kutup Ayısı', 'Penguen', 'Fok']
  },
  {
    id: 'reg-aquatic',
    name: 'Büyük Resif',
    description: 'Okyanusun derinliklerine dalış yap.',
    image: 'https://images.unsplash.com/photo-1582967788606-a171f1080ca8?auto=format&fit=crop&w=600&h=400',
    cost: 1500,
    minLevel: 8,
    habitatType: 'Aquatic',
    availableAnimals: ['Yunus', 'Köpekbalığı', 'Deniz Kaplumbağası']
  }
];

// --- INITIAL ANIMALS ---
export const MOCK_ANIMALS: Animal[] = [
    {
        id: 'init-1', name: 'Zeze', species: 'Zebra', habitatType: 'Savanna', 
        image: getAnimalImage('Zebra', 'ZEBRA'), health: 90, happiness: 85, gender: 'Female', rarity: 'Common', description: 'Zeze, savanların en neşeli zebrasıdır.'
    },
    {
        id: 'init-2', name: 'Çizgi', species: 'Zebra', habitatType: 'Savanna', 
        image: getAnimalImage('Zebra', 'ZEBRA'), health: 95, happiness: 80, gender: 'Male', rarity: 'Common', description: 'Çizgi, sürü lideri olmaya aday.'
    },
];

// --- EXPANDED CONSTRUCTION ITEMS ---
export const CONSTRUCTION_ITEMS: BuildingItem[] = [
    // Roads (Significantly Expanded)
    { id: 'road-dirt', name: 'Toprak Yol', cost: 20, currency: 'gold', icon: 'edit_road', type: 'road', width: 1, height: 1 },
    { id: 'road-gravel', name: 'Çakıl Yol', cost: 35, currency: 'gold', icon: 'texture', type: 'road', width: 1, height: 1 },
    { id: 'road-asphalt', name: 'Asfalt Yol', cost: 50, currency: 'gold', icon: 'add_road', type: 'road', width: 1, height: 1 },
    { id: 'road-stone', name: 'Taş Yol', cost: 100, currency: 'gold', icon: 'grid_view', type: 'road', width: 1, height: 1 },
    { id: 'road-wood', name: 'Tahta İskele', cost: 75, currency: 'gold', icon: 'deck', type: 'road', width: 1, height: 1 },
    { id: 'road-mosaic', name: 'Lüks Mozaik', cost: 200, currency: 'gold', icon: 'apps', type: 'road', width: 1, height: 1 },
    
    // Habitats (Guaranteed coverage for all types)
    // Savanna
    { id: 'hab-savanna-s', name: 'Küçük Savan', cost: 400, currency: 'gold', icon: 'pets', type: 'habitat', habitatType: 'Savanna', width: 2, height: 2 },
    { id: 'hab-savanna-l', name: 'Büyük Savan Düzlüğü', cost: 1200, currency: 'gold', icon: 'pets', type: 'habitat', habitatType: 'Savanna', width: 3, height: 3 },
    
    // Jungle
    { id: 'hab-jungle-s', name: 'Küçük Orman', cost: 600, currency: 'gold', icon: 'forest', type: 'habitat', habitatType: 'Jungle', width: 2, height: 2 },
    { id: 'hab-jungle-l', name: 'Dev Yağmur Ormanı', cost: 1500, currency: 'gold', icon: 'forest', type: 'habitat', habitatType: 'Jungle', width: 3, height: 3 },
    
    // Polar
    { id: 'hab-polar-s', name: 'Buz Kütlesi', cost: 800, currency: 'gold', icon: 'ac_unit', type: 'habitat', habitatType: 'Polar', width: 2, height: 2 },
    { id: 'hab-polar-l', name: 'Kutup Buzulu', cost: 2000, currency: 'gold', icon: 'ac_unit', type: 'habitat', habitatType: 'Polar', width: 3, height: 3 },
    
    // Aquatic
    { id: 'hab-aquatic-pool', name: 'Yunus Havuzu', cost: 1000, currency: 'gold', icon: 'water', type: 'habitat', habitatType: 'Aquatic', width: 2, height: 2 },
    { id: 'hab-aquatic-tank', name: 'Dev Okyanus Tankı', cost: 2500, currency: 'gold', icon: 'scuba_diving', type: 'habitat', habitatType: 'Aquatic', width: 3, height: 3 },
    
    // Forest
    { id: 'hab-forest-s', name: 'Küçük Koru', cost: 500, currency: 'gold', icon: 'nature', type: 'habitat', habitatType: 'Forest', width: 2, height: 2 },
    { id: 'hab-forest-l', name: 'Milli Park Alanı', cost: 1400, currency: 'gold', icon: 'nature', type: 'habitat', habitatType: 'Forest', width: 3, height: 3 },

    // Facilities
    { id: 'fac-ticket', name: 'Bilet Gişesi', cost: 1000, currency: 'gold', icon: 'local_activity', type: 'facility', width: 1, height: 1 },
    { id: 'fac-burger', name: 'Burger Dükkanı', cost: 1500, currency: 'gold', icon: 'lunch_dining', type: 'facility', width: 1, height: 1 },
    { id: 'fac-wc', name: 'Tuvaletler', cost: 500, currency: 'gold', icon: 'wc', type: 'facility', width: 1, height: 1 },
    { id: 'fac-icecream', name: 'Dondurma Arabası', cost: 800, currency: 'gold', icon: 'icecream', type: 'facility', width: 1, height: 1 },
    { id: 'fac-vet', name: 'Veteriner', cost: 2500, currency: 'gold', icon: 'local_hospital', type: 'facility', width: 2, height: 2 },
    { id: 'fac-security', name: 'Güvenlik Kulübesi', cost: 600, currency: 'gold', icon: 'security', type: 'facility', width: 1, height: 1 },

    // Decorations
    { id: 'dec-bench', name: 'Bank', cost: 100, currency: 'gold', icon: 'chair', type: 'decoration', width: 1, height: 1 },
    { id: 'dec-lamp', name: 'Lamba', cost: 150, currency: 'gold', icon: 'light', type: 'decoration', width: 1, height: 1 },
    { id: 'dec-fountain', name: 'Süs Havuzu', cost: 1000, currency: 'gold', icon: 'water_drop', type: 'decoration', width: 2, height: 2 },
    { id: 'dec-flower', name: 'Çiçeklik', cost: 200, currency: 'gold', icon: 'local_florist', type: 'decoration', width: 1, height: 1 },
    { id: 'dec-tree', name: 'Ağaç', cost: 300, currency: 'gold', icon: 'park', type: 'decoration', width: 1, height: 1 },
    { id: 'dec-statue', name: 'Heykel', cost: 2000, currency: 'gold', icon: 'emoji_events', type: 'decoration', width: 1, height: 1 },
    { id: 'dec-playground', name: 'Oyun Parkı', cost: 1500, currency: 'gold', icon: 'attractions', type: 'decoration', width: 2, height: 2 },
    { id: 'dec-sign', name: 'Yön Tabelası', cost: 150, currency: 'gold', icon: 'signpost', type: 'decoration', width: 1, height: 1 },
];

// --- GENERATE MASSIVE LIST OF ACHIEVEMENTS (10x More) ---
const generateAchievements = (): Task[] => {
    const achievements: Task[] = [];
    
    // Level Achievements (Up to Level 100)
    for (let i = 5; i <= 100; i += 5) {
        achievements.push({
            id: `ach-lvl-${i}`,
            type: 'achievement',
            title: `Yönetici Seviyesi ${i}`,
            description: `Seviye ${i}'e ulaş`,
            icon: 'school',
            progress: 0,
            maxProgress: i,
            rewards: [{ type: 'diamond', amount: i * 2 }],
            completed: false,
            minLevel: 1
        });
    }

    // Money Achievements (Wealth Accumulation)
    const moneyMilestones = [5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
    moneyMilestones.forEach((amount, index) => {
        achievements.push({
            id: `ach-gold-${index}`,
            type: 'achievement',
            title: `Servet: ${amount / 1000}k`,
            description: `${amount} Altın biriktir`,
            icon: 'savings',
            progress: 0,
            maxProgress: amount,
            rewards: [{ type: 'xp', amount: 500 + (index * 200) }],
            completed: false,
            minLevel: 1
        });
    });

    // Animal Count Achievements
    for (let i = 5; i <= 50; i += 5) {
        achievements.push({
            id: `ach-ani-${i}`,
            type: 'achievement',
            title: `Hayvan Dostu (${i})`,
            description: `${i} farklı hayvana sahip ol`,
            icon: 'pets',
            progress: 0,
            maxProgress: i,
            rewards: [{ type: 'diamond', amount: 15 }],
            completed: false,
            minLevel: 1
        });
    }

    // Decoration Achievements
    for (let i = 10; i <= 100; i += 10) {
        achievements.push({
            id: `ach-dec-${i}`,
            type: 'achievement',
            title: `Peyzaj Mimarı (${i})`,
            description: `${i} dekorasyon yerleştir`,
            icon: 'yard',
            progress: 0,
            maxProgress: i,
            rewards: [{ type: 'gold', amount: 1000 * (i/10) }],
            completed: false,
            minLevel: 1
        });
    }

    return achievements;
};

const GENERATED_ACHIEVEMENTS = generateAchievements();

export const MOCK_TASKS: Task[] = [
    { id: 'd1', type: 'daily', title: 'Sabah Temizliği', description: '3 Barınağı temizle', icon: 'cleaning_services', progress: 0, maxProgress: 3, rewards: [{ type: 'gold', amount: 150 }], completed: false },
    { id: 'd2', type: 'daily', title: 'Ziyafet Vakti', description: '10 Hayvanı besle', icon: 'restaurant', progress: 0, maxProgress: 10, rewards: [{ type: 'gold', amount: 200 }], completed: false },
    { id: 'd3', type: 'daily', title: 'Hasılatı Topla', description: '500 Altın kazan', icon: 'payments', progress: 0, maxProgress: 500, rewards: [{ type: 'xp', amount: 50 }], completed: false },
    { id: 'evt-1', type: 'event', title: 'Kutup Festivali', description: 'Kutup bölgesine 3 dekorasyon koy', icon: 'ac_unit', progress: 0, maxProgress: 3, rewards: [{ type: 'diamond', amount: 15 }], completed: false },
    ...GENERATED_ACHIEVEMENTS
];

export const SPECIAL_EVENTS: SpecialEvent[] = [
  {
    id: 'ev-summer',
    title: 'Yaz Safarisi',
    description: 'Sıcak havalarda savanlar daha hareketli!',
    timeLeft: '3g 12s',
    color: 'from-yellow-400 to-orange-500',
    icon: 'wb_sunny',
    rewardText: 'Eşsiz: Altın Aslan',
    requiredProgress: 100,
    currentProgress: 45
  }
];
