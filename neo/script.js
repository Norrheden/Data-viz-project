const bar = {
    svg: d3.select("#bar"),

    svgH: parseInt(d3.select("#bar").attr("height")),

    svgW: parseInt(d3.select("#bar").attr("width")),
}

const pie = {
    arc: d3.arc().innerRadius(0).outerRadius(100),

    colors: d3.scaleOrdinal(locations.map(x => x.name), ["#D4AF37", "lightblue", "#98FB98", "#2F4F4F", "#8B4513"]),

    create: (char, season) => {
        let data = pie.data(char, season);
        let totalPoints = 0;
        data.forEach(x => totalPoints += x.points);

        if (!totalPoints) return false;

        let pieData = pie.pie(data);
        let percentage = {};

        data.forEach(x => {
            percentage[x.loc] = Math.round((x.points / totalPoints) * 100);
        });

        pie.g.selectAll("*").remove();

        pie.g.selectAll("path")
            .data(pieData)
            .enter()
            .append("path")
            .attr("d", pie.arc)
            .attr("fill", d => pie.colors(d.data.loc))
            .attr("stroke", "black")
            .style("stroke-width", "1px")
            .append("title")
            .text((d) => `${d.data.loc}: ${percentage[d.data.loc]}%`);
    },

    data: (char, season) => {
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
                    let points = pie.points(index);

                    let exists = charPointsPerLoc.find(y => y.loc === x.loc);
                    if (!exists) {
                        charPointsPerLoc.push({
                            loc: x.loc,
                            points: points
                        })
                    } else {
                        exists.points += points;
                    }
                });
            });
        });

        return charPointsPerLoc;
    },

    driver: () => {
        pie.svg.append("g")
            .attr("transform", `translate(${pie.svgW / 2}, ${pie.svgH / 2})`);

        pie.g = d3.select("#pie g");
    },

    g: null,

    padding: {
        x: 50,
        y: 50
    },

    pie: d3.pie().value(d => d.points),

    points: (place) => {
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
    },

    svg: d3.select("#pie"),

    svgH: parseInt(d3.select("#pie").attr("height")),

    svgW: parseInt(d3.select("#pie").attr("width"))
}

pie.driver();