const bar = {
    append(placement) {
        switch (placement) {
            case "one": {
                this.svg.append("g").attr("id", "bar-one")
                    .attr("transform", `translate(0, ${-this.scales.y.bandwidth() / 2})`);
                this.g[placement] = d3.select("#bar-one");
                return;
            }

            case "two": {
                this.svg.append("g").attr("id", "bar-two")
                    .attr("transform", `translate(0, ${this.scales.y.bandwidth() / 2})`);
                this.g[placement] = d3.select("#bar-two");
                return;
            }

            default: {
                return false;
            }
        }
    },

    axis: {
        x: null,
        y: null
    },

    colors: d3.scaleOrdinal(["one", "two"], ["lightgreen", "goldenrod"]),

    create(char, season, placement) {
        const data = this.data(char, season);
        console.log(data);

        this.append(placement);
        let rects = this.g[placement].selectAll("rect").data(data, d => d.disc);

        let enteredRects = rects.enter()
            .append("rect")
            .attr("height", this.scales.y.bandwidth)
            .attr("x", this.padding.x)
            .attr("y", d => this.scales.y(d.disc))
            .attr("fill", this.colors(placement))

        enteredRects.append("title")
        
        mergedRects = enteredRects.merge(rects);

        mergedRects.select("title")
            .text(d => `${d.disc}: ${d.points}p`);

        mergedRects.transition()
            .duration(500)
            .attr("width", d => this.scales.x(d.points) - this.padding.x);
    },

    data(char, season) {
        const c = data.participant(char);
        const s = data.season(season);

        let discIds = disciplines.map(x => x.id);

        let eventsByDisc = [];
        s.competitionDays.forEach(compDay => {
            compDay.events.forEach(event => {
                let disc = disciplines.find(x => x.id === event.disciplineId);

                let exists = eventsByDisc.find(x => x.disc === disc.name);
                if (!exists) {
                    eventsByDisc.push({
                        disc: disc.name,
                        events: [event]
                    });
                } else {
                    exists.events.push(event);
                }
            });
        });

        let pointsPerDisc = [];
        eventsByDisc.forEach(x => {
            x.events.forEach(event => {
                event.scores.sort((a, b) => b.score - a.score);
                let index = event.scores.findIndex(y => y.participantId === c.id);
                let pts = points(index);

                let exists = pointsPerDisc.find(y => y.disc === x.disc);
                if (!exists) {
                    pointsPerDisc.push({
                        disc: x.disc,
                        points: pts
                    })
                } else {
                    exists.points += pts;
                }
            });
        });

        return pointsPerDisc;
    },

    driver() {
        this.setScales();
        this.setAxis();

        this.svg.append("g")
            .attr("transform", `translate(0, ${this.svgH - this.padding.y})`)
            .call(this.axis.x);

        this.svg.append("g")
            .attr("transform", `translate(${this.padding.x}, 0)`)
            .call(this.axis.y);
    },

    g: {},

    padding: {
        x: 50,
        y: 50
    },

    setAxis() {
        this.axis.x = d3.axisBottom(this.scales.x);
        this.axis.y = d3.axisLeft(this.scales.y);
    },

    setScales() {
        this.scales.x = d3.scaleLinear([0, minMax("disc").max], [this.padding.x, this.svgW - this.padding.x]);
        this.scales.y = d3.scaleBand(disciplines.map(x => x.name), [this.svgH - this.padding.y, this.padding.y]).padding(0.7);
    },

    scales: {
        x: null,
        y: null
    },

    svg: d3.select("#bar"),

    svgH: parseInt(d3.select("#bar").attr("height")),

    svgW: parseInt(d3.select("#bar").attr("width")),
}

const data = {
    participant(char) {
        return participants.find(x => x.name.toLowerCase() === char.toLowerCase());
    },

    season(year) {
        return seasons.find(x => x.year === year);
    }
}

const minMax = (type) => {
    switch (type) {
        case "disc": {
            let points = [];
            participants.forEach(x => {
                let years = seasons.map(y => y.year);
                years.forEach(y => {
                    let data = bar.data(x.name, y);
                    let pts = data.map(y => y.points);
                    points = [...points, ...pts];
                });
            });

            points.sort((a, b) => b - a);

            return {
                max: points[0],
                min: points[points.length - 1]
            }
        }

        default: {
            return false;
        }
    }
}

const pie = {
    append(placement) {
        switch (placement) {
            case "left": {
                this.svg.append("g")
                    .attr("transform", `translate(${this.padding.x}, ${this.svgH / 2})`)
                    .attr("id", "left");

                this.g["left"] = d3.select("#pie #left");
                return;
            }

            case "right": {
                this.svg.append("g")
                    .attr("transform", `translate(${this.svgW - this.padding.x}, ${this.svgH / 2})`)
                    .attr("id", "right");

                this.g["right"] = d3.select("#pie #right");
                return;
            }

            case "bottom": {
                this.svg.append("g")
                    .attr("transform", `translate(${this.svgW / 2}, ${this.svgH - this.padding.y})`)
                    .attr("id", "bottom");

                this.g["bottom"] = d3.select("#pie #bottom");
                return;
            }

            case "top": {
                this.svg.append("g")
                    .attr("transform", `translate(${this.svgH / 2}, ${this.padding.y})`)
                    .attr("id", "top");

                this.g["top"] = d3.select("#pie #top");
                return;
            }
        }
    },

    arc: d3.arc().innerRadius(0).outerRadius(100),

    colors: d3.scaleOrdinal(locations.map(x => x.name), ["#D4AF37", "lightblue", "#98FB98", "#2F4F4F", "#8B4513"]),

    clear() {
        this.svg.selectAll("*").remove();
    },

    create(char, season, placement) {
        let data = this.data(char, season);
        let totalPoints = 0;
        data.forEach(x => totalPoints += x.points);

        if (!totalPoints) {
            data = [{
                loc: "Did not compete during the selected season",
                points: 1
            }]
        }

        this.append(placement);

        let pieData = this.pie(data);
        let percentage = {};

        data.forEach(x => {
            percentage[x.loc] = Math.round((x.points / totalPoints) * 100);
        });

        let paths = this.g[placement].selectAll("path")
            .data(pieData, d => d.data.loc);

        paths.exit().remove();

        let enteredPaths = paths.enter()
            .append("path")
            .attr("d", d3.arc().innerRadius(0).outerRadius(0))
            .attr("fill", d => {
                if (!totalPoints) return "#ddd";
                return this.colors(d.data.loc);
            })
            .attr("stroke", "black")
            .style("stroke-width", "1px");

        enteredPaths.append("title");

        let mergedPaths = enteredPaths.merge(paths);

        mergedPaths.select("title")
            .text((d) => {
                if (!totalPoints) return `${d.data.loc}`;
                return `${d.data.loc}: ${percentage[d.data.loc]}%`;
            });

        if (!totalPoints) {
            mergedPaths.attr("d", this.arc);
            return data;
        }

        mergedPaths.transition()
            .duration(500)
            .attr("d", this.arc)

        return data;
    },

    data(char, season) {
        const c = data.participant(char);
        const s = data.season(season);

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
bar.driver();