const quizContainer = document.getElementById('quiz-container');
const resultsContainer = document.getElementById('results');
const resultsTableBody = document.querySelector('#results-table tbody');

const Score = document.getElementById('score');


const timerDisplay = document.createElement('p');

timerDisplay.id = 'timerdisplay' ; 


// const timer = document.createElement('h2') ;

let timer;
let timeLeft = 15;

let category = "any";
let difficulty = "any";
let type = "any";
let numQuestions = 10;

let quizData = [];
let score = 0;
let currentQuestionIndex = 0;

// Mapping category values to their names
const categoryMap = {
    "9": "General Knowledge",
    "10": "Entertainment: Books",
    "11": "Entertainment: Film",
    "12": "Entertainment: Music",
    "13": "Entertainment: Musicals & Theatres",
    "14": "Entertainment: Television",
    "15": "Entertainment: Video Games",
    "16": "Entertainment: Board Games",
    "17": "Science & Nature",
    "18": "Science: Computers",
    "19": "Science: Mathematics",
    "20": "Mythology",
    "21": "Sports",
    "22": "Geography",
    "23": "History",
    "24": "Politics",
    "25": "Art",
    "26": "Celebrities",
    "27": "Animals",
    "28": "Vehicles",
    "29": "Entertainment: Comics",
    "30": "Science: Gadgets",
    "31": "Entertainment: Japanese Anime & Manga",
    "32": "Entertainment: Cartoon & Animations"
};

const difficultyMap = {
    "easy": "Easy",
    "medium": "Medium",
    "hard": "Hard"
};

const typeMap = {
    "multiple": "Multiple Choice",
    "boolean": "True / False"
};

async function generateQCM() {

    resultsTableBody.innerHTML = `` ;
    resultsContainer.style.display = 'none' ;

    numQuestions = document.getElementById('numQuestions').value;
    category = document.getElementById('category').value;
    difficulty = document.getElementById('difficulty').value;
    type = document.getElementById('type').value;

    // Construct API URL dynamically
    let apiUrl = `https://opentdb.com/api.php?amount=${numQuestions}`;
    if (category !== "any") apiUrl += `&category=${category}`;
    if (difficulty !== "any") apiUrl += `&difficulty=${difficulty}`;
    if (type !== "any") apiUrl += `&type=${type}`;

    const res = await fetch(apiUrl);
    const data = await res.json();

    quizData = [] ;
    score = 0 ;
    timeLeft = 15 ;
    clearInterval(timer);

    quizData = data.results.map((q) => ({
        question: decodeURIComponent(q.question),
        options: [...q.incorrect_answers.map(decodeURIComponent), decodeURIComponent(q.correct_answer)]
            .sort(() => Math.random() - 0.5),
        correct: decodeURIComponent(q.correct_answer)
    }));

    currentQuestionIndex = 0;
    displayQuestion();
}



function displayQuestion() {

    clearInterval(timer); // Clear any previous timer

    if (currentQuestionIndex >= quizData.length) {
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        

        Score.textContent = `Score : ${score}/${numQuestions}`;

        const characteristics = document.createElement('tr');

        // Get the names instead of raw values
        const categoryName = categoryMap[category] || "Any Category";
        const difficultyName = difficultyMap[difficulty] || "Any Difficulty";
        const typeName = typeMap[type] || "Any Type";

        characteristics.innerHTML = `
        <td>${categoryName}</td>
        <td>${difficultyName}</td>
        <td>${typeName}</td>
        <td>${numQuestions}</td>
        `;

        resultsTableBody.appendChild(characteristics);

        return;
    }

    timeLeft = 15; // Reset time for the new question

    quizContainer.style.display = 'block';
    quizContainer.innerHTML = ``; 
    const q = quizData[currentQuestionIndex];
    const questionBlock = document.createElement('div');
    questionBlock.classList.add('question-block');

    quizContainer.appendChild(timerDisplay) ;

    questionBlock.innerHTML = `<h3>${currentQuestionIndex + 1}. ${q.question}</h3>`;

    q.options.forEach((option, i) => {
        const optionContainer = document.createElement('div');
        optionContainer.classList.add('option-container');
        optionContainer.innerHTML = `
            <input type="radio" name="question${currentQuestionIndex}" value="${option}" id="option${currentQuestionIndex}-${i}">
            <label for="option${currentQuestionIndex}-${i}">${option}</label>
        `;
        questionBlock.appendChild(optionContainer);
    });

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.classList.add('submit-button');
    questionBlock.appendChild(submitButton);

    quizContainer.appendChild(questionBlock);

    submitButton.addEventListener('click', nextQuestion);

    startTimer();
}


function startTimer() {
    timerDisplay.textContent = `Time Left: ${timeLeft} sec`;
    
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft} sec`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion() ;
        }
    }, 1000);
}


function nextQuestion() {
    const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);

    if (selectedOption && selectedOption.value === quizData[currentQuestionIndex].correct) {
        score++;
    }

    currentQuestionIndex++;
    displayQuestion();
}



