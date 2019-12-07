
/** Class implementing the tileChart. */
class MapChart {
    // cite this properly:
    // this map was made using examples from Michelle Chandra's post on:
    // http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    constructor(masterTable, stateAttrRankList, barChart) {
        this.barChart = barChart;
        this.stateAttrRankList = stateAttrRankList;
        // console.log(this.stateAttrRankList);
        this.masterTable = masterTable;
        // console.log(this.masterTable);

        let map = d3.select("#map").classed("content", true);
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        //Gets access to the div element created for this chart and legend element from HTML
        let svgBounds = map.node().getBoundingClientRect();
        this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgWidth / 2 + 30;
        let legendHeight = 150;

        this.svg = map.append("svg")
            // .attr("width", this.svgWidth)
            .attr("width", 1500)
            // .attr("height", this.svgHeight)
            .attr("height", 300);
            // .attr("transform", "translate(" + this.margin.left + ",0)");
    // .attr("transform", "translate(" + this.margin.left + ",0)");


        this.svg.append('rect')
            // .attr("x", 380)

            .attr("width", 420)
            .attr("height", 500)
            .style('fill', 'black')
        ;

        // this.svg.append('text')
        //     .text("Performance")
        //     .style("font-family", 'Impact')
        //     .style('font-size', '90px')
        //     .style('fill', 'grey')
        //     .attr('transform', 'translate(77, 490), rotate(-90)')
        // ;
        // this.svg.append('text')
        //     .text("Across the US")
        //     .style("font-family", 'Impact')
        //     .style('font-size', '85px')
        //     .style('fill', 'grey')
        //     .attr('transform', 'translate(153, 488), rotate(-90)')
        // ;



    };

    drawMap(us){
        // console.log(us);
        console.log(us.features);
        let value = null;
        let highlightStates = [];

        let projection = d3.geoAlbersUsa()
            .translate([230, 120])    // translate to center of screen
            .scale([500]);          // scale things down so see entire US

// Define path generator
        let path = d3.geoPath()
            .projection(projection);
// fuction to remove element by state name from highlight states list
        Array.prototype.remove = function() {
            let what, a = arguments, L = a.length, ax;
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
        let color = ["lightblue", "darkblue"];

        let colorScale = d3.scaleLinear()
            .domain([260, 290])
            .range(color);

        let grads = this.svg.append('defs')
            .append('linearGradient')
            .attr('id', 'grad2')
            .attr('x1', '0%')
            .attr('x2', '100%')
            .attr('y1', '0%')
            .attr('y2', '0%');

        grads.selectAll('stop')
            .data(color)
            .enter()
            .append('stop')
            .style('stop-color', function(d){ return d; })
            .attr('offset', function(d,i){
                return 100 * (i / (color.length - 1)) + '%';
            });

        let legendx = 200;
        let legendWidth = 100;
        let legendy = 250;
        let legendHeight = 10;

        let legend = this.svg.append('rect')
            .attr('x', legendx)
            .attr('y', legendy)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#grad2)')
            // .attr("stroke", "grey")
        ;

        this.svg.append('text')
            .text('LOW ACADEMIC')
            .style('font-family', 'Lato')
            .attr('text-anchor', 'middle')
            .attr('x', legendx)
            .attr('y', legendy + legendHeight + 20)
            .style('font-size', '10px')
            .style('fill', 'grey')
        ;
        this.svg.append('text')
            .text('HIGH ACADEMIC')
            .style('font-family', 'Lato')
            .attr('text-anchor', 'middle')
            .attr('x', legendx + legendWidth)
            .attr('y', legendy + legendHeight + 20)
            .style('font-size', '10px')
            .style('fill', 'grey')
        ;
        this.svg.append('text')
            .text('PERFORMANCE')
            .style('font-family', 'Lato')
            .attr('text-anchor', 'middle')
            .attr('x', legendx)
            .attr('y', legendy + legendHeight + 37)
            .style('font-size', '10px')
            .style('fill', 'grey')
        ;
        this.svg.append('text')
            .text('PERFORMANCE')
            .style('font-family', 'Lato')
            .attr('text-anchor', 'middle')
            .attr('x', legendx + legendWidth)
            .attr('y', legendy + legendHeight + 37)
            .style('font-size', '10px')
            .style('fill', 'grey')
        ;


        // legend.append('rect')
        //     .attr('x', '200')
        //     .attr('y', '425')
        //     .attr('width', '200')
        //     .attr('height', '10')
        //     .style('fill', 'red')
        // ;

        let thiss = this;
        let selectedStates = [];
        this.svg.selectAll("path")
            .data(us.features)
            .enter()
            .append("path")
            .attr("d", path)
            // .style("stroke", "#fff")
            .style("stroke", "white")
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

            // console.log(this);
            // console.log(d3.select(this).style('stroke-width') == "1");
            if (d3.select(this).style('stroke-width') == "1"){
                d3.select(this).style('stroke-width', "3")
            }
            else {
                d3.select(this).style('stroke-width', "1")
            }
            // d3.select(this).style('stroke-width', "3")
            //     .style('stroke', "white");
            let state = d.properties.name;
            highlightStates.includes(state) ? highlightStates.remove(state) : highlightStates.push(state);
            // const obj = thiss.stateAttrRankList.find(({ object }) => object.state === state);
            const obj = thiss.stateAttrRankList.find(a => a.state === state);
            let checkIt = selectedStates.indexOf(obj);
            (checkIt == -1) ? selectedStates.push(obj) : selectedStates.splice(checkIt, 1);
            thiss.barChart.updateSelectedStates(selectedStates);
            thiss.barChart.update();
        });
        this.svg.append('text')
            .text("Performance State Selector")
            .style("font-family", 'Impact')
            .style('font-size', '25px')
            .style('fill', 'grey')
            .attr('transform', 'translate(23, 290), rotate(-90)')
        ;
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
}