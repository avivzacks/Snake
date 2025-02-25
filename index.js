// קבלת אלמנטים מה-HTML
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startBtn");
const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const settingsScreen = document.getElementById("settingsScreen");
const settingsButton = document.getElementById("settingsBtn");
const backButton = document.getElementById("backBtn");
const levelButtons = document.querySelectorAll(".level");

// הגדרות ברירת מחדל
let box = 25;  // גודל הקוביה של הנחש
let speed = 100; // זמן בין כל מהלך של הנחש
let level = 1; // שלב התחלתי
let foodEaten = 0; // כמות האוכל שנאכלה
let requiredFood = 10; // כמות האוכל הנדרשת לעבור לשלב הבא
let score = 0;
let bestScores = {}; // אובייקט לשמור את ה-best score עבור כל שלב
let unlockedLevels = [1]; // רשימה של השלבים הפתוחים
let snake = [{ x: 9 * box, y: 10 * box }];
let food = generateFood();
let direction = "RIGHT";
let game;
// Add countdown variables
let countdownTimer;
let countdownValue = 3; // Start with 3 seconds countdown
let isCountingDown = false;

// פונקציה לאתחול המשחק בהתאם לשלב
function initGame(selectedLevel) {
    level = selectedLevel;
    canvas.width = 600 - (level - 1) * 50;
    canvas.height = 600 - (level - 1) * 50;
    snake = [{ x: 9 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    foodEaten = 0;
    requiredFood = 10;
    food = generateFood();
    
    // Start countdown instead of starting the game immediately
    startCountdown();
}

// Add a new function for the countdown
function startCountdown() {
    isCountingDown = true;
    countdownValue = 3;
    
    // Clear any existing game interval
    if (game) {
        clearInterval(game);
    }
    
    // Draw the initial countdown
    drawCountdown();
    
    // Set up the countdown timer
    countdownTimer = setInterval(function() {
        countdownValue--;
        
        if (countdownValue <= 0) {
            // Countdown finished, start the game
            clearInterval(countdownTimer);
            isCountingDown = false;
            game = setInterval(draw, speed);
        } else {
            // Continue countdown
            drawCountdown();
        }
    }, 1000);
}

// Add a function to draw the countdown
function drawCountdown() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw level information
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Level " + level, canvas.width / 2, canvas.height / 3);
    
    // Draw countdown number
    ctx.fillStyle = "red";
    ctx.font = "80px Arial";
    ctx.fillText(countdownValue, canvas.width / 2, canvas.height / 2);
    
    // Draw "Get Ready!" text
    ctx.fillStyle = "black";
    ctx.font = "25px Arial";
    ctx.fillText("Get Ready!", canvas.width / 2, canvas.height * 2/3);
}

// הפעלת מסך הבית עם בחירת שלבים
levelButtons.forEach(button => {
    button.addEventListener("click", function () {
        if (!button.disabled) {
            homeScreen.style.display = "none";
            gameScreen.style.display = "block";
            initGame(parseInt(button.id.replace("level", "")));
        }
    });
});

// שמירה וקריאה של ה-best score מכל שלב ב-localStorage
function loadGameData() {
    const storedScores = localStorage.getItem("bestScores");
    if (storedScores) {
        bestScores = JSON.parse(storedScores);
    }

    const storedLevels = localStorage.getItem("unlockedLevels");
    if (storedLevels) {
        unlockedLevels = JSON.parse(storedLevels);
    }
}

function saveGameData() {
    localStorage.setItem("bestScores", JSON.stringify(bestScores));
    localStorage.setItem("unlockedLevels", JSON.stringify(unlockedLevels));
}

// עדכון מצב של שלבים
function updateLevelButtons() {
    levelButtons.forEach(button => {
        let levelNum = parseInt(button.id.replace("level", ""));
        if (unlockedLevels.includes(levelNum)) {
            button.classList.add("unlocked");
            button.disabled = false;
            button.style.backgroundColor = "green";
        } else {
            button.classList.remove("unlocked");
            button.disabled = true;
            button.style.backgroundColor = "gray";
        }
    });
}

function chooselevel() {
 
}

// פונקציה לציור הנחש עם עיניים
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        // Draw snake body parts
        ctx.fillStyle = i === 0 ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        
        // Draw eyes on the head (first segment)
        if (i === 0) {
            // Eye positions based on direction
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
            
            // Set eye positions based on direction
            switch(direction) {
                case "RIGHT":
                    // Eyes on the right side of the head
                    leftEyeX = snake[0].x + box * 0.7;
                    leftEyeY = snake[0].y + box * 0.3;
                    rightEyeX = snake[0].x + box * 0.7;
                    rightEyeY = snake[0].y + box * 0.7;
                    break;
                case "LEFT":
                    // Eyes on the left side of the head
                    leftEyeX = snake[0].x + box * 0.3;
                    leftEyeY = snake[0].y + box * 0.3;
                    rightEyeX = snake[0].x + box * 0.3;
                    rightEyeY = snake[0].y + box * 0.7;
                    break;
                case "UP":
                    // Eyes on the top of the head
                    leftEyeX = snake[0].x + box * 0.3;
                    leftEyeY = snake[0].y + box * 0.3;
                    rightEyeX = snake[0].x + box * 0.7;
                    rightEyeY = snake[0].y + box * 0.3;
                    break;
                case "DOWN":
                    // Eyes on the bottom of the head
                    leftEyeX = snake[0].x + box * 0.3;
                    leftEyeY = snake[0].y + box * 0.7;
                    rightEyeX = snake[0].x + box * 0.7;
                    rightEyeY = snake[0].y + box * 0.7;
                    break;
            }
            
            // Draw the eyes
            ctx.fillStyle = "black";
            const eyeRadius = box * 0.1; // Eye size relative to box size
            
            // Left eye
            ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Right eye
            ctx.beginPath();
            ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// פונקציה לציור האוכל
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

// פונקציה לעדכון התוצאה
function updateScore() {
    score += 1; // כל פעם שהנחש אוכל אוכל, הניקוד עולה ב-1
}

// פונקציה לציור התוצאה
function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, box, box);  // הצגת הניקוד בצד העליון של המסך
}

