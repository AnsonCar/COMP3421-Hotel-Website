// API Configuration - ensure this is defined before any API calls
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
    // Add search-page class to body for specific styling
    document.body.classList.add('search-page');
    
    // Search functionality setup
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resultsContainer = document.getElementById('search-results');
    
    // Get search query from sessionStorage
    const searchQuery = sessionStorage.getItem('searchQuery') || '';
    
    // Fill the search input with the previous search query
    if(searchInput) {
        searchInput.value = searchQuery;
    }
    
    // Load hotel data and perform search
    loadHotelData()
        .then(apiHotels => {
            const hotelDatabase = processHotelData(apiHotels);
            // Perform the search
            const searchResults = searchHotels(searchQuery, hotelDatabase);
            displaySearchResultsWithPagination(searchResults, searchQuery);

            // Handle new search button click
            if(searchBtn) {
                searchBtn.addEventListener('click', function() {
                    performSearch(hotelDatabase);
                });
            }

            // Handle Enter key in search input
            if(searchInput) {
                searchInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        performSearch(hotelDatabase);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading hotel data:', error);
            displayError();
        });

    function performSearch(hotelDatabase) {
        const query = searchInput.value.trim();
        if (query) {
            // Store search query in sessionStorage
            sessionStorage.setItem('searchQuery', query);
            // Perform the search with the new query
            const results = searchHotels(query, hotelDatabase);
            displaySearchResultsWithPagination(results, query);
        }
    }
});

// Function to load hotel data from API
async function loadHotelData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hotels`);

        if (!response.ok) {
            throw new Error(`Failed to load hotel data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.hotels || [];
    } catch (error) {
        console.error('Error loading hotel data:', error);
        throw error;
    }
}

// Process hotel data from API response
function processHotelData(hotels) {
    return hotels
        .filter(hotel => hotel.starRating >= 4.5) // Only luxury hotels
        .map(hotel => ({
            ...hotel,
            // Add image based on star rating
            image: getHotelImage(hotel.starRating),
            // Map API fields to expected frontend fields
            ean_hotel_id: hotel.hotelId,
            name: hotel.name,
            address1: hotel.address,
            city: 'New York', // Default for now
            state_province: 'NY', // Default for now
            star_rating: hotel.starRating,
            low_rate: hotel.pricePerNight,
            high_rate: hotel.pricePerNight * 1.2, // Add some variation
            user_rating: hotel.userRating
        }));
}

