document.addEventListener("DOMContentLoaded", () => {

    const quizData = {
        js: {
            easy: [
                { q: "What is JavaScript?", o: ["Language", "OS", "DB", "Server"], a: 0 },
                { q: "Which keyword declares variable?", o: ["var", "int", "define"], a: 0 },
                { q: "Which keyword is block scoped?", o: ["var", "let", "define"], a: 1 },
                { q: "HTML stands for?", o: ["Hyper Text Markup Language", "High ML"], a: 0 },
                { q: "Which tag is used for links?", o: ["<a>", "<p>", "<div>"], a: 0 }
            ],
            medium: [
                { q: "Which method parses JSON?", o: ["JSON.parse()", "JSON.stringify()", "JSON.convert()"], a: 0 },
                { q: "Which loop runs at least once?", o: ["for", "while", "do-while"], a: 2 },
                { q: "NaN means?", o: ["Not a Number", "Null"], a: 0 },
                { q: "Which operator checks type?", o: ["==", "===", "="], a: 1 },
                { q: "JS can run on?", o: ["Browser", "Server", "Both"], a: 2 }
            ],
            hard: [
                { q: "What is closure?", o: ["Function with lexical scope", "Loop", "Object"], a: 0 },
                { q: "Event bubbling flows?", o: ["Child to Parent", "Parent to Child"], a: 0 },
                { q: "Which is asynchronous?", o: ["setTimeout", "for loop"], a: 0 },
                { q: "Hoisting applies to?", o: ["Variables", "Functions", "Both"], a: 2 },
                { q: "Promise state NOT valid?", o: ["Pending", "Resolved", "Finished"], a: 2 }
            ]
        },

        html: {
            easy: [
                { q: "HTML stands for?", o: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks Text ML"], a: 0 },
                { q: "Which tag is used for paragraph?", o: ["<p>", "<div>", "<span>"], a: 0 },
                { q: "Which tag creates a line break?", o: ["<br>", "<hr>", "<lb>"], a: 0 },
                { q: "Which tag is used for images?", o: ["<img>", "<image>", "<pic>"], a: 0 },
                { q: "HTML is used for?", o: ["Structure", "Styling", "Logic"], a: 0 }
            ],
            medium: [
                { q: "Which attribute specifies a link URL?", o: ["href", "src", "link"], a: 0 },
                { q: "Which tag is semantic?", o: ["<article>", "<div>", "<span>"], a: 0 },
                { q: "Which input type is for email?", o: ["email", "text", "mail"], a: 0 },
                { q: "Which tag defines table row?", o: ["<tr>", "<td>", "<th>"], a: 0 },
                { q: "Which attribute makes input required?", o: ["required", "validate", "mandatory"], a: 0 }
            ],
            hard: [
                { q: "Which tag is used for navigation?", o: ["<nav>", "<menu>", "<section>"], a: 0 },
                { q: "Which doctype is correct for HTML5?", o: ["<!DOCTYPE html>", "<!HTML5>", "<!DOCTYPE HTML PUBLIC>"], a: 0 },
                { q: "What does SEO stand for?", o: ["Search Engine Optimization", "Search Easy Order", "Site Engine Object"], a: 0 },
                { q: "Which attribute improves accessibility?", o: ["alt", "title", "aria"], a: 0 },
                { q: "Which HTML tag is used for video?", o: ["<video>", "<media>", "<movie>"], a: 0 }
            ]
        }
    };

    let questions = [];
    let currentIndex = 0;
    let timer = 15;
    let interval;

    let correct = 0;
    let wrong = 0;
    let timeTaken = [];
    let answerStatus = [];

    const startBtn = document.getElementById("startQuiz");
    const timerEl = document.getElementById("timer");
    const questionText = document.getElementById("questionText");
    const optionsEl = document.getElementById("options");
    const nextBtn = document.getElementById("nextBtn");
    const questionCount = document.getElementById("questionCount");

    startBtn.addEventListener("click", () => {
        const category = document.getElementById("category").value;
        const difficulty = document.getElementById("difficulty").value;

        if (!quizData[category] || !quizData[category][difficulty]) {
            alert("Questions not available");
            return;
        }

        questions = quizData[category][difficulty].slice(0, 5);
        currentIndex = 0;
        correct = 0;
        wrong = 0;
        timeTaken = [];
        answerStatus = [];

        document.getElementById("startScreen").classList.add("hidden");
        document.getElementById("quizScreen").classList.remove("hidden");

        loadQuestion();
    });

    function loadQuestion() {
        if (currentIndex >= questions.length) {
            showResult();
            return;
        }

        questionCount.innerText = `Question ${currentIndex + 1} / ${questions.length}`;
        questionText.innerText = questions[currentIndex].q;
        optionsEl.innerHTML = "";

        questions[currentIndex].o.forEach((opt, i) => {
            const div = document.createElement("div");
            div.innerHTML = `
                <label>
                    <input type="radio" name="opt" value="${i}">
                    ${opt}
                </label>
            `;
            optionsEl.appendChild(div);
        });

        startTimer();
    }

    function startTimer() {
        clearInterval(interval);
        timer = 15;
        timerEl.innerText = `Time: ${timer}`;

        interval = setInterval(() => {
            timer--;
            timerEl.innerText = `Time: ${timer}`;

            if (timer === 0) submitAnswer(true);
        }, 1000);
    }

    nextBtn.addEventListener("click", () => submitAnswer(false));

    function submitAnswer(isTimeout) {
        clearInterval(interval);

        const selected = document.querySelector("input[name='opt']:checked");
        timeTaken.push(15 - timer);

        if (!isTimeout && selected && Number(selected.value) === questions[currentIndex].a) {
            correct++;
            answerStatus.push(true);
        } else {
            wrong++;
            answerStatus.push(false);
        }

        currentIndex++;
        loadQuestion();
    }

    function showResult() {
        document.getElementById("quizScreen").classList.add("hidden");
        document.getElementById("resultScreen").classList.remove("hidden");

        document.getElementById("score").innerText = `Score: ${correct} / ${questions.length}`;
        document.getElementById("correct").innerText = `Correct Answers: ${correct}`;
        document.getElementById("incorrect").innerText = `Wrong Answers: ${wrong}`;

        new Chart(document.getElementById("resultChart"), {
            type: "bar",
            data: {
                labels: questions.map((_, i) => `Q${i + 1}`),
                datasets: [{
                    label: "Time Taken (Seconds)",
                    data: timeTaken,
                    backgroundColor: answerStatus.map(s => s ? "green" : "red")
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true, max: 15 }
                }
            }
        });
    }

});
