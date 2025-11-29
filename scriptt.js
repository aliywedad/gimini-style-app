const quizData = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language"
        ],
        correct: 0
    },
    {
        question: "Which tag is used to create a paragraph?",
        options: ["&lt;paragraph&gt;", "&lt;p&gt;", "&lt;para&gt;", "&lt;pg&gt;"],
        correct: 1
    },
    {
        question: "What type of tag is &lt;br&gt;?",
        options: [
            "Opening tag",
            "Closing tag",
            "Self-closing tag",
            "Invalid tag"
        ],
        correct: 2
    },
    {
        question: "Which tag creates the most important heading?",
        options: ["&lt;h6&gt;", "&lt;h1&gt;", "&lt;heading&gt;", "&lt;head&gt;"],
        correct: 1
    },
    {
        question: "What does the &lt;a&gt; tag create?",
        options: ["An image", "A link", "A list", "A paragraph"],
        correct: 1
    },
    {
        question: "Which attribute is required for the &lt;img&gt; tag?",
        options: ["title", "alt", "src", "Both alt and src"],
        correct: 3
    },
    {
        question: "What is the purpose of semantic HTML?",
        options: [
            "To make pages load faster",
            "To improve accessibility and SEO",
            "To add colors to the page",
            "To create animations"
        ],
        correct: 1
    },
    {
        question: "Which tag defines the main content of a document?",
        options: ["&lt;content&gt;", "&lt;body&gt;", "&lt;main&gt;", "&lt;article&gt;"],
        correct: 2
    },
    {
        question: "What does &lt;nav&gt; contain?",
        options: [
            "Images",
            "Navigation links",
            "Videos",
            "Footer information"
        ],
        correct: 1
    },
    {
        question: "Which is a non-semantic tag?",
        options: ["&lt;header&gt;", "&lt;article&gt;", "&lt;div&gt;", "&lt;footer&gt;"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    handleHash();
    window.addEventListener('hashchange', handleHash);
});

// Setup Navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                showPage(href.substring(1));
                window.location.hash = href;
            }
        });
    });

    // Retake quiz button
    const retakeBtn = document.getElementById('retake');
    if (retakeBtn) {
        retakeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetQuiz();
        });
    }
}

// Handle URL hash changes
function handleHash() {
    let hash = window.location.hash.substring(1);
    if (!hash) hash = 'home';
    showPage(hash);
}

// Show specific page
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId);
    const targetNav = document.getElementById('nav-' + pageId);
    
    if (targetPage) targetPage.classList.add('active');
    if (targetNav) targetNav.classList.add('active');

    if (pageId === 'quiz') {
        loadQuiz();
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Quiz Functions
function loadQuiz() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    document.getElementById('quiz-result').style.display = 'none';
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestion >= quizData.length) {
        showResults();
        return;
    }

    const question = quizData[currentQuestion];
    const form = document.getElementById('quiz-form');
    
    let html = `
        <fieldset class="quiz-question">
            <legend>Question ${currentQuestion + 1} of ${quizData.length}</legend>
            <p>${question.question}</p>
        </fieldset>
    `;

    question.options.forEach((option, index) => {
        html += `
            <div class="quiz-option" tabindex="0" role="button" data-index="${index}">
                ${option}
            </div>
        `;
    });

    form.innerHTML = html;
    
    // Add event listeners
    const options = form.querySelectorAll('.quiz-option');
    options.forEach(opt => {
        opt.addEventListener('click', function() {
            selectAnswer(parseInt(this.dataset.index));
        });
        opt.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectAnswer(parseInt(this.dataset.index));
            }
        });
    });

    updateProgress();
}

function selectAnswer(selected) {
    if (answered) return;
    answered = true;

    const question = quizData[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    
    if (selected === question.correct) {
        options[selected].classList.add('correct');
        score++;
    } else {
        options[selected].classList.add('incorrect');
        options[question.correct].classList.add('correct');
    }

    // Disable all options
    options.forEach(opt => {
        opt.style.cursor = 'default';
        opt.removeAttribute('tabindex');
    });

    setTimeout(() => {
        currentQuestion++;
        answered = false;
        displayQuestion();
    }, 1500);
}

function updateProgress() {
    const progress = (currentQuestion / quizData.length) * 100;
    const progressBar = document.getElementById('progress');
    progressBar.style.width = progress + '%';
    progressBar.parentElement.setAttribute('aria-valuenow', progress);
}

function showResults() {
    document.getElementById('quiz-form').innerHTML = '';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('score').textContent = score;
    document.getElementById('progress').style.width = '100%';
}

function resetQuiz() {
    loadQuiz();
}