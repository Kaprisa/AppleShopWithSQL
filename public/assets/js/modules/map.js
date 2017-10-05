import axios from 'axios'

const mapOptions = {
	center: { lat: 54.7, lng: 55.9 },
	zoom: 5
}

function loadPlaces(map, lat = 54.7 , lng = 55.9) {
	axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`).then( res => {
		const places = res.data
		if (!places.length) {
			map.setCenter({lat: lat, lng: lng})
			return
		}
		const bounds = new google.maps.LatLngBounds()
		const infoWindow = new google.maps.InfoWindow()

		const markers = places.map( place => {
			const [ placeLng, placeLat ] = place.location.coordinates
			const position = { lat: placeLat, lng: placeLng }
			bounds.extend(position)
			const marker = new google.maps.Marker({ map, position })
			marker.place = place
			return marker
		})

		markers.forEach( marker => marker.addListener('click', function(){
				const html = `<div class="store-popup">
					<a class="store-popup__link" href="/store/${this.place.ID}">
						<img class="store-popup__img" src="/uploads/${this.place.Photo}" alt=${this.place.Name}>
						<p class="store-popup__text"> ${this.place.Name} - ${this.place.Address}</p>
					</a>
				</div>`

				infoWindow.setContent(html)
				infoWindow.open(map, this)
			}))
			map.setCenter(bounds.getCenter())
			map.fitBounds(bounds)
	})
}

function makeMap(mapDiv) {
	if (!mapDiv) return

	const map = new google.maps.Map(mapDiv, mapOptions)

	const input = mapDiv.previousElementSibling

	const autocomplete = new google.maps.places.Autocomplete(input)

	if (input.value.length) {
		google.maps.event.trigger(autocomplete, 'place_changed')
	} else {
		loadPlaces(map)
	}

	autocomplete.addListener('place_changed', () => {
		const place = autocomplete.getPlace()
		loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng())
	})

}

export default makeMap