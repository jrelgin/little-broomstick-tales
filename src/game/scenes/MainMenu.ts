import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    private background!: GameObjects.Image;
    private title!: GameObjects.Text;
    private startButton!: GameObjects.Text;
    private instructions!: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        console.log('MainMenu scene created');
        
        // Get the center of the screen
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Calculate scale factors based on screen size
        const baseWidth = 3072; // Our reference width
        const baseHeight = 1920; // Our reference height
        const scaleX = this.cameras.main.width / baseWidth;
        const scaleY = this.cameras.main.height / baseHeight;
        const scale = Math.min(scaleX, scaleY); // Use the smaller scale to maintain aspect ratio
        
        // Create background that fills the screen
        this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0xFFE4EC)
            .setOrigin(0.5);

        // Create title with responsive font size
        const titleFontSize = Math.floor(96 * scale);
        this.title = this.add.text(centerX, centerY * 0.5, 'Little Broomstick Tales', {
            fontFamily: 'Arial Black',
            fontSize: `${titleFontSize}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: Math.max(4, Math.floor(12 * scale)),
            align: 'center'
        }).setOrigin(0.5);

        // Create start button with responsive font size
        const buttonFontSize = Math.floor(64 * scale);
        this.startButton = this.add.text(centerX, centerY, 'Start Game', {
            fontFamily: 'Arial Black',
            fontSize: `${buttonFontSize}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: Math.max(3, Math.floor(8 * scale)),
            align: 'center',
            backgroundColor: '#4a90e2',
            padding: {
                left: Math.floor(40 * scale),
                right: Math.floor(40 * scale),
                top: Math.floor(20 * scale),
                bottom: Math.floor(20 * scale)
            }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => {
            console.log('Button hover');
            this.startButton.setScale(1.1);
        })
        .on('pointerout', () => {
            console.log('Button out');
            this.startButton.setScale(1);
        })
        .on('pointerdown', () => {
            console.log('Button clicked');
            this.scene.start('Game');
        });

        // Create instructions with responsive font size
        const instructionsFontSize = Math.floor(48 * scale);
        this.instructions = this.add.text(centerX, centerY * 1.5, 'Use arrow keys to move\nthe little witch on her broomstick!', {
            fontFamily: 'Arial',
            fontSize: `${instructionsFontSize}px`,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: Math.max(2, Math.floor(6 * scale)),
            align: 'center'
        }).setOrigin(0.5);

        // Handle window resize
        this.scale.on('resize', this.resize, this);
    }

    private resize(gameSize: { width: number; height: number }) {
        // Update camera
        this.cameras.main.setSize(gameSize.width, gameSize.height);
        
        // Get new center coordinates
        const centerX = gameSize.width / 2;
        const centerY = gameSize.height / 2;
        
        // Update background
        this.add.rectangle(centerX, centerY, gameSize.width, gameSize.height, 0xFFE4EC)
            .setOrigin(0.5);
        
        // Update title position
        this.title.setPosition(centerX, centerY * 0.5);
        
        // Update button position
        this.startButton.setPosition(centerX, centerY);
        
        // Update instructions position
        this.instructions.setPosition(centerX, centerY * 1.5);
    }
}
