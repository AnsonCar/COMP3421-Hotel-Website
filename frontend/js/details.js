document.addEventListener('DOMContentLoaded', function() {
    // Get hotel ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('id');
    
    if (!hotelId) {
        // No hotel ID specified, redirect to search page
        window.location.href = 'search.html';
        return;
    }
    
    // Load hotel data
    loadHotelDetails(hotelId);
    
    // Initialize event listeners
    initEventListeners();
    
    window.onscroll = function() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    };
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});


const galleryImagePool = [
  "https://images.unsplash.com/photo-1758448755969-8791367cf5c5?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1742844552264-71e01c8dd7c0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1686090589687-70433606e732?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1529290130-4ca3753253ae?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1677129667171-92abd8740fa3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1759038086832-795644825e3a?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1719941080090-b3d1ba7cb6a1?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1685675073019-9b37843de6c1?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1570560258879-af7f8e1447ac?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1631049035257-02039c597992?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1611596188649-7c8e9507bdb4?q=80&w=1124&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1669552550701-e8bdcefbbd71?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1712063680618-c1883afb1a5a?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1585418694458-dc80a5c20294?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1606917454663-343e58811bb1?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1598605272254-16f0c0ecdfa5?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1600435335786-d74d2bb6de37?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1613553474179-e1eda3ea5734?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1702814160779-4a88cfb330c7?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1693585576677-3635adad699d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  "https://images.unsplash.com/photo-1664189767954-e4e605ae46da?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 

];

const avatarImagePool = [
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/19.jpg",
  "https://randomuser.me/api/portraits/women/12.jpg",
  "https://randomuser.me/api/portraits/men/4.jpg",
  "https://randomuser.me/api/portraits/women/36.jpg",
  "https://randomuser.me/api/portraits/men/81.jpg",
  "https://randomuser.me/api/portraits/women/29.jpg",
  "https://randomuser.me/api/portraits/men/55.jpg",
  "https://randomuser.me/api/portraits/women/5.jpg",
  "https://randomuser.me/api/portraits/men/73.jpg"
];

const reviewPhotoPool = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1496412705862-e0088f16f791?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470163395405-d2b80e7450ed?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=80"
];

function buildGalleryImageSet() {
    if (!galleryImagePool.length) {
        throw new Error('galleryImagePool is empty. Populate it before rendering the gallery.');
    }

    const uniquePool = [...new Set(galleryImagePool)];
    const sliderImages = uniquePool.slice(0, 10);
    return {
        featuredImage: sliderImages[0],
        sliderImages
    };
}

// Load hotel details
async function loadHotelDetails(hotelId) {
    try {
        // Show loading spinner
        const loadingOverlay = document.getElementById('detail-loading');
        loadingOverlay.style.display = 'flex';
        
        // Get the hotel data from CSV
        const hotelData = await getHotelById(hotelId);
        
        if (!hotelData) {
            // Hotel not found
            window.location.href = 'search.html';
            return;
        }
        
        // Update page title
        document.title = `${hotelData.name}`;
        
        // Render hotel details
        renderHotelDetails(hotelData);
        
        // Hide loading spinner with a slight delay for smooth transition
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
        
    } catch (error) {
        console.error('Error loading hotel details:', error);
        alert('Failed to load hotel details. Please try again later.');
        window.location.href = 'search.html';
    }
}

// Get hotel by ID from API
async function getHotelById(hotelId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);

        if (!response.ok) {
            if (response.status === 404) {
                return null; // Hotel not found
            }
            throw new Error(`Failed to fetch hotel: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const hotel = data.hotel;
        const reviews = data.reviews || [];

        if (!hotel) {
            return null;
        }

        // Process hotel data to match frontend expectations
        const processedHotel = {
            ...hotel,
            // Map API fields to expected frontend fields
            ean_hotel_id: hotel.hotelId,
            name: hotel.name,
            address1: hotel.address,
            city: 'New York', // Default for now
            state_province: 'NY', // Default for now
            star_rating: hotel.starRating,
            low_rate: hotel.pricePerNight,
            high_rate: hotel.pricePerNight * 1.2, // Add some variation
            user_rating: hotel.userRating,
            reviews: reviews.map(review => ({
                ...review,
                rating: review.userRating,
                date: new Date(review.time).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            })),
            // Add room options based on hotel data
            rooms: generateRoomOptions(hotel),
            // Add location data
            location: {
                latitude: 40.7128, // Default NYC coordinates
                longitude: -74.0060,
                landmarks: generateNearbyLandmarks(hotel)
            }
        };

        return processedHotel;
    } catch (error) {
        console.error("Error fetching hotel data:", error);
        return null;
    }
}

// Parse CSV data
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    const hotels = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines
        
        const values = lines[i].split(',');
        const hotel = {};
        
        for (let j = 0; j < headers.length; j++) {
            // Clean up header names by trimming and replacing spaces with underscores
            const header = headers[j].trim().toLowerCase().replace(/\s+/g, '_');
            hotel[header] = values[j] ? values[j].trim() : '';
        }
        
        // Use ean_hotel_id for id field if not present
        if (!hotel.id && hotel.ean_hotel_id) {
            hotel.id = hotel.ean_hotel_id;
        }
        
        // Add a name field if not present but hotel_name is
        if (!hotel.name && hotel.hotel_name) {
            hotel.name = hotel.hotel_name;
        }
        
        // Calculate price range
        const basePrice = (parseFloat(hotel.star_rating) * 100) + Math.random() * 200;
        hotel.low_rate = Math.floor(basePrice);
        hotel.high_rate = Math.floor(basePrice * 1.5);
        
        // Add amenities based on star rating
        hotel.amenities = generateAmenities(parseFloat(hotel.star_rating));
        
        // Add description
        hotel.description = generateDescription(hotel);
        
        hotels.push(hotel);
    }
    
    return hotels;
}

// Generate amenities based on star rating
function generateAmenities(starRating) {
    const rating = typeof starRating === 'object' ? starRating.starRating || parseFloat(starRating.star_rating) : starRating;

    const basicAmenities = ["WiFi", "Air Conditioning", "Room Service"];
    const midTierAmenities = ["Fitness Center", "Restaurant", "Business Center", "Laundry Service"];
    const highTierAmenities = ["Spa", "Swimming Pool", "Concierge Service", "Valet Parking"];
    const luxuryAmenities = ["Fine Dining Restaurant", "Rooftop Bar", "Luxury Car Service", "Butler Service", "Private Beach Access"];

    let amenities = [...basicAmenities];


    if (rating < 5) {
        amenities = [...amenities, ...highTierAmenities];
    }

    if (rating == 5) {
        amenities = [...amenities, ...luxuryAmenities.slice(0, Math.floor((rating - 4) * 4))];
    }

    return amenities;
}

// Generate room options based on hotel information
function generateRoomOptions(hotel) {
    const starRating = hotel.starRating || parseFloat(hotel.star_rating);
    const basePrice = hotel.pricePerNight || hotel.low_rate;
    
    const rooms = [
        {
            name: "Standard Room",
            price: basePrice,
            features: ["Queen Bed", "City View", `350 sq ft`],
            image: "/images/room-1.jpg"
        }
    ];
    
    rooms.push({
            name: "Deluxe Room",
            price: Math.floor(basePrice * 1.2),
            features: ["King Bed", "City View", "Work Desk", `450 sq ft`],
            image: "/images/room-2.jpg"
        });
    
    rooms.push({
        name: "Executive Suite",
        price: Math.floor(basePrice * 1.6),
        features: ["King Bed", "Separate Living Area", "Premium View", `650 sq ft`],
        image: "/images/room-3.jpg"
    });
    


    rooms.push({
        name: "Luxury Suite",
        price: Math.floor(basePrice * 2),
        features: ["King Bed", "Panoramic Views", "Kitchenette", "Jacuzzi", `900 sq ft`],
        image: "/images/room-4.jpg"
    });
    
    
    return rooms;
}

// Generate hotel description
function generateDescription(hotel) {
    const starRating = hotel.starRating || parseFloat(hotel.star_rating);
    const neighborhoodText = hotel.neighborhood ? `in the heart of ${hotel.neighborhood}` : "in a prime location";
    
    let description;
    
    if (starRating == 5) {
        description = `Experience unparalleled luxury ${neighborhoodText}. This prestigious ${starRating}-star hotel offers exceptional accommodations designed for the most discerning travelers. Each elegantly appointed room and suite features premium amenities and tasteful décor, creating a sophisticated retreat after a day exploring New York City. Guests can indulge in world-class dining at our award-winning restaurant, rejuvenate at our full-service spa, or enjoy personalized service from our attentive concierge team. With meticulous attention to detail and impeccable service standards, we ensure an unforgettable stay that exceeds expectations.`;
    } else if (starRating < 5) {
        description = `Discover elegant comfort ${neighborhoodText}. This upscale ${starRating}-star hotel combines modern luxury with classic New York charm. The thoughtfully designed rooms offer premium bedding, upscale bath products, and all the amenities needed for a relaxing stay. Guests can enjoy diverse dining options, a well-equipped fitness center, and flexible meeting spaces. The attentive staff provides professional service to ensure each guest's needs are met promptly and courteously. Whether visiting for business or pleasure, this hotel offers the perfect blend of convenience and sophistication.`;
    } else {
        description = `Welcome to this comfortable and convenient ${starRating}-star hotel ${neighborhoodText}. Offering clean, well-appointed rooms with essential amenities, this property provides excellent value for travelers exploring New York City. Guests appreciate the helpful staff, convenient location, and reliable services that make for a pleasant stay. The hotel features comfortable bedding, private bathrooms, and basic amenities to ensure a restful experience. With easy access to public transportation and nearby attractions, this hotel serves as an ideal base for exploring all that New York has to offer.`;
    }
    
    return description;
}

