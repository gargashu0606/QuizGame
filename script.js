
// ========================================
// QUIZ QUESTIONS
// ========================================

const questions = [
    {
        category: "COMPUTER FUNDAMENTALS",
        question: "What does CPU stand for?",
        options: [
            "Central Processing Unit",
            "Computer Personal Unit",
            "Central Program Utility",
            "Control Processing User"
        ],
        answer: 0
    },
    {
        category: "PROGRAMMING",
        question: "Which of these is a programming language?",
        options: ["HTML", "CSS", "Python", "HTTP"],
        answer: 2
    },
    {
        category: "DATA STRUCTURES",
        question: "Which data structure follows LIFO?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        answer: 1
    },
    {
        category: "DATABASE",
        question: "What does SQL stand for?",
        options: [
            "Structured Query Language",
            "Simple Question List",
            "System Query Link",
            "Sequential Quick Language"
        ],
        answer: 0
    },
    {
        category: "WEB TECHNOLOGY",
        question: "Which language is used to style web pages?",
        options: ["Java", "C++", "CSS", "SQL"],
        answer: 2
    },
    {
        category: "OPERATING SYSTEM",
        question: "Which is an example of an operating system?",
        options: ["MySQL", "Linux", "Google Chrome", "Python"],
        answer: 1
    },
    {
        category: "NETWORKING",
        question: "What does IP stand for in networking?",
        options: [
            "Internet Process",
            "Internal Program",
            "Internet Protocol",
            "Input Port"
        ],
        answer: 2
    },
    {
        category: "OOP",
        question: "Which concept allows a class to acquire properties of another class?",
        options: [
            "Encapsulation",
            "Inheritance",
            "Polymorphism",
            "Abstraction"
        ],
        answer: 1
    },
    {
        category: "SOFTWARE ENGINEERING",
        question: "What is the full form of SDLC?",
        options: [
            "Software Development Life Cycle",
            "System Design Level Code",
            "Software Data Link Control",
            "System Development Logic Cycle"
        ],
        answer: 0
    },
    {
        category: "GENERAL KNOWLEDGE",
        question: "Which number is a prime number?",
        options: ["9", "15", "21", "13"],
        answer: 3
    }
];


// ========================================
// GLOBAL VARIABLES
// ========================================

const $ = (id) => document.getElementById(id);

let currentQuestion = 0;
let answers = Array(questions.length).fill(null);

let secondsLeft = 600;
let timerInterval = null;

let studentName = "";
let quizFinished = false;


// ========================================
// SCREEN MANAGEMENT
// ========================================

function showScreen(screenId) {

    const screens = [
        "start-screen",
        "quiz-screen",
        "result-screen"
    ];

    screens.forEach((id) => {
        $(id).classList.toggle("hidden", id !== screenId);
    });
}


// ========================================
// START QUIZ
// ========================================

function startQuiz() {

    const name = $("student-name").value.trim();

    if (!name) {
        $("name-error").textContent =
            "Please enter your name to continue.";

        $("student-name").focus();
        return;
    }

    // Save student name
    studentName = name;

    $("name-error").textContent = "";

    $("candidate-name").textContent = studentName;

    // Reset quiz data
    currentQuestion = 0;

    answers = Array(questions.length).fill(null);

    secondsLeft = 600;

    quizFinished = false;

    clearInterval(timerInterval);

    // Show quiz screen
    showScreen("quiz-screen");

    renderQuestion();

    updateTimer();

    // Start countdown timer
    timerInterval = setInterval(() => {

        secondsLeft--;

        updateTimer();

        if (secondsLeft <= 0) {
            finishQuiz();
        }

    }, 1000);
}


// ========================================
// DISPLAY QUESTION
// ========================================

