// When retrieving the high score from local storage
var highScore = localStorage.getItem('highScore') || 0;
document.getElementById('high-score').textContent = 'High Score: ' + highScore;

// When updating the high score
if (score > highScore) {
  highScore = score;
  localStorage.setItem('highScore', highScore);
  document.getElementById('high-score').textContent = 'High Score: ' + highScore;
  // Optionally display a message about the new high score
}

// Load Images
var spaceshipImage = new Image();
spaceshipImage.src = 'icons8-space-fighter-96.png';
var spaceshipLoaded = false;

var alienImage = new Image();
alienImage.src = 'icons8-space-invaders-48.png';
var alienLoaded = false;

spaceshipImage.onload = function() {
  spaceshipLoaded = true;
  checkStartGame();
};

alienImage.onload = function() {
  alienLoaded = true;
  checkStartGame();
};

function checkStartGame() {
  if (spaceshipLoaded && alienLoaded) {
    update(); // Start the game loop once images have loaded
  }
}

// Selecting elements from the DOM
var canvas = document.getElementById("space-invaders-canvas");
var context = canvas.getContext("2d");
var gameOverMessage = document.getElementById("game-over-message");
var scoreDisplay = document.getElementById("score");
var playAgainButton = document.getElementById("play-again-button");

// Add an event listener to the "Play Again" button
playAgainButton.addEventListener("click", function() {
  playAgain();
});

// Game variables
var score = 0;
var gameOver = false;
var player = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  width: 35,  // updated to match spaceship image width
  height: 35, // updated to match spaceship image height
  speed: 5,
  direction: null
};
var bullets = [];
var invaders = [];
var invaderSpeed = 1;

// Sound effects
var shootingSound = new Audio('shooting sound.mp3');
var targetHitSound = new Audio('target hit.mp3');
var playAgainSound = new Audio('play again button.mp3');
var gameOverSound = new Audio('gameover.mp3');
var winSound = new Audio('winsound.mp3'); // Add the win sound

function playerWins() {
  var gameWinMessage = document.getElementById("game-win-message"); 
  gameWinMessage.textContent = "You Win!";
  gameWinMessage.classList.add('visible'); 
  playAgainButton.style.display = "block"; 
  winSound.play();
   gameOver = true;
}


// Creating invaders
for (var i = 0; i < 5; i++) {
  for (var j = 0; j < 10; j++) {
    invaders.push({
      x: j * 30 + 30,   // updated to match alien image width
      y: i * 30 + 30,   // updated to match alien image height
      width: 24,        // updated to match alien image width
      height: 24,       // updated to match alien image height
      isDestroyed: false
    });
  }
}

// Update your drawing functions to use the images
function drawPlayer() {
  if (spaceshipLoaded) {
    context.drawImage(spaceshipImage, player.x, player.y, player.width, player.height);
  }
}

function drawBullets() {
  context.fillStyle = "#FF0000";
  bullets.forEach(function(bullet) {
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function drawInvaders() {
  if (alienLoaded) {
    invaders.forEach(function(invader) {
      if (!invader.isDestroyed) {
        context.drawImage(alienImage, invader.x, invader.y, invader.width, invader.height);
      }
    });
  }
}

function drawScore() {
  context.font = "16px Arial";
  context.fillStyle = "#0095DD";
  context.fillText("Score: " + score, 8, 20);
}

// Rest of your game logic (updatePlayer, updateBullets, updateInvaders, checkGameOver, detectCollision, playAgain, update)

// Event listeners for player control with sound
document.addEventListener("keydown", function(event) {
  switch (event.key) {
    case "ArrowLeft":
      player.direction = "left";
      break;
    case "ArrowRight":
      player.direction = "right";
      break;
    case " ":
      shootingSound.play(); // Play shooting sound
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 5
      });
      break;
  }
});

document.addEventListener("keyup", function(event) {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    player.direction = null;
  }
});



function updatePlayer() {
  if (player.direction === "left" && player.x > 0) {
    player.x -= player.speed;
  } else if (player.direction === "right" && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
}

function updateBullets() {
  bullets.forEach(function(bullet) {
    bullet.y -= bullet.speed;
  });
  bullets = bullets.filter(function(bullet) { return bullet.y > 0; });
}

function updateInvaders() {
  invaders.forEach(function(invader) {
    if (!invader.isDestroyed) {
      invader.x += invaderSpeed;
      if (invader.x < 0 || invader.x > canvas.width - invader.width) {
        invaderSpeed *= -1;
        invaders.forEach(function(inv) { inv.y += 20; });
      }
      checkGameOver(invader);
    }
  });
}

function checkGameOver(invader) {
  if (
    player.x < invader.x + invader.width &&
    player.x + player.width > invader.x &&
    player.y < invader.y + invader.height &&
    player.y + player.height > invader.y
  ) {
    gameOver = true;
    gameOverMessage.textContent = "Game Over - You Lose!";
    gameOverMessage.classList.add('visible'); // Show the game over message
    playAgainButton.style.display = "block"; // Show the play again button
    gameOverSound.play();
    // Check for new high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
      document.getElementById('high-score').textContent = 'High Score: ' + highScore;
    }
  }
}


