
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
        // .attr("transform", "translate(0, 0)//(" + this.margin.left + ",0)");
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
    let data = [  {name: "Utah", performance: 5, diversity: 45.99, giftedtalented: 3},
        {name: "Alabama", performance: 10, diversity: 123.75, giftedtalented: 15},
        {name: "Texas", performance: 2, diversity: 399.50, giftedtalented: 5},
        {name: "Mississippi", performance: 7, diversity: 250.50, giftedtalented: 10},
        {name: "Maine", performance: 7, diversity: 250.50, giftedtalented: 10},
        {name: "Vermont", performance: 7, diversity: 250.50, giftedtalented: 10},
        {name: "South Dakota", performance: 7, diversity: 250.50, giftedtalented: 10},
        {name: "South Carolina", performance: 7, diversity: 250.50, giftedtalented: 10},
        {name: "Nevada", performance: 7, diversity: 250.50, giftedtalented: 10},
        {name: "California", performance: 7, diversity: 250.50, giftedtalented: 10},
        {name: "Oregon", performance: 7, diversity: 250.50, giftedtalented: 10},
    ];
    let listOfProp = ["performance", "diversity", "giftedtalented"];

      data = data.sort(function(a, b) {
          var textA = a.name.toUpperCase();
          var textB = b.name.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });

      var xaxisVal = data.map(function(a) {return a.name});
      var yaxisVal = listOfProp;

      // Create the x and y scales
      let yaxisWidth = 40;
      let maxrange = this.svgWidth - yaxisWidth;
      let yaxisRatio = (maxrange/data.length) * listOfProp.length;
      if(data.length < 10) {
          maxrange = this.svgWidth/2;
          yaxisRatio = ((maxrange)/data.length) * listOfProp.length;
      }
      let xscale = d3.scaleBand()
          .domain(xaxisVal)
          .range([yaxisWidth,maxrange])
          .padding(0.25)
      ;
      let xscalepos = d3.scaleLinear()
          .domain([0, data.length])
          .range([yaxisWidth, maxrange])
      ;
      let yscale = d3.scaleBand()
          .domain(yaxisVal)
          .range([0, yaxisRatio-20])
          .padding(0.25)
      ;

      let yscalepos = d3.scaleLinear()
          .domain([0, listOfProp.length])
          .range([0, yaxisRatio-20])
      ;

      // Create colorScale
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


      yaxisSel.attr('transform', `translate(${yaxisWidth + 40}, 100)`)
          .call(yaxis)
          .selectAll("text")
          .style("text-anchor", "end")
      ;

      let colorFunc = function (i) {
          return d3.interpolateLab("white", "#0e2433")(i);
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
            .attr("x", function(d) {
                return xscalepos(ind) + yaxisWidth + 10;
            })
            .attr("y", function(d, i) {
                return yscalepos(i) + 110;
            })
            .attr("height", (d) => (maxrange/data.length) - 15)
            .attr("width", (d) => (maxrange/data.length) - 15)
            .style("fill", function(d) {
                let getAttrRange = data.map(function(a) {return a[d]});
                let maxVal = Math.max.apply(Math,getAttrRange);
                let colorRatio = data[ind][d]/maxVal;
                return colorFunc(colorRatio);
            });
        let columntext = this.svg.select('#col' + ind.toString());
        columntext = columntext.selectAll('text').data(listOfProp)
            .enter()
            .append("text")
            .text(function(d) {
                let getAttrRange = data.map(function(a) {return a[d]});
                let maxVal = Math.max.apply(Math,getAttrRange);
                let textstring = Math.floor(data[ind][d]).toString() + '/' + Math.floor(maxVal).toString();
                return textstring;
            })
            .style("text-anchor", "middle")
            .attr("x", function(d) {
                return xscalepos(ind) + yaxisWidth + 10 + ((maxrange/data.length) - 15)/2;
            })
            .attr("y", function(d, i) {
                return yscalepos(i) + 110 + ((maxrange/data.length) - 15)/2;
            })
            .attr( "pointer-events", "none")
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
