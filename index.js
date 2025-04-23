const tableBody = document.getElementById("table").getElementsByTagName("tbody")[0];
let actualData = null;
let actualClass = "";
const filterColumn = "class";
const cacheTables = {};

async function loadTableData(index) {
	const fileName = `table${index + 1}.json`;
	const filePath = `./tables/${fileName}`;

	if (cacheTables[index]) {
		console.log(`data from ${index + 1} was loaded to cache`);
		return cacheTables[index];
	}

	try {
		const res = await fetch(filePath);

		if (!res.ok) {
			throw new Error(`Failed to load ${filePath}: ${res.status}`);
		}

		const data = await res.json();
		cacheTables[index] = data;

		console.log(`Data from table ${index + 1} loaded from ${filePath}`);
		console.log(data)
		return data;
	} catch (err) {
		console.error("Failed to load data", err);
		return null;
	}
}

async function updateTable(index) {
	actualData = await loadTableData(index);
	if (actualData) {
		showTable(actualData);
		tableFilter(actualClass);
	}
}

function showTable(data) {
	tableBody.innerHTML = "";

	if (!data) return;

	for (let i = 0; i < data.length; i++) {
		const track = data[i];
		const newLine = tableBody.insertRow();
		newLine.insertCell().textContent = track.trackName;
		newLine.insertCell().textContent = track.class;
		newLine.insertCell().textContent = track.gameMode;
		newLine.insertCell().textContent = track.pu ? "Yes" : "No";

		const trackIdCell = newLine.insertCell();
		const link = document.createElement("a");
		link.href = `https://panel.worldunited.gg/events/${track.trackId}`;
		link.textContent = track.trackId.toString();
		link.target = "_blank";
		trackIdCell.appendChild(link);
	}
}

function tableFilter(selectedClass) {
	actualClass = selectedClass;

	if (!actualData) return;

	const filteredData = actualData.filter(item => {
		return actualClass === "" || item[filterColumn] === actualClass;
	});

	showTable(filteredData);
}


updateTable(0);
tableFilter("");