// Generate nearby landmarks
function generateNearbyLandmarks(hotel) {
    // List of potential New York landmarks
    const nyLandmarks = [
        { name: "Times Square", distance: "0.8 miles" },
        { name: "Central Park", distance: "1.2 miles" },
        { name: "Empire State Building", distance: "0.7 miles" },
        { name: "Rockefeller Center", distance: "0.5 miles" },
        { name: "Broadway Theatre District", distance: "0.3 miles" },
        { name: "Museum of Modern Art", distance: "1.1 miles" },
        { name: "Grand Central Terminal", distance: "0.6 miles" },
        { name: "Brooklyn Bridge", distance: "2.3 miles" },
        { name: "Fifth Avenue Shopping", distance: "0.4 miles" },
        { name: "High Line", distance: "1.5 miles" },
        { name: "One World Trade Center", distance: "3.2 miles" },
        { name: "Metropolitan Museum of Art", distance: "2.7 miles" }
    ];
    
    // Randomize distances slightly
    const adjustedLandmarks = nyLandmarks.map(landmark => {
        const originalDistance = parseFloat(landmark.distance);
        const adjustedDistance = (originalDistance * (0.8 + Math.random() * 0.4)).toFixed(1);
        return {
            name: landmark.name,
            distance: `${adjustedDistance} miles`
        };
    });
    
    // Return 4 random landmarks
    return shuffleArray(adjustedLandmarks).slice(0, 4);
}

// Shuffle array helper function
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Generate random reviews for hotels
function getRandomReviews(baseRating) {
    // Random reviewer names
    const names = [
        'Emma Thompson', 'Michael Chen', 'Sophia Rodriguez', 'David Kim',
        'Olivia Johnson', 'James Wilson', 'Ava Martinez', 'Liam Patel',
        'Isabella Clark', 'Noah Williams', 'Charlotte Brown', 'Benjamin Davis'
    ];
    
    // Random review titles based on rating range
    const highReviewTitles = [
        'Exceptional Experience', 'Pure Luxury', 'Worth Every Penny',
        'Unforgettable Stay', 'Absolute Paradise', 'Exceeded All Expectations',
        'A Dream Come True', 'The Perfect Getaway', 'Spectacular in Every Way'
    ];
    
    const midReviewTitles = [
        'Very Good Overall', 'Lovely Experience', 'Great Value',
        'Beautiful Property', 'Enjoyable Stay', 'Would Recommend',
        'Impressive Service', 'Relaxing Retreat', 'Nice Luxury Option'
    ];
    
    const lowReviewTitles = [
        'Decent but Overpriced', 'Mixed Experience', 'Some Room for Improvement',
        'Not Quite 5-Star', 'Good but Not Great', 'Expected More',
        'Nice Property, Service Issues', 'Beautiful Views but...'
    ];
    
    // Random review content
    const positiveContent = [
        'The service was impeccable from the moment we arrived. Staff anticipated our every need without being intrusive.',
        'The attention to detail throughout the property was remarkable. Every corner revealed thoughtful design elements.',
        'We were treated like royalty throughout our entire stay. The staff remembered our preferences from day one.',
        'The room was spacious, immaculately clean, and featured stunning views that took our breath away.',
        'The dining experience was exceptional. Each restaurant offered unique flavors and presentation was artwork.',
        'The spa treatments were among the best I\'ve ever experienced. I left feeling completely rejuvenated.',
        'The location was perfect - we could easily walk to all the major attractions while still enjoying peaceful quiet at the hotel.'
    ];
    
    const mixedContent = [
        'Overall we had a wonderful stay, though there were some minor service inconsistencies.',
        'The property and location were stunning, but the restaurant prices seemed excessive even for luxury standards.',
        'Our room was beautiful and comfortable, though we did experience some noise from adjacent rooms.',
        'Service was generally very good, though sometimes staff seemed overwhelmed during peak hours.',
        'The facilities were impressive, but some areas could use refreshing to maintain the luxury standard.'
    ];
    
    const criticalContent = [
        'While the property itself is beautiful, the service fell short of what we expected at this price point.',
        'Our room had some maintenance issues that should have been addressed before our arrival.',
        'The food quality varied significantly between restaurants, with some options disappointing for a luxury property.',
        'Check-in was chaotic and our room wasn\'t ready despite arriving at the standard check-in time.',
        'The spa facilities were nice but treatments were overpriced compared to similar luxury resorts.'
    ];
    
    // Generate 8-12 reviews
    const reviewCount = Math.floor(Math.random() * 5) + 8;
    const reviews = [];
    
    for (let i = 0; i < reviewCount; i++) {
        // Generate a rating that clusters around the baseRating
        let rating;
        const distribution = Math.random();
        if (distribution < 0.7) {
            // 70% chance of rating close to baseRating
            rating = baseRating + (Math.random() * 0.4 - 0.2);
        } else if (distribution < 0.9) {
            // 20% chance of slightly lower rating
            rating = baseRating - (Math.random() * 0.7 + 0.3);
        } else {
            // 10% chance of much lower rating
            rating = baseRating - (Math.random() * 1.5 + 0.5);
        }
        
        // Ensure rating is between 1 and 5
        rating = Math.max(1, Math.min(5, rating));
        // Round to one decimal place
        rating = Math.round(rating * 10) / 10;
        
        // Select appropriate title and content based on rating
        let title, content;
        if (rating >= 4.5) {
            title = highReviewTitles[Math.floor(Math.random() * highReviewTitles.length)];
            content = positiveContent[Math.floor(Math.random() * positiveContent.length)];
        } else if (rating >= 3.5) {
            title = midReviewTitles[Math.floor(Math.random() * midReviewTitles.length)];
            content = mixedContent[Math.floor(Math.random() * mixedContent.length)];
        } else {
            title = lowReviewTitles[Math.floor(Math.random() * lowReviewTitles.length)];
            content = criticalContent[Math.floor(Math.random() * criticalContent.length)];
        }
        
        // Randomize date within the last 6 months
        const today = new Date();
        const randomDaysAgo = Math.floor(Math.random() * 180);
        const reviewDate = new Date(today);
        reviewDate.setDate(today.getDate() - randomDaysAgo);
        
        // Format date as Month Day, Year
        const formattedDate = reviewDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Random avatar image
        const avatarNumber = Math.floor(Math.random() * 15) + 1;
        const avatarUrl = avatarImagePool.length
            ? avatarImagePool[Math.floor(Math.random() * avatarImagePool.length)]
            : '/images/default-avatar.jpg';
        
        // Add review to array
        reviews.push({
            name: names[Math.floor(Math.random() * names.length)],
            avatar: avatarUrl,
            rating: rating,
            date: formattedDate,
            title: title,
            content: content,
            helpful: Math.floor(Math.random() * 15),
            photos: Math.random() > 0.7 ? generateRandomReviewPhotos() : []
        });
    }
    
    // Sort reviews by date (newest first)
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return reviews;
}

