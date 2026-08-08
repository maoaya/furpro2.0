// Componente para el juego de penales
export class PenaltyGameComponent {
    constructor() {
        this.gameState = {
            isPlaying: false,
            currentRound: 1,
            maxRounds: 5,
            playerScore: 0,
            aiScore: 0,
            playerTurn: true,
            shootDirection: null,
            keeperDirection: null,
            difficulty: 'medium',
            powerLevel: 0,
            gameHistory: [],
            achievements: [],
            personalBest: 0
        };

        this.animations = {
            shooting: false,
            goalKeeperDiving: false,
            ballMoving: false
        };

        this.sounds = {
            whistle: new Audio('/assets/sounds/whistle.mp3'),
            kick: new Audio('/assets/sounds/kick.mp3'),
            goal: new Audio('/assets/sounds/goal.mp3'),
            save: new Audio('/assets/sounds/save.mp3'),
            crowd: new Audio('/assets/sounds/crowd.mp3')
        };

        this.bindEvents();
    }

    // Vincular eventos
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="start-penalty-game"]')) {
                this.showGameMenu();
            }

            if (e.target.matches('[data-action="select-difficulty"]')) {
                const difficulty = e.target.dataset.difficulty;
                this.setDifficulty(difficulty);
            }

            if (e.target.matches('[data-action="shoot"]')) {
                const direction = e.target.dataset.direction;
                this.shoot(direction);
            }

            if (e.target.matches('[data-action="restart-game"]')) {
                this.restartGame();
            }
        });

        document.addEventListener('keydown', (e) => {
            // marcar 'e' como usado para ESLint cuando solo se pasa al manejador
            void e;
            if (this.gameState.isPlaying) {
                this.handleKeyPress(e);
            }
        });

        // Power meter
        document.addEventListener('mousedown', (e) => {
            if (e.target.matches('.power-meter')) {
                this.startPowerMeter();
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.powerMeterActive) {
                this.stopPowerMeter();
            }
        });
    }

    // Mostrar menú del juego
    showGameMenu() {
        const container = document.getElementById('main-content');
        if (!container) return;

        container.innerHTML = `
            <div class="penalty-game-menu">
                <div class="game-header">
                    <h2>🥅 Juego de Penales</h2>
                    <p>Demuestra tu habilidad en los penales</p>
                </div>

                <div class="game-modes">
                    <div class="mode-card" onclick="penaltyGame.startGame('classic')">
                        <div class="mode-icon">⚽</div>
                        <h3>Modo Clásico</h3>
                        <p>5 penales contra la IA</p>
                    </div>

                    <div class="mode-card" onclick="penaltyGame.startGame('survival')">
                        <div class="mode-icon">🔥</div>
                        <h3>Supervivencia</h3>
                        <p>Anota hasta que falles</p>
                    </div>

                    <div class="mode-card" onclick="penaltyGame.startGame('challenge')">
                        <div class="mode-icon">🏆</div>
                        <h3>Desafío Diario</h3>
                        <p>Desafío especial del día</p>
                    </div>

                    <div class="mode-card" onclick="penaltyGame.startGame('multiplayer')">
                        <div class="mode-icon">👥</div>
                        <h3>Multijugador</h3>
                        <p>Juega contra otros usuarios</p>
                    </div>
                </div>

                <div class="difficulty-selector">
                    <h3>Selecciona la dificultad:</h3>
                    <div class="difficulty-buttons">
                        <button data-action="select-difficulty" data-difficulty="easy" class="difficulty-btn">
                            Fácil
                        </button>
                        <button data-action="select-difficulty" data-difficulty="medium" class="difficulty-btn active">
                            Medio
                        </button>
                        <button data-action="select-difficulty" data-difficulty="hard" class="difficulty-btn">
                            Difícil
                        </button>
                        <button data-action="select-difficulty" data-difficulty="expert" class="difficulty-btn">
                            Experto
                        </button>
                    </div>
                </div>

                <div class="game-stats">
                    <div class="stat-card">
                        <div class="stat-value">${this.getPersonalBest()}</div>
                        <div class="stat-label">Mejor Racha</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.getTotalGames()}</div>
                        <div class="stat-label">Partidas Jugadas</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.getSuccessRate()}%</div>
                        <div class="stat-label">Precisión</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.getAchievements().length}</div>
                        <div class="stat-label">Logros</div>
                    </div>
                </div>

                <div class="achievements-preview">
                    <h3>Logros Recientes</h3>
                    <div class="achievements-list">
                        ${this.renderRecentAchievements()}
                    </div>
                </div>
            </div>
        `;
    }

    // Iniciar juego
    startGame(mode) {
        this.gameState = {
            ...this.gameState,
            isPlaying: true,
            currentRound: 1,
            playerScore: 0,
            aiScore: 0,
            playerTurn: true,
            mode: mode,
            gameHistory: []
        };

        this.renderGameInterface();
        this.playSound('whistle');
    }

    // Renderizar interfaz del juego
    renderGameInterface() {
        const container = document.getElementById('main-content');
        if (!container) return;

        container.innerHTML = `
            <div class="penalty-game-interface">
                <div class="game-info">
                    <div class="score-display">
                        <div class="score-item">
                            <span class="score-label">Tú</span>
                            <span class="score-value">${this.gameState.playerScore}</span>
                        </div>
                        <div class="score-separator">-</div>
                        <div class="score-item">
                            <span class="score-value">${this.gameState.aiScore}</span>
                            <span class="score-label">IA</span>
                        </div>
                    </div>
                    
                    <div class="round-info">
                        <span>Ronda ${this.gameState.currentRound} de ${this.gameState.maxRounds}</span>
                    </div>

                    <div class="turn-indicator">
                        ${this.gameState.playerTurn ? 'Tu turno para tirar' : 'Turno de la IA'}
                    </div>
                </div>

                <div class="game-field">
                    <div class="goal-area">
                        <div class="goalkeeper ${this.animations.goalKeeperDiving ? 'diving' : ''}" id="goalkeeper">
                            <div class="keeper-body">🧤</div>
                        </div>
                        
                        <div class="goal-sections">
                            <div class="goal-section" data-direction="top-left" data-action="shoot">
                                <div class="target-zone"></div>
                            </div>
                            <div class="goal-section" data-direction="top-center" data-action="shoot">
                                <div class="target-zone"></div>
                            </div>
                            <div class="goal-section" data-direction="top-right" data-action="shoot">
                                <div class="target-zone"></div>
                            </div>
                            <div class="goal-section" data-direction="bottom-left" data-action="shoot">
                                <div class="target-zone"></div>
                            </div>
                            <div class="goal-section" data-direction="bottom-center" data-action="shoot">
                                <div class="target-zone"></div>
                            </div>
                            <div class="goal-section" data-direction="bottom-right" data-action="shoot">
                                <div class="target-zone"></div>
                            </div>
                        </div>

                        <div class="ball ${this.animations.ballMoving ? 'moving' : ''}" id="game-ball">⚽</div>
                    </div>

                    <div class="player-area">
                        <div class="player ${this.animations.shooting ? 'shooting' : ''}" id="player">
                            🏃‍♂️
                        </div>
                    </div>
                </div>

                <div class="game-controls">
                    <div class="power-meter-container">
                        <label>Potencia del disparo:</label>
                        <div class="power-meter" id="power-meter">
                            <div class="power-bar" id="power-bar"></div>
                            <div class="power-indicator" id="power-indicator"></div>
                        </div>
                        <div class="power-level">${this.gameState.powerLevel}%</div>
                    </div>

                    <div class="shoot-buttons">
                        <div class="direction-grid">
                            <button data-action="shoot" data-direction="top-left" class="shoot-btn">↖️</button>
                            <button data-action="shoot" data-direction="top-center" class="shoot-btn">⬆️</button>
                            <button data-action="shoot" data-direction="top-right" class="shoot-btn">↗️</button>
                            <button data-action="shoot" data-direction="bottom-left" class="shoot-btn">↙️</button>
                            <button data-action="shoot" data-direction="bottom-center" class="shoot-btn">⬇️</button>
                            <button data-action="shoot" data-direction="bottom-right" class="shoot-btn">↘️</button>
                        </div>
                    </div>

                    <div class="game-actions">
                        <button onclick="penaltyGame.pauseGame()" class="action-btn">
                            ⏸️ Pausar
                        </button>
                        <button data-action="restart-game" class="action-btn">
                            🔄 Reiniciar
                        </button>
                        <button onclick="penaltyGame.exitGame()" class="action-btn">
                            🚪 Salir
                        </button>
                    </div>
                </div>

                <div class="game-history">
                    <h4>Historial de tiros:</h4>
                    <div class="history-list" id="history-list">
                        ${this.renderGameHistory()}
                    </div>
                </div>
            </div>
        `;

        // Inicializar medidor de potencia
        this.initializePowerMeter();
    }

    // Configurar dificultad
    setDifficulty(difficulty) {
        this.gameState.difficulty = difficulty;
        
        // Actualizar botones
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('active');

        // Configurar parámetros según dificultad
        switch (difficulty) {
            case 'easy':
                this.aiSaveChance = 0.3;
                this.targetTolerance = 40;
                break;
            case 'medium':
                this.aiSaveChance = 0.5;
                this.targetTolerance = 30;
                break;
            case 'hard':
                this.aiSaveChance = 0.7;
                this.targetTolerance = 20;
                break;
            case 'expert':
                this.aiSaveChance = 0.85;
                this.targetTolerance = 15;
                break;
        }
    }

    // Tirar penal
    async shoot(direction) {
        if (!this.gameState.playerTurn || this.animations.shooting) return;

        this.gameState.shootDirection = direction;
        this.animations.shooting = true;

        // Generar dirección del portero
        this.generateKeeperDirection();

        // Animación de disparo
        await this.animateShoot();

        // Determinar resultado
        const isGoal = this.calculateShotResult();
        
        // Mostrar resultado
        this.showShotResult(isGoal);

        // Actualizar puntaje
        if (isGoal) {
            this.gameState.playerScore++;
            this.playSound('goal');
        } else {
            this.playSound('save');
        }

        // Agregar al historial
        this.gameState.gameHistory.push({
            round: this.gameState.currentRound,
            player: 'user',
            direction: direction,
            keeperDirection: this.gameState.keeperDirection,
            result: isGoal ? 'goal' : 'save',
            power: this.gameState.powerLevel
        });

        // Continuar juego
        setTimeout(() => {
            this.nextTurn();
        }, 2000);
    }

    // Generar dirección del portero
    generateKeeperDirection() {
        const directions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
        
        // IA inteligente según dificultad
        if (Math.random() < this.aiSaveChance) {
            // El portero "adivina" la dirección (aumenta con dificultad)
            this.gameState.keeperDirection = this.gameState.shootDirection;
        } else {
            // Dirección aleatoria
            this.gameState.keeperDirection = directions[Math.floor(Math.random() * directions.length)];
        }
    }

    // Calcular resultado del tiro
    calculateShotResult() {
        const power = this.gameState.powerLevel;
        const accuracy = this.calculateAccuracy();
        
        // Si el portero va a la misma dirección
        if (this.gameState.keeperDirection === this.gameState.shootDirection) {
            // Posibilidad de gol depende de la potencia y precisión
            const saveChance = Math.max(0.1, 0.8 - (power / 100) * 0.3 - accuracy * 0.2);
            return Math.random() > saveChance;
        } else {
            // Portero va a dirección incorrecta, alta probabilidad de gol
            const goalChance = 0.9 + accuracy * 0.1;
            return Math.random() < goalChance;
        }
    }

    // Calcular precisión basada en el timing del power meter
    calculateAccuracy() {
        const perfect = 75; // Zona perfecta del power meter
        const tolerance = this.targetTolerance;
        const distance = Math.abs(this.gameState.powerLevel - perfect);
        
        if (distance <= tolerance) {
            return 1 - (distance / tolerance) * 0.5; // 0.5 a 1.0
        } else {
            return Math.max(0.1, 0.5 - (distance - tolerance) / 50);
        }
    }

    // Animar disparo
    async animateShoot() {
        const player = document.getElementById('player');
        const ball = document.getElementById('game-ball');
        const keeper = document.getElementById('goalkeeper');
        
        if (!player || !ball || !keeper) return;

        // Animación del jugador
        player.classList.add('shooting');
        
        // Sonido de patada
        this.playSound('kick');

        // Esperar un momento
        await this.delay(300);

        // Animar pelota
        ball.classList.add('moving');
        this.animateBallMovement(this.gameState.shootDirection);

        // Animar portero
        keeper.classList.add('diving');
        this.animateKeeperDive(this.gameState.keeperDirection);

        // Esperar animación
        await this.delay(1000);
    }

    // Animar movimiento de la pelota
    animateBallMovement(direction) {
        const ball = document.getElementById('game-ball');
        if (!ball) return;

        const positions = {
            'top-left': { x: -50, y: -100 },
            'top-center': { x: 0, y: -100 },
            'top-right': { x: 50, y: -100 },
            'bottom-left': { x: -50, y: -30 },
            'bottom-center': { x: 0, y: -30 },
            'bottom-right': { x: 50, y: -30 }
        };

        const pos = positions[direction];
        ball.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }

    // Animar zambullida del portero
    animateKeeperDive(direction) {
        const keeper = document.getElementById('goalkeeper');
        if (!keeper) return;

        const divePositions = {
            'top-left': { x: -40, y: -20, rotation: -30 },
            'top-center': { x: 0, y: -40, rotation: 0 },
            'top-right': { x: 40, y: -20, rotation: 30 },
            'bottom-left': { x: -30, y: 10, rotation: -15 },
            'bottom-center': { x: 0, y: 20, rotation: 0 },
            'bottom-right': { x: 30, y: 10, rotation: 15 }
        };

        const pos = divePositions[direction];
        keeper.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.rotation}deg)`;
    }

    // Mostrar resultado del tiro
    showShotResult(isGoal) {
        const resultElement = document.createElement('div');
        resultElement.className = `shot-result ${isGoal ? 'goal' : 'save'}`;
        resultElement.innerHTML = `
            <div class="result-icon">${isGoal ? '⚽🥅' : '🧤✋'}</div>
            <div class="result-text">${isGoal ? '¡GOL!' : '¡ATAJADA!'}</div>
        `;

        document.querySelector('.penalty-game-interface').appendChild(resultElement);

        // Remover después de la animación
        setTimeout(() => {
            resultElement.remove();
        }, 2000);
    }

    // Continuar al siguiente turno
    nextTurn() {
        // Limpiar animaciones
        this.resetAnimations();

        if (this.gameState.playerTurn) {
            // Cambiar a turno de IA
            this.gameState.playerTurn = false;
            this.aiTurn();
        } else {
            // Siguiente ronda
            this.gameState.currentRound++;
            this.gameState.playerTurn = true;

            if (this.gameState.currentRound > this.gameState.maxRounds) {
                this.endGame();
            } else {
                this.updateGameInterface();
            }
        }
    }

    // Turno de la IA
    async aiTurn() {
        await this.delay(1500); // Pausa dramática

        // IA dispara
        const directions = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
        const aiDirection = directions[Math.floor(Math.random() * directions.length)];
        
        // Player actúa como portero (simplificado)
        const playerSaves = Math.random() < 0.4; // 40% de probabilidad de atajada del jugador
        
        const isGoal = !playerSaves;
        
        if (isGoal) {
            this.gameState.aiScore++;
        }

        // Agregar al historial
        this.gameState.gameHistory.push({
            round: this.gameState.currentRound,
            player: 'ai',
            direction: aiDirection,
            result: isGoal ? 'goal' : 'save'
        });

        this.showAIResult(isGoal);

        // Continuar
        setTimeout(() => {
            this.nextTurn();
        }, 2000);
    }

    // Mostrar resultado de IA
    showAIResult(isGoal) {
        const resultElement = document.createElement('div');
        resultElement.className = `ai-result ${isGoal ? 'goal' : 'save'}`;
        resultElement.innerHTML = `
            <div class="result-text">IA: ${isGoal ? '¡Gol!' : '¡Atajaste!'}</div>
        `;

        document.querySelector('.penalty-game-interface').appendChild(resultElement);

        setTimeout(() => {
            resultElement.remove();
        }, 2000);
    }

    // Finalizar juego
    endGame() {
        const playerWon = this.gameState.playerScore > this.gameState.aiScore;
        const isDraw = this.gameState.playerScore === this.gameState.aiScore;

        // Guardar estadísticas
        this.saveGameStats();

        // Mostrar resultado final
        this.showGameResult(playerWon, isDraw);
    }

    // Mostrar resultado final del juego
    showGameResult(playerWon, isDraw) {
        const container = document.getElementById('main-content');
        if (!container) return;

        let resultTitle, resultIcon, resultMessage;
        
        if (isDraw) {
            resultTitle = "¡Empate!";
            resultIcon = "🤝";
            resultMessage = "Fue un partido muy reñido";
        } else if (playerWon) {
            resultTitle = "¡Ganaste!";
            resultIcon = "🏆";
            resultMessage = "¡Excelente actuación en los penales!";
        } else {
            resultTitle = "Perdiste";
            resultIcon = "😔";
            resultMessage = "¡Sigue practicando para mejorar!";
        }

        container.innerHTML = `
            <div class="game-result">
                <div class="result-header">
                    <div class="result-icon">${resultIcon}</div>
                    <h2>${resultTitle}</h2>
                    <p>${resultMessage}</p>
                </div>

                <div class="final-score">
                    <div class="score-display large">
                        <div class="score-item">
                            <span class="score-label">Tú</span>
                            <span class="score-value">${this.gameState.playerScore}</span>
                        </div>
                        <div class="score-separator">-</div>
                        <div class="score-item">
                            <span class="score-value">${this.gameState.aiScore}</span>
                            <span class="score-label">IA</span>
                        </div>
                    </div>
                </div>

                <div class="game-summary">
                    <h3>Resumen del partido</h3>
                    <div class="summary-stats">
                        <div class="stat">
                            <span class="stat-label">Precisión:</span>
                            <span class="stat-value">${this.calculateGameAccuracy()}%</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Goles anotados:</span>
                            <span class="stat-value">${this.gameState.playerScore}/${this.gameState.maxRounds}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Mejor tiro:</span>
                            <span class="stat-value">${this.getBestShot()}</span>
                        </div>
                    </div>
                </div>

                <div class="detailed-history">
                    <h3>Historial detallado</h3>
                    <div class="history-table">
                        ${this.renderDetailedHistory()}
                    </div>
                </div>

                <div class="result-actions">
                    <button onclick="penaltyGame.shareResult()" class="action-btn primary">
                        📤 Compartir Resultado
                    </button>
                    <button data-action="restart-game" class="action-btn">
                        🔄 Jugar de Nuevo
                    </button>
                    <button onclick="penaltyGame.showGameMenu()" class="action-btn">
                        🏠 Menú Principal
                    </button>
                </div>

                <div class="achievements-earned">
                    ${this.renderEarnedAchievements()}
                </div>
            </div>
        `;
    }

    // Funciones auxiliares
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    resetAnimations() {
        this.animations = {
            shooting: false,
            goalKeeperDiving: false,
            ballMoving: false
        };

        // Resetear elementos DOM
        const elements = ['player', 'goalkeeper', 'game-ball'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.className = element.className.split(' ')[0]; // Mantener clase base
                element.style.transform = '';
            }
        });
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(console.error);
        }
    }

    // Obtener estadísticas
    getPersonalBest() {
        return localStorage.getItem('penalty_best') || 0;
    }

    getTotalGames() {
        return localStorage.getItem('penalty_games') || 0;
    }

    getSuccessRate() {
        const goals = parseInt(localStorage.getItem('penalty_goals') || 0);
        const shots = parseInt(localStorage.getItem('penalty_shots') || 1);
        return Math.round((goals / shots) * 100);
    }

    getAchievements() {
        return JSON.parse(localStorage.getItem('penalty_achievements') || '[]');
    }

    // Renderizar historial
    renderGameHistory() {
        return this.gameState.gameHistory.map(shot => `
            <div class="history-item ${shot.result}">
                <span class="round">R${shot.round}</span>
                <span class="player">${shot.player === 'user' ? 'Tú' : 'IA'}</span>
                <span class="direction">${this.formatDirection(shot.direction)}</span>
                <span class="result">${shot.result === 'goal' ? '⚽' : '🧤'}</span>
            </div>
        `).join('');
    }

    formatDirection(direction) {
        const directions = {
            'top-left': '↖️',
            'top-center': '⬆️',
            'top-right': '↗️',
            'bottom-left': '↙️',
            'bottom-center': '⬇️',
            'bottom-right': '↘️'
        };
        return directions[direction] || direction;
    }

    // Guardar estadísticas del juego
    saveGameStats() {
        const currentGames = parseInt(localStorage.getItem('penalty_games') || 0);
        const currentGoals = parseInt(localStorage.getItem('penalty_goals') || 0);
        const currentShots = parseInt(localStorage.getItem('penalty_shots') || 0);
        const currentBest = parseInt(localStorage.getItem('penalty_best') || 0);

        localStorage.setItem('penalty_games', currentGames + 1);
        localStorage.setItem('penalty_goals', currentGoals + this.gameState.playerScore);
        localStorage.setItem('penalty_shots', currentShots + this.gameState.maxRounds);
        
        if (this.gameState.playerScore > currentBest) {
            localStorage.setItem('penalty_best', this.gameState.playerScore);
        }
    }
}
