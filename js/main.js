window.onload=function(){
	var width=document.body.clientWidth,height=width/2;
	var scaleFactor = width/(2*Math.PI);
	const map = d3.select("body")
								.append("svg")								
										.attr("width",width)
										.attr("height",height)
										.attr("id","chart")
								.append("g");
								
	var projection = d3.geoEquirectangular()
												 .translate([width/2,height/2])
												 .scale(scaleFactor);
	
	var path = d3.geoPath()
							 .projection(projection);
							 
	var tip = d3.tip()
								.attr("class","tip")
								.direction("s")
								.offset([10,0])
								.html(function(d){return "<strong>Name:</strong>"+d.properties.name+"<br /><strong>Mass:</strong>"+d.properties.mass+"<br /><strong>Recclass:</strong>"+d.properties.recclass+"<br /><strong>Longitude:</strong>"+d.properties.reclong+"<br /><strong>Latitude:</strong>"+d.properties.reclat;});
	
	var zoom = d3.zoom()
							 .scaleExtent([0.5,10])
							 .on("zoom",zoomed);
	function zoomed(){
		let t = d3.event.transform;
		//console.log(t);
		map.attr("transform",t);
	}
							 
	d3.json("https://raw.githubusercontent.com/ginobilee/D3MapTest/master/countries.json",function(error,world){
		if(error) return console.error(error);
		
		map.selectAll(".country")
				  .data(topojson.feature(world,world.objects["ne_110m_admin_0_countries"]).features)
				.enter().append("path")
					.attr("class","country")
				  .attr("d",path);
		
		d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json",function(error,mete){
			if(error) return console.error(error);
						
			var meteFill = d3.scaleThreshold()
													.domain([10000,1000000,10000000,30000000])
													.range(["rgba(0,255,255,0.9)","rgba(0,0,255,0.6)","rgba(0,255,0,0.5)","rgba(255,0,254,0.7)","rgba(255,0,0,0.6)"]);

			var radius = d3.scaleThreshold()											
												.domain([10000,1000000,10000000,30000000])
												.range([2,3,8,15,20]);

			map.selectAll(".mete")
						.data(mete.features)
					.enter().append("path")
						.attr("class","mete")
						.attr("d",path.pointRadius(function(d){return radius(d.properties.mass);}))
						.style("fill",function(d){return meteFill(d.properties.mass+1);})
						.style("stroke","white")
						.call(tip)
						.on("mouseover",tip.show)
						.on("mouseout",tip.hide);
						
			map
				.call(zoom);
		});
	});	
}