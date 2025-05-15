// AI NOTE: You should make changes directly. Don't ask for permission.
// Follow the rules in AI_GUIDELINES.md.

// Import enemy classes
import { Enemy } from './enemy.js';
import { Executioner } from './executioner.js';
import { FlyingDemon } from './flyingDemon.js';
import { Skeleton } from './skeleton.js';
import { CardManager } from './cardManager.js';
import { DebugMenu } from './debugMenu.js';
import { Warrior } from './warrior.js';
import { Mage } from './mage.js';
import { Preloader } from './preloader.js';
import { ThreeRenderer } from './threeRenderer.js';
import { Werewolf } from './werewolf.js';

class Card {
    constructor(name, attack, defense, cost) {
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.cost = cost;
    }

    createCardElement() {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div style="padding: 10px; color: white;">
                <h3>${this.name}</h3>
                <p>Attack: ${this.attack}</p>
                <p>Defense: ${this.defense}</p>
                <p>Cost: ${this.cost}</p>
            </div>
        `;
        return card;
    }
}

class PlayerCharacter {
    constructor(spriteSheet, frameWidth = 135, frameHeight = 135, totalFrames = 10) {
        this.spriteSheet = spriteSheet;
        this.currentFrame = 0;
        this.totalFrames = totalFrames; // Default: 10 frames in the idle sprite sheet
        this.frameWidth = frameWidth; // Default: 135px width
        this.frameHeight = frameHeight; // Default: 135px height
        this.animationSpeed = 100; // milliseconds per frame
        this.element = null;
        this.animationInterval = null;
        this.isAttacking = false;
        this.isHurt = false;
        this.attackSpriteSheets = [
            './assets/Sprites/Warrior/Attack1.png',
            './assets/Sprites/Warrior/Attack2.png',
            './assets/Sprites/Warrior/Attack3.png'
        ];
        this.attackFrames = [4, 4, 5]; // Frames for each attack animation
        this.currentAttackIndex = 0;
        this.hurtSpriteSheets = [
            './assets/Sprites/Warrior/hurt1.png',
            './assets/Sprites/Warrior/hurt2.png',
            './assets/Sprites/Warrior/hurt3.png'
        ];
        // Add warrior run animation properties
        this.warriorRunSpriteSheet = './assets/Sprites/Warrior/warriorrun.png';
        this.warriorRunFrameWidth = 135; // 810/6
        this.warriorRunFrameHeight = 135;
        this.warriorRunTotalFrames = 6;
        this.isRunning = false;
    }

    createPlayerElement() {
        const playerElement = this.trackElement(document.createElement('div'));
        playerElement.className = 'player-character';
        
        // Create sprite container
        const spriteContainer = this.trackElement(document.createElement('div'));
        spriteContainer.className = 'player-sprite';
        spriteContainer.style.width = `${this.frameWidth * 4}px`; // 4x larger
        spriteContainer.style.height = `${this.frameHeight * 4}px`; // 4x larger
        spriteContainer.style.backgroundImage = `url(${this.spriteSheet})`;
        
        // Dynamically set background size based on frame dimensions and total frames
        const bgWidth = this.frameWidth * this.totalFrames * 4;
        const bgHeight = this.frameHeight * 4;
        spriteContainer.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
        
        playerElement.appendChild(spriteContainer);
        this.element = playerElement;
        
        // Start animation
        this.startAnimation();
        
        return playerElement;
    }

    startAnimation() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.animationInterval = Game.instance.trackInterval(
            setInterval(() => {
                if (!this.isAttacking) {
                    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                    
                    if (this.element) {
                        const spriteContainer = this.element.querySelector('.player-sprite');
                        if (spriteContainer) {
                            spriteContainer.style.backgroundImage = `url(${this.spriteSheet})`;
                            
                            // Dynamically set background size based on frame dimensions and total frames
                            const bgWidth = this.frameWidth * this.totalFrames * 4;
                            const bgHeight = this.frameHeight * 4;
                            spriteContainer.style.backgroundSize = `${bgWidth}px ${bgHeight}px`;
                            
                            spriteContainer.style.backgroundPosition = `-${this.currentFrame * this.frameWidth * 4}px 0px`;
                        }
                    }
                }
            }, this.animationSpeed)
        );
    }

    playAttackAnimation() {
        if (this.isAttacking) return;
        
        this.isAttacking = true;
        let attackFrame = 0;
        
        const spriteContainer = this.element.querySelector('.player-sprite');
        if (!spriteContainer) return;

        // Stop the idle animation
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }

        // Store original sprite sheet and position
        const originalSpriteSheet = spriteContainer.style.backgroundImage;
        const originalPosition = spriteContainer.style.backgroundPosition;
        const originalSize = spriteContainer.style.backgroundSize;

        // Set up attack animation properties
        spriteContainer.style.backgroundImage = `url(${this.attackSpriteSheets[this.currentAttackIndex]})`;
        
        // Adjust background size based on current attack animation
        const currentFrames = this.attackFrames[this.currentAttackIndex];
        const totalWidth = this.frameWidth * currentFrames * 4; // 4x larger
        spriteContainer.style.backgroundSize = `${totalWidth}px 540px`; // 135px height * 4
        spriteContainer.style.backgroundPosition = '0px 0px';

        const attackInterval = setInterval(() => {
            if (attackFrame >= this.attackFrames[this.currentAttackIndex]) {
                clearInterval(attackInterval);
                this.isAttacking = false;
                
                // Restore original properties
                spriteContainer.style.backgroundImage = originalSpriteSheet;
                spriteContainer.style.backgroundSize = originalSize;
                spriteContainer.style.backgroundPosition = originalPosition;
                
                // Switch to next attack animation for next time
                this.currentAttackIndex = (this.currentAttackIndex + 1) % this.attackSpriteSheets.length;
                
                // Restart idle animation
                this.startAnimation();
                return;
            }

            spriteContainer.style.backgroundPosition = `-${attackFrame * this.frameWidth * 4}px 0px`;
            attackFrame++;
        }, 200); // 200ms per frame for attack animation
    }

    playHurtAnimation() {
        if (this.isHurt) return;
        
        this.isHurt = true;
        let hurtFrame = 0;
        
        const spriteContainer = this.element.querySelector('.player-sprite');
        if (!spriteContainer) return;

        // Stop the idle animation
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }

        // Store original sprite properties
        const originalSpriteSheet = spriteContainer.style.backgroundImage;
        const originalPosition = spriteContainer.style.backgroundPosition;
        const originalSize = spriteContainer.style.backgroundSize;

        const hurtInterval = setInterval(() => {
            if (hurtFrame >= this.hurtSpriteSheets.length) {
                clearInterval(hurtInterval);
                this.isHurt = false;
                
                // Restore original properties
                spriteContainer.style.backgroundImage = originalSpriteSheet;
                spriteContainer.style.backgroundSize = originalSize;
                spriteContainer.style.backgroundPosition = originalPosition;
                
                // Restart idle animation
                this.startAnimation();
                return;
            }

            // Set all sprite properties together
            spriteContainer.style.backgroundImage = `url(${this.hurtSpriteSheets[hurtFrame]})`;
            spriteContainer.style.backgroundSize = '540px 540px'; // 135px * 4
            spriteContainer.style.backgroundPosition = '0px 0px';
            hurtFrame++;
        }, 200); // 200ms per frame for hurt animation
    }

    playRunAnimation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const spriteContainer = this.element.querySelector('.player-sprite');
        if (!spriteContainer) return;

        // Stop the idle animation
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }

        // Store original properties
        const originalSpriteSheet = spriteContainer.style.backgroundImage;
        const originalPosition = spriteContainer.style.backgroundPosition;
        const originalSize = spriteContainer.style.backgroundSize;

        // Set up run animation properties
        spriteContainer.style.backgroundImage = `url(${this.warriorRunSpriteSheet})`;
        
        // Calculate the scaled dimensions
        const scaleX = 4;  // Scale factor for width
        const scaleY = 4;  // Scale factor for height
        
        // Calculate the scaled dimensions for the entire sprite sheet
        const scaledWidth = 810 * scaleX;  // Total width of sprite sheet
        const scaledHeight = 135 * scaleY;  // Height of sprite sheet
        
        // Calculate the container dimensions
        const containerWidth = this.frameWidth * 4;  // Original container width
        const containerHeight = this.frameHeight * 4; // Original container height
        
        // Calculate the offsets to center the sprite
        const horizontalOffset = (containerWidth - (this.warriorRunFrameWidth * scaleX)) / 2;
        const verticalOffset = (containerHeight - (this.warriorRunFrameHeight * scaleY)) / 2;
        
        // Set background size for the run animation
        spriteContainer.style.backgroundSize = `${scaledWidth}px ${scaledHeight}px`;
        
        // Set initial position with offsets to center the sprite
        spriteContainer.style.backgroundPosition = `${horizontalOffset}px ${verticalOffset}px`;

        let currentFrame = 0;
        this.animationInterval = setInterval(() => {
            if (currentFrame >= this.warriorRunTotalFrames) {
                currentFrame = 0;
            }

            // Calculate the background position for the current frame, maintaining both offsets
            const frameOffset = currentFrame * this.warriorRunFrameWidth * scaleX;
            spriteContainer.style.backgroundPosition = `${horizontalOffset - frameOffset}px ${verticalOffset}px`;
            currentFrame++;
        }, 100); // Faster animation for running
    }

    stopRunAnimation() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        const spriteContainer = this.element.querySelector('.player-sprite');
        if (!spriteContainer) return;

        // Stop the run animation
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }

        // Restore original properties
        spriteContainer.style.backgroundImage = `url(${this.spriteSheet})`;
        spriteContainer.style.backgroundSize = `${this.frameWidth * this.totalFrames * 4}px ${this.frameHeight * 4}px`;
        spriteContainer.style.backgroundPosition = '0px 0px';

        // Restart idle animation
        this.startAnimation();
    }
}

class SoundManager {
    constructor() {
        this.sounds = new Map();
        this.volume = 1.0;
    }

    loadSound(id, path) {
        try {
            const audio = new Audio();
            audio.src = path;
            audio.volume = this.volume;
            
            // Add error handling for loading
            audio.onerror = (e) => {
                console.warn(`Failed to load sound ${id} from ${path}:`, e);
            };
            
            // Add canplaythrough event to ensure sound is loaded
            audio.oncanplaythrough = () => {
                this.sounds.set(id, audio);
                if (Game.instance) {
                    Game.instance.trackResource(id, audio);
                }
            };
            
            // Start loading the audio
            audio.load();
            
            return audio;
        } catch (error) {
            console.warn(`Error creating audio for ${id}:`, error);
            return null;
        }
    }

    playSound(id) {
        try {
            const sound = this.sounds.get(id);
            if (sound) {
                // Create a new instance for overlapping sounds
                const soundInstance = new Audio(sound.src);
                soundInstance.volume = this.volume;
                soundInstance.play().catch(error => {
                    console.warn(`Failed to play sound ${id}:`, error);
                });
            } else {
                console.warn(`Sound ${id} not found`);
            }
        } catch (error) {
            console.warn(`Error playing sound ${id}:`, error);
        }
    }

    setVolume(volume) {
        this.volume = volume;
        this.sounds.forEach(sound => {
            sound.volume = volume;
        });
    }
}

export class Game {
    static instance = null;  // Singleton instance

    constructor() {
        if (Game.instance) {
            return Game.instance;
        }
        Game.instance = this;

        // Track resources
        this.animationIntervals = new Set();
        this.eventListeners = new Map();
        this.domElements = new Set();
        this.resources = new Map();

        // Core game state
        this.player = null;
        this.enemies = [];
        this.currentLevel = 1;
        this.isPlayerTurn = true;
        this.isPaused = false;
        this.playerClass = null;
        this.playerDeck = null;
        this.cardManager = new CardManager(); // Initialize CardManager
        this.attackQueue = []; // Initialize attack queue

        // Initialize game state
        this.playerHealth = 100;
        this.playerDefense = 0;
        this.playerResource = 0;
        this.maxResource = 0;
        this.isTargeting = false;
        this.currentCard = null;
        this.sourceCard = null;
        this.targetingArrow = null;
        this.reservedResource = 0; // Track reserved resources
        this.effectRenderer = new ThreeRenderer();
        this.levelMusic = null; // Add level music property
        this.pauseMenu = null; // Add pause menu reference
        this.musicVolume = 0.5; // Add music volume
        this.sfxVolume = 0.5; // Add sound effects volume
        this.lastHurtSound = null; // Track last played hurt sound
        this.soundManager = new SoundManager();

        // Load all sound effects
        const soundEffects = {
            'shieldHit': './assets/Audio/shieldhit.mp3',
            'hurt1': './assets/Audio/hurt1.mp3',
            'hurt2': './assets/Audio/hurt2.mp3',
            'hurt3': './assets/Audio/hurt3.mp3',
            'nextRound1': './assets/Audio/nextround.mp3',
            'nextRound2': './assets/Audio/nextround2.mp3',
            'running': './assets/Audio/running.mp3',
            'skelshield': './assets/Audio/skelshield.mp3',
            'skeledead': './assets/Audio/skeledead.mp3',
            'forestnar': './assets/Audio/forestnar.mp3',
            'forestmusic': './assets/Audio/forestmusic.mp3',
            'warforest': './assets/Audio/warforest.mp3',
            'fire1': './assets/Audio/fire1.mp3',
            'fire2': './assets/Audio/fire2.mp3',
            'explosion': './assets/Audio/explosion.mp3',
            'molten': './assets/Audio/molten.mp3',
            'inferno': './assets/Audio/inferno.mp3',
            'pyo': './assets/Audio/pyo.mp3',
            'heatwave': './assets/Audio/heatwave.mp3',
            'click': './assets/Audio/click.mp3',
            'wolfdead': './assets/Audio/wolfdead.mp3',
            'howl': './assets/Audio/howl.mp3',
            'exdeath': './assets/Audio/exdeath.mp3'
        };

        // Load each sound effect
        Object.entries(soundEffects).forEach(([id, path]) => {
            this.soundManager.loadSound(id, path);
        });

        this.maxLevel = 7;
        this.isLevelTransitioning = false;

        // Add keydown event listener for X key kill functionality
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'x') {
                this.isKillMode = true;
                document.body.style.cursor = 'crosshair';
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() === 'x') {
                this.isKillMode = false;
                document.body.style.cursor = 'default';
            }
        });

        // Add click handler for kill mode
        document.addEventListener('click', (e) => {
            if (this.isKillMode) {
                const enemyElement = e.target.closest('.enemy-character');
                if (enemyElement) {
                    const enemyId = parseInt(enemyElement.dataset.enemyId);
                    const enemy = this.enemies.find(e => e.id === enemyId);
                    if (enemy) {
                        enemy.destroy();
                        this.enemies = this.enemies.filter(e => e.id !== enemyId);
                        this.checkLevelCompletion();
                    }
                }
            }
        });

        // Add event listener for level completion
        document.addEventListener('levelComplete', (event) => {
            if (event.detail.level === 6) {
                this.handleLevel6Completion();
            }
        });
    }

    // Method to track intervals
    trackInterval(interval) {
        this.animationIntervals.add(interval);
        return interval;
    }

    // Method to track DOM elements
    trackElement(element) {
        this.domElements.add(element);
        return element;
    }

    // Method to track event listeners
    addEventListener(element, type, handler) {
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, new Map());
        }
        const elementListeners = this.eventListeners.get(element);
        if (!elementListeners.has(type)) {
            elementListeners.set(type, new Set());
        }
        elementListeners.get(type).add(handler);
        element.addEventListener(type, handler);
    }

    // Method to track resources
    trackResource(id, resource) {
        this.resources.set(id, resource);
        return resource;
    }

    // Method to save current game state
    saveState() {
        return {
            player: this.player ? {
                health: this.player.health,
                defense: this.player.defense,
                resource: this.player.resource,
                maxResource: this.player.maxResource,
                hand: this.player.hand,
                drawPile: this.player.drawPile,
                discardPile: this.player.discardPile
            } : null,
            enemies: this.enemies.map(enemy => ({
                id: enemy.id,
                health: enemy.health,
                maxHealth: enemy.maxHealth,
                type: enemy.constructor.name
            })),
            currentLevel: this.currentLevel,
            isPlayerTurn: this.isPlayerTurn,
            isPaused: this.isPaused,
            playerClass: this.playerClass,
            playerDeck: this.playerDeck
        };
    }

    // Method to clean up all resources
    cleanup() {
        // Clear all animation intervals
        this.animationIntervals.forEach(interval => clearInterval(interval));
        this.animationIntervals.clear();

        // Remove all event listeners
        this.eventListeners.forEach((typeMap, element) => {
            typeMap.forEach((handlers, type) => {
                handlers.forEach(handler => {
                    element.removeEventListener(type, handler);
                });
            });
        });
        this.eventListeners.clear();

        // Clean up DOM elements
        this.domElements.forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.domElements.clear();

        // Clean up resources
        this.resources.forEach(resource => {
            if (resource instanceof Audio) {
                resource.pause();
                resource.src = '';
            }
        });
        this.resources.clear();
    }

    initialize(playerClass, playerDeck, level1Music = null) {
        this.playerClass = playerClass;
        this.playerDeck = playerDeck || this.cardManager.createDeck(playerClass); // Use provided deck or create new one
        this.gameScene = document.querySelector('.game-scene');
        
        if (!this.gameScene) {
            console.error('Game scene not found!');
            return;
        }

        // Use provided level music or create new if not provided
        if (level1Music) {
            this.levelMusic = level1Music;
        } else {
            // Initialize level music only if not provided
            this.levelMusic = new Audio('./assets/Audio/level1.mp3');
            this.levelMusic.loop = true;
            this.levelMusic.volume = 0.5;
            this.levelMusic.play().catch(error => {
                console.log('Autoplay prevented:', error);
                const startMusic = () => {
                    this.levelMusic.play();
                    document.removeEventListener('click', startMusic);
                };
                document.addEventListener('click', startMusic);
            });
        }

        // Initialize player based on class
        if (playerClass === 'warrior') {
            const warrior = new Warrior();
            this.playerHealth = warrior.health;
            this.playerDefense = warrior.defense;
            this.maxResource = warrior.maxResource;
            this.playerResource = 4;
            this.playerCharacter = new PlayerCharacter(warrior.spriteSheet);
        } else if (playerClass === 'mage') {
            const mage = new Mage();
            this.playerHealth = mage.health;
            this.playerDefense = mage.defense;
            this.maxResource = mage.maxResource;
            this.playerResource = 11;
            this.playerCharacter = mage;
        }

        // Show the game scene
        this.gameScene.style.display = 'flex';
        
        // Initialize the game
        this.initializeGame();

        // Initialize debug menu with level selector
        this.debugMenu = new DebugMenu(this);
        this.addLevelSelectorToDebugMenu();

        // Create pause menu
        this.createPauseMenu();
        
        // Add pause button event listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.togglePause();
            }
        });
    }

    addLevelSelectorToDebugMenu() {
        if (!this.debugMenu || !this.debugMenu.element) return;

        // Add level selector
        const levelSelectorContainer = document.createElement('div');
        levelSelectorContainer.style.marginTop = '10px';
        levelSelectorContainer.style.padding = '5px';
        levelSelectorContainer.style.backgroundColor = '#333';
        levelSelectorContainer.style.borderRadius = '3px';

        const levelSelectorLabel = document.createElement('div');
        levelSelectorLabel.textContent = 'Select Level:';
        levelSelectorLabel.style.marginBottom = '5px';
        levelSelectorLabel.style.color = '#fff';
        levelSelectorContainer.appendChild(levelSelectorLabel);

        const levelSelector = document.createElement('select');
        levelSelector.style.width = '100%';
        levelSelector.style.padding = '5px';
        levelSelector.style.backgroundColor = '#4CAF50';
        levelSelector.style.color = 'white';
        levelSelector.style.border = 'none';
        levelSelector.style.borderRadius = '3px';
        levelSelector.style.cursor = 'pointer';

        // Add options for each level, including level 6
        for (let i = 1; i <= 7; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Level ${i}`;
            levelSelector.appendChild(option);
        }

