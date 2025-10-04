//Go full screen of exit full screen functionality
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    document.getElementById('fullscreenBtn').innerHTML = '<img id="myImage" src="https://sciencelesson.in/images/exit-fullscreen.svg" alt="New Image">'
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.getElementById('fullscreenBtn').innerHTML = '<img id="myImage" src="https://sciencelesson.in/images/Go-full-screen.svg" alt="New Image">';
        document.exitFullscreen();
    }
});

let time = 3 * 60 * 60; // 3 minutes in seconds
const timerElement = document.getElementById("timer");
const startButton = document.getElementById("startTestBtn");
const startDiv = document.getElementById("startTestDiv");

let timerInterval; // To store interval reference
let endTime; // To store end time

function updateTimer() {
    const now = Date.now();
    const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000)); // Prevent negative values

    let hours = Math.floor(remainingTime / 3600);
    let minutes = Math.floor((remainingTime % 3600) / 60);
    let seconds = remainingTime % 60;

    timerElement.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        alert("Time's up!");
        submitTest();
    }
}

startButton.addEventListener("click", () => {
    // Prevent multiple timers
    if (timerInterval) return;

    // Set start & end time dynamically on click
    const startTime = Date.now();
    endTime = startTime + time * 1000;

    // Start interval
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Call immediately to prevent 1-sec delay

    // Hide start instructions
    startDiv.style.display = "none";

    // Optional: Hide overlay if it exists
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "none";
});


// Clear response functionality
function clearResponse(questionId) {
    const options = document.getElementsByName(questionId);
    options.forEach(option => option.checked = false);
    document.getElementById(`qbox${questionId.slice(1)}`).classList.remove('answered');

    updateAnswerCounter();
}

function markForReview(questionId) {
    document.getElementById(`qbox${questionId.slice(1)}`).classList.toggle('markForReview');
    updateRevCounter();

    const revElement = document.getElementById(`rev${questionId.slice(1)}`);
    if (revElement) {
        revElement.classList.toggle('revMarked');
    }

    if (questionId.slice(1) <= 45) {
        document.getElementById('physicsButton').click();
    } else if (questionId.slice(1) >= 46 && questionId.slice(1) <= 90) {
        document.getElementById('chemistryButton').click();
    } else if (questionId.slice(1) >= 91 && questionId.slice(1) <= 135) {
        document.getElementById('botanyButton').click();
    } else if (questionId.slice(1) >= 136 && questionId.slice(1) <= 180) {
        document.getElementById('zoologyButton').click();
    }
    
}

function updateRevCounter() {
    const quesMarkedForRev = document.querySelectorAll('.markForReview');
    const revCounter = quesMarkedForRev.length;
    document.getElementById("revCounter").textContent = revCounter;
}

function updateAnswerCounter() {
    // Select all question divs with the class 'answered'
    const answeredQuestions = document.querySelectorAll('.answered');

    // Get the total count of answered questions
    const answeredCount = answeredQuestions.length;

    const notAnsweredCount = 180 - answeredCount;
    // Select the answerCounter div
    const answerCounterDiv = document.getElementById('answerCounter');

    document.getElementById("notAnsweredCounter").textContent = notAnsweredCount;

    // Update the content of the answerCounter div with the count
    answerCounterDiv.textContent = answeredCount;
}


const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const cancelSubmit = document.getElementById('cancelSubmit');
const atmToSubmit = document.getElementById('atmToSubmit');

atmToSubmit.addEventListener("click", function (event) {
    overlay.style.display = 'block';
    popup.style.display = 'flex';
})

document.getElementById("atmToSubmit2").addEventListener('click', function (event) {
    overlay.style.display = 'block';
    popup.style.display = 'flex';
})
cancelSubmit.addEventListener('click', function (event) {
    overlay.style.display = 'none';
    popup.style.display = 'none';
})

