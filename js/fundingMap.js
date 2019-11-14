
class FundingMap {
  /**
   * Constructor for the FundingMap
   *
   * @param shiftChart an instance of the SelectionChart class
   */
  constructor (shiftChart){
    this.shiftChart = shiftChart;
    
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 150;

    //creates svg element within the div
    this.svg = divelectoralVotes.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",this.svgHeight)
    ;

  };

  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass (party) {
    if (party == "R"){
      return "republican";
    }
    else if (party == "D"){
      return "democrat";
    }
    else if (party == "I"){
      return "independent";
    }
  }


  /**
   * Creates the stacked bar chart, text content and tool tips for electoral vote chart
   *
   * @param electionResult election data for the year selected
   * @param colorScale global quantile scale based on the winning margin between republicans and democrats
   */

  update (electionResult, colorScale){
    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
    const repubArr = electionResult.filter(state => state["State_Winner"] == "R");
    const demoArr = electionResult.filter(state => state["State_Winner"] == "D");
    const indArr = electionResult.filter(state => state["State_Winner"] == "I");

    repubArr.sort(function(a, b){
      a = parseFloat(a["RD_Difference"])
      b = parseFloat(b["RD_Difference"])
      if(a < b) { return -1; }
      if(a > b) { return 1; }
      return 0;
    })

    demoArr.sort(function(a, b){
      a = parseFloat(a["RD_Difference"])
      b = parseFloat(b["RD_Difference"])
      if(a < b) { return -1; }
      if(a > b) { return 1; }
      return 0;
    })

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.
    //D_EV_Total, I_EV_Total, R_EV_Total
    var demoTotal =parseInt(demoArr[0].D_EV_Total);
    var repTotal = parseInt(demoArr[0].R_EV_Total);
    var indTotal = ((demoArr[0].I_EV_Total == 0) ? 0 : parseInt(demoArr[0].I_EV_Total));
    var totEV = demoTotal + repTotal + indTotal;
    let xscale = d3.scaleLinear()
        .domain([0, totEV ])
        .range([0, this.svgWidth])
    ;

    var totalOrdArr = indArr.concat(demoArr, repubArr)
    var totalArrPos = [];
    this.svg.selectAll("*").remove();

    //Total_EV is the width
    let xPos = 0;
    let firstDemPos = indArr.length;
    this.svg.selectAll("rect")
        .data(totalOrdArr)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
          if(i == firstDemPos){
            firstDemPos = xPos;
          }
          let currentXPos = xPos;
          totalArrPos.push(xPos)
          xPos = currentXPos + xscale(parseInt(d.Total_EV));
          return currentXPos;
        })
        .attr("y", 50)
        .attr("height", 20)
        .attr("width", (d) =>  xscale(parseInt(d.Total_EV)))
        .attr('class', (d) => this.chooseClass(d["State_Winner"]) + " electoralVotes")
        .style("fill", function(d) {
          if(d["State_Winner"] != "I")
            return colorScale(d.RD_Difference)
        })



    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    if(indArr.length != 0) {
      this.svg.append("text")
          .text(totalOrdArr[0].I_EV_Total)
          .attr('class', "independent electoralVoteText")
          .attr('x', 0)
          .attr("y", 40)
          .attr("text-anchor", "start")
    }
    this.svg.append("text")
        .text(totalOrdArr[0].R_EV_Total)
        .attr('class', "republican electoralVoteText")
        .attr('x', this.svgWidth)
        .attr("y", 40)
        .attr("text-anchor", "end")
    this.svg.append("text")
        .text(totalOrdArr[0].D_EV_Total)
        .attr('class', "democrat electoralVoteText")
        .attr('x', firstDemPos)
        .attr("y", 40)
        .attr("text-anchor", "start")


    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.
    this.svg.append("rect")
        .attr("x", this.svgWidth/2)
        .attr("y", 40)
        .attr('width', 2)
        .attr("height", 50)
        .attr("class", "middlePoint")
        .style("fill", "black")
        .style("border-color", "black");
    const halfwaypoint = Math.ceil(totEV/2) + 1
    this.svg.append("text")
        .text("Electoral Vote (" + halfwaypoint + " needed to win)")
        .attr('class', "electoralVoteText")
        .attr('x', this.svgWidth/2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", 16)
        .attr("class", "electoralVotesNote")

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    // append text to svg
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.
    var shiftChart = this.shiftChart;
    function brushed () {
      d3.select("#shiftChart").selectAll("li").remove();
      var states = [];
      var selected = d3.event.selection;
      var start = selected[0];
      var end = selected[1];
      for(let i = 0; i < totalArrPos.length; i++) {
        if(totalArrPos[i] > start && totalArrPos[i] < end) {
          states.push(totalOrdArr[i])
        }
      }
      shiftChart.update(states)
    }

    let brush = d3.brushX().extent([[0,45],[this.svgWidth,75]]).on("end", brushed);
    this.svg.append("g").attr("class", "brush").call(brush);

  };

  
}
