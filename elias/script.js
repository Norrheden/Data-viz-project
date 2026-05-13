let hSvg = 500; let hPad = 50; 
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
                const earnedPoints = placementPoints[index] || 0;
                if (!participantPoints[participantId]) {
                    participantPoints[participantId] = 0;
                }
                participantPoints[participantId] += earnedPoints;
            });
        });
    });

    return {
        season: season.year,
        participants: Object.entries(participantPoints)
            .map(([id, points]) => ({id: Number(id),points}))
            .sort((a, b) => b.points - a.points)
    };
});

const allParticipants = seasonPerParticipant.flatMap(season =>
    season.participants.map(participant => ({
        ...participant,
        season: season.season
    }))
);
console.log(allParticipants) /////



//SVG

let svg = d3.select("body")
    .append("svg")
    .attr("height", hSvg)
    .attr("width", wSvg)
    .style("background", backgroundSvgColor)
    .style("border-radius", "20px")

const years = d3.range(2017, 2027); 
const maxPoints = Math.max(...seasonPerParticipant[0].participants.map(p => p.points));
const xScale = d3.scaleBand()
    .domain(years)
    .range([wPad, wSvg - wPad])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .domain([0, maxPoints]) 
    .range([hSvg - hPad, hPad]); // Invertera så att högre poäng är högre upp



svg.append("g")
    .selectAll("circle")
    .data(allParticipants)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.season) + xScale.bandwidth() / 2) // Placera i mitten av bandet
    .attr("cy", d => yScale(d.points)) 
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
const axisBottom = d3.axisBottom(xScale)
svg.append("g")
    .attr("transform", `translate(${wPad}, 0)`)
    .call(axisLeft)
svg.append("g")
    .attr("transform", `translate(0, ${hSvg-hPad})`)
    .call(axisBottom)