// Generate random review photos
function generateRandomReviewPhotos() {
    if (!reviewPhotoPool.length) return [];

    const shuffled = shuffleArray(reviewPhotoPool);
    const photoCount = Math.min(shuffled.length, Math.floor(Math.random() * 3) + 1);
    return shuffled.slice(0, photoCount);
}
function initializeGallerySlider() {
    const mainSliderEl = document.querySelector('.hotel-gallery-main');
    const thumbSliderEl = document.querySelector('.hotel-gallery-thumbs');
    if (!mainSliderEl || !thumbSliderEl) return;

    const thumbSwiper = new Swiper(thumbSliderEl, {
        slidesPerView: 5,
        spaceBetween: 8,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
            0: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 5 }
        }
    });

    const mainSwiper = new Swiper(mainSliderEl, {
        loop: true,
        spaceBetween: 10,
        navigation: {
            nextEl: '.gallery-nav-next',
            prevEl: '.gallery-nav-prev'
        },
        pagination: {
            el: '.hotel-gallery-main .swiper-pagination',
            clickable: true
        },
        thumbs: {
            swiper: thumbSwiper
        }
    });

    const syncActiveThumb = () => {
        const realIndex = mainSwiper.realIndex % thumbSwiper.slides.length;
        document.querySelectorAll('.gallery-thumbnail').forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === realIndex);
        });

        document.querySelectorAll('#gallery-featured').forEach(img => img.removeAttribute('id'));
        const activeImg = mainSwiper.slides[mainSwiper.activeIndex].querySelector('img');
        if (activeImg) activeImg.id = 'gallery-featured';
    };

    mainSwiper.on('slideChange', syncActiveThumb);
    thumbSwiper.on('slideChange', syncActiveThumb);
}


// Render hotel details to the page
function renderHotelDetails(hotel) {
    const detailContainer = document.getElementById('hotel-detail-container');
    const { sliderImages } = buildGalleryImageSet();

    const avgRating = calculateAverageRating(hotel.reviews);
    const lowPrice = (hotel.pricePerNight || hotel.low_rate).toLocaleString('en-US');
    const highPrice = ((hotel.pricePerNight || hotel.low_rate) * 1.2).toLocaleString('en-US');

    detailContainer.innerHTML = `
        <!-- Hotel Header Section -->
        <div class="hotel-header">
            <div class="hotel-title">
                <div class="hotel-name-rating">
                    <h1>${hotel.name}</h1>
                    <div class="hotel-rating">
                        <div class="star-rating">
                            ${generateStarRating(hotel.starRating || parseFloat(hotel.star_rating))}
                        </div>
                        <div class="review-count">
                            ${avgRating} (${hotel.reviews.length} reviews)
                        </div>
                    </div>
                    <div class="hotel-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${hotel.address || hotel.address1 || ""}, ${hotel.city || "New York"}, ${hotel.state_province || "NY"}
                    </div>
                </div>
            </div>
        </div>

        <!-- Sliding Gallery Mount -->
        <div class="hotel-gallery-wrapper">
            <div class="hotel-gallery-mount"></div>
        </div>
        
        <!-- Hotel Content -->
        <div class="hotel-content">
            <div class="hotel-main">
                <!-- Description Section -->
                <div class="content-section">
                    <h2 class="section-title">About This Property</h2>
                    <div class="hotel-description">
                        <p>${hotel.description || generateDescription(hotel)}</p>
                    </div>
                </div>
                
                <!-- Amenities Section -->
                <div class="content-section">
                    <h2 class="section-title">Amenities</h2>
                    <div class="amenities-grid">
                        ${generateAmenitiesHTML(hotel.amenities || generateAmenities(hotel))}
                    </div>
                </div>
                
                <!-- Room Options Section -->
                <div class="content-section">
                    <h2 class="section-title">Room Options</h2>
                    <div class="room-options">
                        ${generateRoomOptionsHTML(hotel.rooms)}
                    </div>
                </div>
                
                <!-- Location Section -->
                <div class="content-section">
                    <h2 class="section-title">Location</h2>
                    <div class="hotel-map" id="hotel-map"></div>
                    <div class="location-details">
                        <h3>Nearby Landmarks</h3>
                        <div class="landmarks-list">
                            ${generateLandmarksHTML(hotel.location.landmarks)}
                        </div>
                    </div>
                </div>
                
                <!-- Reviews Section -->
                <div class="content-section" id="reviews-section">
                    <div class="reviews-header">
                        <h2 class="section-title">Guest Reviews</h2>
                        <button id="write-review-btn" class="write-review-btn">
                            <i class="fas fa-edit"></i> Write a Review
                        </button>
                    </div>
                    
                    <div class="reviews-summary">
                        <div class="overall-rating">${avgRating}</div>
                        <div class="rating-breakdown">
                            ${generateRatingBreakdown(hotel.reviews)}
                        </div>
                    </div>
                    
                    <div class="review-filters">
                        <div class="review-filter active" data-filter="all">All Reviews</div>
                        <div class="review-filter" data-filter="positive">Positive</div>
                        <div class="review-filter" data-filter="critical">Critical</div>
                        <div class="review-filter" data-filter="recent">Most Recent</div>
                    </div>
                    
                    <div class="reviews-list" id="reviews-list">
                        ${generateReviewsHTML(hotel.reviews)}
                    </div>
                    
                    <div class="load-more-reviews" id="load-more-reviews">Load More Reviews</div>
                </div>
            </div>
        </div>
    `;

    // --- Inject sliding gallery from template ---
    const galleryTemplate = document.getElementById('hotel-gallery-template');
    const galleryMount = detailContainer.querySelector('.hotel-gallery-mount');

    if (galleryTemplate && galleryMount) {
        const fragment = galleryTemplate.content.cloneNode(true);
        const mainWrapper = fragment.querySelector('.hotel-gallery-main .swiper-wrapper');
        const thumbWrapper = fragment.querySelector('.hotel-gallery-thumbs .swiper-wrapper');

        sliderImages.forEach((src, index) => {
            const mainSlide = document.createElement('div');
            mainSlide.className = 'swiper-slide';
            mainSlide.innerHTML = `
                <div class="gallery-item gallery-main">
                    <img ${index === 0 ? 'id="gallery-featured"' : ''} src="${src}" alt="${hotel.name}">
                </div>
            `;
            mainWrapper.appendChild(mainSlide);

            const thumbSlide = document.createElement('div');
            thumbSlide.className = 'swiper-slide';
            thumbSlide.innerHTML = `
                <div class="gallery-item">
                    <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}">
                        <img src="${src}" alt="${hotel.name} thumbnail ${index + 1}">
                    </div>
                </div>
            `;
            thumbWrapper.appendChild(thumbSlide);
        });

        galleryMount.replaceWith(fragment);
    } else {
        console.warn('Gallery template or mount point not found.');
    }

    // Initialize map, default dates, and sliders
    initMap(hotel.location.latitude, hotel.location.longitude, hotel.name);
    setDefaultDates();
    initializeGallerySlider();
}



