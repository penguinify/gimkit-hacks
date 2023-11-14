import * as gimkitElements from "./config.json"

var DATA = []

function preRunChecks() {
    if (window.location.href.split(".")[1] !== "gimkit") {
        alert("You must be on a Gimkit game page to use this script.");
        return false;
    }
    
    try {    
        if (gimkitHacksRunning) {
            alert("Gimkit hacks are already running.");
            return false;
        }
    } catch (error) {
        console.log("Have fun!");     
    }

    var gimkitHacksRunning = true;
    return true;
}

function isOnQuestion() {
    return document.getElementsByClassName(gimkitElements['container-div']).length > 0;
}

function isOnTextQuestion() {
    console.log(document.getElementsByClassName(gimkitElements['text-input']).length)
    return document.getElementsByClassName(gimkitElements['text-input']).length > 0;
}

function saveQuestion(question, answer) {
    console.log(DATA)
    if (DATA.length > 0) {
        for (let i = 0; i < DATA.length; i++) {
            if (DATA[i].question === question) {
                return;
            }
        }
    }

    DATA.push({
        question: question,
        answer: answer
    });
    console.log(DATA);
}

function isCorrect() {
    if (document.getElementsByClassName(gimkitElements['correct-answer']).length > 0) {
        return false;
    }
    
    if (document.getElementsByClassName(gimkitElements['correct-thing']).length > 0) {
        console.log("I SAW IT")
        return true;
    }
}

function getAnswerFromQuestion(question) {
    for (let i = 0; i < DATA.length; i++) {
        if (DATA[i].question === question) {
            return DATA[i].answer;
        }
    }

    return null;
}

function manipulateQuestions() {

    let options = document.getElementsByClassName(gimkitElements['options']);
    let answer = getAnswerFromQuestion(document.getElementsByClassName(gimkitElements['question'])[0].innerText);
    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener("mouseup", (e) => { 
            console.log("mousedown")
            var question = document.getElementsByClassName(gimkitElements['question'])[0].innerText
            var answer = options[i].innerText
            setTimeout(() => {
                if (isCorrect()) {
                    console.log("correct")
                    saveQuestion(
                        question,
                        answer
                    );
                }
            }, 250);
            options[i].removeEventListener("mousedown", () => {});
        });
        
        if (options[i].innerText === answer) {
            options[i].style.transform = "scale(1.3)";
        }
    }
}

function manipulateTextQuestions() {
    let input = document.getElementsByClassName(gimkitElements['text-input'])[0];
    let submit = document.getElementsByClassName(gimkitElements['text-submit'])[0];
    let question = document.getElementsByClassName(gimkitElements['question'])[0].innerText;
    let answer = getAnswerFromQuestion(document.getElementsByClassName(gimkitElements['question'])[0].innerText);
    
    
        if (answer) {
            console.log("shoudlve worked")
            input.placeholder = answer;
        }
    submit.addEventListener("mouseup", (e) => {
        console.log("mouseup")
        // if (e.keyCode === 13) {
            setTimeout(() => {
                if (isCorrect()) {
                    saveQuestion(
                        question,
                        input.value
                    );
                }
            }, 250);
        // }
    });

    input.addEventListener("keyup", (e) => {
        console.log("keyup")
        if (e.keyCode === 13) {
            setTimeout(() => {
                if (isCorrect()) {
                    saveQuestion(
                        question,
                        input.value
                    );
                }
            }, 250);
        }
    })
}                


function addListeners() {
    alert("Answer Questions to save answers. Correct answers will appear larger once you have answered enough questions.")

    console.log("Adding listeners...") 
    window.setInterval(function() {
        if (isOnQuestion()) {

            if (isOnTextQuestion()) {
                window.clearInterval();
                manipulateTextQuestions();
            } else {

                window.clearInterval();

                manipulateQuestions();
            }
        } else if (isOnTextQuestion()) {
            window.clearInterval();

            manipulateTextQuestions();
        }
    }, 50)
}

preRunChecks() && addListeners();
