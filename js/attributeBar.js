
/** Class implementing the attributeBar. */
class AttributeBar {

    /**
     * @param barChart
     * @param attrColor
     * @param totRank
     */
    constructor(barChart, attrColor, totRank) {

        this.barChart = barChart;
        this.attrColor = attrColor;
        this.totRank = totRank;
        this.svg = d3.select('#attributeBar')
            .append('svg')
            .attr('width', 1500)
            .attr('height', 250)
        ;

        this.buildBar()
    };

    /**
     * Creates and the attribute selector bar and functionaly on click to update barChart
     */
    buildBar(){
        // dimensions for the bar and labels
        let barx = 30;
        let bary = 140;
        let barWidth = 900;
        let barHeight = 10;
        // Create the svg:defs element and the main gradient definition.
        let colors = ["black", "lightgrey"];
        // create a color gradient for the bar
        var grad = this.svg.append('defs')
            .append('linearGradient')
            .attr('id', 'grad')
            .attr('x1', '0%')
            .attr('x2', '100%')
            .attr('y1', '0%')
            .attr('y2', '0%')
        ;
        grad.selectAll('stop')
            .data(colors)
            .enter()
            .append('stop')
            .style('stop-color', function(d){ return d; })
            .attr('offset', function(d,i){
                return 100 * (i / (colors.length - 1)) + '%';
            })
        ;
        // create the bar
        let bar = this.svg.append('rect')
            .attr('x', barx)
            .attr('y', bary)
            .attr('width', barWidth)
            .attr('height', barHeight)
            .style('fill', 'url(#grad)')
        ;

        let scaler = d3.scaleLinear()
            .domain([0, 500])
            .range([barx, barWidth + barx])
        ;
        // holds the objects of the attributes that have been clicked
        let clickedAttributes = [];
        // remove function for arrays
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
        // create the circles for the attributes and functionality
        this.svg.selectAll('circle')
            .data(this.totRank)
            .enter()
            .append('circle')
            .attr('cx', function (d) {return scaler(d[0].ranktot);})
            .attr('cy', bary + 5)
            .attr('r', '11')
            .style('fill', 'white')
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

                if (d3.select(this).attr('r') == 11){
                    d3.select(this).attr('r', 15)
                }
                else {
                    d3.select(this).attr('r', 11)
                }
                if (d3.select(this).style('fill') == 'white'){
                    d3.select(this).style('fill', color)
                }
                else {
                    d3.select(this).style('fill', 'white')
                }
                clickedAttributes.includes(d[0].attrname) ? clickedAttributes.remove(d[0].attrname) : clickedAttributes.push(d[0].attrname)
                thiss.barChart.updateSelectedAttributes(clickedAttributes);
                thiss.barChart.update();

            })
        ;
        // label the attribute circles
        this.svg.selectAll('text')
            .data(this.totRank)
            .enter()
            .append('text')
            .text(function (d) {
                for (let i = 0; i < thiss.attrColor.length; i++){
                    if (d[0].attrname == thiss.attrColor[i].attrname){
                        return thiss.attrColor[i].attrlabel
                    }
                }
            })
            .style('font-size', '13px')
            // .style('font-family', "Bahnschrift")
            .style('font-family', "Lato")
            .attr("text-anchor", "start")
            .attr('transform', (d, i) => {
                return 'translate( ' + (scaler(d[0].ranktot)) + `, ${bary-17}), rotate(-45)`;
            })
        ;
        // label the low attribute bar
        this.svg.append('text')
            .style('font-size', '20px')
            .style('font-family', 'Arvo')
            .attr('x', barx)
            .attr('y', bary + 60)
            .text('Does Not Affect Performance')
            .attr('text-anchor', 'start')
        ;
        this.svg.append('text')
            .style('font-size', '20px')
            .style('font-family', 'Arvo')
            .attr('x', barWidth + barx)
            .attr('y', bary + 60)
            .text('Affects Performance')
            .attr('text-anchor', 'end')
        ;
        let barTitle = this.svg.append('text')
            .text("Attribute")
            .style("font-family", 'Arvo')
            .style('font-size', '40px')
            .style('fill', 'black')
            .attr('text-anchor', 'start')
            .attr('transform', `translate(${barx}, 30), rotate(0)`)
        ;
        let barTitle2 = this.svg.append('text')
            .text("Importance Selector")
            .style("font-family", 'Arvo')
            .style('font-size', '20px')
            .style('fill', 'black')
            .attr('text-anchor', 'start')
            .attr('transform', `translate(${barx}, 60), rotate(0)`)
        ;
    }
}
