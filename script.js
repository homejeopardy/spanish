const categories = {
    "School History": {
        100: ["In what year was Black Pine Circle School founded?", "What is 1973?"],
        200: ["Black Pine Circle School was originally founded in which city?", "What is Berkeley?"],
        300: ["This method of inquiry-based discussion is a cornerstone of BPC’s education.", "What is the Socratic method?"],
        400: ["The founders were inspired to start the school while camping in this mountain range.", "What are the Sierras?"],
        500: ["This was the first grade level taught when BPC opened.", "What is Kindergarten?"]
    },
    "School Life": {
        100: ["This daily gathering builds community and starts the day at BPC.", "What is Morning Circle?"],
        200: ["Students once raised these animals in a coop they helped build.", "What are chickens?"],
        300: ["This special celebration honors the school's founding and traditions.", "What is Founders Day?"],
        400: ["Each spring, middle schoolers present this major project blending research and public speaking.", "What is the Capstone Project?"],
        500: ["BPC celebrates Halloween with this fun tradition.", "What is a costume parade or contest?"]
    },
    "The Arts": {
        100: ["Students perform musicals and plays on this stage area.", "What is the drama stage?"],
        200: ["The middle school jazz ensemble performs pieces from this genre.", "What is jazz?"],
        300: ["This club helps students hone their storytelling and narrative skills.", "What is the creative writing club?"],
        400: ["Art classes at BPC often focus on this form of visual creativity.", "What is visual art?"],
        500: ["This bowed string instrument is taught and performed in school ensembles.", "What is the violin?"]
    },
    "Faculty & Staff": {
        100: ["This person is Head of School as of 2025.", "Who is John Carlstroem?"],
        200: ["This language teacher also works as a translator for young adult books.", "Who is Aïda Garcia-Pons?"],
        300: ["This math teacher and coach studied economics before switching careers.", "Who is Dan Hughes?"],
        400: ["The school counselor leads lessons and programs focused on this area of student well-being.", "What is social-emotional learning?"],
        500: ["Teachers frequently use this method of guided questioning in discussions.", "What is the Socratic method?"]
    },
    "School Facts": {
        100: ["As of 2025, this is the approximate number of students at BPC.", "What is 330?"],
        200: ["BPC serves students in this grade range.", "What are Kindergarten through 8th grade?"],
        300: ["This percentage of students receive financial aid.", "What is 28%?"],
        400: ["The average financial aid award is around this amount.", "What is $18,000?"],
        500: ["BPC has this many separate campuses as of 2025.", "What is two?"]
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
