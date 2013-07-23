<<<<<<< HEAD
function drawGraph() {
    var width = $('#node-graph').width(),
        height = $('#node-graph').height();
=======
$(function() {
    var width = 800,
        height = 480;
>>>>>>> tanvitest

    var force = d3.layout.force()
        .gravity(.05)
        .distance(200)
        .charge(-500)
        .size([width, height]);
<<<<<<< HEAD

    var svg = d3.select("#node-graph").append("svg:svg")
=======
        
    var svg = d3.select("#components-graph").append("svg:svg")
        .attr("viewBox", "0 0 " + (width + 20 + 20) + " " + (height + 10 + 10) )
        .attr("preserveAspectRatio", "xMidYMid meet")
>>>>>>> tanvitest
        .attr("width", width)
        .attr("height", height)
        .attr("pointer-events", "all")
        .append('svg:g')
        .call(d3.behavior.zoom().on("zoom", redraw))
        .append('svg:g')
        .attr('cursor', 'move');

    svg.append('svg:rect')
        .attr('width', width * 4)
        .attr('height', height * 5)
        .attr('fill', 'transparent')
        .attr('cursor', 'move');

    function redraw() {
        console.log("here", d3.event.translate, d3.event.scale);
        svg.attr("transform",
            "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
    }
    //.text("a simple tooltip");

    // Per-type markers, as they don't inherit styles.
    svg.append("svg:defs").selectAll("marker")
        .data(["open", "closed"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");


    d3.json("data/applications.json", function (graph, error) {
        force
            .nodes(theData.nodes)
            .links(graph.links)
            .start();

        var path = svg.append("svg:g").selectAll("path")
            .data(force.links())
            .enter().append("svg:path")
            .attr("class", "link")
            .style("stroke", '#008AB8')
            .style("stroke-opacity", .2)
            .style("stroke-width", 1.5)
            .attr("marker-end", "url(#open)");

        var node = svg.append("svg:g").selectAll("node")
            .data(force.nodes())
            .enter().append("circle")
            .attr("class", "node")
            .attr("class", function (d) {
                return ("node health" + d.health)
            })
            .attr("r", 6)
            .attr("id", function (d) {
                return (d.id)
            })
            .style("stroke-width", 20)
            .style("stroke-opacity", 0)
            .on("click", function (d) {
                clicked(d.id)
            })
            //.style("fill", function(d) { return color(d.group); })
<<<<<<< HEAD
            .attr("title", function (d) {
                return (d.name)
            })
            .call(force.drag);
=======
            //.call(force.drag);
>>>>>>> tanvitest

        /*node.append("image")
            .attr("xlink:href", "http://openiconlibrary.sourceforge.net/gallery2/open_icon_library-full/icons/png/32x32/devices/computer-6.png")
            .attr("x", -10)
            .attr("y", -10)
            .attr("width", 20)
            .attr("height", 20);
        */

        var text = svg.append("svg:g").selectAll("g")
            .data(force.nodes())
            .enter().append("svg:g");

        // A copy of the text with a thick white stroke for legibility.
        /*text.append("svg:text")
            .attr("dx", 15)
            .attr("dy", ".35em")
            .attr("class", "shadow")
            .text(function(d) { return d.name; });
*/
        text.append("svg:text")
            .attr("dx", 15)
            .attr("dy", ".35em")
            .attr("fill", "#00000")
            .text(function (d) {
                return d.name.substring(0, 5) + '...';
            })



        svg.style("opacity", 1e-6)
            .transition()
            .duration(1000)
            .style("opacity", 1);
        // Use elliptical arc path segments to doubly-encode directionality.
        force.on("tick", function () {
            //if (force.alpha() > 0) {force.alpha(.02)}
            path.attr("d", function (d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                //console.log("DX = " + dx + "\tDY = " + dy + "\tDR = " + dr);
                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
            });

            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

            text.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });


        });
    });
}
