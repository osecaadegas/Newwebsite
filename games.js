// Game Management Functions
function startGame(gameName) {
    currentGame = gameName;
    document.getElementById('gamesSection').classList.add('hidden');
    document.getElementById('gameContainer').classList.remove('hidden');
    
    const gameCanvas = document.getElementById('gameCanvas');
    
    switch(gameName) {
        case 'plinko':
            renderPlinko(gameCanvas);
            break;
        case 'blackjack':
            renderBlackjack(gameCanvas);
            break;
        case 'mines':
            renderMines(gameCanvas);
            break;
    }
}

function backToGames() {
    document.getElementById('gameContainer').classList.add('hidden');
    document.getElementById('gamesSection').classList.remove('hidden');
    currentGame = null;
}

// =============================================================================
// PLINKO GAME
// =============================================================================

let plinkoBet = 10;
let plinkoWins = 0;
let plinkoDifficulty = 'easy'; // easy, medium, hard
let plinkoBallCount = 1; // number of balls to drop

const plinkoDifficultySettings = {
    easy: {
        name: 'Easy',
        color: '#10B981',
        multipliers: [2, 0.6, 0.4, 0.2, 0.2, 0.4, 0.6, 2], // Still lose money most of the time
        riskChance: 0.25, // 25% chance of losing everything
        pegRows: 8, // Fewer rows = more predictable
        pegSize: 5,
        pegSpacing: 45 // More spacing = easier paths
    },
    medium: {
        name: 'Medium',
        color: '#F59E0B',
        multipliers: [10, 1, 0.3, 0.1, 0.1, 0.3, 1, 10], // Harder to hit good multipliers
        riskChance: 0.35, // 35% chance of losing everything
        pegRows: 12, // More chaos
        pegSize: 6,
        pegSpacing: 35, // Tighter spacing
        centerGravity: 0.1 // Slight center bias
    },
    hard: {
        name: 'Hard',
        color: '#EF4444',
        multipliers: [100, 0.2, 0.02, 0.005, 0.005, 0.02, 0.2, 100], // 100x nearly impossible, center is 99.5% loss
        riskChance: 0.75, // 75% chance of losing everything before even hitting a slot
        pegRows: 18, // Extreme peg density
        pegSize: 10, // Massive pegs
        pegSpacing: 25, // Super tight = maximum center bias
        centerGravity: 0.3, // Strong pull toward center
        edgeRepulsion: 0.5 // Pushes balls away from edges
    }
};

function renderPlinko(container) {
    container.innerHTML = `
        <div class="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
            <!-- Game Board -->
            <div class="flex-1">
                <div id="plinkoBoard" class="relative mx-auto" style="width: 600px; height: 700px;">
                    <canvas id="plinkoCanvas" width="600" height="700" class="border-2 border-purple-500 rounded-lg"></canvas>
                </div>
            </div>
            
            <!-- Controls Panel -->
            <div class="w-full lg:w-80 bg-gray-800 rounded-lg p-6">
                <h3 class="text-2xl font-bold text-center mb-6">Plinko</h3>
                
                <!-- Stats Row -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="text-center bg-gray-700 rounded-lg p-3">
                        <div class="text-xl font-bold text-purple-400" id="plinkoBet">${plinkoBet}</div>
                        <div class="text-xs text-gray-400">Bet</div>
                    </div>
                    <div class="text-center bg-gray-700 rounded-lg p-3">
                        <div class="text-xl font-bold text-blue-400" id="plinkoBallCount">${plinkoBallCount}</div>
                        <div class="text-xs text-gray-400">Balls</div>
                    </div>
                </div>
                
                <!-- Points Tracker -->
                <div class="mb-4 bg-gray-700 rounded-lg p-3">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-yellow-400" id="currentPoints">${typeof currentUser !== 'undefined' ? currentUser.points : 0}</div>
                        <div class="text-xs text-gray-400">Current Points</div>
                    </div>
                </div>
                
                <!-- Last Result -->
                <div class="mb-6 bg-gray-700 rounded-lg p-3" id="lastResultPanel" style="display: none;">
                    <div class="text-center">
                        <div class="text-lg font-bold" id="lastResultAmount">+0</div>
                        <div class="text-xs text-gray-400" id="lastResultText">Last Result</div>
                    </div>
                </div>
                
                <!-- Difficulty Selection -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                    <div class="grid grid-cols-3 gap-2">
                        <button onclick="changeDifficulty('easy')" class="px-3 py-2 text-sm rounded-lg ${plinkoDifficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}">Easy</button>
                        <button onclick="changeDifficulty('medium')" class="px-3 py-2 text-sm rounded-lg ${plinkoDifficulty === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}">Medium</button>
                        <button onclick="changeDifficulty('hard')" class="px-3 py-2 text-sm rounded-lg ${plinkoDifficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}">Hard</button>
                    </div>
                </div>
                
                <!-- Bet Controls -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Bet Amount</label>
                    <div class="flex items-center gap-2">
                        <button onclick="changeBet(-50)" class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm">-50</button>
                        <button onclick="changeBet(-10)" class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm">-10</button>
                        <div class="flex-1 text-center bg-gray-700 py-2 rounded-lg font-bold text-purple-400" id="plinkoBetDisplay">${plinkoBet}</div>
                        <button onclick="changeBet(10)" class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm">+10</button>
                        <button onclick="changeBet(50)" class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm">+50</button>
                    </div>
                </div>
                
                <!-- Ball Count Controls -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Number of Balls</label>
                    <div class="flex items-center gap-2">
                        <button onclick="changeBallCount(-1)" class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm">-1</button>
                        <div class="flex-1 text-center bg-gray-700 py-2 rounded-lg font-bold text-blue-400" id="plinkoBallCountDisplay">${plinkoBallCount}</div>
                        <button onclick="changeBallCount(1)" class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm">+1</button>
                        <button onclick="changeBallCount(5)" class="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg text-sm">+5</button>
                    </div>
                </div>
                
                <!-- Game Info -->
                <div class="mb-6 bg-gray-700 rounded-lg p-4">
                    <div class="text-center space-y-1">
                        <div class="text-lg font-bold text-purple-400">Total: ${plinkoBet * plinkoBallCount} pts</div>
                        <div class="text-sm text-red-400">Risk: ${Math.round(plinkoDifficultySettings[plinkoDifficulty].riskChance * 100)}% per ball</div>
                        <div class="text-sm text-green-400">Max: ${Math.max(...plinkoDifficultySettings[plinkoDifficulty].multipliers)}x per ball</div>
                    </div>
                </div>
                
                <!-- Drop Button -->
                <button onclick="dropBall()" class="w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-lg font-bold text-lg transition-colors duration-200">
                    Drop ${plinkoBallCount === 1 ? 'Ball' : plinkoBallCount + ' Balls'}!
                </button>
            </div>
        </div>
    `;
    
    drawPlinkoBoard();
}

function changeBet(amount) {
    plinkoBet = Math.max(10, Math.min(currentUser.points, plinkoBet + amount));
    document.getElementById('plinkoBet').textContent = plinkoBet;
    const betDisplay = document.getElementById('plinkoBetDisplay');
    if (betDisplay) betDisplay.textContent = plinkoBet;
    
    // Update current points display
    const pointsDisplay = document.getElementById('currentPoints');
    if (pointsDisplay) pointsDisplay.textContent = currentUser.points;
    
    // Update total bet display
    const totalElements = document.querySelectorAll('.text-purple-400');
    totalElements.forEach(el => {
        if (el.textContent.includes('Total:')) {
            el.textContent = `Total: ${plinkoBet * plinkoBallCount} pts`;
        }
    });
}

function changeDifficulty(difficulty) {
    plinkoDifficulty = difficulty;
    renderPlinko(document.getElementById('gameCanvas'));
}

