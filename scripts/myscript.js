var margin = {top: 40, right: 30, bottom: 30, left: 50},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


var svg = d3.select("#plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/erinma6/movies/refs/heads/main/avg_rating.csv").then(function(data) {
    console.log(data); 

    
    data.forEach(function(d) {
        d.mean_score = +d.mean_score; 
    });

    
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.mean_score })])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
        
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("x", width / 2) 
      .attr("y", height + margin.bottom - 1)
      .text("Mean Score")
      .style("font-size", "12px"); 
    
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)") 
      .attr("x", -height / 2)
      .attr("y", -margin.left + 10)
      .text("Frequency") 
      .style("font-size", "12px"); 
    
    svg.append("text")
      .attr("x", width / 2) 
      .attr("y", -margin.top / 2) 
      .attr("text-anchor", "middle") 
      .style("font-size", "16px") 
      .style("font-weight", "bold") 
      .text("Distribution of Ratings Across Movies"); 
  
    
    var histogram = d3.histogram()
        .value(function(d) { return d.mean_score; })   
        .domain(x.domain())  
        .thresholds(x.ticks(70)); 
  
    
    var bins = histogram(data);
  
    
    var y = d3.scaleLinear()
        .range([height, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);
    svg.append("g")
        .call(d3.axisLeft(y));
  
   
    var tooltip = d3.select("#plot")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("color", "white")
      .style("border-radius", "5px")
      .style("padding", "10px")
  
    
    var showTooltip = function(event, d) {
      tooltip
          .transition()
          .duration(100)
          .style("opacity", 1);
      tooltip
          .html("Range: " + d.x0 + " - " + d.x1 + "<br>Count: " + d.length)
          .style("left", (d3.pointer(event)[0] + 20) + "px")
          .style("top", (d3.pointer(event)[1]) + "px");
  };
   var moveTooltip = function(event, d) {
      tooltip
          .style("left", (d3.pointer(event)[0] + 20) + "px")
          .style("top", (d3.pointer(event)[1]) + "px");
  };
    
    var hideTooltip = function(d) {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 0)
    }
  
    
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .attr("width", function(d) { return Math.max(0, x(d.x1) - x(d.x0) - 1); })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "#69b3a2")
          .on("mouseover", showTooltip )
          .on("mousemove", moveTooltip )
          .on("mouseleave", hideTooltip )
}).catch(function(error) {
    console.error("Error loading the data:", error);
});