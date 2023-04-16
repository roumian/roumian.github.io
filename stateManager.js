var Data = {};

const container = document.querySelector("#container");
const loadingContainer = document.querySelector("#loading-container");

container.classList.remove("active");
loadingContainer.classList.add("active");

function deleteAllCookies() {
	const cookies = document.cookie.split(";");

	for (let i = 0; i < cookies.length; i++) {
		const cookie = cookies[i];
		const eqPos = cookie.indexOf("=");
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
	}
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(";").shift();
}

function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

if (document.cookie.includes("token=")) {
	Data.token = getCookie("token");
} else {
	Data.token = "";
}

fetch("http://localhost:3000/home", {
	method: "POST",
	credentials: "include",
	headers: {
		"Content-Type": "application/json"
	},
	body: JSON.stringify({
		token: Data.token,
		username: usernameLoginInput.value,
		password: passwordLoginInput.value
	})
})
	.then((res) => {
		return res.json();
	})
	.then((data) => {
		if (data.success) {
			if (data.success.data.authenticated) {
				Data.currentState = "loggedIn";
			} else {
				Data.currentState = "loggedOut";
				setCookie("token", "", -1);
			}

			Data.user = data.success.data.user;
			Data.chats = data.success.data.chats;

			populateProfile(Data.currentState === "loggedIn", Data.user);

			container.classList.add("active");
			loadingContainer.classList.remove("active");
		} else if (data.error) {
			//location.reload();
			console.log(data.error.message);
		}
	})
	.catch((error) => {
		//location.reload();
		console.log(error);
	});

function populateProfile(authenticated, user) {
	const profileContainer = document.querySelector("#profile-container");
	const loginContainer = document.querySelector("#login-container");
	const registerContainer = document.querySelector("#register-container");

	if (authenticated) {
		const profileUsername = document.querySelector("#profile-username");
		const profileEmail = document.querySelector("#profile-email");

		profileUsername.textContent = "Username: " + user.username;
		profileEmail.textContent = "Email: " + user.email;

		profileContainer.classList.add("active");
		loginContainer.classList.remove("active");
		registerContainer.classList.remove("active");
	} else {
		profileContainer.classList.remove("active");
		loginContainer.classList.add("active");
		registerContainer.classList.remove("active");
	}
}
