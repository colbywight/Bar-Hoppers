/** Class implementing the votePercentageChart. */
class PerformanceMap {

  /**
   * Initializes the svg elements required for this chart;
   */
  constructor(tooltip){
    this.margin = {top: 30, right: 20, bottom: 30, left: 50};
    let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

    //fetch the svg bounds
    this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 200;

    //add the svg to the div
    this.svg = divvotesPercentage.append("svg")
      .attr("width",this.svgWidth)
      .attr("height",this.svgHeight)

    this.tooltip = tooltip;
  }


  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass(data) {
    if (data == "R"){
      return "republican";
    }
    else if (data == "D"){
      return "democrat";
    }
    else if (data == "I"){
      return "independent";
    }
  }

  /**
   * Renders the HTML content for tool tip
   *
   * @param tooltip_data information that needs to be populated in the tool tip
   * @return text HTML content for toop tip
   */
  tooltip_render (tooltip_data) {
    let text = "<ul>";
    tooltip_data.result.forEach((row)=>{
      text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+"%)" + "</li>"
    });

    return text;
  }

  /**
   * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
   *
   * @param electionResult election data for the year selected
   */
  update (electionResult){
    // ******* TODO: PART III *******
    var dPop = parseFloat(electionResult[0].D_PopularPercentage.split("%")[0]);
    var rPop = parseFloat(electionResult[0].R_PopularPercentage.split("%")[0]);
    var iPop = parseFloat(electionResult[0].I_PopularPercentage == "" ? 0 : electionResult[0].I_PopularPercentage.split("%")[0]);

    let xscale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, this.svgWidth])
    ;

    const dataArr = [xscale(dPop), xscale(rPop), xscale(iPop)];

    this.svg.selectAll("*").remove();

    this.svg
        .append("rect")
        .attr("x", 0)
        .attr("y", 50)
        .attr("height", 20)
        .attr("width", dataArr[2])
        .attr('class',this.chooseClass("I") + " votesPercentage")
    this.svg
        .append("rect")
        .attr("x", dataArr[2])
        .attr("y", 50)
        .attr("height", 20)
        .attr("width", dataArr[0])
        .attr('class',this.chooseClass("D") + " votesPercentage")
    this.svg
        .append("rect")
        .attr("x", dataArr[2] + dataArr[0])
        .attr("y", 50)
        .attr("height", 20)
        .attr("width", dataArr[1])
        .attr('class',this.chooseClass("R") + " votesPercentage")

    this.svg.append("rect")
        .attr("x", this.svgWidth/2)
        .attr("y", 40)
        .attr('width', 2)
        .attr("height", 40)
        .attr("class", "middlePoint")
        .style("fill", "black")
        .style("border-color", "black")
    this.svg.append("text")
        .text("Popular Vote (50%)")
        .attr('x', this.svgWidth/2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", 16)
        .attr("class", "votesPercentageNote")

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .votesPercentage class to style your bars.

    //Display the total percentage of votes won by each party
    //on top of the corresponding groups of bars.
    //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary
    if(iPop != 0) {
      this.svg.append("text")
          .text(iPop + "%")
          .attr('class', this.chooseClass("I") + " votesPercentageText ")
          .attr('x', 0)
          .attr("y", 40)
          .attr("text-anchor", "start")
      this.svg.append("text")
          .text(electionResult[0].I_Nominee_prop)
          .attr('class', this.chooseClass("I") + " votesPercentageText ")
          .attr('x', 0)
          .attr("y", 15)
          .attr("text-anchor", "start")
          .style("font-size", 16)
    }
    this.svg.append("text")
        .text(rPop + "%")
        .attr('class', this.chooseClass("R") + " votesPercentageText ")
        .attr('x', this.svgWidth)
        .attr("y", 40)
        .attr("text-anchor", "end")
    this.svg.append("text")
        .text(electionResult[0].R_Nominee_prop)
        .attr('class', this.chooseClass("R") + " votesPercentageText ")
        .attr('x', this.svgWidth)
        .attr("y", 15)
        .attr("text-anchor", "end")
        .style("font-size", 16)
    this.svg.append("text")
        .text(dPop + "%")
        .attr('class', this.chooseClass("D") + " votesPercentageText ")
        .attr('x', dataArr[2] + 50)
        .attr("y", 40)
        .attr("text-anchor", "start")
    this.svg.append("text")
        .text(electionResult[0].D_Nominee_prop)
        .attr('class', this.chooseClass("D") + " votesPercentageText ")
        .attr('x', dataArr[2] + 200)
        .attr("y", 15)
        .attr("text-anchor", "start")
        .style("font-size", 16)

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning details about this mark on top of this bar
    //HINT: Use .votesPercentageNote class to style this text element

    //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
    //then, vote percentage and number of votes won by each party.

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

  };


}
