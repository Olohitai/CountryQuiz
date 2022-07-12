let flag;
let countriesList;
let questionList = [];
let array = [];
let correctAnswer;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;

const option_list = document.querySelector(".option_list");
const quiz_container = document.querySelector(".quiz_container");
const quizQuestion = document.querySelector(".quiz_question");
const questionNumbText = document.getElementById("questionNumbText");
const fullProgressBar = document.getElementById("fullProgressBar");
const timeText = document.querySelector(".time_left_txt");
const timeCount = document.querySelector(".timer_sec");
const result_box = document.querySelector(".result_box");

const getCountries = async () => {
  const API_URL = "https://restcountries.com/v3.1/all";
  const data = await fetch(API_URL);
  const countries = await data.json();

  countriesList = countries.map((country) => {
    const capital = country.capital ? country.capital[0] : "none";

    return {
      name: country.name.common,
      capital: capital,
      flag: country.flags.png,
      continent: country.continents[0],

      language: country.languages,
    };
  });
  return countriesList;
};

const getQuestions = async () => {
  const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());
  await getCountries();

  let questions;
  shuffleArray(countriesList)
    .slice(-1)

    .map((randomCountry) => {
      flag = randomCountry.flag;
      const language = Object.values(randomCountry.language);

      const flagquestion = `Which country does this flag belong to ?`;

      const capitalQuestion = `${randomCountry.capital} is the capital of ?`;

      const whatmyname = `I am located in ${randomCountry.continent} i speak the following language(s) ${language}. My capital is ${randomCountry.capital} what is my name ?`;

      questions = [flagquestion, capitalQuestion, whatmyname];

      //SELECTS RANDOM QUESTION(FLAG OR CAPITAL)
      questionList = getRandomQuestion(questions);
      console.log(questionList);

      countriesFiltered = countriesList.filter(
        (itSecond) => itSecond.name !== randomCountry.name
      );
      const filter = shuffleArray(countriesFiltered).slice(0, 3);
      const country1 = filter[0].name;
      const country2 = filter[1].name;
      const country3 = filter[2].name;

      correctAnswer = randomCountry.name;
      array = shuffleArray([country1, country2, country3, correctAnswer]);

      console.log(correctAnswer);
    });
};
// getQuestions();

const showQuestion = async () => {
  await getQuestions();

  const img = document.createElement("img");
  img.setAttribute("src", flag);

  let que_tag = `${questionList}`;
  // console.log(que_tag);
  quizQuestion.innerHTML = que_tag;
  if (quizQuestion.innerHTML === `Which country does this flag belong to ?`) {
    quizQuestion.append(img);
  }

  let option_tag =
    '<div class="option"><span>' +
    `${array[0]}` +
    "</span></div>" +
    '<div class="option"><span>' +
    `${array[1]}` +
    "</span></div>" +
    '<div class="option"><span>' +
    array[2] +
    "</span></div>" +
    '<div class="option"><span>' +
    array[3] +
    "</span></div>";

  option_list.innerHTML = option_tag; //adding new div tag inside option_tag
  // set onclick attribute to all available options

  const option = option_list.querySelectorAll(".option");

  for (i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }

  loader.classList.add("hidden");
  quiz_container.classList.remove("hidden");
  startTimer(15);
  questionNumbText.innerText = `Question ${que_count}/${5}`;
  fullProgressBar.style.width = `${(que_count / 5) * 100}%`;
};
showQuestion();

const optionSelected = async (answer) => {
  // console.log(answer);
  clearInterval(counter); //clear counter

  let userAns = answer.textContent; //getting user selected option
  let correctAns = correctAnswer; //getting correct answer from array
  const allOptions = option_list.children.length;
  // console.log(allOptions);

  if (userAns == correctAns) {
    userScore += 1;
    // console.log(userScore);
    answer.classList.add("correct");
    startGame();
  } else {
    answer.classList.add("incorrect");
    startGame();
  }
  for (i = 0; i < allOptions; i++) {
    if (option_list.children[i].textContent == correctAns) {
      //if there is an option which is matched to an array answer
      option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
    }
  }
  for (i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
  }
};

const getRandomQuestion = (array) => {
  const random = array[Math.floor(Math.random() * array.length)];
  return random;
};

const getRandomNumber = (length) => {
  const random = Math.floor(Math.random() * length);
  return random;
};

function showResult() {
  setTimeout(function () {
    quiz_container.classList.add("hidden");
  }, 1000);
  // window.location.assign("/end.html");
  setTimeout(function () {
    result_box.style.display = "flex";
  }, 1000);

  const scoreText = result_box.querySelector(".score_text");
  if (userScore > 2) {
    // if user scored more than 3
    //creating a new span tag and passing the user score number and total question number
    let scoreTag = `<span class="scoreCount">${userScore}<span class="slash"> / </span>5</span><p>Good Job</p>`;
    scoreText.innerHTML = scoreTag; //adding new span tag inside score_Text
  } else if (userScore > 1) {
    // if user scored more than 1
    let scoreTag = `<span class="scoreCount">${userScore} <span class="slash"> / </span>5</span> <p>Average Performance</p>`;
    scoreText.innerHTML = scoreTag;
  } else {
    // if user scored less than 1
    let scoreTag = `<span class="scoreCount">${userScore}<span class="slash"> / </span>5</span> <p>Nice try Better luck next time!</p>`;
    scoreText.innerHTML = scoreTag;
  }
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    timeText.textContent = "Time Left";
    optionSelected;
    timeCount.textContent = time; //changing the value of timeCount with time value
    time--; //decrement the time value
    if (time < 9) {
      //if timer is less than 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero; //add a 0 before time value
    }
    if (time < 0) {
      //if timer is less than 0
      clearInterval(counter); //clear counter
      timeText.textContent = "Time Off"; //change the time text to time off
      const allOptions = option_list.children.length; //getting all option items
      let correctAns = correctAnswer; //getting correct answer from array
      for (i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correctAns) {
          //if there is an option which is matched to an array answer
          option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option

          console.log("Time Off: Auto selected correct answer.");
        }
      }
      for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
      }
      startGame();
      // next_btn.classList.add("show"); //show the next button if user selected any option
    }
  }
}

const startGame = () => {
  if (que_count < 4) {
    que_count++;

    showQuestion();

    console.log(que_count);
  } else {
    showResult();
  }
};
