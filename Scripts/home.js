const feed = document.querySelector("#feed");
const characterLimit = 500;

function OnStart() {
	const textareas = home.querySelectorAll(".textarea");
	const commentButtons = home.querySelectorAll(".comment-button");

	for (var i = 0; i < textareas.length; i++) {
		var textarea = textareas[i];
		textarea.attributes.maxLength = 10;
		textarea.style.height = 0;
		textarea.style.height = textarea.scrollHeight + 20 + "px";

		var characterCount = textareas[i].nextElementSibling.querySelector(".character-count");

		if (textarea.value.length >= characterLimit) {
			characterCount.style.color = "var(--red-color)";
		} else {
			characterCount.style.color = "var(--gray-color)";
		}

		if (textarea.value.length > characterLimit) {
			textarea.value = textarea.value.substring(0, characterLimit);
		}

		characterCount.innerHTML = textarea.value.length + "/" + characterLimit;
	}

	for (let i = 0; i < textareas.length; i++) {
		textareas[i].removeEventListener("input", (e) => {});
		textareas[i].addEventListener("input", (e) => {
			let textarea = e.target;
			textarea.style.height = 0;
			textarea.style.height = textarea.scrollHeight + 20 + "px";

			let characterCount = textarea.nextElementSibling.querySelector(".character-count");

			if (textarea.value.length >= characterLimit) {
				characterCount.style.color = "var(--red-color)";
			} else {
				characterCount.style.color = "var(--gray-color)";
			}

			if (textarea.value.length >= characterLimit) {
				textarea.value = textarea.value.substring(0, characterLimit);
			}

			characterCount.innerHTML = textarea.value.length + "/" + characterLimit;
		});
	}

	for (let i = 0; i < commentButtons.length; i++) {
		console.log(commentButtons[i]);
		commentButtons[i].removeEventListener("click", (e) => {});
		commentButtons[i].addEventListener("click", (e) => {
			console.log("clicked");
			let button = commentButtons[i];
			let commentsContainer = button.parentElement.parentElement.parentElement.querySelector(".feed-item-comments-container");

			if (button.classList.contains("active")) {
				button.classList.remove("active");
				commentsContainer.classList.remove("active");
			} else {
				button.classList.add("active");
				commentsContainer.classList.add("active");
			}
		});
	}

	const writeButton = home.querySelector("#main-write-button");
	const writeTextarea = home.querySelector("#main-write-textarea");

	writeButton.removeEventListener("click", (e) => {});
	writeButton.addEventListener("click", (e) => {
		e.preventDefault();

		if (writeTextarea.value.length > characterLimit) {
			writeTextarea.value = writeTextarea.value.substring(0, characterLimit);
		}

		if (writeTextarea.value.length < 1) {
			return console.log("No text to send");
		}

		writeButton.classList.add("loading");

		fetch(server + "/home/send", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				message: writeTextarea.value
			})
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				if (data.success) {
					console.log(data.success.message);
					writeButton.classList.remove("loading");
					chats = data.success.data.chats;
					writeTextarea.value = "";
					OpenHome();
				} else if (data.error) {
					console.log(data.error.message);
					writeButton.classList.remove("loading");
				}
			})
			.catch((error) => {
				console.log(error);
				writeButton.classList.remove("loading");
			});
	});
}

function OpenHome() {
	LoadChats();
	OnStart();
}

function LoadChats() {
	if (!chats) return console.log("No chats to load");

	feed.innerHTML = "";

	for (var i = 0; i < chats.length; i++) {
		feed.innerHTML += GenerateFeedItem(chats[i]);
	}
}
