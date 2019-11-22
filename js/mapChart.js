
/** Class implementing the tileChart. */
class MapChart {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    // constructor(tooltip){
    constructor() {
        console.log('in Map Chart');
        // this.stateScores = stateScores;

        let map = d3.select("#map").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = map.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth / 2 + 30;
        let legendHeight = 150;
        //add the svg to the div
        // let legend = d3.select("#legend").classed("content",true);

        //creates svg elements within the div
        // this.legendSvg = legend.append("svg")
        //     .attr("width",this.svgWidth)
        //     .attr("height",legendHeight)
        //     .attr("transform", "translate(" + this.margin.left + ",0)");
        this.svg = map.append("svg")
            .attr("width", this.svgWidth)
            .attr("width", 960)
            // .attr("height", this.svgHeight)
            .attr("height", 400)
            .attr("height", 600)
            .attr("transform", "translate(" + this.margin.left + ",0)");

        // let divTiles = d3.select("#tiles").classed("content", true);
        // this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        // //Gets access to the div element created for this chart and legend element from HTML
        // let svgBounds = divTiles.node().getBoundingClientRect();
        // this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        // this.svgHeight = this.svgWidth/2 + 30;
        // let legendHeight = 150;
        // //add the svg to the div
        // let legend = d3.select("#legend").classed("content",true);
        //
        // //creates svg elements within the div
        // this.legendSvg = legend.append("svg")
        //   .attr("width",this.svgWidth)
        //   .attr("height",legendHeight)
        //   .attr("transform", "translate(" + this.margin.left + ",0)");
        // this.svg = divTiles.append("svg")
        //   .attr("width",this.svgWidth)
        //   .attr("height",this.svgHeight)
        //   .attr("transform", "translate(" + this.margin.left + ",0)");
        //
        // this.tooltip = tooltip;
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    drawMap(us){
        let value = null;

        var projection = d3.geoAlbersUsa()
            .translate([300, 200])    // translate to center of screen
            .scale([800]);          // scale things down so see entire US

// Define path generator
        var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
            .projection(projection);

        this.svg.selectAll("path")
            .data(us.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", 'lightgrey' )
            .on('click', d => {
                console.log(d.properties.name)
                const node = this.svg.node();
                node.value = value = value === d.id ? null : d.id;
                node.dispatchEvent(new CustomEvent("input"));
                outline.attr("d", value ? path(d) : null);
        });

        const outline = this.svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-linejoin", "round")
            .attr("pointer-events", "none");

        return Object.assign(this.svg.node(), {value: null});

        ////// was kinda working..
        // let projection = d3.geoAlbersUsa()
        // let projection = d3.geoConicConformal().scale(150).translate([400, 350])
        // let projection = d3.geoAlbers().scale([50])
        // let path = d3.geoPath(projection)
        // let value = null;
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
        //         console.log(d.id)
        //         const node = this.svg.node();
        //         node.value = value = value === d.id ? null : d.id;
        //         node.dispatchEvent(new CustomEvent("input"));
        //         outline.attr("d", value ? path(d) : null);
        //     });
        //
        // this.svg.append("path")
        //     .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
        //     .attr("fill", "none")
        //     .attr("stroke", "white")
        //     .attr("stroke-linejoin", "round")
        //     .attr("pointer-events", "none")
        //     .attr("d", path);
        //
        // const outline = this.svg.append("path")
        //     .attr("fill", "none")
        //     .attr("stroke", "black")
        //     .attr("stroke-linejoin", "round")
        //     .attr("pointer-events", "none");


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