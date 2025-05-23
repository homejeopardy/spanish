const categories = {
    "Verb Meanings": {
        100: ["'Hablar' means this.", "What is 'to talk' or 'to speak'?"],
        200: ["'Bailar' means this.", "What is 'to dance'?"],
        300: ["'Cantar' means this.", "What is 'to sing'?"],
        400: ["'Estudiar' means this.", "What is 'to study'?"],
        500: ["'Trabajar' means this.", "What is 'to work'?"]
    },
    "Conjugation Rules": {
        100: ["This is the 'yo' ending.", "What is '-o'?"],
        200: ["This is the 'tú' ending.?", "What is '-as'?"],
        300: ["This is the 'él/ella/elle/Usted' ending.", "What is '-a'?"],
        400: ["This is the 'nosotros/as/es' ending.", "What is '-amos'?"],
        500: ["This is the 'ellos/ellas/elles/Ustedes' ending.", "What is '-an'?"]
    },
    "Translate the Sentence": {
        100: ["Translate: 'I talk a lot.'", "What is 'Hablo mucho'?"],
        200: ["Translate: 'She dances well.'", "What is 'Ella baila bien'?"],
        300: ["Translate: 'We study Spanish.'", "What is 'Estudiamos español'?"],
        400: ["Translate: 'They work on Monday.'", "What is 'Ellos trabajan en lunes'?"],
        500: ["Translate: 'Do you sing?' (informal)", "What is '¿Cantas?'"]
    },
    "Identify the Subject": {
        100: ["Who is the subject: 'Hablan en clase.'", "Who are 'they' or 'you all'?"],
        200: ["Who is the subject: 'Estudiamos mucho.'", "Who are 'we'?"],
        300: ["Who is the subject: 'Baila bien.'", "Who is 'he', 'she', 'they (singular)', or 'you (formal)'?"],
        400: ["Who is the subject: 'Cantas mal.'", "Who is 'you' (informal singular)?"],
        500: ["Who is the subject: 'Trabajo en casa.'", "Who is 'I'?"]
    },
    "Random -AR Verbs": {
        100: ["'Escuchar' means this.", "What is 'to listen'?"],
        200: ["'Mirar' means this.", "What is 'to watch' or 'to look at'?"],
        300: ["'Nadar' means this.", "What is 'to swim'?"],
        400: ["'Practicar' means this.", "What is 'to practice'?"],
        500: ["'Viajar' means this.", "What is 'to travel'?"]
    }
};

let teams = {};
let currentQuestion = null;
let currentPoints = 0;
let currentButton = null; // Stores the clicked button

document.getElementById("add-team").addEventListener("click", addTeam);
document.getElementById("start-game").addEventListener("click", startGame);

function addTeam() {
    const teamInputs = document.getElementById("team-inputs");
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Team Name";
    teamInputs.appendChild(input);
}

function startGame() {
    const teamInputs = document.querySelectorAll("#team-inputs input");
    if (teamInputs.length === 0) return;

    teams = {};
    const teamSelect = document.getElementById("team-select");
    teamSelect.innerHTML = "";
    document.getElementById("scores").innerHTML = "";

    teamInputs.forEach(input => {
        if (input.value.trim() !== "") {
            const name = input.value.trim();
            teams[name] = 0;

            const scoreDiv = document.createElement("div");
            scoreDiv.className = "team";
            scoreDiv.id = `team-${name}`;
            scoreDiv.innerText = `${name}: $0`;
            document.getElementById("scores").appendChild(scoreDiv);

            const option = document.createElement("option");
            option.value = name;
            option.innerText = name;
            teamSelect.appendChild(option);
        }
    });

    document.getElementById("setup").style.display = "none";
    document.getElementById("game").style.display = "block";
    generateBoard();
}

function generateBoard() {
    const board = document.getElementById("jeopardy-board");
    board.innerHTML = '';

    Object.keys(categories).forEach(category => {
        let header = document.createElement("div");
        header.className = "category";
        header.innerText = category;
        board.appendChild(header);
    });

    for (let points of [100, 200, 300, 400, 500]) {
        Object.keys(categories).forEach(category => {
            let button = document.createElement("button");
            button.className = "question";
            button.innerText = `$${points}`;
            button.setAttribute("data-category", category);
            button.setAttribute("data-points", points);
            button.onclick = showQuestion;
            board.appendChild(button);
        });
    }
}

function showQuestion(event) {
    currentButton = event.target; // Store the clicked button
    const category = currentButton.getAttribute("data-category");
    const points = parseInt(currentButton.getAttribute("data-points"));

    currentQuestion = category;
    currentPoints = points;

    // Play the Jeopardy theme song
    const jeopardyTheme = document.getElementById("jeopardy-theme");
    jeopardyTheme.play();

    document.getElementById("question-text").innerText = categories[category][points][0];
    document.getElementById("popup").style.display = "block";
}

function showAnswer() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("answer-text").innerText = categories[currentQuestion][currentPoints][1];
    document.getElementById("answer-popup").style.display = "block";

    // Stop the Jeopardy theme song
    const jeopardyTheme = document.getElementById("jeopardy-theme");
    jeopardyTheme.pause();
    jeopardyTheme.currentTime = 0; // Reset audio to start
}

function updateScore(correct) {
    const team = document.getElementById("team-select").value;
    teams[team] += correct ? currentPoints : -currentPoints;
    document.getElementById(`team-${team}`).innerText = `${team}: $${teams[team]}`;

    // Close the answer pop-up after scoring
    document.getElementById("answer-popup").style.display = "none";

    // Disable the button permanently after the question has been answered
    if (currentButton) {
        currentButton.disabled = true;
        currentButton.style.backgroundColor = "#222"; // Change to a "used" style
        currentButton.style.cursor = "not-allowed";
    }
}