function renderQuestion() {

    const q = questions[currentQuestion];

    // Update question details
    $("question-category").textContent = q.category;

    $("question-text").textContent = q.question;

    $("question-count").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    $("answered-count").textContent =
        `${answers.filter(a => a !== null).length} answered`;

    // Update progress bar
    const progress =
        ((currentQuestion + 1) / questions.length) * 100;

    $("progress-bar").style.width = `${progress}%`;

    // Clear previous options
    $("options").innerHTML = "";

    // Display options
    q.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.type = "button";

        button.className = "option";

        // Highlight selected option
        if (answers[currentQuestion] === index) {
            button.classList.add("selected");
        }

        // Create option letter
        const letter = document.createElement("span");

        letter.className = "option-letter";

        letter.textContent = String.fromCharCode(65 + index);

        // Create option text
        const optionText = document.createElement("span");

        optionText.textContent = option;

        // Add elements to button
        button.appendChild(letter);

        button.appendChild(optionText);

        // Select answer on click
        button.addEventListener("click", () => {

            answers[currentQuestion] = index;

            renderQuestion();

        });

        $("options").appendChild(button);

    });

    // Previous button
    $("prev-btn").disabled = currentQuestion === 0;

    // Next and Submit buttons
    $("next-btn").classList.toggle(
        "hidden",
        currentQuestion === questions.length - 1
    );

    $("submit-btn").classList.toggle(
        "hidden",
        currentQuestion !== questions.length - 1
    );
}


// ========================================
// TIMER FUNCTION
// ========================================

function updateTimer() {

    const mins = Math.floor(secondsLeft / 60)
        .toString()
        .padStart(2, "0");

    const secs = (secondsLeft % 60)
        .toString()
        .padStart(2, "0");

    $("timer").textContent = `${mins}:${secs}`;
}


// ========================================
// FINISH QUIZ
// ========================================

function finishQuiz() {

    // Prevent multiple submissions
    if (quizFinished) return;

    quizFinished = true;

    clearInterval(timerInterval);

    // Calculate results
    const correct = questions.reduce(
        (total, question, index) => {

            return total +
                (answers[index] === question.answer ? 1 : 0);

        },
        0
    );

    const wrong = questions.length - correct;

    const percent = Math.round(
        (correct / questions.length) * 100
    );

    // Display score
    $("score").textContent =
        `${correct}/${questions.length}`;

    $("correct-count").textContent = correct;

    $("wrong-count").textContent = wrong;

    $("percentage").textContent = `${percent}%`;

    // Display result heading
    $("result-heading").textContent =
        percent >= 70
            ? `Excellent work, ${studentName}!`
            : `Good effort, ${studentName}!`;

    // Display result message
    $("result-message").textContent =
        percent >= 70
            ? "You have a strong understanding of these topics."
            : "Keep practising. Review the topics and try again!";

    // Show result screen
    showScreen("result-screen");
}


// ========================================
// PREVIOUS QUESTION
// ========================================

$("prev-btn").addEventListener("click", () => {

    if (currentQuestion > 0) {

        currentQuestion--;

        renderQuestion();

    }

});


// ========================================
// NEXT QUESTION
// ========================================

$("next-btn").addEventListener("click", () => {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        renderQuestion();

    }

});


// ========================================
// SUBMIT QUIZ
// ========================================

$("submit-btn").addEventListener("click", () => {

    const unanswered = answers.filter(
        answer => answer === null
    ).length;

    if (unanswered > 0) {

        const confirmSubmit = confirm(
            `You have ${unanswered} unanswered question(s). Submit anyway?`
        );

        if (!confirmSubmit) {
            return;
        }

    }

    finishQuiz();

});


// ========================================
// RESTART QUIZ
// ========================================

$("restart-btn").addEventListener("click", () => {

    clearInterval(timerInterval);

    timerInterval = null;

    $("student-name").value = "";

    $("name-error").textContent = "";

    currentQuestion = 0;

    answers = Array(questions.length).fill(null);

    secondsLeft = 600;

    studentName = "";

    quizFinished = false;

    showScreen("start-screen");

});


// ========================================
// START BUTTON EVENT
// ========================================

$("start-btn").addEventListener("click", startQuiz);


// ========================================
// ENTER KEY EVENT
// ========================================

$("student-name").addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        startQuiz();

    }

});
