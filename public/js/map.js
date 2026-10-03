
        // let mapToken = "<%= process.env.MAP_TOKEN %>";
        mapboxgl.accessToken = mapToken; 
        const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
 
const houseMarker = document.createElement("div");
houseMarker.className = "house-marker";
houseMarker.innerHTML = '<i class="fa-solid fa-house"></i>';

const popup = new mapboxgl.Popup({
    offset: 25,
    closeButton: false,
    closeOnClick: false
}).setHTML(`
    <div class="location-popup">
        <div class="popup-title">
            <i class="fa-solid fa-location-dot"></i>
            <span>${listingLocation}</span>
        </div>

        <p>
            Exact location will be provided after booking.
        </p>
    </div>
`);

const marker = new mapboxgl.Marker({
    element: houseMarker,
    anchor: "bottom"
})
.setLngLat(coordinates)
.setPopup(popup)
.addTo(map);


// Show popup when hovering over house
houseMarker.addEventListener("mouseenter", () => {
    marker.togglePopup();
});

// Hide popup when mouse leaves
houseMarker.addEventListener("mouseleave", () => {
    setTimeout(() => {
        if (!document.querySelector(".mapboxgl-popup:hover")) {
            popup.remove();
        }
    }, 150);
});
