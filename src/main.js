import './style.css'

let searchInput;
let tableBody;
let wordsData = [];

document.addEventListener("DOMContentLoaded", () => {
    // Load navbar
    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;

            initializeWordBank();
        });
});

function initializeWordBank() {
    searchInput = document.getElementById("search");
    tableBody = document.getElementById("table-body");

    // Load CSV
    Papa.parse("/src/tembung.csv", {
        download: true,
        header: true,
        complete: function(results) {
            wordsData = results.data;
            displayTable(wordsData);
        }
    });

    searchInput.addEventListener("input", function () {
        const searchTerm = this.value.toLowerCase();
        const filtered = wordsData.filter(item => {
            return Object.values(item).some(value =>
                (value || "").toLowerCase().includes(searchTerm)
            );
        });

        displayTable(filtered);
    });

}

function highlightMatch(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi"); // global, case-insensitive
    return text.replace(regex, '<mark>$1</mark>');
}

function displayTable(data) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    tableBody.innerHTML = "";
    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-base-300";
        tr.innerHTML = `
        <td>${highlightMatch(row.Tembung, searchTerm)}</td>
        <td>${highlightMatch(row.Ngoko, searchTerm)}</td>
        <td>${highlightMatch(row.Krama, searchTerm)}</td>
        <td>${highlightMatch(row.Ki, searchTerm)}</td>
        <td>${highlightMatch(row.Notes, searchTerm)}</td>
      `;
        tableBody.appendChild(tr);
    });
}