// Helper functions for HTML generation
function generateStarRating(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

function generateGalleryItems(images, hotelName) {
    return images.map((src, index) => `
        <div class="gallery-item">
            <div class="gallery-thumbnail ${index === 0 ? 'active' : ''}" data-image="${src}">
                <img src="${src}" alt="${hotelName} photo ${index + 1}">
            </div>
        </div>
    `).join('');
}

function generateAmenitiesHTML(amenities) {
    if (!amenities || !Array.isArray(amenities)) {
        return '<p>No amenities information available</p>';
    }
    
    return amenities.map(amenity => {
        let iconClass = 'fas fa-check'; // Default icon
        
        // Map amenities to appropriate icons
        if (amenity.toLowerCase().includes('wifi')) iconClass = 'fas fa-wifi';
        if (amenity.toLowerCase().includes('pool')) iconClass = 'fas fa-swimming-pool';
        if (amenity.toLowerCase().includes('spa')) iconClass = 'fas fa-spa';
        if (amenity.toLowerCase().includes('gym') || amenity.toLowerCase().includes('fitness')) iconClass = 'fas fa-dumbbell';
        if (amenity.toLowerCase().includes('restaurant')) iconClass = 'fas fa-utensils';
        if (amenity.toLowerCase().includes('bar')) iconClass = 'fas fa-glass-martini-alt';
        if (amenity.toLowerCase().includes('beach')) iconClass = 'fas fa-umbrella-beach';
        if (amenity.toLowerCase().includes('concierge')) iconClass = 'fas fa-concierge-bell';
        if (amenity.toLowerCase().includes('parking')) iconClass = 'fas fa-parking';
        if (amenity.toLowerCase().includes('air')) iconClass = 'fas fa-wind';
        if (amenity.toLowerCase().includes('business')) iconClass = 'fas fa-briefcase';
        if (amenity.toLowerCase().includes('breakfast')) iconClass = 'fas fa-coffee';
        if (amenity.toLowerCase().includes('room service')) iconClass = 'fas fa-concierge-bell';
        if (amenity.toLowerCase().includes('laundry')) iconClass = 'fas fa-tshirt';
        
        return `
            <div class="amenity-item">
                <i class="${iconClass}"></i>
                <span>${amenity}</span>
            </div>
        `;
    }).join('');
}

function generateRoomOptionsHTML(rooms) {
    if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
        return '<p>No room information available</p>';
    }
    
    return rooms.map(room => {
        // Format features as badges
        const featuresHTML = room.features.map(feature => {
            let iconClass = 'fas fa-check';
            
            // Map features to appropriate icons
            if (feature.toLowerCase().includes('king')) iconClass = 'fas fa-bed';
            if (feature.toLowerCase().includes('queen')) iconClass = 'fas fa-bed';
            if (feature.toLowerCase().includes('view')) iconClass = 'fas fa-mountain';
            if (feature.toLowerCase().includes('balcony') || feature.toLowerCase().includes('terrace')) iconClass = 'fas fa-door-open';
            if (feature.toLowerCase().includes('sq ft')) iconClass = 'fas fa-ruler-combined';
            if (feature.toLowerCase().includes('pool')) iconClass = 'fas fa-swimming-pool';
            
            return `<div class="room-feature"><i class="${iconClass}"></i> ${feature}</div>`;
        }).join('');
        
        // Use placeholder image if room image is not provided
        const roomImage = room.image || '/images/room-placeholder.jpg';
        
        return `
            <div class="room-card">
                <div class="room-image">
                    <img src="${roomImage}" alt="${room.name}">
                </div>
                <div class="room-details">
                    <h3 class="room-name">${room.name}</h3>
                    <div class="room-features">
                        ${featuresHTML}
                    </div>
                    <div class="room-price">
                        <div>
                            <span class="room-rate">$${room.price.toLocaleString('en-US')}</span>
                            <span class="room-note">per night</span>
                        </div>
                        <button class="select-room-btn" data-room="${room.name}" data-price="${room.price}">Select</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function generateLandmarksHTML(landmarks) {
    if (!landmarks || !Array.isArray(landmarks) || landmarks.length === 0) {
        return '<p>No landmark information available</p>';
    }
    
    return landmarks.map(landmark => `
        <div class="location-info">
            <i class="fas fa-map-pin"></i>
            <div>
                <span class="location-name">${landmark.name}</span>
                <span class="location-distance">${landmark.distance}</span>
            </div>
        </div>
    `).join('');
}

function calculateAverageRating(reviews) {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
        return 0;
    }
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
}

function generateRatingBreakdown(reviews) {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
        return '<p>No reviews available</p>';
    }
    
    // Calculate average ratings for different categories
    const categories = {
        'Cleanliness': 0,
        'Service': 0,
        'Comfort': 0,
        'Location': 0,
        'Value': 0
    };
    
    // For demo purposes, generate random ratings for each category
    // In a real app, these would come from actual review data
    for (const category in categories) {
        // Generate a value that's close to the overall average but with some variation
        const avgRating = parseFloat(calculateAverageRating(reviews));
        const variation = (Math.random() * 0.6) - 0.3; // Random variation between -0.3 and +0.3
        categories[category] = Math.min(5, Math.max(1, avgRating + variation)).toFixed(1);
    }
    
    let breakdownHTML = '';
    
    for (const category in categories) {
        const rating = categories[category];
        const fillPercentage = (rating / 5) * 100;
        
        breakdownHTML += `
            <div class="rating-category">
                <span class="category-name">${category}</span>
                <div class="category-bar">
                    <div class="category-fill" style="width: ${fillPercentage}%"></div>
                </div>
                <span class="category-value">${rating}</span>
            </div>
        `;
    }
    
    return breakdownHTML;
}

function generateReviewsHTML(reviews, limit = 3) {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
        return '<p>No reviews available yet. Be the first to review this property!</p>';
    }

    // Limit the number of reviews initially displayed
    const displayedReviews = reviews.slice(0, limit);

    return displayedReviews.map(review => {
        // Generate star rating display
        const ratingStars = generateStarRating(review.rating || review.userRating);

        // Generate review photos if available
        let photosHTML = '';
        if (review.photos && review.photos.length > 0) {
            photosHTML = `
                <div class="review-photos">
                    ${review.photos.map(photo => `
                        <div class="review-photo">
                            <img src="${photo}" alt="Review Photo">
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Format date
        let dateStr = review.date;
        if (review.time) {
            dateStr = new Date(review.time).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        return `
            <div class="review-card">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <img src="${review.avatar || avatarImagePool[Math.floor(Math.random() * avatarImagePool.length)] || '/images/default-avatar.jpg'}" alt="${review.firstName || review.name || 'Reviewer'}">
                    </div>
                    <div>
                        <h4 class="reviewer-name">${review.firstName ? `${review.firstName} ${review.lastName || ''}`.trim() : (review.name || 'Anonymous')}</h4>
                        <div class="review-date">${dateStr}</div>
                    </div>
                </div>
                <div class="review-rating">
                    ${ratingStars}
                </div>
                <div class="review-content">
                    <p>${review.comment || review.content || 'No comment provided.'}</p>
                </div>
                ${photosHTML}
                <div class="review-reaction">
                    <div class="review-helpful">
                        <i class="far fa-thumbs-up"></i> Helpful (${review.helpful || 0})
                    </div>
                    <div class="review-reply">Reply</div>
                </div>
            </div>
        `;
    }).join('');
}

// Set default dates when the page loads
function setDefaultDates() {
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    
    if (checkInInput && checkOutInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Format dates as YYYY-MM-DD for date inputs
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        checkInInput.value = formatDate(today);
        checkOutInput.value = formatDate(tomorrow);
        
        // Set min dates to prevent selection of past dates
        checkInInput.min = formatDate(today);
        checkOutInput.min = formatDate(tomorrow);
        
        // Add event listener for check-in date change
        checkInInput.addEventListener('change', function() {
            const newCheckIn = new Date(this.value);
            const nextDay = new Date(newCheckIn);
            nextDay.setDate(nextDay.getDate() + 1);
            
            // Update check-out min date
            checkOutInput.min = formatDate(nextDay);
            
            // If check-out date is now before check-in, update it
            const checkOutDate = new Date(checkOutInput.value);
            if (checkOutDate <= newCheckIn) {
                checkOutInput.value = formatDate(nextDay);
            }
        });
    }
}
// Helper: build an OSM embed URL from lat/lng
function buildOsmEmbedUrl(lat, lng, padding = 0.01) {
  const south = lat - padding;
  const west = lng - padding;
  const north = lat + padding;
  const east = lng + padding;

  const bbox = `${west},${south},${east},${north}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

// Replace your existing initMap with this version
function initMap(latitude, longitude, hotelName) {
  const mapContainer = document.getElementById('hotel-map');
  if (!mapContainer) return;

  const mapUrl = buildOsmEmbedUrl(latitude, longitude);

  mapContainer.innerHTML = `
    <div class="map-frame">
      <iframe
        src="${mapUrl}"
        title="Map showing ${hotelName}"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>
  `;
}

// Initialize event listeners
function initEventListeners() {
    // Set up login modal
    const openLoginBtn = document.getElementById('openLoginBtn');
    const closeModal = document.getElementById('closeModal');
    const loginModal = document.getElementById('loginModal');
    
    if (openLoginBtn && closeModal && loginModal) {
        openLoginBtn.addEventListener('click', function() {
            loginModal.style.display = 'flex';
        });
        
        closeModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
        
        // Close modal when clicking outside the content
        window.addEventListener('click', function(event) {
            if (event.target === loginModal) {
                loginModal.style.display = 'none';
            }
        });
    }

    // Auth tabs functionality
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding form
            this.classList.add('active');
            document.getElementById(`${targetTab}-form`).classList.add('active');
        });
    });
    
    // Link between forms
    const showSignupForm = document.getElementById('showSignupForm');
    const showLoginForm = document.getElementById('showLoginForm');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const backToLoginForm = document.getElementById('backToLoginForm');
    const forgotTab = document.getElementById('forgotTab');
    
    if (showSignupForm) {
        showSignupForm.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('[data-tab="signup"]').click();
        });
    }
    
    if (showLoginForm) {
        showLoginForm.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('[data-tab="login"]').click();
        });
    }
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('[data-tab="forgot"]').click();
        });
    }
    
    if (backToLoginForm) {
        backToLoginForm.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('[data-tab="login"]').click();
        });
    }
    
    // These will be set up after the DOM is fully loaded with the hotel data
    document.addEventListener('click', function(event) {
        
        // Select room buttons
        if (event.target.matches('.select-room-btn')) {
            const roomName = event.target.getAttribute('data-room');
            const roomPrice = event.target.getAttribute('data-price');
            openBookingModal(roomName, roomPrice);
        }
        
        // Booking buttons
        if (event.target.matches('#booking-btn') || event.target.matches('#sidebar-book-btn')) {
            openBookingModal();
        }
        
        // Write review button
        if (event.target.matches('#write-review-btn') || event.target.closest('#write-review-btn')) {
            toggleReviewForm();
        }
        
        // Cancel review button
        if (event.target.matches('#cancel-review-btn')) {
            toggleReviewForm(false);
        }
        
        // Load more reviews button
        if (event.target.matches('#load-more-reviews')) {
            loadMoreReviews();
        }
        
        // Review filter buttons
        if (event.target.matches('.review-filter')) {
            filterReviews(event.target);
        }
        
        // Close modal buttons
        if (event.target.matches('.close-modal')) {
            closeAllModals();
        }
        
        // Clicking outside modal content should close the modal
        if (event.target.matches('.modal')) {
            closeAllModals();
        }
    });
    
    // Handle review form submission
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReview();
        });
    }
    
    // Star rating input in review form
    const ratingStars = document.getElementById('rating-stars');
    if (ratingStars) {
        const stars = ratingStars.querySelectorAll('i');
        
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.getAttribute('data-rating');
                highlightStars(stars, rating);
            });
            
            star.addEventListener('mouseout', function() {
                const selectedRating = ratingStars.getAttribute('data-selected') || 0;
                highlightStars(stars, selectedRating);
            });
            
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                ratingStars.setAttribute('data-selected', rating);
                highlightStars(stars, rating);
            });
        });
    }
    
    // Handle photo uploads in review form
    const photoInput = document.getElementById('photo-input');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }
}