// Form submission and result calculation
function submitTest() {
    clearInterval(timerInterval);
    document.getElementById('fullscreen7').style.marginLeft = '70px';
    const form = document.getElementById('testForm');
    const formData = new FormData(form);
    let score = 0;


    // Questions in Section B
    const sectionBQuestions = {
        physics: ['q36', 'q37', 'q38', 'q39', 'q40', 'q41', 'q42', 'q43', 'q44', 'q45', 'q46', 'q47', 'q48', 'q49', 'q50'],
        chemistry: ['q86', 'q87', 'q88', 'q89', 'q90', 'q91', 'q92', 'q93', 'q94', 'q95', 'q96', 'q97', 'q98', 'q99', 'q100'],
        biology: ['q136', 'q137', 'q138', 'q139', 'q140', 'q141', 'q142', 'q143', 'q144', 'q145', 'q146', 'q147', 'q148', 'q149', 'q150'],
        zoology: ['q186', 'q187', 'q188', 'q189', 'q190', 'q191', 'q192', 'q193', 'q194', 'q195', 'q196', 'q197', 'q198', 'q199', 'q200']
    };

    // Iterate over all form entries and calculate score for Section A
    for (let [name, value] of formData.entries()) {
        if (name in correctAnswers && !isInSectionB(name)) {
            if (correctAnswers[name] === value) {
                score += 4;
            } else {
                score -= 1;
            }
        }
    }

    // Handle Section B logic
    for (let section in sectionBQuestions) {
        let attempts = 0;
        for (let question of sectionBQuestions[section]) {
            if (formData.has(question)) {
                if (correctAnswers[question] === formData.get(question)) {
                    score += 4;
                } else {
                    score -= 1;
                }
                attempts++;
                if (attempts >= 10) break;
            }
        }
    }

    //hides clear response button when answer is submitted
    const clrresp = document.querySelectorAll('.qButton').forEach(button => {
        button.style.display = 'none';
    });

    timerElement.style.display = 'none';

    const resultDiv = document.getElementById('result');
    resultDiv.textContent = ` ${score} / 720`;
    resultDiv.style.display = 'block';

    document.getElementById('submitBtn').style.display = 'none';
    document.getElementById('atmToSubmit2').style.display = 'none';

    popup.style.display = 'none';
    overlay.style.display = 'none';
    atmToSubmit.style.display = 'none';
    // clrresp.style.display = 'none'
    // clrresp.forEach(button => {
    //     button.style.display = 'none';
    // });

    const radioInputs = document.querySelectorAll('input[type="radio"]');

    // Iterate over each radio input and disable it
    radioInputs.forEach(radio => {
        radio.disabled = true;
    });
    const scoreCard = document.getElementById('scoreCard');
    scoreCard.style.display = 'flex';
    overlay.style.display = 'block';


    const elements = document.querySelectorAll('.ansDisp');
    for (let i = 0; i < 180; i++) {
        elements[i].style.display = 'block';
    }

    // Rank Prediction for NEET 2025
const rankMapping = [
    { score: 686, RankMsg: "<b>Your rank prediction is 1 - 73.</b><br>Your preparation is Excellent." },  // for score 686-720 (adjusted for 2025 max)
    { score: 682, RankMsg: "<b>Your rank prediction is 74 - 100.</b><br>Great work! You're close to the top." }, // approx for high 680s
    { score: 678, RankMsg: "<b>Your rank prediction is 100 - 200.</b><br>You're doing very well! Keep pushing." },
    { score: 650, RankMsg: "<b>You can reach the top. Your rank prediction is 200 - 1259.</b><br>Good job! With a bit more effort." },
    { score: 622, RankMsg: "<b>Your rank prediction is 412 - 845.</b><br>You're on the right track." },
    { score: 607, RankMsg: "<b>Your rank prediction is 981 - 3246.</b><br>Solid performance! Keep working on your weak areas." },
    { score: 600, RankMsg: "<b>Your rank prediction is 1260 - 5602.</b><br>You're doing well, but there's room for improvement." }, // split for granularity
    { score: 569, RankMsg: "<b>Your rank prediction is 5603 - 10658.</b><br>Stay focused and keep practicing." },
    { score: 550, RankMsg: "<b>Your rank prediction is 10659 - 17369.</b><br>Keep up the hard work!" },
    { score: 540, RankMsg: "<b>Your rank prediction is 17370 - 25541.</b><br>You're making progress, continue the effort." },
    { score: 525, RankMsg: "<b>Your rank prediction is 27698 - 36843.</b><br>Keep pushing, you're close!" },
    { score: 515, RankMsg: "<b>Your rank prediction is 36843 - 39521.</b><br>Stay motivated and practice more." },
    { score: 500, RankMsg: "<b>Your rank prediction is 39522 - 69503.</b><br>You're improving, keep it up!" },
    { score: 478, RankMsg: "<b>Your rank prediction is 69504 - 80336.</b><br>Keep practicing and you'll see better results." },
    { score: 450, RankMsg: "<b>Your rank prediction is 80336 - 107944.</b><br>You're on the right path, keep going." }, // combined for mid-range
    { score: 435, RankMsg: "<b>Your rank prediction is 107944 - 146846.</b><br>Don't lose hope, keep practicing." },
    { score: 400, RankMsg: "<b>Your rank prediction is 146846 - 206050.</b><br>You can improve with more focused preparation." },
    { score: 398, RankMsg: "<b>Your rank prediction is 206050 - 213371.</b><br>Stay determined, you can do it!" },
    { score: 350, RankMsg: "<b>Your rank prediction is 213371 - 303040.</b><br>Keep going, and don't give up." }, // broader for lower
    { score: 300, RankMsg: "<b>Your rank prediction is 303040 - 436777.</b><br>Focus on strengthening your weak areas." },
    { score: 257, RankMsg: "<b>Your rank prediction is 436777 - 577330.</b><br>You're doing well, but there's room for growth." },
    { score: 250, RankMsg: "<b>Your rank prediction is 577330 - 684232.</b><br>You're on your way! Stay focused and consistent." },
    { score: 200, RankMsg: "<b>Your rank prediction is 684232 - 937041.</b><br>With more practice, you can achieve a better rank." },
    { score: 172, RankMsg: "<b>Your rank prediction is 937041 - 1152192.</b><br>Keep working hard, and you'll improve." },
    { score: 104, RankMsg: "<b>Your rank prediction is 1152192 - 1391647.</b><br>Don't get discouraged, keep practicing." },
    { score: 69, RankMsg: "<b>Your rank prediction is 1391647 - 1717603.</b><br>Stay positive and keep trying." },
    { score: 35, RankMsg: "<b>Your rank prediction is 1717603 - 2035851.</b><br>You're making progress, but you need more effort." },
    { score: -Infinity, RankMsg: "<b>Your rank prediction is 2035851+.</b><br>Don't worry, you can improve with more practice." }
];

    let rankPrediction = rankMapping.find(range => score >= range.score).RankMsg;

    document.getElementById("rankPrediction").innerHTML = rankPrediction;
    document.getElementById("rankPrediction2").innerHTML = rankPrediction;

    // document.getElementById('questionNavContainerScore').innerHTML = `<h2> Score: ${score} </h2>`;


    // Initialize counters
    let phyCorrect = 0, phyIncorrect = 0;
    let chemCorrect = 0, chemIncorrect = 0;
    let noOfBotCor = 0, botIncorrect = 0;
    let zooCorrect = 0, zooIncorrect = 0;

    // Loop through all 200 questions
    for (let i = 1; i <= 180; i++) {
        const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
        if (selectedOption) {
            let answeredQBox = document.getElementById(`qbox${i}`);
            answeredQBox.classList.remove("answered");
            if (selectedOption.value === correctAnswers[`q${i}`]) {
                document.getElementById(`question${i}`).classList.add("answeredCorrect");
                answeredQBox.classList.add('rightQBox');
                // Increment correct answer counters
                if (i <= 45) phyCorrect++;
                else if (i <= 90) chemCorrect++;
                else if (i <= 135) noOfBotCor++;
                else if (i <= 180) zooCorrect++;
            } else {
                document.getElementById(`question${i}`).classList.add("answeredWrong");
                answeredQBox.classList.add("wrongQBox");

                // Increment incorrect answer counters
                if (i <= 45) phyIncorrect++;
                else if (i <= 90) chemIncorrect++;
                else if (i <= 135) botIncorrect++;
                else if (i <= 180) zooIncorrect++;
            }
        }
    }

    // Calculate total attempts and skipped questions for each subject
    const phyAttempted = phyCorrect + phyIncorrect;
    const chemAttempted = chemCorrect + chemIncorrect;
    const botAttempted = noOfBotCor + botIncorrect;
    const zooAttempted = zooCorrect + zooIncorrect;

    const phySkipped = 45 - phyAttempted;
    const chemSkipped = 45 - chemAttempted;
    const botSkipped = 45 - botAttempted;
    const zooSkipped = 45 - zooAttempted;

    // Accuracy calculation
    const calcAccuracy = (correct, attempted) => {
        return attempted > 0 ? ((correct / attempted) * 100).toFixed(1) + '%' : '0%';
    };

    // Populate Performance Summary
    document.getElementById('phyCorrect').innerText = phyCorrect;
    document.getElementById('phyIncorrect').innerText = phyIncorrect;
    document.getElementById('phyAttempted').innerText = phyAttempted;
    document.getElementById('phySkipped').innerText = phySkipped;
    document.getElementById('phyAccuracy').innerText = calcAccuracy(phyCorrect, phyAttempted);

    document.getElementById('chemCorrect').innerText = chemCorrect;
    document.getElementById('chemIncorrect').innerText = chemIncorrect;
    document.getElementById('chemAttempted').innerText = chemAttempted;
    document.getElementById('chemSkipped').innerText = chemSkipped;
    document.getElementById('chemAccuracy').innerText = calcAccuracy(chemCorrect, chemAttempted);

    document.getElementById('botCorrect').innerText = noOfBotCor;
    document.getElementById('botIncorrect').innerText = botIncorrect;
    document.getElementById('botAttempted').innerText = botAttempted;
    document.getElementById('botSkipped').innerText = botSkipped;
    document.getElementById('botAccuracy').innerText = calcAccuracy(noOfBotCor, botAttempted);

    document.getElementById('zooCorrect').innerText = zooCorrect;
    document.getElementById('zooIncorrect').innerText = zooIncorrect;
    document.getElementById('zooAttempted').innerText = zooAttempted;
    document.getElementById('zooSkipped').innerText = zooSkipped;
    document.getElementById('zooAccuracy').innerText = calcAccuracy(zooCorrect, zooAttempted);

    // Overall Score
    document.getElementById('totalScore').innerText = score;
    document.getElementById('totalAttempts').innerText = phyAttempted + chemAttempted + botAttempted + zooAttempted;
    document.getElementById('totalSkipped').innerText = phySkipped + chemSkipped + botSkipped + zooSkipped;
    document.getElementById('totalCorrect').innerText = noOfBotCor + phyCorrect + chemCorrect + zooCorrect;
    document.getElementById('totalWrong').innerText = textContent = phyIncorrect + chemIncorrect + botIncorrect + zooIncorrect;

    // Time taken calculation
    timeTaken = 180 * 60 - time;
    let minutes = Math.floor(timeTaken / 60);
    let seconds = timeTaken % 60;
    let timeTakenDisplay = `${minutes} minutes, ${seconds} seconds`;
    document.getElementById("timeTaken").innerHTML = timeTakenDisplay;

    let avgTimePerQuestion = timeTaken / (phyAttempted + chemAttempted + botAttempted + zooAttempted);
    document.getElementById("averageTimeTaken").textContent = `${avgTimePerQuestion.toFixed(1)} Seconds`;

    document.getElementById('navSubAnsCounter').style.display = 'none';
    document.getElementById('navWrongCounter').style.display = 'flex';
    document.getElementById('navRightCounter').style.display = 'flex';
    document.getElementById('wrongAnsweredCounter').textContent = phyIncorrect + chemIncorrect + botIncorrect + zooIncorrect;
    document.getElementById('rightAnsweredCounter').textContent = noOfBotCor + phyCorrect + chemCorrect + zooCorrect;


    resultSummery.style.display = 'block';
    
    
    const explanationDivs = document.querySelectorAll(".explanation");
    explanationDivs.forEach(elements =>{
        elements.style.display = "block";
    })
}

