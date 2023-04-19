const profile = document.querySelector("#profile");

const profileLoader = document.querySelector("#profile-loader");

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

	loginButton.classList.add("loading");

	fetch(server + "/profile/login", {
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
				loginError.textContent = "";
				usernameLoginInput.value = "";
				passwordLoginInput.value = "";

				user = data.success.data.user;
				OpenProfile();
				loginButton.classList.remove("loading");
			} else if (data.error) {
				loginError.textContent = data.error.message;
				loginButton.classList.remove("loading");
			}
		})
		.catch((error) => {
			loginError.textContent = error;
			loginButton.classList.remove("loading");
		});
});

takeToRegister.addEventListener("click", OpenRegister);

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

	fetch(server + "/profile/register", {
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
				loginError.textContent = "";
				usernameLoginInput.value = "";
				passwordLoginInput.value = "";

				user = data.success.data.user;
				OpenProfile();
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

takeToLogin.addEventListener("click", OpenLogin);

const logoutButton = document.querySelector("#logout-button");

logoutButton.addEventListener("click", (e) => {
	fetch(server + "/profile/logout", {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		}
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			if (data.success) {
				OpenLogin();
				user = null;
			} else if (data.error) {
				console.log("server error");
			}
		})
		.catch((error) => {
			console.log("client error");
		});
});

const usernameProfile = document.querySelector("#profile-username");
const emailProfile = document.querySelector("#profile-email");
const bioProfile = document.querySelector("#profile-bio");
const bioSaveButton = document.querySelector("#bio-save-button");

bioSaveButton.addEventListener("click", (e) => {
	bioSaveButton.classList.add("loading");

	fetch(server + "/profile/update", {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			bio: bioProfile.textContent
		})
	})
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			if (data.success) {
				user = data.success.data.user;
				bioProfile.textContent = user.bio;
				bioSaveButton.classList.remove("loading");
			} else if (data.error) {
				bioSaveButton.classList.remove("loading");
				console.log("server error");
			}
		})
		.catch((error) => {
			bioSaveButton.classList.remove("loading");
			console.log("client error");
		});
});

function OpenProfile() {
	if (!user) {
		ShowProfileLoading();

		fetch(server + "/profile", {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				if (data.success) {
					if (data.success.data.user) {
						user = data.success.data.user;

						loginContainer.classList.remove("active");
						profileContainer.classList.add("active");
						registerContainer.classList.remove("active");
						profile.classList.remove("credentials-profile");
						profile.classList.add("profile");

						usernameProfile.textContent = user.username;
						emailProfile.textContent = user.email;
						bioProfile.textContent = user.bio;
						RemoveProfileLoading();
					} else {
						user = null;
						OpenLogin();
						RemoveProfileLoading();
					}
				} else if (data.error) {
					console.log(data.error.message);
					OpenLogin();
					RemoveProfileLoading();
				}
			})
			.catch((error) => {
				console.log(error);
				OpenLogin();
				RemoveProfileLoading();
			});
	} else {
		loginContainer.classList.remove("active");
		profileContainer.classList.add("active");
		registerContainer.classList.remove("active");
		profile.classList.remove("credentials-profile");
		profile.classList.add("profile");

		usernameProfile.textContent = user.username;
		emailProfile.textContent = user.email;
		bioProfile.textContent = user.bio;
	}
}

function OpenLogin() {
	loginContainer.classList.add("active");
	profileContainer.classList.remove("active");
	registerContainer.classList.remove("active");
	profile.classList.add("credentials-profile");
	profile.classList.remove("profile");
}

function OpenRegister() {
	registerContainer.classList.add("active");
	loginContainer.classList.remove("active");
	profileContainer.classList.remove("active");
	profile.classList.add("credentials-profile");
	profile.classList.remove("profile");
}

function ShowProfileLoading() {
	profileLoader.classList.add("active");
	loginContainer.classList.remove("active");
	profileContainer.classList.remove("active");
	registerContainer.classList.remove("active");
}

function RemoveProfileLoading() {
	profileLoader.classList.remove("active");
}