// Modal and form handling functions
function openGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // For demo purposes, populate gallery with stock images
        const galleryFeatured = document.getElementById('gallery-featured');
        const galleryThumbnails = document.querySelector('.gallery-thumbnails');
        
        if (galleryFeatured && galleryThumbnails) {
            galleryThumbnails.innerHTML = '';
            
            // Add 12 demo gallery images
            const demoImages = [];
            for (let i = 1; i <= 12; i++) {
                const imageNum = (i % 5) + 1; // Cycle through 5 images
                demoImages.push(`/images/hotel-gallery-${imageNum}.jpg`);
            }
            
            // Set the first image as featured
            galleryFeatured.src = demoImages[0];
            
            // Create thumbnails
            demoImages.forEach((image, index) => {
                const thumbnail = document.createElement('div');
                thumbnail.className = 'gallery-thumbnail' + (index === 0 ? ' active' : '');
                thumbnail.innerHTML = `<img src="${image}" alt="Gallery image ${index + 1}">`;
                
                thumbnail.addEventListener('click', function() {
                    galleryFeatured.src = image;
                    document.querySelectorAll('.gallery-thumbnail').forEach(thumb => {
                        thumb.classList.remove('active');
                    });
                    this.classList.add('active');
                });
                
                galleryThumbnails.appendChild(thumbnail);
            });
            
            // Add navigation button functionality
            const prevButton = document.querySelector('.gallery-nav.prev');
            const nextButton = document.querySelector('.gallery-nav.next');
            
            if (prevButton && nextButton) {
                prevButton.addEventListener('click', function() {
                    const activeThumb = document.querySelector('.gallery-thumbnail.active');
                    let prevThumb = activeThumb.previousElementSibling;
                    
                    if (!prevThumb) {
                        prevThumb = galleryThumbnails.lastElementChild;
                    }
                    
                    prevThumb.click();
                });
                
                nextButton.addEventListener('click', function() {
                    const activeThumb = document.querySelector('.gallery-thumbnail.active');
                    let nextThumb = activeThumb.nextElementSibling;
                    
                    if (!nextThumb) {
                        nextThumb = galleryThumbnails.firstElementChild;
                    }
                    
                    nextThumb.click();
                });
            }
        }
    }
}


// Function to open the room selection modal
let selectedRoomInfo = {
    name: null,
    price: null
};

