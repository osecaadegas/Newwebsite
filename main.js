// Global state
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentGame = null;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateStats();
    initializeMockUsers();
});

// Authentication Functions
function loginWithTwitch() {
    const selectedUser = document.getElementById('userSelector')?.value || 'random';
    
    if (selectedUser === 'random') {
        // Create random user
        const mockUser = {
            id: 'twitch_' + Date.now(),
            username: 'Streamer_' + Math.floor(Math.random() * 1000),
            avatar: `https://picsum.photos/seed/${Date.now()}/200/200.jpg`,
            points: 1000,
            gamesPlayed: 0,
            role: 'user' // default role
        };
        
        currentUser = mockUser;
        
        // Check if user exists
        const existingUser = users.find(u => u.username === mockUser.username);
        if (!existingUser) {
            users.push(mockUser);
        } else {
            currentUser = existingUser;
        }
    } else {
        // Use selected test user
        const existingUser = users.find(u => u.username === selectedUser);
        if (existingUser) {
            currentUser = existingUser;
        } else {
            // Fallback to random user if selected user not found
            const mockUser = {
                id: 'twitch_' + Date.now(),
                username: 'Streamer_' + Math.floor(Math.random() * 1000),
                avatar: `https://picsum.photos/seed/${Date.now()}/200/200.jpg`,
                points: 1000,
                gamesPlayed: 0,
                role: 'user'
            };
            currentUser = mockUser;
            users.push(mockUser);
        }
    }
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('users', JSON.stringify(users));
    
    updateUI();
    showSection('main');
}

function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUI();
        showSection('main');
    } else {
        showSection('login');
    }
}

function updateUI() {
    if (currentUser) {
        document.getElementById('userProfile').classList.remove('hidden');
        document.getElementById('topNavButtons').classList.remove('hidden');
        document.getElementById('loginBtn').classList.add('hidden');
        document.getElementById('navigationMenu').classList.add('hidden'); // Hide floating nav
        document.getElementById('userAvatar').src = currentUser.avatar;
        document.getElementById('userName').textContent = getUserRoleDisplay() + ' ' + currentUser.username;
        document.getElementById('userPoints').textContent = currentUser.points;
    }
}

// Navigation Functions
function showSection(section) {
    // Hide all sections
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('mainSection').classList.add('hidden');
    document.getElementById('shopSection').classList.add('hidden');
    document.getElementById('leaderboardSection').classList.add('hidden');
    document.getElementById('gamesSection').classList.add('hidden');
    document.getElementById('gameContainer').classList.add('hidden');
    
    // Show requested section
    switch(section) {
        case 'login':
            document.getElementById('loginSection').classList.remove('hidden');
            break;
        case 'main':
            document.getElementById('mainSection').classList.remove('hidden');
            break;
        case 'shop':
            document.getElementById('shopSection').classList.remove('hidden');
            initializeShop();
            break;
        case 'leaderboard':
            document.getElementById('leaderboardSection').classList.remove('hidden');
            updateLeaderboard();
            break;
        case 'games':
            document.getElementById('gamesSection').classList.remove('hidden');
            break;
    }
}

// Statistics Functions
function updateStats() {
    const totalPlayers = users.length;
    const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0);
    const gamesPlayed = users.reduce((sum, user) => sum + (user.gamesPlayed || 0), 0);
    
    document.getElementById('totalPlayers').textContent = totalPlayers;
    document.getElementById('totalPoints').textContent = totalPoints.toLocaleString();
    document.getElementById('gamesPlayed').textContent = gamesPlayed;
}

