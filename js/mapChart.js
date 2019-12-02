
/** Class implementing the tileChart. */
class MapChart {
    // cite this properly:

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    // constructor(tooltip){
    constructor(masterTable) {
        this.masterTable = masterTable;
        console.log(this.masterTable);

        let map = d3.select("#map").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = map.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth / 2 + 30;
        let legendHeight = 150;

        this.svg = map.append("svg")
            .attr("width", this.svgWidth)
            .attr("width", 960)
            // .attr("height", this.svgHeight)
            .attr("height", 400)
            .attr("height", 600)
            .attr("transform", "translate(" + this.margin.left + ",0)");

        this.svg.append('rect')
            .attr("width", this.svgWidth)
            .attr("height", 400)
            .style('fill', 'lightgrey')
        ;


    };

    drawMap(us){
        // console.log(us);
        console.log(us.features);
        let value = null;
        let highlightStates = [];

        let projection = d3.geoAlbersUsa()
            .translate([300, 200])    // translate to center of screen
            .scale([800]);          // scale things down so see entire US

// Define path generator
        let path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
            .projection(projection);
// fuction to remove element by state name from highlight states list
        Array.prototype.remove = function() {
            var what, a = arguments, L = a.length, ax;
            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };

        // add the test scores to the paths.
        for (let i = 0; i < this.masterTable.length; i++){
            let dataState = this.masterTable[i].state;
            let dataValue = this.masterTable[i].avgTestScore;
            for (let j = 0; j < us.features.length; j++) {
                let jsonState = us.features[j].properties.name;
                if (dataState == jsonState) {
                    us.features[j].properties.score = dataValue;
                    break;
                }
            }
        }

        // get the max and min perfomrance scores.

        // create color scale for heat map.
        let colorScale = d3.scaleLinear()
            .domain([260, 290])
            .range(['lightblue', 'darkblue']);
        let legend = this.svg.append('g')
            .transform()
        ;
        legend.append('rect')
            .attr('x', '600')
            .attr('y', '300')
            .attr('width', '50')
            .attr('height', '25')
            .style('fill', 'red')
        ;


        this.svg.selectAll("path")
            .data(us.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            // .style("stroke", "black")
            .style("stroke-width", "1")
            // .style("fill", 'lightgrey' )
            .style('fill', d => {return colorScale(d.properties.score)})
        //     .on('click', d => {
        //         console.log(d);
        //
        //         d3.select(this.svg.node()).style('stroke-width', "3");
        //         // console.log(d.properties.name);
        //         let state = d.properties.name;
        //         highlightStates.includes(state) ? highlightStates.remove(state) : highlightStates.push(state);
        //         // console.log(highlightStates);
        //
        //         // this.outlineStates(highlightStates);
        //
        //         // const node = this.svg.node();
        //         // console.log(node.value);
        //         // node.value = value = value === d.id ? null : d.id;
        //         // console.log(node);
        //         // node.dispatchEvent(new CustomEvent("input"));
        //         // outline.attr("d", value ? path(d) : null);
        // });
        .on('click', function (d) {
            console.log(this);
            d3.select(this).style('stroke-width', "3");

        });
        // d3.selectAll("path")
        //     .data(us.features)
        //     .enter()
        //     .append("path")
        //     .filter(function(d) {
        //     // return d.properties.name == cluster
        //     return highlightStates.includes(d.properties.name)
        //
        //     // }).style("stroke", "#f00");
        // }).style("stroke", "black");

        const outline = this.svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-linejoin", "round")
            .attr("pointer-events", "none");

        return Object.assign(this.svg.node(), {value: null});
    }


    outlineStates(highlightStates){
        // console.log('outlineStates');
        let paths = this.svg.selectAll('path')
            // .style("stroke", "black")
        ;
        paths.filter(function(d) {
            // console.log(d);
            return highlightStates.includes(d.properties.name)
        })
            .append()
        .style("stroke", "black")
    }

    update() {
        // let us = d3.json("https://unpkg.com/us-atlas@1/us/10m.json");
        // console.log(us);
        // // let  topojson = require("topojson-client@3");
        // // let d3 = require("d3@5");
        //
        // const path = d3.geoPath();
        // let value = null;
        //
        // const g = this.svg.append("g")
        //     .attr("transform", "translate(0,40)");
        //
        // this.svg.append("g")
        //     .attr("fill", "#ccc")
        //     .selectAll("path")
        //     .data(topojson.feature(us, us.objects.states).features)
        //     .enter().append("path")
        //     .attr("d", path)
        //     .on("click", d => {
        //         const node = svg.node();
        //         node.value = value = value === d.id ? null : d.id;
        //         node.dispatchEvent(new CustomEvent("input"));
        //         outline.attr("d", value ? path(d) : null);
        //     });


        // okay we have the states data with lets get the json data
        // and add the funding from the states data to the json properties
        // console.log('update')
        // d3.json("data/us-states.json", function(json) {
        //     console.log('json');
        //
        //     console.log(json)
        // });

        // alright lets add a map to the svg...


        /**
         * Renders the HTML content for tool tip
         *
         * @param tooltip_data information that needs to be populated in the tool tip
         * @return text HTML content for toop tip
         */
        // tooltip_render (tooltip_data) {
        //   let text = "<ul>";
        //   tooltip_data.result.forEach((row)=>{
        //     text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
        //   });
        //
        //   return text;
        // }

        /**
         * Creates tiles and tool tip for each state, legend for encoding the
         * color scale information.
         *
         * @param electionResult election data for the year selected
         * @param colorScale global quantile scale based on the winning
         * margin between republicans and democrats
         */

        // update (electionResult, colorScale){
        //
        //   //Calculates the maximum number of rows and columns
        //   this.maxColumns = d3.max(electionResult, d => +d.Space) + 1;
        //   this.maxRows = d3.max(electionResult, d => +d.Row) + 1;
        //
        //   // ******* TODO: PART IV *******
        //   //Tansform the legend element to appear in the center and make a call to this element for it to display.
        //
        //   //Lay rectangles corresponding to each state according to the 'row' and 'column' information in the data.
        //   this.svg.selectAll("*").remove();
        //   const states = this.svg.selectAll("*").data(electionResult);
        //
        //   let xscale = d3.scaleLinear()
        //       .domain([0, 12 ])
        //       .range([20, this.svgWidth-100])
        //   ;
        //   var legendData = [-60, -50, -40, -30, -20, -10, 10, 20, 30, 40, 50, 60];
        //   this.legendSvg.selectAll("rect")
        //       .data(legendData)
        //       .enter()
        //       .append("rect")
        //       .attr("x", (d, i) => xscale(i))
        //       .attr("y", 10)
        //       .attr("height", 10)
        //       .attr("width", 70)
        //       .style("fill", function(d) {
        //           return colorScale(d)
        //       })
        //   this.legendSvg.selectAll('text').data(legendData)
        //       .enter()
        //       .append("text")
        //       .text(function(d, i) {
        //         if(i == 5) {
        //           return d + " to 0";
        //         }
        //         if(i == 6) {
        //           return "0 to " + d;
        //         }
        //         if(i > 6) {
        //           return legendData[i-1] + " to " + legendData[i]
        //         }
        //         return d + " to " + legendData[i+1]
        //       })
        //       .attr("x", (d, i) => xscale(i)+35)
        //       .attr("y", 35)
        //       .attr("text-anchor", "middle")
        //       .style("font-size", 12)
        //
        //   states
        //       .enter()
        //       .append("rect")
        //       .attr("x", (d, i) => d.Space*60)
        //       .attr("y", (d) => d.Row*60)
        //       .attr("height", 60)
        //       .attr("width", 60)
        //       .attr('class', 'tile')
        //       .style("fill", function(d) {
        //           let iPerc = parseFloat(d.I_Percentage);
        //           let dPerc = parseFloat(d.D_Percentage);
        //           let rPerc = parseFloat(d.R_Percentage);
        //           if((iPerc > dPerc) && (iPerc > rPerc))
        //               return '#45AD6A'
        //           return colorScale(d.RD_Difference)
        //       })
        //       .on('mouseover', (d) => {
        //         this.tooltip.mouseover(d)
        //       })
        //       .on('mouseout', (d) => {
        //         this.tooltip.mouseout(d)
        //       })
        //       .on('mousemove', (d) => {
        //         this.tooltip.mousemove(d)
        //       })
        //
        //
        //   //Display the state abbreviation and number of electoral votes on each of these rectangles
        //   states
        //       .enter()
        //       .append("text")
        //       .text((d) => d.Abbreviation)
        //       .style("text-anchor", "middle")
        //       .attr("class", ".tilestext ")
        //       .attr("x", (d, i) => d.Space*60 + 30)
        //       .attr("y", (d) => d.Row*60 + 25)
        //       .attr( "pointer-events", "none")
        //   states
        //       .enter()
        //       .append("text")
        //       .text((d) => d.Total_EV)
        //       .style("text-anchor", "middle")
        //       .attr("class", ".tilestext ")
        //       .attr("x", (d, i) => d.Space*60 + 30)
        //       .attr("y", (d) => d.Row*60 + 40)
        //       .attr( "pointer-events", "none")
        //   //Use global color scale to color code the tiles.
        //
        //   //HINT: Use .tile class to style your tiles;
        //   // .tilestext to style the text corresponding to tiles
        //
        //   //Call the tool tip on hover over the tiles to display stateName, count of electoral votes
        //   //then, vote percentage and number of votes won by each party.
        //   //HINT: Use the .republican, .democrat and .independent classes to style your elements.
        //
        // };
    }
}