function openRoomSelectionModal(hotelId) {
    // Fetch hotel data
    getHotelById(hotelId).then(hotel => {
        if (!hotel || !hotel.rooms) return;
        
        const modal = document.getElementById('room-selection-modal');
        if (!modal) return;
        
        // Generate room cards HTML
        const roomOptionsContainer = modal.querySelector('.room-options');
        if (!roomOptionsContainer) return;
        
        let roomsHTML = '';
        hotel.rooms.forEach(room => {
            // Check if this room is the previously selected one
            const isSelected = selectedRoomInfo.name === room.name;
            
            roomsHTML += `
                <div class="room-card ${isSelected ? 'selected' : ''}">
                    <div class="room-image">
                        <img src="${room.image || '/images/room-placeholder.jpg'}" alt="${room.name}">
                    </div>
                    <div class="room-details">
                        <h3 class="room-name">${room.name}</h3>
                        <div class="room-price">$${room.price} per night</div>
                        <div class="room-features">
                            ${room.features.map(f => `<div class="feature">${f}</div>`).join('')}
                        </div>
                        <button class="select-room-btn" 
                                data-name="${room.name}" 
                                data-price="${room.price}">
                            ${isSelected ? 'Selected' : 'Select'}
                        </button>
                    </div>
                </div>
            `;
        });
        
        roomOptionsContainer.innerHTML = roomsHTML;
        
        // Add event listeners to select buttons
        const selectButtons = roomOptionsContainer.querySelectorAll('.select-room-btn');
        selectButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update selected room info
                selectedRoomInfo.name = this.getAttribute('data-name');
                selectedRoomInfo.price = this.getAttribute('data-price');
                
                // Update button states
                selectButtons.forEach(btn => {
                    btn.textContent = 'Select';
                    btn.closest('.room-card').classList.remove('selected');
                });
                
                this.textContent = 'Selected';
                this.closest('.room-card').classList.add('selected');
                
                // Open booking modal with selected room
                openBookingModal(selectedRoomInfo.name, selectedRoomInfo.price);
            });
        });
        
        modal.style.display = 'block';
    });
}

