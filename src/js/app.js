const css = require('../css/app.scss');

// listen window scroll event
window.addEventListener('scroll', () => {
	// get window scrollY value
	let wScrollY = window.top.scrollY;
	// set event trigger value
	let triggerHeight = 200;
	let arrowTriggerHeight = 100;
	// get #header h1 and .header-h1-slide-right
	let headerH1 = document.querySelector('#header-h1');
	let h1SlideRight = 'header-h1-slide-right';

	// get #header-p and .header-p-slide-right
	let headerP = document.querySelector('#header-p');
	let pSlideRight = 'header-p-slide-right';

  // get #header-arrow and arrow
	let headerArrow = document.querySelector('#header-arrow');
	let arrowFadeOut = 'header-arrow-fade-out'

	// check if wScroll >|< triggerHeight to add|remove .h1SlideRight .pSlideRight
	if( wScrollY >= triggerHeight ) {
		headerH1.classList.add(h1SlideRight);
		headerP.classList.add(pSlideRight);
	} else {
		headerH1.classList.remove(h1SlideRight);
		headerP.classList.remove(pSlideRight);
	}

  // check if wScroll > arrowTriggerHeight to fade out #header-arrow
	if ( wScrollY > arrowTriggerHeight ) {
		headerArrow.classList.add(arrowFadeOut);
	} else {
		headerArrow.classList.remove(arrowFadeOut);
	}

	console.log(wScrollY);
})