// פונקציה לציור הודעת Game Over
function drawGameOver() {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("GAME OVER", canvas.width / 4, canvas.height / 2 - 20); // כותרת אדומה
    ctx.font = "20px Arial";
    ctx.fillText("Your Score: " + score, canvas.width / 3, canvas.height / 2 + 20);
    ctx.fillText("Your Best Score: " + (bestScores[level] || 0), canvas.width / 3, canvas.height / 2 + 50);
    
    // הוספת כפתור חזרה למסך הבית
    const backToMenuButton = document.createElement("button");
    backToMenuButton.textContent = "Back to Menu";
    backToMenuButton.style.position = "absolute";
    backToMenuButton.style.top = "60%"; // מיקום הכפתור במסך
    backToMenuButton.style.left = "40%";
    backToMenuButton.style.padding = "10px 20px";
    backToMenuButton.style.fontSize = "18px";
    backToMenuButton.style.backgroundColor = "#4CAF50";
    backToMenuButton.style.color = "white";
    backToMenuButton.style.border = "none";
    backToMenuButton.style.cursor = "pointer";
    
    document.body.appendChild(backToMenuButton); // הוספת הכפתור לדף

    // כפתור לחזרה למסך הבית
    backToMenuButton.addEventListener("click", function() {
        window.location.reload(); // נטען מחדש את הדף (חזרה למסך הבית)
    });
}

// פונקציה להזיז את הנחש
function moveSnake() {
    let newHead = { ...snake[0] };

    if (direction === "LEFT") newHead.x -= box;
    if (direction === "RIGHT") newHead.x += box;
    if (direction === "UP") newHead.y -= box;
    if (direction === "DOWN") newHead.y += box;

    snake.unshift(newHead);

    // אם הנחש אוכל את האוכל
    if (newHead.x === food.x && newHead.y === food.y) {
        foodEaten++;
        updateScore(); // עדכון הניקוד ברגע שהנחש אוכל אוכל

        if (foodEaten >= requiredFood) {
            if (score > (bestScores[level] || 0)) {
                bestScores[level] = score; // עדכון ה-best score עבור השלב הנוכחי
                saveGameData(); // שמירה ב-localStorage
            }
            alert("Congratulations! You've completed level " + level);
            unlockedLevels.push(level + 1); // פתיחת השלב הבא
            saveGameData();
            level++;
            updateLevelButtons();
            requiredFood += 10; // עלייה בכמות האוכל לכל שלב
            
            // Start the next level with countdown
            clearInterval(game);
            initGame(level);
        }
        food = generateFood();  // יצירת אוכל חדש
    } else {
        snake.pop();  // אם לא אכל אוכל, הסר את הזנב של הנחש
    }
}
//change 2
// פונקציה ליצירת אוכל
function generateFood() {
    // Calculate the maximum grid positions based on current canvas size
    const maxX = Math.floor(canvas.width / box) - 1;
    const maxY = Math.floor(canvas.height / box) - 1;
    
    return {
        x: Math.floor(Math.random() * maxX + 1) * box,
        y: Math.floor(Math.random() * maxY + 1) * box
    };
}

// פונקציה לבדוק אם המשחק נגמר
function gameOver() {
    if (
        snake[0].x < 0 ||
        snake[0].x >= canvas.width ||
        snake[0].y < 0 ||
        snake[0].y >= canvas.height ||
        collision(snake[0], snake.slice(1))
    ) {
        // עדכון הניקוד השיא אם הניקוד הנוכחי גבוה
        if (score > (bestScores[level] || 0)) {
            bestScores[level] = score;
            saveGameData(); // שמירה ב-localStorage
            
        }
        clearInterval(game);
        drawGameOver();  // הצגת הודעת "Game Over" כולל כפתור חזרה למסך הבית
    }
}

// פונקציה לבדוק אם הנחש פוגע בעצמו
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// פונקציה לעדכון כיוון
document.addEventListener("keydown", directionChange);

function directionChange(event) {
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT";
    if (event.keyCode === 38 && direction !== "DOWN") direction = "UP";
    if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT";
    if (event.keyCode === 40 && direction !== "UP") direction = "DOWN";
}

// פונקציה לציור הכל
function draw() {
    if (isCountingDown) {
        return; // Don't proceed with game drawing if we're counting down
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawScore();
    moveSnake();
    gameOver();
}

// Modify the startButton event listener to use the countdown
startButton.addEventListener("click", function () {
    homeScreen.style.display = "none";
    gameScreen.style.display = "block";
    canvas.width = 600;
    canvas.height = 600;
    
    // Start countdown instead of starting the game immediately
    startCountdown();
});

// קריאת הנתונים
loadGameData();

// עדכון מצב שלבים
updateLevelButtons(); // עדכון מצב שלבים

// פונקציה לעבור למסך הגדרות
settingsButton.addEventListener("click", function() {
    homeScreen.style.display = "none";  // הסתרת מסך הבית
    settingsScreen.style.display = "block"; // הצגת מסך הגדרות
});

// פונקציה לחזור למסך הבית
backButton.addEventListener("click", function() {
    settingsScreen.style.display = "none";  // הסתרת מסך הגדרות
    homeScreen.style.display = "block"; // הצגת מסך הבית
});