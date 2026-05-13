const yearSelect = document.getElementById("year");

let selectedYear = yearSelect.value;

yearSelect.addEventListener("change", () => {
    selectedYear = yearSelect.value;
    updateTableUI(selectedYear);
});

function updateTableUI(year) {
    let selectedSeason = seasons.find(x => x.year == year)
    let participantsIds = selectedSeason.coaches.map(coach => coach.participantId);
    console.log(participantsIds);
}