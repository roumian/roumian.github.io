const textareas = document.querySelectorAll(".textarea");
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
