const css = require('../css/app.scss');
require("font-awesome-sass-loader");

function $log(x) {
	return console.log(x);
}

function $select(x){
	return document.querySelector(x);
}

function $selectAll(x) {
	return document.querySelectorAll(x);
}

function $event(x, y, z, i) {
	return x.addEventListener(y, z, i);
}


$event(window, 'DOMContentLoaded', windowOnLoad, false)

function windowOnLoad() {
  // get basic url and size
	let secureUrl = `https://api.themoviedb.org/3/`;
	let imgUrl = `https://image.tmdb.org/t/p/`;
	let imgSize = `w185`;
	// array 0:avengers, 1:blackpather, 2:thor3
	// 3:doctor strange, 4:spiderman, 5:captain america
	let movieID = [299536, 284054, 284053, 284052, 315635, 271110];
	let selectimg = $selectAll('.card-img');
  // make node list into array;
	let getImgList = [...selectimg];
	let resultList = [];
  // make 2 arrays into a 2-dimensional array
	for (let i = 0; i < movieID.length ; i++) {
		resultList.push( [ movieID[i], getImgList[i] ] );
	}

  resultList.map( i => {
			let [ x, y ] = i;
			let xhr = new XMLHttpRequest();
			let movieUrls = `${secureUrl}movie/${x}?api_key=${myAPI}`;

			xhr.open('GET', movieUrls, true);

			xhr.onload = function() {
				if (this.status === 200) {
					let movieOutputs = JSON.parse(this.responseText);
					let getPath = movieOutputs.poster_path;
					let getMovieUrls = `${imgUrl}${imgSize}${getPath}`
					y.src = getMovieUrls;
				}
			}

			xhr.send();
		}
	);
}


// for testing apikey
const btnGetApi = $select('#get-btn');
const btnSearchApi = $select('#search-btn');
const btnConfig = $select('#config-btn');

$event(btnGetApi, 'click', getApi);
$event(btnSearchApi, 'click', searchApi);
$event(btnConfig, 'click', configApi);

function configApi() {
	const xhr = new XMLHttpRequest();
	const secureURL = 'https://api.themoviedb.org/3/';
	const myURL = `${secureURL}configuration?api_key=${myAPI}`;

	xhr.open('GET', myURL, true);
	xhr.onload = function() {
		if (this.status === 200) {
			let output = JSON.parse(this.responseText)
			console.log(output.images);
		}
	}

	xhr.send()
}

function getApi() {
	const xhr = new XMLHttpRequest();
	const movieID = 284053;
	const secureURL = 'https://api.themoviedb.org/3/';
	const myURL = `${secureURL}movie/${movieID}?api_key=${myAPI}`;
	const imgURL = `https://image.tmdb.org/t/p/`;
	const imgSize = `w342`;

	xhr.open('GET', myURL, true);
	xhr.onload = function() {
		if (this.status === 200) {
			let output = JSON.parse(this.responseText)
			let outputImgURL = `${imgURL}${imgSize}${output.poster_path}`
			console.log(outputImgURL);
		}
	}

	xhr.send()
}



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
