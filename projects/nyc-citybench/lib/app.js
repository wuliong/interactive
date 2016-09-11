function initGmap() {

var stylesArray = [
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "transit.station",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "water",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "administrative.neighborhood",
    "elementType": "labels",
    "stylers": [
      { "visibility": "simplified" }
    ]
  },{
  }
];

var map = new google.maps.Map(d3.select("#map").node(), {
	center: {lat: 40.73372586752454, lng: -73.93268304443359},
	zoom: 13,
	styles: stylesArray,
	mapTypeId: 'roadmap',
	clickableIcons: false,
	mapTypeControl: false,
	streetViewControl: false,
	rotateControl: false,
	zoomControlOptions: {
		position: google.maps.ControlPosition.RIGHT_TOP,
		style: google.maps.ZoomControlStyle.LARGE
	}
});

map.addListener('zoom_changed', function(){
		console.log(this.getZoom());
	if(this.getZoom()<11) {this.setZoom(11);}

});



var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

map.addListener('bounds_changed', function(){
	searchBox.setBounds(map.getBounds());
});

d3.json("lib/2015_citybench/CityBench_WGS84.json", function(error,data){
	if(error) throw error;
	data = topojson.feature(data, data.objects.CityBench_WGS84);
	var overlay = new google.maps.OverlayView();

	overlay.onAdd = function() {
		var layer = d3.select(this.getPanes().overlayMouseTarget)
			.append("div").attr("class","benches");
		overlay.draw = function() {
			var projection = this.getProjection(), padding = 10;
			var marker = layer.selectAll("svg").data(data.features).each(transform)
				.enter().append("svg").attr("class","marker").each(transform);
			marker.append("circle")
				.attr("r",3).attr("cx",padding).attr("cy",padding)
				//.on("click",showBenchInfo)
				;


			function transform(d,i) {
				var c = d.geometry.coordinates;
				c = new google.maps.LatLng(c[1],c[0]);
				c = projection.fromLatLngToDivPixel(c);
				return d3.select(this).style("left",Math.round(10*(c.x-padding))/10+"px")
					.style("top",Math.round(10*(c.y-padding))/10+"px");
			} // end transform
		} // end overlay.draw
	} // end overlay.onAdd

	overlay.setMap(map);




	var markers = [];
	var searchResults = d3.select("#search-results");
	searchBox.addListener('places_changed', function(){
		var places = searchBox.getPlaces();
		if(places.length==0) {
			d3.select(searchResults.node().parentNode).classed("show",false);
			return;
		}

		searchResults.selectAll("li").remove();
		markers.forEach(function(marker){
			marker.setMap(null);
		});
		markers = [];

		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place){
			if(!place.geometry) {
				console.log('Returned place contains no geometry');
				return;
			}
			var icon = {
				url: place.icon,
				size: new google.maps.Size(71,71),
				origin: new google.maps.Point(0,0),
				anchor: new google.maps.Point(17,34),
				scaledSize: new google.maps.Size(25,25)
			};

			console.log(place.geometry);

			markers.push(new google.maps.Marker({
				map: map,
				icon: icon,
				title: place.name,
				position: place.geometry.location
			}));

			if(place.geometry.viewport) {
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geomtry.location);
			}

		}); // end places.forEach

		map.fitBounds(bounds);
		if(map.getZoom()>15) {map.setZoom(15);}


		searchResults.selectAll("li").remove();
		d3.select(searchResults.node().parentNode).classed("show",true);

		searchResults.selectAll("li").data(places).enter().append("li")
		.attr("class","place").html(function(d){
			var x = d.formatted_address;
			var re=/^(.+)\s\d{5},\sUSA$/
			var found = x.match(re);
			return found[1]+"<button class='clear-result'>clear</button>";
		}).select(".clear-result").on("click",function(d,i){
			markers[i].setMap(null);
			d3.select(this.parentNode).remove();
			if(searchResults.selectAll("li.place").empty()) {
				d3.select(searchResults.node().parentNode).classed("show",false);
			}
		});









	}); // end searchBox.addListener
}); // end: d3.json



} // end: initGmap