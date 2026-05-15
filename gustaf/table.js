const yearSelect = document.getElementById("year");

let selectedYear = yearSelect.value;

function loadSeason() {
    selectedYear = yearSelect.value;
    const playersData = getPlayersData(selectedYear);
    updateTableUI(playersData);
}

loadSeason();

yearSelect.addEventListener("change", loadSeason);

function getPlayersData(year) {

    let selectedSeason = seasons.find(s => s.year == year)

    const placementPoints = [15, 10, 6, 3, 1];

    const players = selectedSeason.coaches.map(coach => {
        const participant = participants.find(
            p => p.id === coach.participantId
        );

        return {
            id: participant.id,
            name: participant.name,
            type: participant.type,
            points: 0,
            position: 0
        };
    });

    selectedSeason.competitionDays.forEach(day => {

        day.events.forEach(event => {
            const sortedScores = [...event.scores].sort(
                (a, b) => b.score - a.score
            );

            sortedScores.forEach((result, index) => {
                if (index < placementPoints.length) {
                    const points = placementPoints[index];

                    const player = players.find(
                        p => p.id === result.participantId
                    );

                    player.points += points;

                }

            });

        });

    });

    players.sort((a, b) => b.points - a.points);

    players.forEach((player, index) => {

        player.position = index + 1;

    });
    console.log(players)
    return players;
}

function updateTableUI(playersData) {
    const tableBox = document.getElementById("table-box");
    tableBox.innerHTML = "";

    const tableHeader = document.createElement("div")

    const positionDisplay = document.createElement("p")
    positionDisplay.textContent = "POSITION"
    tableHeader.appendChild(positionDisplay)

    const nameDisplay = document.createElement("p")
    nameDisplay.textContent = "NAMN"
    tableHeader.appendChild(nameDisplay)

    const typeDisplay = document.createElement("p")
    typeDisplay.textContent = "TYP"
    tableHeader.appendChild(typeDisplay)

    const pointsDisplay = document.createElement("p")
    pointsDisplay.textContent = "POÄNG"
    tableHeader.appendChild(pointsDisplay)

    tableBox.appendChild(tableHeader)

    playersData.forEach((player) => {

        const playerBox = document.createElement("div")

        const positionText = document.createElement("p")
        positionText.textContent = `${player.position}`

        const playerNameText = document.createElement("p")
        playerNameText.textContent = `${player.name}`

        const playerTypeText = document.createElement("p")
        playerTypeText.textContent = `${player.type}`

        const playerPointsText = document.createElement("p")
        playerPointsText.textContent = `${player.points}`

        playerBox.appendChild(positionText)
        playerBox.appendChild(playerNameText)
        playerBox.appendChild(playerTypeText)
        playerBox.appendChild(playerPointsText)
        tableBox.appendChild(playerBox)
    });
}