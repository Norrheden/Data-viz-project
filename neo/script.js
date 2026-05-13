const bar = {
    append(placement) {
        //skapa "g" utifrån vart staplarna ska placeras
    },

    data() {

    },

    g: {},

    svg: d3.select("#bar"),

    svgH: parseInt(d3.select("#bar").attr("height")),

    svgW: parseInt(d3.select("#bar").attr("width"))
}

const pie = {
    append(placement) {
        switch (placement) {
            case "left": {
                pie.svg.append("g")
                    .attr("transform", `translate(${pie.padding.x}, ${pie.svgH / 2})`)
                    .attr("id", "left");

                pie.g["left"] = d3.select("#pie #left");
                return;
            }

            case "right": {
                pie.svg.append("g")
                    .attr("transform", `translate(${pie.svgW - pie.padding.x}, ${pie.svgH / 2})`)
                    .attr("id", "right");

                pie.g["right"] = d3.select("#pie #right");
                return;
            }

            case "bottom": {
                pie.svg.append("g")
                    .attr("transform", `translate(${pie.svgW / 2}, ${pie.svgH - pie.padding.y})`)
                    .attr("id", "bottom");

                pie.g["bottom"] = d3.select("#pie #bottom");
                return;
            }

            case "top": {
                pie.svg.append("g")
                    .attr("transform", `translate(${pie.svgH / 2}, ${pie.padding.y})`)
                    .attr("id", "top");

                pie.g["top"] = d3.select("#pie #top");
                return;
            }
        }
    },

    arc: d3.arc().innerRadius(0).outerRadius(100),

    colors: d3.scaleOrdinal(locations.map(x => x.name), ["#D4AF37", "lightblue", "#98FB98", "#2F4F4F", "#8B4513"]),

    clear() {
        pie.svg.selectAll("*").remove();
    },

    create(char, season, placement) {
        let data = pie.data(char, season);
        let totalPoints = 0;
        data.forEach(x => totalPoints += x.points);

        if (!totalPoints) return false;

        pie.append(placement);

        let pieData = pie.pie(data);
        let percentage = {};

        data.forEach(x => {
            percentage[x.loc] = Math.round((x.points / totalPoints) * 100);
        });

        //pie.g[placement].selectAll("*").remove();

        let paths = pie.g[placement].selectAll("path")
            .data(pieData, d => d.data.loc);

        paths.enter()
            .append("path")
            .attr("d", pie.arc)
            .attr("fill", d => pie.colors(d.data.loc))
            .attr("stroke", "black")
            .style("stroke-width", "1px")
            .append("title")
            .text((d) => `${d.data.loc}: ${percentage[d.data.loc]}%`)

        paths.transition()
            .duration(500)
            .attr("d", pie.arc)

        return data;
    },

    data(char, season) {
        const c = participants.find(x => x.name.toLowerCase() === char.toLowerCase());
        const s = seasons.find(x => x.year === season);

        if (!c) return false;

        let compDaysPerLoc = [];

        s.competitionDays.forEach(x => {
            let loc = locations.find(y => y.id === x.locationId);
            let exists = compDaysPerLoc.find(y => y.loc === loc.name);
            if (!exists) {
                compDaysPerLoc.push({
                    loc: loc.name,
                    compDays: [x]
                })
            } else {
                exists.compDays.push(x);
            }
        });

        let charPointsPerLoc = [];

        compDaysPerLoc.forEach(x => {
            x.compDays.forEach(compDay => {
                compDay.events.forEach(event => {
                    event.scores.sort((a, b) => b.score - a.score);
                    let index = event.scores.findIndex(i => i.participantId === c.id);
                    let pts = points(index);

                    let exists = charPointsPerLoc.find(y => y.loc === x.loc);
                    if (!exists) {
                        charPointsPerLoc.push({
                            loc: x.loc,
                            points: pts
                        })
                    } else {
                        exists.points += pts;
                    }
                });
            });
        });

        return charPointsPerLoc;
    },

    g: {},

    padding: {
        x: 125,
        y: 125
    },

    pie: d3.pie().value(d => d.points).sort(null),

    svg: d3.select("#pie"),

    svgH: parseInt(d3.select("#pie").attr("height")),

    svgW: parseInt(d3.select("#pie").attr("width"))
}

const points = (place) => {
    switch (place) {
        case 0:
            return 15;
            
        case 1:
            return 10;

        case 2:
            return 6;

        case 3:
            return 3;

        case 4:
            return 1;

        default:
            return 0;
    }
}

const test = () => {
    participants.forEach(x => {
        let opt = document.createElement("option");
        opt.textContent = x.name;
        document.querySelector("#participants").appendChild(opt);
    });

    let placements = ["right", "left", "bottom", "top"];
    placements.forEach(x => {
        let opt = document.createElement("option");
        opt.textContent = x;
        document.querySelector("#placement").appendChild(opt);
    });

    document.querySelector("button").addEventListener("click", () => {
        let par = document.querySelector("#participants").value; 
        let pla = document.querySelector("#placement").value; 

        let chart = pie.create(par, 2018, pla);
        if (!chart) console.log("didnt play");
    });
}

test();