// Function to generate room type options
function openBookingModal(roomName, roomPrice) {
    // Update global selected room info
    if (roomName && roomPrice) {
        selectedRoomInfo.name = roomName;
        selectedRoomInfo.price = roomPrice;
    }
    
    const modal = document.getElementById('booking-modal');
    if (!modal) return;
    
    modal.style.display = 'block';
    
    // Set minimum dates for check-in/check-out
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format dates as YYYY-MM-DD for date inputs
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    // Set dates in the inputs
    const checkInInput = document.getElementById('check-in-date');
    const checkOutInput = document.getElementById('check-out-date');
    
    if (checkInInput && checkOutInput) {
        // Set today as default check-in and tomorrow as default check-out
        checkInInput.value = formatDate(today);
        checkOutInput.value = formatDate(tomorrow);
        
        // Set minimum dates to prevent selection of past dates
        checkInInput.min = formatDate(today);
        checkOutInput.min = formatDate(tomorrow);
        
        // Add event listener for check-in date change
        checkInInput.addEventListener('change', function() {
            const newCheckIn = new Date(this.value);
            const nextDay = new Date(newCheckIn);
            nextDay.setDate(nextDay.getDate() + 1);
            
            // Update check-out min date
            checkOutInput.min = formatDate(nextDay);
            
            // If check-out date is now before or equal to check-in, update it
            const checkOutDate = new Date(checkOutInput.value);
            if (checkOutDate <= newCheckIn) {
                checkOutInput.value = formatDate(nextDay);
            }
            
            // Recalculate totals when dates change
            calculateReservationTotal();
        });
        
        // Add event listener for check-out date change
        checkOutInput.addEventListener('change', function() {
            calculateReservationTotal();
        });
    }
    
    // Display the selected room information in the room type section
    const roomTypeSection = modal.querySelector('.room-type-section');
    if (roomTypeSection && selectedRoomInfo.name) {
        roomTypeSection.innerHTML = `
            <h3>Selected Room</h3>
            <div class="selected-room-info">
                <div class="room-name">${selectedRoomInfo.name}</div>
                <div class="room-price">$${selectedRoomInfo.price} per night</div>
                <button id="change-room-btn">Change Room</button>
            </div>
        `;
        
        // Add event listener to change room button
        const changeRoomBtn = document.getElementById('change-room-btn');
        if (changeRoomBtn) {
            changeRoomBtn.addEventListener('click', function() {
                // Close booking modal
                modal.style.display = 'none';
                
                // Open room selection modal
                const urlParams = new URLSearchParams(window.location.search);
                const hotelId = urlParams.get('id');
                openRoomSelectionModal(hotelId);
            });
        }
    } else if (roomTypeSection) {
        // No room selected yet
        roomTypeSection.innerHTML = `
            <h3>Select a Room</h3>
            <div class="no-room-selected">
                <p>Please select a room to continue.</p>
                <button id="select-room-btn">Select Room</button>
            </div>
        `;
        
        // Add event listener to select room button
        const selectRoomBtn = document.getElementById('select-room-btn');
        if (selectRoomBtn) {
            selectRoomBtn.addEventListener('click', function() {
                // Close booking modal
                modal.style.display = 'none';
                
                // Open room selection modal
                const urlParams = new URLSearchParams(window.location.search);
                const hotelId = urlParams.get('id');
                openRoomSelectionModal(hotelId);
            });
        }
    }
    
    // Calculate the reservation total
    calculateReservationTotal();
    
    // Add event listener for complete booking button
    const completeButton = document.getElementById('complete-booking');
    if (completeButton) {
        // Remove existing event listeners by cloning
        const newButton = completeButton.cloneNode(true);
        completeButton.parentNode.replaceChild(newButton, completeButton);
        
        newButton.addEventListener('click', async function() {
            if (!selectedRoomInfo.name) {
                alert('Please select a room first.');
                return;
            }

            // Check if user is logged in
            if (!AuthToken.isValid()) {
                alert('Please log in to make a reservation.');
                return;
            }

            // Get dates
            const checkInInput = document.getElementById('check-in-date');
            const checkOutInput = document.getElementById('check-out-date');

            if (!checkInInput || !checkOutInput || !checkInInput.value || !checkOutInput.value) {
                alert('Please select check-in and check-out dates.');
                return;
            }

            // Get hotel ID
            const urlParams = new URLSearchParams(window.location.search);
            const hotelId = urlParams.get('id');

            if (!hotelId) {
                alert('Hotel ID not found.');
                return;
            }

            // Get guests count
            const guestsSelect = document.getElementById('guests-count');
            const guests = guestsSelect ? parseInt(guestsSelect.value) : 2;

            try {
                // Submit booking to API
                const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AuthToken.get()}`
                    },
                    body: JSON.stringify({
                        hotelId: parseInt(hotelId),
                        checkInDate: checkInInput.value,
                        checkOutDate: checkOutInput.value,
                        guests: guests
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                alert('Thank you for your reservation! A confirmation has been sent to your email.');
                closeAllModals();

            } catch (error) {
                console.error('Booking submission error:', error);
                alert('Failed to complete reservation. Please try again later.');
            }
        });
    }
}


// Function to calculate reservation total
function calculateReservationTotal() {
    if (!selectedRoomInfo.name || !selectedRoomInfo.price) {
        console.log('No room selected');
        return;
    }
    
    // Convert price to number
    const selectedPrice = parseFloat(selectedRoomInfo.price);
    if (isNaN(selectedPrice) || selectedPrice <= 0) {
        console.log('Invalid room price:', selectedRoomInfo.price);
        return;
    }
    
    // Get dates
    const checkInInput = document.getElementById('check-in-date');
    const checkOutInput = document.getElementById('check-out-date');
    
    if (!checkInInput || !checkOutInput) {
        console.log('Date inputs not found');
        return;
    }
    
    const checkInDate = new Date(checkInInput.value);
    const checkOutDate = new Date(checkOutInput.value);
    
    // Calculate number of nights
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Get summary elements
    const roomRateElement = document.getElementById('summary-rate');
    const taxesElement = document.getElementById('summary-taxes');
    const totalElement = document.getElementById('summary-total');
    const completeButton = document.getElementById('complete-booking');
    
    if (!roomRateElement || !taxesElement || !totalElement) {
        console.log('Summary elements not found');
        return;
    }
    
    // Calculate costs
    if (selectedPrice > 0 && nights > 0) {
        const roomTotal = selectedPrice * nights;
        const taxRate = 0.15; // 15% tax
        const taxAmount = roomTotal * taxRate;
        const totalAmount = roomTotal + taxAmount;
        
        // Update summary with formatted numbers and nights
        roomRateElement.textContent = `$${roomTotal.toFixed(2)} (${nights} night${nights !== 1 ? 's' : ''})`;
        taxesElement.textContent = `$${taxAmount.toFixed(2)}`;
        totalElement.textContent = `$${totalAmount.toFixed(2)}`;
        
        if (completeButton) {
            completeButton.disabled = false;
        }
    } else {
        // Default values when calculation not possible
        roomRateElement.textContent = '$0.00 (0 nights)';
        taxesElement.textContent = '$0.00';
        totalElement.textContent = '$0.00';
        
        if (completeButton) {
            completeButton.disabled = true;
        }
    }
}

async function populateRoomOptions(hotelId) {
    const hotel = await getHotelById(hotelId);
    
    if (hotel && hotel.rooms) {
        const roomOptionsContainer = document.querySelector('.room-options');
        
        if (roomOptionsContainer) {
            let roomsHTML = '<h3>Select Room Type</h3>';
            
            // Create room option with radio buttons for selection
            hotel.rooms.forEach((room, index) => {
                roomsHTML += `
                    <div class="room-selection-item">
                        <div class="room-selection-info">
                            <h4>${room.name}</h4>
                            <div class="room-selection-features">
                                ${room.features.map(feature => `<span>${feature}</span>`).join('')}
                            </div>
                        </div>
                        <div class="room-selection-price">
                            <span class="price-value">$${room.price.toLocaleString('en-US')}</span>
                            <span class="price-night">per night</span>
                            <input type="radio" name="roomType" id="room-option-${index}" 
                                data-name="${room.name}" data-price="${room.price}" 
                                ${index === 0 ? 'checked' : ''} style="display:none">
                            <label for="room-option-${index}" class="select-room-option-btn">Select</label>
                        </div>
                    </div>
                `;
            });
            
            roomOptionsContainer.innerHTML = roomsHTML;
            
            // Create reservation summary section
            createReservationSummary();
            
            // Add click event to room selection buttons
            document.querySelectorAll('.select-room-option-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const radioInput = this.previousElementSibling;
                    radioInput.checked = true;
                    
                    // Trigger calculation
                    calculateReservationTotal();
                    
                    // Highlight selected room
                    document.querySelectorAll('.room-selection-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    this.closest('.room-selection-item').classList.add('selected');
                });
            });
            
            // Default to first room
            if (hotel.rooms.length > 0) {
                document.querySelector('.room-selection-item').classList.add('selected');
                calculateReservationTotal();
            }
        }
    }
}

// function to create room type options
function createRoomTypeOptions(container) {
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('id');
    
    // Find or create room type options container
    let roomTypeSection = container.querySelector('.selected-room');
    if (!roomTypeSection) {
        roomTypeSection = document.createElement('div');
        roomTypeSection.className = 'selected-room';
        roomTypeSection.innerHTML = '<h3>Select Room Type</h3>';
        container.insertBefore(roomTypeSection, container.querySelector('.reservation-summary'));
    }
    
    // Get hotel rooms
    getHotelById(hotelId).then(hotel => {
        if (hotel && hotel.rooms) {
            // Create room options
            let roomsHTML = '<div class="room-type-options">';
            
            hotel.rooms.forEach((room, index) => {
                roomsHTML += `
                    <div class="room-option">
                        <input type="radio" name="roomType" id="room-${index}" 
                            data-name="${room.name}" data-price="${room.price}" 
                            ${index === 0 ? 'checked' : ''}>
                        <label for="room-${index}">
                            <div class="room-option-info">
                                <span class="room-option-name">${room.name}</span>
                                <span class="room-option-price">$${room.price} per night</span>
                            </div>
                        </label>
                    </div>
                `;
            });
            
            roomsHTML += '</div>';
            roomTypeSection.innerHTML = '<h3>Select Room Type</h3>' + roomsHTML;
            
            // Add event listeners for room selection
            const roomOptions = document.querySelectorAll('input[name="roomType"]');
            roomOptions.forEach(option => {
                option.addEventListener('change', function() {
                    // Update the selected room input
                    const selectedRoomInput = document.getElementById('selected-room-input');
                    if (selectedRoomInput) {
                        selectedRoomInput.setAttribute('data-name', this.getAttribute('data-name'));
                        selectedRoomInput.setAttribute('data-price', this.getAttribute('data-price'));
                    }
                    
                    // Recalculate totals
                    calculateReservationTotal();
                });
            });
            
            // Select first room by default and calculate
            if (roomOptions.length > 0) {
                roomOptions[0].checked = true;
                const selectedRoomInput = document.getElementById('selected-room-input');
                if (selectedRoomInput) {
                    selectedRoomInput.setAttribute('data-name', roomOptions[0].getAttribute('data-name'));
                    selectedRoomInput.setAttribute('data-price', roomOptions[0].getAttribute('data-price'));
                }
                calculateReservationTotal();
            }
        }
    });
}

// Function to update reservation summary
function updateReservationSummary(roomName, roomPrice) {
    // Find summary elements
    const roomTypeDisplay = document.getElementById('roomTypeDisplay');
    if (!roomTypeDisplay) {
        // Create summary elements if they don't exist
        createReservationSummary();
    }
    
    // Store selected room info
    const selectedRoom = document.querySelector('input[name="roomType"]:checked');
    if (selectedRoom || (roomName && roomPrice)) {
        const name = roomName || selectedRoom.getAttribute('data-name');
        const price = roomPrice || selectedRoom.getAttribute('data-price');
        
        document.getElementById('roomTypeDisplay').textContent = name;
        
        // Trigger calculation with updated room selection
        calculateReservationTotal();
    }
}

// Function to create reservation summary
function createReservationSummary() {
    // Look for the reservation summary container
    let reservationSummary = document.querySelector('.reservation-summary');
    
    // If not found, find the booking section to add it to
    if (!reservationSummary) {
        const bookingContainer = document.querySelector('.modal-content') || 
                                document.querySelector('.booking-modal-content') ||
                                document.querySelector('.room-options');
        
        if (bookingContainer) {
            // Create the reservation summary section
            reservationSummary = document.createElement('div');
            reservationSummary.className = 'reservation-summary';
            bookingContainer.appendChild(reservationSummary);
        } else {
            console.error('Cannot find container for reservation summary');
            return;
        }
    }
    
    // Set the HTML content
    reservationSummary.innerHTML = `
        <h3>Reservation Summary</h3>
        <div class="price-breakdown">
            <div class="price-row">
                <span>Room Rate:</span>
                <span id="summary-rate">$0.00 (0 nights)</span>
            </div>
            <div class="price-row">
                <span>Taxes & Fees:</span>
                <span id="summary-taxes">$0.00</span>
            </div>
            <div class="price-row total">
                <span>Total:</span>
                <span id="summary-total">$0.00</span>
            </div>
        </div>
        <button id="complete-booking" class="complete-booking-btn">Complete Reservation</button>
        <p class="reservation-note">Free cancellation up to 48 hours before check-in</p>
    `;
    
    // Add event listener to the complete booking button
    document.getElementById('complete-booking').addEventListener('click', function() {
        alert('Thank you for your reservation! A confirmation has been sent to your email.');
        closeAllModals();
    });
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

function toggleReviewForm(show) {
    // Get the review form from the DOM
    const reviewForm = document.querySelector('.write-review-form');
    
    if (!reviewForm) {
        console.error("Review form not found");
        return;
    }
    
    // Clone + rebind the form first (this replaces the old DOM nodes)
    setupFormEventListeners();
    
    // Now bind the star-rating handlers on the fresh elements
    initializeStarRating();
    
    // Toggle visibility based on the 'show' parameter
    if (show === undefined) {
        // Toggle based on current state
        reviewForm.classList.toggle('active');
    } else if (show) {
        // Explicitly show
        reviewForm.classList.add('active');
    } else {
        // Explicitly hide
        reviewForm.classList.remove('active');
    }
    
    // If opening the form, scroll to it
    if (reviewForm.classList.contains('active')) {
        reviewForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Helper function to initialize star rating
function initializeStarRating() {
    const ratingStars = document.getElementById('rating-stars');
    
    if (ratingStars) {
        // Make sure the stars element has a data-selected attribute
        if (!ratingStars.hasAttribute('data-selected')) {
            ratingStars.setAttribute('data-selected', '0');
        }
        
        const stars = ratingStars.querySelectorAll('i');
        
        // Remove any existing event listeners (to prevent duplicates)
        stars.forEach(star => {
            star.replaceWith(star.cloneNode(true));
        });
        
        // Get the fresh stars after cloning
        const freshStars = ratingStars.querySelectorAll('i');
        
        // Add event listeners
        freshStars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = this.getAttribute('data-rating');
                highlightStars(freshStars, rating);
            });
            
            star.addEventListener('mouseout', function() {
                const selectedRating = ratingStars.getAttribute('data-selected') || 0;
                highlightStars(freshStars, selectedRating);
            });
            
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                ratingStars.setAttribute('data-selected', rating);
                highlightStars(freshStars, rating);
            });
        });
        
        // Initial star highlighting
        const selectedRating = ratingStars.getAttribute('data-selected') || 0;
        highlightStars(freshStars, selectedRating);
    }
}

// Helper function to set up the form event listeners
function setupFormEventListeners() {
    // Add form submission handler
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        // Remove existing event listeners by cloning
        const newForm = reviewForm.cloneNode(true);
        reviewForm.parentNode.replaceChild(newForm, reviewForm);
        
        newForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitReview();
        });
    }
    
    // Add photo upload handler
    const photoInput = document.getElementById('photo-input');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }
    
    // Add cancel button handler
    const cancelBtn = document.getElementById('cancel-review-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            toggleReviewForm(false);
        });
    }
}

// Keep your existing highlightStars function
function highlightStars(stars, rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        
        if (starRating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}



function highlightStars(stars, rating) {
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        
        if (starRating <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function handlePhotoUpload() {
    const input = document.getElementById('photo-input');
    const preview = document.getElementById('photo-preview');
    
    if (input.files && preview) {
        preview.innerHTML = '';
        
        for (let i = 0; i < input.files.length; i++) {
            const file = input.files[i];
            
            // Only process image files
            if (!file.type.match('image.*')) {
                continue;
            }
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Upload Preview">
                    <span class="preview-remove" data-index="${i}">×</span>
                `;
                
                preview.appendChild(previewItem);
                
                // Add event listener to remove button
                previewItem.querySelector('.preview-remove').addEventListener('click', function() {
                    previewItem.remove();
                    // Note: This doesn't actually remove the file from the input
                    // In a production app, you would need to handle this properly
                });
            };
            
            reader.readAsDataURL(file);
        }
    }
}

