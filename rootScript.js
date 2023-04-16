var homeButton = document.querySelector("#home-button");
var bestButton = document.querySelector("#best-button");
var profileButton = document.querySelector("#profile-button");

var home = document.querySelector("#home");
var best = document.querySelector("#best");
var profile = document.querySelector("#profile");

homeButton.addEventListener("click", function () {
	homeButton.classList.add("active");
	bestButton.classList.remove("active");
	profileButton.classList.remove("active");

	home.classList.add("active");
	best.classList.remove("active");
	profile.classList.remove("active");
});

bestButton.addEventListener("click", function () {
	homeButton.classList.remove("active");
	bestButton.classList.add("active");
	profileButton.classList.remove("active");

	home.classList.remove("active");
	best.classList.add("active");
	profile.classList.remove("active");
});

profileButton.addEventListener("click", function () {
	homeButton.classList.remove("active");
	bestButton.classList.remove("active");
	profileButton.classList.add("active");

	home.classList.remove("active");
	best.classList.remove("active");
	profile.classList.add("active");
});