// Leaderboard Functions
function updateLeaderboard() {
    const sortedUsers = [...users].sort((a, b) => (b.points || 0) - (a.points || 0));
    const leaderboardList = document.getElementById('leaderboardList');
    
    leaderboardList.innerHTML = sortedUsers.map((user, index) => `
        <div class="flex items-center justify-between p-4 rounded-lg ${user.id === currentUser?.id ? 'bg-purple-600 bg-opacity-20 border border-purple-500' : 'bg-gray-800'}">
            <div class="flex items-center space-x-4">
                <div class="leaderboard-rank w-12 h-12 rounded-full flex items-center justify-center font-bold text-white">
                    #${index + 1}
                </div>
                <img src="${user.avatar}" alt="${user.username}" class="w-12 h-12 rounded-full">
                <div>
                    <h4 class="font-bold ${user.id === currentUser?.id ? 'text-purple-400' : ''}">${user.username}</h4>
                    <p class="text-sm text-gray-400">${user.gamesPlayed || 0} games played</p>
                </div>
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold text-purple-400">${user.points || 0}</div>
                <div class="text-xs text-gray-400">points</div>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function showPointsAnimation(amount, positive) {
    const animation = document.createElement('div');
    animation.textContent = (positive ? '+' : '-') + amount;
    animation.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold ${positive ? 'text-green-400' : 'text-red-400'} points-animation pointer-events-none z-50`;
    document.body.appendChild(animation);
    
    setTimeout(() => animation.remove(), 1000);
}

function saveUserData() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Initialize mock users for demo
function initializeMockUsers() {
    if (users.length === 0) {
        const mockUsers = [
            { 
                id: '1', 
                username: 'ProGamer123', 
                avatar: 'https://picsum.photos/seed/1/200/200.jpg', 
                points: 5000, 
                gamesPlayed: 150,
                role: 'user'
            },
            { 
                id: '2', 
                username: 'StreamKing', 
                avatar: 'https://picsum.photos/seed/2/200/200.jpg', 
                points: 3500, 
                gamesPlayed: 89,
                role: 'user'
            },
            { 
                id: '3', 
                username: 'CasualPlayer', 
                avatar: 'https://picsum.photos/seed/3/200/200.jpg', 
                points: 1200, 
                gamesPlayed: 45,
                role: 'user'
            },
            {
                id: 'admin_1',
                username: 'Admin_Miguel',
                avatar: 'https://picsum.photos/seed/admin1/200/200.jpg',
                points: 10000,
                gamesPlayed: 0,
                role: 'admin'
            },
            {
                id: 'mod_1',
                username: 'Mod_Helper',
                avatar: 'https://picsum.photos/seed/mod1/200/200.jpg',
                points: 5000,
                gamesPlayed: 0,
                role: 'moderator'
            },
            {
                id: 'admin_2',
                username: 'o_seca_adegas_95',
                avatar: 'https://picsum.photos/seed/streamer/200/200.jpg',
                points: 15000,
                gamesPlayed: 0,
                role: 'admin'
            }
        ];
        users = mockUsers;
        localStorage.setItem('users', JSON.stringify(users));
        updateStats();
    }
}

// Permission check functions
function canEditShop() {
    return currentUser && (currentUser.role === 'admin' || currentUser.role === 'moderator');
}

function getUserRoleDisplay() {
    if (!currentUser) return '';
    const roleEmojis = {
        admin: '👑',
        moderator: '🛡️',
        user: '👤'
    };
    return roleEmojis[currentUser.role] || roleEmojis.user;
}

// Casino Offer Functions
function showOfferInfo(casino) {
    const offerDetails = {
        betlabel: {
            name: 'Gangsta Casino',
            bonus: '400% Até 1500€ + 420 Rodadas Grátis',
            description: 'Casino online premium com mais de 90 fornecedores de jogos e 70+ métodos de pagamento. Levantamentos rápidos e excelente apoio ao cliente disponível 24/7.',
            features: [
                '✅ Licenciado e regulamentado (Curaçao)',
                '✅ 90+ fornecedores de jogos premium',
                '✅ 70+ métodos de pagamento disponíveis', 
                '✅ Suporte em 15 idiomas',
                '✅ Levantamentos: Bank Transfer, Visa/Mastercard, Skrill, Jetonbank, MiFinity, Crypto',
                '✅ Plataforma optimizada para móvel'
            ],
            terms: 'Requisito de apostas: 35x bónus. Depósito mín.: €10. Válido por 30 dias.',
            rating: '4.8/5'
        },
        kingdom: {
            name: 'Casino Kingdom',
            bonus: '100% Até 1000€ + 200 Rodadas Grátis',
            description: 'Experiência de jogo real com slots premium e jogos de mesa. Casino estabelecido com forte reputação e jogo justo.',
            features: [
                '✅ Mais de 3000 jogos premium',
                '✅ Processamento de levantamentos 1-3 dias',
                '✅ Cashback semanal até 10%',
                '✅ Jogos com dealers ao vivo disponíveis',
                '✅ Múltiplos métodos de pagamento',
                '✅ Apoio ao cliente profissional'
            ],
            terms: 'Requisito de apostas: 40x bónus. Depósito mín.: €20. Válido por 21 dias.',
            rating: '4.6/5'
        },
        luckyspin: {
            name: 'Lucky Spin Casino',
            bonus: '150% Até 800€ + 100 Rodadas Grátis',
            description: 'Casino emocionante focado em máquinas de slot e jackpots progressivos. Óptimo para jogadores que adoram fazer girar os rolos.',
            features: [
                '✅ 2500+ slots e jogos de mesa',
                '✅ Levantamentos rápidos instantâneos até 12h',
                '✅ Programa de cashback até 20%',
                '✅ Rede de jackpots progressivos',
                '✅ Bónus de recarregamento semanais',
                '✅ Opções de pagamento em criptomoedas'
            ],
            terms: 'Requisito de apostas: 30x bónus. Depósito mín.: €15. Válido por 14 dias.',
            rating: '4.7/5'
        },
        goldspin: {
            name: 'Goldspin Casino',
            bonus: '100% Até 1500€ + 100 Rodadas Grátis',
            description: 'Casino premium com levantamentos instantâneos e bónus generoso no primeiro depósito. Experiência de jogo de elite com suporte ao cliente excepcional.',
            features: [
                '✅ Coleção massiva de 5000+ jogos premium',
                '✅ Levantamentos instantâneos 24/7',
                '✅ Programa de cashback até 25%',
                '✅ Depósito mínimo baixo apenas €10',
                '✅ Suporte premium ao cliente',
                '✅ Plataforma móvel otimizada',
                '✅ Bónus máximo: €1500 + 100 Rodadas Grátis'
            ],
            terms: 'Requisito de apostas: 35x bónus. Depósito mín.: €10. Bónus máx.: €1500. Válido por 30 dias.',
            rating: '4.9/5'
        },
        royalvegas: {
            name: 'Royal Vegas Casino',
            bonus: '125% Até 1200€ + 75 Rodadas Grátis',
            description: 'Casino prestigioso com tratamento real e programas VIP. Marca estabelecida com excelente reputação e experiência de jogo premium.',
            features: [
                '✅ Coleção de 4000+ jogos premium',
                '✅ Levantamentos seguros 2-5 dias',
                '✅ Cashback semanal até 12%',
                '✅ Programa de fidelidade VIP exclusivo',
                '✅ Casino ao vivo com dealers reais',
                '✅ Apoio multi-idioma disponível'
            ],
            terms: 'Requisito de apostas: 35x bónus. Depósito mín.: €25. Válido por 30 dias.',
            rating: '4.5/5'
        }
    };

    const offer = offerDetails[casino];
    if (!offer) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };

    modal.innerHTML = `
        <div class="bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-600">
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-white">${offer.name}</h3>
                    <button onclick="document.body.removeChild(this.closest('.fixed'))" class="text-gray-400 hover:text-white text-2xl">×</button>
                </div>
                
                <div class="mb-4">
                    <div class="casino-bonus-highlight mb-4">
                        <div class="text-lg font-bold text-purple-400">${offer.bonus}</div>
                        <div class="text-sm text-gray-300 mt-1">Rating: ⭐ ${offer.rating}</div>
                    </div>
                </div>

                <div class="mb-4">
                    <h4 class="text-lg font-semibold text-white mb-2">Sobre</h4>
                    <p class="text-gray-300 text-sm">${offer.description}</p>
                </div>

                <div class="mb-4">
                    <h4 class="text-lg font-semibold text-white mb-3">Características</h4>
                    <div class="space-y-2">
                        ${offer.features.map(feature => `
                            <div class="text-sm text-gray-300">${feature}</div>
                        `).join('')}
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="text-lg font-semibold text-white mb-2">Termos e Condições</h4>
                    <p class="text-xs text-gray-400">${offer.terms}</p>
                </div>

                <div class="flex gap-3">
                    <button onclick="document.body.removeChild(this.closest('.fixed'))" class="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-500 transition-all">
                        Fechar
                    </button>
                    <button onclick="window.open(casino === 'betlabel' ? 'https://gangstacasinoplay.com/dcae51b7a' : 'https://' + casino + '.com', '_blank')" class="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-500 transition-all">
                        Visitar Casino
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// ============================================================================
// SHOP SYSTEM
// ============================================================================

let currentShopCategory = 'merch';
let shopItems = {
    merch: [
        {
            id: 'avatar_frame_gold',
            name: '🏆 Moldura Dourada',
            description: 'Moldura dourada para o seu avatar',
            price: 500,
            type: 'avatar_frame',
            rarity: 'rare',
            image: ''
        },
        {
            id: 'avatar_frame_diamond',
            name: '💎 Moldura Diamante',
            description: 'Moldura de diamante exclusiva',
            price: 1500,
            type: 'avatar_frame',
            rarity: 'legendary',
            image: ''
        },
        {
            id: 'name_color_purple',
            name: '💜 Nome Roxo',
            description: 'Cor roxa para o seu nome',
            price: 300,
            type: 'name_color',
            rarity: 'common',
            image: ''
        },
        {
            id: 'name_color_rainbow',
            name: '🌈 Nome Arco-íris',
            description: 'Efeito arco-íris no seu nome',
            price: 800,
            type: 'name_color',
            rarity: 'epic',
            image: ''
        }
    ],
    powerups: [
        {
            id: 'double_points_1h',
            name: '⚡ Pontos Duplos (1h)',
            description: 'Ganhe pontos duplos por 1 hora',
            price: 200,
            type: 'powerup',
            duration: 3600000, // 1 hour in ms
            rarity: 'common',
            image: ''
        },
        {
            id: 'triple_points_30m',
            name: '🔥 Pontos Triplos (30min)',
            description: 'Ganhe pontos triplos por 30 minutos',
            price: 400,
            type: 'powerup',
            duration: 1800000, // 30 minutes in ms
            rarity: 'rare',
            image: ''
        },
        {
            id: 'luck_boost_2h',
            name: '🍀 Boost de Sorte (2h)',
            description: 'Aumenta as chances de ganhar por 2 horas',
            price: 600,
            type: 'powerup',
            duration: 7200000, // 2 hours in ms
            rarity: 'epic',
            image: ''
        },
        {
            id: 'risk_shield_1h',
            name: '🛡️ Escudo Anti-Risco (1h)',
            description: 'Protege contra perdas de risco por 1 hora',
            price: 1000,
            type: 'powerup',
            duration: 3600000, // 1 hour in ms
            rarity: 'legendary',
            image: ''
        }
    ],
    special: [
        {
            id: 'points_package_small',
            name: '💰 Pacote Pequeno',
            description: '+100 pontos instantâneos',
            price: 50,
            type: 'points_package',
            points: 100,
            rarity: 'common',
            image: ''
        },
        {
            id: 'points_package_medium',
            name: '💸 Pacote Médio',
            description: '+300 pontos instantâneos',
            price: 120,
            type: 'points_package',
            points: 300,
            rarity: 'rare',
            image: ''
        },
        {
            id: 'points_package_large',
            name: '💎 Pacote Grande',
            description: '+1000 pontos instantâneos',
            price: 350,
            type: 'points_package',
            points: 1000,
            rarity: 'epic',
            image: ''
        },
        {
            id: 'mystery_box',
            name: '🎁 Caixa Mistério',
            description: 'Ganhe um item aleatório!',
            price: 250,
            type: 'mystery_box',
            rarity: 'rare',
            image: ''
        }
    ]
};

function initializeShop() {
    if (!currentUser) return;
    
    // Load saved shop items from localStorage
    try {
        const savedItems = localStorage.getItem('shopItems');
        if (savedItems) {
            shopItems = JSON.parse(savedItems);
        }
    } catch (e) {
        console.log('Could not load shop items from localStorage:', e);
    }
    
    // Update points display
    document.getElementById('shopUserPoints').textContent = `${currentUser.points} pontos`;
    
    // Initialize user inventory if not exists
    if (!currentUser.inventory) {
        currentUser.inventory = [];
        currentUser.activePowerups = [];
        saveUserData();
    }
    
    // Show default category
    showShopCategory('merch');
}

function showShopCategory(category) {
    currentShopCategory = category;
    
    // Update tab styling
    document.querySelectorAll('.shop-tab').forEach(tab => {
        tab.className = 'shop-tab bg-gray-700 text-gray-300 px-6 py-3 rounded-lg font-bold transition-all hover:bg-gray-600';
    });
    document.getElementById(category + 'Tab').className = 'shop-tab bg-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-all';
    
    // Render items
    renderShopItems(category);
}

function renderShopItems(category) {
    const container = document.getElementById('shopItems');
    const items = shopItems[category];
    
    container.innerHTML = items.map(item => {
        const owned = currentUser.inventory.some(i => i.id === item.id);
        const canAfford = currentUser.points >= item.price;
        const rarityColor = getRarityColor(item.rarity);
        
        return `
            <div class="bg-gray-800 rounded-lg p-6 border-2 ${rarityColor.border} relative overflow-hidden">
                <div class="absolute top-2 right-2 flex space-x-2">
                    ${canEditShop() ? `<button onclick="editItem('${item.id}')" class="text-xs px-2 py-1 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all">
                        ✏️ Editar
                    </button>` : ''}
                    <span class="text-xs px-2 py-1 rounded-full ${rarityColor.bg} ${rarityColor.text} font-bold">
                        ${item.rarity.toUpperCase()}
                    </span>
                </div>
                
                ${item.image ? `<div class="mb-4">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-32 object-cover rounded-lg">
                </div>` : ''}
                
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-white mb-2">${item.name}</h3>
                    <p class="text-gray-300 text-sm mb-3">${item.description}</p>
                    <div class="text-2xl font-bold text-purple-400">${item.price} pontos</div>
                </div>
                
                ${owned ? 
                    '<button class="w-full bg-green-600 text-white py-3 rounded-lg font-bold cursor-not-allowed">✓ Adquirido</button>' :
                    `<button onclick="purchaseItem('${item.id}')" class="${canAfford ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 cursor-not-allowed'} w-full text-white py-3 rounded-lg font-bold transition-all">
                        ${canAfford ? '🛒 Comprar' : '❌ Sem Pontos'}
                    </button>`
                }
            </div>
        `;
    }).join('');
}

function getRarityColor(rarity) {
    const colors = {
        common: { border: 'border-gray-500', bg: 'bg-gray-600', text: 'text-gray-200' },
        rare: { border: 'border-blue-500', bg: 'bg-blue-600', text: 'text-white' },
        epic: { border: 'border-purple-500', bg: 'bg-purple-600', text: 'text-white' },
        legendary: { border: 'border-yellow-500', bg: 'bg-yellow-600', text: 'text-black' }
    };
    return colors[rarity] || colors.common;
}

function purchaseItem(itemId) {
    if (!currentUser) return;
    
    // Find item
    const item = Object.values(shopItems).flat().find(i => i.id === itemId);
    if (!item) return;
    
    // Check if already owned
    if (currentUser.inventory.some(i => i.id === itemId)) {
        alert('Já possui este item!');
        return;
    }
    
    // Check if can afford
    if (currentUser.points < item.price) {
        alert('Pontos insuficientes!');
        return;
    }
    
    // Process purchase
    currentUser.points -= item.price;
    currentUser.inventory.push({ ...item, purchaseDate: Date.now() });
    
    // Handle special item types
    if (item.type === 'points_package') {
        currentUser.points += item.points;
        showPointsAnimation(item.points, true);
    } else if (item.type === 'powerup') {
        activatePowerup(item);
    } else if (item.type === 'mystery_box') {
        openMysteryBox();
    }
    
    // Save and update UI
    saveUserData();
    updateUI();
    initializeShop();
    
    // Show success message
    showPurchaseSuccess(item);
}

function activatePowerup(powerup) {
    const existing = currentUser.activePowerups.find(p => p.type === powerup.type);
    if (existing) {
        // Extend duration if same type
        existing.endTime = Math.max(existing.endTime, Date.now() + powerup.duration);
    } else {
        currentUser.activePowerups.push({
            ...powerup,
            startTime: Date.now(),
            endTime: Date.now() + powerup.duration
        });
    }
}

function openMysteryBox() {
    const allItems = Object.values(shopItems).flat().filter(item => item.type !== 'mystery_box' && item.type !== 'points_package');
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
    
    // Add to inventory if not owned
    if (!currentUser.inventory.some(i => i.id === randomItem.id)) {
        currentUser.inventory.push({ ...randomItem, purchaseDate: Date.now(), fromMystery: true });
        alert(`🎁 Parabéns! Recebeu: ${randomItem.name}`);
    } else {
        // Give points instead
        const bonusPoints = Math.floor(randomItem.price * 0.5);
        currentUser.points += bonusPoints;
        alert(`🎁 Item duplicado! Recebeu ${bonusPoints} pontos como compensação.`);
    }
}

function showPurchaseSuccess(item) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <div class="text-2xl">✅</div>
            <div>
                <div class="font-bold">Compra realizada!</div>
                <div class="text-sm opacity-90">${item.name}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Item editing functions
function editItem(itemId) {
    // Check permissions
    if (!canEditShop()) {
        alert('❌ Apenas administradores e moderadores podem editar itens da loja!');
        return;
    }
    
    const item = Object.values(shopItems).flat().find(i => i.id === itemId);
    if (!item) return;
    
    // Find which category the item belongs to
    let category = '';
    for (const [cat, items] of Object.entries(shopItems)) {
        if (items.some(i => i.id === itemId)) {
            category = cat;
            break;
        }
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-white">Editar Item</h3>
                <button onclick="closeEditModal()" class="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                    <input type="text" id="editName" value="${item.name}" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                    <textarea id="editDescription" rows="3" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none">${item.description}</textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Preço (pontos)</label>
                    <input type="number" id="editPrice" value="${item.price}" min="1" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">URL da Imagem</label>
                    <input type="url" id="editImage" value="${item.image || ''}" placeholder="https://exemplo.com/imagem.jpg" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Raridade</label>
                    <select id="editRarity" class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none">
                        <option value="common" ${item.rarity === 'common' ? 'selected' : ''}>Comum</option>
                        <option value="rare" ${item.rarity === 'rare' ? 'selected' : ''}>Raro</option>
                        <option value="epic" ${item.rarity === 'epic' ? 'selected' : ''}>Épico</option>
                        <option value="legendary" ${item.rarity === 'legendary' ? 'selected' : ''}>Lendário</option>
                    </select>
                </div>
                
                ${item.image ? `<div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Pré-visualização</label>
                    <img id="imagePreview" src="${item.image}" alt="Preview" class="w-full h-32 object-cover rounded-lg border border-gray-600">
                </div>` : '<div><img id="imagePreview" class="w-full h-32 object-cover rounded-lg border border-gray-600 hidden" alt="Preview"></div>'}
            </div>
            
            <div class="flex space-x-3 mt-6">
                <button onclick="saveItemChanges('${itemId}', '${category}')" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-bold transition-all">
                    Salvar
                </button>
                <button onclick="closeEditModal()" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-bold transition-all">
                    Cancelar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add image preview functionality
    const imageInput = document.getElementById('editImage');
    const imagePreview = document.getElementById('imagePreview');
    
    imageInput.addEventListener('input', function() {
        if (this.value) {
            imagePreview.src = this.value;
            imagePreview.classList.remove('hidden');
        } else {
            imagePreview.classList.add('hidden');
        }
    });
}

function closeEditModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function saveItemChanges(itemId, category) {
    // Double-check permissions
    if (!canEditShop()) {
        alert('❌ Permissão negada!');
        closeEditModal();
        return;
    }
    
    const name = document.getElementById('editName').value;
    const description = document.getElementById('editDescription').value;
    const price = parseInt(document.getElementById('editPrice').value);
    const image = document.getElementById('editImage').value;
    const rarity = document.getElementById('editRarity').value;
    
    if (!name || !description || !price || price < 1) {
        alert('Por favor, preencha todos os campos obrigatórios corretamente.');
        return;
    }
    
    // Find and update the item
    const itemIndex = shopItems[category].findIndex(i => i.id === itemId);
    if (itemIndex !== -1) {
        shopItems[category][itemIndex] = {
            ...shopItems[category][itemIndex],
            name,
            description,
            price,
            image: image || '',
            rarity
        };
        
        // Save to localStorage (if you're using it for persistence)
        try {
            localStorage.setItem('shopItems', JSON.stringify(shopItems));
        } catch (e) {
            console.log('Could not save to localStorage:', e);
        }
        
        // Refresh the shop display
        renderShopItems(category);
        
        // Close modal
        closeEditModal();
        
        // Show success message
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="text-2xl">✅</div>
                <div>
                    <div class="font-bold">Item atualizado!</div>
                    <div class="text-sm opacity-90">${name}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}