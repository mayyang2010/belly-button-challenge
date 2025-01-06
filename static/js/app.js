// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const resultArray = metadata.filter(sampleObj => sampleObj.id === sample);

    // Get the first object in the filtered array (assuming there's only one match)
    const result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const resultArray = samples.filter(sampleObj => sampleObj.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    const result = resultArray[0];
    const otuIds = result.otu_ids;
    const otuLabels = result.otu_labels;
    const sampleValues = result.sample_values;

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Earth'
      }
    };

    const bubbleData = [bubbleTrace];

    const bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: 'OTU ID' },
      showlegend: false,
    };

    Plotly.newPlot('bubble', bubbleData, bubbleLayout); // Render the Bubble Chart

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`);

    // Build a Bar Chart
    const barTrace = {
      x: sampleValues.slice(0, 10).reverse(), // Slicing and reversing
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: otuLabels.slice(0, 10).reverse()
    };

    const barData = [barTrace];

    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Sample Values' },
      yaxis: { title: 'OTU IDs' }
    };

    Plotly.newPlot('bar', barData, barLayout); // Render the Bar Chart
  });
}
// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    sampleNames.forEach(sample => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();