// let tooltip = new Tooltip();
//
// let votePercentageChart = new PerformanceMap(tooltip);
//
let attributes = ["studentFinancialAssistance","averageHoursInSchoolDay","averageDailyAttendance","diversity","libraryVisitsPerCapita","giftedTalentedProgramsEnrollment","homlesStudentsPerEnrollment","pupilTeacherRatio","percentTeachersPhd","totalExpenditure"]

let featMatrix = new FeatureMatrix();
let barChart = new BarChart(attributes);
let rankTable = new RankTable(attributes, barChart);

//
// let shiftChart = new SelectionChart();
//
// let electoralVoteChart = new FundingMap(shiftChart);
// let mapChart = new MapChart();


// Load the data corresponding to all the election years.
// Pass this data and instances of all the charts that update on year
// selection to yearChart's constructor.
// d3.csv("data/yearwiseWinner.csv").then(electionWinners => {
//   console.log(electionWinners);
//   let yearChart = new MainMenu(electoralVoteChart, tileChart,
//                                 votePercentageChart, electionWinners);
//   yearChart.update();
// });
// let mapChart = new MapChart();

d3.csv("data/2015StateScoresAndExpenses.csv").then(stateScores => {
  // mapChart.update();
  //   barChart.update();
  // let yearChart = new MainMenu(electoralVoteChart, tileChart,
  //     votePercentageChart, electionWinners);
  // yearChart.update();
});
// create a list of all of the selectable attributes

d3.csv("data/masterTable.csv").then(masterTable => {
    for(let i = 0; i < masterTable.length; i++){
        if (masterTable[i].state == ""){
            masterTable.splice(i, 1)
        }
    }
    let stateAttrRankList = findRankings(masterTable, attributes);
    let totRankOfAttr = findOverallRankings(stateAttrRankList);
    let mapChart = new MapChart(masterTable, stateAttrRankList, barChart);

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