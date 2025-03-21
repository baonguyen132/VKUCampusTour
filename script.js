// Danh sách câu hỏi
var questions = [];
var randoms = [] ;

const number_question = 3 ;
var no_question = 0 ;

let currentQuestionIndex = 0;
let selectedAnswer = "";

// Hiển thị câu hỏi
function loadQuestion() {
    currentQuestionIndex = randoms[no_question] ;
    const questionData = questions[currentQuestionIndex];
    var question_container = document.querySelector("#question-container") ;

    var question_text = document.createElement("h2") ;
    question_text.id = "question_text" ;
    question_text.innerText = questionData.question ;
    question_container.appendChild(question_text) ;

    if(questionData.image != "NULL") {
        var question_image = document.createElement("img") ;
        question_image.src = questionData.image; 
        question_image.id = "question_image" ;
        question_image.alt = "Ảnh câu hỏi" ;
        question_image.width = 300 ;
        question_container.appendChild(question_image) ;
    }
     
    var optionsContainer = document.createElement("div") ;
    optionsContainer.id = 'options-container' ; 
    optionsContainer.innerHTML = "";

    for (let index = 0; index < questionData.options.length; index++) {
        const button = document.createElement("button");

        const chooseOption = document.createElement("div") ;
        chooseOption.classList.add = "chooseOption" ;
        chooseOption.innerText = questionData.options[index]
        button.appendChild(chooseOption)
        
        const TextChooseOption = document.createElement("div") ;
        TextChooseOption.classList.add = "TextChooseOption" ;
        TextChooseOption.innerText = questionData.options_text[index]
        button.appendChild(TextChooseOption)

        button.onclick = () => selectAnswer(questionData.options[index] , questionData.correct);
        optionsContainer.appendChild(button);
        
    }

    question_container.appendChild(optionsContainer) ;
    
}

async function loadExcelFromLocal() {
    const filePath = "question.xlsx"; // Đường dẫn đến file Excel

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("Không thể tải file Excel!");

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Chuyển dữ liệu từ Excel thành JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        // Chuyển đổi thành mảng questions
        questions = jsonData.map(row => ({
            question: row.question,
            image: row.image_link,  
            options_text: [row.A, row.B, row.C, row.D], 
            options: ["A", "B", "C", "D"], 
            correct: row.correct 
        }));
        
    } catch (error) {
        console.error("Lỗi tải file Excel:", error);
    }
}

function selectAnswer(answer, correct) {
    const resultText = document.getElementById("result-text");
    const questionContainer = document.querySelector("#question-container");
    const buttonContainer = document.querySelector(".button-container"); // Thêm vùng chứa nút

    if (answer === correct) {
        resultText.innerText = "✅ Chính xác!";
        resultText.style.color = "green";
    } else {
        resultText.innerText = "❌ Sai rồi! Đáp án đúng là: " + correct;
        resultText.style.color = "red";
    }

    questionContainer.innerHTML = ""; // Xóa câu hỏi trước

    setTimeout(() => {
        no_question++;
        if (no_question != number_question) {
            resultText.innerHTML = "";
            loadQuestion(); // Load câu hỏi tiếp theo
        } else {
            resultText.innerText = "🎉 Bạn đã hoàn thành bài kiểm tra!";
            resultText.style.color = "blue";

            // Tạo nút làm lại
            const resetButton = document.createElement("button");
            resetButton.innerText = "Làm lại";
            resetButton.onclick = () => resetQuiz();

            // Xóa nút cũ nếu có và thêm nút mới
            buttonContainer.innerHTML = "";
            buttonContainer.appendChild(resetButton);
        }
    }, 2000);
}

function getRandomIndices(arr) {
    let indices = [];
    while (indices.length < number_question) {
        let randomIndex = Math.floor(Math.random() * arr.length);
        if (!indices.includes(randomIndex)) {
            indices.push(randomIndex);
        }
    }
    return indices;
}
function resetQuiz() {
    no_question = 0;
    document.getElementById("result-text").innerHTML = "";
    document.querySelector(".button-container").innerHTML = "";

    randoms = getRandomIndices(questions)
    loadQuestion();
}

function start() {
    document.querySelector(".quiz-open").style.display = "none" ;
    document.querySelector(".quiz-container").style.display = "flex" ;
    
    randoms = getRandomIndices(questions) 
    loadQuestion();
}

window.onload = () => {
    loadExcelFromLocal();
};