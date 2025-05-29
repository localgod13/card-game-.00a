export class Preloader {
    constructor() {
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.loadingScreen = null;
        this.progressBar = null;
        
        // Determine if we're running on GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io');
        const baseUrl = isGitHubPages ? '/Card-Game' : '';
        
        this.assetList = {
            sprites: {
                warrior: [
                    `${baseUrl}/assets/Sprites/Warrior/Idle.png`,
                    `${baseUrl}/assets/Sprites/Warrior/Attack1.png`,
                    `${baseUrl}/assets/Sprites/Warrior/Attack2.png`,
                    `${baseUrl}/assets/Sprites/Warrior/Attack3.png`,
                    `${baseUrl}/assets/Sprites/Warrior/hurt1.png`,
                    `${baseUrl}/assets/Sprites/Warrior/hurt2.png`,
                    `${baseUrl}/assets/Sprites/Warrior/hurt3.png`
                ],
                wizard: [
                    `${baseUrl}/assets/Sprites/Wizard/Idle.png`,
                    `${baseUrl}/assets/Sprites/Wizard/Attack1.png`,
                    `${baseUrl}/assets/Sprites/Wizard/Attack2.png`,
                    `${baseUrl}/assets/Sprites/Wizard/Hit.png`
                ],
                flyingDemon: [
                    `${baseUrl}/assets/Sprites/Flying eye/Flight.png`,
                    `${baseUrl}/assets/Sprites/Flying eye/Attack.png`,
                    `${baseUrl}/assets/Sprites/Flying eye/Take Hit.png`,
                    `${baseUrl}/assets/Sprites/Flying eye/Death.png`
                ],
                executioner: [
                    `${baseUrl}/assets/Sprites/Executioner/idle2.png`,
                    `${baseUrl}/assets/Sprites/Executioner/attacking.png`,
                    `${baseUrl}/assets/Sprites/Executioner/skill1.png`,
                    `${baseUrl}/assets/Sprites/Executioner/death.png`
                ],
                skeleton: [
                    `${baseUrl}/assets/Sprites/Skeleton/skeleIdle.png`,
                    `${baseUrl}/assets/Sprites/Skeleton/skeleattack.png`,
                    `${baseUrl}/assets/Sprites/Skeleton/skelehit.png`,
                    `${baseUrl}/assets/Sprites/Skeleton/skeledeath.png`,
                    `${baseUrl}/assets/Sprites/Skeleton/skeleshield.png`
                ],
                blackWerewolf: [
                    `${baseUrl}/assets/Sprites/Black Werewolf/bwIdle.png`,
                    `${baseUrl}/assets/Sprites/Black Werewolf/bjump.png`,
                    `${baseUrl}/assets/Sprites/Black Werewolf/rattack.png`,
                    `${baseUrl}/assets/Sprites/Black Werewolf/bdead.png`,
                    `${baseUrl}/assets/Sprites/Black Werewolf/bhurt.png`,
                    `${baseUrl}/assets/Sprites/Black Werewolf/brun.png`
                ],
                fire: [
                    `${baseUrl}/assets/Sprites/fire/burning_loop_1.png`,
                    `${baseUrl}/assets/Sprites/fire/burning_loop_4.png`
                ]
            },
            images: [
                `${baseUrl}/assets/Images/Gravyard.png`,
                `${baseUrl}/assets/Images/cardback.png`,
                `${baseUrl}/assets/Images/attack.png`,
                `${baseUrl}/assets/Images/defense.png`,
                `${baseUrl}/assets/Images/magic.png`,
                `${baseUrl}/assets/Images/gy.png`,
                `${baseUrl}/assets/Images/graveyard2.png`,
                `${baseUrl}/assets/Images/graveyard3.png`,
                `${baseUrl}/assets/Images/forest.png`,
                `${baseUrl}/assets/Images/forest2.png`,
                `${baseUrl}/assets/Images/forest3.png`,
                `${baseUrl}/assets/Images/wbutton.png`,
                `${baseUrl}/assets/Images/mbutton.png`,
                `${baseUrl}/assets/Images/flaming_meteor.png`,
                `${baseUrl}/assets/Images/fireball.png`,
                `${baseUrl}/assets/Images/Blaze.png`,
                `${baseUrl}/assets/Images/firebg.png`,
                `${baseUrl}/assets/Images/tscreen.png`,
                `${baseUrl}/assets/Images/leavingtown.png`,
                `${baseUrl}/assets/Images/mageboots48.png`,
                `${baseUrl}/assets/Images/doorcursor.png`
            ],
            audio: [
                `${baseUrl}/assets/Audio/tsmusic.mp3`,
                `${baseUrl}/assets/Audio/level1.mp3`,
                `${baseUrl}/assets/Audio/shieldhit.mp3`,
                `${baseUrl}/assets/Audio/hurt1.mp3`,
                `${baseUrl}/assets/Audio/hurt2.mp3`,
                `${baseUrl}/assets/Audio/hurt3.mp3`,
                `${baseUrl}/assets/Audio/nextround.mp3`,
                `${baseUrl}/assets/Audio/nextround2.mp3`,
                `${baseUrl}/assets/Audio/running.mp3`,
                `${baseUrl}/assets/Audio/skelshield.mp3`,
                `${baseUrl}/assets/Audio/skeledead.mp3`,
                `${baseUrl}/assets/Audio/forestnar.mp3`,
                `${baseUrl}/assets/Audio/warforest.mp3`,
                `${baseUrl}/assets/Audio/mageintro.wav`,
                `${baseUrl}/assets/Audio/warriorintro.mp3`,
                `${baseUrl}/assets/Audio/fire1.mp3`,
                `${baseUrl}/assets/Audio/fire2.mp3`,
                `${baseUrl}/assets/Audio/explosion.mp3`,
                `${baseUrl}/assets/Audio/molten.mp3`,
                `${baseUrl}/assets/Audio/inferno.mp3`,
                `${baseUrl}/assets/Audio/pyo.mp3`,
                `${baseUrl}/assets/Audio/heatwave.mp3`,
                `${baseUrl}/assets/Audio/click.mp3`,
                `${baseUrl}/assets/Audio/wolfdead.mp3`,
                `${baseUrl}/assets/Audio/forestmusic.mp3`,
                `${baseUrl}/assets/Audio/level6nar.mp3`,
                `${baseUrl}/assets/Audio/howl.mp3`,
                `${baseUrl}/assets/Audio/exdeath.mp3`,
                `${baseUrl}/assets/Audio/nighttown.mp3`,
                `${baseUrl}/assets/Audio/townday.mp3`,
                `${baseUrl}/assets/Audio/mountain.mp3`,
                `${baseUrl}/assets/Audio/level20.mp3`,
                `${baseUrl}/assets/Audio/scrollv1.mp3`,
                `${baseUrl}/assets/Audio/scrollv2.mp3`
            ]
        };
    }

    createLoadingScreen() {
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        
        const loadingContent = document.createElement('div');
        loadingContent.className = 'loading-content';
        
        const loadingText = document.createElement('h2');
        loadingText.textContent = 'Loading Game Assets...';
        
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        this.progressBar.appendChild(progressFill);
        
        const loadingPercentage = document.createElement('div');
        loadingPercentage.className = 'loading-percentage';
        loadingPercentage.textContent = '0%';
        
        loadingContent.appendChild(loadingText);
        loadingContent.appendChild(this.progressBar);
        loadingContent.appendChild(loadingPercentage);
        this.loadingScreen.appendChild(loadingContent);
        
        document.body.appendChild(this.loadingScreen);
    }

    calculateTotalAssets() {
        let total = 0;
        for (const category in this.assetList) {
            if (category === 'sprites') {
                for (const character in this.assetList.sprites) {
                    total += this.assetList.sprites[character].length;
                }
            } else {
                total += this.assetList[category].length;
            }
        }
        this.totalAssets = total;
    }

    updateProgress() {
        this.loadedAssets++;
        const percentage = Math.round((this.loadedAssets / this.totalAssets) * 100);
        
        const progressFill = this.progressBar.querySelector('.progress-fill');
        const loadingPercentage = this.loadingScreen.querySelector('.loading-percentage');
        
        progressFill.style.width = `${percentage}%`;
        loadingPercentage.textContent = `${percentage}%`;
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.updateProgress();
                resolve(img);
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${src}`);
                reject(new Error(`Failed to load image: ${src}`));
            };
            img.src = src;
        });
    }

    loadAudio(src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                this.updateProgress();
                resolve(audio);
            };
            audio.onerror = () => {
                console.error(`Failed to load audio: ${src}`);
                reject(new Error(`Failed to load audio: ${src}`));
            };
            audio.src = src;
        });
    }

    async loadAllAssets() {
        this.createLoadingScreen();
        this.calculateTotalAssets();
        
        const loadedAssets = new Map();
        
        try {
            // Load sprites
            for (const character in this.assetList.sprites) {
                for (const sprite of this.assetList.sprites[character]) {
                    const img = await this.loadImage(sprite);
                    loadedAssets.set(sprite, img);
                }
            }
            
            // Load images
            for (const image of this.assetList.images) {
                const img = await this.loadImage(image);
                loadedAssets.set(image, img);
            }

            // Load audio
            for (const audio of this.assetList.audio) {
                const audioElement = await this.loadAudio(audio);
                loadedAssets.set(audio, audioElement);
            }
            
            // Remove loading screen
            this.loadingScreen.remove();
            
            return loadedAssets;
        } catch (error) {
            console.error('Error loading assets:', error);
            this.loadingScreen.remove();
            throw error;
        }
    }
} 