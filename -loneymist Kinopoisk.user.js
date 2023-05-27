// ==UserScript==
// @name		~loneymist Kinopoisk
// @namespace	lnmst-kinopoisk
// @author		~loneymist
// @description Watch films on Kinopoisk.ru for free!
// @icon		
// @version		1.0
// @match		*://www.kinopoisk.ru/*
// @grant		none
// @run-at		document-end
// ==/UserScript==

// Vector image of the banner
const BANNER_IMAGE = `
<svg width="100%" height="100%" viewBox="0 0 128 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
  <path id="Banner" d="M128,0L0,0L0,512L64,480L128,512L128,0Z" style="fill:url(#bg);"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" style="fill:#ffffff; font-family: Arial, sans-serif; font-size: 7vh; font-weight: bold; writing-mode: tb-rl; glyph-orientation-vertical: 0deg;">~loneymist</text>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(128,512,-2048,512,0,0)">
  <stop offset="0" style="stop-color:rgb(170, 217, 235); stop-opacity:1"/>
  <stop offset="1" style="stop-color:rgb(90, 13, 98); stop-opacity:1"/>
</linearGradient>  </defs>
</svg>
`;

const BANNER_ID = 'kinopoisk-watch';
const MOVIE_TYPES = ['film', 'series'];
const PLAYER_LINK = 'https://1ww.frkp.live/film/';

let lastUrl = '/';

/**
 * Add banner element to the page
 */
function mountBanner() {
	const banner = document.createElement('a');
	banner.target = '_blank';
	banner.id = BANNER_ID;
	banner.innerHTML = BANNER_IMAGE;
	banner.style.width = '32px';
	banner.style.height = '128px';
	banner.style.top = '-128px';
	banner.style.left = '8px';
	banner.style.outline = 'none';
	banner.style.cursor = 'pointer';
	banner.style.position = 'fixed';
	banner.style.zIndex = '9999999999';
	banner.style.transition = 'top 0.2s ease';

	// Events
	banner.addEventListener('mouseover', () => { banner.style.top = '-16px' });
	banner.addEventListener('mouseout', () => { banner.style.top = '-32px' });

	// Show with delay
	setTimeout(() => { banner.style.top = '-32px' }, 300);

	document.body.appendChild(banner);
}

/**
 * Remove banner element from the page
 */
function unmountBanner() {
	const banner = document.getElementById(BANNER_ID);
	if (banner) banner.remove();
}

/**
 * Process & update banner depending on the current page state
 */
function updateBanner() {
  const url = location.href;

  // Skip if the same url
  if (url === lastUrl) return;
  lastUrl = url;

  const banner = document.getElementById(BANNER_ID);
  const urlData = url.split('/');
  const movieId = urlData[4];
  const movieType = urlData[3];

  // Unmount if link is invalid
  if (!movieId || !movieType || !MOVIE_TYPES.includes(movieType)) {
    if (banner) unmountBanner();
  } else {
    if (!banner) mountBanner();

    const link = new URL(PLAYER_LINK);
    link.pathname += movieId;
    document.getElementById(BANNER_ID).setAttribute('href', link.toString());
  }
}

/**
 * Script initialization
 */
function init() {

	// Listen for the Url changes
	const observer = new MutationObserver(() => updateBanner());
	observer.observe(document, { subtree: true, childList: true });

	// Initialize
	updateBanner();
	console.log('Kinopoisk Watch started! 🎥');
}

init();
