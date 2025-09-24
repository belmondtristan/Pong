const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
let x_b = (400-4)/2;
let y_b = 572;

let running = false;


let raquette = {

    width: 80,
    height: 10,
    x: (canvas.width-raquette.width)/2,
    y: canvas.height - raquette.height*2,
    speed: 10

};

const spped_b_default = 2;
let pongId;
let bouton_g = document.getElementById('fleche-gauche');
let bouton_d = document.getElementById('fleche-droite');
let bouton_new = document.getElementById('nouvelle-partie');


function draw(){
    ctx.fillStyle = 'white';
    ctx.fillRect(raquette.x, raquette.y, raquette.width, raquette.height);
    
    ctx.beginPath();
    ctx.arc(x_b, y_b, 8, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
}


function update(){
}


function draw_raquette(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(raquette.x,raquette.y,raquette.width,raquette.height);
}

function drawBall() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
}

function loop() {
    if (running) {
        update();
        draw();
        timerId = requestAnimationFrame(loop);
      } else {
        // dessiner l'état final si perdu
        draw();
      }
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowLeft":
            // Déplacer vers la gauche (en évitant de sortir du canvas)
            if (raquette.x > 0) raquette.x -= raquette.speed;
            break;

        case "ArrowRight":
            // Déplacer vers la droite (en évitant de dépasser la largeur)
            if (raquette.x + raquette.width < canvas.width) raquette.x += raquette.speed;
            break;

        default:
            // Pour toute autre touche, on ne fait rien
            break;
    }
    draw_raquette(); // on redessine après le déplacement
});

bouton_new.addEventListener('click',() => {
    clearRect(0,0,canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(raquette.x, raquette.y, raquette.width, raquette.height);
    
    ctx.beginPath();
    ctx.arc(x_b, y_b, 8, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
})