(function () {
	var html = document.documentElement || document.body;
	var screenWidth = html.clientWidth;
	var screenHeight = html.clientHeight;
	var timer = null;
	var uiWidth = 750;
	var fonts = 100;
	var rate = uiWidth / fonts;
	html.style.fontSize = screenWidth / rate + 'px';

	var evt =
		"onorientationchange" in window ? "orientationchange" : "resize";
	
	var getOrientation = function () {
			clearInterval(timer);
			if (evt === "orientationchange") {
				timer = setTimeout(function () {
					screenWidth = html.clientWidth;
					screenHeight = html.clientHeight;
					var orientation = window.orientation || '';
					if (orientation == 90 || orientation == -90 || screenWidth > screenHeight) {
						html.style.fontSize = screenHeight / rate + 'px';
						html.classList.add('orientationchange')
					}else {
						html.style.fontSize = screenWidth / rate + 'px';
						html.classList.remove('orientationchange')
					}
				}, 150);
			} else {
				timer = setTimeout(function () {
					screenWidth = html.clientWidth;
					screenHeight = html.clientHeight;
					if (screenWidth <= 320) {
						html.style.fontSize = 320 / rate + 'px';
					} else if (screenWidth >= uiWidth) {
						html.style.fontSize = screenWidth / 19.2 + "px";
					} else {
						html.style.fontSize = screenWidth / rate + 'px';
					}
				}, 100)
			}
		};

	getOrientation()
	window.addEventListener(
		evt,
		getOrientation,
		false
	);
})();