let header = d3.select('#header')
    .select('text')
    .style('font-family', 'Arvo')
    .attr('font-size', '50px')
    .attr('x', 750)
    .style('text-anchor', 'middle')
    .attr('y', 75);

let barHeader = d3.select('#barcharttitle')
    .select('text')
    .style('font-family', 'Impact')
    .attr('font-size', '40px')
    .attr('x', 750)
    .style('text-anchor', 'middle')
    .attr('y', 75);

let attributes = ["studentFinancialAssistance","averageHoursInSchoolDay","averageDailyAttendance","diversity","libraryVisitsPerCapita","giftedTalentedProgramsEnrollment","homlesStudentsPerEnrollment","pupilTeacherRatio","percentTeachersPhd","totalExpenditure"]
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
let featMatrix = new FeatureMatrix();
let barChart = new BarChart(attributes, attrColor);
barChart.create();


d3.csv("data/2015StateScoresAndExpenses.csv").then(stateScores => {

});

d3.csv("data/masterTable.csv").then(masterTable => {
    for(let i = 0; i < masterTable.length; i++){
        if (masterTable[i].state == ""){
            masterTable.splice(i, 1)
        }
    }
    let stateAttrRankList = findRankings(masterTable, attributes);
    let totRankOfAttr = findOverallRankings(stateAttrRankList);
    let mapChart = new MapChart(masterTable, stateAttrRankList, barChart);
    let attributeBar = new AttributeBar(barChart, attrColor, totRankOfAttr);


    // mapChart.update();
    // corrBars.update();
    // spAttr.update();
    d3.json("data/us-states.json")
        .then(function(us) {
            mapChart.drawMap(us);
        });

});

// https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json

// d3.json("https://unpkg.com/us-atlas@1/us/10m.json")
//     .then(function(us) {
//       console.log(us);
//       mapChart.drawMap(us);
//     });


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

function findOverallRankings(rankData){
    var totRank = new Map()
    for(let i = 0; i < rankData.length; i++) {
        let rankList = rankData[i].rank;
        for(let j = 0; j < rankList.length; j++){
            let attribute = rankList[j];
            if(!(totRank.has(attribute)))
                totRank.set(attribute, j + 1);
            else
                totRank.set(attribute, totRank.get(attribute) + (j + 1))
        }
    }
    let sortAttr = [];
    for (const [key, value] of totRank.entries()) {
        sortAttr.push([{attrname: key, ranktot: value}]);
    }
    sortAttr.sort(function(a, b) {
        return a[0].ranktot - b[0].ranktot;
    });
    return sortAttr;
}