// Function to get a luxury hotel image based on star rating
function getHotelImage(starRating) {
    if (starRating == 5) {
        // Ultra luxury hotels (5-star)
        const ultraLuxuryImages = [
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
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

// Function to search luxury hotels
function searchHotels(query, hotelDatabase) {
    if (!query) return [];
    
    query = query.toLowerCase();
    
    // Search in name, address, and city
    return hotelDatabase.filter(hotel => 
        (hotel.name && hotel.name.toLowerCase().includes(query)) || 
        (hotel.address1 && hotel.address1.toLowerCase().includes(query)) || 
        (hotel.city && hotel.city.toLowerCase().includes(query))
    );
}

// Enhanced function to display search results with pagination
function displaySearchResultsWithPagination(results, query) {
    const resultsContainer = document.getElementById('search-results');
    
    if(!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        // No results found
        const header = document.createElement('div');
        header.className = 'search-results-header';
        header.innerHTML = `
            <div class="no-results">
                <h3>No Luxury Hotels Found</h3>
                <p>We couldn't find any luxury hotels matching "<span class="query">${query}</span>". Please try a different search term or explore our exclusive collection of properties.</p>
                <a href="index.html" class="return-home-btn">View All Luxury Hotels</a>
            </div>
        `;
        resultsContainer.appendChild(header);
        return;
    }
    
    // Set up the search results container structure with pagination elements
    resultsContainer.innerHTML = `
        <div class="search-results-header">
            <h2>Luxury Accommodations</h2>
            <p>Found ${results.length} exclusive hotel${results.length > 1 ? 's' : ''} matching "<span class="query">${query}</span>"</p>
        </div>
        <div class="results-info"></div>
        <div id="hotels-container" class="search-results-grid"></div>
        <div class="loading">
            <div class="loading-spinner"></div>
        </div>
        <div class="pagination"></div>
    `;
    
    // Define pagination variables and containers
    const hotelsContainer = document.getElementById('hotels-container');
    const paginationContainer = resultsContainer.querySelector('.pagination');
    const resultsInfo = resultsContainer.querySelector('.results-info');
    const loading = resultsContainer.querySelector('.loading');
    
    // Configuration
    const hotelsPerPage = 6;
    const totalResults = results.length;
    const totalPages = Math.ceil(totalResults / hotelsPerPage);
    let currentPage = 1;
    
    // Display hotels for the current page
    function displayHotels() {
        const startIndex = (currentPage - 1) * hotelsPerPage;
        const endIndex = startIndex + hotelsPerPage;
        const currentHotels = results.slice(startIndex, endIndex);
        
        hotelsContainer.innerHTML = '';
        currentHotels.forEach(hotel => {
            const hotelCard = createHotelCard(hotel);
            hotelsContainer.appendChild(hotelCard);
        });
        
        // Add event listeners to view details buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const hotelId = this.getAttribute('href').split('=')[1];
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    // Navigate to hotel details page with smooth transition
                    loading.style.display = 'flex';
                    setTimeout(() => {
                        window.location.href = `hotel-details.html?id=${hotelId}`;
                    }, 300);
                }
            });
        });
    }
    
    // Create pagination UI
    function createPagination() {
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        paginationContainer.innerHTML = '';
        
        // Prev button
        const prevBtn = document.createElement('div');
        prevBtn.className = 'pagination-btn';
        prevBtn.innerHTML = '&laquo;';
        if (currentPage === 1) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    goToPage(currentPage - 1);
                }
            });
        }
        paginationContainer.appendChild(prevBtn);
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // First page and ellipsis
        if (startPage > 1) {
            const firstBtn = document.createElement('div');
            firstBtn.className = 'pagination-btn';
            firstBtn.innerText = '1';
            firstBtn.addEventListener('click', () => goToPage(1));
            paginationContainer.appendChild(firstBtn);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('div');
                ellipsis.className = 'pagination-btn ellipsis';
                ellipsis.innerText = '...';
                paginationContainer.appendChild(ellipsis);
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('div');
            pageBtn.className = 'pagination-btn';
            if (i === currentPage) pageBtn.classList.add('active');
            pageBtn.innerText = i;
            pageBtn.addEventListener('click', () => goToPage(i));
            paginationContainer.appendChild(pageBtn);
        }
        
        // Last page and ellipsis
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('div');
                ellipsis.className = 'pagination-btn ellipsis';
                ellipsis.innerText = '...';
                paginationContainer.appendChild(ellipsis);
            }
            
            const lastBtn = document.createElement('div');
            lastBtn.className = 'pagination-btn';
            lastBtn.innerText = totalPages;
            lastBtn.addEventListener('click', () => goToPage(totalPages));
            paginationContainer.appendChild(lastBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('div');
        nextBtn.className = 'pagination-btn';
        nextBtn.innerHTML = '&raquo;';
        if (currentPage === totalPages) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    goToPage(currentPage + 1);
                }
            });
        }
        paginationContainer.appendChild(nextBtn);
        
        // Jump to page input
        if (totalPages > 3) {
            const pageInput = document.createElement('div');
            pageInput.className = 'pagination-input';
            pageInput.innerHTML = `
                <span>Go to:</span>
                <input type="number" min="1" max="${totalPages}" value="${currentPage}">
                <button>Go</button>
            `;
            paginationContainer.appendChild(pageInput);
            
            const inputField = pageInput.querySelector('input');
            const goButton = pageInput.querySelector('button');
            
            inputField.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    goToPageFromInput(inputField);
                }
            });
            
            goButton.addEventListener('click', () => {
                goToPageFromInput(inputField);
            });
        }
    }
    
    function goToPageFromInput(inputField) {
        let pageNum = parseInt(inputField.value);
        if (isNaN(pageNum)) pageNum = 1;
        if (pageNum < 1) pageNum = 1;
        if (pageNum > totalPages) pageNum = totalPages;
        inputField.value = pageNum;
        goToPage(pageNum);
    }
    
    function goToPage(page) {
        if (page === currentPage) return;
        
        // Show loading spinner
        loading.style.display = 'flex';
        hotelsContainer.style.opacity = 0.3;
        
        // Simulate loading for smoother transition
        setTimeout(() => {
            currentPage = page;
            displayHotels();
            createPagination();
            
            // Update results info
            const startIndex = (currentPage - 1) * hotelsPerPage + 1;
            const endIndex = Math.min(startIndex + hotelsPerPage - 1, totalResults);
            resultsInfo.innerHTML = `Showing <strong>${startIndex}-${endIndex}</strong> of <strong>${totalResults}</strong> results`;
            
            // Scroll to top of results
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Hide loading spinner
            loading.style.display = 'none';
            hotelsContainer.style.opacity = 1;
        }, 300);
    }
    
    // Initialize the pagination
    displayHotels();
    createPagination();
    
    // Update results info
    const startIndex = 1;
    const endIndex = Math.min(hotelsPerPage, totalResults);
    resultsInfo.innerHTML = `Showing <strong>${startIndex}-${endIndex}</strong> of <strong>${totalResults}</strong> results`;
}

