function getCurrentUserStamps() {
    const currentUserData = localStorage.getItem('currentUser');
    if (!currentUserData) {
        return [];
    }

    const { email } = JSON.parse(currentUserData);
    const fullUserData = JSON.parse(localStorage.getItem(email));
    
    return fullUserData && fullUserData.stamps ? fullUserData.stamps : [];
}

function updateStamps(stampId) {
    const currentUserData = localStorage.getItem('currentUser');
    if (!currentUserData) {
        console.warn("User not logged in. Cannot save stamp.");
        return;
    }

    const { email } = JSON.parse(currentUserData);
    let fullUserData = JSON.parse(localStorage.getItem(email));

    if (!fullUserData || !fullUserData.stamps) {
        fullUserData = fullUserData || {};
        fullUserData.stamps = [];
    }

    if (!fullUserData.stamps.includes(stampId)) {
        fullUserData.stamps.push(stampId);
        localStorage.setItem(email, JSON.stringify(fullUserData));
        console.log(`✅ Stamp ${stampId} added to user: ${email}`);
    }
}


const quizData = [
    { 
        id: 1, countryName: 'Iran', correctAnswer: 'C', 
        feedbackCorrect: "✅ Gesture Guru! You correctly avoided insulting the driver in Iran.",
        feedbackIncorrect: "❌ CULTURAL FOUL! The Thumbs-Up is a rude insult in Iran. Misunderstanding alert!", 
        countryStamp: 'IRAN_THUMBS_UP' 
    },
    { 
        id: 2, countryName: 'Turkey', correctAnswer: 'C', 
        feedbackCorrect: "✅ Excellent! The 'OK' sign is aggressive and insulting in Turkey. You passed the test!",
        feedbackIncorrect: "❌ CULTURAL FOUL! The 'OK' sign is highly offensive in Turkey. That's a huge blunder!", 
        countryStamp: 'TURKEY_OK_SIGN' 
    },
    { 
        id: 3, countryName: 'UK', correctAnswer: 'B', 
        feedbackCorrect: "✅ Perfect! The backward 'V' is a massive insult in the UK. You avoided a bar fight!",
        feedbackIncorrect: "❌ CULTURAL FOUL! The backward 'V' in the UK is the equivalent of the middle finger. Ouch!", 
        countryStamp: 'UK_V_SIGN' 
    },
    { 
        id: 4, countryName: 'Bulgaria', correctAnswer: 'A', 
        feedbackCorrect: "✅ Smart Traveler! In Bulgaria, nodding up and down means 'NO'. You correctly disagreed!",
        feedbackIncorrect: "❌ CULTURAL FOUL! Up-and-down means 'No' in Bulgaria. Your waiter thinks you hated the food!", 
        countryStamp: 'BULGARIA_NOD' 
    },
    { 
        id: 5, countryName: 'Philippines', correctAnswer: 'C', 
        feedbackCorrect: "✅ Master Communicator! The 'Come Here' finger is used for calling animals in the Philippines. You are safe!",
        feedbackIncorrect: "❌ CULTURAL FOUL! That gesture is exclusively used for calling dogs in the Philippines and is highly insulting to a human.", 
        countryStamp: 'PHL_COME_HERE' 
    }
];

let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = quizData.length;

document.addEventListener('DOMContentLoaded', () => {
    const questions = document.querySelectorAll('.quiz-card[id^="question-"]');
    questions.forEach((q, index) => {
        q.style.display = index === 0 ? 'block' : 'none';
    });
    if (quizData.length > 0) {
        updateProgressBar(1, totalQuestions, quizData[0].countryName);
    }

    questions.forEach(q => {
        const options = q.querySelectorAll('.option-item');
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                const radio = option.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });
    });
});

