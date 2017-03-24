'use strict';
function loadDoc() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var obj = JSON.parse(this.responseText),
				usdName = obj.query.results.rate[0].Name,
				eurName = obj.query.results.rate[1].Name,
				usdVal = +obj.query.results.rate[0].Rate,
				eurVal = +obj.query.results.rate[1].Rate;
			usdVal = usdVal.toFixed(2);
			eurVal = eurVal.toFixed(2);

			var usdNameSpan = document.getElementById('usd').firstElementChild,
				eurNameSpan = document.getElementById('eur').firstElementChild,
				usdValSpan = document.getElementById('usd').lastElementChild,
				eurValSpan = document.getElementById('eur').lastElementChild;

			var usdPrevVal = parseFloat(usdValSpan.innerHTML).toFixed(2),
				eurPrevVal = parseFloat(eurValSpan.innerHTML).toFixed(2);

			usdNameSpan.innerHTML = usdName;
			eurNameSpan.innerHTML = eurName;
			var usdCurVal = usdValSpan.innerHTML = usdVal;
			var eurCurVal = eurValSpan.innerHTML = eurVal;
			function colorSpan (prev, cur, span) {
				if (isNaN(prev)) {
					return;
				}
				if (cur > prev) {
					span.classList.add('up');
					span.classList.remove('down');
				}
				else if (cur < prev) {
					span.classList.add('down');
					span.classList.remove('up');
				}
				else {
					span.classList.remove('up');
					span.classList.remove('down');
				}
			}
			colorSpan(usdPrevVal, usdCurVal, usdValSpan);
			colorSpan(eurPrevVal, eurCurVal, eurValSpan);
		}
	};
	xhttp.open("GET", "https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22USDRUB,EURRUB%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=", true);
	xhttp.send(); 
}
loadDoc();
setInterval(loadDoc, 5000);