// Function to create a hotel card
function createHotelCard(hotel) {
    const card = document.createElement('div');
    card.className = 'hotel-card';
    card.setAttribute('data-hotel-id', hotel.ean_hotel_id); // Store the hotel ID for navigation
    
    // Format the location (city, state)
    const location = `${hotel.city}, ${hotel.state_province}`;
    
    // Format the price range
    const lowPrice = parseFloat(hotel.low_rate).toFixed(2);
    const highPrice = parseFloat(hotel.high_rate).toFixed(2);
    const priceDisplay = `$${lowPrice} - $${highPrice}`;
    
    // Make the entire card clickable
    card.addEventListener('click', function() {
        window.location.href = `hotel-details.html?id=${hotel.ean_hotel_id}`;
    });
    
    // Create hotel image URL or use a placeholder
    const imageUrl = hotel.image_url || `https://placehold.co/600x400?text=${encodeURIComponent(hotel.name)}`;
    
    // Create the card content
    card.innerHTML = `
        <div class="hotel-image">
            <img src="${imageUrl}" alt="${hotel.name}">
           
        </div>
        <div class="hotel-info">
            <h3 class="hotel-name">${hotel.name}</h3>
            <div class="hotel-location"><i class="fas fa-map-marker-alt"></i> ${location}</div>
            <div class="hotel-address">${hotel.address1}</div>
            <div class="hotel-price">${priceDisplay} <span>per night</span></div>
            <div class="hotel-amenities">
                ${getDefaultAmenities(hotel.star_rating)}
            </div>
        </div>
        <div class="click-indicator">
            <i class="fas fa-arrow-right"></i>
        </div>
    `;
    
    return card;
}

// Helper function to create amenities HTML
function createAmenitiesHTML(amenities) {
    if (!amenities || !Array.isArray(amenities) || amenities.length === 0) {
        return '';
    }
    
    return amenities
        .slice(0, 4) // Show only first 4 amenities to keep it clean
        .map(amenity => {
            let iconClass = 'fas fa-check'; // Default icon
            
            // Map amenities to appropriate icons
            if (amenity.toLowerCase().includes('wifi')) iconClass = 'fas fa-wifi';
            if (amenity.toLowerCase().includes('pool')) iconClass = 'fas fa-swimming-pool';
            if (amenity.toLowerCase().includes('breakfast')) iconClass = 'fas fa-coffee';
            if (amenity.toLowerCase().includes('spa')) iconClass = 'fas fa-spa';
            if (amenity.toLowerCase().includes('gym') || amenity.toLowerCase().includes('fitness')) iconClass = 'fas fa-dumbbell';
            if (amenity.toLowerCase().includes('parking')) iconClass = 'fas fa-parking';
            if (amenity.toLowerCase().includes('restaurant')) iconClass = 'fas fa-utensils';
            if (amenity.toLowerCase().includes('bar')) iconClass = 'fas fa-glass-martini-alt';
            if (amenity.toLowerCase().includes('air') || amenity.toLowerCase().includes('ac')) iconClass = 'fas fa-wind';
            
            return `<span class="amenity"><i class="${iconClass}"></i> ${amenity}</span>`;
        })
        .join('');
}

