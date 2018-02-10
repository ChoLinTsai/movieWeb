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

// make a 2d array
function get2dArray(x, y) {
	let resultArray = [];
	for (let i = 0; i < x.length; i++) {
		resultArray.push( [ x[i], y[i] ]);
	}
	return resultArray;
}

// array 0:avengers, 1:blackpather, 2:thor3
// 3:doctor strange, 4:spiderman, 5:captain america
const marvelMovieID = [299536, 284054, 284053, 284052, 315635, 271110];
// DC array 0: justice league, 1: aquaman, 2: wonder woman
// 3: BVS, 4:sucide squard 5: man of steel
const dcmovieID = [141052, 297802, 297762, 209112, 297761, 49521];
// get marvel or dc movieID 50/50 chance;
const movieID = Math.random().toFixed(1) > 0.5 ? marvelMovieID : dcmovieID;

// get basic url and size
const secureUrl = `https://api.themoviedb.org/3/`;
const imgUrl = `https://image.tmdb.org/t/p/`;
const imgSize = `w185`;

// get footer content el
const footerContent = $select('#footer-content');
// when page loaded call windowOnLoad right away
$event(window, 'DOMContentLoaded', windowOnLoad, false)

// when this function is called, it will get header and main section figs
function windowOnLoad() {
	// get elements and put them into array;
	let getImgList = [...$selectAll('.card-img')];
	let getHeaderFigs = [...$selectAll('.header-figs')];
  // get card title and put them into array
	let getCardTitle = [...$selectAll('.card-title')]
  // get card description and array them
	let getCardDesc = [...$selectAll('.card-desc')];
  // make movieID and getHeaderFigs into 2d array
	let headerResultList = get2dArray(movieID, getHeaderFigs);
  // make movieID and getImgList into 2d array
	let mainResultList = get2dArray(movieID, getImgList);
  // make movieID, title, desc into 2d array
	let cardContentList = make2dAryWith3eles(movieID, getCardTitle, getCardDesc);

  // make 2d array with 3 elements
	function make2dAryWith3eles(x, y, z) {
		let resultArray = [];
		for (let i = 0; i < x.length; i++) {
			resultArray.push( [ x[i], y[i], z[i] ]);
		}
		return resultArray;
	}


  // check copyright
	if (movieID == marvelMovieID) {
		footerContent.innerHTML = `Copyright &copy; Marvel`;
	} else {
		footerContent.innerHTML = `Copyright &copy; DC`;
	}

  // map through movieID and make title into 2 lines if there is a semicolon
	cardContentList.map( i => {
		let [ x, y, z ] = i;
		let movieUrls = `${secureUrl}movie/${x}?api_key=${myAPI}`;
		let xhr = new XMLHttpRequest();

		xhr.open('GET', movieUrls, true);

		xhr.onload = function() {
			if (xhr.status === 200) {
				let movieOutputs = JSON.parse(this.responseText);
				let getMovieTitle = movieOutputs.title;
				let hasSemicolon = /:/gi.test(getMovieTitle);
				if (hasSemicolon) {
					let [ title, desc ] = getMovieTitle.split(': ')
					y.innerHTML = title;
					z.innerHTML = desc;
				} else {
					y.innerHTML = getMovieTitle;
				}
			}
		}
		xhr.send();
	})


  // map through all 6 header carousels to get figs
	headerResultList.map( i => {
		let [ x, y ] = i;
		let movieUrls = `${secureUrl}movie/${x}?api_key=${myAPI}`;
		let xhr = new XMLHttpRequest();

		xhr.open('GET', movieUrls, true);

		xhr.onload = function() {
			if (xhr.status === 200) {
				let movieOutputs = JSON.parse(this.responseText);
				let getHeaderPath = `${imgUrl}original${movieOutputs.backdrop_path}`;
				y.style.backgroundImage = `url('${getHeaderPath}')`;
			}
		}

		xhr.send()
	})


  // get main section 6 poster imgs
	mainResultList.map( i => {
			let [ x, y ] = i;
			let movieUrls = `${secureUrl}movie/${x}?api_key=${myAPI}`;
			let xhr = new XMLHttpRequest();

			xhr.open('GET', movieUrls, true);

			xhr.onload = function() {
				if (xhr.status === 200) {
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
// function windowOnLoad ends here


// get input element
const getInput = $select('#movie-search');
// get search result content
const resultContent = $select('#resultContent');

// keyup event to call movieSearch function
$event(getInput, 'keyup', movieSearch);


// get input value to search movie title
function movieSearch(e) {
	let resultContent = $select('#resultContent');
	let inputValue = e.target.value;
	let xhr = new XMLHttpRequest();
	let secureUrl = `https://api.themoviedb.org/3/`;
	let myUrl = `${secureUrl}search/movie?api_key=${myAPI}&query=${inputValue}`;

	if (inputValue === '' || inputValue === ' ') {
		return
	}

	let searchUrl = myUrl;

	xhr.open('GET', searchUrl, true);

	xhr.onload = () => {

		if (xhr.status === 200) {
			let searchOutput = JSON.parse(xhr.responseText);
			let arrayResult = [];
			let resultToHtml = searchOutput.results.slice(0,10).map( i => {
				arrayResult.push(i);
				return `
					<li class="resultTitle" data-toggle="modal" data-target="#movieModal">${i.title}
					</li>
				`;
			}).join('');
			resultContent.innerHTML = resultToHtml;

			let isClicked = false;
			let resultTitle = [...$selectAll('.resultTitle')];

			resultTitle.map( i => $event(i, 'click', () => {
						$select('#movieModalImg').src = '';
						let movieIndex = resultTitle.indexOf(i);
						let getMovieID = arrayResult[movieIndex].id;
						let getMovieUrl = `${secureUrl}movie/${getMovieID}?api_key=${myAPI}`;
						let xhr = new XMLHttpRequest();

						xhr.open('GET', getMovieUrl, true);
						xhr.onload = () => {
							if (xhr.status === 200) {
								let output = JSON.parse(xhr.responseText);
								let getPosterPath = output.poster_path;
								let getModalPoster = `${imgUrl}${modalPosterSize}${getPosterPath}`;
								let setMillion = 1000000;
								let setBillion = 1000000000;
								let budgetDivide = output.budget > setBillion ? setBillion : setMillion;
								let revenueDivide = output.revenue > setBillion ? setBillion : setMillion;
								let budgetUnit = output.budget > setBillion ? `Billion(s)` : `Million(s)`
								let revenueUnit = output.revenue > setBillion ? `Billion(s)` : `Million(s)`;

								$select('#movieModalImg').src = getModalPoster;

								let hasSemicolon = /:/gi.test(output.original_title);
								if (hasSemicolon) {
									let [ title, desc ] = output.original_title.split(': ')
									$select('#movieModalTitle').innerHTML = title;
									$select('#movieModalDesc').innerHTML = desc;
								} else {
									$select('#movieModalDesc').innerHTML = '';
									$select('#movieModalTitle').innerHTML = output.original_title;
								}

								$select('#release-date').innerHTML = output.release_date;
								$select('#movie-status').innerHTML = output.status;

								$select('#movie-budget').innerHTML = `${(output.budget/budgetDivide).toFixed(2)} ${budgetUnit}`;

								$select('#movie-revenue').innerHTML = `${(output.revenue/revenueDivide).toFixed(2)} ${revenueUnit}`

								$select('#movie-rating').innerHTML = output.vote_average;
								$select('#movie-votes').innerHTML = output.vote_count;
							}
						}
						xhr.send()
					}
				)
			)

			// input focusout to remove resultContent
			$event(window, 'click', () => {
				let isInputFocus = (document.activeElement === getInput);

				if (isInputFocus) {
					return
				}

				resultContent.innerHTML = '';
			})

		}
	}

	xhr.send();
}
// search movie function ends here


// get all details btns
const detailsBtns = [...$selectAll('.btn-details')];
const modalPosterSize = 'w185';
// set function click
detailsBtns.map( i => $event(i, 'click', checkindex))

// get indexOf clicked detailsBtns and get all modal content
function checkindex() {
	let checkBtnIndex = detailsBtns.indexOf(this)
	let getMovieID = movieID[checkBtnIndex];
	let getMovieUrl = `${secureUrl}movie/${getMovieID}?api_key=${myAPI}`;
	let xhr = new XMLHttpRequest();

	xhr.open('GET', getMovieUrl, true);
	xhr.onload = () => {
		if (xhr.status === 200) {
			let output = JSON.parse(xhr.responseText);
			let getPosterPath = output.poster_path;
			let getModalPoster = `${imgUrl}${modalPosterSize}${getPosterPath}`;
			let setMillion = 1000000;
			let setBillion = 1000000000;
			let budgetDivide = output.budget > setBillion ? setBillion : setMillion;
			let revenueDivide = output.revenue > setBillion ? setBillion : setMillion;
			let budgetUnit = output.budget > setBillion ? `Billion(s)` : `Million(s)`
			let revenueUnit = output.revenue > setBillion ? `Billion(s)` : `Million(s)`;

			$select('#movieModalImg').src = getModalPoster;


			let hasSemicolon = /:/gi.test(output.original_title);
			if (hasSemicolon) {
				let [ title, desc ] = output.original_title.split(': ')
				$select('#movieModalTitle').innerHTML = title;
				$select('#movieModalDesc').innerHTML = desc;
			} else {
				$select('#movieModalDesc').innerHTML = '';
				$select('#movieModalTitle').innerHTML = output.original_title;
			}

			$select('#release-date').innerHTML = output.release_date;
			$select('#movie-status').innerHTML = output.status;

			$select('#movie-budget').innerHTML = `${(output.budget/budgetDivide).toFixed(2)} ${budgetUnit}`;

			$select('#movie-revenue').innerHTML = `${(output.revenue/revenueDivide).toFixed(2)} ${revenueUnit}`

			$select('#movie-rating').innerHTML = output.vote_average;
			$select('#movie-votes').innerHTML = output.vote_count;
		}
	}
	xhr.send();
}