async function submitReview() {
    // Check if user is logged in
    if (!AuthToken.isValid()) {
        alert('Please log in to submit a review.');
        return;
    }

    // Get form values
    const ratingStars = document.getElementById('rating-stars');
    const rating = ratingStars.getAttribute('data-selected');
    const content = document.getElementById('review-content').value.trim();

    // Basic validation
    if (!rating || rating === '0') {
        alert('Please select a rating.');
        return;
    }

    if (!content) {
        alert('Please enter your review.');
        return;
    }

    // Get hotel ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('id');

    if (!hotelId) {
        alert('Hotel ID not found.');
        return;
    }

    try {
        // Submit review to API
        const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AuthToken.get()}`
            },
            body: JSON.stringify({
                userRating: parseInt(rating),
                comment: content
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        alert('Thank you for your review! It has been submitted successfully.');

        // Reset the form
        document.getElementById('review-form').reset();
        ratingStars.setAttribute('data-selected', '0');
        highlightStars(ratingStars.querySelectorAll('i'), 0);
        document.getElementById('photo-preview').innerHTML = '';

        // Hide the form
        toggleReviewForm(false);

        // Optionally refresh the page to show the new review
        // window.location.reload();

    } catch (error) {
        console.error('Review submission error:', error);
        alert('Failed to submit review. Please try again later.');
    }
}

async function loadMoreReviews() {
    const hotelId = new URLSearchParams(window.location.search).get('id');
    const reviewsList = document.getElementById('reviews-list');
    const loadMoreBtn = document.getElementById('load-more-reviews');
    
    // Get hotel data
    const hotel = await getHotelById(hotelId);
    
    if (hotel) {
        // Count current reviews
        const currentReviewCount = reviewsList.querySelectorAll('.review-card').length;
        
        // Check if there are more reviews to load
        if (currentReviewCount < hotel.reviews.length) {
            const nextReviews = hotel.reviews.slice(currentReviewCount, currentReviewCount + 3);
            const newReviewsHTML = generateReviewsHTML(nextReviews, nextReviews.length);
            reviewsList.insertAdjacentHTML('beforeend', newReviewsHTML);
            
            // Hide the button if all reviews are loaded
            if (currentReviewCount + 3 >= hotel.reviews.length) {
                loadMoreBtn.style.display = 'none';
            }
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

async function filterReviews(filterButton) {
    const hotelId = new URLSearchParams(window.location.search).get('id');
    const reviewsList = document.getElementById('reviews-list');
    const loadMoreBtn = document.getElementById('load-more-reviews');
    
    // Set active class on the selected filter
    document.querySelectorAll('.review-filter').forEach(filter => {
        filter.classList.remove('active');
    });
    filterButton.classList.add('active');
    
    // Get the filter type
    const filterType = filterButton.getAttribute('data-filter');
    
    // Get hotel data
    const hotel = await getHotelById(hotelId);
    
    if (hotel && hotel.reviews) {
        // Apply filter based on type
        let filteredReviews = [...hotel.reviews]; // Create a copy of all reviews
        
        switch (filterType) {
            case 'positive':
                filteredReviews = filteredReviews.filter(review => review.rating >= 4);
                break;
            case 'critical':
                filteredReviews = filteredReviews.filter(review => review.rating < 4);
                break;
            case 'recent':
                // Already sorted by date (newest first)
                break;
            case 'all':
            default:
                // No filter, show all
                break;
        }
        
        // Update reviews display
        reviewsList.innerHTML = generateReviewsHTML(filteredReviews, Math.min(3, filteredReviews.length));
        
        // Show/hide load more button
        if (filteredReviews.length > 3) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// Add initialization for booking modal
document.addEventListener('DOMContentLoaded', function() {
    // Listen for "Complete Reservation" button clicks
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'completeReservation') {
            alert('Thank you for your reservation! A confirmation will be sent to your email.');
            closeAllModals();
        }
    });
});
