// add your JavaScript/D3 to this file
d3.csv("../result.csv")
    .then(function(data) {
        console.log('data loaded');
    })
    .catch(function(error) {
        console.error("Error loading CSV:", error);  // Log any errors related to CSV loading
    });