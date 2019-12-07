/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(attributes, attrColorList) {
        this.selectedAttr = [];
        this.rankedData = [];
        let barchart = d3.select("#barchart");
        this.svg = barchart;
        this.allattributes = attributes;
        this.colorList = attrColorList;
        this.svgWidth = 1450;
        this.svgHeight = 500;
        this.xaxisHeight = 80;
        this.yaxisWidth = 80;
        this.height = 500;
        this.xaxisSel = barchart.select('#xAxis');
        this.yaxisSel = barchart.select('#yAxis');
    }
    updateSelectedAttributes(attributes){
        this.selectedAttr = attributes
    }
    updateSelectedStates(states){
        this.rankedData = states
    }

    create() {
        this.svg.attr('transform', `scale(1, -1)`);

        // Create the x and y scales
        let xscale = d3.scaleBand()
            .domain(1)
            .range([this.yaxisWidth,this.svgWidth])
            .padding(0.25)
        ;
        let yscale = d3.scaleLinear()
            .domain([this.allattributes.length, 0])
            .range([15, this.height - this.xaxisHeight])
        ;

        //create the axis and tick formats
        let xaxis = d3.axisBottom(xscale).tickFormat((d,i) => '');
        let yaxis = d3.axisLeft(yscale)
            .ticks(this.allattributes.length)
            .tickFormat(d3.format("d"))
        ;

        this.xaxisSel.attr('transform', `translate(0, ${this.xaxisHeight}) scale(1, -1)`)
            .call(xaxis)
            .selectAll("text")
            .style("text-anchor", "middle")
            .style('font-size', 16)
        ;
        this.yaxisSel.attr('transform', `translate(${this.yaxisWidth}, ${this.svgHeight}) scale(1, -1)`)
            .transition()
            .duration(1000)
            .call(yaxis)
            .selectAll("text")
            .style('font-size', 14)
        ;

        this.svg.append('text')
            .attr('transform', `scale(1, -1)`)
            .attr('x', this.svgWidth/2 + this.yaxisWidth)
            .attr('y', -10)
            .text('States')
            .attr('text-anchor', 'middle')
            .attr("font-size", "20px")
            .attr("fill", "black")
            .style('font-family', 'Arvo');

        this.svg.append('text')
            .attr('transform', `scale(1, -1)`)
            .attr('x', 56)
            .attr('y', -480)
            .text('Strong')
            .attr("font-size", "16px")
            .attr('text-anchor', 'end')
            .attr("fill", "black")
            .style('font-family', 'Arvo');
        this.svg.append('text')
            .attr('transform', `scale(1, -1)`)
            .attr('x', 50)
            .attr('y', -460)
            .text('Corr.')
            .attr("font-size", "16px")
            .attr('text-anchor', 'end')
            .attr("fill", "black")
            .style('font-family', 'Arvo');

        this.svg.append('text')
            .attr('transform', `scale(1, -1)`)
            .attr('x', 55)
            .attr('y', -80)
            .text('Weak')
            .attr("font-size", "16px")
            .attr('text-anchor', 'end')
            .attr("fill", "black")
            .style('font-family', 'Arvo');
        this.svg.append('text')
            .attr('transform', `scale(1, -1)`)
            .attr('x', 50)
            .attr('y', -60)
            .text('Corr.')
            .attr("font-size", "16px")
            .attr('text-anchor', 'end')
            .attr("fill", "black")
            .style('font-family', 'Arvo');
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    update() {
        //Set set heights and widths
        let svgWidth = this.svgWidth;
        let svgHeight = this.svgHeight;
        let xaxisHeight = this.xaxisHeight;
        let yaxisWidth = this.yaxisWidth;
        let height = this.height;

        //remove the bars and the gridlines to be redrawn
        this.svg.select('#bars').selectAll('*').remove();
        this.svg.select('#gridLinesHorz').selectAll('*').remove();

        //sort the state data to be displayed in order and set xaxis tick values
        this.rankedData.sort(function(x, y){return d3.ascending(x.name, y.name);});
        let xaxisVal = this.rankedData.map(function(a) {return a.name});

        //add groups for each state on the barchart
        let bChartBars = this.svg.select('#bars').selectAll('g').data(xaxisVal);
        bChartBars.enter().append('g').attr('id', (d) => 'grp' + d)

        // Create the x and y scales
        let xscale = d3.scaleBand()
            .domain(xaxisVal)
            .range([this.yaxisWidth,this.svgWidth])
            .padding(0.25)
        ;
        let yscale = d3.scaleLinear()
            .domain([this.allattributes.length, 0])
            .range([15, this.height - this.xaxisHeight])
        ;

        //create the axis and tick formats
        let xaxis = d3.axisBottom(xscale).tickFormat((d,i) => xaxisVal[i]);
        let yaxis = d3.axisLeft(yscale)
            .ticks(this.allattributes.length)
            .tickFormat(d3.format("d"))
        ;

        this.xaxisSel.attr('transform', `translate(0, ${this.xaxisHeight}) scale(1, -1)`)
            .call(xaxis)
            .selectAll("text")
            .style("text-anchor", "middle")
            .style('font-size', 16)
        ;
        this.yaxisSel.attr('transform', `translate(${this.yaxisWidth}, ${this.svgHeight}) scale(1, -1)`)
            .transition()
            .duration(1000)
            .call(yaxis)
            .selectAll("text")
            .style('font-size', 14)
        ;

        let gridLines = this.svg.select('#gridLines').selectAll('line').data([0, 2, 4, 6, 8]);
        gridLines.enter()
            .append("line")
            .attr('x1', yaxisWidth)
            .attr('x2', svgWidth)
            .attr('y1', function(d){
                return yscale(d) + xaxisHeight - 15;
            })
            .attr('y2', function(d){
                return yscale(d) + xaxisHeight - 15;
            })
            .style("fill", "none")
            .style("stroke", "#d3d3d3")
            .style("stroke-width", 1)
        ;

        let gridLinesHorz = this.svg.select('#gridLinesHorz').selectAll('line').data(xaxisVal);
        gridLinesHorz.enter()
            .append("line")
            .attr('x1', function(d, i) {
                let gridW = (svgWidth - yaxisWidth)/xaxisVal.length;
                return yaxisWidth + (gridW * (i+1));
            })
            .attr('x2', function(d, i) {
                let gridW = (svgWidth - yaxisWidth)/xaxisVal.length;
                return yaxisWidth + (gridW * (i+1));
            })
            .attr('y1', svgHeight + 130)
            .attr('y2', 40)
            .style("fill", "none")
            .style("stroke", "#d3d3d3")
            .style("stroke-width", 1)
        ;

        let allAttrTemp = this.allattributes;
        let rankedDataTemp = this.rankedData;
        let colorList = this.colorList;
        let selectedAttr = this.selectedAttr;
        let spaceInBlock = (svgWidth - yaxisWidth)/xaxisVal.length;
        let barPadding = spaceInBlock*.25;
        let totalSpacePerAttr = (spaceInBlock - barPadding)/selectedAttr.length;
        console.log("length: ", xaxisVal.length);

        for(let ind = 0; ind < xaxisVal.length; ind++) {
            let stateGroupSel = this.svg.select('#grp' + xaxisVal[ind]).selectAll('rect').data(this.selectedAttr);
            stateGroupSel
                .enter()
                .append('rect')
                .attr('x', function(d,i){
                    let startPosition = ((spaceInBlock)*ind) + yaxisWidth + (barPadding/2);
                    let barPosition = (startPosition + (totalSpacePerAttr * i));
                    return barPosition;
                })
                .attr('y', xaxisHeight)
                .attr('width', function(d) {
                    return totalSpacePerAttr;
                })
                .merge(stateGroupSel)
                .transition()
                .duration(1000)
                .style("fill", function(d,i){
                    const color = colorList.find(a => a.attrname === d);
                    return color.attrcol;
                })
                .attr('height', function(d, i) {
                    var stateData = rankedDataTemp.find(obj => {return obj.name === xaxisVal[ind]});
                    var ranking = stateData.rank.indexOf(d) + 1;
                    var barChartHeight = (svgHeight - xaxisHeight - 15) / allAttrTemp.length;
                    return (ranking * barChartHeight);
                })
            ;
        }
    }

}
