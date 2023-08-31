class Game {
    constructor() {
        this.score = 0;
    }

    addScore() {
        this.score += 1;
        currentScore.innerText = this.score;
    }

    endGame() {
        if (getItem('scoreList') === null) {
            storeItem('scoreList', []);
        }
        if (getItem('highscore') === null) {
            storeItem('highscore', 0);
        }

        let scoreList = getItem('scoreList');
        scoreList.push(this.score);
        storeItem('scoreList', scoreList);

        if (getItem('highscore') < this.score) {
            storeItem('highscore', this.score);
        }

        highScoreText.innerText = getItem('highscore');
        scoreListText.innerText = getItem('scoreList');
        currentScore.innerText = 0;
    }

    reset() {
        console.log('reset');
        ball.reset();
        padel.reset();
        bricks = [];
        for (let i = 0; i < numBricks; i++) {
            bricks.push(new Brick(i));
        }
        this.score = 0;
    }
}

class Padel {
    constructor() {
        this.width = 100
        this.height = 10
        this.x = screenWidth / 2 - this.width / 2;
        this.y = screenHeight - 75 ;
        this.color = 'blue'
        this.xSpeed = 7.5;
    } 

    show() {
        fill(this.color)
        stroke('black')
        strokeWeight(1)
        rect(this.x, this.y, this.width, this.height);
    }

    moveLeft() {
        if (this.x >= 0) {
            this.x -= this.xSpeed;
        }
    }

    moveRight() {
        if (this.x <= screenWidth - this.width) {
            this.x += this.xSpeed;
        }
    }

    reset() {
        this.x = screenWidth / 2 - this.width / 2;
        this.y = screenHeight - 75 ;
    }
}

class Ball {
    constructor () {
        this.x = screenWidth / 2;
        this.y = screenHeight / 2;
        this.radius = 15;
        this.color = 'red';
        this.xSpeed = 0;
        this.ySpeed = 0;
    }

    show() {
        fill(this.color);
        stroke('black');
        strokeWeight(1);
        circle(this.x, this.y, this.radius);
    }

    startMoving() {
        this.xSpeed = 1;
        this.ySpeed = 5;
    }

    hasCollided(object) {
        if (this.x + this.radius >= object.x && this.x - this.radius <= object.x + object.width) {
            if (this.y + this.radius >= object.y && this.y - this.radius <= object.y + object.height) {
                return true;
            }
        }
        return false;
    }

    calculateCollisionAngle(object) {
        let angle = 0;
        if (this.x + this.radius >= object.x && this.x - this.radius <= object.x + object.width) {
            if (this.y + this.radius >= object.y && this.y - this.radius <= object.y + object.height) {
                angle = 90;
            }
        }
        return angle;
    }

    move() {

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.hasCollided(padel)) {
            this.ySpeed = -this.ySpeed;
            // this.xSpeed += (this.calculateCollisionAngle(padel) / 90) * 5;
        }

        bricks.forEach(brick => {
            if (this.hasCollided(brick)) {
                this.ySpeed = -this.ySpeed;
                bricks.splice(brick.index, 1);
                game.addScore();
            }
        });

        if (this.y + this.radius >= screenHeight || this.y - this.radius <= 0) {
            this.ySpeed = -this.ySpeed;
        }

        if (this.x + this.radius >= screenWidth || this.x - this.radius <= 0) {
            this.xSpeed = -this.xSpeed;
        }
        
    }

    reset() {
        this.x = screenWidth / 2;
        this.y = screenHeight / 2;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }
} 

class Brick {
    constructor(index) {
        this.index = index;
        this.width = 50;
        this.height = 20;
        this.x = (index * 50) % screenWidth;
        this.y = Math.floor((index * 50) / screenWidth) * this.height;
        this.color =[random(255), random(255), random(255)];
    }

    show() {
        fill(this.color[0], this.color[1], this.color[2]);
        stroke('white');
        rect(this.x, this.y, this.width, this.height);
    }
}

const screenWidth = 400;
const screenHeight = 400;
const numBricks = 40;

let game;
let padel;
let ball;
let bricks = [];

let startBtn;
let resetBtn;

let currentScore;
let highScoreText;
let scoreListText;

function setup() {
    let canvas = createCanvas(screenWidth, screenHeight);
    canvas.parent('canvas-container');

    game = new Game();
    padel = new Padel();
    ball = new Ball();
    for (let i = 0; i < numBricks; i++) {
        bricks.push(new Brick(i));
    }

    startBtn = document.getElementById('start');
    startBtn.addEventListener('click', () => {
        console.log('start');
        ball.startMoving();
    });

    resetBtn = document.getElementById('reset');
    resetBtn.addEventListener('click', () => {
        game.reset();
        storeItem('scoreList', []);
        storeItem('highscore', 0);
        window.location.reload();
    });

    currentScore = document.getElementById('current-score');
    highScoreText = document.getElementById('high-score')
    highScoreText.innerText = getItem('highscore') || 0;
    scoreListText = document.getElementById('score-list');
    scoreListText.innerText = getItem('scoreList') || [];
}

function draw() {
    background(200);

    padel.show();
    ball.show();
    bricks.forEach(brick => {
        brick.show();
    });

    ball.move();
    
    if (keyIsDown(LEFT_ARROW)) {
        padel.moveLeft();
    }
    if (keyIsDown(RIGHT_ARROW)) {
        padel.moveRight();
    }

    if (ball.y + ball.radius >= screenHeight - 10) {
        game.endGame();
        alert('You lost!');
        game.reset()
    }

    if (bricks.length === 0) {
        game.endGame();
        alert('You won!');
        game.reset();
    }
}