function detectCollision() {
  bullets.forEach(function(bullet, bulletIndex) {
    invaders.forEach(function(invader, invaderIndex) {
      if (
        bullet.x < invader.x + invader.width &&
        bullet.x + bullet.width > invader.x &&
        bullet.y < invader.y + invader.height &&
        bullet.y + bullet.height > invader.y &&
        !invader.isDestroyed
      ) {
        targetHitSound.play(); // Play target hit sound
        invader.isDestroyed = true;
        bullets.splice(bulletIndex, 1);
        score++;
      }
    });
  });
}

// Refactored Play Again function with Sound

function playAgain() {
  if (gameOver) {
    playAgainSound.play(); // Play the "Play Again" sound

    gameOver = false;
    player.x = canvas.width / 2;
    player.y = canvas.height - 30; // Reset player position
    bullets = [];

    // Reset the invaders' positions and game state
    invaders = [];
    for (var i = 0; i < 5; i++) {
      for (var j = 0; j < 10; j++) {
        invaders.push({
          x: j * 30 + 30,
          y: i * 30 + 30,
          width: 24,
          height: 24,
          isDestroyed: false
        });
      }
     }

    score = 0;
    gameOverMessage.textContent = "";
    gameOverMessage.classList.remove('visible'); 
    var gameWinMessage = document.getElementById("game-win-message");
    gameWinMessage.classList.remove('visible'); 
    playAgainButton.style.display = "none"; 


    invaderSpeed = 1; 
    cancelAnimationFrame(animationId); 
    animationId = requestAnimationFrame(update);
  }
}


// Add an event listener to the "Play Again" button
playAgainButton.addEventListener("click", function() {
  playAgain();
});



// Animation loop
var animationId; // Variable to store the animation frame ID

function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawInvaders();
  drawScore();

  if (!gameOver) {
    updatePlayer();
    updateBullets();
    updateInvaders();
    detectCollision();
    checkWin(); // Check for the win condition

    // Store the animation frame ID for canceling
    animationId = requestAnimationFrame(update);
  }
}

// Start the initial animation frame
animationId = requestAnimationFrame(update);



// Event listeners for player control with sound
document.addEventListener("keydown", function(event) {
  switch (event.key) {
    case "ArrowLeft":
      player.direction = "left";
      break;
    case "ArrowRight":
      player.direction = "right";
      break;
    case " ":
      shootingSound.play(); // Play shooting sound
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 5
      });
      break;
  }
});

document.addEventListener("keyup", function(event) {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    player.direction = null;
  }
});

var leftButton = document.getElementById('left-button');
var shootButton = document.getElementById('shoot-button');
var rightButton = document.getElementById('right-button');

leftButton.addEventListener('touchstart', function() {
  player.direction = 'left';
});
leftButton.addEventListener('touchend', function() {
  player.direction = null;
});

// Shoot Bullet Function
function shootBullet() {
    shootingSound.play(); // Play shooting sound
    bullets.push({
        x: player.x + player.width / 2 - 2, // Center the bullet
        y: player.y,
        width: 4,
        height: 10,
        speed: 5
    });
}

// Selecting mobile control buttons from the DOM
var leftButton = document.getElementById('left-button');
var shootButton = document.getElementById('shoot-button');
var rightButton = document.getElementById('right-button');

// Touch Event Listeners for Mobile Controls
leftButton.addEventListener('touchstart', function(event) {
    event.preventDefault(); // Prevent default touch behavior
    player.direction = 'left';
});
leftButton.addEventListener('touchend', function(event) {
    event.preventDefault(); // Prevent default touch behavior
    player.direction = null;
});

shootButton.addEventListener('touchstart', function(event) {
    event.preventDefault(); // Prevent default touch behavior
    shootBullet();
});

rightButton.addEventListener('touchstart', function(event) {
    event.preventDefault(); // Prevent default touch behavior
    player.direction = 'right';
});
rightButton.addEventListener('touchend', function(event) {
    event.preventDefault(); // Prevent default touch behavior
    player.direction = null;
});

 // Update your game logic to check for the win condition
 function checkWin() {
   // Check if all invaders are destroyed (you can use a loop to check)
   var allInvadersDestroyed = invaders.every(function(invader) {
     return invader.isDestroyed;
   });

   if (allInvadersDestroyed) {
     playerWins(); // Call the playerWins function
   }
 }

 // Modify the update function to check for the win condition
 function update() {
   context.clearRect(0, 0, canvas.width, canvas.height);
   drawPlayer();
   drawBullets();
   drawInvaders();
   drawScore();

   if (!gameOver) {
     updatePlayer();
     updateBullets();
     updateInvaders();
     detectCollision();
     checkWin(); // Check for the win condition
     requestAnimationFrame(update);
   }
 }