function updateProgressBar(currentQNum, total, country) {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    let progressNumerator = currentQNum - 1;
    
    if (country === "Complete") {
        progressNumerator = total; 
    }
    const percent = (progressNumerator / total) * 100;

    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${currentQNum} of ${total}: ${country}`;
}


window.checkAnswer = function(questionId) {
    const currentQuestionElement = document.getElementById(`question-${questionId}`);
    const selectedOption = currentQuestionElement.querySelector('input[type="radio"]:checked'); 
    if (!selectedOption) {
        alert("Please select an option before proceeding!");
        return;
    }
    const currentQuestionData = quizData.find(q => q.id === questionId);
    const isCorrect = selectedOption.value === currentQuestionData.correctAnswer;
    
    const checkBtn = currentQuestionElement.querySelector('.next-btn');
    if(checkBtn) checkBtn.disabled = true;

    const feedbackBox = document.getElementById(`feedback-${questionId}`);
    if (feedbackBox) {
        feedbackBox.style.display = 'block';
        if (isCorrect) {
            score++;
            updateStamps(currentQuestionData.countryStamp); 
            feedbackBox.textContent = currentQuestionData.feedbackCorrect; 
            feedbackBox.className = 'feedback-box correct';
        } else {
            feedbackBox.textContent = currentQuestionData.feedbackIncorrect;
            feedbackBox.className = 'feedback-box incorrect';
        }
    }
    const NEXT_QUESTION_DELAY_MS = 2500;

    setTimeout(() => {
        if(feedbackBox) feedbackBox.style.display = 'none'; 
        
        currentQuestionElement.style.display = 'none';
        currentQuestionIndex++;
        
        if (currentQuestionIndex < totalQuestions) {
            const nextQuestionData = quizData[currentQuestionIndex];
            const nextQuestionElement = document.getElementById(`question-${nextQuestionData.id}`);
            if (nextQuestionElement) {
                nextQuestionElement.style.display = 'block';
                updateProgressBar(currentQuestionIndex + 1, totalQuestions, nextQuestionData.countryName); 
            }
        } else {
            showResults();
            updateProgressBar(totalQuestions, totalQuestions, "Complete"); 
        }
    }, NEXT_QUESTION_DELAY_MS);
}


function showResults() {
    document.getElementById('quiz-area').style.display = 'none';
    const resultSection = document.getElementById('quiz-result');
    resultSection.style.display = 'block';

    const allUserStamps = getCurrentUserStamps();
    
    const quizStampIds = quizData.map(q => q.countryStamp);
    const earnedQuizStamps = allUserStamps.filter(stamp => quizStampIds.includes(stamp)).length;

    document.getElementById('result-score').innerHTML = `You answered <span style="color: var(--color-primary);">${score}</span> questions correctly, earning <span style="color: var(--color-secondary);" id="stamps-count">${earnedQuizStamps}</span> cultural visas!`;

    const finalFeedbackBox = document.getElementById('final-feedback');
    const stampsDisplay = document.getElementById('stamps-display');
    
    if (score === totalQuestions) {
        finalFeedbackBox.textContent = "GESTURE MASTER! You have earned every visa in this challenge. Your cultural IQ is exceptional!";
        finalFeedbackBox.className = 'feedback-box correct';
    } else if (score >= totalQuestions * 0.6) {
        finalFeedbackBox.textContent = "CULTURAL NAVIGATOR! A strong performance. Review your mistakes to master the silent language.";
        finalFeedbackBox.className = 'feedback-box';
    } else {
        finalFeedbackBox.textContent = "NOVICE STATUS! Many cultural pitfalls remain. Review the Explorer section before booking your next flight.";
        finalFeedbackBox.className = 'feedback-box incorrect';
    }

    stampsDisplay.innerHTML = `
        <p style="color: var(--color-secondary); font-weight: bold;">
            Earned Visas:
        </p>
        ${quizData.map(q => 
            `<span class="stamp-icon" style="color: ${allUserStamps.includes(q.countryStamp) ? 'var(--color-secondary)' : '#ccc'};">
                ${allUserStamps.includes(q.countryStamp) ? '✅' : '❌'} ${q.countryName}
            </span>`
        ).join('')}
    `;
}