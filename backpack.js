import { Potion } from './potion.js';
import { Scroll } from './scroll.js';

export class Backpack {
    constructor(game) {
        this.game = game;
        this.items = new Array(16).fill(null); // 4x4 grid
        this.isOpen = false;
        this.showInventoryGrid = false;
        this.itemGrid = null;
    }

    initialize() {
        // Add a default base scroll to each slot in the top row if empty
        for (let i = 0; i < 4; i++) {
            if (!this.items[i]) {
                this.items[i] = new Scroll('base');
            }
        }
        this.addBackpackIcon();
    }

    addBackpackIcon() {
        // Remove any existing backpack icon, grid, or container for HMR support
        document.querySelectorAll('.backpack-item-grid').forEach(el => el.remove());
        document.querySelectorAll('.backpack-icon').forEach(el => el.remove());
        document.querySelectorAll('.backpack-container').forEach(el => el.remove());

        const discardPile = document.querySelector('.discard-pile');
        if (!discardPile) return;

        // Create a container for the backpack and grid
        const backpackContainer = document.createElement('div');
        backpackContainer.className = 'backpack-container';
        backpackContainer.style.position = 'absolute';
        backpackContainer.style.right = '-180px';
        backpackContainer.style.bottom = '0';
        backpackContainer.style.width = '200px';
        backpackContainer.style.height = '200px';
        backpackContainer.style.zIndex = '10';
        backpackContainer.style.pointerEvents = 'auto';
        backpackContainer.style.overflow = 'hidden'; // Clip grid to container

        // Create the backpack image element
        const backpack = document.createElement('img');
        backpack.src = './assets/Images/backpack.png';
        backpack.alt = 'Backpack';
        backpack.className = 'backpack-icon';
        backpack.style.position = 'absolute';
        backpack.style.left = '0';
        backpack.style.top = '0';
        backpack.style.width = '200px';
        backpack.style.height = '200px';
        backpack.style.objectFit = 'contain';
        backpack.style.cursor = 'pointer';
        backpack.style.filter = 'drop-shadow(0 2px 8px #000a)';
        backpack.style.zIndex = '10';

        // Create the item grid overlay (4x4)
        const itemGrid = document.createElement('div');
        itemGrid.className = 'backpack-item-grid';
        itemGrid.style.position = 'absolute';
        itemGrid.style.display = 'none';
        itemGrid.style.left = '0';
        itemGrid.style.top = '0';
        itemGrid.style.width = '109px';
        itemGrid.style.height = '149px';
        itemGrid.style.pointerEvents = 'auto';
        itemGrid.style.zIndex = '20';
        itemGrid.style.left = '50%';
        itemGrid.style.transform = 'translate(-55%, 16%)';
        itemGrid.style.display = 'grid';
        itemGrid.style.gridTemplateRows = '2.5fr 1fr 1fr 1fr';
        itemGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        itemGrid.style.gap = '2px';

        // Add 16 slots (4x4)
        for (let i = 0; i < 16; i++) {
            const slot = document.createElement('div');
            slot.className = 'backpack-item-slot';
            slot.style.pointerEvents = 'auto';
            slot.style.width = '100%';
            slot.style.height = '100%';
            itemGrid.appendChild(slot);
        }

        // Append elements to container
        backpackContainer.appendChild(backpack);
        // Store a reference to the container for later use
        this.backpackContainer = backpackContainer;

        discardPile.parentNode.appendChild(backpackContainer);

        // Store references
        this.itemGrid = itemGrid;

        // Add click handler for backpack toggle
        backpack.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            backpack.src = this.isOpen ? './assets/Images/backpackopen.png' : './assets/Images/backpack.png';
            
            if (this.isOpen) {
                if (!this.backpackContainer.contains(this.itemGrid)) {
                    this.backpackContainer.appendChild(this.itemGrid);
                }
                this.itemGrid.style.display = 'grid';
                this.itemGrid.style.visibility = 'visible';
                this.itemGrid.style.pointerEvents = 'auto';
                if (this.showInventoryGrid) {
                    this.itemGrid.classList.add('show-inventory-grid');
                } else {
                    this.itemGrid.classList.remove('show-inventory-grid');
                }
                backpack.style.pointerEvents = 'auto';
                backpack.classList.add('no-hover');
            } else {
                if (this.backpackContainer.contains(this.itemGrid)) {
                    this.backpackContainer.removeChild(this.itemGrid);
                }
                backpack.classList.remove('no-hover');
            }
            this.renderItems();
        });

        // Render initial items
        this.renderItems();
    }

    renderItems() {
        if (!this.itemGrid) return;

        for (let i = 0; i < 16; i++) {
            const slot = this.itemGrid.children[i];
            slot.innerHTML = '';
            slot.draggable = false;
            slot.ondragover = null;
            slot.ondrop = null;
            slot.ondragenter = null;
            slot.ondragleave = null;
            slot.ondragstart = null;
            slot.ondragend = null;
            
            if (this.items[i] instanceof Potion) {
                const potionImg = document.createElement('img');
                potionImg.src = this.items[i].imagePath;
                potionImg.alt = this.items[i].getDisplayName();
                potionImg.style.width = '100%';
                potionImg.style.height = '100%';
                potionImg.style.objectFit = 'contain';
                potionImg.style.pointerEvents = 'auto';
                potionImg.draggable = true;
                potionImg.dataset.slot = i;

                // Drag events
                potionImg.ondragstart = (e) => {
                    e.dataTransfer.setData('text/plain', i);
                    potionImg.classList.add('dragging');
                };
                potionImg.ondragend = (e) => {
                    potionImg.classList.remove('dragging');
                };

                // Add click handler to use potion
                potionImg.addEventListener('click', (event) => {
                    // Prevent using potion if dragging
                    if (event.detail === 0) return;
                    this.items[i].use(this.game);
                    this.removeItem(i);
                });
                slot.appendChild(potionImg);
            } else if (this.items[i] instanceof Scroll) {
                const scrollImg = document.createElement('img');
                scrollImg.src = this.items[i].imagePath;
                scrollImg.alt = this.items[i].getDisplayName();
                if (i < 4) { // Top row: make scroll image larger
                    scrollImg.style.position = 'static';
                    scrollImg.style.width = '100%';
                    scrollImg.style.height = '100%';
                    scrollImg.style.zIndex = '2';
                    scrollImg.style.objectFit = 'cover';
                } else {
                    scrollImg.style.width = '100%';
                    scrollImg.style.height = '100%';
                    scrollImg.style.objectFit = 'cover';
                }
                scrollImg.style.padding = '0';
                scrollImg.style.margin = '0';
                scrollImg.style.pointerEvents = 'auto';
                scrollImg.draggable = true;
                scrollImg.dataset.slot = i;

                // Drag events
                scrollImg.ondragstart = (e) => {
                    e.dataTransfer.setData('text/plain', i);
                    scrollImg.classList.add('dragging');
                };
                scrollImg.ondragend = (e) => {
                    scrollImg.classList.remove('dragging');
                };

                // Add click handler to use scroll
                scrollImg.addEventListener('click', (event) => {
                    if (event.detail === 0) return;
                    this.items[i].use(this.game);
                    this.removeItem(i);
                });
                // Make slot relative and allow overflow for top row
                if (i < 4) {
                    slot.style.position = 'relative';
                    slot.style.overflow = 'visible';
                }
                slot.appendChild(scrollImg);
                // Ensure slot fills grid cell
                slot.style.padding = '0';
                slot.style.margin = '0';
                slot.style.border = 'none';
                slot.style.width = '100%';
                slot.style.height = '100%';
            }

            // Allow dropping on any slot, but enforce scrolls only in top row and others in bottom rows
            slot.ondragover = (e) => {
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                const draggedItem = this.items[fromIndex];
                // Only allow scrolls in top row, others in bottom rows
                if ((i < 4 && draggedItem instanceof Scroll) || (i >= 4 && !(draggedItem instanceof Scroll))) {
                    e.preventDefault();
                    slot.classList.add('drag-over');
                }
            };
            slot.ondragleave = (e) => {
                slot.classList.remove('drag-over');
            };
            slot.ondrop = (e) => {
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
                const draggedItem = this.items[fromIndex];
                // Only allow scrolls in top row, others in bottom rows
                if ((i < 4 && draggedItem instanceof Scroll) || (i >= 4 && !(draggedItem instanceof Scroll))) {
                    e.preventDefault();
                    slot.classList.remove('drag-over');
                    if (fromIndex !== i) {
                        // Swap or move
                        const temp = this.items[i];
                        this.items[i] = this.items[fromIndex];
                        this.items[fromIndex] = temp;
                        this.renderItems();
                    }
                }
            };
        }
    }

    toggleInventoryGrid() {
        this.showInventoryGrid = !this.showInventoryGrid;
        if (this.itemGrid) {
            if (this.showInventoryGrid) {
                this.itemGrid.classList.add('show-inventory-grid');
            } else {
                this.itemGrid.classList.remove('show-inventory-grid');
            }
        }
    }

    addItem(itemType, slot) {
        if (slot >= 0 && slot < 16) {
            // Top row (0-3): Only allow scrolls
            if (slot >= 0 && slot < 4) {
                if (itemType === 'basescroll' || itemType instanceof Scroll) {
                    this.items[slot] = itemType === 'basescroll' ? new Scroll('base') : itemType;
                } else {
                    // Ignore or show error if trying to add non-scroll to top row
                    return;
                }
            } else { // Bottom 3 rows (4-15): Only allow non-scrolls
                if (itemType === 'healthpotion') {
                    this.items[slot] = new Potion('health', 30);
                } else if (itemType === 'manapotion') {
                    this.items[slot] = new Potion('mana', 5);
                } else if (itemType instanceof Scroll || itemType === 'basescroll') {
                    // Ignore or show error if trying to add scroll to bottom rows
                    return;
                } else {
                    this.items[slot] = itemType;
                }
            }
            this.renderItems();
        }
    }

    removeItem(slot) {
        if (slot >= 0 && slot < 16) {
            this.items[slot] = null;
            this.renderItems();
        }
    }
} 