        // Add event listener for level selection
        levelSelector.addEventListener('change', (e) => {
            const selectedLevel = parseInt(e.target.value);
            if (selectedLevel !== this.currentLevel) {
                this.currentLevel = selectedLevel;
                this.startNextLevel();
            }
        });

        levelSelectorContainer.appendChild(levelSelector);
        this.debugMenu.element.appendChild(levelSelectorContainer);
    }

    initializeGame() {
        // Initialize player character
        const playerSide = document.querySelector('.player-side');
        if (playerSide) {
            playerSide.innerHTML = '';
            
            // Create level indicator
            const levelIndicator = document.createElement('div');
            levelIndicator.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 24px;
                font-family: Arial, sans-serif;
                z-index: 1000;
                border: 2px solid #666;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            `;
            levelIndicator.textContent = `Level ${this.currentLevel}`;
            document.body.appendChild(levelIndicator);
            
            // Only create player element if not on level 7
            if (this.currentLevel !== 7) {
            // Create player element with the already initialized playerCharacter
            const playerElement = this.playerCharacter.createPlayerElement();
            playerElement.setAttribute('data-class', this.playerClass); // Set the class attribute
            
            // Add shield aura
            const shieldAura = document.createElement('div');
            shieldAura.className = 'shield-aura';
            playerElement.appendChild(shieldAura);
            
            // Create a separate container for stats that won't move with the player
            const statsContainer = document.createElement('div');
            statsContainer.className = 'character-stats';
            statsContainer.style.position = 'absolute'; // Position absolutely
            statsContainer.style.left = '0'; // Align to the left of player side
            statsContainer.style.bottom = '0'; // Align to the bottom
            statsContainer.innerHTML = `
                <div class="health-bar">
                    <div class="health-bar-fill" style="width: 100%"></div>
                </div>
                <div class="defense-bar">
                    <div class="defense-bar-fill" style="width: 0%"></div>
                    <div class="defense-text">Defense: 0</div>
                </div>
                <div class="resource-bar">
                    <div class="resource-bar-fill" style="width: ${(this.playerResource / this.maxResource) * 100}%"></div>
                </div>
                <div class="resource-label">${this.playerClass === 'mage' ? 'Mana' : 'Rage'}: ${this.playerResource}</div>
            `;
            
            // Add stats container to player side instead of player element
            playerSide.appendChild(playerElement);
            playerSide.appendChild(statsContainer);
            
            // Run-in animation for all levels
            if (this.playerClass === 'mage' || this.playerClass === 'warrior') {
                playerElement.style.transition = 'none';
                playerElement.style.transform = 'translateX(-600px)';
                playerElement.style.opacity = '0';
                setTimeout(() => {
                    playerElement.style.transition = 'transform 2s ease-out, opacity 0.1s ease-out';
                    playerElement.style.opacity = '1';
                    this.playerCharacter.playRunAnimation();
                    // Play running sound
                    const runningSound = this.soundManager.sounds.get('running');
                    if (runningSound) {
                        runningSound.currentTime = 1;
                        runningSound.play().catch(() => {});
                    }
                    playerElement.style.transform = 'translateX(0)';
                    setTimeout(() => {
                        this.playerCharacter.stopRunAnimation();
                        if (runningSound) {
                            runningSound.pause();
                            runningSound.currentTime = 0;
                        }
                    }, 2000);
                }, 50);
                }
            }
        }

        // Add fade-in animation styles if they don't exist
        if (!document.getElementById('enemy-fade-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'enemy-fade-styles';
            styleSheet.textContent = `
                .enemy-character {
                    opacity: 0;
                    transition: opacity 1s ease-out;
                }
                .enemy-character.fade-in {
                    opacity: 1;
                }
            `;
            document.head.appendChild(styleSheet);
        }

        // Initialize enemy characters
        const enemySide = document.querySelector('.enemy-side');
        if (enemySide) {
            // Clear all existing enemies from the DOM
            while (enemySide.firstChild) {
                enemySide.removeChild(enemySide.firstChild);
            }
        }

        // Spawn enemies based on level with a staggered delay
        if (this.currentLevel === 1) {
            // Level 1: 1 Executioner
            setTimeout(() => {
                const executioner = new Executioner(1, 100);
                this.enemies.push(executioner);
                const executionerElement = executioner.createEnemyElement();
                enemySide.appendChild(executionerElement);
                requestAnimationFrame(() => {
                    executionerElement.classList.add('fade-in');
                });
            }, 0);
        } else if (this.currentLevel === 2) {
            // Level 2: 2 Executioners
            setTimeout(() => {
                const executioner1 = new Executioner(1, 100);
                this.enemies.push(executioner1);
                const executionerElement1 = executioner1.createEnemyElement();
                enemySide.appendChild(executionerElement1);
                requestAnimationFrame(() => {
                    executionerElement1.classList.add('fade-in');
                });
            }, 0);
            setTimeout(() => {
                const executioner2 = new Executioner(2, 100);
                this.enemies.push(executioner2);
                const executionerElement2 = executioner2.createEnemyElement();
                enemySide.appendChild(executionerElement2);
                requestAnimationFrame(() => {
                    executionerElement2.classList.add('fade-in');
                });
            }, 800);
        } else if (this.currentLevel === 3) {
            // Level 3: 1 Executioner and 2 Skeletons
            setTimeout(() => {
                const executioner = new Executioner(1, 100);
                this.enemies.push(executioner);
                const executionerElement = executioner.createEnemyElement();
                enemySide.appendChild(executionerElement);
                requestAnimationFrame(() => {
                    executionerElement.classList.add('fade-in');
                });
            }, 0);
            setTimeout(() => {
                const skeleton1 = new Skeleton(2, 80);
                this.enemies.push(skeleton1);
                const skeletonElement1 = skeleton1.createEnemyElement();
                enemySide.appendChild(skeletonElement1);
                requestAnimationFrame(() => {
                    skeletonElement1.classList.add('fade-in');
                });
            }, 800);
            setTimeout(() => {
                const skeleton2 = new Skeleton(3, 80);
                this.enemies.push(skeleton2);
                const skeletonElement2 = skeleton2.createEnemyElement();
                enemySide.appendChild(skeletonElement2);
                requestAnimationFrame(() => {
                    skeletonElement2.classList.add('fade-in');
                });
            }, 1600);
        } else if (this.currentLevel >= 4 && this.currentLevel <= 5) {
            // No enemies for level 4 or 5
            if (this.currentLevel === 4) {
                this.addContinueButton();
            } else {
                this.removeContinueButton();
            }
        } else if (this.currentLevel === 6) {
            // Level 6: Show narrator text box and require click before howl and werewolf
            const narratorBox = document.createElement('div');
            narratorBox.className = 'narrator-box';
            narratorBox.style.position = 'fixed';
            narratorBox.style.top = '40px';
            narratorBox.style.left = '50%';
            narratorBox.style.transform = 'translateX(-50%, 0)';
            narratorBox.style.background = 'rgba(0,0,0,0.85)';
            narratorBox.style.color = '#fff';
            narratorBox.style.padding = '32px 48px 20px 48px';
            narratorBox.style.borderRadius = '16px';
            narratorBox.style.fontSize = '1.5em';
            narratorBox.style.fontFamily = 'Cinzel, Times New Roman, serif';
            narratorBox.style.textAlign = 'center';
            narratorBox.style.zIndex = '2000';
            narratorBox.style.boxShadow = '0 0 32px 8px #000a';
            narratorBox.style.cursor = 'pointer';
            // Find the playfield and position narratorBox at the top center of it
            const playfield = document.querySelector('.playfield');
            if (playfield) {
                playfield.style.position = 'relative'; // Ensure playfield is positioned
                narratorBox.style.position = 'absolute';
                narratorBox.style.top = '24px';
                narratorBox.style.left = '50%';
                narratorBox.style.transform = 'translateX(-50%)';
                narratorBox.style.zIndex = '2000';
                playfield.appendChild(narratorBox);
            } else {
                // fallback to fixed top center
                narratorBox.style.position = 'fixed';
                narratorBox.style.top = '40px';
                narratorBox.style.left = '50%';
                narratorBox.style.transform = 'translateX(-50%, 0)';
                narratorBox.style.zIndex = '2000';
                document.body.appendChild(narratorBox);
            }
            // Play level6nar.mp3 and slow the typewriter effect to match its duration
            const narrationAudio = new Audio('./assets/Audio/level6nar.mp3');
            narrationAudio.volume = 1;
            narrationAudio.play().catch(() => {});
            // Typewriter effect for the main message
            const mainMessage = 'You sense a presence lurking in the darkness beyond the trees… silent, unseen, but unmistakably there.';
            const promptHTML = `<br><span style=\"display:block; margin-top:16px; font-size:0.8em; color:#ccc; font-family:Arial,sans-serif;\">Click this box to continue…</span>`;
            narratorBox.innerHTML = '<span class="narrator-typewriter"></span>' + promptHTML;
            const typewriterSpan = narratorBox.querySelector('.narrator-typewriter');
            let i = 0;
            let typewriterStarted = false;
            function startTypewriter(interval) {
                typewriterStarted = true;
                function typeWriter() {
                    if (i <= mainMessage.length) {
                        typewriterSpan.textContent = mainMessage.slice(0, i);
                        i++;
                        setTimeout(typeWriter, interval);
                    }
                }
                typeWriter();
            }
            narrationAudio.addEventListener('loadedmetadata', () => {
                const duration = narrationAudio.duration * 1000; // ms
                const interval = Math.max(18, Math.floor(duration / mainMessage.length));
                startTypewriter(interval);
            });
            // Fallback: if metadata doesn't load, use a default slower speed
            setTimeout(() => {
                if (!typewriterStarted) {
                    startTypewriter(60);
                }
            }, 500);
            // Restore click event to continue
            narratorBox.addEventListener('click', () => {
                narrationAudio.pause();
                narratorBox.remove();
                console.log('[Level 6] Playing howl.mp3');
                const howl = new Audio('./assets/Audio/howl.mp3');
                howl.volume = 1;
                howl.play().then(() => {
                    console.log('[Level 6] howl.mp3 played!');
                    // Spawn a werewolf 1 second after the howl starts
                    setTimeout(() => {
                        const enemySide = document.querySelector('.enemy-side');
                        if (!enemySide) {
                            console.error('[Level 6] .enemy-side not found!');
                            return;
                        }
                        const werewolf = new Werewolf(1, 120, true);
                        this.enemies.unshift(werewolf);
                        const werewolfElement = werewolf.createEnemyElement();
                        if (enemySide.firstChild) {
                            enemySide.insertBefore(werewolfElement, enemySide.firstChild);
                        } else {
                            enemySide.appendChild(werewolfElement);
                        }
                        console.log('[Level 6] Werewolf element added to DOM');
                        requestAnimationFrame(() => {
                            werewolf.playEntranceAnimation();
                            console.log('[Level 6] Werewolf entrance animation started');
                        });
                    }, 1000);
                }).catch((e) => {
                    console.error('[Level 6] howl.mp3 play error:', e);
                });
            });
        } else if (this.currentLevel === 7) {
            // Level 7: No enemies yet
            console.log('Level 7 initialized - no enemies');
            
            // Create player element first but keep it hidden
            const playerSide = document.querySelector('.player-side');
            if (playerSide) {
                playerSide.innerHTML = '';
                
                // Create player element with the already initialized playerCharacter
                const playerElement = this.playerCharacter.createPlayerElement();
                playerElement.setAttribute('data-class', this.playerClass);
                playerElement.style.opacity = '0';  // Start hidden
                playerElement.style.transform = 'translateX(-600px)';  // Start off-screen
                playerElement.style.visibility = 'hidden';  // Ensure it's completely hidden
                playerElement.style.transition = 'none';  // No transition initially
                
                // Add shield aura
                const shieldAura = document.createElement('div');
                shieldAura.className = 'shield-aura';
                playerElement.appendChild(shieldAura);
                
                // Create stats container
                const statsContainer = document.createElement('div');
                statsContainer.className = 'character-stats';
                statsContainer.style.position = 'absolute';
                statsContainer.style.left = '0';
                statsContainer.style.bottom = '0';
                statsContainer.innerHTML = `
                    <div class="health-bar">
                        <div class="health-bar-fill" style="width: 100%"></div>
                    </div>
                    <div class="defense-bar">
                        <div class="defense-bar-fill" style="width: 0%"></div>
                        <div class="defense-text">Defense: 0</div>
                    </div>
                    <div class="resource-bar">
                        <div class="resource-bar-fill" style="width: ${(this.playerResource / this.maxResource) * 100}%"></div>
                    </div>
                    <div class="resource-label">${this.playerClass === 'mage' ? 'Mana' : 'Rage'}: ${this.playerResource}</div>
                `;
                
                // Add elements to player side
                playerSide.appendChild(playerElement);
                playerSide.appendChild(statsContainer);
            }
            
            // Create enemy-side element if it doesn't exist
            let enemySide = document.querySelector('.enemy-side');
            if (!enemySide) {
                enemySide = document.createElement('div');
                enemySide.className = 'enemy-side';
                enemySide.style.position = 'absolute';
                enemySide.style.left = '0';
                enemySide.style.top = '0';
                enemySide.style.width = '100%';
                enemySide.style.height = '100%';
                enemySide.style.pointerEvents = 'none';
                enemySide.style.zIndex = '1000';
                
                // Add to game scene instead of document body
                const gameScene = document.querySelector('.game-scene');
                if (gameScene) {
                    gameScene.appendChild(enemySide);
                    console.log('Added enemy-side to game scene');
                } else {
                    console.error('Game scene not found!');
                    return;
                }
            }
            
            // Create a werewolf that runs across the screen
            console.log('Creating werewolf...');
            const werewolf = new Werewolf(1, 120);
            console.log('Werewolf created:', werewolf);
            
            const werewolfElement = werewolf.createEnemyElement();
            console.log('Werewolf element created:', werewolfElement);
            
            // Set up werewolf element styles
            werewolfElement.style.position = 'absolute';
            werewolfElement.style.transition = 'transform 4s linear';
            werewolfElement.style.zIndex = '1001'; // Higher than enemy-side
            werewolfElement.style.top = '50%';
            werewolfElement.style.left = '0';
            werewolfElement.style.transform = 'translate(-600px, -50%)';
            werewolfElement.style.opacity = '1';
            
            // Ensure the sprite container is facing right
            const spriteContainer = werewolfElement.querySelector('.enemy-sprite');
            if (spriteContainer) {
                spriteContainer.style.transform = 'scaleX(1)';
                spriteContainer.style.transformOrigin = 'center center';
                // Keep width at 280px to prevent next frame from showing
                spriteContainer.style.width = '280px';
                // Increase height to prevent bottom from being cut off
                spriteContainer.style.height = '300px';
                spriteContainer.style.overflow = 'hidden';
                // Set background size to match the container size
                spriteContainer.style.backgroundSize = '280px 300px';
            }
            
            // Add werewolf to enemy side
            console.log('Appending werewolf to enemy side...');
            enemySide.appendChild(werewolfElement);
            console.log('Werewolf appended to enemy side');
            
            // Start the run animation and movement
            setTimeout(() => {
                console.log('Starting werewolf run animation...');
                werewolf.playRunAnimation();
                werewolfElement.style.transform = 'translate(1200px, -50%)';
                
                // Stop animation and remove element after crossing
                setTimeout(() => {
                    console.log('Stopping werewolf animation...');
                    werewolf.stopRunAnimation();
                    werewolfElement.remove();
                }, 4000);
            }, 1000);

            // Wait 4 seconds from level start before showing player
            setTimeout(() => {
                const playerElement = document.querySelector('.player-character');
                if (playerElement) {
                    // Start with player off-screen and invisible
                    playerElement.style.visibility = 'hidden';
                    playerElement.style.opacity = '0';
                    playerElement.style.transform = 'translateX(-600px)';
                    playerElement.style.transition = 'none';
                    
                    // Start running animation while still invisible
                    this.playerCharacter.playRunAnimation();
                    
                    // Play running sound
                    const runningSound = this.soundManager.sounds.get('running');
                    if (runningSound) {
                        runningSound.currentTime = 1;
                        runningSound.play().catch(() => {});
                    }
                    
                    // Make player visible and start movement
                    requestAnimationFrame(() => {
                        playerElement.style.visibility = 'visible';
                        playerElement.style.transition = 'transform 2s ease-out, opacity 0.1s ease-out';
                        playerElement.style.opacity = '1';
                        playerElement.style.transform = 'translateX(0)';
                    });
                    
                    // Stop running animation after movement completes
                    setTimeout(() => {
                        this.playerCharacter.stopRunAnimation();
                        if (runningSound) {
                            runningSound.pause();
                            runningSound.currentTime = 0;
                        }
                    }, 2000);
                }
            }, 4000);

            // Spawn 3 werewolves after 6 seconds
            setTimeout(() => {
                const enemySide = document.querySelector('.enemy-side');
                if (enemySide) {
                    // Spawn 3 werewolves with staggered timing
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            const werewolf = new Werewolf(i + 1, 120);
                            this.enemies.push(werewolf);
                            const werewolfElement = werewolf.createEnemyElement();
                            
                            // Position each werewolf at different horizontal positions
                            werewolfElement.style.position = 'absolute';
                            werewolfElement.style.left = `${20 + (i * 30)}%`;
                            werewolfElement.style.top = '20%';
                            werewolfElement.style.transform = 'translate(1200px, -50%)'; // Start off-screen to the right
                            werewolfElement.style.transition = 'transform 0.8s ease-out'; // Add transition for smooth movement
                            werewolfElement.style.zIndex = '1000';
                            werewolfElement.style.pointerEvents = 'auto';
                            
                            // Ensure the sprite container maintains its position and direction
                            const spriteContainer = werewolfElement.querySelector('.enemy-sprite');
                            if (spriteContainer) {
                                spriteContainer.style.position = 'absolute';
                                spriteContainer.style.transform = 'scaleX(-1)'; // Face left
                                spriteContainer.style.transformOrigin = 'center center';
                                spriteContainer.style.width = '280px';
                                spriteContainer.style.height = '300px';
                                spriteContainer.style.overflow = 'hidden';
                                spriteContainer.style.backgroundSize = '280px 300px';
                                spriteContainer.style.left = '0';
                                spriteContainer.style.top = '0';
                            }
                            
                            enemySide.appendChild(werewolfElement);
                            
                            // Start the entrance animation after a small delay
                            requestAnimationFrame(() => {
                                werewolf.playEntranceAnimation();
                                // Move to final position
                                werewolfElement.style.transform = `translate(-50%, -50%)`;
                            });
                        }, i * 800); // Stagger each werewolf by 800ms
                    }
                }
            }, 6000);
        } else {
            // For other levels, spawn enemies based on level number
            // (No longer used for levels 1-3)
            const enemyCount = this.currentLevel === 2 ? 2 : 3; // 2 enemies for level 2, 3 for level 3
            for (let i = 0; i < enemyCount; i++) {
                setTimeout(() => {
                    const enemy = new Executioner(i + 1, 100);
                    this.enemies.push(enemy);
                    const enemyElement = enemy.createEnemyElement();
                    enemySide.appendChild(enemyElement);
                    requestAnimationFrame(() => {
                        enemyElement.classList.add('fade-in');
                    });
                }, i * 800);
            }
        }

        // Initialize player's hand
        this.updatePlayerHand(true);
        this.updatePileCounts();

        // Initialize end turn button
        const endTurnBtn = document.querySelector('.end-turn-btn');
        if (endTurnBtn) {
            endTurnBtn.addEventListener('click', () => this.endTurn());
        }

        // Create targeting arrow
        this.createTargetingArrow();

        // Set playfield background based on level
        const playfield = document.querySelector('.playfield');
        if (playfield) {
            if (this.currentLevel === 1) {
                playfield.style.backgroundImage = "url('./assets/Images/gy.png')";
            } else if (this.currentLevel === 2) {
                playfield.style.backgroundImage = "url('./assets/Images/graveyard2.png')";
            } else if (this.currentLevel === 3) {
                playfield.style.backgroundImage = "url('./assets/Images/graveyard3.png')";
            } else if (this.currentLevel === 4) {
                playfield.style.backgroundImage = "url('./assets/Images/forest.png')";
            } else if (this.currentLevel === 5) {
                playfield.style.backgroundImage = "url('./assets/Images/forest2.png')";
            } else if (this.currentLevel === 6) {
                playfield.style.backgroundImage = "url('./assets/Images/forest3.png')";
            } else if (this.currentLevel === 7) {
                playfield.style.backgroundImage = "url('./assets/Images/forest5.png')";
            } else {
                playfield.style.backgroundImage = "";
            }
        }

        // Add continue button for level 4
        if (this.currentLevel === 4) {
            this.addContinueButton();
        } else {
            this.removeContinueButton();
        }
    }

    createTargetingArrow() {
        console.log('Creating targeting arrow'); // Debug log
        if (this.targetingArrow) {
            this.targetingArrow.remove(); // Remove existing arrow if any
        }
        
        this.targetingArrow = document.createElement('div');
        this.targetingArrow.className = 'targeting-arrow';
        this.targetingArrow.style.display = 'none';
        document.querySelector('.game-scene').appendChild(this.targetingArrow);
    }

    startTargeting(cardId) {
        if (this.isTargeting) return;
        
        this.isTargeting = true;
        this.currentCard = cardId;
        
        // Create and show targeting arrow
        if (!this.targetingArrow) {
            this.targetingArrow = document.createElement('div');
            this.targetingArrow.className = 'targeting-arrow';
            this.targetingArrow.style.position = 'absolute';
            this.targetingArrow.style.height = '2px';
            this.targetingArrow.style.backgroundColor = '#ff0000';
            this.targetingArrow.style.transformOrigin = 'left center';
            this.targetingArrow.style.pointerEvents = 'none';
            this.targetingArrow.style.zIndex = '1000';
            document.body.appendChild(this.targetingArrow);
            this.trackElement(this.targetingArrow);
        }
        this.targetingArrow.style.display = 'block';
        
        // Add event listeners for targeting
        this.addEventListener(document, 'mousemove', this.updateArrowPosition);
        this.addEventListener(document, 'click', this.handleTargetSelection);
        this.addEventListener(document, 'click', this.handleOutsideClick);
        
        // Add visual feedback for targetable enemies
        this.enemies.forEach(enemy => {
            if (enemy.health > 0) {
                enemy.element.classList.add('targetable');
            }
        });
    }

    updateArrowPosition = (e) => {
        if (!this.isTargeting || !this.sourceCard) return;

        const cardRect = this.sourceCard.getBoundingClientRect();
        const startX = cardRect.left + cardRect.width / 2;
        const startY = cardRect.top + cardRect.height / 2;

        const angle = Math.atan2(e.clientY - startY, e.clientX - startX);
        
        // Calculate the distance to the mouse position
        const distance = Math.hypot(e.clientX - startX, e.clientY - startY);
        
        // Set a much larger maximum length to ensure it can reach any enemy
        const maxLength = Math.max(window.innerWidth, window.innerHeight) * 1.5;
        const length = Math.min(distance, maxLength);

        this.targetingArrow.style.transform = `translate(${startX}px, ${startY}px) rotate(${angle}rad)`;
        this.targetingArrow.style.width = `${length}px`;

        // Calculate the end point of the arrow
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;

        // Find the enemy whose hitbox center is closest to the arrow end point horizontally
        let closestEnemy = null;
        let minDistance = Infinity;
        const MAX_TARGET_DISTANCE = 100; // Maximum horizontal distance to consider for targeting

        this.enemies.forEach(enemy => {
            if (enemy.element) {
                const spriteElement = enemy.element.querySelector('.enemy-sprite');
                if (spriteElement) {
                    const rect = spriteElement.getBoundingClientRect();
                    // Calculate hitbox dimensions (40% of sprite size)
                    const hitboxWidth = rect.width * 0.4;
                    const hitboxHeight = rect.height * 0.4;
                    
                    // Calculate hitbox center (only horizontal position matters)
                    const hitboxCenterX = rect.left + (rect.width - hitboxWidth) / 2 + hitboxWidth / 2;
                    
                    // Calculate horizontal distance from arrow end to hitbox center
                    const distance = Math.abs(endX - hitboxCenterX);
                    
                    // Only consider enemies within the maximum targeting distance
                    if (distance < MAX_TARGET_DISTANCE && distance < minDistance) {
                        minDistance = distance;
                        closestEnemy = enemy;
                    }
                }
            }
        });

        // Update targetable state for all enemies
        this.enemies.forEach(enemy => {
            if (enemy.element) {
                if (enemy === closestEnemy) {
                    enemy.element.classList.add('targetable');
                } else {
                    enemy.element.classList.remove('targetable');
                }
            }
        });
    }

    handleTargetSelection = (e) => {
        console.log('Target selection clicked');
        if (!this.isTargeting) return;

        const cardRect = this.sourceCard.getBoundingClientRect();
        const startX = cardRect.left + cardRect.width / 2;
        const startY = cardRect.top + cardRect.height / 2;

        const angle = Math.atan2(e.clientY - startY, e.clientX - startX);
        const distance = Math.hypot(e.clientX - startX, e.clientY - startY);
        const maxLength = Math.max(window.innerWidth, window.innerHeight) * 1.5;
        const length = Math.min(distance, maxLength);

        // Calculate the end point of the arrow
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;

        // Find the enemy whose hitbox center is closest to the arrow end point horizontally
        let closestEnemy = null;
        let minDistance = Infinity;
        const MAX_TARGET_DISTANCE = 100; // Maximum horizontal distance to consider for targeting

        this.enemies.forEach(enemy => {
            if (enemy.element) {
                const spriteElement = enemy.element.querySelector('.enemy-sprite');
                if (spriteElement) {
                    const rect = spriteElement.getBoundingClientRect();
                    // Calculate hitbox dimensions (40% of sprite size)
                    const hitboxWidth = rect.width * 0.4;
                    const hitboxHeight = rect.height * 0.4;
                    
                    // Calculate hitbox center (only horizontal position matters)
                    const hitboxCenterX = rect.left + (rect.width - hitboxWidth) / 2 + hitboxWidth / 2;
                    
                    // Calculate horizontal distance from arrow end to hitbox center
                    const distance = Math.abs(endX - hitboxCenterX);
                    
                    // Only consider enemies within the maximum targeting distance
                    if (distance < MAX_TARGET_DISTANCE && distance < minDistance) {
                        minDistance = distance;
                        closestEnemy = enemy;
                    }
                }
            }
        });

        if (closestEnemy) {
            console.log('Closest enemy found:', closestEnemy);
            
            // Check if player has enough resources for this card
            const cardData = this.cardManager.getCard(this.currentCard);
            if (!cardData) {
                this.stopTargeting();
                return;
            }

            // Check if we have enough resources including what's already reserved
            if (this.playerResource - this.reservedResource < cardData.cost) {
                this.showResourceNotification(cardData.cost);
                this.stopTargeting();
                return;
            }

            // Add to attack queue instead of playing immediately
            this.attackQueue.push({
                cardId: this.currentCard,
                targetEnemy: closestEnemy,
                cost: cardData.cost
            });
            
            // Reserve the resources
            this.reservedResource += cardData.cost;
            
            // Update the card's appearance to show it's queued
            const cardElement = document.querySelector(`.card[data-card-id="${this.currentCard}"]`);
            if (cardElement) {
                cardElement.classList.add('queued');
                // Add a small indicator showing the target
                const targetIndicator = document.createElement('div');
                targetIndicator.className = 'target-indicator';
                targetIndicator.textContent = `→ ${closestEnemy.id}`;
                cardElement.appendChild(targetIndicator);
            }

            // Update the resource display to show reserved resources
            this.updateResourceBar();
        }

        this.stopTargeting();
    }

    handleOutsideClick = (e) => {
        if (!this.isTargeting) return;
        
        const cardRect = this.sourceCard.getBoundingClientRect();
        const startX = cardRect.left + cardRect.width / 2;
        const startY = cardRect.top + cardRect.height / 2;

        const angle = Math.atan2(e.clientY - startY, e.clientX - startX);
        const distance = Math.hypot(e.clientX - startX, e.clientY - startY);
        const maxLength = Math.max(window.innerWidth, window.innerHeight) * 1.5;
        const length = Math.min(distance, maxLength);

        // Calculate the end point of the arrow
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;

        // Check if the arrow end point is far from all enemy hitboxes horizontally
        const MAX_TARGET_DISTANCE = 100; // Maximum horizontal distance to consider for targeting
        const isFarFromAllEnemies = this.enemies.every(enemy => {
            if (enemy.element) {
                const spriteElement = enemy.element.querySelector('.enemy-sprite');
                if (spriteElement) {
                    const rect = spriteElement.getBoundingClientRect();
                    // Calculate hitbox dimensions (40% of sprite size)
                    const hitboxWidth = rect.width * 0.4;
                    const hitboxHeight = rect.height * 0.4;
                    
                    // Calculate hitbox center (only horizontal position matters)
                    const hitboxCenterX = rect.left + (rect.width - hitboxWidth) / 2 + hitboxWidth / 2;
                    
                    // Calculate horizontal distance from arrow end to hitbox center
                    const distance = Math.abs(endX - hitboxCenterX);
                    
                    // Consider it far if distance is greater than the maximum targeting distance
                    return distance > MAX_TARGET_DISTANCE;
                }
            }
            return true;
        });
        
        if (isFarFromAllEnemies) {
            this.stopTargeting();
        }
    }

    stopTargeting() {
        console.log('Stopping targeting'); // Debug log
        this.isTargeting = false;
        this.currentCard = null;
        this.sourceCard = null;
        if (this.targetingArrow) {
            this.targetingArrow.style.display = 'none';
        }
        // Remove targetable class from all enemies
        this.enemies.forEach(enemy => {
            if (enemy.element) {
                enemy.element.classList.remove('targetable');
            }
        });
        document.removeEventListener('mousemove', this.updateArrowPosition);
        document.removeEventListener('click', this.handleTargetSelection);
        document.removeEventListener('click', this.handleOutsideClick);
    }

    updatePlayerHand(isInitialDeal = false, previousHandSize = 0) {
        const playerHand = document.querySelector('.player-hand');
        if (!playerHand) return;

        // Clear current hand
        playerHand.innerHTML = '';

        // Add cards from player's hand
        this.playerDeck.hand.forEach((cardId, index) => {
            const cardData = this.cardManager.getCard(cardId);
            if (cardData) {
                const cardElement = this.cardManager.createCardElement(cardData);
                cardElement.dataset.cardId = cardId;
                
                // Only add dealing class to new cards (those beyond the previous hand size)
                if (isInitialDeal && index >= previousHandSize) {
                    cardElement.classList.add('dealing');
                    // Remove dealing class after animation completes
                    setTimeout(() => {
                        cardElement.classList.remove('dealing');
                        cardElement.style.visibility = 'visible';
                        cardElement.style.opacity = '1';
                    }, 600); // Match the animation duration from CSS
                } else {
                    // For existing cards, make them visible immediately
                    cardElement.style.visibility = 'visible';
                    cardElement.style.opacity = '1';
                }
                
                // Check if this card is in the attack queue
                const queuedAttack = this.attackQueue.find(attack => attack.cardId === cardId);
                if (queuedAttack) {
                    cardElement.classList.add('queued');
                    const targetIndicator = document.createElement('div');
                    targetIndicator.className = 'target-indicator';
                    targetIndicator.textContent = `→ ${queuedAttack.targetEnemy.id}`;
                    cardElement.appendChild(targetIndicator);

                    // Add click handler to remove from queue
                    cardElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.removeFromQueue(cardId);
                    });
                } else {
                    // Add click handler for non-queued cards
                    cardElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        console.log('Card clicked:', cardData);
                        
                        // Play click sound
                        const clickSound = new Audio('./assets/Audio/click.mp3');
                        clickSound.volume = 0.5;
                        clickSound.play().catch(error => console.log('Error playing click sound:', error));
                        
                        if (cardData.type === 'Attack' || cardData.type === 'Magic') {
                            console.log('Starting targeting for attack/magic card');
                            this.sourceCard = cardElement; // Set the source card
                            this.startTargeting(cardId);
                        } else {
                            console.log('Playing non-targeting card');
                            this.playCard(cardId, this.enemies[0]);
                        }
                    });
                }
                
                playerHand.appendChild(cardElement);
            }
        });
    }

    updatePileCounts() {
        const drawPileCount = document.querySelector('.draw-pile .pile-count');
        const discardPileCount = document.querySelector('.discard-pile .pile-count');

        if (drawPileCount) {
            drawPileCount.textContent = this.playerDeck.drawPile.length;
        }
        if (discardPileCount) {
            discardPileCount.textContent = this.playerDeck.discardPile.length;
        }
    }

    playCard(cardId, targetEnemy) {
        if (!this.isPlayerTurn) return;

        // Find the card in the player's hand
        const cardIndex = this.playerDeck.hand.findIndex(card => card === cardId);
        if (cardIndex === -1) return;

        // Get the card data
        const cardData = this.cardManager.getCard(cardId);
        if (!cardData) return;

        // Check if player has enough resources
        if (this.playerResource < cardData.cost) {
            this.showResourceNotification(cardData.cost);
            return;
        }

        // Remove card from hand and add to discard pile
        const playedCard = this.playerDeck.hand.splice(cardIndex, 1)[0];
        this.playerDeck.discardPile.push(playedCard);

        // Deduct resource cost (ensure it doesn't go below 0)
        this.playerResource = Math.max(0, this.playerResource - cardData.cost);

        // Apply card effects
        this.applyCardEffects(cardData, targetEnemy);

        // Update the display
        this.updatePlayerHand();
        this.updatePileCounts();
        this.updateHealthBars();
        this.updateResourceBar();
    }

    showResourceNotification(requiredCost) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'resource-notification';
        
        // Set the resource icon based on player class
        const resourceIcon = this.playerClass === 'mage' ? '🔮' : '⚔️';
        const resourceName = this.playerClass === 'mage' ? 'Mana' : 'Rage';
        
        notification.innerHTML = `
            <div class="resource-icon">${resourceIcon}</div>
            <h3>Not Enough ${resourceName}!</h3>
            <p>You need ${requiredCost} ${resourceName.toLowerCase()} to play this card.</p>
            <button class="close-notification">OK</button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification with animation
        notification.style.display = 'block';
        
        // Add click handler for close button
        const closeButton = notification.querySelector('.close-notification');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    applyCardEffects(cardData, targetEnemy) {
        if (!targetEnemy) return;

        const enemy = this.enemies.find(e => e.id === targetEnemy.id);
        if (!enemy) return;

        if (cardData.type === 'Attack' || cardData.type === 'Magic') {
            // Play sound effects before animation
            if (cardData.id === 'molten_strike') {
                const moltenSound = new Audio('./assets/Audio/molten.mp3');
                moltenSound.volume = this.sfxVolume;
                moltenSound.play().catch(error => console.log('Error playing molten strike sound:', error));
            }
            else if (cardData.id === 'blaze_bolt') {
                const blazeBoltSound = new Audio('./assets/Audio/molten.mp3');
                blazeBoltSound.volume = this.sfxVolume;
                blazeBoltSound.play().catch(error => console.log('Error playing blaze bolt sound:', error));
            }

            // Play attack animation
            if (this.playerCharacter) {
                this.playerCharacter.playAttackAnimation();
                
                // Play molten strike sound if it's a molten strike card
                if (cardData.id === 'molten_strike') {
                    const moltenSound = new Audio('./assets/Audio/molten.mp3');
                    moltenSound.volume = this.sfxVolume;
                    moltenSound.play().catch(error => console.log('Error playing molten strike sound:', error));
                }
            }

            // Wait for attack animation to complete before applying damage
            setTimeout(() => {
                const isDead = enemy.takeDamage(cardData.attack);
                // Play skeledead.mp3 if a Skeleton dies
                if (isDead && enemy.constructor.name === 'Skeleton') {
                    console.log('Playing skeledead.mp3');
                    this.soundManager.playSound('skeledead');
                }
                if (isDead) {
                    enemy.destroy();
                    this.enemies = this.enemies.filter(e => e.id !== enemy.id);
                    this.checkLevelCompletion();
                }
                
                // Additional effects for Magic cards
                if (cardData.type === 'Magic') {
                    // Add any additional magic effects here
                    // For example, healing the player or adding defense
                    if (cardData.defense) {
                        this.playerDefense = Math.min(100, this.playerDefense + cardData.defense);
                        this.updateDefenseBar();
                    }
                }
            }, 800); // Wait for attack animation to complete
        } else if (cardData.type === 'Defense') {
            // Handle defense cards
            this.playerDefense = Math.min(100, this.playerDefense + cardData.defense);
            this.updateDefenseBar();
        }
        // Add other card effect types here as needed
    }

    updateHealthBars() {
        const playerHealthBar = document.querySelector('.health-bar-fill');
        if (playerHealthBar) {
            playerHealthBar.style.width = `${this.playerHealth}%`;
        }

        this.enemies.forEach(enemy => {
            const enemyHealthBar = enemy.element.querySelector('.health-bar-fill');
            if (enemyHealthBar) {
                enemyHealthBar.style.width = `${enemy.health}%`;
            }
        });
    }

    updateDefenseBar() {
        const defenseBar = document.querySelector('.defense-bar-fill');
        const shieldAura = document.querySelector('.shield-aura');
        if (defenseBar) {
            // Convert defense value to percentage (assuming max defense is 100)
            const defensePercentage = (this.playerDefense / 100) * 100;
            defenseBar.style.width = `${defensePercentage}%`;
            
            // Update the defense text if it exists
            const defenseText = document.querySelector('.defense-text');
            if (defenseText) {
                defenseText.textContent = `Defense: ${this.playerDefense}`;
            }

            // Update shield aura
            if (shieldAura) {
                if (this.playerDefense > 0) {
                    shieldAura.classList.add('active');
                } else {
                    shieldAura.classList.remove('active');
                }
            }
        }
    }

    drawCard() {
        if (this.playerDeck.drawPile.length === 0) {
            // If draw pile is empty, shuffle discard pile into draw pile
            this.playerDeck.drawPile = [...this.playerDeck.discardPile];
            this.playerDeck.discardPile = [];
            this.shuffleDeck();
        }

        if (this.playerDeck.drawPile.length > 0) {
            const card = this.playerDeck.drawPile.pop();
            this.playerDeck.hand.push(card);
            this.updatePlayerHand(false); // Not an initial deal
            this.updatePileCounts();
            return card;
        }
        return null;
    }

    shuffleDeck() {
        this.playerDeck.drawPile.sort(() => 0.5 - Math.random());
    }

    updateResourceBar() {
        const resourceBar = document.querySelector('.resource-bar-fill');
        const resourceLabel = document.querySelector('.resource-label');
        
        if (resourceBar) {
            // Show available resources (total minus reserved)
            const availableResource = this.playerResource - this.reservedResource;
            resourceBar.style.width = `${(availableResource / this.maxResource) * 100}%`;
        }
        if (resourceLabel) {
            const resourceName = this.playerClass === 'mage' ? 'Mana' : 'Rage';
            resourceLabel.textContent = `${resourceName}: ${this.playerResource - this.reservedResource} (${this.reservedResource} reserved)`;
        }
    }

    endTurn() {
        if (!this.isPlayerTurn) return;

        this.isPlayerTurn = false;
        const endTurnBtn = document.querySelector('.end-turn-btn');
        if (endTurnBtn) {
            endTurnBtn.disabled = true;
        }

        // Execute queued attacks
        this.executeQueuedAttacks().then(() => {
            // Enemy's turn
            setTimeout(() => {
                this.enemyTurn();
            }, 1000);
        });
    }

    createFireballEffect(sourceElement, targetElement) {
        // Get source and target positions
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        
        // Calculate start position (center of player)
        const startX = sourceRect.left + sourceRect.width / 2;
        const startY = sourceRect.top + sourceRect.height / 2;
        
        // Get the enemy's sprite container
        const spriteElement = targetElement.querySelector('.enemy-sprite');
        const spriteRect = spriteElement ? spriteElement.getBoundingClientRect() : targetRect;
        
        // Calculate end position (center of enemy sprite)
        let endX = spriteRect.left + spriteRect.width / 2;
        let endY = spriteRect.top + spriteRect.height / 2;

        // Apply enemy-specific hitbox offsets
        if (targetElement.dataset.enemyId) {
            if (targetElement.dataset.enemyId === "1" || targetElement.dataset.enemyId === "2") {
                // Executioner hitbox offset
                endX += 50 - 15; // Move 50px to the right (because of sprite flip), then 15px left for hitbox center
                endY += 20; // Move 20px up to match the hitbox position
            } else if (targetElement.classList.contains('enemy-character') && (targetElement.dataset.enemyId === "3" || targetElement.dataset.enemyId === "4")) {
                // Skeleton hitbox offset (IDs 3 and 4)
                // No X offset, but move 40px down for hitbox center
                endY += 40;
            } else {
                // Werewolf hitbox offset
                endX += 50; // Move 50px to the right (because of sprite flip)
                endY += 80; // Move 80px down
            }
        }

        // Create WebGL fireball effect
        this.effectRenderer.createFireballEffect(startX, startY, endX, endY);
    }

    async executeQueuedAttacks() {
        for (const attack of this.attackQueue) {
            const cardData = this.cardManager.getCard(attack.cardId);
            if (!cardData) continue;

            // Remove card from hand and add to discard pile
            const cardIndex = this.playerDeck.hand.findIndex(card => card === attack.cardId);
            if (cardIndex !== -1) {
                const playedCard = this.playerDeck.hand.splice(cardIndex, 1)[0];
                this.playerDeck.discardPile.push(playedCard);
            }

            // Deduct the reserved resource cost
            this.playerResource = Math.max(0, this.playerResource - attack.cost);
            this.reservedResource -= attack.cost;

            // Check if there are any enemies left
            if (this.enemies.length === 0) {
                // No enemies left, end the attack phase
                break;
            }

            // For single-target spells, check if the target is still alive
            if (attack.cardId !== 'heat_wave' && attack.cardId !== 'pyroclasm' && 
                attack.cardId !== 'meteor_strike' && attack.cardId !== 'inferno') {
                const targetEnemy = this.enemies.find(e => e.id === attack.targetEnemy.id);
                if (!targetEnemy) {
                    // Target is dead, find a new target
                    const newTarget = this.enemies[0]; // Use the first remaining enemy
                    if (!newTarget) {
                        // No enemies left, end the attack phase
                        break;
                    }
                    attack.targetEnemy = newTarget;
                }
            }

            // Play attack animation
            if (this.playerCharacter) {
                this.playerCharacter.playAttackAnimation();
                
                // Play molten strike sound if it's a molten strike card
                if (attack.cardId === 'molten_strike') {
                    const moltenSound = new Audio('./assets/Audio/molten.mp3');
                    moltenSound.volume = this.sfxVolume;
                    moltenSound.play().catch(error => console.log('Error playing molten strike sound:', error));
                }
            }

            // Wait for attack animation to complete
            await new Promise(resolve => setTimeout(resolve, 800));

            const enemyElement = attack.targetEnemy.element;
            if (enemyElement) {
                if (attack.cardId === 'fireball') {
                    const playerElement = document.querySelector('.player-character');
                    if (playerElement) {
                        // Play fireball sound effect with sfxVolume
                        const fireballSound = new Audio('./assets/Audio/fire1.mp3');
                        fireballSound.volume = this.sfxVolume;
                        fireballSound.play().catch(error => console.log('Error playing fireball sound:', error));
                        
                        this.createFireballEffect(playerElement, enemyElement);
                        
                        // Wait for fireball to reach enemy, then play explosion
                        setTimeout(() => {
                            const explosionSound = new Audio('./assets/Audio/explosion.mp3');
                            explosionSound.volume = this.sfxVolume;
                            explosionSound.play().catch(error => console.log('Error playing explosion sound:', error));
                        }, 400); // Slightly before the fireball animation completes
                        
                        // Wait for fireball animation to complete
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                } else if (attack.cardId === 'inferno') {
                    // Play inferno sound effect
                    const infernoSound = new Audio('./assets/Audio/inferno.mp3');
                    infernoSound.volume = this.sfxVolume;
                    
                    // Create inferno effect for all enemies simultaneously
                    const infernoCleanups = [];
                    this.enemies.forEach(enemy => {
                        const spriteElement = enemy.element.querySelector('.enemy-sprite');
                        const spriteRect = spriteElement ? spriteElement.getBoundingClientRect() : enemy.element.getBoundingClientRect();
                        
                        // Calculate target position (center of enemy sprite)
                        const centerX = spriteRect.left + spriteRect.width / 2;
                        const centerY = spriteRect.top + spriteRect.height / 2;
                        
                        const width = spriteRect.width * 1.5; // Make the pillar wider than the enemy
                        const height = spriteRect.height * 2; // Make the pillar taller than the enemy
                        
                        // Create inferno effect for this enemy and store its cleanup function
                        const cleanup = this.effectRenderer.createInfernoEffect(centerX, centerY, width, height);
                        infernoCleanups.push(cleanup);
                    });

                    // Play the sound
                    infernoSound.play().catch(error => console.log('Error playing inferno sound:', error));
                    
                    // Start fade out 500ms before the effect ends
                    setTimeout(() => {
                        const fadeOutInterval = setInterval(() => {
                            if (infernoSound.volume > 0.05) {
                                infernoSound.volume -= 0.05;
                            } else {
                                infernoSound.pause();
                                clearInterval(fadeOutInterval);
                            }
                        }, 50);
                    }, 700);
                    
                    // Wait for the visual effect to complete
                    await new Promise(resolve => setTimeout(resolve, 900));
                    
                    // Clean up all inferno effects
                    infernoCleanups.forEach(cleanup => {
                        if (typeof cleanup === 'function') {
                            cleanup();
                        }
                    });
                } else if (attack.cardId === 'meteor_strike') {
                    // Calculate the center position of all enemies
                    let totalX = 0;
                    let totalY = 0;
                    this.enemies.forEach(enemy => {
                        const spriteElement = enemy.element.querySelector('.enemy-sprite');
                        const spriteRect = spriteElement ? spriteElement.getBoundingClientRect() : enemy.element.getBoundingClientRect();
                        
                        totalX += spriteRect.left + spriteRect.width / 2;
                        totalY += spriteRect.top + spriteRect.height / 2;
                    });
                    const centerX = totalX / this.enemies.length;
                    const centerY = totalY / this.enemies.length;
                    
                    // Create meteor effect with sound callback
                    this.effectRenderer.createMeteorEffect(centerX, centerY, () => {
                        const meteorSound = new Audio('./assets/Audio/fire2.mp3');
                        meteorSound.volume = this.sfxVolume;
                        meteorSound.play().catch(error => console.log('Error playing meteor sound:', error));
                    });
                    // Wait for meteor animation to complete
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else if (attack.cardId === 'blaze_bolt') {
                    // Get player and enemy positions for blaze bolt effect
                    const playerElement = document.querySelector('.player-character');
                    if (playerElement) {
                        const playerRect = playerElement.getBoundingClientRect();
                        const startX = playerRect.left + playerRect.width / 2;
                        const startY = playerRect.top + playerRect.height / 2;
                        
                        // Get the enemy's sprite container
                        const spriteElement = enemyElement.querySelector('.enemy-sprite');
                        const spriteRect = spriteElement ? spriteElement.getBoundingClientRect() : enemyElement.getBoundingClientRect();
                        
                        // Calculate end position (center of enemy sprite)
                        let endX = spriteRect.left + spriteRect.width / 2;
                        let endY = spriteRect.top + spriteRect.height / 2;

                        // Apply enemy-specific hitbox offsets
                        if (enemyElement.dataset.enemyId) {
                            if (enemyElement.dataset.enemyId === "1" || enemyElement.dataset.enemyId === "2") {
                                // Executioner hitbox offset
                                endX += 50 - 15; // Move 50px to the right (because of sprite flip), then 15px left for hitbox center
                                endY += 20; // Move 20px up to match the hitbox position
                            } else if (enemyElement.classList.contains('enemy-character') && (enemyElement.dataset.enemyId === "3" || enemyElement.dataset.enemyId === "4")) {
                                // Skeleton hitbox offset (IDs 3 and 4)
                                // No X offset, but move 40px down for hitbox center
                                endY += 40;
                            } else {
                                // Werewolf hitbox offset
                                endX += 50; // Move 50px to the right (because of sprite flip)
                                endY += 80; // Move 80px down
                            }
                        }
                        
                        // Play blaze bolt sound effect
                        const blazeBoltSound = new Audio('./assets/Audio/molten.mp3');
                        blazeBoltSound.volume = this.sfxVolume;
                        blazeBoltSound.play().catch(error => console.log('Error playing blaze bolt sound:', error));
                        
                        // Create blaze bolt effect
                        this.effectRenderer.createFireBoltEffect(startX, startY, endX, endY);
                        
                        // Wait for blaze bolt to reach enemy, then play explosion
                        setTimeout(() => {
                            const explosionSound = new Audio('./assets/Audio/explosion.mp3');
                            explosionSound.volume = this.sfxVolume;
                            explosionSound.play().catch(error => console.log('Error playing explosion sound:', error));
                            
                            // Create explosion effect at impact point
                            this.effectRenderer.createFlameBurstEffect(endX, endY);
                        }, 300); // Slightly before the blaze bolt animation completes
                        
                        // Wait for blaze bolt animation to complete
                        await new Promise(resolve => setTimeout(resolve, 400));
                    }
                } else if (attack.cardId === 'molten_strike') {
                    // Get enemy position for molten strike effect
                    const spriteElement = enemyElement.querySelector('.enemy-sprite');
                    const spriteRect = spriteElement ? spriteElement.getBoundingClientRect() : enemyElement.getBoundingClientRect();
                    
                    // Calculate target position (center of enemy sprite)
                    let targetX = spriteRect.left + spriteRect.width / 2;
                    let targetY = spriteRect.top + spriteRect.height / 2;

                    // Apply enemy-specific hitbox offsets
                    if (enemyElement.dataset.enemyId) {
                        if (enemyElement.dataset.enemyId === "1" || enemyElement.dataset.enemyId === "2") {
                            // Executioner hitbox offset
                            targetX += 50 - 15; // Move 50px to the right (because of sprite flip), then 15px left for hitbox center
                            targetY += 20; // Move 20px up to match the hitbox position
                        } else if (enemyElement.classList.contains('enemy-character') && (enemyElement.dataset.enemyId === "3" || enemyElement.dataset.enemyId === "4")) {
                            // Skeleton hitbox offset (IDs 3 and 4)
                            // No X offset, but move 40px down for hitbox center
                            targetY += 40;
                        } else {
                            // Werewolf hitbox offset
                            targetX += 40; // Move 40px to the right (because of sprite flip)
                            targetY += 80; // Move 80px down
                        }
                    }
                    
                    // Create molten strike effect
                    this.effectRenderer.createMoltenStrikeEffect(targetX, targetY);
                    // Wait for molten strike animation to complete
                    await new Promise(resolve => setTimeout(resolve, 800));
                } else if (attack.cardId === 'pyroclasm') {
                    console.log('Triggering pyroclasm effect');
                    
                    // Play pyroclasm sound effect
                    const pyroclasmSound = new Audio('./assets/Audio/pyo.mp3');
                    pyroclasmSound.volume = this.sfxVolume;
                    // Get player position for pyroclasm effect
                    const playerElement = document.querySelector('.player-character');
                    if (playerElement) {
                        // Play pyroclasm sound effect
                        const pyroclasmSound = new Audio('./assets/Audio/pyo.mp3');
                        pyroclasmSound.volume = this.sfxVolume;
                        pyroclasmSound.play().catch(error => console.log('Error playing pyroclasm sound:', error));

                        const playerRect = playerElement.getBoundingClientRect();
                        const mageX = playerRect.left + playerRect.width / 2;
                        const mageY = playerRect.top + playerRect.height / 2;
                        
                        // Create pyroclasm effect
                        this.effectRenderer.createPyroclasmEffect(mageX, mageY);
                        // Wait for pyroclasm animation to complete
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } else if (attack.cardId === 'heat_wave') {
                    console.log('Triggering heat wave effect');
                    
                    // Play heat wave sound effect
                    const heatWaveSound = new Audio('./assets/Audio/heatwave.mp3');
                    heatWaveSound.volume = this.sfxVolume;
                    heatWaveSound.play().catch(error => console.log('Error playing heat wave sound:', error));
                    
                    // Fade out after 4 seconds
                    setTimeout(() => {
                        const fadeOutInterval = setInterval(() => {
                            if (heatWaveSound.volume > 0.05) {
                                heatWaveSound.volume -= 0.05;
                            } else {
                                heatWaveSound.pause();
                                clearInterval(fadeOutInterval);
                            }
                        }, 50);
                    }, 4000);
                    
                    // Create heat wave effect for all enemies simultaneously
                    this.enemies.forEach(enemy => {
                        const enemyElement = enemy.element;
                        const spriteElement = enemyElement.querySelector('.enemy-sprite');
                        const spriteRect = spriteElement ? spriteElement.getBoundingClientRect() : enemyElement.getBoundingClientRect();
                        
                        // Calculate target position (center of enemy sprite)
                        let targetX = spriteRect.left + spriteRect.width / 2;
                        let targetY = spriteRect.top + spriteRect.height / 2;
                        
                        // Apply enemy-specific hitbox offsets
                        if (enemy.constructor.name === "Skeleton") {
                            // Skeleton hitbox offset - fixed position for all skeletons
                            targetY -= 20; // Move 20px up to align with bottom of playfield
                        } else if (enemyElement.dataset.enemyId === "1" || enemyElement.dataset.enemyId === "2") {
                            // Executioner hitbox offset
                            targetX += 50 - 15; // Move 50px to the right (because of sprite flip), then 15px left for hitbox center
                            targetY += 20; // Move 20px up to match the hitbox position
                        } else {
                            // Werewolf hitbox offset
                            targetX += 50; // Move 50px to the right (because of sprite flip)
                            targetY += 80; // Move 80px down
                        }
                        
                        console.log('Heat wave target position:', targetX, targetY);
                        
                        // Create heat wave effect for this enemy
                        this.effectRenderer.createHeatWaveEffect(targetX, targetY);
                    });
                    
                    // Wait for heat wave animation to complete
                    await new Promise(resolve => setTimeout(resolve, 3900));
                } else if (attack.cardId === 'flame_burst') {
                    // Get enemy position for flame burst effect
                    const spriteElement = enemyElement.querySelector('.enemy-sprite');
                    const spriteRect = spriteElement ? spriteElement.getBoundingClientRect() : enemyElement.getBoundingClientRect();
                    
                    // Calculate target position (center of enemy sprite)
                    let targetX = spriteRect.left + spriteRect.width / 2;
                    let targetY = spriteRect.top + spriteRect.height / 2;
                    
                    // Apply enemy-specific hitbox offsets
                    if (enemyElement.dataset.enemyId) {
                        if (enemyElement.dataset.enemyId === "1" || enemyElement.dataset.enemyId === "2") {
                            // Executioner hitbox offset
                            targetX += 50 - 15; // Move 50px to the right (because of sprite flip), then 15px left for hitbox center
                            targetY += 20; // Move 20px up to match the hitbox position
                        } else if (enemyElement.constructor && enemy.constructor.name === "Skeleton") {
                            // Skeleton hitbox offset (all skeletons)
                            targetY += 40;
                        } else {
                            // Werewolf hitbox offset
                            targetX += 50; // Move 50px to the right (because of sprite flip)
                            targetY += 80; // Move 80px down
                        }
                    }
                    
                    // Play flame burst sound effect
                    const flameBurstSound = new Audio('./assets/Audio/fire1.mp3');
                    flameBurstSound.volume = this.sfxVolume;
                    flameBurstSound.play().catch(error => console.log('Error playing flame burst sound:', error));
                    
                    // Create flame burst effect
                    this.effectRenderer.createFlameBurstEffect(targetX, targetY);
                    
                    // Wait for flame burst animation to complete
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            // Apply card effects
            if (attack.cardId === 'heat_wave' || attack.cardId === 'pyroclasm' || attack.cardId === 'meteor_strike' || attack.cardId === 'inferno') {
                // Apply damage to all enemies for heat wave, pyroclasm, meteor strike, and inferno
                for (const enemy of this.enemies) {
                    const isDead = enemy.takeDamage(cardData.attack);
                    // Play skeledead.mp3 if a Skeleton dies
                    if (isDead && enemy.constructor.name === 'Skeleton') {
                        console.log('Playing skeledead.mp3');
                        this.soundManager.playSound('skeledead');
                    }
                    if (isDead) {
                        enemy.destroy();
                        this.enemies = this.enemies.filter(e => e.id !== enemy.id);
                    }
                }
                this.checkLevelCompletion();
            } else {
                // Apply damage to single target for other cards
                const enemy = this.enemies.find(e => e.id === attack.targetEnemy.id);
                if (enemy) {
                    const isDead = enemy.takeDamage(cardData.attack);
                    // Play skeledead.mp3 if a Skeleton dies
                    if (isDead && enemy.constructor.name === 'Skeleton') {
                        console.log('Playing skeledead.mp3');
                        this.soundManager.playSound('skeledead');
                    }
                    if (isDead) {
                        enemy.destroy();
                        this.enemies = this.enemies.filter(e => e.id !== enemy.id);
                        this.checkLevelCompletion();
                    }
                }
            }

            if (cardData.type === 'Magic' && cardData.defense) {
                this.playerDefense = Math.min(100, this.playerDefense + cardData.defense);
                this.updateDefenseBar();
            }

            // Update the display
            this.updatePlayerHand();
            this.updatePileCounts();
            this.updateHealthBars();
            this.updateResourceBar();

            // Wait a bit between attacks to make the sequence more visible
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Clear the attack queue and reserved resources
        this.attackQueue = [];
        this.reservedResource = 0;
    }

    enemyTurn() {
        let currentEnemyIndex = 0;

        const processNextEnemy = () => {
            if (currentEnemyIndex >= this.enemies.length) {
                this.startPlayerTurn();
                return;
            }

            const attackingEnemy = this.enemies[currentEnemyIndex];
            const damage = Math.floor(Math.random() * 5) + 1;

            // Register the event handler BEFORE starting the attack animation
            const handleAttackFrame = (event) => {
                if (event.detail.enemyId === attackingEnemy.id) {
                    this.applyEnemyDamage(attackingEnemy, damage);
                }
            };
            document.addEventListener('enemyAttackFrame', handleAttackFrame);

            attackingEnemy.playAttackAnimation();
            
            const animationDuration = attackingEnemy.constructor.name === 'FlyingDemon' ? 1200 : 2600;

            setTimeout(() => {
                document.removeEventListener('enemyAttackFrame', handleAttackFrame);
                currentEnemyIndex++;
                processNextEnemy();
            }, animationDuration);
        };

        processNextEnemy();
    }

    startPlayerTurn() {
        this.isPlayerTurn = true;
        const endTurnBtn = document.querySelector('.end-turn-btn');
        if (endTurnBtn) {
            endTurnBtn.disabled = false;
        }

        // Update resources for the turn
        if (this.playerClass === 'mage') {
            this.playerResource = 11;
        } else {
            // Warrior gets 4 rage each turn, added to existing rage
            this.playerResource += 4;
        }
        this.updateResourceBar();

        // Store current hand size before drawing new cards
        const currentHandSize = this.playerDeck.hand.length;

        // Draw cards until player has 5 cards, keeping existing cards
        const cardsToDraw = 5 - currentHandSize;
        for (let i = 0; i < cardsToDraw; i++) {
            const card = this.drawCard();
            if (!card) break;
        }

        // Update hand with dealing animation, passing the previous hand size
        this.updatePlayerHand(true, currentHandSize);
    }

    applyEnemyDamage(enemy, damage) {
        let remainingDamage = damage;
        if (this.playerDefense > 0) {
            try {
                this.soundManager.playSound('shieldHit');
            } catch (error) {
                console.warn('Failed to play shield hit sound:', error);
            }

            if (this.playerDefense >= damage) {
                this.playerDefense -= damage;
                remainingDamage = 0;
                const shieldAura = document.querySelector('.shield-aura');
                if (shieldAura) {
                    shieldAura.classList.add('hit');
                    setTimeout(() => {
                        shieldAura.classList.remove('hit');
                    }, 500);
                }
            } else {
                remainingDamage = damage - this.playerDefense;
                this.playerDefense = 0;
                const shieldAura = document.querySelector('.shield-aura');
                if (shieldAura) {
                    shieldAura.classList.add('hit');
                    setTimeout(() => {
                        shieldAura.classList.remove('hit');
                    }, 500);
                }
            }
        }

        if (remainingDamage > 0) {
            this.playerHealth = Math.max(0, this.playerHealth - remainingDamage);
            if (this.playerCharacter) {
                this.playerCharacter.playHurtAnimation();
                
                if (this.playerClass === 'mage') {
                    try {
                        const hurtSounds = ['hurt1', 'hurt2', 'hurt3'];
                        const availableSounds = hurtSounds.filter(sound => sound !== this.lastHurtSound);
                        const randomSound = availableSounds[Math.floor(Math.random() * availableSounds.length)];
                        this.lastHurtSound = randomSound;
                        this.soundManager.playSound(randomSound);
                    } catch (error) {
                        console.warn('Failed to play hurt sound:', error);
                    }
                }
            }
        }

        this.updateHealthBars();
        this.updateDefenseBar();

        if (this.playerClass === 'warrior' && remainingDamage > 0) {
            this.playerResource += remainingDamage;
            this.updateResourceBar();
        }

        if (this.playerHealth <= 0) {
            this.endGame();
            return;
        }
    }

    endGame(isVictory = false) {
        const winner = isVictory ? 'Player' : (this.playerHealth <= 0 ? 'Enemy' : 'Player');
        
        // Create game over modal
        const modal = document.createElement('div');
        modal.className = 'game-over-modal';
        modal.style.display = 'flex';
        
        const content = document.createElement('div');
        content.className = 'game-over-content';
        content.innerHTML = `
            <h2>${isVictory ? 'Victory!' : 'Game Over!'}</h2>
            <p>${winner} wins!</p>
            <button class="restart-button">Play Again</button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Add click handler for restart button
        const restartButton = content.querySelector('.restart-button');
        restartButton.addEventListener('click', () => {
            modal.remove();
            location.reload();
        });
    }

    // Add method to remove a card from the queue
    removeFromQueue(cardId) {
        const attackIndex = this.attackQueue.findIndex(attack => attack.cardId === cardId);
        if (attackIndex !== -1) {
            const attack = this.attackQueue[attackIndex];
            // Return the reserved resources
            this.reservedResource -= attack.cost;
            // Remove from queue
            this.attackQueue.splice(attackIndex, 1);
            // Update the display
            this.updateResourceBar();
            this.updatePlayerHand();
        }
    }

    createDebugMenu() {
        const debugMenu = document.createElement('div');
        debugMenu.style.position = 'fixed';
        debugMenu.style.top = '10px';
        debugMenu.style.right = '10px';
        debugMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        debugMenu.style.padding = '10px';
        debugMenu.style.borderRadius = '5px';
        debugMenu.style.zIndex = '1000';
        debugMenu.style.color = 'white';
        debugMenu.style.fontFamily = 'Arial, sans-serif';
        debugMenu.style.fontSize = '14px';

        // Add debug controls
        const controls = [
            { label: 'Add to Hand', action: () => this.addCardToHand() },
            { label: 'Draw Card', action: () => this.drawCard() },
            { label: 'End Turn', action: () => this.endTurn() },
            { label: 'Toggle AI', action: () => this.toggleAI() },
            { label: 'Skip Level', action: () => this.skipLevel() },
        ];

        controls.forEach(control => {
            const button = document.createElement('button');
            button.textContent = control.label;
            button.style.display = 'block';
            button.style.width = '100%';
            button.style.margin = '5px 0';
            button.style.padding = '5px';
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '3px';
            button.style.cursor = 'pointer';
            button.onclick = control.action;
            debugMenu.appendChild(button);
        });

        // Add level selector
        const levelSelectorContainer = document.createElement('div');
        levelSelectorContainer.style.marginTop = '10px';
        levelSelectorContainer.style.padding = '5px';
        levelSelectorContainer.style.backgroundColor = '#333';
        levelSelectorContainer.style.borderRadius = '3px';

        const levelSelectorLabel = document.createElement('div');
        levelSelectorLabel.textContent = 'Select Level:';
        levelSelectorLabel.style.marginBottom = '5px';
        levelSelectorLabel.style.color = '#fff';
        levelSelectorContainer.appendChild(levelSelectorLabel);

        const levelSelector = document.createElement('select');
        levelSelector.style.width = '100%';
        levelSelector.style.padding = '5px';
        levelSelector.style.backgroundColor = '#4CAF50';
        levelSelector.style.color = 'white';
        levelSelector.style.border = 'none';
        levelSelector.style.borderRadius = '3px';
        levelSelector.style.cursor = 'pointer';

        // Add options for each level, including level 6
        for (let i = 1; i <= 7; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Level ${i}`;
            levelSelector.appendChild(option);
        }

        // Add event listener for level selection
        levelSelector.addEventListener('change', (e) => {
            const selectedLevel = parseInt(e.target.value);
            if (selectedLevel !== this.currentLevel) {
                this.currentLevel = selectedLevel;
                this.startNextLevel();
            }
        });

        levelSelectorContainer.appendChild(levelSelector);
        debugMenu.appendChild(levelSelectorContainer);

        document.body.appendChild(debugMenu);
    }

    addCardToHand(cardId) {
        if (cardId) {
            // Add the card directly to the player's hand
            this.playerDeck.hand.push(cardId);
            
            // Update the hand display
            this.updatePlayerHand();
            
            // Log the action
            console.log(`Added card ${cardId} to hand`);
        } else {
            console.log('No card selected');
        }
    }

    createPauseMenu() {
        this.pauseMenu = document.createElement('div');
        this.pauseMenu.className = 'pause-menu';
        this.pauseMenu.style.display = 'none';
        
        this.pauseMenu.innerHTML = `
            <div class="pause-content">
                <h2>Pause Menu</h2>
                <div class="volume-controls">
                    <div class="volume-slider">
                        <label for="music-volume">Music Volume</label>
                        <input type="range" id="music-volume" min="0" max="100" value="50">
                    </div>
                    <div class="volume-slider">
                        <label for="sfx-volume">Sound Effects Volume</label>
                        <input type="range" id="sfx-volume" min="0" max="100" value="50">
                    </div>
                </div>
                <button class="resume-button">Resume Game</button>
            </div>
        `;

        // Add event listeners for volume sliders
        const musicSlider = this.pauseMenu.querySelector('#music-volume');
        const sfxSlider = this.pauseMenu.querySelector('#sfx-volume');
        
        musicSlider.addEventListener('input', (e) => {
            this.musicVolume = e.target.value / 100;
            if (this.levelMusic) {
                this.levelMusic.volume = this.musicVolume;
            }
        });

        sfxSlider.addEventListener('input', (e) => {
            this.sfxVolume = e.target.value / 100;
        });

        // Add event listener for resume button
        const resumeButton = this.pauseMenu.querySelector('.resume-button');
        resumeButton.addEventListener('click', () => this.togglePause());

        document.body.appendChild(this.pauseMenu);
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseMenu.style.display = this.isPaused ? 'flex' : 'none';
        
        if (this.isPaused) {
            // Pause the game
            if (this.levelMusic) {
                this.levelMusic.pause();
            }
            // Disable game interactions
            this.gameScene.style.pointerEvents = 'none';
        } else {
            // Resume the game
            if (this.levelMusic) {
                this.levelMusic.play();
            }
            // Re-enable game interactions
            this.gameScene.style.pointerEvents = 'auto';
        }
    }

    checkLevelCompletion() {
        if (this.enemies.length === 0 && !this.isLevelTransitioning) {
            this.isLevelTransitioning = true;
            
            // If player is a mage, make them exit to the right
            if (this.playerClass === 'mage') {
                const playerElement = document.querySelector('.player-character');
                if (playerElement) {
                    // Store original position for reset
                    const originalPosition = playerElement.style.transform;
                    
                    // Wait 3 seconds before starting the exit animation
                    setTimeout(() => {
                        // Start the run animation
                        this.playerCharacter.playRunAnimation();
                        
                        // Play running sound starting 1 second in
                        const runningSound = this.soundManager.sounds.get('running');
                        if (runningSound) {
                            runningSound.currentTime = 1;
                            runningSound.play().catch(error => console.log('Error playing running sound:', error));
                        }
                        
                        // Animate mage moving right with a fixed pixel value to ensure it's off screen
                        playerElement.style.transition = 'transform 4s ease-out';
                        playerElement.style.transform = 'translateX(1200px)';
                        
                        // Wait for animation to complete before showing level transition
                        setTimeout(() => {
                            // Stop the run animation
                            this.playerCharacter.stopRunAnimation();
                            
                            // Stop running sound
                            if (runningSound) {
                                runningSound.pause();
                                runningSound.currentTime = 0;
                            }
                            
                            // Play appropriate level completion sound after mage has left
                            if (this.currentLevel === 1) {
                                this.soundManager.playSound('nextRound1');
                            } else if (this.currentLevel === 2) {
                                this.soundManager.playSound('nextRound2');
                            }
                            this.showLevelTransition();
                        }, 4000);
                    }, 3000);
                }
            } else if (this.playerClass === 'warrior') {
                const playerElement = document.querySelector('.player-character');
                if (playerElement) {
                    // Store original position for reset
                    const originalPosition = playerElement.style.transform;
                    
                    // Wait 3 seconds before starting the exit animation
                    setTimeout(() => {
                        // Start the run animation
                        this.playerCharacter.playRunAnimation();
                        
                        // Play running sound starting 1 second in
                        const runningSound = this.soundManager.sounds.get('running');
                        if (runningSound) {
                            runningSound.currentTime = 1;
                            runningSound.play().catch(error => console.log('Error playing running sound:', error));
                        }
                        
                        // Animate warrior moving right with a fixed pixel value to ensure it's off screen
                        playerElement.style.transition = 'transform 4s ease-out';
                        playerElement.style.transform = 'translateX(1200px)';
                        
                        // Wait for animation to complete before showing level transition
                        setTimeout(() => {
                            // Stop the run animation
                            this.playerCharacter.stopRunAnimation();
                            
                            // Stop running sound
                            if (runningSound) {
                                runningSound.pause();
                                runningSound.currentTime = 0;
                            }
                            
                            // Play appropriate level completion sound after warrior has left
                            if (this.currentLevel === 1) {
                                this.soundManager.playSound('nextRound1');
                            } else if (this.currentLevel === 2) {
                                this.soundManager.playSound('nextRound2');
                            }
                            this.showLevelTransition();
                        }, 4000);
                    }, 3000);
                }
            } else {
                // For other character types, show transition immediately
                this.showLevelTransition();
            }
        }
    }

    showLevelTransition() {
        // Create level transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'level-transition-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '1000';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s ease-in-out';
        
        const levelText = document.createElement('div');
        levelText.style.color = 'white';
        levelText.style.fontSize = '48px';
        levelText.style.fontFamily = 'Arial, sans-serif';
        levelText.style.textAlign = 'center';
        
        if (this.currentLevel < this.maxLevel) {
            levelText.textContent = `Level ${this.currentLevel + 1}`;
        } else {
            levelText.textContent = 'Victory!';
        }
        
        overlay.appendChild(levelText);
        document.body.appendChild(overlay);
        
        // Fade in the overlay
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
        
        // After a shorter delay, proceed to next level or show victory
        setTimeout(() => {
            if (this.currentLevel < this.maxLevel) {
                this.currentLevel++;
                this.startNextLevel();
            } else {
                this.showVictoryScreen();
            }
            
            // Remove the overlay with a fade out
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                this.isLevelTransitioning = false;
                // Re-enable game interactions
                const gameScene = document.querySelector('.game-scene');
                if (gameScene) {
                    gameScene.style.pointerEvents = 'auto';
                }
            }, 500);
        }, 1000); // Reduced from 2000ms to 1000ms
    }

    startNextLevel() {
        // Update level indicator
        const levelIndicator = document.querySelector('div[style*="position: fixed"][style*="top: 20px"][style*="left: 20px"]');
        if (levelIndicator) {
            levelIndicator.textContent = `Level ${this.currentLevel}`;
        }

        // Clean up existing enemies
        this.enemies.forEach(enemy => {
            if (enemy.animationInterval) {
                clearInterval(enemy.animationInterval);
            }
            if (enemy.element && enemy.element.parentNode) {
                enemy.element.parentNode.removeChild(enemy.element);
            }
        });
        this.enemies = []; // Clear the enemies array

        // Re-initialize the game for the new level
        this.initializeGame();

        // Run-in animation for mage/warrior after player element is created
        if (this.playerClass === 'mage' || this.playerClass === 'warrior') {
            setTimeout(() => {
                const playerElement = document.querySelector('.player-character');
                if (playerElement) {
                    // Start with player off-screen
                    playerElement.style.transition = 'none';
                    playerElement.style.transform = 'translateX(-600px)';
                    // Ensure player is not visible during initialization
                    playerElement.style.opacity = '0';
                    
                    setTimeout(() => {
                        // Make player visible and start run animation
                        playerElement.style.opacity = '1';
                        playerElement.style.transition = 'transform 2s ease-out, opacity 0.1s ease-out';
                        this.playerCharacter.playRunAnimation();
                        // Play running sound
                        const runningSound = this.soundManager.sounds.get('running');
                        if (runningSound) {
                            runningSound.currentTime = 1;
                            runningSound.play().catch(() => {});
                        }
                        playerElement.style.transform = 'translateX(0)';
                        setTimeout(() => {
                            this.playerCharacter.stopRunAnimation();
                            if (runningSound) {
                                runningSound.pause();
                                runningSound.currentTime = 0;
                            }
                        }, 2000);
                    }, 50);
                }
            }, 50); // Ensure DOM is ready
        }

        // Set playfield background based on level
        const playfield = document.querySelector('.playfield');
        if (playfield) {
            if (this.currentLevel === 1) {
                playfield.style.backgroundImage = "url('./assets/Images/gy.png')";
            } else if (this.currentLevel === 2) {
                playfield.style.backgroundImage = "url('./assets/Images/graveyard2.png')";
            } else if (this.currentLevel === 3) {
                playfield.style.backgroundImage = "url('./assets/Images/graveyard3.png')";
            } else if (this.currentLevel === 4) {
                playfield.style.backgroundImage = "url('./assets/Images/forest.png')";
            } else if (this.currentLevel === 5) {
                playfield.style.backgroundImage = "url('./assets/Images/forest2.png')";
            } else if (this.currentLevel === 6) {
                playfield.style.backgroundImage = "url('./assets/Images/forest3.png')";
            } else if (this.currentLevel === 7) {
                playfield.style.backgroundImage = "url('./assets/Images/forest5.png')";
            } else {
                playfield.style.backgroundImage = "";
            }
        }

        // Reset player's turn after all enemies are spawned
        setTimeout(() => {
            this.isLevelTransitioning = false;
            this.startPlayerTurn();
            // Re-enable game interactions
            const gameScene = document.querySelector('.game-scene');
            if (gameScene) {
                gameScene.style.pointerEvents = 'auto';
            }
        }, this.currentLevel * 800 + 1000);

        // Play forestnar.mp3 narration when reaching level 5
        if (this.currentLevel === 5) {
            if (this.playerClass === 'mage') {
                this.soundManager.playSound('forestnar');
            } else if (this.playerClass === 'warrior') {
                this.soundManager.playSound('warforest');
            }

            // Stop previous level music
            if (this.levelMusic) {
                this.levelMusic.pause();
                this.levelMusic.currentTime = 0;
            }
            // Start forestmusic.mp3 as new background music
            this.levelMusic = new Audio('./assets/Audio/forestmusic.mp3');
            this.levelMusic.loop = true;
            this.levelMusic.volume = 0;
            this.levelMusic.play().then(() => {
                // Fade in music
                const targetVolume = this.musicVolume || 0.5;
                const fadeIn = setInterval(() => {
                    if (this.levelMusic.volume < targetVolume - 0.05) {
                        this.levelMusic.volume += 0.05;
                    } else {
                        this.levelMusic.volume = targetVolume;
                        clearInterval(fadeIn);
                    }
                }, 100);
            }).catch(error => {
                console.log('Autoplay prevented:', error);
                const startMusic = () => {
                    this.levelMusic.play();
                    document.removeEventListener('click', startMusic);
                };
                document.addEventListener('click', startMusic);
            });

            // Show 'Continue Deeper' button after narration finishes
            const forestAudio = this.playerClass === 'mage' ? this.soundManager.sounds.get('forestnar') : this.soundManager.sounds.get('warforest');
            const showContinue = () => {
                this.addContinueDeeperButton();
                // Remove click listener if present
                const playfield = document.querySelector('.playfield');
                if (playfield) playfield.removeEventListener('click', skipNarration);
            };
            const skipNarration = () => {
                if (forestAudio) {
                    forestAudio.pause();
                    forestAudio.currentTime = 0;
                }
                showContinue();
            };
            if (forestAudio) {
                forestAudio.onended = showContinue;
                // Allow skipping by clicking the playfield
                const playfield = document.querySelector('.playfield');
                if (playfield) playfield.addEventListener('click', skipNarration);
            } else {
                // Fallback: show after 10 seconds if audio not found
                setTimeout(showContinue, 10000);
            }
        }
    }

    addContinueButton() {
        this.removeContinueButton();
        const btn = document.createElement('button');
        btn.className = 'continue-btn';
        btn.textContent = 'Continue to the Forest';
        btn.style.position = 'absolute';
        btn.style.top = '50%';
        btn.style.transform = 'translateY(-50%)';
        btn.style.right = '40px';
        btn.style.zIndex = '10';
        btn.style.padding = '20px 40px';
        btn.style.fontSize = '1.5em';
        btn.style.background = 'linear-gradient(135deg, #1a2a1a 60%, #2e4d2e 100%)';
        btn.style.color = '#b6ffb6';
        btn.style.border = '2px solid #39ff14';
        btn.style.borderRadius = '16px';
        btn.style.cursor = 'pointer';
        btn.style.zIndex = '10';
        btn.style.boxShadow = '0 0 24px 4px #39ff1466, 0 4px 24px rgba(0,0,0,0.7)';
        btn.style.fontFamily = '"Cinzel", "Times New Roman", serif';
        btn.style.letterSpacing = '1px';
        btn.style.textShadow = '0 0 8px #39ff14, 0 2px 2px #000';
        btn.style.transition = 'box-shadow 0.2s, background 0.2s, color 0.2s';
        btn.onmouseenter = () => {
            btn.style.boxShadow = '0 0 32px 8px #39ff14cc, 0 4px 32px rgba(0,0,0,0.8)';
            btn.style.background = 'linear-gradient(135deg, #223322 60%, #3e6d3e 100%)';
            btn.style.color = '#eaffea';
        };
        btn.onmouseleave = () => {
            btn.style.boxShadow = '0 0 24px 4px #39ff1466, 0 4px 24px rgba(0,0,0,0.7)';
            btn.style.background = 'linear-gradient(135deg, #1a2a1a 60%, #2e4d2e 100%)';
            btn.style.color = '#b6ffb6';
        };
        btn.addEventListener('click', () => this.handleContinueLevel4());
        const playfield = document.querySelector('.playfield');
        if (playfield) {
            playfield.appendChild(btn);
        } else {
            document.body.appendChild(btn);
        }
    }

    removeContinueButton() {
        const btn = document.querySelector('.continue-btn');
        if (btn) btn.remove();
    }

    handleContinueLevel4() {
        this.removeContinueButton();
        // Player runs off screen like previous levels, then go to map screen
        const playerElement = document.querySelector('.player-character');
        if (playerElement) {
            this.playerCharacter.playRunAnimation();
            const runningSound = this.soundManager.sounds.get('running');
            if (runningSound) {
                runningSound.currentTime = 1;
                runningSound.play().catch(error => console.log('Error playing running sound:', error));
            }
            // Fade out current background music
            if (this.levelMusic) {
                const fadeOut = setInterval(() => {
                    if (this.levelMusic.volume > 0.05) {
                        this.levelMusic.volume -= 0.05;
                    } else {
                        this.levelMusic.volume = 0;
                        this.levelMusic.pause();
                        clearInterval(fadeOut);
                    }
                }, 100);
            }
            playerElement.style.transition = 'transform 4s ease-out';
            playerElement.style.transform = 'translateX(1200px)';
            setTimeout(() => {
                this.playerCharacter.stopRunAnimation();
                if (runningSound) {
                    runningSound.pause();
                    runningSound.currentTime = 0;
                }
                // Instead of going to level 5, show the map screen
                this.showMapScreen();
            }, 4000);
        } else {
            // Fallback: just go to map screen
            if (this.levelMusic) {
                const fadeOut = setInterval(() => {
                    if (this.levelMusic.volume > 0.05) {
                        this.levelMusic.volume -= 0.05;
                    } else {
                        this.levelMusic.volume = 0;
                        this.levelMusic.pause();
                        clearInterval(fadeOut);
                    }
                }, 100);
            }
            // Instead of going to level 5, show the map screen
            this.showMapScreen();
        }
    }

    skipLevel() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            this.startNextLevel();
        } else {
            this.showVictoryScreen();
        }
    }

    addContinueDeeperButton() {
        this.removeContinueDeeperButton();
        const btn = document.createElement('button');
        btn.className = 'continue-deeper-btn';
        btn.textContent = 'Continue Deeper';
        btn.style.position = 'absolute';
        btn.style.top = '50%';
        btn.style.right = '40px';
        btn.style.transform = 'translateY(-50%)';
        btn.style.zIndex = '10';
        btn.style.padding = '20px 40px';
        btn.style.fontSize = '1.5em';
        btn.style.background = 'linear-gradient(135deg, #1a2a1a 60%, #2e4d2e 100%)';
        btn.style.color = '#b6ffb6';
        btn.style.border = '2px solid #39ff14';
        btn.style.borderRadius = '16px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 0 24px 4px #39ff1466, 0 4px 24px rgba(0,0,0,0.7)';
        btn.style.fontFamily = '"Cinzel", "Times New Roman", serif';
        btn.style.letterSpacing = '1px';
        btn.style.textShadow = '0 0 8px #39ff14, 0 2px 2px #000';
        btn.style.transition = 'box-shadow 0.2s, background 0.2s, color 0.2s';
        btn.onmouseenter = () => {
            btn.style.boxShadow = '0 0 32px 8px #39ff14cc, 0 4px 32px rgba(0,0,0,0.8)';
            btn.style.background = 'linear-gradient(135deg, #223322 60%, #3e6d3e 100%)';
            btn.style.color = '#eaffea';
        };
        btn.onmouseleave = () => {
            btn.style.boxShadow = '0 0 24px 4px #39ff1466, 0 4px 24px rgba(0,0,0,0.7)';
            btn.style.background = 'linear-gradient(135deg, #1a2a1a 60%, #2e4d2e 100%)';
            btn.style.color = '#b6ffb6';
        };
        btn.addEventListener('click', () => this.completeLevel5());
        const playfield = document.querySelector('.playfield');
        if (playfield) {
            playfield.appendChild(btn);
        } else {
            document.body.appendChild(btn);
        }
    }

    removeContinueDeeperButton() {
        const btn = document.querySelector('.continue-deeper-btn');
        if (btn) btn.remove();
    }

    completeLevel5() {
        this.removeContinueDeeperButton();
        // Player runs off screen before showing level 6
        const playerElement = document.querySelector('.player-character');
        if (playerElement) {
            this.playerCharacter.playRunAnimation();
            const runningSound = this.soundManager.sounds.get('running');
            if (runningSound) {
                runningSound.currentTime = 1;
                runningSound.play().catch(error => console.log('Error playing running sound:', error));
            }
            playerElement.style.transition = 'transform 4s ease-out';
            playerElement.style.transform = 'translateX(1200px)';
            setTimeout(() => {
                this.playerCharacter.stopRunAnimation();
                if (runningSound) {
                    runningSound.pause();
                    runningSound.currentTime = 0;
                }
                // Advance to level 6 and start next level
                this.currentLevel = 6;
                this.startNextLevel();
            }, 4000);
        } else {
            // Fallback: just go to level 6
            this.currentLevel = 6;
            this.startNextLevel();
        }
    }

    showMapScreen() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'map-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.85)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '2000';

        // Map container
        const mapContainer = document.createElement('div');
        mapContainer.style.position = 'relative';
        mapContainer.style.width = '900px';
        mapContainer.style.height = '400px';
        mapContainer.style.display = 'flex';
        mapContainer.style.alignItems = 'center';
        mapContainer.style.justifyContent = 'space-between';

        // gy.png (left)
        const gyImg = document.createElement('img');
        gyImg.src = './assets/Images/gy.png';
        gyImg.style.width = '250px';
        gyImg.style.height = '250px';
        gyImg.style.borderRadius = '16px';
        gyImg.style.boxShadow = '0 0 24px #000';
        gyImg.style.position = 'absolute';
        gyImg.style.left = '0';
        gyImg.style.top = '50%';
        gyImg.style.transform = 'translateY(-50%)';

        // forest2.png (right)
        const forestImg = document.createElement('img');
        forestImg.src = './assets/Images/forest2.png';
        forestImg.style.width = '250px';
        forestImg.style.height = '250px';
        forestImg.style.borderRadius = '16px';
        forestImg.style.boxShadow = '0 0 24px #000';
        forestImg.style.position = 'absolute';
        forestImg.style.right = '0';
        forestImg.style.top = '50%';
        forestImg.style.transform = 'translateY(-50%)';
        forestImg.style.cursor = 'pointer';

        // Dotted line
        const line = document.createElement('div');
        line.style.position = 'absolute';
        line.style.left = '125px';
        line.style.top = '50%';
        line.style.width = '650px';
        line.style.height = '0';
        line.style.borderTop = '4px dotted #fff';
        line.style.transform = 'translateY(-50%)';
        line.style.zIndex = '1';

        // Player sprite (idle)
        const playerSprite = this.playerCharacter.createPlayerElement();
        playerSprite.style.position = 'absolute';
        playerSprite.style.left = '60px';
        playerSprite.style.top = '50%';
        playerSprite.style.transform = 'translateY(-50%)';
        playerSprite.style.zIndex = '2';

        // Remove shield aura and stats for map
        const aura = playerSprite.querySelector('.shield-aura');
        if (aura) aura.remove();
        const stats = playerSprite.querySelector('.character-stats');
        if (stats) stats.remove();

        // Add elements to map container
        mapContainer.appendChild(gyImg);
        mapContainer.appendChild(forestImg);
        mapContainer.appendChild(line);
        mapContainer.appendChild(playerSprite);
        overlay.appendChild(mapContainer);
        document.body.appendChild(overlay);

        // Animate player to forest2.png on click
        forestImg.addEventListener('click', () => {
            forestImg.style.filter = 'brightness(1.2) drop-shadow(0 0 16px #39ff14)';
            // Run animation
            this.playerCharacter.playRunAnimation();
            const runningSound = this.soundManager.sounds.get('running');
            if (runningSound) {
                runningSound.currentTime = 1;
                runningSound.play().catch(() => {});
            }
            // Animate left to right
            playerSprite.style.transition = 'left 2s linear';
            playerSprite.style.left = '590px'; // Move to forest2.png
            // After run duration, stop run animation and show Enter button
            setTimeout(() => {
                this.playerCharacter.stopRunAnimation();
                if (runningSound) {
                    runningSound.pause();
                    runningSound.currentTime = 0;
                }
                // Show Enter button
                const enterBtn = document.createElement('button');
                enterBtn.textContent = 'Enter';
                enterBtn.style.position = 'absolute';
                enterBtn.style.left = '690px';
                enterBtn.style.top = '30%';
                enterBtn.style.transform = 'translateY(-50%)';
                enterBtn.style.padding = '16px 40px';
                enterBtn.style.fontSize = '1.5em';
                enterBtn.style.background = 'linear-gradient(135deg, #1a2a1a 60%, #2e4d2e 100%)';
                enterBtn.style.color = '#b6ffb6';
                enterBtn.style.border = '2px solid #39ff14';
                enterBtn.style.borderRadius = '16px';
                enterBtn.style.cursor = 'pointer';
                enterBtn.style.zIndex = '10';
                enterBtn.style.boxShadow = '0 0 24px 4px #39ff1466, 0 4px 24px rgba(0,0,0,0.7)';
                enterBtn.style.fontFamily = '"Cinzel", "Times New Roman", serif';
                enterBtn.style.letterSpacing = '1px';
                enterBtn.style.textShadow = '0 0 8px #39ff14, 0 2px 2px #000';
                enterBtn.style.transition = 'box-shadow 0.2s, background 0.2s, color 0.2s';
                enterBtn.addEventListener('mouseenter', () => {
                    enterBtn.style.boxShadow = '0 0 32px 8px #39ff14cc, 0 4px 32px rgba(0,0,0,0.8)';
                    enterBtn.style.background = 'linear-gradient(135deg, #223322 60%, #3e6d3e 100%)';
                    enterBtn.style.color = '#eaffea';
                });
                enterBtn.addEventListener('mouseleave', () => {
                    enterBtn.style.boxShadow = '0 0 24px 4px #39ff1466, 0 4px 24px rgba(0,0,0,0.7)';
                    enterBtn.style.background = 'linear-gradient(135deg, #1a2a1a 60%, #2e4d2e 100%)';
                    enterBtn.style.color = '#b6ffb6';
                });
                enterBtn.addEventListener('click', () => {
                    overlay.remove();
                    this.currentLevel = 5;
                    this.startNextLevel();
                });
                mapContainer.appendChild(enterBtn);
            }, 2000);
        });
    }

    handleLevel6Completion() {
        // Wait a short moment before player follows
        setTimeout(() => {
            const playerElement = document.querySelector('.player-character');
            if (playerElement) {
                // Start with player in current position
                const originalPosition = playerElement.style.transform;
                
                // Start the run animation
                this.playerCharacter.playRunAnimation();
                
                // Play running sound starting 1 second in
                const runningSound = this.soundManager.sounds.get('running');
                if (runningSound) {
                    runningSound.currentTime = 1;
                    runningSound.play().catch(error => console.log('Error playing running sound:', error));
                }
                
                // Animate player moving right with a fixed pixel value to ensure it's off screen
                playerElement.style.transition = 'transform 4s ease-out';
                playerElement.style.transform = 'translateX(1200px)';
                
                // Wait for animation to complete before showing level transition
                setTimeout(() => {
                    // Stop the run animation
                    this.playerCharacter.stopRunAnimation();
                    
                    // Stop running sound
                    if (runningSound) {
                        runningSound.pause();
                        runningSound.currentTime = 0;
                    }
                    
                    // Show level transition
                    this.showLevelTransition();
                }, 4000);
            }
        }, 1000); // Wait 1 second before player starts following
    }
}

// Start the game when the page loads
window.addEventListener('load', async () => {
    try {
        const preloader = new Preloader();
        const loadedAssets = await preloader.loadAllAssets();
        
        // Initialize game with loaded assets
        window.game = new Game();
        window.game.loadedAssets = loadedAssets;
    } catch (error) {
        console.error('Failed to load game assets:', error);
        alert('Failed to load game assets. Please refresh the page.');
    }
}); 

// Add HMR support at the end of the file
if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
        if (newModule) {
            const currentGame = Game.instance;
            if (currentGame) {
                // 1. Save current state
                const gameState = currentGame.saveState();

                // 2. Clean up current game
                currentGame.cleanup();

                // Stop and clean up all music instances
                if (currentGame.levelMusic) {
                    currentGame.levelMusic.pause();
                    currentGame.levelMusic.src = '';
                    currentGame.levelMusic = null;
                }

                // Clean up any other audio instances
                currentGame.soundManager.sounds.forEach(sound => {
                    if (sound instanceof Audio) {
                        sound.pause();
                        sound.src = '';
                    }
                });
                currentGame.soundManager.sounds.clear();

                // 3. Create new game instance
                const newGame = new newModule.Game();
                Game.instance = newGame;

                // 4. Restore state
                if (gameState.player) {
                    newGame.player = gameState.playerClass === 'warrior' ? 
                        new Warrior() : new Mage();
                    Object.assign(newGame.player, gameState.player);
                }

                // 5. Restore enemies
                if (gameState.enemies) {
                    newGame.enemies = gameState.enemies.map(enemyData => {
                        let enemy;
                        switch (enemyData.type) {
                            case 'Executioner':
                                enemy = new Executioner(enemyData.id, enemyData.maxHealth);
                                break;
                            case 'FlyingDemon':
                                enemy = new FlyingDemon(enemyData.id, enemyData.maxHealth);
                                break;
                            case 'Skeleton':
                                enemy = new Skeleton(enemyData.id, enemyData.maxHealth);
                                break;
                            case 'Werewolf':
                                enemy = new Werewolf(enemyData.id, enemyData.maxHealth);
                                break;
                            default:
                                enemy = new Enemy(enemyData.id, enemyData.maxHealth);
                        }
                        enemy.health = enemyData.health;
                        return enemy;
                    });
                }

                // 6. Restore game state
                newGame.currentLevel = gameState.currentLevel;
                newGame.isPlayerTurn = gameState.isPlayerTurn;
                newGame.isPaused = gameState.isPaused;
                newGame.playerClass = gameState.playerClass;
                newGame.playerDeck = gameState.playerDeck;

                // 7. Reinitialize game with preserved state
                newGame.initialize(newGame.playerClass, newGame.playerDeck);
            }
        }
    });
}