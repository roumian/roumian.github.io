const textareas = document.querySelectorAll(".textarea");
const commentButtons = document.querySelectorAll(".comment-button");
const characterLimit = 500;

onStart();

function onStart() {
	for (let i = 0; i < textareas.length; i++) {
		let textarea = textareas[i];
		textarea.attributes.maxLength = 10;
		textarea.style.height = 0;
		textarea.style.height = textarea.scrollHeight + 20 + "px";

		let characterCount = textarea.nextElementSibling.querySelector(".character-count");

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
}

for (let i = 0; i < textareas.length; i++) {
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
	commentButtons[i].addEventListener("click", (e) => {
		let button = commentButtons[i];
		console.log(button);
		console.log(button.parentElement.parentElement.parentElement);
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
