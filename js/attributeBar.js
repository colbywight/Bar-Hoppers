
/** Class implementing the tileChart. */
class AttributeBar {

    /**
     * Initializes the svg elements required to lay the tiles
     * and to populate the legend.
     */
    // constructor(tooltip){
    constructor(barChart, attrColor, totRank) {
        // I'm going to get a list of the attributes in order from highest to lowest.
        this.barChart = barChart;
        this.attrColor = attrColor;
        console.log(attrColor);
        this.totRank = totRank;
        console.log(this.totRank);

        this.svg = d3.select('#attributeBar')
            .append('svg')
            .attr('width', 1500)
            .attr('height', 200)
        ;

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
        this.buildBar()
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
    buildBar(){
        let barx = 150;
        let bary = 140;
        let barWidth = 1200;
        let barHeight = 10;

        let bar = this.svg.append('rect')
            .attr('x', barx)
            .attr('y', bary)
            .attr('width', barWidth)
            .attr('height', barHeight)
            .style('fill', 'lightgray')
        ;

        let scaler = d3.scaleLinear()
            .domain([0, 500])
            .range([barx, barWidth + barx])
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

        let thiss = this;
        this.svg.selectAll('circle')
            .data(this.totRank)
            .enter()
            .append('circle')
            // .attr('cx', d => console.log(d); return d.ranktot;)
            .attr('cx', function (d) {return scaler(d[0].ranktot);})
            .attr('cy', bary + 5)
            .attr('r', '15')
            .style('fill', 'white')
            // .style('stroke', 'blue')
            .style('stroke', function (d) {
                for (let i = 0; i < thiss.attrColor.length; i++){
                    if (d[0].attrname == thiss.attrColor[i].attrname){
                        return thiss.attrColor[i].attrcol
                    }
                }
            })
            .style('stroke-width', 5)
            .on('click', function (d) {
                let color = "";
                    for (let i = 0; i < thiss.attrColor.length; i++){
                        if (d[0].attrname == thiss.attrColor[i].attrname){
                            // return thiss.attrColor[i].attrcol
                            color = thiss.attrColor[i].attrcol
                        }
                    }
                // console.log(d3.select(this).style('fill') == 'white');
                // console.log(d3.select(this).style('fill'));
                // console.log(color)
                if (d3.select(this).style('fill') == 'white'){
                    d3.select(this).style('fill', color)
                }
                else {
                    d3.select(this).style('fill', 'white')
                }

                // d3.select(this)
                //     .style('fill', 'blue')
                clickedAttributes.includes(d[0].attrname) ? clickedAttributes.remove(d[0].attrname) : clickedAttributes.push(d[0].attrname)
                thiss.barChart.updateSelectedAttributes(clickedAttributes);
                thiss.barChart.update();

            })
        ;

        this.svg.selectAll('text')
            .data(this.totRank)
            .enter()
            .append('text')
            // .attr('x', function (d) {return scaler(d[0].ranktot) -10;})
            // .attr('y', '30')
            // .text(d => d[0].attrname)
            .text(function (d) {
                for (let i = 0; i < thiss.attrColor.length; i++){
                    if (d[0].attrname == thiss.attrColor[i].attrname){
                        return thiss.attrColor[i].attrlabel
                    }
                }
            })
            .style('font-size', '12px')
            .attr("text-anchor", "start")
            .attr('transform', (d, i) => {
                return 'translate( ' + (scaler(d[0].ranktot)) + ', 120), rotate(-45)';
            })
        ;

        this.svg.append('text')
            .attr('x', barx - 50)
            .attr('y', bary + 40)
            .text('Low Performance Correlation')
        ;
        this.svg.append('text')
            .attr('x', barWidth - 10)
            .attr('y', bary + 40)
            .text('High Performance Correlation')
        ;
    }

    updateSelectedStates(selectedStates){
        this.selectedStates = selectedStates
    }
}