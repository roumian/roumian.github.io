function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const loginContainer = document.querySelector("#login-container");
const registerContainer = document.querySelector("#register-container");
const profileContainer = document.querySelector("#profile-container");

const usernameLoginInput = document.querySelector("#username-login-input");
const passwordLoginInput = document.querySelector("#password-login-input");
const loginButton = document.querySelector("#login-button");
const loginError = document.querySelector("#login-error");
const takeToRegister = document.querySelector("#take-to-register-button");

loginButton.addEventListener("click", (e) => {
	if (usernameLoginInput.value === "" || passwordLoginInput.value === "") {
		loginError.textContent = "Please fill in all fields";
		return;
	}

	fetch("http://localhost:3000/profile/login", {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			username: usernameLoginInput.value,
			password: passwordLoginInput.value
		})
	})
		.then((res) => {
			console.log(res.headers);
			return res.json();
		})
		.then((data) => {
			if (data.success) {
				//setCookie("token", data.success.data.token, 1);
				loginError.textContent = "";
				console.log("success");
				usernameLoginInput.value = "";
				passwordLoginInput.value = "";
				openProfile({ username: data.success.data.username, email: data.success.data.email });
			} else if (data.error) {
				loginError.textContent = data.error.message;
			}
		})
		.catch((error) => {
			loginError.textContent = error;
		});
});

takeToRegister.addEventListener("click", (e) => {
	loginContainer.classList.remove("active");
	registerContainer.classList.add("active");
});

const usernameRegisterInput = document.querySelector("#username-register-input");
const passwordRegisterInput = document.querySelector("#password-register-input");
const emailRegisterInput = document.querySelector("#email-register-input");
const repeatPasswordRegisterInput = document.querySelector("#repeat-password-register-input");
const registerButton = document.querySelector("#register-button");
const registerError = document.querySelector("#register-error");
const takeToLogin = document.querySelector("#take-to-login-button");

registerButton.addEventListener("click", (e) => {
	if (usernameRegisterInput.value === "" || passwordRegisterInput.value === "" || emailRegisterInput.value === "") {
		registerError.textContent = "Please fill in all fields";
		return;
	}

	if (passwordRegisterInput.value !== repeatPasswordRegisterInput.value) {
		registerError.textContent = "Passwords do not match";
		return;
	}

	fetch("http://localhost:3000/profile/register", {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			username: usernameRegisterInput.value,
			password: passwordRegisterInput.value,
			email: emailRegisterInput.value
		})
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			if (data.success) {
				setCookie("token", data.success.data.token, 1);
				registerError.textContent = "";
				console.log("success");
				usernameRegisterInput.value = "";
				passwordRegisterInput.value = "";
				emailRegisterInput.value = "";
				repeatPasswordRegisterInput.value = "";
				openProfile({ username: data.success.data.username, email: data.success.data.email });
			} else if (data.error) {
				registerError.textContent = data.error.message;
				console.log("server error");
			}
		})
		.catch((error) => {
			registerError.textContent = error;
			console.log("client error");
		});
});

takeToLogin.addEventListener("click", (e) => {
	registerContainer.classList.remove("active");
	loginContainer.classList.add("active");
});

const logoutButton = document.querySelector("#logout-button");

logoutButton.addEventListener("click", (e) => {
	setCookie("token", "", -1);

	registerContainer.classList.remove("active");
	loginContainer.classList.add("active");
	profileContainer.classList.remove("active");
});

function openProfile(user) {
	loginContainer.classList.remove("active");
	profileContainer.classList.add("active");
	registerContainer.classList.remove("active");

	const usernameProfile = document.querySelector("#profile-username");
	const emailProfile = document.querySelector("#profile-email");

	usernameProfile.textContent = "Username: " + user.username;
	emailProfile.textContent = "Email: " + user.email;
}
