const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
let x_b = (400-4)/2;
let y_b = 572;

let x_r = (canvas.width-80)/2;
let r_speed = 10;

let running = false;


const spped_b_default = 2;
let pongId;
let bouton_g = document.getElementById('fleche-gauche');
let bouton_d = document.getElementById('fleche-droite');
let bouton_new = document.getElementById('nouvelle-partie');


function draw(){
    ctx.fillStyle = 'white';
    ctx.fillRect(x_r, 580, 80, 10);
    
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
    ctx.fillRect(x_r,580, 80 ,10);
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
            if (x_r > 0) x_r -= r_speed;
            break;

        case "ArrowRight":
            // Déplacer vers la droite (en évitant de dépasser la largeur)
            if (x_r + 80 < canvas.width) r_x += r_speed;
            break;

        default:
            // Pour toute autre touche, on ne fait rien
            break;
    }
    draw_raquette(); // on redessine après le déplacement
});

bouton_new.addEventListener('click',() => {
    draw();
})