function changeBallCount(amount) {
    plinkoBallCount = Math.max(1, Math.min(10, plinkoBallCount + amount)); // Limit between 1-10 balls
    document.getElementById('plinkoBallCount').textContent = plinkoBallCount;
    
    const ballCountDisplay = document.getElementById('plinkoBallCountDisplay');
    if (ballCountDisplay) ballCountDisplay.textContent = plinkoBallCount;
    
    // Update button text
    const dropButton = document.querySelector('button[onclick="dropBall()"]');
    if (dropButton) {
        dropButton.textContent = `Drop ${plinkoBallCount === 1 ? 'Ball' : plinkoBallCount + ' Balls'}!`;
    }
    
    // Update total bet display
    const totalElements = document.querySelectorAll('.text-purple-400');
    totalElements.forEach(el => {
        if (el.textContent.includes('Total:')) {
            el.textContent = `Total: ${plinkoBet * plinkoBallCount} pts`;
        }
    });
}

function updateResultDisplay(netResult, totalBet, totalWon) {
    const lastResultPanel = document.getElementById('lastResultPanel');
    const lastResultAmount = document.getElementById('lastResultAmount');
    const lastResultText = document.getElementById('lastResultText');
    const pointsDisplay = document.getElementById('currentPoints');
    
    if (lastResultPanel && lastResultAmount && lastResultText) {
        lastResultPanel.style.display = 'block';
        
        if (netResult > 0) {
            lastResultAmount.textContent = `+${netResult}`;
            lastResultAmount.className = 'text-lg font-bold text-green-400';
            lastResultText.textContent = `Won ${totalWon} (Bet: ${totalBet})`;
            lastResultPanel.className = 'mb-6 bg-green-900 border border-green-600 rounded-lg p-3';
        } else if (netResult < 0) {
            lastResultAmount.textContent = `${netResult}`;
            lastResultAmount.className = 'text-lg font-bold text-red-400';
            lastResultText.textContent = `Lost ${Math.abs(netResult)} (Bet: ${totalBet})`;
            lastResultPanel.className = 'mb-6 bg-red-900 border border-red-600 rounded-lg p-3';
        } else {
            lastResultAmount.textContent = '±0';
            lastResultAmount.className = 'text-lg font-bold text-yellow-400';
            lastResultText.textContent = `Break Even (Bet: ${totalBet})`;
            lastResultPanel.className = 'mb-6 bg-yellow-900 border border-yellow-600 rounded-lg p-3';
        }
    }
    
    // Update current points
    if (pointsDisplay) {
        pointsDisplay.textContent = currentUser.points;
    }
}

function drawPlinkoBoard() {
    const canvas = document.getElementById('plinkoCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const currentSettings = plinkoDifficultySettings[plinkoDifficulty];
    
    // Draw pegs with difficulty-based parameters
    const pegSpacing = currentSettings.pegSpacing;
    const pegRows = currentSettings.pegRows;
    const pegSize = currentSettings.pegSize;
    const startY = 50;
    const rowHeight = (canvas.height - startY - 80) / pegRows; // Dynamic row height based on number of rows
    
    for (let row = 0; row < pegRows; row++) {
        const pegsInRow = row + 3;
        const startX = (canvas.width - (pegsInRow - 1) * pegSpacing) / 2;
        
        for (let col = 0; col < pegsInRow; col++) {
            const x = startX + col * pegSpacing;
            const y = startY + row * rowHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, pegSize, 0, Math.PI * 2);
            ctx.fillStyle = currentSettings.color;
            ctx.fill();
            
            // Add glow effect for hard difficulty
            if (plinkoDifficulty === 'hard') {
                ctx.beginPath();
                ctx.arc(x, y, pegSize + 2, 0, Math.PI * 2);
                ctx.strokeStyle = currentSettings.color + '40';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }
    
    // Draw prize slots with dynamic multipliers
    const slotWidth = canvas.width / 8;
    const multipliers = currentSettings.multipliers;
    
    for (let i = 0; i < 8; i++) {
        // Color slots based on multiplier value
        let slotColor = '#6B7280'; // default gray
        if (multipliers[i] === 0) {
            slotColor = '#DC2626'; // red for 0x
        } else if (multipliers[i] >= 3) {
            slotColor = '#10B981'; // green for high multipliers
        } else if (multipliers[i] >= 1.5) {
            slotColor = '#F59E0B'; // yellow for medium multipliers
        }
        
        ctx.fillStyle = slotColor;
        ctx.fillRect(i * slotWidth, canvas.height - 40, slotWidth - 2, 38);
        
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(multipliers[i] + 'x', i * slotWidth + slotWidth / 2, canvas.height - 15);
    }
}

function dropBall() {
    const totalBet = plinkoBet * plinkoBallCount;
    
    if (currentUser.points < totalBet) {
        alert('Not enough points!');
        return;
    }
    
    currentUser.points -= totalBet;
    updateUI();
    
    const canvas = document.getElementById('plinkoCanvas');
    const ctx = canvas.getContext('2d');
    
    // Create multiple balls
    const balls = [];
    for (let i = 0; i < plinkoBallCount; i++) {
        balls.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 40, // Spread balls slightly
            y: 20 + i * 15, // Stagger ball drops
            vx: (Math.random() - 0.5) * 2,
            vy: 2,
            radius: 6, // Slightly smaller for multiple balls
            finished: false,
            result: null
        });
    }
    
    let ballsFinished = 0;
    let totalWinnings = 0;
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlinkoBoard();
        
        let activeBalls = 0;
        
        // Update all balls
        balls.forEach((ball, index) => {
            if (ball.finished) return;
            
            activeBalls++;
            
            // Update ball position
            ball.x += ball.vx;
            ball.y += ball.vy;
            
            // Add gravity
            ball.vy += 0.1;
            
            // Check peg collisions with difficulty-based parameters
            const currentSettings = plinkoDifficultySettings[plinkoDifficulty];
            const pegSpacing = currentSettings.pegSpacing;
            const pegRows = currentSettings.pegRows;
            const pegSize = currentSettings.pegSize;
            const startY = 50;
            const rowHeight = (canvas.height - startY - 80) / pegRows;
            
            // Apply center gravity and edge repulsion for hard mode
            if (plinkoDifficulty === 'hard') {
                const centerX = canvas.width / 2;
                const distanceFromCenter = Math.abs(ball.x - centerX);
                const centerPull = (currentSettings.centerGravity || 0) * (distanceFromCenter / centerX);
                const edgeRepel = currentSettings.edgeRepulsion || 0;
                
                // Pull toward center
                if (ball.x > centerX) {
                    ball.vx -= centerPull;
                } else {
                    ball.vx += centerPull;
                }
                
                // Repel from edges (make 100x nearly impossible)
                if (ball.x < canvas.width * 0.2) {
                    ball.vx += edgeRepel; // Push away from left edge
                } else if (ball.x > canvas.width * 0.8) {
                    ball.vx -= edgeRepel; // Push away from right edge
                }
            }
            
            for (let row = 0; row < pegRows; row++) {
                const pegsInRow = row + 3;
                const startX = (canvas.width - (pegsInRow - 1) * pegSpacing) / 2;
                
                for (let col = 0; col < pegsInRow; col++) {
                    const pegX = startX + col * pegSpacing;
                    const pegY = startY + row * rowHeight;
                    
                    const dx = ball.x - pegX;
                    const dy = ball.y - pegY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < ball.radius + pegSize) {
                        // More chaotic bounces for harder difficulties
                        const bounceIntensity = plinkoDifficulty === 'hard' ? 4 : plinkoDifficulty === 'medium' ? 3 : 2.5;
                        let randomFactor = plinkoDifficulty === 'hard' ? (Math.random() - 0.5) * 0.5 : 0;
                        
                        // In hard mode, bias bounces toward center
                        if (plinkoDifficulty === 'hard') {
                            const centerX = canvas.width / 2;
                            const centerBias = ball.x > centerX ? -0.3 : 0.3;
                            randomFactor += centerBias;
                        }
                        
                        ball.vx = (dx / distance) * bounceIntensity + randomFactor;
                        ball.vy = Math.abs(ball.vy) * 0.8;
                    }
                }
            }
            
            // Draw ball with different colors for variety
            const ballColors = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'];
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = ballColors[index % ballColors.length];
            ctx.fill();
            
            // Check if ball reached bottom
            if (ball.y >= canvas.height - 40 && !ball.finished) {
                ball.finished = true;
                ballsFinished++;
                
                // Calculate win for this ball
                const slotWidth = canvas.width / 8;
                const slot = Math.max(0, Math.min(7, Math.floor(ball.x / slotWidth)));
                const currentSettings = plinkoDifficultySettings[plinkoDifficulty];
                const multipliers = currentSettings.multipliers;
                
                // Apply risk chance
                const riskRoll = Math.random();
                let winAmount = 0;
                
                if (riskRoll < currentSettings.riskChance) {
                    // Lost everything due to risk
                    winAmount = 0;
                    ball.result = 'RISK HIT!';
                } else {
                    // Normal payout
                    winAmount = Math.floor(plinkoBet * multipliers[slot]);
                    ball.result = `${multipliers[slot]}x = ${winAmount}`;
                }
                
                totalWinnings += winAmount;
            }
        });
        
        // Continue animation if there are active balls
        if (activeBalls > 0) {
            requestAnimationFrame(animate);
        } else {
            // All balls finished - show results
            currentUser.points += totalWinnings;
            currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + plinkoBallCount;
            
            const totalBet = plinkoBet * plinkoBallCount;
            const netResult = totalWinnings - totalBet;
            
            if (netResult > 0) {
                plinkoWins++;
                showPointsAnimation(netResult, true);
            } else if (netResult < 0) {
                showPointsAnimation(Math.abs(netResult), false);
            } else {
                showPointsAnimation(0, true); // Break even
            }
            
            // Update result display immediately
            updateResultDisplay(netResult, totalBet, totalWinnings);
            
            // Show detailed summary on canvas
            setTimeout(() => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Title
                ctx.fillStyle = 'white';
                ctx.font = 'bold 22px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(plinkoBallCount === 1 ? 'Result' : 'Results Summary', canvas.width / 2, 60);
                
                // Bet info
                ctx.font = '16px Inter';
                ctx.fillStyle = '#9CA3AF';
                ctx.fillText(`${plinkoBallCount} Ball${plinkoBallCount > 1 ? 's' : ''} × ${plinkoBet} pts = ${totalBet} pts bet`, canvas.width / 2, 90);
                
                // Winnings
                ctx.fillStyle = '#10B981';
                ctx.fillText(`Total Won: ${totalWinnings} pts`, canvas.width / 2, 120);
                
                // Net result (big and prominent)
                ctx.font = 'bold 28px Inter';
                if (netResult > 0) {
                    ctx.fillStyle = '#10B981';
                    ctx.fillText(`+${netResult} pts`, canvas.width / 2, 160);
                    ctx.font = '14px Inter';
                    ctx.fillText('YOU WON!', canvas.width / 2, 180);
                } else if (netResult < 0) {
                    ctx.fillStyle = '#EF4444';
                    ctx.fillText(`${netResult} pts`, canvas.width / 2, 160);
                    ctx.font = '14px Inter';
                    ctx.fillText('YOU LOST', canvas.width / 2, 180);
                } else {
                    ctx.fillStyle = '#F59E0B';
                    ctx.fillText('±0 pts', canvas.width / 2, 160);
                    ctx.font = '14px Inter';
                    ctx.fillText('BREAK EVEN', canvas.width / 2, 180);
                }
                
                // Current balance
                ctx.font = '16px Inter';
                ctx.fillStyle = '#F59E0B';
                ctx.fillText(`New Balance: ${currentUser.points} pts`, canvas.width / 2, 210);
                
            }, 1000);
            
            setTimeout(() => {
                drawPlinkoBoard();
            }, 4000);
            
            updateUI();
            updateStats();
            saveUserData();
            
            document.getElementById('plinkoWins').textContent = plinkoWins;
        }
    }
    
    animate();
}

