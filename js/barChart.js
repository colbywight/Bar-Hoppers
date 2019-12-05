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
    }
    updateSelectedAttributes(attributes){
        this.selectedAttr = attributes
    }
    updateSelectedStates(states){
        this.rankedData = states
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    update() {
        this.svg.select('#bars').selectAll('*').remove();
        this.svg.select('#gridLinesHorz').selectAll('*').remove();

        this.svg.attr('transform', `scale(1, -1)`);
        this.rankedData.sort(function(x, y){
            return d3.ascending(x.name, y.name);
        });
        var xaxisVal = this.rankedData.map(function(a) {return a.name});
        let svgWidth = 1400;
        let svgHeight = 400;

        let bChartBars = this.svg.select('#bars').selectAll('g').data(xaxisVal);
        bChartBars.enter().append('g').attr('id', (d) => 'grp' + d)

        // Create the x and y scales; make
        // sure to leave room for the axes
        let xaxisHeight = 75;
        let yaxisWidth = 40;
        let xscale = d3.scaleBand()
            .domain(xaxisVal)
            .range([yaxisWidth,svgWidth-yaxisWidth])
            .padding(0.25)
        ;
        let height = svgHeight - 55;
        let yscale = d3.scaleLinear()
            .domain([this.allattributes.length, 0])
            .range([-xaxisHeight, height - 30])
        ;

        // Create the axes (hint: use #xAxis and #yAxis)
        let xaxisSel = this.svg.select('#xAxis');
        let yaxisSel = this.svg.select('#yAxis');

        let xaxis = d3.axisBottom(xscale)
            .tickFormat((d,i) => xaxisVal[i])
        ;

        let yaxis = d3.axisLeft(yscale)
            .ticks(this.allattributes.length)
            .tickFormat(d3.format("d"))
        ;

        xaxisSel.attr('transform', `translate(${yaxisWidth}, ${xaxisHeight}) scale(1, -1)`)
            .call(xaxis)
            .selectAll("text")
            .style("text-anchor", "middle")
            .style('font-size', 16)
        ;

        this.svg.append('text')
            .attr('transform', `scale(1, -1)`)
            .attr('x', svgWidth/2 + yaxisWidth)
            .attr('y', -10)
            .text('States')
            .attr('text-anchor', 'middle')
            .attr("font-size", "20px")
            .attr("fill", "black")
            .style('font-family', 'Arvo');


        yaxisSel.attr('transform', `translate(${yaxisWidth + 40}, ${svgHeight-10}) scale(1, -1)`)
            .transition()
            .duration(1000)
            .call(yaxis)
            .selectAll("text")
            .style('font-size', 14)
        ;

        this.svg.append('text')
            .attr('transform', `translate(${yaxisWidth + 40}, ${svgHeight-10}) scale(1, -1)`)
            .attr('x', 1000)
            .attr('y', -1000)
            .text('Strong')
            .attr("font-size", "12px")
            .attr("fill", "black")
            .attr("transform", "rotate(-65)");
        this.svg.append('text')
        // .attr('transform', `scale(1, -1)`)
            .attr('x', -100)
            .attr('y', 300)
            .text('Weak')
            .attr("font-size", "12px")
            .attr("fill", "black")
            .attr("transform", "rotate(90)");
        this.svg.append('text')
            .attr('transform', `scale(1, -1)`)
            .attr('x', 50)
            .attr('y', -150)
            .text('Correlation')
            .attr("font-size", "12px")
            .attr("fill", "black");

        let gridLines = this.svg.select('#gridLines').selectAll('line').data([1, 3, 5, 7, 9]);
        gridLines.enter()
            .append("line")
            .attr('x1', yaxisWidth)
            .attr('x2', svgWidth-yaxisWidth)
            .attr('y1', function(d){
                return yscale(d) + 110;
            })
            .attr('y2', function(d){
                return yscale(d) + 110;
            })
            .attr('transform', `translate(${yaxisWidth}, 79)`)
            .style("fill", "none")
            .style("stroke", "#d3d3d3")
            .style("stroke-width", 1)
        ;

        let gridLinesHorz = this.svg.select('#gridLinesHorz').selectAll('line').data(xaxisVal);
        gridLinesHorz.enter()
            .append("line")
            .attr('x1', function(d, i) {
                let gridW = yaxisWidth + ((svgWidth - yaxisWidth - yaxisWidth)/xaxisVal.length);
                let toAdd = (svgWidth - yaxisWidth - yaxisWidth);
                if(xaxisVal.length > 1)
                    toAdd = toAdd/xaxisVal.length;
                return gridW + (toAdd * i);
            })
            .attr('x2', function(d, i) {
                let gridW = yaxisWidth + ((svgWidth - yaxisWidth - yaxisWidth)/xaxisVal.length);
                let toAdd = (svgWidth - yaxisWidth - yaxisWidth);
                if(xaxisVal.length > 1)
                    toAdd = toAdd/xaxisVal.length;
                return gridW + (toAdd * i);
            })
            .attr('y1', svgHeight + 130)
            .attr('y2', 40)
            .attr('transform', `translate(${yaxisWidth}, 0)`)
            .style("fill", "none")
            .style("stroke", "#d3d3d3")
            .style("stroke-width", 1)
        ;

        let allAttrTemp = this.allattributes;
        let rankedDataTemp = this.rankedData;
        let colorList = this.colorList;
        let selectedAttr = this.selectedAttr;
        let spaceInBlock = yaxisWidth + ((svgWidth - yaxisWidth - yaxisWidth)/xaxisVal.length) - yaxisWidth;
        let barPadding = spaceInBlock*.25;
        let totalSpacePerAttr = (spaceInBlock - barPadding)/selectedAttr.length;
        console.log("length: ", xaxisVal.length);

        for(let ind = 0; ind < xaxisVal.length; ind++) {
            let stateGroupSel = this.svg.select('#grp' + xaxisVal[ind]).selectAll('rect').data(this.selectedAttr);
            stateGroupSel
                .enter()
                .append('rect')
                .attr('transform', `translate(${yaxisWidth}, 10)`)
                .attr('x', function(d,i){
                    let startPosition = ((spaceInBlock)*ind) + yaxisWidth + (barPadding/2);
                    let barPosition = (startPosition + (totalSpacePerAttr * i));
                    return barPosition;
                })
                .attr('y', xaxisHeight - 10)
                .attr('width', function(d) {
                    return totalSpacePerAttr;
                })
                .merge(stateGroupSel)
                // .on('click', function(d){
                //     d3.select('#bars').selectAll('rect').style('fill', function(d,i){
                //         return colorFunc(i);
                //     }).attr('class', 'eachbar');
                //     d3.select(this).style('fill', 'maroon').attr('class', 'selected');
                //     barChart.infoPanel.updateInfo(barChart.allData.find(a => a.year === d));
                //     barChart.worldMap.updateMap(barChart.allData.find(a => a.year === d));
                // })
                .transition()
                .duration(1000)
                .style("fill", function(d,i){
                    const color = colorList.find(a => a.attrname === d);
                    return color.attrcol;
                })
                .attr('height', function(d, i) {
                    var stateData = rankedDataTemp.find(obj => {return obj.name === xaxisVal[ind]});
                    var ranking = stateData.rank.indexOf(d) + 1;
                    return (height/allAttrTemp.length) * ranking;
                })//(d,i) => height-yscale(yaxisVal[i]))
            ;
        }
    }

}
