       // Словари для перевода
		const translations = {
			en: {
				authTitle: "Wordle",
				usernamePlaceholder: "Username",
				passwordPlaceholder: "Password",
				registerButton: "Register",
				loginButton: "Login",
				leaderboardTitle: "Leaderboard",
				leaderboardName: "Name",
				leaderboardRecord: "Record",
				personalRecordTitle: "Your Record:",
				guessInputPlaceholder: "Enter a word",
				submitButton: "Submit",
				restartButton: "Restart",
				totalGamesText: "Total Games:",
				statsRecordText: "Best Record:",
				backButton: "Back",
				statsButton: "Personal Stats",
				fileInputLabel: "Choose File",
				fileStatus: "No file chosen",
				authMessageFile: "Please upload words_en.txt.",
				authMessageFileRU: "Please upload words_ru.txt.",
				gameStartMessage: "Game started! Enter a word.",
				wordLengthError: "The word must be 5 letters long!",
				wordNotFoundError: "The word is not in the list of valid words!",
				winMessage: "Congratulations! You guessed the word!",
				loseMessage: "Game over! The secret word was: ",
				authMessage: "Please enter a username and password.",
				userExistsMessage: "User already exists.",
				registerSuccessMessage: "Registration successful! Please log in.",
				authErrorMessage: "Incorrect username or password.",
				styleTitle: "Style theme",
				selStandart: "Standart",
				selBanana: "Banana",
				selOrange: "Orange",
			},
			ru: {
				authTitle: "Wordle",
				usernamePlaceholder: "Имя пользователя",
				passwordPlaceholder: "Пароль",
				registerButton: "Зарегистрироваться",
				loginButton: "Войти",
				leaderboardTitle: "Таблица лидеров",
				leaderboardName: "Имя",
				leaderboardRecord: "Рекорд",
				personalRecordTitle: "Ваш рекорд:",
				guessInputPlaceholder: "Введите слово",
				submitButton: "Отправить",
				restartButton: "Начать сначала",
				totalGamesText: "Количество игр:",
				statsRecordText: "Рекорд отгаданных слов:",
				backButton: "Назад",
				statsButton: "Личная статистика",
				fileInputLabel: "Выбрать файл",
				fileStatus: "Файл не выбран",
				authMessageFile: "Пожалуйста, загрузите words_en.txt.",
				authMessageFileRU: "Пожалуйста, загрузите words_ru.txt.",
				gameStartMessage: "Игра началась! Введите слово.",
				wordLengthError: "Слово должно быть из 5 букв!",
				wordNotFoundError: "Слово не найдено в списке допустимых слов!",
				winMessage: "Поздравляем! Вы угадали слово!",
				loseMessage: "Игра окончена! Загаданное слово было: ",
				authMessage: "Введите имя пользователя и пароль.",
				userExistsMessage: "Пользователь уже существует.",
				registerSuccessMessage: "Регистрация успешна! Войдите в систему.",
				authErrorMessage: "Неверное имя пользователя или пароль.",
				styleTitle: "Тема оформления",
				selStandart: "Стандартная",
				selBanana: "Банан",
				selOrange: "Апельсин",
			},
		};

        // Раскладки клавиатуры
        const keyboardLayouts = {
            en: ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
            ru: ["ЙЦУКЕНГШЩЗХЪ", "ФЫВАПРОЛДЖЭ", "ЯЧСМИТЬБЮ"],
        };

        let currentLanguage = "en"; // Текущий язык
        let validWords = []; // Список допустимых слов
        let secretWords = []; // Список слов для угадывания
        let secretWord = ""; // Загаданное слово
        const maxAttempts = 6;
        let attempt = 0;
        let currentUser = null; // Текущий пользователь

        const authContainer = document.getElementById("auth-container");
        const authTitle = document.getElementById("auth-title");
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const registerButton = document.getElementById("register-button");
        const loginButton = document.getElementById("login-button");
        const fileInput = document.getElementById("file-input");
        const fileInputLabel = document.getElementById("file-input-label");
        const fileStatus = document.getElementById("file-status");
        const languageSelector = document.getElementById("language");

        const container = document.querySelector(".container");
        const board = document.getElementById("board");
        const message = document.getElementById("message");
        const guessInput = document.getElementById("guess-input");
        const submitButton = document.getElementById("submit-button");
        const restartButton = document.getElementById("restart-button");
        const leaderboardBody = document.getElementById("leaderboard-body");
        const recordValue = document.getElementById("record-value");
        const keyboard = document.getElementById("keyboard");
        const statsButton = document.getElementById("stats-button");
        const statsPage = document.getElementById("stats-page");
        const statsUsername = document.getElementById("stats-username");
        const totalGames = document.getElementById("total-games");
        const statsRecord = document.getElementById("stats-record");
        const backButton = document.getElementById("back-button");

        const letterStates = {}; // Состояние букв: null, "exists", "correct", "none"

        // Хэширование пароля (упрощенный пример)
        function hashPassword(password) {
            return password.split("").reverse().join(""); // Пример хэширования
        }

        // Перевод интерфейса
		function translatePage(lang) {
			const texts = translations[lang];
			authTitle.textContent = texts.authTitle;
			usernameInput.placeholder = texts.usernamePlaceholder;
			passwordInput.placeholder = texts.passwordPlaceholder;
			registerButton.textContent = texts.registerButton;
			loginButton.textContent = texts.loginButton;
			document.getElementById("leaderboard-title").textContent = texts.leaderboardTitle;
			document.getElementById("leaderboard-name").textContent = texts.leaderboardName;
			document.getElementById("leaderboard-record").textContent = texts.leaderboardRecord;
			document.getElementById("personal-record-title").textContent = texts.personalRecordTitle;
			guessInput.placeholder = texts.guessInputPlaceholder;
			submitButton.textContent = texts.submitButton;
			restartButton.textContent = texts.restartButton;
			document.getElementById("total-games-text").textContent = texts.totalGamesText;
			document.getElementById("stats-record-text").textContent = texts.statsRecordText;
			backButton.textContent = texts.backButton;
			statsButton.textContent = texts.statsButton;
			fileInputLabel.textContent = texts.fileInputLabel;
			fileStatus.textContent = texts.fileStatus;
			document.getElementById("styleTitle").textContent = texts.styleTitle;
			document.getElementById("selStandart").textContent = texts.selStandart;
			document.getElementById("selBanana").textContent = texts.selBanana;
			document.getElementById("selOrange").textContent = texts.selOrange;
			
			initKeyboard(); // Пересоздаем клавиатуру при смене языка
		}

        // Инициализация клавиатуры
		function initKeyboard() {
			const layout = keyboardLayouts[currentLanguage];
			keyboard.innerHTML = ""; // Очищаем клавиатуру
			layout.forEach(rowLetters => {
				const row = document.createElement("div");
				row.className = "keyboard-row";
				for (const letter of rowLetters) {
					const key = document.createElement("div");
					key.className = "key";
					key.textContent = letter;
					row.appendChild(key);
					letterStates[letter] = null; // Изначально состояние неизвестно
				}
				keyboard.appendChild(row);
			});
		}

        // Обработка выбора языка
        languageSelector.addEventListener("change", (event) => {
            currentLanguage = event.target.value;
            translatePage(currentLanguage);
        });

        // Обработка выбора файла
		fileInput.addEventListener("change", (event) => {
			const file = event.target.files[0];
			if (file && file.name.endsWith(".txt")) { 
				fileStatus.textContent = file.name;
				loadWords(file); 
			} else {
//				authMessage.textContent = translations[currentLanguage].wrongFileMessage;
				alert(translations[currentLanguage].wrongFileMessage);
			}
		});

        // Анимация переворачивания букв
        function flipCells(row, guess) {
            const cells = row.children;
            for (let i = 0; i < cells.length; i++) {
                setTimeout(() => {
                    const cell = cells[i];
                    cell.setAttribute("data-animation", "flip");

                    // Обработка завершения анимации
                    cell.addEventListener("animationend", () => {
                        cell.removeAttribute("data-animation");
                        if (guess[i] === secretWord[i]) {
                            cell.style.backgroundColor = "#6aaa64"; // Зеленый
                        } else if (secretWord.includes(guess[i])) {
                            cell.style.backgroundColor = "#c9b458"; // Желтый
                        } else {
                            cell.style.backgroundColor = "#787c7e"; // Серый
                        }
                    }, { once: true }); // Обработчик сработает только один раз
                }, i * 140); // Интервал между буквами
            }
        }

        // Инициализация при загрузке страницы
        translatePage(currentLanguage);
        updateLeaderboard();

        // Обновление состояния букв на клавиатуре
		function updateKeyboard(guess) {
			for (let i = 0; i < guess.length; i++) {
				const letter = guess[i];
				if (secretWord[i] === letter) {
					letterStates[letter] = "correct"; // Буква на правильном месте
				} else if (secretWord.includes(letter)) {
					if (letterStates[letter] !== "correct") {
						letterStates[letter] = "exists"; // Буква есть в слове, но не на этом месте
					}
				} else {
					if (letterStates[letter] === null) {
						letterStates[letter] = "none"; // Буквы нет в слове
					}
				}
			}

			// Обновляем цвета клавиш
			const keys = keyboard.querySelectorAll(".key");
			keys.forEach(key => {
				const letter = key.textContent;
				key.className = "key"; // Сбрасываем классы
				if (letterStates[letter] === "correct") {
					key.classList.add("correct");
				} else if (letterStates[letter] === "exists") {
					key.classList.add("exists");
				} else if (letterStates[letter] === "none") {
					key.classList.add("none");
				}
			});
		}

        // Загрузка слов из файла
        function loadWords(file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const text = event.target.result;
                const words = text.split("\n").map(word => word.trim().toUpperCase());

                validWords = words; // Все слова считаются допустимыми
                secretWords = words.filter(word => word.length === 5); // Слова для угадывания (5 букв)

                generateNewWord(); // Генерация нового слова
                initKeyboard(); // Инициализируем клавиатуру
            };
            reader.readAsText(file);
        }

        // Генерация нового слова
		function generateNewWord() {
			secretWord = secretWords[Math.floor(Math.random() * secretWords.length)];
			console.log("Загаданное слово:", secretWord); // Для отладки
			attempt = 0; // Сбрасываем попытки
			board.innerHTML = ""; // Очищаем игровое поле
			createBoard(); // Создаем новое игровое поле
			guessInput.disabled = false;
			submitButton.disabled = false;
			message.textContent = translations[currentLanguage].gameStartMessage;
			initKeyboard(); // Сбрасываем состояние клавиатуры
		}

		// Проверка введенного слова
		function checkGuess(guess) {
			if (guess.length !== 5) {
				message.textContent = translations[currentLanguage].wordLengthError;
				return;
			}

			if (!validWords.includes(guess)) {
				message.textContent = translations[currentLanguage].wordNotFoundError;
				return;
			}

			updateBoard(guess);
			updateKeyboard(guess); // Обновляем состояние клавиатуры
			attempt++;

			if (guess === secretWord) {
				message.textContent = translations[currentLanguage].winMessage;
				submitButton.disabled = true;
				updateRecord();
			} else if (attempt === maxAttempts) {
				message.textContent = translations[currentLanguage].loseMessage + secretWord;
				submitButton.disabled = true;
			} else {
				message.textContent = "";
			}
		}

        // Обновление игрового поля после ввода слова
		function updateBoard(guess) {
			const row = board.children[attempt];
			for (let i = 0; i < 5; i++) {
				setTimeout(() => {
					const cell = row.children[i];
					cell.textContent = guess[i];
					cell.setAttribute("data-animation", "flip"); // Добавляем атрибут для анимации

					// Обработка завершения анимации
					cell.addEventListener("animationend", () => {
						cell.removeAttribute("data-animation"); // Удаляем атрибут после завершения
						if (guess[i] === secretWord[i]) {
							cell.style.backgroundColor = "#6aaa64"; // Зеленый
						} else if (secretWord.includes(guess[i])) {
							cell.style.backgroundColor = "#c9b458"; // Желтый
						} else {
							cell.style.backgroundColor = "#787c7e"; // Серый
						}
					}, { once: true }); // Обработчик сработает только один раз
				}, i * 140); // Задержка 0,14 секунды между буквами
			}
		}

        // Обработка выбора файла
        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file && (file.name === "words_en.txt" || file.name === "words_ru.txt")) {
                loadWords(file);
            } else {
//                authMessage.textContent = "Пожалуйста, выберите файл words_en.txt или words_ru.txt.";
                alert("Пожалуйста, выберите файл words_en.txt или words_ru.txt.");
            }
        });

        // Регистрация нового пользователя
		registerButton.addEventListener("click", () => {
			const username = usernameInput.value.trim();
			const password = passwordInput.value.trim();

			if (!username || !password) {
				authMessage.textContent = translations[currentLanguage].authMessage;
				return;
			}

			const users = JSON.parse(localStorage.getItem("users")) || {};
			if (users[username]) {
				authMessage.textContent = translations[currentLanguage].userExistsMessage;
				return;
			}

			users[username] = { password: hashPassword(password), record: 0, totalGames: 0 };
			localStorage.setItem("users", JSON.stringify(users));
			authMessage.textContent = translations[currentLanguage].registerSuccessMessage;
		});

        // Вход пользователя
		loginButton.addEventListener("click", () => {
			const username = usernameInput.value.trim();
			const password = passwordInput.value.trim();

			const users = JSON.parse(localStorage.getItem("users")) || {};
			if (!users[username] || users[username].password !== hashPassword(password)) {
				authMessage.textContent = translations[currentLanguage].authErrorMessage;
				return;
			}

			currentUser = username;
			authContainer.style.display = "none";
			container.style.display = "block";
			updateLeaderboard();
			recordValue.textContent = users[username].record;
			totalGames.textContent = users[username].totalGames; // Отображаем количество игр
			initGame();
		});

        // Обновление таблицы лидеров
        function updateLeaderboard() {
            const users = JSON.parse(localStorage.getItem("users")) || {};
            const sortedUsers = Object.entries(users).sort((a, b) => b[1].record - a[1].record);

            leaderboardBody.innerHTML = "";
            sortedUsers.forEach(([username, data]) => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${username}</td><td>${data.record}</td>`;
                leaderboardBody.appendChild(row);
            });
        }

        // Обновление личного рекорда
        function updateRecord() {
            const users = JSON.parse(localStorage.getItem("users")) || {};
            if (currentUser && users[currentUser]) {
                users[currentUser].record++;
                users[currentUser].totalGames++;
                localStorage.setItem("users", JSON.stringify(users));
                recordValue.textContent = users[currentUser].record;
                updateLeaderboard();
            }
        }

        // Инициализация игры
        function initGame() {
            createBoard();
            guessInput.disabled = false;
            submitButton.disabled = false;
            message.textContent = translations[currentLanguage].gameStartMessage;
            initKeyboard(); // Инициализируем клавиатуру
        }

        // Инициализация игрового поля
		function createBoard() {
			board.innerHTML = ""; // Очищаем поле
			for (let i = 0; i < maxAttempts; i++) {
				const row = document.createElement("div");
				row.className = "row";
				for (let j = 0; j < 5; j++) {
					const cell = document.createElement("div");
					cell.className = "cell";
					row.appendChild(cell);
				}
				board.appendChild(row);
			}
		}
        // Обработка нажатия кнопки "Отправить"
        submitButton.addEventListener("click", () => {
            const guess = guessInput.value.toUpperCase();
            guessInput.value = "";
            checkGuess(guess);
        });

        // Обработка нажатия кнопки "Начать сначала"
		restartButton.addEventListener("click", () => {
			const users = JSON.parse(localStorage.getItem("users")) || {};
			if (currentUser && users[currentUser]) {
				users[currentUser].totalGames++; // Увеличиваем количество игр
				localStorage.setItem("users", JSON.stringify(users));
				totalGames.textContent = users[currentUser].totalGames; // Обновляем интерфейс
			}
			generateNewWord(); // Генерация нового слова
		});

        // Обработка нажатия кнопки "Личная статистика"
		statsButton.addEventListener("click", () => {
			const users = JSON.parse(localStorage.getItem("users")) || {};
			if (currentUser && users[currentUser]) {
				statsUsername.textContent = `Пользователь: ${currentUser}`;
				totalGames.textContent = users[currentUser].totalGames; // Обновляем количество игр
				statsRecord.textContent = users[currentUser].record;
				container.style.display = "none"; // Скрываем игровой интерфейс
				statsPage.style.display = "block"; // Показываем страницу статистики
			}
		});

        // Обработка нажатия кнопки "Назад" на странице статистики
        backButton.addEventListener("click", () => {
            statsPage.style.display = "none"; // Скрываем страницу статистики
            container.style.display = "block"; // Показываем игровой интерфейс
        });

        // Обработка выбора языка
        languageSelector.addEventListener("change", (event) => {
            currentLanguage = event.target.value;
            if (currentLanguage === "ru") {
                fileInput.accept = ".txt";
                fileInput.setAttribute("placeholder", "Загрузите words_ru.txt");
            } else {
                fileInput.accept = ".txt";
                fileInput.setAttribute("placeholder", "Загрузите words_en.txt");
            }
        });
		
		// Обработка выбора темы оформления
		function change_theme(value) {
		  switch(value){
			case 'standart':
			  document.documentElement.removeAttribute("theme");
			  localStorage.removeItem('theme');

			  break;
			default:
			 document.documentElement.setAttribute("theme", value);
			  localStorage.setItem('theme', 1);
		  }  
		};
