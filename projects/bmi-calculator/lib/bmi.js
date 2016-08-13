$(function(){
	$("input").keyup(function(){
		var ht = getHeight(), wt = getWeight();

		if(ht>0 && wt>0){
			var bmi = wt/(Math.pow(ht,2));
		 	$("#bmi-index").text((bmi).toFixed(2));
		}

		function getHeight() {
		/* return height in meters
			return 0 if height is not available */

			var ht = $("#ht-cm").val();



			ht = parseFloat(ht)/100;





			return ht;

		}

		function getWeight() {
		/* return weight in kilograms,
			return 0 if weight is not available */

			var wt = $("#wt-kg").val();


			wt = parseFloat(wt);

			return wt;

		}


	});
});