let map;
let marker;

// Initialize Google Maps with Satellite View
function initMap() {
    // Default location (center of the map - India)
    const defaultLocation = { lat: 20.5937, lng: 78.9629 };

    // Create the Google Map object with satellite view
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 5,
        mapTypeId: 'satellite', // Enables satellite view
    });

    // Add a click listener to allow users to place a marker
    map.addListener('click', (event) => {
        placeMarker(event.latLng);
    });
}

// Function to place a marker at the clicked location
function placeMarker(location) {
    if (marker) {
        marker.setPosition(location);
    } else {
        marker = new google.maps.Marker({
            position: location,
            map: map,
        });
    }
}

// Handle form submission when the submit button is clicked
document.getElementById('submit').addEventListener('click', async () => {
    if (!marker) {
        alert('Please select a location by clicking on the map.');
        return;
    }

    const selectedCrop = document.getElementById('cropChoice').value;
    const position = marker.getPosition();

    const locationData = {
        latitude: position.lat(),
        longitude: position.lng(),
        cropChoice: selectedCrop,
        userId: auth.currentUser ? auth.currentUser.uid : "guest" // Get current user ID, or store as "guest"
    };

    try {
        // Store the location and crop data in Firestore
        await db.collection('farmerData').add(locationData);
        console.log('Location and Crop Data stored successfully:', locationData);
        alert('Location and Crop Data successfully stored in Firestore!');
    } catch (error) {
        console.error('Error storing data:', error);
        alert('Failed to store data in Firestore.');
    }
});

// Initialize the map when the page loads
window.onload = initMap;