function getDefaultAmenities(starRating) {
    const rating = parseFloat(starRating) || 0;
    const amenities = [];
    
    // Base amenities for all hotels
    amenities.push('WiFi');
    
    if (rating >= 3) {
        amenities.push('Breakfast');
        amenities.push('Parking');
    }
    
    if (rating >= 4) {
        amenities.push('Pool');
        amenities.push('Gym');
    }
    
    if (rating >= 4.5) {
        amenities.push('Restaurant');
    }
    
    if (rating >= 5) {
        amenities.push('Spa');
        amenities.push('Concierge');
        amenities.push('Butler Service');
    }
    
    return amenities
        .slice(0, 4) // Show only first 4 amenities to keep it clean
        .map(amenity => {
            let iconClass = 'fas fa-check'; // Default icon
            
            // Map amenities to appropriate icons
            if (amenity.toLowerCase().includes('wifi')) iconClass = 'fas fa-wifi';
            if (amenity.toLowerCase().includes('pool')) iconClass = 'fas fa-swimming-pool';
            if (amenity.toLowerCase().includes('breakfast')) iconClass = 'fas fa-coffee';
            if (amenity.toLowerCase().includes('spa')) iconClass = 'fas fa-spa';
            if (amenity.toLowerCase().includes('gym') || amenity.toLowerCase().includes('fitness')) iconClass = 'fas fa-dumbbell';
            if (amenity.toLowerCase().includes('parking')) iconClass = 'fas fa-parking';
            if (amenity.toLowerCase().includes('restaurant')) iconClass = 'fas fa-utensils';
            if (amenity.toLowerCase().includes('bar')) iconClass = 'fas fa-glass-martini-alt';
            if (amenity.toLowerCase().includes('concierge')) iconClass = 'fas fa-concierge-bell';
            if (amenity.toLowerCase().includes('butler')) iconClass = 'fas fa-user-tie';
            if (amenity.toLowerCase().includes('air') || amenity.toLowerCase().includes('ac')) iconClass = 'fas fa-wind';
            
            return `<span class="amenity"><i class="${iconClass}"></i> ${amenity}</span>`;
        })
        .join('');
}

// Function to display error message
function displayError() {
    const resultsContainer = document.getElementById('search-results');
    
    if(!resultsContainer) return;
    
    resultsContainer.innerHTML = `
        <div class="search-results-header">
            <div class="no-results">
                <h3>Unable to Load Hotel Data</h3>
                <p>We're experiencing technical difficulties loading our luxury hotel collection. Please try again later or contact our concierge service for assistance.</p>
                <a href="index.html" class="return-home-btn">Return to Home</a>
            </div>
        </div>
    `;
}

// Back to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // Show/hide the back to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when button is clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

