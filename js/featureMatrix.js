
/** Class implementing the tileChart. */
class FeatureMatrix {

  /**
   * Initializes the svg elements required to lay the tiles
   * and to populate the legend.
   */
  constructor(tooltip){

    let matrix = d3.select("#matrix").classed("content", true);
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = matrix.node().getBoundingClientRect();
    this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = this.svgWidth/2 + 30;
    let legendHeight = 150;
    //add the svg to the div
    // let legend = d3.select("#legend").classed("content",true);

    //creates svg elements within the div
    // this.legendSvg = legend.append("svg")
    //     .attr("width",this.svgWidth)
    //     .attr("height",legendHeight)
    //     .attr("transform", "translate(" + this.margin.left + ",0)");
    this.svg = matrix.append("svg")
        .attr("width",this.svgWidth)
        .attr("height",this.svgHeight)
        .attr("transform", "translate(" + this.margin.left + ",0)");
    this.svg.append('g')
        .attr("id", "xAxis");
      this.svg.append('g')
          .attr("id", "yAxis");
      this.svg.append('g')
          .attr("id", "tiles");
    // this.tooltip = tooltip;
  };

  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  // chooseClass (party) {
  //   if (party == "R"){
  //     return "republican";
  //   }
  //   else if (party== "D"){
  //     return "democrat";
  //   }
  //   else if (party == "I"){
  //     return "independent";
  //   }
  // }

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
  update (){
    let data = [  {name: "Utah", inventory: 5, unit_price: 45.99},
        {name: "Alabama", inventory: 10, unit_price: 123.75},
        {name: "Texas", inventory: 2, unit_price: 399.50}
        ];
    let listOfProp = ["inventory", "unit_price"];

      data.sort(function(a, b) {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });

      var xaxisVal = data.map(function(a) {return a.name});
      var yaxisVal = listOfProp;
      let svgWidth = this.svgWidth;
      let svgHeight = this.svgHeight;

      // let bChartBars = bChartSvg.select('#bars').selectAll('rect').data(xaxisVal);
      // bChartBars.exit().remove();

      // Create the x and y scales; make
      // sure to leave room for the axes
      let xaxisHeight = 35;
      let yaxisWidth = 40;
      let maxrange = this.svgWidth - yaxisWidth;
      if(data.length < 15)
          maxrange = this.svgWidth/2;
      let xscale = d3.scaleBand()
          .domain(xaxisVal)
          .range([yaxisWidth,maxrange])
          .padding(0.25)
      ;
      let height = svgHeight - 55;
      let yscale = d3.scaleBand()
          .domain(yaxisVal)
          .range([10, height])
          .padding(.5)
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
          .tickFormat((d,i) => yaxisVal[i])
      ;

      xaxisSel.attr('transform', `translate(${yaxisWidth}, 100) scale(1, -1)`)
          .call(xaxis)
          .selectAll("text")
          .style("text-anchor", "start")
          .attr("dx", ".8em")
          .attr("dy", "-.8em")
          .attr("transform", "rotate(-110) scale(-1, 1)")
          .style("font-size", 14)
          .style("fill", "black")
          .style("stroke-width", 0.6)
      ;

      yaxisSel.attr('transform', `translate(${yaxisWidth + 40}, ${svgHeight-10}) scale(1, -1)`)
          .call(yaxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("transform", "scale(1, -1)")
      ;

      let colorFunc = function (i) {
          // var yVal = yaxisVal[i]/d3.max(yaxisVal);
          return d3.interpolateLab("#45b6fe", "#0e2433");
      }

      const tiles = this.svg.select("#tiles");
      console.log("tiles");
      tiles.selectAll('g').data(data).enter().append('g')
          .attr("id", function(d, i){
              console.log(d);
              return "col" + i.toString()
          });

    for(let ind = 0; ind < data.length; ind++) {
        let column = this.svg.select('#col' + ind.toString());
        column = column.selectAll('rect').data(listOfProp)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
                console.log(ind);
                console.log(xscale(ind))
                return 100 * ind;
            })
            .attr("y", (d, i) => 30*i + 200)
            .attr("height", 20)
            .attr("width", 20)
            .style("fill", function(d) {
                let getAttrRange = Math.max(data.map(function(a) {return a[d]}));
                let getCurrAttrVal = data[ind]
            });
    }
      // this.svg.select("#tiles")
      //     .enter()
      //     .append('rect')
      //     .attr('transform', `translate(${yaxisWidth}, 10)`)
      //     .attr('x', (d,i) => xscale(d))
      //     .attr('y', xaxisHeight)
      //     .attr('width', xscale.bandwidth())
      //     .attr('class', 'eachbar')
      //     .merge(bChartBars)
      //     .on('click', function(d){
      //         d3.select('#bars').selectAll('rect').style('fill', function(d,i){
      //             return colorFunc(i);
      //         }).attr('class', 'eachbar');
      //         d3.select(this).style('fill', 'maroon').attr('class', 'selected');
      //         barChart.infoPanel.updateInfo(barChart.allData.find(a => a.year === d));
      //         barChart.worldMap.updateMap(barChart.allData.find(a => a.year === d));
      //     })
      //     .transition()
      //     .duration(1000)
      //     .style("fill", function(d,i){
      //         if(d3.select(this).attr("class") == 'selected'){
      //             return "maroon";
      //         }
      //         return colorFunc(i); //pass i to scale
      //     })
      //     .attr('height', function(d, i) {
      //         return height-yscale(yaxisVal[i]);
      //     })//(d,i) => height-yscale(yaxisVal[i]))
      // ;
  };


}
