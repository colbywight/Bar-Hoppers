
/** Class implementing the tileChart. */
class RankTable {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    // constructor(tooltip){
    constructor(attributes, barChart) {
        // I'm going to get a list of the attributes in order from highest to lowest.
        this.barChart = barChart;
        console.log('rank table constructor');
        this.attributes = attributes;

        // let rankTable = d3.select("#ranktable").classed("content", true);
        // this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        // //Gets access to the div element created for this chart and legend element from HTML
        // let svgBounds = rankTable.node().getBoundingClientRect();
        // this.svgWidth = svgBounds.width - this.margin.left - this.margin.right;
        // this.svgHeight = this.svgWidth / 2 + 30;
        // let legendHeight = 150;
        // //add the svg to the div
        //
        // this.svg = rankTable.append("svg")
        //     .attr("width", this.svgWidth)
        //     .attr("width", 960)
        //     // .attr("height", this.svgHeight)
        //     .attr("height", 400)
        //     .attr("height", 600)
        //     .attr("transform", "translate(" + this.margin.left + ",0)");

        // this.svg = d3.select('#ranktable').append('svg');
        this.buildTable()
        // this.svg.append('circle')
        //     .attr('width', 10 )
        //     .attr('height', 10)
        //     .attr('r', 10)
        // ;
    };

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    buildTable(){
        // this could take in the list of attributes in order of most correlated to
        // least correlated to performance.
        // let attributes = ['Funding', 'Libraries', 'Parent Involvement']
        // let table = this.svg.append('table')
        //     .append('th')
        //     .text('Factors')
        // ;
        let tr = d3.select('table').select('tbody').selectAll('tr')
            .data(this.attributes)
            .enter()
            .append('tr')
        ;
        tr.append('td')
            .text((d, i) => i + 1)
        ;
        let clickedAttributes = [];

        Array.prototype.remove = function() {
            var what, a = arguments, L = a.length, ax;
            while (L && this.length) {
                what = a[--L];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };

        tr.append('td')
            .text(d => d)
            .on('click', d => {
                // console.log(d);
                clickedAttributes.includes(d) ? clickedAttributes.remove(d) : clickedAttributes.push(d)
                // console.log(clickedAttributes)
                this.barChart.updateSelectedAttributes(clickedAttributes);
                this.barChart.update();

            }
    )
    }

    updateSelectedStates(selectedStates){
        this.selectedStates = selectedStates
    }

    update() {

    }
}