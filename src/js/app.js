const css = require('../css/app.scss');
require("font-awesome-sass-loader");


function $select(x){
	return document.querySelector(x);
}



// for testing apikey
const btnGetApi = $select('#get-btn')
const btnSearchApi = $select('#search-btn')

btnGetApi.addEventListener('click', getApi);
btnSearchApi.addEventListener('click', searchApi);

// avengers infinity id:299536
// black panther id:284054
// thor 3 id:284053
// doctor strange id:284052
// spiderman homecoming id:315635
// captain america civil war id:271110

function getApi() {
	const xhr = new XMLHttpRequest();
	const movieID = 271110
	const myURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=${myAPI}`;

	xhr.open('GET', myURL, true);
	xhr.onload = function() {
		if (this.status === 200) {
			let output = JSON.parse(this.responseText)
			console.log(output);
		}
	}

	xhr.send()
}


// black panther
function searchApi() {
	const xhr = new XMLHttpRequest();
	const secureURL = `https://api.themoviedb.org/3/`
	const myURL = `${secureURL}search/movie?api_key=${myAPI}&query=captain+america`;

	xhr.open('GET', myURL, true);
	xhr.onload = function() {
		if (this.status === 200) {
			let output = JSON.parse(this.responseText)
			console.log(output);
		}
	}

	xhr.send()
}
