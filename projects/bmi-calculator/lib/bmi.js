$(function(){
	$("input").change(function(){

		var ht = getHeight(), wt = getWeight();

		if(ht>0 && wt>0){
			var bmi = wt/(Math.pow(ht,2));
		 	$("#bmi-index").text((bmi).toFixed(2));
		 	$("#bmi-index").removeClass("empty");
		} else {
			$("#bmi-index").text("__.__");
			$("#bmi-index").addClass("empty");
		}


		function getHeight() {
		/* return height in meters. return 0 if height is not available */
			var ht;

			if ($("#ht-cm").val()) {
				ht = parseFloat($("#ht-cm").val());
				ht /= 100; /* convert to meters */
			} else if ($("#ht-ft").val()||$("#ht-in").val()) {
				ht = parseFloat($("#ht-ft").val())*12+parseFloat($("#ht-in").val());
				ht *= 2.54; /* convert to centimeters */
				ht /= 100;
			} else {
				ht = 0;
			}

 			return ht;
		}

		function getWeight() {
		/* return weight in kilograms. return 0 if weight is not available */
			if($("#wt-kg").val()) {
				wt = parseFloat($("#wt-kg").val());
			} else if ($("#wt-lb").val()) {
				wt = parseFloat($("#wt-lb").val());
				wt *= 0.45359237; /* convert from lb to kg */
			} else {
				wt = 0;
			}

			return wt;
		}


	});
});