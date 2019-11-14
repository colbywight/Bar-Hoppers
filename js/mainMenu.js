
class MainMenu {

  /**
   * Constructor for the Year Chart
   *
   * @param electoralVoteChart instance of FundingMap
   * @param tileChart instance of MapChart
   * @param votePercentageChart instance of Vote Percentage Chart
   * @param electionInfo instance of ElectionInfo
   * @param electionWinners data corresponding to the winning parties over mutiple election years
   */
  constructor (electoralVoteChart, tileChart, votePercentageChart, electionWinners) {

    //Creating MainMenu instance
    this.electoralVoteChart = electoralVoteChart;
    this.tileChart = tileChart;
    this.votePercentageChart = votePercentageChart;
    // the data
    this.electionWinners = electionWinners;
    
    // Initializes the svg elements required for this chart
    this.margin = {top: 10, right: 20, bottom: 30, left: 50};
    let divyearChart = d3.select("#year-chart").classed("fullView", true);

    //fetch the svg bounds
    this.svgBounds = divyearChart.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 100;

    //add the svg to the div
    this.svg = divyearChart.append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);

    this.selected = null;
  }

  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass (data) {
    if (data == "R") {
      return "yearChart republican";
    }
    else if (data == "D") {
      return "yearChart democrat";
    }
    else if (data == "I") {
      return "yearChart independent";
    }
  }

  /**
   * Creates a chart with circles representing each election year, populates text content and other required elements for the Year Chart
   */
  update () {

    //Domain definition for global color scale
    let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

    //Color range for global color scale
    let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a", "#de2d26", "#a50f15", "#860308"];

    //ColorScale be used consistently by all the charts
    this.colorScale = d3.scaleQuantile()
      .domain(domain)
      .range(range);

    this.svg.selectAll("*").remove();
    // ******* TODO: PART I *******
    this.svg.append("line")
        .attr("x1", 10)
        .attr("y1", 30)
        .attr("x2", this.svgWidth)
        .attr("y2", 30)
        .attr('class', 'lineChart')

    // Create the chart by adding circle elements representing each election year
    var circPos = []
    this.svg.selectAll('circle')
        .data(this.electionWinners)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('cx', (d, i) => i*50 + 30)
        .attr('cy', 30)
        .attr('class', (d) => this.chooseClass(d.PARTY))
        .on('mouseover', function(d){
          d3.select(this).classed("highlighted", true);
        })
        .on('mouseout', function(d){
          d3.select(this).classed("highlighted", false);
        })
        .on('click', (d) => {
          var shiftChart = d3.select("#shiftChart").selectAll('li').remove();
          d3.select("#year-chart").selectAll('circle').classed("selected", false);
          d3.select(d3.event.target).classed("selected", true);
          d3.csv("data/Year_Timeline_" + d.YEAR + ".csv").then(pageData => {
            this.electoralVoteChart.update(pageData, this.colorScale);
            this.votePercentageChart.update(pageData);
            this.tileChart.update(pageData, this.colorScale);
          });
        })

    this.svg.selectAll('text').data(this.electionWinners)
        .enter()
        .append("text")
        .text((d) => d.YEAR)
        .attr("class", ".yearText")
        .attr('x', (d, i) => i*50 + 10)
        .attr("y", 70)

    //The circles should be colored based on the winning party for that year
    //HINT: Use the .yearChart class to style your circle elements
    //HINT: Use the chooseClass method to choose the color corresponding to the winning party.

    //Append text information of each year right below the corresponding circle
    //HINT: Use .yeartext class to style your text elements

    //Style the chart by adding a dashed line that connects all these years.
    //HINT: Use .lineChart to style this dashed line

    //Clicking on any specific year should highlight that circle and  update the rest of the visualizations
    //HINT: You can get the d3 selection that was clicked on using
    //   d3.select(d3.event.target)
    //HINT: Use .highlighted class to style the highlighted circle

    //Election information corresponding to that year should be loaded and passed to
    // the update methods of other visualizations


    //******* TODO: EXTRA CREDIT *******

    //Implement brush on the year chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.

    var electionWinCop = this.electionWinners;
    function brushed () {
      var yearChart = d3.select("#yearChart");
      yearChart.selectAll("li").remove();
      var years = [];
      var selected = d3.event.selection;
      var start = selected[0];
      var end = selected[1];
      for(let i = 0; i < electionWinCop.length; i++) {
        if((i*50 + 30) > start && (i*50 + 30) < end) {
          years.push(electionWinCop[i].YEAR)
        }
      }
      yearChart.selectAll("li").data(years).enter().append('li').text((d) => d)
    }

    let brush = d3.brushX().extent([[0,55],[this.svgWidth,80]]).on("end", brushed);
    this.svg.append("g").attr("class", "brush").call(brush);

  }

}
