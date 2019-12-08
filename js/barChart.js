class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param attributes
     * @param attrColorList
     */
    constructor(attributes, attrColorList) {
        //initialize selections and measurements of svg, height, and width of axis
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

    /**
     * These two methods are to update what attributes are selected and what states are selected
     * @param attributes
     * @param states
     */
    updateSelectedAttributes(attributes){
        this.selectedAttr = attributes
    }
    updateSelectedStates(states){
        this.rankedData = states
    }

    /**
     *Initializes the bar chart axis and text display
     */
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

        //create axis
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
        //set labels of chart
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
     * Updates the bar chart based on states and attributes selected
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
        this.svg.select('#gridLinesVert').selectAll('*').remove();

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

        //add horizontal gridlines
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

        //add vertical gridlines
        let gridLinesVert = this.svg.select('#gridLinesVert').selectAll('line').data(xaxisVal);
        gridLinesVert.enter()
            .append("line")
            .attr('x1', function(d, i) {
                //calculate the width of the bar chart itself then divide by number of states to get
                //each area the line will separate
                let gridW = (svgWidth - yaxisWidth)/xaxisVal.length;
                //shift over by the width of yaxis
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

        //set temps to not have issues with this
        let allAttrTemp = this.allattributes;
        let rankedDataTemp = this.rankedData;
        let colorList = this.colorList;
        let selectedAttr = this.selectedAttr;
        //calculate how much space a state gets on the chart
        let spaceInBlock = (svgWidth - yaxisWidth)/xaxisVal.length;
        //add padding for separability between each states bars
        let barPadding = spaceInBlock*.25;
        let totalSpacePerAttr = (spaceInBlock - barPadding)/selectedAttr.length;

        //loop through each state and add bars according to selected attributes
        for(let ind = 0; ind < xaxisVal.length; ind++) {
            let stateGroupSel = this.svg.select('#grp' + xaxisVal[ind]).selectAll('rect').data(this.selectedAttr);
            stateGroupSel
                .enter()
                .append('rect')
                .attr('x', function(d,i){
                    //find the rectangles starting position
                    let startPosition = ((spaceInBlock)*ind) + yaxisWidth + (barPadding/2);
                    //move over by how many bars exist
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
                    //calculate height using rank and number as yscale is inverted so caused issues
                    var stateData = rankedDataTemp.find(obj => {return obj.name === xaxisVal[ind]});
                    var ranking = stateData.rank.indexOf(d) + 1;
                    var barChartHeight = (svgHeight - xaxisHeight - 15) / allAttrTemp.length;
                    return (ranking * barChartHeight);
                })
            ;
        }
    }

}