document.getElementById('questionNavContainerScore').addEventListener('click', function() {
    const resultSummery = document.getElementById('resultSummery');
    
    // Scroll smoothly to the resultSummery div
    resultSummery.scrollIntoView({
        behavior: 'smooth'  // Enables smooth scrolling
    });
});


// Helper function to check if a question is in Section B
function isInSectionB(questionId) {
    const sectionBQuestions = [].concat(
        ['q36', 'q37', 'q38', 'q39', 'q40', 'q41', 'q42', 'q43', 'q44', 'q45', 'q46', 'q47', 'q48', 'q49', 'q50'],
        ['q86', 'q87', 'q88', 'q89', 'q90', 'q91', 'q92', 'q93', 'q94', 'q95', 'q96', 'q97', 'q98', 'q99', 'q100'],
        ['q136', 'q137', 'q138', 'q139', 'q140', 'q141', 'q142', 'q143', 'q144', 'q145', 'q146', 'q147', 'q148', 'q149', 'q150'],
        ['q186', 'q187', 'q188', 'q189', 'q190', 'q191', 'q192', 'q193', 'q194', 'q195', 'q196', 'q197', 'q198', 'q199', 'q200']
    );

    return sectionBQuestions.includes(questionId);
}

// Scroll to the specified question
// function scrollToQuestion(questionNumber) {
//     const questionElement = document.getElementById(`question${questionNumber}`);
//     questionElement.scrollIntoView({ behavior: 'smooth' });
// }
// Scroll to the specified question with an offset
function scrollToQuestion(questionNumber) {
    const questionElement = document.getElementById(`question${questionNumber}`);
    const offsetPosition = questionElement.getBoundingClientRect().top + window.scrollY - 50;
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}


