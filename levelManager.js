import { runLevel1 } from './levels/level1.js';
import { runLevel2 } from './levels/level2.js';
import { runLevel3 } from './levels/level3.js';
import { runLevel4 } from './levels/level4.js';
import { runLevel5 } from './levels/level5.js';
import { runLevel6 } from './levels/level6.js';
import { runLevel7 } from './levels/level7.js';
import { runLevel8 } from './levels/level8.js';
import { runLevel9 } from './levels/level9.js';
import { runLevel10 } from './levels/level10.js';
import { runLevel11 } from './levels/level11.js';
import { runLevel12 } from './levels/level12.js';
import { runLevel13 } from './levels/level13.js';
import { runLevel14 } from './levels/level14.js';
import { runLevel15 } from './levels/level15.js';
import { runLevel16 } from './levels/level16.js';
import { runLevel17 } from './levels/level17.js';

export class LevelManager {
    constructor(game) {
        this.game = game;
    }

    initializeLevel(level) {
        this.setBackground(level);
        this.setMusicAndNarration(level);
        this.spawnEnemies(level);
    }

    setBackground(level) {
        const playfield = document.querySelector('.playfield');
        if (!playfield) return;
        if (level === 1) {
            playfield.style.backgroundImage = "url('./assets/Images/gy.png')";
            playfield.style.backgroundSize = '';
            playfield.style.backgroundPosition = '';
        } else if (level === 2) {
            playfield.style.backgroundImage = "url('./assets/Images/graveyard2.png')";
            playfield.style.backgroundSize = '';
            playfield.style.backgroundPosition = '';
        } else if (level === 3) {
            playfield.style.backgroundImage = "url('./assets/Images/graveyard3.png')";
            playfield.style.backgroundSize = '';
            playfield.style.backgroundPosition = '';
        } else if (level === 4) {
            playfield.style.backgroundImage = "url('./assets/Images/forest.png')";
            playfield.style.backgroundSize = '';
            playfield.style.backgroundPosition = '';
        } else if (level === 5) {
            playfield.style.backgroundImage = "url('./assets/Images/forest2.png')";
            playfield.style.backgroundSize = '';
            playfield.style.backgroundPosition = '';
        } else if (level === 6) {
            playfield.style.backgroundImage = "url('./assets/Images/forest3.png')";
            playfield.style.backgroundSize = '';
            playfield.style.backgroundPosition = '';
        } else if (level === 7) {
            playfield.style.backgroundImage = "url('./assets/Images/forest5.png')";
            playfield.style.backgroundSize = '';
            playfield.style.backgroundPosition = '';
        } else if (level === 8) {
            playfield.style.backgroundImage = "url('./assets/Images/ftown.png')";
            playfield.style.backgroundSize = '';
            playfield.style.backgroundPosition = '';
        } else if (level === 9) {
            playfield.style.backgroundImage = "url('./assets/Images/level9.png')";
            playfield.style.backgroundSize = 'cover';
            playfield.style.backgroundPosition = '';
            playfield.style.backgroundRepeat = '';
        } else if (level === 10) {
            playfield.style.backgroundImage = "url('./assets/Images/innnight.png')";
            playfield.style.backgroundSize = 'cover';
            playfield.style.backgroundPosition = 'center';
            playfield.style.backgroundRepeat = 'no-repeat';
        } else if (level === 11) {
            playfield.style.backgroundImage = "url('./assets/Images/innkeeper.png')";
            playfield.style.backgroundSize = 'cover';
            playfield.style.backgroundPosition = 'center';
            playfield.style.backgroundRepeat = 'no-repeat';
        } else if (level === 12) {
            playfield.style.backgroundImage = "url('./assets/Images/innroom.png')";
            playfield.style.backgroundSize = 'cover';
            playfield.style.backgroundPosition = 'center';
            playfield.style.backgroundRepeat = 'no-repeat';
        } else if (level === 13) {
            playfield.style.backgroundImage = "url('./assets/Images/roomday.png')";
            playfield.style.backgroundSize = 'cover';
            playfield.style.backgroundPosition = 'center';
            playfield.style.backgroundRepeat = 'no-repeat';
        } else if (level === 14) {
            playfield.style.backgroundImage = "url('./assets/Images/innkeeper2.png')";
            playfield.style.backgroundSize = 'cover';
            playfield.style.backgroundPosition = 'center';
            playfield.style.backgroundRepeat = 'no-repeat';
        } else if (level === 15) {
            playfield.style.backgroundImage = "url('./assets/Images/innday.png')";
            playfield.style.backgroundSize = 'cover';
            playfield.style.backgroundPosition = 'center';
            playfield.style.backgroundRepeat = 'no-repeat';
        } else if (level === 16) {
            playfield.style.backgroundImage = "url('./assets/Images/townday.png')";
            playfield.style.backgroundSize = 'cover';
            playfield.style.backgroundPosition = 'center';
            playfield.style.backgroundRepeat = 'no-repeat';
        } else if (level === 17) {
            playfield.style.backgroundImage = "url('./assets/Images/pmerch.png')";
            playfield.style.backgroundSize = 'cover';
            playfield.style.backgroundPosition = 'center';
            playfield.style.backgroundRepeat = 'no-repeat';
        } else {
            playfield.style.backgroundImage = "";
            playfield.style.backgroundSize = '';
            playfield.style.backgroundPosition = '';
            playfield.style.backgroundRepeat = '';
        }
    }

