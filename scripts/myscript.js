d3.csv("../user_genre_proportions.csv")
    .then(function(data) {
        // Log data to ensure it is loaded correctly
        console.log("Data loaded:", data);

        // Check if data is empty or invalid
        if (!data || data.length === 0) {
            console.error("Error: Data is empty or not loaded properly.");
            return;
        }

        // Parse the CSV data - convert genre columns to numbers (except 'userId')
        data.forEach(function(d) {
            console.log("Processing row:", d); // Log each row to inspect

            Object.keys(d).forEach(function(key) {  // Use Object.keys instead of d3.keys
                if (key !== "userId") {
                    d[key] = +d[key];  // Convert to number
                    if (isNaN(d[key])) {
                        console.error(`Error: Non-numeric value found in column ${key} for userId ${d.userId}`);
                    }
                }
            });
        });

        // Initialize the parallel coordinates plot
        var pc = d3.parcoords()("#plot")
            .data(data)
            .width(800)  // Set explicit width
            .height(500) // Set explicit height
            .color("steelblue")  // Line color
            .alpha(0.5)          // Line transparency
            .render()
            .brushMode("1D-axes")  // Allow brushing on axes
            .interactive();        // Enable axis reordering

        // Log to ensure the parallel coordinates plot is initialized
        console.log("Parallel coordinates plot initialized.");

        // Highlight functionality on click - Highlight a line on the plot by selecting it
        d3.select("#plot").on("click", function(event) {
            console.log("Click event triggered:", event.target);  // Log clicked element

            // Get the clicked line (path)
            var clickedLine = d3.select(event.target);

            // Reset all lines and highlight the clicked one
            d3.selectAll(".line").classed("highlight", false);
            clickedLine.classed("highlight", true);
        });

        // Example of adding CSS to highlight a selected line
        const style = document.createElement('style');
        style.innerHTML = `
            .highlight {
                stroke-width: 4px;
                stroke: orange;
            }
        `;
        document.head.appendChild(style);
    })
    .catch(function(error) {
        console.error("Error loading CSV:", error);  // Log any errors related to CSV loading
    });

