// getting the url
const URL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// call the d3 library to fetch the data
function buildCharts(sampleId, data){
    let samples = data.samples;
    let resultArray = samples.filter(d => d.id == sampleId);    
    console.log(resultArray[0]);
    let result = resultArray[0];
    
    let otuIds = result.otu_ids.slice(0,10);
    console.log(otuIds);
    //console.log(otuIds);
    let sampleLabels =result.otu_labels.slice(0,10);
    console.log(sampleLabels);
    let sampleValues = result.sample_values.slice(0,10);
    let barTrace = {
        x: sampleValues.reverse(),
        y:otuIds.map(otuId => `OTU ${otuId}`).reverse(),
        type: "bar", 
        text: sampleLabels.reverse(),
        orientation: "h"
    };

    let layout = {
        title: "Top ten OTUs in Individual",
        margin: {
            t: 30,
            l:150
        }
} 
    Plotly.newPlot("bar", [barTrace],layout);

// making the trace for bubble chart
    let bubbleTrace = { 
        x: otuIds,
        y: sampleValues,
        text: sampleLabels,
        mode: "markers",
        marker:{
            size: sampleValues,
            color: otuIds
        }
    };
    // Create a layout object
    let bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        margin: {t: 30},
        hovermode: 'closest',
        xaxis: {title: "OTU ID"},
    };

    // Make the bubblechart
    Plotly.newPlot("bubble",[bubbleTrace], bubbleLayout);
}


function buildMetadata(sampleId, data){
   // console.log(data);
    //let sampleId = 943;
    let cleanData = data.metadata;
    console.log(cleanData);
    let sample = cleanData.filter(item => item.id == sampleId);
    console.log(sample);
    console.log(sample[0]);
    let metaData = d3.select("#sample-metadata").html("");
    console.log(metaData);
    Object.entries(sample[0]).forEach(([key, value]) => {
        metaData.append("p").text(`${key}: ${value}`);
    });
    console.log(metaData);
}

// Function that updates dashboard when sample is changed
function optionChanged(sampleId){
    d3.json(URL).then(    
       function(data){
        console.log(data);
        buildCharts(sampleId, data);
        buildMetadata(sampleId, data);
       }
    )
}

// having the function to change the drop down list

function init(){d3.json(URL).then(
    function(data){
        console.log(data);
        // populate dropdown
        let dropDown = d3.select("#selDataset")
        data.names.forEach(
            function(val){
               dropDown.append("option").attr("value",val).text(val)
            }
        );

    let initialId = dropDown.property('value');
    optionChanged(initialId);
    }
)}


init();