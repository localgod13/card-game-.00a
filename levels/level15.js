// Level 15: Innday scene (town, player character, no enemies)
export function runLevel15(game) {
    // Remove enemy side
    const enemySide = document.querySelector('.enemy-side');
    if (enemySide) enemySide.innerHTML = '';
    // Remove any existing inn/town door boxes and interactable rectangles
    document.querySelectorAll('.inn-door-box').forEach(el => el.remove());
    document.querySelectorAll('.interactable-rect').forEach(el => el.remove());
    document.querySelectorAll('.innkeeper-dialogue-box').forEach(el => el.remove());
    // Remove any lingering 'Leave the Inn' button
    const leaveBtn = document.querySelector('button');
    if (leaveBtn && leaveBtn.textContent === 'Leave the Inn') leaveBtn.remove();
    // Add inn door box (visual/interactable, no transition)
    const playfield = document.querySelector('.playfield');
    if (playfield) {
        const innDoor = document.createElement('div');
        innDoor.className = 'inn-door-box interactable-rect';
        innDoor.style.position = 'absolute';
        innDoor.style.left = '35%';
        innDoor.style.top = '65%';
        innDoor.style.width = '60px';
        innDoor.style.height = '150px';
        innDoor.style.background = 'rgba(80, 200, 255, 0.25)';
        innDoor.style.border = '2px solid #39ff14';
        innDoor.style.borderRadius = '12px';
        innDoor.style.cursor = 'pointer';
        innDoor.style.zIndex = '3000';
        innDoor.title = 'Inn Door';
        innDoor.style.display = 'flex';
        innDoor.style.alignItems = 'center';
        innDoor.style.justifyContent = 'center';
        innDoor.style.fontSize = '2em';
        innDoor.style.color = '#fff';
        innDoor.style.fontWeight = 'bold';
        innDoor.style.textShadow = '0 0 8px #39ff14, 0 2px 2px #000';
        innDoor.textContent = 'Inn';
        innDoor.style.opacity = '0'; // Hidden by default
        innDoor.style.pointerEvents = 'auto';
        innDoor.addEventListener('mouseenter', () => {
            innDoor.style.background = 'rgba(80, 255, 180, 0.35)';
            innDoor.style.borderColor = '#fff';
            innDoor.style.cursor = 'url("/assets/Images/doorcursor.png") 24 24, pointer';
        });
        innDoor.addEventListener('mouseleave', () => {
            innDoor.style.background = 'rgba(80, 200, 255, 0.25)';
            innDoor.style.borderColor = '#39ff14';
            innDoor.style.cursor = 'pointer';
        });
        innDoor.addEventListener('click', () => {
            game.previousLevel = 15;
            game.currentLevel = 14;
            game.startNextLevel();
        });
        playfield.appendChild(innDoor);
        // Add 'Back to Town' box with transition to level 16
        const backBox = document.createElement('div');
        backBox.className = 'inn-door-box interactable-rect';
        backBox.style.position = 'absolute';
        backBox.style.left = '60%';
        backBox.style.top = '65%';
        backBox.style.width = '300px';
        backBox.style.height = '150px';
        backBox.style.background = 'rgba(80, 200, 255, 0.25)';
        backBox.style.border = '2px solid #39ff14';
        backBox.style.borderRadius = '12px';
        backBox.style.cursor = 'pointer';
        backBox.style.zIndex = '3000';
        backBox.title = 'Back to Town';
        backBox.style.display = 'flex';
        backBox.style.alignItems = 'center';
        backBox.style.justifyContent = 'center';
        backBox.style.fontSize = '2em';
        backBox.style.color = '#fff';
        backBox.style.fontWeight = 'bold';
        backBox.style.textShadow = '0 0 8px #39ff14, 0 2px 2px #000';
        backBox.textContent = 'Back to Town';
        backBox.style.opacity = '0'; // Hidden by default
        backBox.style.pointerEvents = 'auto';
        backBox.addEventListener('mouseenter', () => {
            backBox.style.background = 'rgba(80, 255, 180, 0.35)';
            backBox.style.borderColor = '#fff';
            backBox.style.cursor = 'url("/assets/Images/mageboots48.png") 24 40, pointer';
        });
        backBox.addEventListener('mouseleave', () => {
            backBox.style.background = 'rgba(80, 200, 255, 0.25)';
            backBox.style.borderColor = '#39ff14';
            backBox.style.cursor = 'pointer';
        });
        backBox.addEventListener('click', () => {
            game.previousLevel = 15;
            game.currentLevel = 16;
            game.startNextLevel();
        });
        playfield.appendChild(backBox);
    }
    // No 'Leave the Inn' button for level 15
    console.log('[Level 15] Background set to innday.png, currentLevel:', game.currentLevel);
} 