// =============================================================================
// CASINO BLACKJACK GAME
// =============================================================================

// Game state variables
let bjBet = 25;
let bjInsuranceBet = 0;
let bjPerfectPairsBet = 0;
let bjWins = 0;
let bjPlayerHands = []; // Array to handle splits
let bjDealerHand = [];
let bjDeck = [];
let bjGameActive = false;
let bjCurrentHandIndex = 0;
let bjCanDoubleDown = false;
let bjCanSplit = false;
let bjCanInsurance = false;
let bjDealerHasBlackjack = false;
let bjPlayerBalance = 0;
let bjAnimating = false;

function renderBlackjack(container) {
    container.innerHTML = `
        <div class="casino-table relative w-full max-w-6xl mx-auto">
            <!-- Casino Table Background -->
            <div class="casino-felt bg-gradient-to-br from-green-800 via-green-700 to-green-900 rounded-3xl p-8 shadow-2xl border-4 border-yellow-600">
                
                <!-- Dealer Section -->
                <div class="dealer-section text-center mb-8">
                    <div class="inline-block bg-black bg-opacity-50 rounded-xl px-6 py-2 mb-4">
                        <h3 class="text-2xl font-bold text-yellow-400">🎰 DEALER 🎰</h3>
                    </div>
                    <div id="dealerHand" class="flex justify-center items-end space-x-2 min-h-[140px] mb-4"></div>
                    <div class="bg-black bg-opacity-30 rounded-lg px-4 py-2 inline-block">
                        <div id="dealerScore" class="text-2xl font-bold text-white">-</div>
                    </div>
                </div>

                <!-- Table Center - Side Bets -->
                <div class="table-center flex justify-center space-x-8 mb-8">
                    <!-- Insurance Bet -->
                    <div class="side-bet-area bg-yellow-600 bg-opacity-20 border-2 border-yellow-400 rounded-xl p-4 text-center" id="insuranceArea" style="display: none;">
                        <div class="text-sm font-bold text-yellow-300 mb-2">INSURANCE</div>
                        <div class="text-lg font-bold text-white" id="insuranceBetAmount">$0</div>
                        <button id="insuranceBtn" onclick="placeSideBet('insurance')" class="mt-2 bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm font-bold">Place</button>
                    </div>
                    
                    <!-- Perfect Pairs Bet -->
                    <div class="side-bet-area bg-purple-600 bg-opacity-20 border-2 border-purple-400 rounded-xl p-4 text-center">
                        <div class="text-sm font-bold text-purple-300 mb-2">PERFECT PAIRS</div>
                        <div class="text-lg font-bold text-white" id="perfectPairsBetAmount">$0</div>
                        <button id="perfectPairsBtn" onclick="placeSideBet('perfectPairs')" class="mt-2 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm font-bold">Place</button>
                    </div>
                </div>

                <!-- Player Section -->
                <div class="player-section">
                    <div id="playerHandsContainer" class="flex justify-center space-x-12 mb-6">
                        <!-- Player hands will be populated here -->
                    </div>
                </div>

                <!-- Betting Area -->
                <div class="betting-area bg-black bg-opacity-40 rounded-2xl p-6 mt-8">
                    <div class="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
                        
                        <!-- Chip Selection -->
                        <div class="chip-selection flex space-x-3">
                            <div class="text-center">
                                <div class="text-sm text-yellow-300 mb-2">SELECT CHIPS</div>
                                <div class="flex space-x-2">
                                    <button onclick="selectChip(5)" class="chip chip-5 w-12 h-12 rounded-full bg-red-600 border-4 border-red-400 text-white font-bold hover:scale-110 transition-transform">5</button>
                                    <button onclick="selectChip(25)" class="chip chip-25 w-12 h-12 rounded-full bg-green-600 border-4 border-green-400 text-white font-bold hover:scale-110 transition-transform">25</button>
                                    <button onclick="selectChip(50)" class="chip chip-50 w-12 h-12 rounded-full bg-blue-600 border-4 border-blue-400 text-white font-bold hover:scale-110 transition-transform">50</button>
                                    <button onclick="selectChip(100)" class="chip chip-100 w-12 h-12 rounded-full bg-black border-4 border-gray-400 text-white font-bold hover:scale-110 transition-transform">100</button>
                                    <button onclick="selectChip(500)" class="chip chip-500 w-12 h-12 rounded-full bg-purple-600 border-4 border-purple-400 text-white font-bold hover:scale-110 transition-transform">500</button>
                                </div>
                                <div class="mt-2">
                                    <button onclick="addToBet()" class="bg-yellow-600 hover:bg-yellow-700 px-4 py-1 rounded text-sm font-bold">Add to Bet</button>
                                </div>
                            </div>
                        </div>

                        <!-- Main Bet Area -->
                        <div class="main-bet-area text-center">
                            <div class="bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-xl p-4 border-4 border-yellow-300">
                                <div class="text-sm font-bold text-black mb-1">MAIN BET</div>
                                <div class="text-3xl font-bold text-black" id="mainBetAmount">$25</div>
                                <div class="chip-stack mt-2 relative" id="mainBetChips" style="height: 40px;">
                                    <!-- Chip stack will be rendered here -->
                                </div>
                            </div>
                        </div>

                        <!-- Game Controls -->
                        <div class="game-controls">
                            <div class="flex flex-col space-y-2">
                                <button id="dealBtn" onclick="startBlackjackRound()" class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-6 py-3 rounded-lg font-bold text-white text-lg shadow-lg">🎴 DEAL</button>
                                <button onclick="clearBets()" class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm font-bold text-white">Clear Bets</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div id="actionButtons" class="action-buttons flex justify-center space-x-4 mt-6 hidden">
                    <button id="hitBtn" onclick="bjHit()" class="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all">👊 HIT</button>
                    <button id="standBtn" onclick="bjStand()" class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all">✋ STAND</button>
                    <button id="doubleBtn" onclick="bjDoubleDown()" class="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all" disabled>⚡ DOUBLE</button>
                    <button id="splitBtn" onclick="bjSplit()" class="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all" disabled>✂️ SPLIT</button>
                </div>

                <!-- Game Info -->
                <div class="game-info flex justify-between items-center mt-6 bg-black bg-opacity-30 rounded-xl p-4">
                    <div class="stats flex space-x-6 text-center">
                        <div>
                            <div class="text-2xl font-bold text-green-400" id="playerBalance">${typeof currentUser !== 'undefined' ? currentUser.points : 0}</div>
                            <div class="text-xs text-gray-300">BALANCE</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-yellow-400" id="bjWinsDisplay">0</div>
                            <div class="text-xs text-gray-300">WINS</div>
                        </div>
                        <div>
                            <div class="text-2xl font-bold text-purple-400" id="bjHandCount">1</div>
                            <div class="text-xs text-gray-300">HANDS</div>
                        </div>
                    </div>
                    
                    <div id="gameMessage" class="text-xl font-bold text-center text-white"></div>
                    
                    <div class="payout-info text-right text-sm text-gray-300">
                        <div>🃏 Blackjack: 3:2</div>
                        <div>🎯 Perfect Pairs: 25:1</div>
                        <div>🛡️ Insurance: 2:1</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize game state
    bjPlayerBalance = currentUser ? currentUser.points : 1000;
    updateBlackjackDisplay();
}

// Casino Blackjack Core Functions
let selectedChipValue = 25;

function selectChip(value) {
    selectedChipValue = value;
    // Update chip selection visual
    document.querySelectorAll('.chip').forEach(chip => {
        chip.classList.remove('ring-4', 'ring-yellow-400');
    });
    document.querySelector(`.chip-${value}`).classList.add('ring-4', 'ring-yellow-400');
}

function addToBet() {
    if (bjGameActive || bjAnimating) return;
    if (!currentUser || currentUser.points < selectedChipValue) {
        showGameMessage('Not enough points!', 'error');
        return;
    }
    
    // Add to main bet
    bjBet += selectedChipValue;
    currentUser.points -= selectedChipValue;
    updateBlackjackDisplay();
    renderChipStack();
    updateUI();
    saveUserData();
}

function placeSideBet(betType) {
    if (bjGameActive || bjAnimating) return;
    if (!currentUser || currentUser.points < selectedChipValue) {
        showGameMessage('Not enough points!', 'error');
        return;
    }
    
    if (betType === 'insurance' && bjCanInsurance) {
        bjInsuranceBet += selectedChipValue;
        currentUser.points -= selectedChipValue;
        updateBlackjackDisplay();
        updateUI();
        saveUserData();
    } else if (betType === 'perfectPairs') {
        bjPerfectPairsBet += selectedChipValue;
        currentUser.points -= selectedChipValue;
        updateBlackjackDisplay();
        updateUI();
        saveUserData();
    }
}

function clearBets() {
    if (bjGameActive || bjAnimating) return;
    
    // Refund all bets
    if (currentUser) {
        currentUser.points += bjBet + bjInsuranceBet + bjPerfectPairsBet;
        updateUI();
        saveUserData();
    }
    bjBet = 0;
    bjInsuranceBet = 0;
    bjPerfectPairsBet = 0;
    updateBlackjackDisplay();
    renderChipStack();
}

function renderChipStack() {
    const container = document.getElementById('mainBetChips');
    if (!container || bjBet === 0) {
        if (container) container.innerHTML = '';
        return;
    }
    
    // Calculate chip breakdown
    let remaining = bjBet;
    const chipBreakdown = [];
    const chipValues = [500, 100, 50, 25, 5];
    const chipColors = {
        500: 'bg-purple-600 border-purple-400',
        100: 'bg-black border-gray-400',
        50: 'bg-blue-600 border-blue-400',
        25: 'bg-green-600 border-green-400',
        5: 'bg-red-600 border-red-400'
    };
    
    chipValues.forEach(value => {
        const count = Math.floor(remaining / value);
        if (count > 0) {
            chipBreakdown.push({ value, count, color: chipColors[value] });
            remaining -= count * value;
        }
    });
    
    // Render stacked chips
    let html = '';
    let stackHeight = 0;
    chipBreakdown.forEach(chip => {
        for (let i = 0; i < Math.min(chip.count, 8); i++) {
            html += `<div class="absolute w-12 h-3 rounded-full ${chip.color} border-2" style="bottom: ${stackHeight * 2}px; left: 50%; transform: translateX(-50%);"></div>`;
            stackHeight++;
        }
        if (chip.count > 8) {
            html += `<div class="absolute text-xs font-bold text-white" style="bottom: ${(stackHeight - 1) * 2 + 4}px; left: 50%; transform: translateX(-50%);">x${chip.count}</div>`;
        }
    });
    
    container.innerHTML = html;
}

function createBlackjackDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const deck = [];
    
    // Create multiple decks for more realistic casino experience
    for (let deckNum = 0; deckNum < 6; deckNum++) {
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value, id: `${deckNum}-${suit}-${value}` });
            }
        }
    }
    
    // Advanced shuffle algorithm
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
}

function getCardValue(card) {
    if (card.value === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    return parseInt(card.value);
}

function getHandValue(hand) {
    let value = 0;
    let aces = 0;
    
    for (let card of hand) {
        value += getCardValue(card);
        if (card.value === 'A') aces++;
    }
    
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }
    
    return value;
}

function isBlackjack(hand) {
    return hand.length === 2 && getHandValue(hand) === 21;
}

function canSplit(hand) {
    return hand.length === 2 && getCardValue(hand[0]) === getCardValue(hand[1]);
}

function checkPerfectPairs(hand) {
    if (hand.length !== 2) return null;
    
    const card1 = hand[0];
    const card2 = hand[1];
    
    // Perfect pair (same suit and value)
    if (card1.suit === card2.suit && card1.value === card2.value) {
        return { type: 'perfect', multiplier: 25 };
    }
    
    // Colored pair (same color and value)
    const red1 = card1.suit === '♥' || card1.suit === '♦';
    const red2 = card2.suit === '♥' || card2.suit === '♦';
    if (red1 === red2 && card1.value === card2.value) {
        return { type: 'colored', multiplier: 12 };
    }
    
    // Mixed pair (different color, same value)
    if (card1.value === card2.value) {
        return { type: 'mixed', multiplier: 6 };
    }
    
    return null;
}

function renderBlackjackCard(card, hidden = false, animated = false) {
    const isRed = card.suit === '♥' || card.suit === '♦';
    const suitColor = isRed ? 'text-red-600' : 'text-black';
    const content = hidden ? '<div class="card-back bg-blue-900 w-full h-full rounded-lg flex items-center justify-center text-white text-4xl">🂠</div>' : 
        `<div class="card-front w-full h-full rounded-lg bg-white border-2 border-gray-300 flex flex-col justify-between p-2 ${suitColor}">
            <div class="text-left">
                <div class="font-bold text-lg leading-none">${card.value}</div>
                <div class="text-2xl leading-none">${card.suit}</div>
            </div>
            <div class="text-center text-4xl">${card.suit}</div>
            <div class="text-right transform rotate-180">
                <div class="font-bold text-lg leading-none">${card.value}</div>
                <div class="text-2xl leading-none">${card.suit}</div>
            </div>
        </div>`;
    
    const animClass = animated ? 'card-deal-animation' : '';
    
    return `
        <div class="playing-card w-20 h-28 ${animClass}" data-card-id="${card.id}">
            ${content}
        </div>
    `;
}

function updateBlackjackDisplay() {
    if (currentUser) {
        bjPlayerBalance = currentUser.points;
        document.getElementById('playerBalance').textContent = `$${bjPlayerBalance}`;
    }
    
    document.getElementById('mainBetAmount').textContent = `$${bjBet}`;
    document.getElementById('insuranceBetAmount').textContent = `$${bjInsuranceBet}`;
    document.getElementById('perfectPairsBetAmount').textContent = `$${bjPerfectPairsBet}`;
    document.getElementById('bjWinsDisplay').textContent = bjWins;
    document.getElementById('bjHandCount').textContent = bjPlayerHands.length || 1;
    
    // Update button states
    const canAffordChip = currentUser && currentUser.points >= selectedChipValue;
    const hasValidBet = bjBet >= 5; // Minimum bet of 5
    
    document.getElementById('dealBtn').disabled = bjGameActive || !hasValidBet;
    
    // Update insurance button (only available when dealer shows ace)
    const insuranceBtn = document.getElementById('insuranceBtn');
    if (insuranceBtn) {
        insuranceBtn.disabled = !bjCanInsurance || !canAffordChip;
    }
    
    // Update perfect pairs button
    const perfectPairsBtn = document.getElementById('perfectPairsBtn');
    if (perfectPairsBtn) {
        perfectPairsBtn.disabled = bjGameActive || !canAffordChip;
    }
}

function startBlackjackRound() {
    if (bjGameActive || bjAnimating || !currentUser || bjBet === 0) return;
    if (currentUser.points < 0) {
        showGameMessage('Not enough points!', 'error');
        return;
    }
    
    bjAnimating = true;
    bjGameActive = true;
    
    // Initialize game state (bet already deducted when placing)
    bjDeck = createBlackjackDeck();
    bjPlayerHands = [{ cards: [], bet: bjBet, doubled: false, finished: false }];
    bjDealerHand = [];
    bjCurrentHandIndex = 0;
    bjCanDoubleDown = false;
    bjCanSplit = false;
    bjCanInsurance = false;
    bjDealerHasBlackjack = false;
    
    // Hide insurance area initially
    document.getElementById('insuranceArea').style.display = 'none';
    
    // Deal initial cards with animation
    dealInitialCards();
}

function dealInitialCards() {
    const dealSequence = [
        () => dealCardToPlayer(0, 0),
        () => dealCardToDealer(false),
        () => dealCardToPlayer(0, 300),
        () => dealCardToDealer(true, 300)
    ];
    
    let sequenceIndex = 0;
    
    function executeDealSequence() {
        if (sequenceIndex < dealSequence.length) {
            dealSequence[sequenceIndex]();
            sequenceIndex++;
            setTimeout(executeDealSequence, 600);
        } else {
            setTimeout(finishInitialDeal, 300);
        }
    }
    
    executeDealSequence();
}

function dealCardToPlayer(handIndex, delay = 0) {
    setTimeout(() => {
        const card = bjDeck.pop();
        bjPlayerHands[handIndex].cards.push(card);
        renderPlayerHands();
        playCardSound();
    }, delay);
}

function dealCardToDealer(hidden = false, delay = 0) {
    setTimeout(() => {
        const card = bjDeck.pop();
        bjDealerHand.push(card);
        renderDealerHand(hidden);
        playCardSound();
    }, delay);
}

function finishInitialDeal() {
    bjAnimating = false;
    
    const playerHand = bjPlayerHands[0];
    const dealerUpCard = bjDealerHand[0];
    
    // Check for dealer blackjack possibility
    if (getCardValue(dealerUpCard) === 10 || dealerUpCard.value === 'A') {
        // Only show insurance if dealer shows ace
        bjCanInsurance = dealerUpCard.value === 'A';
        if (bjCanInsurance) {
            document.getElementById('insuranceArea').style.display = 'block';
        }
        
        // Check for actual dealer blackjack
        if (isBlackjack(bjDealerHand)) {
            bjDealerHasBlackjack = true;
        }
    }
    
    // Check player options
    bjCanDoubleDown = playerHand.cards.length === 2 && currentUser && currentUser.points >= playerHand.bet;
    bjCanSplit = canSplit(playerHand.cards) && currentUser && currentUser.points >= playerHand.bet && bjPlayerHands.length === 1;
    
    // Check for perfect pairs - side bet burns if no win
    if (bjPerfectPairsBet > 0) {
        const pairResult = checkPerfectPairs(playerHand.cards);
        if (pairResult) {
            const winAmount = bjPerfectPairsBet * (pairResult.multiplier + 1); // Include original bet
            currentUser.points += winAmount;
            showGameMessage(`Perfect Pairs Win! +$${winAmount}`, 'success');
            showPointsAnimation(winAmount - bjPerfectPairsBet, true);
        } else {
            // Side bet burns - no refund
            showGameMessage('Perfect Pairs loses', 'error');
        }
        // Reset perfect pairs bet after resolution
        bjPerfectPairsBet = 0;
        updateBlackjackDisplay();
        updateUI();
        saveUserData();
    }
    
    // Check for blackjacks
    if (isBlackjack(playerHand.cards)) {
        if (bjDealerHasBlackjack) {
            endRound('push');
        } else {
            endRound('blackjack');
        }
        return;
    }
    
    if (bjDealerHasBlackjack) {
        revealDealerCards();
        endRound('dealer-blackjack');
        return;
    }
    
    // Enable player actions
    updateActionButtons();
    showGameMessage('Make your move!', 'info');
}

function bjHit() {
    if (bjAnimating || !bjGameActive) return;
    
    const currentHand = bjPlayerHands[bjCurrentHandIndex];
    if (currentHand.finished) return;
    
    bjAnimating = true;
    bjCanDoubleDown = false;
    bjCanSplit = false;
    
    dealCardToPlayer(bjCurrentHandIndex);
    
    setTimeout(() => {
        bjAnimating = false;
        const handValue = getHandValue(currentHand.cards);
        
        if (handValue > 21) {
            currentHand.finished = true;
            showGameMessage(`Hand ${bjCurrentHandIndex + 1}: Bust!`, 'error');
            moveToNextHand();
        } else if (handValue === 21) {
            currentHand.finished = true;
            showGameMessage(`Hand ${bjCurrentHandIndex + 1}: 21!`, 'success');
            moveToNextHand();
        } else {
            updateActionButtons();
        }
    }, 600);
}

function bjStand() {
    if (bjAnimating || !bjGameActive) return;
    
    const currentHand = bjPlayerHands[bjCurrentHandIndex];
    currentHand.finished = true;
    
    showGameMessage(`Hand ${bjCurrentHandIndex + 1}: Stand`, 'info');
    moveToNextHand();
}

function bjDoubleDown() {
    if (bjAnimating || !bjGameActive || !bjCanDoubleDown) return;
    if (bjPlayerBalance < bjPlayerHands[bjCurrentHandIndex].bet) return;
    
    const currentHand = bjPlayerHands[bjCurrentHandIndex];
    
    // Double the bet
    currentUser.points -= currentHand.bet;
    currentHand.bet *= 2;
    currentHand.doubled = true;
    
    bjAnimating = true;
    bjCanDoubleDown = false;
    bjCanSplit = false;
    
    // Deal one card
    dealCardToPlayer(bjCurrentHandIndex);
    
    setTimeout(() => {
        bjAnimating = false;
        currentHand.finished = true;
        
        const handValue = getHandValue(currentHand.cards);
        if (handValue > 21) {
            showGameMessage(`Hand ${bjCurrentHandIndex + 1}: Double Down Bust!`, 'error');
        } else {
            showGameMessage(`Hand ${bjCurrentHandIndex + 1}: Double Down`, 'info');
        }
        
        moveToNextHand();
    }, 600);
}

function bjSplit() {
    if (bjAnimating || !bjGameActive || !bjCanSplit) return;
    if (bjPlayerBalance < bjPlayerHands[0].bet) return;
    
    const originalHand = bjPlayerHands[0];
    const splitCard1 = originalHand.cards[0];
    const splitCard2 = originalHand.cards[1];
    
    // Deduct additional bet
    currentUser.points -= originalHand.bet;
    
    // Create two new hands
    bjPlayerHands = [
        { cards: [splitCard1], bet: originalHand.bet, doubled: false, finished: false },
        { cards: [splitCard2], bet: originalHand.bet, doubled: false, finished: false }
    ];
    
    bjCurrentHandIndex = 0;
    bjCanSplit = false;
    
    bjAnimating = true;
    
    // Deal second card to each hand
    setTimeout(() => {
        dealCardToPlayer(0);
        setTimeout(() => {
            dealCardToPlayer(1);
            setTimeout(() => {
                bjAnimating = false;
                
                // Check if we can split again
                const currentHand = bjPlayerHands[0];
                bjCanSplit = canSplit(currentHand.cards) && bjPlayerBalance >= currentHand.bet && bjPlayerHands.length < 4;
                bjCanDoubleDown = bjPlayerBalance >= currentHand.bet;
                
                updateActionButtons();
                showGameMessage('Playing Hand 1', 'info');
            }, 600);
        }, 600);
    }, 300);
}

function moveToNextHand() {
    bjCurrentHandIndex++;
    
    if (bjCurrentHandIndex < bjPlayerHands.length) {
        const nextHand = bjPlayerHands[bjCurrentHandIndex];
        if (!nextHand.finished) {
            // Check options for next hand
            bjCanDoubleDown = nextHand.cards.length === 2 && bjPlayerBalance >= nextHand.bet;
            bjCanSplit = canSplit(nextHand.cards) && bjPlayerBalance >= nextHand.bet && bjPlayerHands.length < 4;
            
            updateActionButtons();
            showGameMessage(`Playing Hand ${bjCurrentHandIndex + 1}`, 'info');
            return;
        }
    }
    
    // All hands finished, dealer plays
    playDealerHand();
}

function playDealerHand() {
    bjAnimating = true;
    hideActionButtons();
    
    // Reveal dealer's hole card
    revealDealerCards();
    
    setTimeout(() => {
        dealerDrawCards();
    }, 1000);
}

function revealDealerCards() {
    renderDealerHand(false);
    showGameMessage(`Dealer has ${getHandValue(bjDealerHand)}`, 'info');
}

function dealerDrawCards() {
    const dealerValue = getHandValue(bjDealerHand);
    
    if (dealerValue < 17) {
        dealCardToDealer(false);
        setTimeout(() => {
            dealerDrawCards();
        }, 1000);
    } else {
        bjAnimating = false;
        resolveRound();
    }
}

function resolveRound() {
    const dealerValue = getHandValue(bjDealerHand);
    const dealerBust = dealerValue > 21;
    
    let totalWinnings = 0;
    let results = [];
    
    bjPlayerHands.forEach((hand, index) => {
        const playerValue = getHandValue(hand.cards);
        const playerBust = playerValue > 21;
        
        let result = '';
        let winAmount = 0;
        
        if (playerBust) {
            result = 'Bust';
        } else if (dealerBust) {
            result = 'Win';
            winAmount = hand.bet * 2;
        } else if (playerValue > dealerValue) {
            result = 'Win';
            winAmount = hand.bet * 2;
        } else if (playerValue === dealerValue) {
            result = 'Push';
            winAmount = hand.bet;
        } else {
            result = 'Lose';
        }
        
        results.push({ hand: index + 1, result, winAmount });
        totalWinnings += winAmount;
    });
    
    // Handle insurance bet
    if (bjInsuranceBet > 0) {
        if (bjDealerHasBlackjack) {
            totalWinnings += bjInsuranceBet * 3; // 2:1 payout plus original bet
            results.push({ hand: 'Insurance', result: 'Win', winAmount: bjInsuranceBet * 2 });
        }
    }
    
    currentUser.points += totalWinnings;
    currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
    
    if (totalWinnings > 0) {
        bjWins++;
        showPointsAnimation(totalWinnings - (bjBet + bjInsuranceBet + bjPerfectPairsBet), totalWinnings > (bjBet + bjInsuranceBet + bjPerfectPairsBet));
    } else {
        showPointsAnimation(bjBet + bjInsuranceBet + bjPerfectPairsBet, false);
    }
    
    // Display results
    const resultText = results.map(r => `${r.result === 'Win' ? '✅' : r.result === 'Push' ? '🤝' : '❌'} Hand ${r.hand}: ${r.result}${r.winAmount > 0 ? ` (+$${r.winAmount})` : ''}`).join('\\n');
    showGameMessage(resultText, totalWinnings > 0 ? 'success' : 'error');
    
    // Reset for next round
    setTimeout(() => {
        resetBlackjackRound();
    }, 3000);
}

function endRound(outcome) {
    let message = '';
    let winAmount = 0;
    
    // Handle insurance first if dealer has blackjack
    if (bjDealerHasBlackjack && bjInsuranceBet > 0) {
        const insuranceWin = bjInsuranceBet * 3; // 2:1 payout plus original bet
        winAmount += insuranceWin;
    }
    
    switch (outcome) {
        case 'blackjack':
            const blackjackPayout = Math.floor(bjBet * 2.5); // 3:2 payout (bet + 1.5x bet)
            winAmount += blackjackPayout;
            message = '🃏 BLACKJACK! 🃏';
            bjWins++;
            break;
        case 'push':
            winAmount += bjBet; // Return original bet
            message = '🤝 Push - Both have Blackjack';
            break;
        case 'dealer-blackjack':
            message = '🎯 Dealer Blackjack';
            // Only insurance wins in this case
            break;
    }
    
    if (currentUser) {
        currentUser.points += winAmount;
        currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
        updateUI();
        saveUserData();
    }
    
    if (winAmount > 0) {
        showPointsAnimation(winAmount, true);
    }
    
    showGameMessage(message, winAmount > 0 ? 'success' : 'error');
    
    setTimeout(() => {
        resetBlackjackRound();
    }, 3000);
}

function resetBlackjackRound() {
    bjGameActive = false;
    bjAnimating = false;
    bjCurrentHandIndex = 0;
    bjPlayerHands = [];
    bjDealerHand = [];
    bjCanDoubleDown = false;
    bjCanSplit = false;
    bjCanInsurance = false;
    bjDealerHasBlackjack = false;
    
    // Reset all bets for new round
    bjBet = 0;
    bjInsuranceBet = 0;
    bjPerfectPairsBet = 0;
    
    // Hide insurance area
    document.getElementById('insuranceArea').style.display = 'none';
    
    // Clear displays
    document.getElementById('playerHandsContainer').innerHTML = '';
    document.getElementById('dealerHand').innerHTML = '';
    document.getElementById('dealerScore').textContent = '-';
    
    hideActionButtons();
    updateBlackjackDisplay();
    renderChipStack();
    showGameMessage('Place your bets and deal!', 'info');
    
    if (currentUser) {
        updateUI();
        saveUserData();
    }
}

// UI Helper Functions
function renderPlayerHands() {
    const container = document.getElementById('playerHandsContainer');
    container.innerHTML = bjPlayerHands.map((hand, index) => {
        const isActive = index === bjCurrentHandIndex && bjGameActive && !hand.finished;
        const handValue = getHandValue(hand.cards);
        
        return `
            <div class="player-hand text-center ${isActive ? 'ring-2 ring-yellow-400' : ''}">
                <div class="bg-black bg-opacity-30 rounded-lg px-4 py-2 mb-2">
                    <h4 class="text-lg font-bold text-white">Hand ${index + 1} ${hand.doubled ? '(2x)' : ''}</h4>
                    <div class="text-sm text-gray-300">Bet: $${hand.bet}</div>
                </div>
                <div class="flex justify-center space-x-1 mb-4 min-h-[120px]">
                    ${hand.cards.map(card => renderBlackjackCard(card)).join('')}
                </div>
                <div class="bg-black bg-opacity-30 rounded-lg px-3 py-1">
                    <div class="text-2xl font-bold ${handValue > 21 ? 'text-red-400' : handValue === 21 ? 'text-yellow-400' : 'text-white'}">${handValue}</div>
                    ${handValue > 21 ? '<div class="text-xs text-red-400">BUST</div>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderDealerHand(hideHole = false) {
    const container = document.getElementById('dealerHand');
    const dealerValue = hideHole && bjDealerHand.length > 1 ? getCardValue(bjDealerHand[0]) : getHandValue(bjDealerHand);
    
    container.innerHTML = bjDealerHand.map((card, index) => {
        const shouldHide = hideHole && index === 1;
        return renderBlackjackCard(card, shouldHide);
    }).join('');
    
    const scoreText = hideHole && bjDealerHand.length > 1 ? dealerValue : 
                     bjDealerHand.length === 0 ? '-' : dealerValue;
    
    document.getElementById('dealerScore').textContent = scoreText;
}

function updateActionButtons() {
    const buttonsContainer = document.getElementById('actionButtons');
    buttonsContainer.classList.remove('hidden');
    
    document.getElementById('hitBtn').disabled = bjAnimating;
    document.getElementById('standBtn').disabled = bjAnimating;
    document.getElementById('doubleBtn').disabled = !bjCanDoubleDown || bjAnimating;
    document.getElementById('splitBtn').disabled = !bjCanSplit || bjAnimating;
}

function hideActionButtons() {
    document.getElementById('actionButtons').classList.add('hidden');
}

function showGameMessage(message, type = 'info') {
    const messageEl = document.getElementById('gameMessage');
    messageEl.textContent = message;
    
    messageEl.className = 'text-xl font-bold text-center';
    switch (type) {
        case 'success':
            messageEl.classList.add('text-green-400');
            break;
        case 'error':
            messageEl.classList.add('text-red-400');
            break;
        case 'warning':
            messageEl.classList.add('text-yellow-400');
            break;
        default:
            messageEl.classList.add('text-white');
    }
}

function playCardSound() {
    // Placeholder for card dealing sound effect
    // In a real implementation, you would play an audio file here
    console.log('🎵 Card dealt sound');
}

// Initialize chip selection on load
setTimeout(() => {
    if (typeof selectChip === 'function') {
        selectChip(25);
    }
}, 100);

// =============================================================================
// MINES GAME
// =============================================================================

let minesBet = 100;
let minesMultiplier = 1.00;
let minesGrid = [];
let minesRevealed = 0;
let minesGameActive = false;
let minePositions = new Set();
let selectedMineCount = 5; // Default mine count
let totalCells = 25;

function renderMines(container) {
    container.innerHTML = `
        <div class="max-w-6xl mx-auto px-4">
            <!-- Game Header -->
            <div class="text-center mb-8">
                <div class="flex items-center justify-center mb-4">
                    <img src="assets/mines.png" alt="Mines Game" class="w-16 h-16 mr-4">
                    <h3 class="text-4xl font-bold gradient-text">Diamond Mines</h3>
                </div>
                <p class="text-gray-400 text-lg">Find the diamonds, avoid the mines. Each discovery multiplies your reward!</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Game Stats Panel -->
                <div class="lg:col-span-1">
                    <div class="mines-panel glass-effect rounded-2xl p-6 mb-6">
                        <h4 class="text-xl font-bold mb-4 text-center">Game Stats</h4>
                        <div class="space-y-4">
                            <div class="stat-card bg-gray-800/50 rounded-xl p-4">
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-purple-400" id="minesBet">100</div>
                                    <div class="text-sm text-gray-400 font-medium">Bet Amount</div>
                                </div>
                            </div>
                            <div class="stat-card bg-gray-800/50 rounded-xl p-4">
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-green-400" id="minesMultiplier">1.00x</div>
                                    <div class="text-sm text-gray-400 font-medium">Current Multiplier</div>
                                </div>
                            </div>
                            <div class="stat-card bg-gray-800/50 rounded-xl p-4">
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-red-400" id="mineCount">5</div>
                                    <div class="text-sm text-gray-400 font-medium">Hidden Mines</div>
                                    <div class="flex items-center justify-center space-x-2 mt-2">
                                        <button onclick="changeMineCount(-1)" class="text-red-400 hover:text-red-300 text-xl font-bold w-6 h-6 flex items-center justify-center rounded bg-gray-700 hover:bg-gray-600 transition-colors">-</button>
                                        <button onclick="changeMineCount(1)" class="text-red-400 hover:text-red-300 text-xl font-bold w-6 h-6 flex items-center justify-center rounded bg-gray-700 hover:bg-gray-600 transition-colors">+</button>
                                    </div>
                                </div>
                            </div>
                            <div class="stat-card bg-gray-800/50 rounded-xl p-4">
                                <div class="text-center">
                                    <div class="text-3xl font-bold text-blue-400" id="diamondsFound">0</div>
                                    <div class="text-sm text-gray-400 font-medium">Diamonds Found</div>
                                </div>
                            </div>
                            <div class="stat-card bg-gray-800/50 rounded-xl p-4">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-yellow-400" id="potentialPayout">100</div>
                                    <div class="text-sm text-gray-400 font-medium">Potential Payout</div>
                                </div>
                            </div>
                            <div class="stat-card bg-gray-800/50 rounded-xl p-4">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-yellow-400" id="potentialPayout">0</div>
                                    <div class="text-sm text-gray-400 font-medium">Potential Payout</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Controls Panel -->
                    <div class="mines-panel glass-effect rounded-2xl p-6">
                        <h4 class="text-xl font-bold mb-4 text-center">Controls</h4>
                        <div class="space-y-4">
                            <div class="flex items-center justify-center space-x-2">
                                <button onclick="changeMinesBet(-50)" class="bet-btn bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl font-bold transition-all duration-200 flex items-center">
                                    <span class="text-lg mr-1">−</span> 50
                                </button>
                                <button onclick="changeMinesBet(50)" class="bet-btn bg-green-600 hover:bg-green-700 px-4 py-3 rounded-xl font-bold transition-all duration-200 flex items-center">
                                    <span class="text-lg mr-1">+</span> 50
                                </button>
                            </div>
                            <button onclick="startMines()" class="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105">
                                🎮 New Game
                            </button>
                            <button onclick="cashOutMines()" id="cashOutBtn" class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 hidden">
                                💰 Cash Out
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Game Board -->
                <div class="lg:col-span-2">
                    <div class="mines-board glass-effect rounded-2xl p-8">
                        <div id="minesGrid" class="mines-grid grid grid-cols-5 gap-3 max-w-lg mx-auto">
                            <!-- Grid will be populated here -->
                        </div>
                    </div>
                    
                    <!-- Game Result -->
                    <div id="minesResult" class="result-panel mt-6 text-center hidden">
                        <div class="glass-effect rounded-2xl p-6">
                            <div id="resultText" class="text-3xl font-bold mb-2"></div>
                            <div id="resultSubtext" class="text-gray-400"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function changeMinesBet(amount) {
    minesBet = Math.max(50, Math.min(currentUser.points, minesBet + amount));
    document.getElementById('minesBet').textContent = minesBet;
    updatePotentialPayout();
}

function changeMineCount(amount) {
    if (minesGameActive) return; // Can't change during game
    
    selectedMineCount = Math.max(1, Math.min(20, selectedMineCount + amount));
    document.getElementById('mineCount').textContent = selectedMineCount;
    updatePotentialPayout();
}

function updatePotentialPayout() {
    if (minesGameActive && minesRevealed > 0) {
        const payout = Math.floor(minesBet * minesMultiplier);
        document.getElementById('potentialPayout').textContent = payout;
    } else {
        document.getElementById('potentialPayout').textContent = minesBet;
    }
}

// Calculate fair multiplier with house edge
function calculateMultiplier(diamondsRevealed, totalMines) {
    const remainingCells = totalCells - diamondsRevealed;
    const remainingMines = totalMines;
    const remainingSafeCells = remainingCells - remainingMines;
    
    if (remainingSafeCells <= 0) return 1.0;
    
    // Probability of hitting a mine on next click
    const mineHitProbability = remainingMines / remainingCells;
    const safeProbability = 1 - mineHitProbability;
    
    if (safeProbability <= 0) return 1.0;
    
    // Fair odds would be 1 / safeProbability
    const fairMultiplier = 1 / safeProbability;
    
    // Apply house edge (5% house edge)
    const houseEdge = 0.95;
    const multiplier = fairMultiplier * houseEdge;
    
    return Math.max(1.01, multiplier); // Minimum 1% increase
}

function updatePotentialPayout() {
    if (minesGameActive && minesRevealed > 0) {
        const payout = Math.floor(minesBet * minesMultiplier);
        document.getElementById('potentialPayout').textContent = payout;
    } else {
        document.getElementById('potentialPayout').textContent = minesBet;
    }
}

// Calculate fair multiplier with house edge
function calculateMultiplier(diamondsRevealed, totalMines) {
    const remainingCells = totalCells - diamondsRevealed;
    const remainingMines = totalMines;
    const remainingSafeCells = remainingCells - remainingMines;
    
    if (remainingSafeCells <= 0) return 1.0;
    
    // Probability of hitting a mine on next click
    const mineHitProbability = remainingMines / remainingCells;
    const safeProbability = 1 - mineHitProbability;
    
    // Fair odds would be 1 / safeProbability
    const fairMultiplier = 1 / safeProbability;
    
    // Apply house edge (5% house edge)
    const houseEdge = 0.95;
    const multiplier = fairMultiplier * houseEdge;
    
    return Math.max(1.01, multiplier); // Minimum 1% increase
}

function startMines() {
    if (currentUser.points < minesBet) {
        alert('Not enough points!');
        return;
    }
    
    currentUser.points -= minesBet;
    updateUI();
    
    minesMultiplier = 1.00;
    minesRevealed = 0;
    minesGameActive = true;
    minePositions.clear();
    
    // Place mines randomly based on selected count
    while (minePositions.size < selectedMineCount) {
        minePositions.add(Math.floor(Math.random() * 25));
    }
    
    document.getElementById('minesGrid').innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg border border-gray-600';
        cell.onclick = () => revealMine(i);
        cell.innerHTML = `
            <div class="mine-cell-content flex items-center justify-center w-full h-full rounded-xl overflow-hidden relative">
                <img src="assets/question.png" alt="Hidden" class="w-full h-full object-cover rounded-xl">
            </div>
        `;
        document.getElementById('minesGrid').appendChild(cell);
    }
    
    document.getElementById('cashOutBtn').classList.remove('hidden');
    document.getElementById('minesResult').classList.add('hidden');
    updateMinesDisplay();
}

function revealMine(index) {
    if (!minesGameActive) return;
    
    const cell = document.getElementById('minesGrid').children[index];
    if (cell.classList.contains('revealed')) return;
    
    cell.classList.add('revealed');
    
    if (minePositions.has(index)) {
        // Hit a mine - game over
        cell.innerHTML = `
            <div class="mine-revealed w-full h-full rounded-xl flex items-center justify-center shadow-lg animate-pulse relative overflow-hidden">
                <img src="assets/bomb.png" alt="Bomb" class="w-full h-full object-cover rounded-xl">
            </div>
        `;
        cell.className = 'mine-cell w-20 h-20 rounded-xl cursor-not-allowed';
        minesGameActive = false;
        
        // Reveal all mines with animation delay
        minePositions.forEach((pos, index) => {
            if (pos !== index) {
                setTimeout(() => {
                    const mineCell = document.getElementById('minesGrid').children[pos];
                    mineCell.innerHTML = `
                        <div class="mine-revealed w-full h-full rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
                            <img src="assets/bomb.png" alt="Bomb" class="w-full h-full object-cover rounded-xl">
                        </div>
                    `;
                    mineCell.className = 'mine-cell w-20 h-20 rounded-xl cursor-not-allowed';
                }, index * 100);
            }
        });
        
        document.getElementById('resultText').textContent = '💥 Game Over!';
        document.getElementById('resultSubtext').textContent = `You lost ${minesBet} points. Better luck next time!`;
        document.getElementById('minesResult').classList.remove('hidden');
        document.getElementById('cashOutBtn').classList.add('hidden');
        
        currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
        showPointsAnimation(minesBet, false);
    } else {
        // Found a diamond
        cell.innerHTML = `
            <div class="diamond-revealed w-full h-full rounded-xl flex items-center justify-center shadow-lg animate-bounce relative overflow-hidden">
                <img src="assets/mines.png" alt="Diamond" class="w-full h-full object-cover rounded-xl">
            </div>
        `;
        cell.className = 'mine-cell w-20 h-20 rounded-xl cursor-not-allowed';
        minesRevealed++;
        
        // Calculate new multiplier based on probability
        minesMultiplier = calculateMultiplier(minesRevealed, selectedMineCount);
        
        const maxPossibleDiamonds = totalCells - selectedMineCount;
        if (minesRevealed === maxPossibleDiamonds) {
            // Won - found all diamonds
            minesGameActive = false;
            const winAmount = Math.floor(minesBet * minesMultiplier);
            currentUser.points += winAmount;
            
            document.getElementById('resultText').textContent = '🎉 Perfect Game!';
            document.getElementById('resultSubtext').textContent = `You found all ${maxPossibleDiamonds} diamonds and won ${winAmount} points!`;
            document.getElementById('minesResult').classList.remove('hidden');
            document.getElementById('cashOutBtn').classList.add('hidden');
            
            currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
            showPointsAnimation(winAmount - minesBet, true);
        }
    }
    
    updateMinesDisplay();
    updateUI();
    updateStats();
    saveUserData();
}

function cashOutMines() {
    if (!minesGameActive || minesRevealed === 0) return;
    
    minesGameActive = false;
    const winAmount = Math.floor(minesBet * minesMultiplier);
    currentUser.points += winAmount;
    
    document.getElementById('resultText').textContent = '💰 Successfully Cashed Out!';
    document.getElementById('resultSubtext').textContent = `You won ${winAmount} points with ${minesRevealed} diamonds found!`;
    document.getElementById('minesResult').classList.remove('hidden');
    document.getElementById('cashOutBtn').classList.add('hidden');
    
    currentUser.gamesPlayed = (currentUser.gamesPlayed || 0) + 1;
    showPointsAnimation(winAmount - minesBet, true);
    
    updateUI();
    updateStats();
    saveUserData();
}

function updateMinesDisplay() {
    document.getElementById('minesMultiplier').textContent = minesMultiplier.toFixed(2) + 'x';
    document.getElementById('mineCount').textContent = selectedMineCount;
    document.getElementById('diamondsFound').textContent = minesRevealed;
    updatePotentialPayout();
}