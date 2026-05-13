
let hSvg = 600; let hPad = 60; 
let wSvg = 800; let wPad = 80;

let godColor = "yellow";
let monsterColor = "red";
let fairytaleColor = "purple";
let otherColor = "blue";
let backgroundSvgColor = "#D7E4FF"


const placementPoints = [15, 10, 6, 3, 1];
const seasonPerParticipant = seasons.map(season => {
    const participantPoints = {};

    season.competitionDays.forEach(day => {
        day.events.forEach(event => {

            const rankedScores = [...event.scores].sort((a, b) => b.score - a.score);
            rankedScores.forEach(({ participantId }, index) => {
                if(index === 0) {
                    let obj= something(event.disciplineId, participantId)
                    console.log(`${obj.character} was best at ${obj.discName}`)
                }
                const earnedPoints = placementPoints[index] || 0;
                if (!participantPoints[participantId]) {
                    participantPoints[participantId] = 0;
                }
                participantPoints[participantId] += earnedPoints;
            });
        });
    });

    let participants = Object.entries(participantPoints)
            .map(([id, points]) => ({id: Number(id),points}))
            .sort((a, b) => b.points - a.points)
    for(let i = 0; i < participants.length; i++) {
        participants[i].rank = i + 1;
    }
    return {
        season: season.year,
        participants
    }
});
const allParticipants = seasonPerParticipant.flatMap(season =>
    season.participants.map(participant => ({
        ...participant,
        season: season.season
    }))
);
console.log(allParticipants) /////

function something(disciplineId, participantId) {
    let partiName;
    let discName;
    for(let x of disciplines) {
        if(disciplineId === x.id) {
            discName = x.name
        }
    }
    for(let x of participants) {
        if(participantId === x.id) {
            partiName = x.name
        }
    }
    return {
        character:partiName,
        discName:discName
    }

}

//SVG

let svg1 = d3.select("#chart1")
    .append("svg")
    .attr("height", hSvg)
    .attr("width", wSvg)
    .style("background", backgroundSvgColor)
    .style("border-radius", "20px")

const xScale = d3.scaleBand() // Har scaleBand för att åren är diskreta tal, alltså unika tal(2025,2026) och inte (2025.1 , 2025.2)
    .domain([2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026]) //Manuellt
    .range([wPad, wSvg - wPad])
    .padding(0.1);

const maxRank = d3.max(allParticipants, d => d.rank);

const yScale = d3.scaleLinear()
    .domain([maxRank, 1])  
    .range([hSvg - hPad, hPad]); // Invertera så att högre poäng är högre upp



svg1.append("g")
    .selectAll("circle")
    .data(allParticipants)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.season) + xScale.bandwidth() / 2) // Placera i mitten av bandet
    .attr("cy", d => yScale(d.rank)) 
    .attr("r", 5) 
    .attr("fill", d => getColor(d.id));

function getColor(partiId) {
    let colors = [godColor, monsterColor, fairytaleColor, otherColor]
    for(let parti of participants) {
        if(parti.id === partiId) {
            let name = parti.name;

            for(let character of characters) {
                if(character.name === name) {
                    switch(character.category) {
                        case "Monster":
                            return colors[1];
                        case "Gud":
                            return colors[0];
                        case "Sagoväsen":
                            return colors[2];
                        default:
                            return colors[3]
                    }
                        
                        
                }
            }
        }
    }
}
const axisLeft = d3.axisLeft(yScale)
    .tickValues(d3.range(1, maxRank + 1));
const axisBottom = d3.axisBottom(xScale)
svg1.append("g")
    .attr("transform", `translate(${wPad}, 0)`)
    .call(axisLeft)
    .style("font-family", "Jacques-Francois-Shadow")
    .style("font-size", "14px"); // Ändra fontstorlek

svg1.append("g")
    .attr("transform", `translate(0, ${hSvg-hPad})`)
    .call(axisBottom)
    .style("font-family", "Jacques-Francois-Shadow")
    .style("font-size", "14px"); // Ändra fontstorlek


const selectChar = d3.select("#selectChar");
selectChar.selectAll("option.character")
    .data(participants)
    .enter()
    .append("option")
    .attr("value", d => d.name)
    .text(d => d.name)


// Skapa en linje-generator
const lineGroup = svg1.append("g")
    .attr("class", "line-group");

// Lägg till en change-händelse på select-elementet
selectChar.on("change", function () {

    const selectedName = this.value;

    // Filtrera data för vald karaktär
    const filteredData = allParticipants.filter(d => {
        const participant = participants.find(p => p.id === d.id);
        return participant && participant.name === selectedName;
    });

    // Sortera efter säsong
    filteredData.sort((a, b) => a.season - b.season);

    // Rensa gamla linjer
    lineGroup.selectAll("*").remove();

    // Rita linjer mellan punkterna
    for (let i = 0; i < filteredData.length - 1; i++) {

        const current = filteredData[i];
        const next = filteredData[i + 1];

        // Kolla om säsong saknas
        const missingSeason = next.season - current.season > 1;

        lineGroup.append("line")
            .attr("x1", xScale(current.season) + xScale.bandwidth() / 2)
            .attr("y1", yScale(current.rank))
            .attr("x2", xScale(next.season) + xScale.bandwidth() / 2)
            .attr("y2", yScale(next.rank))
            .attr("stroke", missingSeason ? "red" : "black")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", missingSeason ? "5,5" : null);
    }

    // Uppdatera färg på cirklar
    svg1.selectAll("circle")
        .attr("fill", d => {
            const participant = participants.find(p => p.id === d.id);

            return participant && participant.name === selectedName
                ? "black"
                : "white";
        });
});


/////////////////////////////////////////////////////////////////////////////////////




let svg2 = d3.select("#chart2")
    .append("svg")
    .attr("height", hSvg)
    .attr("width", wSvg)
    .style("background", backgroundSvgColor)
    .style("border-radius", "20px");


let xScale2 = d3.scaleBand()
    .domain(["Kurragöma", "Tygdlyftning", "Triathlon", "Illusion", "Pussel"])
    .range([wPad, wSvg - wPad])
    .padding(0.1)