const headElem = document.getElementById("head");
const buttonsElem = document.getElementById("buttons");
const pagesElem = document.getElementById("pages");
const pageImg = document.getElementById("img");
let Answers = [];

//Класс, который представляет сам тест
class Quiz
{
	constructor(type, questions, results)
	{
		//Тип теста: 1 - классический тест с правильными ответами, 2 - тест без правильных ответов
		this.type = type;

		//Массив с вопросами
		this.questions = questions;

		//Массив с возможными результатами
		this.results = results;

		//Количество набранных очков
		this.score = 0;

		//Номер результата из массива
		this.result = 0;

		//Номер текущего вопроса
		this.current = 0;
	}

	Click(index)
	{
		//Добавляем очки
		let value = this.questions[this.current].Click(index);
		this.score += value;

		let correct = -1;

		//Если было добавлено хотя одно очко, то считаем, что ответ верный
		if(value >= 1)
		{
			correct = index;
		}
		else
		{
			//Иначе ищем, какой ответ может быть правильным
			for(let i = 0; i < this.questions[this.current].answers.length; i++)
			{
				if(this.questions[this.current].answers[i].value >= 1)
				{
					correct = i;
					break;
				}
			}
		}

		this.Next();

		return correct;
	}

	//Переход к следующему вопросу
	Next()
	{
		this.current++;
		
		if(this.current >= this.questions.length) 
		{
			this.End();
		}
	}

	//Если вопросы кончились, этот метод проверит, какой результат получил пользователь
	End()
	{
		for(let i = 0; i < this.results.length; i++)
		{
			if(this.results[i].Check(this.score))
			{
				this.result = i;
			}
		}
	}
} 

//Класс, представляющий вопрос
class Question 
{
	constructor(text, answers)
	{
		this.text = text; 
		this.answers = answers; 
	}

	Click(index) 
	{
		return this.answers[index].value; 
	}
}

//Класс, представляющий ответ
class Answer 
{
	constructor(text, value) 
	{
		this.text = text; 
		this.value = value; 
	}
}

//Класс, представляющий результат
class Result 
{
	constructor(text, value)
	{
		this.text = text;
		this.value = value;
	}

	//Этот метод проверяет, достаточно ли очков набрал пользователь
	Check(value)
	{
		if(this.value <= value)
		{
			return true;
		}
		else 
		{
			return false;
		}
	}
}

//Массив с результатами
const results = 
[
	new Result("Ты - обычное металлическое ведро, скучночновато, но почему бы и нет", 0),
	new Result("Ты - деревянное ведро, бревно одним словом. Я бы посоветовал сходить на тренинг", 1),
	new Result("Ты - ведро с цветочками, но мусорное...но с цветочками", 2),
	new Result("Ты - металлическое ведро с цветочками, чуть лучше, чем обычное, но не зазнавайся", 3),
	new Result("Ты - дырявое ведро, с количеством дырок равному твоему IQ. Можешь гордиться: их много", 4),
	new Result("Ты - ведро без днища, которое уже давно пробито, но какая-то польза от тебя все же есть", 5),
	new Result("Ты - детское ведёрко, слишком инфантильно, но ведь взрослеть не круто, правда?", 6)
];

//Массив с вопросами
const questions = 
[
	new Question('Тест: какое ты ведро?', 
	[
		new Answer("Начать", 0)
	]),

	new Question("Как часто ты смотришь смешариков?", 
	[
		new Answer("Каждый день", 0),
		new Answer("Каждый месяц", 1),
		new Answer("Ну бывает иногда", 2),
		new Answer("Никогда", 3)
	]),

	new Question("Вилкой в торт или ложкой в суп?", 
	[
		new Answer("Вилкой в торт", 0),
		new Answer("Ложкой в суп", 1)
	]),

	new Question("Ты называешь себя собственным именем?", 
	[
		new Answer("Что такое имя собственное?", 0),
		new Answer("Нет конечно, зачем", 1),
		new Answer("Я карта, я карта, я карта, я карта, я карта", 2)
	]),

	new Question("Если я что-то утверждаю, я не обязан предоставлять доказательства. Если вы утверждаете обратное, опровергая меня, это вы должны доказательство предоставлять. Разве это не так?", 
	[
		new Answer("Все так", 0),
		new Answer("Пошлость, звеня-ящая пошлость", 1),
		new Answer("Чей Крым?", 2),
		new Answer("Нет", 3)
	]),

	new Question("Тебя зовут Влад?", 
	[
		new Answer("Да", 0),
		new Answer("Нет", 1)
	])
];

//Сам тест
const quiz = new Quiz(2, questions, results);

Update();

//Обновление теста
function Update()
{
	//Проверяем, есть ли ещё вопросы
	if(quiz.current < quiz.questions.length) 
	{
		//Если есть, меняем вопрос в заголовке
		headElem.innerHTML = quiz.questions[quiz.current].text;
		pageImg.src = "";
		pageImg.alt = "";
		//Удаляем старые варианты ответов
		buttonsElem.innerHTML = "";

		//Создаём кнопки для новых вариантов ответов
		for(let i = 0; i < quiz.questions[quiz.current].answers.length; i++)
		{
			let btn = document.createElement("button");
			btn.className = "button";

			btn.innerHTML = quiz.questions[quiz.current].answers[i].text;

			btn.setAttribute("index", i);

			buttonsElem.appendChild(btn);
		}
		
		if(quiz.current === 0)  {
			pagesElem.innerHTML = "";
			pageImg.src = "images/!.jpg";
		}
		else {
			pagesElem.innerHTML = (quiz.current) + " / " + (quiz.questions.length - 1);
		}
		//Вызываем функцию, которая прикрепит события к новым кнопкам
		Init();
	}
	else
	{
		buttonsElem.innerHTML = "";
		pagesElem.innerHTML = "";
		let r = -1;
		if(Answers[5] == 0) {
			r = 4;
			headElem.innerHTML = quiz.results[r].text;
		}
		else
		if(Answers[1] == 0 || Answers[1] == 1) {
			r = 2;
			headElem.innerHTML = quiz.results[r].text;
		}
		else {
			r = random(0,7);
			headElem.innerHTML = quiz.results[r].text;
		}
		pageImg.src = `images/${r}.jpg`;
	}
}

function Init()
{
	//Находим все кнопки
	let btns = document.getElementsByClassName("button");

	for(let i = 0; i < btns.length; i++)
	{
		//Прикрепляем событие для каждой отдельной кнопки
		//При нажатии на кнопку будет вызываться функция Click()
		btns[i].addEventListener("click", function (e) { Click(e.target.getAttribute("index")); });
	}
}

function Click(index) 
{
	Answers.push(index);
	quiz.Next();

	//Находим все кнопки
	let btns = document.getElementsByClassName("button");

	//Делаем кнопки серыми
	for(let i = 0; i < btns.length; i++)
	{
		btns[i].className = "button button_passive";
	}

	btns[index].className = "button button_correct";

	if(index == 0) {
		setTimeout(Update, 500);
	}
	else {
		setTimeout(Update, 1000);
	}
	
}

function random(min, max) {
	let rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}

// function setHeiHeight() {
//     $('#hei').css({
//         height: $(window).height() + 'px'
//     });
// }
// setHeiHeight(); // устанавливаем высоту окна при первой загрузке страницы
// $(window).resize(setHeiHeight); // обновляем при изменении размеров окна