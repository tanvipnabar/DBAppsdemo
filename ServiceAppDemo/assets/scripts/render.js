$(function() {
    var width = 600,
        height = 600;

    /*var force = d3.layout.force()
        .gravity(.1)
        .distance(100)
        .charge(-1200)
        .size([width, height]);*/

    var svg = d3.select("body").append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    // Per-type markers, as they don't inherit styles.
    svg.append("svg:defs").selectAll("marker")
        .data(["open", "closed"])
      .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
      .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");


      d3.json("data/applications.json", function(graph, error) {
        /*force
            .nodes(graph.nodes)
            .links(graph.links)
            .start();*/




        var path = svg.append("svg:g").selectAll("path")
            .data(graph.links)
          .enter().append("svg:path")
            .attr("class", "link")
            .attr("marker-end","url(#open)");
            

        var node = svg.append("svg:g").selectAll("node")
            .data(graph.nodes)
          .enter().append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .style("fill", function(d) { return d.color; } )
            //.attr("fill", "#FF0000")
            //.call(force.drag);


        var text = svg.append("svg:g").selectAll("g")
          .data(graph.nodes)
        .enter().append("svg:g");

      // A copy of the text with a thick white stroke for legibility.
        text.append("svg:text")
            .attr("dx", 15)
            .attr("dy", ".35em")
            .attr("class", "shadow")
            .text(function(d) { return d.name; });

        text.append("svg:text")
            .attr("dx", 15)
            .attr("dy", ".35em")
            .attr("fill", "#00000")
            .text(function(d) { return d.name; });

      // Use elliptical arc path segments to doubly-encode directionality.
        /*force.on("tick", function() {
          path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
          });*/

        path.attr("d", function(d) {
            var dx = graph.nodes[d.target].x - graph.nodes[d.source].x,
                dy = graph.nodes[d.target].y - graph.nodes[d.source].y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + graph.nodes[d.source].x + "," + graph.nodes[d.source].y + "A" + dr + "," + dr + " 0 0,1 " + graph.nodes[d.target].x + "," + graph.nodes[d.target].y;
        });
        
    //console.log(graph.nodes[0].name);
      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      text.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });
    });
});
    