/** Class implementing the mapChart. */
class MapChart {
    /**
     * @param masterTable
     * @param stateAttrRankList
     * @param barChart
     */
    constructor(masterTable, stateAttrRankList, barChart) {
        this.barChart = barChart;
        this.stateAttrRankList = stateAttrRankList;
        this.masterTable = masterTable;

        let map = d3.select("#map");
        this.svg = map.append("svg")
            .attr("width", 1500)
            .attr("height", 300)
        ;
        // add background for the chart
        this.svg.append('rect')
            .attr("width", 420)
            .attr("height", 500)
            .style('fill', 'black')
        ;
    };

    /**
     *
     * @param us
     * @returns
     */
    drawMap(us){
        // cite this properly:
        // this map was made using examples from Michelle Chandra's post on:
        // http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922
        let highlightStates = [];
        // create map projection
        let projection = d3.geoAlbersUsa()
            .translate([230, 120])
            .scale([500])
        ;
        // create the path
        let path = d3.geoPath()
            .projection(projection);
        // function to remove element by state name from highlight states list
        Array.prototype.remove = function() {
            let what, a = arguments, L = a.length, ax;
            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        }
        ;
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
        // create color scale for heat map.
        let color = ["lightblue", "darkblue"];
        let colorScale = d3.scaleLinear()
            .domain([260, 290])
            .range(color)
        ;
        // gradients for the legend key
        let grads = this.svg.append('defs')
            .append('linearGradient')
            .attr('id', 'grad2')
            .attr('x1', '0%')
            .attr('x2', '100%')
            .attr('y1', '0%')
            .attr('y2', '0%')
        ;
        grads.selectAll('stop')
            .data(color)
            .enter()
            .append('stop')
            .style('stop-color', function(d){ return d; })
            .attr('offset', function(d,i){
                return 100 * (i / (color.length - 1)) + '%';
            })
        ;
        // legend dimensions
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
        ;
        // legend labels
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
            .attr('y', legendy + legendHeight + 35)
            .style('font-size', '10px')
            .style('fill', 'grey')
        ;
        this.svg.append('text')
            .text('PERFORMANCE')
            .style('font-family', 'Lato')
            .attr('text-anchor', 'middle')
            .attr('x', legendx + legendWidth)
            .attr('y', legendy + legendHeight + 35)
            .style('font-size', '10px')
            .style('fill', 'grey')
        ;

        // draw the map with path elements
        let thiss = this;
        let selectedStates = [];
        this.svg.selectAll("path")
            .data(us.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("stroke", "white")
            .style("stroke-width", "1")
            .style('fill', d => {return colorScale(d.properties.score)})
        .on('click', function (d) {

            if (d3.select(this).style('stroke-width') == "1"){
                d3.select(this).style('stroke-width', "3")
            }
            else {
                d3.select(this).style('stroke-width', "1")
            }
            let state = d.properties.name;
            highlightStates.includes(state) ? highlightStates.remove(state) : highlightStates.push(state);
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
    }
}