// Mark a question as answered
function markAnswered(questionNumber) {
    const qBoxElement = document.getElementById(`qbox${questionNumber}`);
    qBoxElement.classList.add('answered');
    if (questionNumber <= 45) {
        document.getElementById('physicsButton').click();
    } else if (questionNumber >= 46 && questionNumber <= 90) {
        document.getElementById('chemistryButton').click();
    } else if (questionNumber >= 91 && questionNumber <= 135) {
        document.getElementById('botanyButton').click();
    } else if (questionNumber >= 136 && questionNumber <= 180) {
        document.getElementById('zoologyButton').click();
    }
    
    updateAnswerCounter();
}

// const physicsTab = document.getElementById("physicsTab");

// const chemistryTab = document.getElementById("chemistryTab");

// const zoologyTab = document.getElementById("zoologyTab");

// const botanyTab = document.getElementById("botanyTab");

const physicsButton = document.getElementById("physicsButton");

const chemistryButton = document.getElementById("chemistryButton");

const zoologyButton = document.getElementById("zoologyButton");

const botanyButton = document.getElementById("botanyButton");
const navSubject = document.getElementsByClassName("navSubject");
physicsButton.addEventListener("click", function (event) {
    physicsTab.style.display = "flex";
    chemistryTab.style.display = "none";
    zoologyTab.style.display = "none";
    botanyTab.style.display = "none";
})

