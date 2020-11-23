
// data
var today = new Date();
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
// data
let dataList = document.getElementById("miestai");
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
	if (xhr.readyState === 4 && xhr.status === 200) {
		let miestas = JSON.parse(xhr.responseText);
		for (let i = 0; i < miestas.length; i++) {
			let option = document.createElement("option");
			option.value = miestas[i].name;
			dataList.appendChild(option);
		}
	}
}


xhr.open("GET", "https://api.meteo.lt/v1/places");
xhr.send();

const btn = document.querySelector('.btn');
const conditions = document.querySelector('.weather');
const list = document.querySelector	(".pasirinkimas")
//btn.addEventListener('click',getWeather)
$(document).on('change', 'input', function(){
    let options = $('datalist')[0].options;
    for (let i=0;i<options.length;i++){
       if (options[i].value == $(this).val()) {
         	conditions.innerHTML = "";
         	conditions.style.border = "1px solid black";
			let xhr1 = new XMLHttpRequest();
			xhr1.onreadystatechange = function() {
			if (xhr1.readyState === 4 && xhr1.status === 200) {
				let weather = JSON.parse(xhr1.responseText);
				let tempsum = 0;
				let tempamount = 0;
				let header1 = document.createElement('h2');
				let textH1 = document.createTextNode(miestas.value + " " +date + " " + "Prognoze:")
				header1.appendChild(textH1);
				conditions.appendChild(header1);
				for (let i = 0; i < weather.forecastTimestamps.length; i++) {
					if (date === weather.forecastTimestamps[i].forecastTimeUtc.slice(0,10)) {
						let para = document.createElement('p');
						let textP = document.createTextNode(weather.forecastTimestamps[i].forecastTimeUtc.slice(10,30) + " " + ":" + " " + weather.forecastTimestamps[i].airTemperature + " " + '\u00B0C' + " " + translate(weather.forecastTimestamps[i].conditionCode));
						console.log(weather.forecastTimestamps[i].conditionCode);
						para.appendChild(textP);
						conditions.appendChild(para);
						icon(weather.forecastTimestamps[i].conditionCode);
						let br = document.createElement('br');
						conditions.appendChild(br);
						tempsum = tempsum + weather.forecastTimestamps[i].airTemperature;
						tempamount = tempamount + 1;
					}

				}

				/*
				let orai = document.querySelectorAll('p');
				console.log(orai)
				*/
				let para = document.createElement('p');
				let textP = document.createTextNode("Vidutine Temperatura:" + " " +(tempsum/tempamount).toFixed(1)+" "+"\u00B0C");
				para.appendChild(textP);
				conditions.appendChild(para);
			}
		}


		xhr1.open("GET", "https://api.meteo.lt/v1/places/"+kurismiestas()+"/forecasts/long-term");
		xhr1.send();
	}
}
});

function icon(nameoftheicon) {
	if (nameoftheicon === "clear" || nameoftheicon === "isolated-clouds" || nameoftheicon === "overcast") {
		let fa = document.createElement('i');
		fa.setAttribute("class", "fas fa-sun");
		conditions.appendChild(fa);
	}
		else if (nameoftheicon === "rain" || nameoftheicon === "scattered-clouds" || nameoftheicon === "light-rain" || nameoftheicon === "heavy-rain" || nameoftheicon === "sleet") {
			let fa = document.createElement('i');
			fa.setAttribute("class", "fas fa-cloud-rain");
			conditions.appendChild(fa);
		}
			else if (nameoftheicon === "light-snow" || nameoftheicon === "moderate-snow" || nameoftheicon === "heavy-snow") {
				let fa = document.createElement('i');
				fa.setAttribute("class", "far fa-snowflake");
				conditions.appendChild(fa);
			}
			else if (nameoftheicon === "fog") {
				let fa = document.createElement('i');
				fa.setAttribute("class", "fas fa-smog");
				conditions.appendChild(fa);
			}
}
function translate(name) {
	if (name === "clear") {name = "giedra"}
	else if (name === "isolated-clouds") {name = "mazai debesuota"}
	else if (name === "scattered-clouds") {name = "debesuota su pragiedruliais"}
	else if (name === "overcast") {name = "debesuota"}
	else if (name === "light-rain") {name = "nedidelis lietus"}
	else if (name === "moderate-rain") {name = "lietus"}
	else if (name === "heavy-rain") {name = "smarkus lietus"}
	else if (name === "sleet") {name = "slapdriba"}
	else if (name === "light-snow") {name = "nedidelis sniegas"}
	else if (name === "moderate-snow") {name = "sniegas"}
	else if (name === "heavy-snow") {name = "smarkus sniegas"}
	else if (name === "fog") {name = "rukas"}
	else if (name === "na") {name = "oro salygos nenustatytos."}
	else {name = "Neatpazinta."}
	return name;
}

function kurismiestas() {
	let which = "";
	let townnames = JSON.parse(xhr.responseText);
			
	for (let i = 0; i < townnames.length; i++) {
		if (townnames[i].name === miestas.value) {
			which = townnames[i].code;
		}
	}
	return which;

}


