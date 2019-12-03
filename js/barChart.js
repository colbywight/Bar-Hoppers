/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(attributes) {
        let barchart = d3.select("#barchart");
        this.svg = barchart;
        this.allattributes = attributes;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    update(selectedDimension) {
        // ******* TODO: PART I *******
        let selectedAttr = ['funding', 'libraries', 'giftedtalented'];
        let rankedData = [
            {state: "Utah", name: "UT", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "AA", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "BB", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "CC", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "DD", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "EE", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "FF", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "GG", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "HH", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "II", rank: ["funding", "libraries", "diversity", "giftedtalented"]},
            {name: "JJ", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "KK", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "LL", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "MM", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "NN", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "OO", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "PP", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "QQ", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "RR", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "SS", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "TT", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "UU", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "VV", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "WW", rank: ["funding", "libraries", "giftedtalented", "diversity"]},
            {name: "XX", rank: ["funding", "libraries", "giftedtalented", "diversity"]},

        ];

        this.svg.attr('transform', `scale(1, -1)`);
        rankedData.sort(function(x, y){
            return d3.ascending(x.name, y.name);
        });
        var xaxisVal = rankedData.map(function(a) {return a.name});
        let svgWidth = 1400;
        let svgHeight = 400;

        let bChartBars = this.svg.select('#bars').selectAll('g').data(xaxisVal);
        bChartBars.exit().remove();

        bChartBars.enter().append('g').attr('id', (d) => 'grp' + d)

        // Create the x and y scales; make
        // sure to leave room for the axes
        let xaxisHeight = 35;
        let yaxisWidth = 40;
        let xscale = d3.scaleBand()
            .domain(xaxisVal)
            .range([yaxisWidth,svgWidth-yaxisWidth])
            .padding(0.25)
        ;
        let height = svgHeight - 55;
        let yscale = d3.scaleLinear()
            .domain([this.allattributes.length, 0])
            .range([0, height])
        ;

        // Create colorScale
        //
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

        xaxisSel.attr('transform', `translate(${yaxisWidth}, 45) scale(1, -1)`)
            .call(xaxis)
            .selectAll("text")
            .style("text-anchor", "middle")
        ;

        yaxisSel.attr('transform', `translate(${yaxisWidth + 40}, ${svgHeight-10}) scale(1, -1)`)
            .transition()
            .duration(1000)
            .call(yaxis)
        ;

        let colorFunc = function (i) {
            // var yVal = yaxisVal[i]/d3.max(yaxisVal);
            return d3.interpolateLab("#45b6fe", "#0e2433");//(yVal);
        }

        // let onClickFunc = function(d){
        //   d3.select('#bars').selectAll('rect').style('fill', function(d,i){
        //     return colorFunc(i);
        //   })
        //   d3.select(this).style('fill', 'maroon')
        // }
        let allAttrLen = this.allattributes.length;
        for(let ind = 0; ind < xaxisVal.length; ind++) {
            let stateGroupSel = this.svg.select('#grp' + xaxisVal[ind]).selectAll('rect').data(selectedAttr);
            stateGroupSel
                .enter()
                .append('rect')
                .attr('transform', `translate(${yaxisWidth}, 10)`)
                .attr('x', function(d,i){
                    let barGroupSpace = (svgWidth-yaxisWidth)/rankedData.length;
                    let barPadding = barGroupSpace*.3;
                    let totalSpacePerAttr = (barGroupSpace - barPadding)/selectedAttr.length;
                    let stuff = xscale(xaxisVal[ind]) + (i * totalSpacePerAttr) + (barPadding/2) - 5;
                    return stuff;
                })
                .attr('y', xaxisHeight)
                .attr('width', 5)
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
                    // if(d3.select(this).attr("class") == 'selected'){
                        return "maroon";
                    // }
                    // return colorFunc(i); //pass i to scale
                })
                .attr('height', function(d, i) {
                    var stateData = rankedData.find(obj => {return obj.name === xaxisVal[ind]});
                    var ranking = stateData.rank.indexOf(d) + 1;
                    return (height/allAttrLen) * ranking;
                })//(d,i) => height-yscale(yaxisVal[i]))
            ;
        }
    }

}
