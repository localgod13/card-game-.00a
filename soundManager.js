// =========================
// SECTION: SoundManager Class (moved from game.js)
// =========================

export class SoundManager {
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
                // Game.instance.trackResource is not available here; caller must handle if needed
            };
            
            // Start loading the audio
            audio.load();
            
            return audio;
        } catch (error) {
            console.warn(`Error creating audio for ${id}:`, error);
            return null;
        }
    }

    playSound(id, volume) {
        try {
            const sound = this.sounds.get(id);
            if (sound) {
                // Create a new instance for overlapping sounds
                const soundInstance = new Audio(sound.src);
                soundInstance.volume = (typeof volume === 'number') ? volume : this.volume;
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