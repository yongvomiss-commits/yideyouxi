class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const centerX = this.scale.width / 2;

        this.add.text(centerX, 170, 'Fighting Game', {
            fontSize: '46px',
            fill: '#ffffff',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        this.add.text(centerX, 240, '选择模式', {
            fontSize: '24px',
            fill: '#cccccc',
        }).setOrigin(0.5);

        this.createMenuButton(centerX, 320, '单人打电脑', () => {
            this.scene.start('FightScene', { mode: 'single' });
        });

        this.createMenuButton(centerX, 400, '双人同屏对战', () => {
            this.scene.start('FightScene', { mode: 'versus' });
        });
    }

    createMenuButton(x, y, label, onClick) {
        const button = this.add.text(x, y, label, {
            fontSize: '30px',
            fill: '#00ff99',
            backgroundColor: '#1a1a1a',
            padding: { left: 16, right: 16, top: 10, bottom: 10 },
        }).setOrigin(0.5);

        button.setInteractive({ useHandCursor: true });
        button.on('pointerover', () => button.setStyle({ fill: '#7fffd4' }));
        button.on('pointerout', () => button.setStyle({ fill: '#00ff99' }));
        button.on('pointerdown', onClick);
    }
}
