import StartGame from './game/main';

console.log('Main.ts loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    console.log('Game container element:', document.getElementById('game-container'));
    
    try {
        console.log('Starting game...');
        StartGame('game-container');
        console.log('Game started successfully');
    } catch (error) {
        console.error('Error starting game:', error);
    }
});