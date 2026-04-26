const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MenuScene, FightScene, ResultScene],
};

const game = new Phaser.Game(config);