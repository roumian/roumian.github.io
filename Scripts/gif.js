const tenorAPIKey = "AIzaSyAGITfLhNR50rrj32CnfgslpQtqPF5Bvkw";
const tenorAPIClientKey = "RoumiehHub";
const searchTerm = "excited";
const limit = 20;

const gifWindow = document.querySelector("#gif-window");

const addGifButton = document.querySelector("#home-gif-button");

addGifButton.addEventListener("click", () => {
	ActivateComponent(gifWindow);
	gifSearchButton.classList.add("loading");
	fetch(`https://tenor.googleapis.com/v2/featured?key=${tenorAPIKey}&client_key=${tenorAPIClientKey}&limit=${limit}`)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			lastGifSearch = data.results;

			var gifs = [];
			for (var i = 0; i < data.results.length; i++) {
				gifs.push(data.results[i].media_formats.tinygif.url);
			}

			RepopulateGifs(gifs);
			gifSearchButton.classList.remove("loading");
		})
		.catch((error) => {
			console.log(error);
			gifSearchButton.classList.remove("loading");
		});

	document.body.style.overflow = "hidden";
});

const closeGifWindow = gifWindow.querySelector("#gif-window-close");

closeGifWindow.addEventListener("click", () => {
	DeactivateComponent(gifWindow);
	document.body.style.overflow = "auto";
});

const gifSearchButton = gifWindow.querySelector("#gif-search-button");
const gifSearchInput = gifWindow.querySelector("#gif-search-input");

var lastGifSearch = null;

gifSearchButton.addEventListener("click", () => {
	gifSearchButton.classList.add("loading");

	if (gifSearchInput.value == "") {
		fetch(`https://tenor.googleapis.com/v2/featured?key=${tenorAPIKey}&client_key=${tenorAPIClientKey}&limit=${limit}`)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				lastGifSearch = data.results;

				var gifs = [];
				for (var i = 0; i < data.results.length; i++) {
					gifs.push(data.results[i].media_formats.tinygif.url);
				}
				RepopulateGifs(gifs);

				gifSearchButton.classList.remove("loading");
			})
			.catch((error) => {
				console.log(error);
				gifSearchButton.classList.remove("loading");
			});
		return;
	}

	fetch(`https://tenor.googleapis.com/v2/search?key=${tenorAPIKey}&client_key=${tenorAPIClientKey}&limit=${limit}&q=${gifSearchInput.value}`)
		.then((res) => {
			return res.json();
		})
		.then((data) => {
			lastGifSearch = data.results;

			var gifs = [];
			for (var i = 0; i < data.results.length; i++) {
				gifs.push(data.results[i].media_formats.tinygif.url);
			}

			RepopulateGifs(gifs);
			gifSearchButton.classList.remove("loading");
		})
		.catch((error) => {
			console.log(error);
			gifSearchButton.classList.remove("loading");
		});
});

function RepopulateGifs(gifs) {
	const windowGifContainer = gifWindow.querySelector(".window-gif-container");

	var value = "";

	var columns = 4;
	if (screen.width < 500) columns = 2;

	for (var i = 0; i < columns; i++) {
		value += `<div class="window-column-gif-container">`;

		for (var j = 0; j < gifs.length / columns; j++) {
			value += `
            <div class="window-gif-item">
                <img src="${gifs[i * columns + j]}" />
            </div>
            `;
		}

		value += `</div>`;
	}

	windowGifContainer.innerHTML = value;
}
