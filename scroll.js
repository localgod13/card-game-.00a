export class Scroll {
    constructor(type = 'base', effect = null, imagePath = './assets/Images/bpackscroll.png') {
        this.type = type; // e.g., 'base', 'fire', 'ice', etc.
        this.effect = effect; // Function or description of what the scroll does
        this.imagePath = imagePath;
    }

    use(game) {
        if (typeof this.effect === 'function') {
            this.effect(game);
        } else {
            // Default: do nothing or show a message
            console.log('This scroll has no effect.');
        }
    }

    getDisplayName() {
        return this.type.charAt(0).toUpperCase() + this.type.slice(1) + ' Scroll';
    }

    getDescription() {
        return this.effect && this.effect.description
            ? this.effect.description
            : 'A mysterious scroll.';
    }
} 