// Default image function
function getDefaultHotelImage(hotel) {
    // Create a color based on star rating for variety
    const colorHue = ((parseInt(hotel.ean_hotel_id) % 360) + 180) % 360;
    const starRating = parseFloat(hotel.star_rating) || 3;
    const brightness = Math.min(50 + (starRating * 10), 90); // Higher star rating = brighter
    
    return `https://placehold.co/600x400/hsl(${colorHue},70%,${brightness}%)/333333?text=${encodeURIComponent(hotel.name)}`;
}
  // Create and add the filter and sort UI to the search results page
  const resultsContainer = document.getElementById('search-results');
  
  if(resultsContainer) {
    const filterSortContainer = document.createElement('div');
    filterSortContainer.className = 'filter-sort-container';
    filterSortContainer.innerHTML = `
      <div class="filter-section">
        <h3>Filter by</h3>
        <div class="filter-group">
          <label>Star Rating</label>
          <div class="star-filter">
            <label><input type="checkbox" name="star-rating" value="4.5" checked> 4.5+ Stars</label>
            <label><input type="checkbox" name="star-rating" value="5"> 5 Stars Only</label>
          </div>
        </div>
        <div class="filter-group">
          <label>Price Range</label>
          <div class="price-slider-container">
            <input type="range" id="price-min" min="100" max="1000" step="50" value="100">
            <input type="range" id="price-max" min="100" max="1000" step="50" value="1000">
            <div class="price-range-display">
              $<span id="price-min-value">100</span> - $<span id="price-max-value">1000</span>
            </div>
          </div>
        </div>
      </div>
      <div class="sort-section">
        <h3>Sort by</h3>
        <select id="sort-select">
          <option value="recommended">Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating-high">Rating: High to Low</option>
        </select>
      </div>
      <button id="apply-filters" class="apply-filters-btn">Apply Filters</button>
    `;
    
    // Insert filter UI before the search results header
    if(resultsContainer.querySelector('.search-results-header')) {
      resultsContainer.insertBefore(filterSortContainer, resultsContainer.querySelector('.search-results-header'));
    } else {
      resultsContainer.appendChild(filterSortContainer);
    }
    
    // Price slider functionality
    const priceMinSlider = document.getElementById('price-min');
    const priceMaxSlider = document.getElementById('price-max');
    const priceMinValue = document.getElementById('price-min-value');
    const priceMaxValue = document.getElementById('price-max-value');
    
    if(priceMinSlider && priceMaxSlider && priceMinValue && priceMaxValue) {
      // Update displayed values when sliders change
      priceMinSlider.addEventListener('input', function() {
        priceMinValue.textContent = this.value;
        
        // Ensure min doesn't exceed max
        if(parseInt(this.value) > parseInt(priceMaxSlider.value)) {
          priceMaxSlider.value = this.value;
          priceMaxValue.textContent = this.value;
        }
      });
      
      priceMaxSlider.addEventListener('input', function() {
        priceMaxValue.textContent = this.value;
        
        // Ensure max doesn't go below min
        if(parseInt(this.value) < parseInt(priceMinSlider.value)) {
          priceMinSlider.value = this.value;
          priceMinValue.textContent = this.value;
        }
      });
    }
    
    // Hook into the existing search functionality
    const applyFiltersBtn = document.getElementById('apply-filters');
    if(applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', function() {
        // This will trigger filtering of the current search results
        applyFiltersAndSort();
      });
    }
    
    // Function to apply filters and sorting to the search results
    window.applyFiltersAndSort = function() {
      // Get the current search results from the global variable or re-fetch
      const currentResults = window.currentSearchResults || [];
      
      if(currentResults.length === 0) {
        console.warn('No search results to filter');
        return;
      }
      
      // Get filter values
      const starFilters = Array.from(document.querySelectorAll('input[name="star-rating"]:checked'))
                          .map(input => parseFloat(input.value));
      
      const priceMin = parseInt(document.getElementById('price-min').value);
      const priceMax = parseInt(document.getElementById('price-max').value);
      const sortMethod = document.getElementById('sort-select').value;
      
      // Filter by star rating and price
      let filteredResults = currentResults.filter(hotel => {
        // If no star filters are selected, show all
        const passesStarFilter = starFilters.length === 0 || 
                               starFilters.some(rating => {
                                 return rating === 5 ? hotel.star_rating >= 5 : hotel.star_rating >= rating;
                               });
        
        // Filter by price range (using average of low_rate and high_rate)
        const avgPrice = (parseFloat(hotel.low_rate) + parseFloat(hotel.high_rate)) / 2;
        const passesPriceFilter = avgPrice >= priceMin && avgPrice <= priceMax;
        
        return passesStarFilter && passesPriceFilter;
      });
      
      // Sort results
      filteredResults.sort((a, b) => {
        const avgPriceA = (parseFloat(a.low_rate) + parseFloat(a.high_rate)) / 2;
        const avgPriceB = (parseFloat(b.low_rate) + parseFloat(b.high_rate)) / 2;
        
        switch(sortMethod) {
          case 'price-low':
            return avgPriceA - avgPriceB;
          case 'price-high':
            return avgPriceB - avgPriceA;
          case 'rating-high':
            return parseFloat(b.star_rating) - parseFloat(a.star_rating);
          case 'recommended':
          default:
            // Recommended sorting (combine rating and price)
            const ratingDiff = parseFloat(b.star_rating) - parseFloat(a.star_rating);
            // If ratings are similar, sort by price
            return Math.abs(ratingDiff) < 0.5 ? avgPriceA - avgPriceB : ratingDiff;
        }
      });
      
      // Update the UI with the filtered and sorted results
      displaySearchResultsWithPagination(filteredResults, sessionStorage.getItem('searchQuery') || '');
      
      // Show number of results after filtering
      const resultsInfo = document.querySelector('.results-info');
      if(resultsInfo) {
        resultsInfo.innerHTML = `<p>Found <strong>${filteredResults.length}</strong> hotels matching your filters</p>`;
      }
    };
  }
});