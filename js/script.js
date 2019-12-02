// let tooltip = new Tooltip();
//
// let votePercentageChart = new PerformanceMap(tooltip);
//
let featMatrix = new FeatureMatrix();
let rankTable = new RankTable();
let barChart = new BarChart();
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
    barChart.update();
  // let yearChart = new MainMenu(electoralVoteChart, tileChart,
  //     votePercentageChart, electionWinners);
  // yearChart.update();
});

d3.csv("data/masterTable.csv").then(masterTable => {
    for(let i = 0; i < masterTable.length; i++){
        if (masterTable[i].state == ""){
            masterTable.splice(i, 1)
        }
    }
    let mapChart = new MapChart(masterTable);

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
    let rankDataList = [];
    for(let i = 0; i < rawData.length; i++) {
        let retArr = [];
        let keysSorted = Object.keys(rawData[i]).sort(function(a,b){return rawData[i][a]-rawData[i][b]})
        retArr = retArr.concat(keysSorted);
        for(let j = 0; j < keysSorted.length; j++) {
            if (!selectableAttr.includes(keysSorted[j])) {
                let remInd = keysSorted.indexOf(keysSorted[j]);
                retArr.splice(remInd, 1);
            }
        }
        let newStateObj = {name:rawData[i].abbreviation, rank:retArr};
        rankDataList.push(newStateObj);
    }
    return rankDataList;
}