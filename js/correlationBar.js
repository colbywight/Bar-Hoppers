
/** Class implementing the tileChart. */
class CorrelationBar {

  /**
   * Initializes the svg elements required to lay the tiles
   * and to populate the legend.
   */
  constructor(tooltip){

    let corBar = d3.select("#correlationbar").classed("content", true);
    this.margin = {top: 20, right: 20, bottom: 20, left: 20};
    //Gets access to the div element created for this chart and legend element from HTML
    let svgBounds = corBar.node().getBoundingClientRect();
    this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = this.svgWidth;
    this.svg = corBar.append("svg")
        .attr("width",this.svgWidth)
        .attr("height",this.svgHeight)
  };



  update (){
    let data = [  {name: "Utah", abreviation: "UT", performance: 5, diversity: 45.99, giftedtalented: 3},
      {name: "Alabama", abreviation: "AL", performance: 10, diversity: 123.75, giftedtalented: 15},
      {name: "Texas", abreviation: "TX", performance: 2, diversity: 399.50, giftedtalented: 5},
      {name: "Mississippi", abreviation: "MI", performance: 7, diversity: 250.50, giftedtalented: 10},
      {name: "Maine", abreviation: "MA", performance: 7, diversity: 250.50, giftedtalented: 10},
      {name: "Vermont", abreviation: "VM", performance: 7, diversity: 250.50, giftedtalented: 10},
      {name: "South Dakota", abreviation: "SD", performance: 7, diversity: 250.50, giftedtalented: 10},
      {name: "South Carolina", abreviation: "SC", performance: 7, diversity: 250.50, giftedtalented: 10},
      {name: "Nevada", abreviation: "NV", performance: 7, diversity: 250.50, giftedtalented: 10},
      {name: "California", abreviation: "CA", performance: 7, diversity: 250.50, giftedtalented: 10},
      {name: "Oregon", abreviation: "OR", performance: 7, diversity: 250.50, giftedtalented: 10},
    ];
    let selectedStates = ["Maine", "Texas"];
    let highlightedAttr = ['performance', 'diversity', 'giftedtalented'];

    // Create the svg:defs element and the main gradient definition.
      let colors = ["#860308", "#a50f15", "#de2d26", "#fb6a4a", "#fc9272", "#fcbba1", "#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c", "#063e78"];

    var grad = this.svg.append('defs')
        .append('linearGradient')
        .attr('id', 'grad')
        .attr('x1', '0%')
        .attr('x2', '100%')
        .attr('y1', '0%')
        .attr('y2', '0%');

    grad.selectAll('stop')
        .data(colors)
        .enter()
        .append('stop')
        .style('stop-color', function(d){ return d; })
        .attr('offset', function(d,i){
          return 100 * (i / (colors.length - 1)) + '%';
        });

    // for every selected state add a bar with id name equal to that of the state
    let stateGroups = this.svg.selectAll('g').data(selectedStates).enter().append('g').attr('id', (d) => d)
        .append("rect")
        .attr("x", 100)
        .attr("y", function (d, i) {
          return (i+1) * 70;
        })
        .attr("height", 20)
        .attr("width", 300)
        .style('fill', 'url(#grad)');

    let xscalepos = d3.scaleLinear()
        .domain([0, 1])
        .range([100, 400])
    ;

    for(let ind = 0; ind < selectedStates.length; ind++) {
      this.svg.select('#' + selectedStates[ind]).append('g').attr('id', 'attr' + selectedStates[ind]);
    }

    let dotLineFuncLeft = function (i) {
      if(i < 100)
        return 100;
      return i;
    }

    let dotLineFuncRight = function (i) {
      if(i > 400)
        return 400;
      return i;
    }

    for(let ind = 0; ind < selectedStates.length; ind++) {
      let baseBarGroup = this.svg.select('#attr' + selectedStates[ind]);
      let performancePosX = 0;
      const obj = data.find( ({ name }) => name === selectedStates[ind] );
        baseBarGroup = baseBarGroup.selectAll('rect').data(highlightedAttr)
          .enter()
          .append("rect")
          .attr("x", function(d) {
            let getAttrRange = data.map(function(a) {return a[d]});
            let maxVal = Math.max.apply(Math,getAttrRange);
            let posRatio = obj[d]/maxVal;
            let xpos = xscalepos(posRatio);
            if (d == 'performance')
              performancePosX = xpos;
            return xpos;
          })
          .attr("y", function(d) {
            if (d == 'performance')
              return (1+ind)*70-8;
            return (1+ind)*70-3;
          })
          .attr("height", function(d) {
            if (d == 'performance')
              return 40;
            return 30;
          })
          .attr("width", function(d) {
            if (d == 'performance')
              return 8;
            return 3;
          })
          .style("fill", function(d) {
            return 'black';
          });
      //add the boundary positions for good correlation
      let baseBarGroupSel = this.svg.select('#' + selectedStates[ind]);
      baseBarGroupSel.append("line")
          .attr("x1", function(d){
            return dotLineFuncLeft(performancePosX - 60);
          })
          .attr("x2", function(d){
            return dotLineFuncLeft(performancePosX - 60);
          })
          .attr("y1", (1+ind)*70-15)
          .attr("y2", (1+ind)*70+38)
          .style("stroke-dasharray","5,5")//dashed array for line
          .style("stroke", 'black');

      baseBarGroupSel.append("line")
          .attr("x1", function(d){
            return dotLineFuncRight(performancePosX + 68);
          })
          .attr("x2", function(d){
            return dotLineFuncRight(performancePosX + 68);
          })
          .attr("y1", (1+ind)*70-15)
          .attr("y2", (1+ind)*70+38)
          .style("stroke-dasharray","5,5")//dashed array for line
          .style("stroke", 'black');

      baseBarGroupSel
          .append("text")
          .text(obj.abreviation + ':')
          .attr('x', 60)
          .attr("y", (1+ind)*70 + 15)
    }
  };

}
