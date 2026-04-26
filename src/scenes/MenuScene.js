class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.add.text(300, 250, 'Fighting Game', { fontSize: '32px', fill: '#fff' });
        
        // Play button
        const playButton = this.add.text(300, 350, 'Play Game', { fontSize: '24px', fill: '#0f0' });
        playButton.setInteractive();
        playButton.on('pointerdown', () => {
            this.scene.start('FightScene');
        });
    }
}