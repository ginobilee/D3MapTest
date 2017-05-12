window.onload=function(){
	var width=document.body.clientWidth,height=width/2;
	var scaleFactor = width/(2*Math.PI);
	const map = d3.select("body")
								.append("svg")
										.attr("width",width)
										.attr("height",height)
										.attr("id","chart");
	
	d3.json("https://raw.githubusercontent.com/ginobilee/D3MapTest/master/countries.json",function(error,world){
		if(error) return console.error(error);
		let projection = d3.geoEquirectangular()
												 .translate([width/2,height/2])
												 .scale(scaleFactor);
		let path = d3.geoPath()
								 .projection(projection);
		map.selectAll(".country")
				  .data(topojson.feature(world,world.objects["ne_110m_admin_0_countries"]).features)
				.enter().append("path")
					.attr("class","country")
				  .attr("d",path);
	});
}