    setMusicAndNarration(level) {
        // Handle music and narration for specific levels
        if (level === 5) {
            if (this.game.playerClass === 'mage') {
                this.game.soundManager.playSound('forestnar', 0.5);
            } else if (this.game.playerClass === 'warrior') {
                this.game.soundManager.playSound('warforest', 0.5);
            }
            // Stop previous level music
            if (this.game.levelMusic) {
                this.game.levelMusic.pause();
                this.game.levelMusic.currentTime = 0;
            }
            // Start forestmusic.mp3 as new background music
            this.game.levelMusic = new Audio('./assets/Audio/forestmusic.mp3');
            this.game.levelMusic.loop = true;
            this.game.levelMusic.volume = 0;
            this.game.levelMusic.play().then(() => {
                // Fade in music
                const targetVolume = this.game.musicVolume || 0.5;
                const fadeIn = setInterval(() => {
                    if (this.game.levelMusic.volume < targetVolume - 0.05) {
                        this.game.levelMusic.volume += 0.05;
                    } else {
                        this.game.levelMusic.volume = targetVolume;
                        clearInterval(fadeIn);
                    }
                }, 100);
            }).catch(error => {
                console.log('Autoplay prevented:', error);
                const startMusic = () => {
                    this.game.levelMusic.play();
                    document.removeEventListener('click', startMusic);
                };
                document.addEventListener('click', startMusic);
            });
            // Show 'Continue Deeper' button after narration finishes
            const forestAudio = this.game.playerClass === 'mage' ? this.game.soundManager.sounds.get('forestnar') : this.game.soundManager.sounds.get('warforest');
            const showContinue = () => {
                this.game.addContinueDeeperButton();
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
        if (level === 8) {
            const audio = this.game.soundManager.sounds.get('forestexit');
            if (audio) {
                audio.volume = 0.7;
                audio.currentTime = 0;
                audio.play().catch(() => {});
                audio.onended = () => {
                    this.game.showEnterTownButton();
                };
            } else {
                // If audio not found, fallback to show button after 3 seconds
                setTimeout(() => this.game.showEnterTownButton(), 3000);
            }
        }
        if (level === 9) {
            // Stop previous level music
            if (this.game.levelMusic) {
                this.game.levelMusic.pause();
                this.game.levelMusic.currentTime = 0;
            }
            // Start nighttown.mp3 as new background music
            this.game.levelMusic = new Audio('./assets/Audio/nighttown.mp3');
            this.game.levelMusic.loop = true;
            this.game.levelMusic.volume = this.game.musicVolume || 0.5;
            this.game.levelMusic.play().catch(error => {
                console.log('Autoplay prevented:', error);
                const startMusic = () => {
                    this.game.levelMusic.play();
                    document.removeEventListener('click', startMusic);
                };
                document.addEventListener('click', startMusic);
            });
            // Play townnar.mp3 narration (once, not looping) ONLY if not coming from level 10
            if (this.game.previousLevel !== 10) {
                const narration = new Audio('./assets/Audio/townnar.mp3');
                narration.volume = 0.7;
                narration.play().catch(error => {
                    console.log('Autoplay prevented:', error);
                    const startNarration = () => {
                        narration.play();
                        document.removeEventListener('click', startNarration);
                    };
                    document.addEventListener('click', startNarration);
                });
            }
        }
    }

    spawnEnemies(level) {
        if (level === 1) {
            runLevel1(this.game);
        } else if (level === 2) {
            runLevel2(this.game);
        } else if (level === 3) {
            runLevel3(this.game);
        } else if (level === 4) {
            runLevel4(this.game);
        } else if (level === 5) {
            runLevel5(this.game);
        } else if (level === 6) {
            runLevel6(this.game);
        } else if (level === 7) {
            runLevel7(this.game);
        } else if (level === 8) {
            runLevel8(this.game);
        } else if (level === 9) {
            runLevel9(this.game);
        } else if (level === 10) {
            runLevel10(this.game);
        } else if (level === 11) {
            runLevel11(this.game);
        } else if (level === 12) {
            runLevel12(this.game);
        } else if (level === 13) {
            runLevel13(this.game);
        } else if (level === 14) {
            runLevel14(this.game);
        } else if (level === 15) {
            runLevel15(this.game);
        } else if (level === 16) {
            runLevel16(this.game);
        } else if (level === 17) {
            runLevel17(this.game);
        } else {
            // Default: no enemies
        }
    }

    handleLevelTransition() {
        // Replicates showLevelTransition from Game
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

        if (this.game.currentLevel < this.game.maxLevel) {
            levelText.textContent = `Level ${this.game.currentLevel + 1}`;
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
            if (this.game.currentLevel < this.game.maxLevel) {
                this.game.currentLevel++;
                this.game.startNextLevel();
            } else {
                this.game.showVictoryScreen();
            }

            // Remove the overlay with a fade out
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                this.game.isLevelTransitioning = false;
                // Re-enable game interactions
                const gameScene = document.querySelector('.game-scene');
                if (gameScene) {
                    gameScene.style.pointerEvents = 'auto';
                }
            }, 500);
        }, 1000);
    }
} 