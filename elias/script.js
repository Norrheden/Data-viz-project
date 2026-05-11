let hSvg = 500; let hPad = 50; 
let wSvg = 800; let wPad = 80;

let godColor = "yellow";
let monsterColor = "red";
let fairytaleColor = "purple";
let otherColor = "blue";

let svg = d3.select("body")
    .append("svg")
    .attr("height", hSvg)
    .attr("width", wSvg)
    .style("background", "#D7E4FF")


let xScale = d3.scaleBand([0, ], [wPad, wSvg-wPad])
let yScale = d3.scaleLinear([0, maxSeasonPoint], [hSvg-hPad, hPad])

//Säsonger
let seasonMaxPoint
function getParticipantTotalPoints(season, participantId) {
    let total = 0;

}

