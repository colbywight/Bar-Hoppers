//Initialize header titles
let header = d3.select('#header-title')
    .style('font-family', 'Arvo')
    .attr('font-size', '50px')
    .attr('x', 750)
    .style('text-anchor', 'middle')
    .attr('y', 75);

let header1 = d3.select('#header-text')
    .style('font-family', 'Arvo')
    .attr('font-size', '20px')
    .attr('x', 750)
    .style('text-anchor', 'middle')
    .attr('y', 110);

let barHeader = d3.select('#barcharttitle')
    .select('text')
    .style('font-family', 'Impact')
    .attr('font-size', '40px')
    .attr('x', 750)
    .style('text-anchor', 'middle')
    .attr('y', 50);

//initialize all selectable attributes
let attributes = ["studentFinancialAssistance","averageHoursInSchoolDay","averageDailyAttendance","diversity","libraryVisitsPerCapita","giftedTalentedProgramsEnrollment","homlesStudentsPerEnrollment","pupilTeacherRatio","percentTeachersPhd","totalExpenditure"]
//initialize color legend for each attribute, try to pick distinguishable colors
let attrColor = [
    {attrname: "studentFinancialAssistance", attrcol: "red", attrlabel: "FINACIAL AID"},
    {attrname: "averageHoursInSchoolDay", attrcol: "orange", attrlabel: "HOURS PER DAY"},
    {attrname: "averageDailyAttendance", attrcol: "yellow", attrlabel: "ATTENDANCE"},
    {attrname: "diversity", attrcol: "lime", attrlabel: "DIVERSITY"},
    {attrname: "libraryVisitsPerCapita", attrcol: "#113b08", attrlabel: "LIBRARY VISITS"},
    {attrname: "giftedTalentedProgramsEnrollment", attrcol: "cyan", attrlabel: "GIFTED PROGRAMS"},
    {attrname: "homlesStudentsPerEnrollment", attrcol: "navy", attrlabel: "HOMELESS"},
    {attrname: "pupilTeacherRatio", attrcol: "purple", attrlabel: "TEACHER-STUDENT"},
    {attrname: "percentTeachersPhd", attrcol: "gray", attrlabel: "PHD TEACHERS"},
    {attrname: "totalExpenditure", attrcol: "magenta", attrlabel: "FUNDING"},
]
//create bar chart and initialize it, so user knows it exists
let barChart = new BarChart(attributes, attrColor);
barChart.create();

//parse attribute csv data
d3.csv("data/masterTable.csv").then(masterTable => {
    for(let i = 0; i < masterTable.length; i++){
        if (masterTable[i].state == ""){
            masterTable.splice(i, 1)
        }
    }
    //find the ranking of each attribute per state and overall raning
    let stateAttrRankList = findRankings(masterTable, attributes);
    let totRankOfAttr = findOverallRankings(stateAttrRankList);
    //create mapchart
    let mapChart = new MapChart(masterTable, stateAttrRankList, barChart);
    //create attribute overall ranking menu selector
    let attributeBar = new AttributeBar(barChart, attrColor, totRankOfAttr);
    //get us state geo map
    d3.json("data/us-states.json")
        .then(function(us) {
            mapChart.drawMap(us);
        });

});

/**
 * find the correlation ranking of each attribute per state
 * @param rawData - csv data parsed
 * @param selectableAttr - list of all selectable attributes
 */
function findRankings(rawData, selectableAttr)
{
    //get max performance to compare to
    let rankDataList = [];
    for(let i = 0; i < rawData.length; i++) {
        //get performance of attribute and normalize with max
        let performanceScore = rawData.map(function(a) {return a['avgTestScore']});
        let maxPerformance = Math.max.apply(Math,performanceScore);
        let compPerformance = rawData[i].avgTestScore/maxPerformance;
        //loop through selectable attr
        let sortAttr = [];
        for(let j = 0; j < selectableAttr.length; j++) {
            //find max val of that attr, normalize, find distance from performance and save that as new value
            let attribute = rawData[i][selectableAttr[j]];
            let attrList = rawData.map(function(a) {return a[selectableAttr[j]]});
            let maxAttr = Math.max.apply(Math,attrList);
            let attrScore = attribute/maxAttr;
            let attrDist = Math.abs(compPerformance - attrScore);
            sortAttr.push([{name: selectableAttr[j]}, attrDist]);
        }
        //order the properties and create an array of the sorted attributes
        sortAttr.sort(function(a, b) {
            return b[1] - a[1];
        });
        //create new object with the abbreviation and the rank array
        let retArr = sortAttr.map(function(a) {return a[0].name});

        let newStateObj = {state: rawData[i].state, name:rawData[i].abbreviation, rank:retArr};
        rankDataList.push(newStateObj);
    }
    return rankDataList;
}

/**
 * Creates the overall ranking of each attribute across all states
 * @param rankData - data calculated by the findRankings method
 */
function findOverallRankings(rankData){
    //create dictionary with each key being an attribute
    var totRank = new Map()
    for(let i = 0; i < rankData.length; i++) {
        //loop through each state then get the rank list of that state
        let rankList = rankData[i].rank;
        //go through each attribute of that state
        for(let j = 0; j < rankList.length; j++){
            let attribute = rankList[j];
            //add to dictionary if doesn't exist or add to it if it does
            if(!(totRank.has(attribute)))
                totRank.set(attribute, j + 1);
            else
                totRank.set(attribute, totRank.get(attribute) + (j + 1))
        }
    }
    //add attrname and rank totals to a list to sort by ranktotals
    let sortAttr = [];
    for (const [key, value] of totRank.entries()) {
        sortAttr.push([{attrname: key, ranktot: value}]);
    }
    sortAttr.sort(function(a, b) {
        return a[0].ranktot - b[0].ranktot;
    });
    return sortAttr;
}