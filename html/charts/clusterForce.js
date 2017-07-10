(function(){

    var nodes = raw.model();

	var source = nodes.dimension()
		.title("Source")
		.required(1);
		
	var target = nodes.dimension()
		.title("Target")
		.required(1);

    nodes.map(function (data){
    	
    	var sourceNode = data.map(function(d) {
    		return {   
    				sourceNode : source(d),
    				type  : 'sourceNode'
    				} ; 
    		
    	});
    	var targetNode = data.map(function(d) {
    		return {   
    				targetNode : target(d), 
    				type  : 'targetNode'
    				} ; 	
    	});
    		    	
    	var myRelations = data.map(function(d) {
    		return {
    				type : 'link',
    				source : source (d),
    				target : target(d),
			
			}
			
		});	
    		
    	var myNodes = Array.from(new Set(sourceNode.concat(targetNode).map(JSON.stringify))).map(JSON.parse);
    
   	    return myNodes.concat(myRelations);

    
     })

    var chart = raw.chart()
        .title('Test2')
        .description(
            "Nested circles allow to represent hierarchies and compare values. This visualization is particularly effective to show the proportion between elements through their areas and their position inside a hierarchical structure. <br/>Based on <a href='http://bl.ocks.org/mbostock/7882658'>http://bl.ocks.org/mbostock/7882658</a>")
        .thumbnail("imgs/clusterForce.png")
        .category('Hierarchy (weighted)')
        .model(nodes)

    var width = chart.number()
        .title("Width")
        .defaultValue(1000)
        .fitToWidth(true)

    var height = chart.number()
        .title("Height")
        .defaultValue(500)
        
    var radius = chart.number()
        .title("Radius")
        .defaultValue(6)


    chart.draw(function (selection, data){

    d3.layout.pack()
            .sort(null)
            .size([+width(), +height()])
            .padding(d3.max([2,10]))
            .children(function (d) { return d.values; })
            .value(function (d) { return +d.size; })
            .nodes(data);

    var force = d3.layout.force()
        .nodes(data)
        .size([+width(), +height()])
        .gravity(.02)
        .charge(-10)
        .on("tick", tick)
        .on("end", function(){
          chart.dispatchEndDrawing()
        })
        .start();

    var g = selection
        .attr("width", width)
        .attr("height", height);


//     var link = g.selectAll("line")
//         .data(data.filter(function (d){ return d.type == "link"; }))
//         .enter().append("line")
//             .style("stroke-width", "2")
//             .style("stroke", "grey")
//             .call(force.drag); 
    
    var nodeSource = g.selectAll("circle")
        .data(data.filter(function (d){ return d.type == "sourceNode"; }))
        .enter().append("circle")
        .attr("r", 5)
        .style("fill", "blue")
            .call(force.drag);
            
     var nodeTarget = g.selectAll("rect")
        .data(data.filter(function (d){ return d.type == "targetNode"; }))
        .enter().append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", "green")
            .call(force.drag);
            
    function tick(e) {
        nodeSource
          .attr("cx", function(d) { return d.x = Math.max(radius(), Math.min(width() - radius(), d.x)); })
          .attr("cy", function(d) { return d.y = Math.max(radius(), Math.min(height() - radius(), d.y)); });
       
        nodeTarget
          .attr("x", function(d) { return d.x = Math.max(radius(), Math.min(width() - radius(), d.x)); })
          .attr("y", function(d) { return d.y = Math.max(radius(), Math.min(height() - radius(), d.y)); });
          
    //     link
//           .attr("x1", function(d) { return d.sourceNode.x; })
//           .attr("y1", function(d) { return d.sourceNode.y; })	
//           .attr("x2", function(d) { return d.targetNode.x; })
//           .attr("y2", function(d) { return d.targetNode.x; });
		
		     chart.dispatchStartDrawing()

    }
    

  })

})();
