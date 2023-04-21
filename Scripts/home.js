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
				} else if (data.success) {
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

function GenerateFeedItem(chat) {
	return `
	<div class="feed-item" value="${chat.uuid}">
		<div class="feed-item-username-date-container">
			<div class="feed-item-username-container">
				<p class="feed-item-username">${chat.username}</p>
			</div>
			<div class="feed-item-date-container">
				<p class="feed-item-date">${chat.timestamp}</p>
			</div>
		</div>
		<div class="feed-item-text-container">
			<p class="feed-item-text">${chat.value}</p>
		</div>
		<div class="feed-item-buttons">
			<div class="feed-item-button-container">
				<button class="feed-item-button like-button">
					<svg xmlns="http://www.w3.org/2000/svg" stoke="white" stroke-width="1" width="18" height="18" viewBox="0 0 24 24" style="fill: #6f7479"><path d="M20 8h-5.612l1.123-3.367c.202-.608.1-1.282-.275-1.802S14.253 2 13.612 2H12c-.297 0-.578.132-.769.36L6.531 8H4c-1.103 0-2 .897-2 2v9c0 1.103.897 2 2 2h13.307a2.01 2.01 0 0 0 1.873-1.298l2.757-7.351A1 1 0 0 0 22 12v-2c0-1.103-.897-2-2-2zM4 10h2v9H4v-9zm16 1.819L17.307 19H8V9.362L12.468 4h1.146l-1.562 4.683A.998.998 0 0 0 13 10h7v1.819z"></path></svg>
				</button>
				<p>${chat.likes.length}</p>
			</div>
			<div class="feed-item-button-container">
				<button class="feed-item-button dislike-button">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style="fill: #6f7479"><path d="M20 3H6.693A2.01 2.01 0 0 0 4.82 4.298l-2.757 7.351A1 1 0 0 0 2 12v2c0 1.103.897 2 2 2h5.612L8.49 19.367a2.004 2.004 0 0 0 .274 1.802c.376.52.982.831 1.624.831H12c.297 0 .578-.132.769-.36l4.7-5.64H20c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-8.469 17h-1.145l1.562-4.684A1 1 0 0 0 11 14H4v-1.819L6.693 5H16v9.638L11.531 20zM18 14V5h2l.001 9H18z"></path></svg>
				</button>
				<p>${chat.dislikes.length}</p>
			</div>
			<div class="feed-item-button-container">
				<button class="feed-item-button comment-button">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" style="fill: #6f7479"><path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14H6.667L4 18V4h16v12z"></path></svg>
				</button>
				<p>${chat.comments.length}</p>
			</div>
		</div>
		<div class="feed-item-comments-container">
			<div class="feed-item-comment-write">
				<textarea class="textarea feed-item-comment-write-textarea" rows="1" placeholder="Write a comment..."></textarea>
				<div class="feed-item-comment-write-settings">
					<p class="character-count feed-item-comment-write-character-count">0/500</p>
					<button class="btn">
						<div class="loader"></div>
						Reply
					</button>
				</div>
			</div>

			${GenerateComments(chat.comments)}

		</div>
	</div>`;
}

function GenerateComments(comments) {
	if (!comments || comments.length == 0)
		return `
			<div class="feed-item-comment">
				<div class="feed-item-no-comments-text-container">
					<p class="feed-item-no-comments-text">no comments yet</p>
				</div>
			</div>
			`;

	var commentsHtml = "";
	for (var i = 0; i < comments.length; i++) {
		commentsHtml += `
			<div class="feed-item-comment">
				<div class="feed-item-comment-username-date-container">
					<div class="feed-item-comment-username-container">
						<p class="feed-item-comment-username">${comments[i].username}</p>
					</div>
					<div class="feed-item-comment-date-container">
						<p class="feed-item-comment-date">${comments[i].timstamp}</p>
					</div>
				</div>
				<div class="feed-item-comment-text-container">
					<p class="feed-item-comment-text">${comments[i].value}</p>
				</div>
			</div>
			`;
	}
	return commentsHtml;
}
