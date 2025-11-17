document.addEventListener('DOMContentLoaded', function() {
    // Hotel carousel functionality
    const slider = document.querySelector('.exclusive-content-show');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    const hotelElements = document.querySelectorAll('.hotel');
    
    if (slider && prevBtn && nextBtn && hotelElements.length > 0) {
        let currentIndex = 0;
        let hotels = Array.from(hotelElements); // Convert NodeList to array for easier manipulation
        
        // Determine how many hotels to show based on screen size
        function getHotelsPerView() {
            if (window.innerWidth <= 768) {
                return 1; // Mobile: show 1
            } else if (window.innerWidth <= 992) {
                return 2; // Tablet: show 2
            } else {
                return 3; // Desktop: show 3
            }
        }
        
        // Initialize
        updateCarousel();
        
        // Navigation click handlers
        prevBtn.addEventListener('click', function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        nextBtn.addEventListener('click', function() {
            const hotelsToShow = getHotelsPerView();
            const maxIndex = Math.max(0, hotels.length - hotelsToShow);
            
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            // Adjust currentIndex if needed when screen size changes
            const hotelsToShow = getHotelsPerView();
            const maxIndex = Math.max(0, hotels.length - hotelsToShow);
            
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            
            updateCarousel();
        });

        // Function to update carousel
        function updateCarousel() {
            // Check if hotels exist
            if (hotels.length === 0) return;
            
            // Get the first hotel's full width including margins
            const hotelElement = hotels[0];
            const hotelStyle = getComputedStyle(hotelElement);
            const marginLeft = parseFloat(hotelStyle.marginLeft);
            const marginRight = parseFloat(hotelStyle.marginRight);
            
            // Total width = element width + left margin + right margin
            const hotelWidth = hotelElement.offsetWidth + marginLeft + marginRight;
            
            // Calculate translation amount
            const translateX = -currentIndex * hotelWidth;
            
            // Apply the transformation
            slider.style.transform = `translateX(${translateX}px)`;
            
            // Update button states
            updateNavigationButtons();
        }
        
        function updateNavigationButtons() {
            const hotelsToShow = getHotelsPerView();
            const maxIndex = Math.max(0, hotels.length - hotelsToShow);
            
            // Disable/enable previous button
            if (currentIndex <= 0) {
                prevBtn.style.opacity = '0.5';
                prevBtn.style.cursor = 'default';
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.cursor = 'pointer';
            }
            
            // Disable/enable next button
            if (currentIndex >= maxIndex) {
                nextBtn.style.opacity = '0.5';
                nextBtn.style.cursor = 'default';
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.cursor = 'pointer';
            }
        }
    }
    
    // Ensure the carousel is initialized even if the CSV loading is delayed
    setTimeout(function() {
        const slider = document.querySelector('.exclusive-content-show');
        if (slider && slider.children.length === 0) {
            // If no hotels were loaded, use placeholder hotels
            usePlaceholderHotels();
        }
    }, 1000);
});

// This function will be used in the search.js file, but we need to define it here as well
// for displaying luxury hotels in the carousel on the main page
function getHotelImage(starRating) {
    if (starRating >= 5) {
        // Ultra luxury hotels (5-star)
        const ultraLuxuryImages = [
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ];
        return ultraLuxuryImages[Math.floor(Math.random() * ultraLuxuryImages.length)];
    } else {
        // Luxury hotels (4.5-star)
        const luxuryImages = [
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        ];
        return luxuryImages[Math.floor(Math.random() * luxuryImages.length)];
    }
}
// Function to load featured luxury hotels for the home page carousel
async function loadFeaturedLuxuryHotels() {
    const featuredContainer = document.querySelector('.exclusive-content-show');
    if (!featuredContainer) return;

    // Show loading state
    showLoadingState(featuredContainer);

    try {
        const response = await fetch(`${API_BASE_URL}/api/hotels/featured`);

        if (!response.ok) {
            throw new Error(`Failed to load featured hotels: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const hotels = data.hotels || [];

        if (hotels.length === 0) {
            throw new Error('No featured hotels available');
        }

        // Display featured hotels in the carousel
        displayFeaturedHotels(hotels, featuredContainer);
    } catch (error) {
        console.error('Error loading featured hotels:', error);
        // Show error state
        showErrorState(featuredContainer, error.message);
    }
}

// Show loading state
function showLoadingState(container) {
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>載入精選酒店中...</p>
        </div>
    `;
}

// Show error state
function showErrorState(container, errorMessage) {
    container.innerHTML = `
        <div class="error-state">
            <p>❌ 載入失敗：${errorMessage}</p>
            <button onclick="loadFeaturedLuxuryHotels()">重試</button>
        </div>
    `;
}

// Display featured hotels in the carousel
function displayFeaturedHotels(hotels, container) {
    // Sort hotels by star rating (highest first) and limit to 6
    const featuredHotels = hotels
        .sort((a, b) => (b.starRating || 0) - (a.starRating || 0))
        .slice(0, 6);

    // Clear current content
    container.innerHTML = '';

    // Add each hotel to carousel
    featuredHotels.forEach(hotel => {
        // Generate star display
        const starRating = hotel.starRating || 0;
        const fullStars = Math.floor(starRating);
        const halfStar = starRating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        const starsHTML = '★'.repeat(fullStars) +
                          (halfStar ? '⯨' : '') +
                          '☆'.repeat(emptyStars);

        // Get hotel image (use default if not available)
        const imageUrl = getHotelImage(starRating);

        // Create hotel element
        const hotelElement = document.createElement('div');
        hotelElement.className = 'hotel';
        hotelElement.innerHTML = `
            <a href="hotel-details.html?id=${hotel.hotelId || ''}">
                <img src="${imageUrl}" alt="${hotel.name}">
                <h3>${hotel.name}</h3>
                <div class="hotel-rating">
                    <span class="stars">${starsHTML}</span>
                    <span class="rating">${hotel.userRating || 'N/A'}</span>
                </div>
                <div class="hotel-price">
                    $${hotel.pricePerNight || 'N/A'} / 晚
                </div>
            </a>
        `;

        container.appendChild(hotelElement);
    });

    // After adding all hotels, reinitialize the carousel
    reinitializeCarousel();
}

// Fallback function to create placeholder hotels if CSV loading fails
function usePlaceholderHotels() {
    const featuredContainer = document.querySelector('.exclusive-content-show');
    if (!featuredContainer) return;
    
    // Create placeholder hotels
    const placeholderHotels = [];
    for (let i = 1; i <= 6; i++) {
        placeholderHotels.push({
            name: `Luxury Hotel ${i}`,
            ean_hotel_id: i,
            star_rating: 5,
            image: getHotelImage(5),
            luxuryBadge: "LUXURY"
        });
    }
    
    displayFeaturedHotels(placeholderHotels, featuredContainer);
}

// Parse CSV data for luxury hotels (star rating >= 4.5)
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => 
        header.replace(/"/g, '').trim()
    );
    
    const hotels = [];
    
    for (let i = 1; i < lines.length; i++) {
        // Skip empty lines
        if (lines[i].trim() === '') continue;
        
        // Handle commas within quoted fields properly
        let line = lines[i];
        const values = [];
        let inQuotes = false;
        let currentValue = '';
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        
        // Add the last value
        values.push(currentValue.trim());
        
        // Create hotel object
        const hotel = {};
        for (let j = 0; j < headers.length && j < values.length; j++) {
            let value = values[j].replace(/"/g, '').trim();
            
            // Convert numeric values
            if (!isNaN(parseFloat(value)) && isFinite(value)) {
                value = parseFloat(value);
            }
            
            hotel[headers[j]] = value;
        }
        
        // Only include hotels with star_rating >= 4.5 (luxury hotels)
        if (hotel.star_rating >= 4.5) {
            // Add an appropriate luxury image based on star rating
            hotel.image = getHotelImage(hotel.star_rating);
            
            // Add a luxury badge type based on rating
            if (hotel.star_rating >= 5) {
                hotel.luxuryBadge = "ULTRA LUXURY";
            } else if (hotel.star_rating >= 4.5) {
                hotel.luxuryBadge = "LUXURY";
            }
            
            hotels.push(hotel);
        }
    }
    
    return hotels;
}

// Function to reinitialize the carousel after dynamically adding hotels
function reinitializeCarousel() {
    const slider = document.querySelector('.exclusive-content-show');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    const newHotels = document.querySelectorAll('.hotel');
    
    if (slider && prevBtn && nextBtn && newHotels.length > 0) {
        // Store the updated hotel elements
        const hotels = Array.from(newHotels);
        let currentIndex = 0;
        
        // Function to update carousel position
        function updateCarousel() {
            // Get the first hotel's full width including margins
            const hotelElement = hotels[0];
            const hotelStyle = getComputedStyle(hotelElement);
            const marginLeft = parseFloat(hotelStyle.marginLeft);
            const marginRight = parseFloat(hotelStyle.marginRight);
            
            // Total width = element width + left margin + right margin
            const hotelWidth = hotelElement.offsetWidth + marginLeft + marginRight;
            
            // Calculate translation amount
            const translateX = -currentIndex * hotelWidth;
            
            // Apply the transformation
            slider.style.transform = `translateX(${translateX}px)`;
            
            // Update button states
            updateNavigationButtons();
        }
        
        function updateNavigationButtons() {
            // Determine how many hotels to show based on screen size
            let hotelsPerView = 3;
            if (window.innerWidth <= 768) {
                hotelsPerView = 1;
            } else if (window.innerWidth <= 992) {
                hotelsPerView = 2;
            }
            
            const maxIndex = Math.max(0, hotels.length - hotelsPerView);
            
            // Disable/enable previous button
            if (currentIndex <= 0) {
                prevBtn.style.opacity = '0.5';
                prevBtn.style.cursor = 'default';
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.cursor = 'pointer';
            }
            
            // Disable/enable next button
            if (currentIndex >= maxIndex) {
                nextBtn.style.opacity = '0.5';
                nextBtn.style.cursor = 'default';
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.cursor = 'pointer';
            }
        }
        
        // Navigation click handlers - need to reattach
        prevBtn.onclick = function() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        };

        nextBtn.onclick = function() {
            let hotelsPerView = 3;
            if (window.innerWidth <= 768) {
                hotelsPerView = 1;
            } else if (window.innerWidth <= 992) {
                hotelsPerView = 2;
            }
            
            const maxIndex = Math.max(0, hotels.length - hotelsPerView);
            
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        };
        
        // Initialize the carousel
        updateCarousel();
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Adjust currentIndex if needed when screen size changes
            let hotelsPerView = 3;
            if (window.innerWidth <= 768) {
                hotelsPerView = 1;
            } else if (window.innerWidth <= 992) {
                hotelsPerView = 2;
            }
            
            const maxIndex = Math.max(0, hotels.length - hotelsPerView);
            
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            
            updateCarousel();
        });
    }
}

// Load featured luxury hotels when the page loads
loadFeaturedLuxuryHotels();