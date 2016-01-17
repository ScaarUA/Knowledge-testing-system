function initMap() {
	var myLatLng = {lat: 50.4916468, lng: 30.6002406};
	var map = new google.maps.Map(document.getElementById('map'), {
		center: myLatLng,
		zoom: 15
	});
	var image = new google.maps.MarkerImage('/images/google-marker.png',
		null,
		null,
		null,
		new google.maps.Size(64, 64)
	);
	var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: 'Мы здесь',
		icon: image
	});
}