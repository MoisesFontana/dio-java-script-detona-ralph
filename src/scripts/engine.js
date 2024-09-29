const state = {
   view: {
      squares: document.querySelectorAll(".square"),
      enemy: document.querySelector(".enemy"),
      timeLeft: document.querySelector("#time-left"),
      score: document.querySelector("#score"),
      lives: document.querySelector("#lives"),
      newGame: document.querySelector(".new-game"),
      modal: document.querySelector("#customAlert"),
      newGameButton: document.querySelector(".new-game button")
   },
   value: {
      gameVelocity: 800,
      hitPosition: 0,
      scorePoints: 0,
      livePoints: 5,
      currentTime: 30
   },
   actions: {
      countDownTimerId: null,
      timerId: null,
   }
}

//-- atualiza o tempo restante
function countDown() {
   state.value.currentTime--;
   state.view.timeLeft.innerHTML = state.value.currentTime;

   if (state.value.currentTime <= 0) {
      playAudio("game-over.mp3");
      setTimeout(gameOver('Seu tempo acabou!'), 100); //-- setTimeout(função, 100) faz com que o navegador atualize a tela antes de parar a execução
   }
}

//-- termina o game
function gameOver(message) {
   clearInterval(state.actions.countDownTimerId);
   clearInterval(state.actions.timerId);

   //-- Seta messagem do game over
   document.getElementById("alertMessage").innerHTML = `<p class='motivo-game-over'>${message}</p> <p>Você conseguiu</p> <h3>${state.value.scorePoints}</h3> <p>pontos</p>`;

   //-- mostra o modal
   state.view.modal.style.display = "block";

}

//-- fecha o modal
function closeAlert() {
   state.view.modal.style.display = "none";
}

//-- lógica a ser implementada
function restartGame() {
   state.view.newGameButton.classList.remove('disabled');
   closeAlert();
   window.location.reload();
}

//-- tocar audio
function playAudio(audioName) {
   let audio = new Audio(`./src/audios/${audioName}`);
   audio.volume = 0.8;
   audio.play();
}

//-- muda a posição do inimigo
function randomSquare() {
   //-- remove todos os inimigos
   state.view.squares.forEach((square) => {
      square.classList.remove("enemy");
   })

   //-- gera posição aleatória do inimigo
   let randomSquare = state.view.squares[Math.floor(Math.random() * 9)];
   randomSquare.classList.add("enemy");

   //-- armazena a posição do inimigo
   state.value.hitPosition = randomSquare.id;
}
//-- move o inimigo a cada x tempo
function moveEnemy() {
   state.actions.timerId = setInterval(randomSquare, state.value.gameVelocity);
}

function startContdown() {
   state.actions.countDownTimerId = setInterval(countDown, 1000);
}

//-- listener que verifica se o clique acertou o inimigo
function addListenerHitBox() {
   state.view.squares.forEach((square) => {
      square.addEventListener("mousedown", () => {
         //-- se acertou o inimigo, aumenta 1 ponto de score
         if (square.id === state.value.hitPosition) {
            state.value.scorePoints++;
            state.view.score.innerHTML = state.value.scorePoints;
            playAudio("hit.m4a");
            state.view.enemy.classList.remove("enemy");
            //-- se errou, perde uma vida
         } else {
            state.value.livePoints--;
            state.view.lives.innerHTML = state.value.livePoints;
            playAudio("wrong.mp3");

            if (state.value.livePoints <= 0) {
               playAudio("game-over.mp3");
               setTimeout(gameOver('Sua vidas acabaram!'), 100); //-- setTimeout(função, 100) faz com que o navegador atualize a tela antes de parar a execução
            }
         }
      })
   })
}

function init() {
   moveEnemy();
   startContdown();
   addListenerHitBox();
}

state.view.newGame.addEventListener("click", () => {

   state.view.newGameButton.classList.add('disabled');
   init();
})
