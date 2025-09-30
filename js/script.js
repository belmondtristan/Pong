// Fonction pour rendre le canvas net sur tous les écrans
function resizeCanvasForHiDPI() {
    // Taille CSS voulue (en pixels affichés)
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    // On ajuste la taille interne du canvas
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    // On adapte le contexte pour dessiner à la bonne échelle
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    ctx.scale(dpr, dpr);
}


const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Dimensions de base pour ratios
const BASE_WIDTH = 300;
const BASE_HEIGHT = 500;
const BASE_RACKET_WIDTH = 70;
const BASE_RACKET_HEIGHT = 10;
const BASE_BALL_RADIUS = 8;

let x_b = canvas.width / 2;
let y_b = canvas.height / 2;
const speed_b_default = 2;
let b_angle;
let b_speed = speed_b_default;
let x_r = (canvas.width - getRacketWidth()) / 2;
let r_speed = 10;

function getRacketWidth() {
    return canvas.width * (BASE_RACKET_WIDTH / BASE_WIDTH);
}
function getRacketHeight() {
    return canvas.height * (BASE_RACKET_HEIGHT / BASE_HEIGHT);
}
function getBallRadius() {
    return canvas.width * (BASE_BALL_RADIUS / BASE_WIDTH);
}

let running = false;
let starttime;





let pongId;
let bouton_g = document.getElementById('fleche-gauche');
let bouton_d = document.getElementById('fleche-droite');
let bouton_new = document.getElementById('b_new');
let score = 0;
let bestScore = 0;
let scorValue = document.getElementById('score-value');
let bestScorValue = document.getElementById('best-score-value');

 const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Support tactile pour mobile : boutons gauche/droite
if (bouton_g && bouton_d) {
    bouton_g.addEventListener('touchstart', function(e) {
        e.preventDefault();
        keys['ArrowLeft'] = true;
    });
    bouton_g.addEventListener('touchend', function(e) {
        e.preventDefault();
        keys['ArrowLeft'] = false;
    });
    bouton_d.addEventListener('touchstart', function(e) {
        e.preventDefault();
        keys['ArrowRight'] = true;
    });
    bouton_d.addEventListener('touchend', function(e) {
        e.preventDefault();
        keys['ArrowRight'] = false;
    });
}

// Redimensionne le canvas à chaque resize pour éviter le flou
function handleResize() {
    resizeCanvasForHiDPI();
    draw();
}
window.addEventListener('resize', handleResize);
window.addEventListener('DOMContentLoaded', handleResize);

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_raquette();
    drawBall();
}


function update(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    let racketW = getRacketWidth();
    if(keys["ArrowLeft"] && x_r > 0) x_r -= r_speed;
    if(keys["ArrowRight"] && x_r + racketW < canvas.width) x_r += r_speed;
    if (b_speed < 8 && b_speed > 0) {
        b_speed = b_speed + 0.01;
    }
    if (b_speed > -8 && b_speed < 0) {
        b_speed = b_speed - 0.001;
    }
    moveBall(b_speed, b_angle);
    draw_raquette();
    drawBall();
    calculScore();
}



function calculScore(){
    if (running) {
        scoreUpdate();
    }
}

function initScore(){
    score = 0;
    bestScore = 0;
    scorValue.textContent = score;
    bestScorValue.textContent = bestScore;
}

function resetScore(){
    score = 0;
    scorValue.textContent = score;
}

function scoreUpdate(){
    score = Math.floor((Date.now() - starttime) / 1000);
    scorValue.textContent = score;
    if (score > bestScore) {
        bestScore = score;
        bestScorValue.textContent = bestScore;
    }
}

function draw_raquette(){
    ctx.fillStyle = 'white';
    ctx.fillRect(x_r, canvas.height - getRacketHeight() - 5, getRacketWidth(), getRacketHeight());
}

function drawBall() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x_b, y_b, getBallRadius(), 0, Math.PI * 2);
    ctx.fill();
}

function moveBall(speed, angle) {
    let ballR = getBallRadius();
    let racketW = getRacketWidth();
    let racketH = getRacketHeight();
    y_b -= speed;
    x_b += speed * Math.cos(angle);
    if (y_b - ballR <= 0) {
        b_speed = b_speed * (-1);
        b_angle = (Math.PI - b_angle) * (-1);
    }
    // Collision balle/raquette améliorée (empêche la balle de rentrer sur les côtés)
    let racketTop = canvas.height - racketH - 5;
    let racketBottom = canvas.height - 5;
    let racketLeft = x_r;
    let racketRight = x_r + racketW;
    let ballBottom = y_b + ballR;
    let ballTop = y_b - ballR;
    let ballLeft = x_b - ballR;
    let ballRight = x_b + ballR;
    if (
        ballBottom >= racketTop &&
        ballTop <= racketBottom &&
        ballRight >= racketLeft &&
        ballLeft <= racketRight
    ) {
         
        // Replace la balle juste au-dessus de la raquette pour éviter de "rentrer" dedans
        y_b = racketTop - ballR;
        b_speed = b_speed * (-1); // rebondit vers le haut
        let hit = (x_b - (x_r + racketW / 2)) / (racketW / 2); // -1 (gauche) à +1 (droite)
        b_angle = hit * (Math.PI - b_angle); // modifie l'angle selon l'endroit où la balle touche la raquette
    }
    if (y_b - ballR > canvas.height) {
        stopGame();
    }
    if (x_b - ballR <= 0 || x_b + ballR >= canvas.width) {
        b_angle = Math.PI - b_angle;
    }
}

function loop() {
    if (running) {
        update();
        pongId = requestAnimationFrame(loop);
      } else {
        // dessiner l'état final si perdu
        draw();
      }
}

function stopGame() {
    running = false;
    resetValues();
    alert("Game Over! Ton score: " + score + " seconds.");
    draw();
    cancelAnimationFrame(pongId);
    
}

function resetValues(){
    x_b = canvas.width / 2;
    y_b = canvas.height / 2;
    b_speed = speed_b_default;
    b_angle = Math.random();
    x_r = (canvas.width - getRacketWidth()) / 2;
}

//place tout les elements au centre et lance la boucle du jeu
function startGame() {
    running = true;
    resetValues();
    starttime = Date.now();
    if (bestScore == 0){
        initScore();
    }
    else{
        resetScore();
    }
    
    loop();
}

//prototype deplacement raquette avec boutons
/*document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            // Déplacer vers la gauche (en évitant de sortir du canvas)
            if (x_r > 0) x_r -= r_speed;
            break;

        case "ArrowRight":
            // Déplacer vers la droite (en évitant de dépasser la largeur)
            if (x_r + 80 < canvas.width) x_r += r_speed;
            break;

        default:
            // Pour toute autre touche, on ne fait rien
            break;
    }
    draw_raquette(); // on redessine après le déplacement
});*/

bouton_new.addEventListener('click',() => {
   startGame();
})