chemistryButton.addEventListener("click", function (event) {
    physicsTab.style.display = "none";
    chemistryTab.style.display = "flex";
    zoologyTab.style.display = "none";
    botanyTab.style.display = "none";
})

zoologyButton.addEventListener("click", function (event) {
    physicsTab.style.display = "none";
    chemistryTab.style.display = "none";
    zoologyTab.style.display = "flex";
    botanyTab.style.display = "none";
})

botanyButton.addEventListener("click", function (event) {
    physicsTab.style.display = "none";
    chemistryTab.style.display = "none";
    zoologyTab.style.display = "none";
    botanyTab.style.display = "flex";
})

const menuButton = document.getElementById("menuButton");
const navSubOpen = document.getElementById("navSubOpen");
const navSubClose = document.getElementById("navSubClose");
const questionNavContainer = document.getElementById("questionNavContainer");

navSubOpen.addEventListener("click", function (event) {
    navSubClose.style.display = "flex";
    navSubOpen.style.display = "none";
    questionNavContainer.style.display = "flex";
})

navSubClose.addEventListener("click", function (event) {
    navSubClose.style.display = "none";
    navSubOpen.style.display = "flex";
    questionNavContainer.style.display = "none";
})


document.getElementById('closeScoreCard').addEventListener("click", function (event) {
    scoreCard.style.display = 'none';
    overlay.style.display = 'none';

    document.getElementById('questionNavContainerScore').style.display = "block";
    
    resultSummery.scrollIntoView({
        behavior: 'smooth'  // Enables smooth scrolling
    });

    if(navSubClose.style.display === "flex"){
        navSubClose.click();
    }
})
// Select all buttons with the class 'subjectButton'
const subjectButtons = document.querySelectorAll('.subjectButton');

// Add event listener to each subject button
subjectButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove 'active' class from all subject buttons
        subjectButtons.forEach(btn => btn.classList.remove('active'));

        // Add 'active' class to the clicked subject button
        button.classList.add('active');
    });
});
