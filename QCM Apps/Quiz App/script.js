document.addEventListener('DOMContentLoaded', () => {
    const QuestionStatement = document.getElementById('questionStatement');
    const choiceA = document.getElementById('A');
    const choiceB = document.getElementById('B');
    const choiceC = document.getElementById('C');
    const choiceD = document.getElementById('D');
    const Timeleft = document.getElementById('timeleft');
    const Alert = document.getElementById('alert');
    const Header = document.querySelector('header') ;
    const Score = document.getElementById('score') ;
    const questionBody = document.querySelector('.Question') ;
    const FinalMessage = document.querySelector('.Terminated') ;

    let score = 0;
    let currentQuestionIndex = 0;
    let intervalId; // For question interval
    let timerId; // For timer interval
    let timerLeft = 10; // Initial time in seconds

    const QCM = [
        ['What is The Capital City of France?', 'Paris', 'Marseille', 'Lyon', 'Nice', 'A'],
        ['What is The Capital City of Germany?', 'Munich', 'Hamburg', 'Berlin', 'Cologne', 'C'],
        ['What is The Capital City of Italy?', 'Rome', 'Milan', 'Venice', 'Florence', 'A'],
        ['What is The Capital City of Spain?', 'Barcelona', 'Madrid', 'Valencia', 'Seville', 'B'],
        ['What is The Capital City of the United Kingdom?', 'London', 'Manchester', 'Birmingham', 'Liverpool', 'A'],
        ['What is The Capital City of Japan?', 'Osaka', 'Tokyo', 'Kyoto', 'Yokohama', 'B'],
        ['What is The Capital City of Canada?', 'Toronto', 'Vancouver', 'Ottawa', 'Montreal', 'C'],
        ['What is The Capital City of Australia?', 'Sydney', 'Melbourne', 'Canberra', 'Brisbane', 'C'],
        ['What is The Capital City of Brazil?', 'Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador', 'C'],
        ['What is The Capital City of Russia?', 'St. Petersburg', 'Moscow', 'Novosibirsk', 'Yekaterinburg', 'B'],
        ['What is The Capital City of India?', 'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'B'],
        ['What is The Capital City of China?', 'Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'B'],
        ['What is The Capital City of South Korea?', 'Busan', 'Seoul', 'Incheon', 'Daegu', 'B'],
        ['What is The Capital City of Egypt?', 'Alexandria', 'Cairo', 'Giza', 'Luxor', 'B'],
        ['What is The Capital City of Argentina?', 'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'A'],
        ['What is The Capital City of South Africa?', 'Cape Town', 'Pretoria', 'Johannesburg', 'Durban', 'B'],
        ['What is The Capital City of Mexico?', 'Guadalajara', 'Monterrey', 'Mexico City', 'Puebla', 'C'],
        ['What is The Capital City of Turkey?', 'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'B'],
        ['What is The Capital City of Thailand?', 'Bangkok', 'Chiang Mai', 'Phuket', 'Pattaya', 'A'],
        ['What is The Capital City of Switzerland?', 'Zurich', 'Geneva', 'Bern', 'Basel', 'C']
    ];

    function displayQuestion() {
        const currentQuestion = QCM[currentQuestionIndex];
        QuestionStatement.textContent = `${currentQuestionIndex+1}. ${currentQuestion[0]}` ;
        choiceA.textContent = currentQuestion[1];
        choiceB.textContent = currentQuestion[2];
        choiceC.textContent = currentQuestion[3];
        choiceD.textContent = currentQuestion[4];
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex >= QCM.length) {
            Header.style.display = 'none' ;
            clearInterval(intervalId);
            Score.textContent = `Your Score is ${score} over ${QCM.length}` ;
            questionBody.style.display = 'none' ;
            FinalMessage.style.display = 'flex' ;

        }
        displayQuestion();
        resetTimer(); // Reset the timer for the new question
    }

    function resetTimer() {
        timerLeft = 10; // Reset timer to 10 seconds
        Timeleft.textContent = `${timerLeft} seconds`;
        clearInterval(timerId); // Clear the existing timer
        timerId = setInterval(updateTimer, 1000); // Start a new timer
    }

    function updateTimer() {
        Timeleft.textContent = `${timerLeft} seconds`;
        if (timerLeft <= 0) {
            clearInterval(timerId); // Stop the timer
        } else {
            timerLeft--; // Decrement the timer
        }
    }

    function eraseAlert() {
        Alert.textContent = '';
    }

    function checkAnswer(selectedChoice) {
        const currentQuestion = QCM[currentQuestionIndex];
        const correctAnswer = currentQuestion[5]; // Correct answer (A, B, C, or D)

        if (selectedChoice === correctAnswer) {
            score++;
            Alert.classList.remove('red-text');
            Alert.classList.add('green-text');
            Alert.textContent = 'Correct 😊!';
        } else {
            Alert.classList.remove('green-text');
            Alert.classList.add('red-text');
            Alert.innerHTML = `Incorrect! <span class="correct-answer"> The correct answer is ${currentQuestion[1 + correctAnswer.charCodeAt(0) - 'A'.charCodeAt(0)]} </span>.`;
        }

        setTimeout(eraseAlert, 2000); // Erase the alert after 2 seconds

        // Reset the interval timer
        clearInterval(intervalId); // Stop the current interval
        setTimeout(nextQuestion,1500); // Move to the next question after a small Delay to prevent Confusion .
        intervalId = setInterval(nextQuestion, 12000); // Restart the interval with the full time
    }

    // Add event listeners to the answer choices
    choiceA.addEventListener('click', () => checkAnswer('A'));
    choiceB.addEventListener('click', () => checkAnswer('B'));
    choiceC.addEventListener('click', () => checkAnswer('C'));
    choiceD.addEventListener('click', () => checkAnswer('D'));

    // Start the quiz
    function startQuiz() {
        intervalId = setInterval(nextQuestion, 12000); // 12,000 milliseconds = 12 seconds
        displayQuestion(); // Display the first question immediately
        resetTimer(); // Start the timer for the first question
    }

    startQuiz();
});