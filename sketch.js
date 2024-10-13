let jogando = false;
let pausado = false;
let pontuacao = 0;
let player;
let formas = [];
let obstaculos = [];
let fundoImg, jogadorImg;
let ultimaMensagemParabens = 0;

function preload() {
  fundoImg = loadImage('imag.fundo.png');
  jogadorImg = loadImage('bola.png');
}

function setup() {
  let canvasSize = min(windowWidth * 0.9, windowHeight * 0.8);
  createCanvas(canvasSize, canvasSize);
  player = { x: width / 2, y: height / 2, size: 50 };
  noLoop();
  inicializarJogo();
}

function iniciarJogo() {
  jogando = true;
  pausado = false;
  pontuacao = 0;
  document.getElementById("game-over").style.display = "none";
  document.getElementById("congratulations").style.display = "none";
  formas = [];
  obstaculos = [];
  inicializarJogo();
  loop();
}

function pausarJogo() {
  if (jogando) {
    pausado = !pausado;
    if (pausado) {
      noLoop();
      document.getElementById("pauseButton").innerText = "Continuar";
    } else {
      loop();
      document.getElementById("pauseButton").innerText = "Pause";
    }
  }
}

function inicializarJogo() {
  formas = [];
  obstaculos = [];
  for (let i = 0; i < 5; i++) {
    formas.push(criarForma());
  }
  for (let i = 0; i < 2; i++) {
    obstaculos.push(criarObstaculo());
  }
}

function draw() {
  if (fundoImg) {
    image(fundoImg, 0, 0, width, height);
  } else {
    background(20);
  }

  document.getElementById("pontuacao").innerText = "Pontuação: " + pontuacao;

  stroke(255, 204, 0);
  strokeWeight(8);
  noFill();
  rect(8, 8, width - 16, height - 16, 10);

  if (jogando && !pausado) {
    desenharJogador();
    moverFormas();
    moverObstaculos();
    verificarColisoes();
    verificarNivel();
    exibirMensagemParabens();
  }
}

function desenharJogador() {
  let posX = (touches.length > 0) ? touches[0].x : mouseX;
  let posY = (touches.length > 0) ? touches[0].y : mouseY;

  if (pontuacao % 500 === 0 && pontuacao > 0) {
    player.size += 2;
  }

  if (jogadorImg) {
    image(jogadorImg, posX - player.size / 2, posY - player.size / 2, player.size, player.size);
  } else {
    fill(0, 150, 255);
    noStroke();
    ellipse(posX, posY, player.size);
  }
}

function moverFormas() {
  for (let i = formas.length - 1; i >= 0; i--) {
    let forma = formas[i];
    fill(forma.color);
    noStroke();

    if (forma.tipo === "circulo") {
      ellipse(forma.x, forma.y, forma.size);
    } else if (forma.tipo === "triangulo") {
      triangle(
        forma.x, forma.y - forma.size / 2,
        forma.x - forma.size / 2, forma.y + forma.size / 2,
        forma.x + forma.size / 2, forma.y + forma.size / 2
      );
    } else if (forma.tipo === "quadrado") {
      rect(forma.x - forma.size / 2, forma.y - forma.size / 2, forma.size, forma.size);
    }

    let posX = (touches.length > 0) ? touches[0].x : mouseX;
    let posY = (touches.length > 0) ? touches[0].y : mouseY;

    if (dist(posX, posY, forma.x, forma.y) < player.size / 2 + forma.size / 2) {
      formas.splice(i, 1);
      pontuacao += 10;
      formas.push(criarForma());
    }
  }
}

function moverObstaculos() {
  for (let obstaculo of obstaculos) {
    fill(obstaculo.color);
    noStroke();
    rect(obstaculo.x, obstaculo.y, obstaculo.size, obstaculo.size);

    obstaculo.x += obstaculo.speedX;
    obstaculo.y += obstaculo.speedY;

    if (obstaculo.x < 0 || obstaculo.x > width - obstaculo.size) obstaculo.speedX *= -1;
    if (obstaculo.y < 0 || obstaculo.y > height - obstaculo.size) obstaculo.speedY *= -1;
  }
}

function verificarColisoes() {
  let posX = (touches.length > 0) ? touches[0].x : mouseX;
  let posY = (touches.length > 0) ? touches[0].y : mouseY;

  for (let obstaculo of obstaculos) {
    if (dist(posX, posY, obstaculo.x + obstaculo.size / 2, obstaculo.y + obstaculo.size / 2) < player.size / 2 + obstaculo.size / 2) {
      fimDeJogo();
    }
  }
}

function fimDeJogo() {
  jogando = false;
  formas = [];
  obstaculos = [];
  noLoop();
  document.getElementById("game-over").style.display = "block";
  document.getElementById("pontuacaoFinal").innerText = pontuacao;
}

function criarForma() {
  let tipos = ["circulo", "triangulo", "quadrado"];
  let tipo = random(tipos);
  return {
    x: random(20, width - 20),
    y: random(20, height - 20),
    size: random(20, 40),
    tipo: tipo,
    color: color(random(100, 255), random(100, 255), random(255))
  };
}

function criarObstaculo() {
  return {
    x: random(20, width - 20),
    y: random(20, height - 20),
    size: random(20, 40),
    speedX: random(-3, 3),
    speedY: random(-3, 3),
    color: color(random(100, 255), random(100, 255), random(255))
  };
}

function windowResized() {
  let canvasSize = min(windowWidth * 0.9, windowHeight * 0.8);
  resizeCanvas(canvasSize, canvasSize);
}

function verificarNivel() {
  if (pontuacao >= 500 && obstaculos.length < 3) {
    obstaculos.push(criarObstaculo());
  }
  if (pontuacao >= 1100 && obstaculos.length < 4) {
    obstaculos.push(criarObstaculo());
  }
}

function exibirMensagemParabens() {
  if (pontuacao >= ultimaMensagemParabens + 300) {
    ultimaMensagemParabens += 300;
    document.getElementById("congratulations").style.display = "block";
    setTimeout(() => {
      document.getElementById("congratulations").style.display = "none";
    }, 2000);
  }
}
