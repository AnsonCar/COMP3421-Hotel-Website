// API Configuration is defined in common.js

// JWT Token Management

document.addEventListener('DOMContentLoaded', function() {
    // Settings navigation
    const settingsNavItems = document.querySelectorAll('.settings-nav li');
    const settingsSections = document.querySelectorAll('.settings-section');

    settingsNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            console.log('Switching to: ' + targetSection);

            // Remove active class from all nav items
            settingsNavItems.forEach(navItem => navItem.classList.remove('active'));

            // Add active class to clicked item
            this.classList.add('active');

            // Hide all sections and show target section
            settingsSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetSection}-section`) {
                    section.classList.add('active');
                }
            });
            if (targetSection === 'reservations') {
                loadReservations();
            }
            console.log('Active sections: ' + document.querySelectorAll('.settings-section.active').length);
        });
    });
    
    // Profile Form Submission
    const profileForm = document.getElementById('profile-form');

    if (profileForm) {
        profileForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!AuthToken.isValid()) {
                showNotification('Please log in to update your profile', 'error');
                return;
            }

            const firstName = document.getElementById('profile-first-name')?.value.trim() ?? '';
            const lastName = document.getElementById('profile-last-name')?.value.trim() ?? '';
            const email = document.getElementById('profile-email')?.value.trim() ?? '';

            if (!firstName || !lastName || !email) {
                showNotification('All fields are required', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AuthToken.get()}`
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                // Update UI
                const sidebarUserName = document.getElementById('sidebar-user-name');
                if (sidebarUserName) sidebarUserName.textContent = `${firstName} ${lastName}`;

                const sidebarUserEmail = document.getElementById('sidebar-user-email');
                if (sidebarUserEmail) sidebarUserEmail.textContent = email;

                const navUserName = document.getElementById('nav-user-name');
                if (navUserName) navUserName.textContent = firstName;

                showNotification('Profile updated successfully!', 'success');
            } catch (error) {
                console.error('Profile update error:', error);
                showNotification('Failed to update profile', 'error');
            }
        });
    }
        
    // Password Form
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('new-password-security');
    const confirmInput = document.getElementById('confirm-password-security');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!AuthToken.isValid()) {
                showNotification('Please log in to change your password', 'error');
                return;
            }

            const currentPassword = document.getElementById('current-password')?.value.trim() ?? '';
            const newPassword = document.getElementById('new-password-security')?.value.trim() ?? '';
            const confirmPassword = document.getElementById('confirm-password-security')?.value.trim() ?? '';

            if (!currentPassword) {
                showNotification('Please enter your current password', 'error');
                return;
            }

            if (!newPassword) {
                showNotification('Please enter a new password', 'error');
                return;
            }

            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/password`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AuthToken.get()}`
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                showNotification('Password updated successfully', 'success');
                passwordForm.reset();
            } catch (error) {
                console.error('Password change error:', error);
                showNotification(error.message || 'Failed to update password', 'error');
            }
        });
    }
    
    // Reservation Filtering
    const reservationFilter = document.getElementById('reservation-filter');
    
    if (reservationFilter) {
        reservationFilter.addEventListener('change', function() {
            applyReservationFilter();
        });
    }
    
    // Toggle Switches
    const toggleSwitches = document.querySelectorAll('.toggle-input');
    
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const settingName = this.id;
            const isEnabled = this.checked;
            
            simulateAPICall({ setting: settingName, enabled: isEnabled })
                .then(() => showNotification(`${formatSettingName(settingName)} ${isEnabled ? 'enabled' : 'disabled'}`, 'success'))
                .catch(() => {
                    this.checked = !isEnabled;
                    showNotification('Failed to update setting', 'error');
                });
        });
    });
    
    // Profile Photo Upload
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    const photoUploadModal = document.getElementById('photo-upload-modal');
    const uploadInput = document.getElementById('photo-upload');
    const uploadTrigger = document.getElementById('upload-trigger');
    const photoPreview = document.getElementById('photo-preview');
    const savePhotoBtn = document.getElementById('save-photo');
    const removePhotoBtn = document.getElementById('remove-photo');
    const cancelUploadBtn = document.getElementById('cancel-upload');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    let selectedFile = null;
    
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', function() {
            if (photoUploadModal) showModal(photoUploadModal);
        });
    }
    
    if (uploadTrigger && uploadInput) {
        uploadTrigger.addEventListener('click', () => uploadInput.click());
        
        uploadInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                selectedFile = this.files[0];
                
                const reader = new FileReader();
                reader.onload = e => {
                    photoPreview.src = e.target.result;
                };
                reader.readAsDataURL(selectedFile);
            }
        });
    }
    
    if (savePhotoBtn) {
        savePhotoBtn.addEventListener('click', function() {
            if (!selectedFile) {
                showNotification('Please select an image first', 'error');
                return;
            }
            
            simulateAPICall()
                .then(() => {
                    const profileImages = document.querySelectorAll('img[id$="-profile-img"]');
                    profileImages.forEach(img => {
                        img.src = photoPreview.src;
                    });
                    
                    showNotification('Profile photo updated successfully', 'success');
                    hideModal(photoUploadModal);
                    selectedFile = null;
                })
                .catch(() => showNotification('Failed to update profile photo', 'error'));
        });
    }
    
    if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', function() {
            photoPreview.src = '/images/default-profile.jpg';
            selectedFile = null;
            if (uploadInput) uploadInput.value = '';
        });
    }
    
    if (cancelUploadBtn) {
        cancelUploadBtn.addEventListener('click', function() {
            hideModal(photoUploadModal);
            photoPreview.src = document.getElementById('sidebar-profile-img').src;
            selectedFile = null;
            if (uploadInput) uploadInput.value = '';
        });
    }
    
    // Delete Account
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const deleteAccountModal = document.getElementById('delete-account-modal');
    const confirmDeleteCheckbox = document.getElementById('delete-confirm');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (deleteAccountModal) showModal(deleteAccountModal);
        });
    }
    
    if (confirmDeleteCheckbox && confirmDeleteBtn) {
        confirmDeleteCheckbox.addEventListener('change', function() {
            confirmDeleteBtn.disabled = !this.checked;
        });
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async function() {
            const deletePassword = document.getElementById('delete-password').value;

            if (!deletePassword) {
                showNotification('Please enter your password to confirm', 'error');
                return;
            }

            if (!AuthToken.isValid()) {
                showNotification('Please log in to delete your account', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/account`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${AuthToken.get()}`
                    }
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || `HTTP error! status: ${response.status}`);
                }

                showNotification('Your account has been deleted. You will be redirected to the homepage.', 'success');
                AuthToken.remove(); // Clear token
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            } catch (error) {
                console.error('Account deletion error:', error);
                showNotification(error.message || 'Failed to delete account. Please check your password.', 'error');
            }
        });
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            hideModal(deleteAccountModal);
            confirmDeleteCheckbox.checked = false;
            document.getElementById('delete-password').value = '';
            confirmDeleteBtn.disabled = true;
        });
    }
    
    // Modal Close Handlers
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) hideModal(modal);
        });
    });
    
    // Helper Functions
    function showModal(modal) {
        if (!modal) return;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal(modal) {
        if (!modal) return;
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        notification.style.position = 'fixed';
        notification.style.bottom = '30px';
        notification.style.right = '30px';
        notification.style.backgroundColor = '#353333ff';
        notification.style.borderLeft = type === 'success' ? '4px solid #4CAF50' : 
                                    type === 'error' ? '4px solid #F44336' : 
                                    '4px solid #2196F3';
        notification.style.borderRadius = '4px';
        notification.style.padding = '12px 16px';
        notification.style.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.justifyContent = 'space-between';
        notification.style.width = '350px';
        notification.style.maxWidth = '90%';
        notification.style.transform = 'translateX(120%)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
        notification.style.zIndex = '1500';
        
        const contentDiv = document.createElement('div');
        contentDiv.style.display = 'flex';
        contentDiv.style.alignItems = 'center';
        
        const iconSpan = document.createElement('span');
        const iconMap = { success: '✓', error: '✕', info: 'i' };
        const colorMap = { success: '#4CAF50', error: '#F44336', info: '#2196F3' };
        const iconColor = colorMap[type] || '#2196F3';
        iconSpan.textContent = iconMap[type] || 'i';
        iconSpan.style.marginRight = '12px';
        iconSpan.style.fontWeight = 'bold';
        iconSpan.style.color = iconColor;
        iconSpan.style.fontSize = '18px';
        
        const messageSpan = document.createElement('span');
        messageSpan.textContent = message;
        messageSpan.style.color = '#dadadaff';
        
        contentDiv.appendChild(iconSpan);
        contentDiv.appendChild(messageSpan);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = '#999999';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '5px';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.lineHeight = '1';
        closeBtn.style.fontWeight = 'bold';
        
        notification.appendChild(contentDiv);
        notification.appendChild(closeBtn);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        closeBtn.addEventListener('click', () => removeNotification(notification));
        setTimeout(() => removeNotification(notification), 5000);
    }

    function removeNotification(notification) {
        notification.style.transform = 'translateX(120%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }
    
    function formatSettingName(settingId) {
        return settingId
            .replace(/-/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/Notifications/i, 'Notifications');
    }
    
    function simulateAPICall(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Math.random() < 0.95 ? resolve(data) : reject(new Error('API call failed'));
            }, 800);
        });
    }
    
    async function loadReservations() {
        const list = document.querySelector('.reservations-list');
        if (!list) return;
        
        if (!AuthToken.isValid()) {
            showNotification('Please log in to view reservations', 'error');
            renderReservations([]);
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${AuthToken.get()}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const bookings = await response.json();
            
            renderReservations(bookings);
        } catch (error) {
            console.error('Failed to load reservations:', error);
            showNotification('Failed to load reservations', 'error');
            renderReservations([]);
        }
    }
    
    function renderReservations(bookings) {
        const list = document.querySelector('.reservations-list');
        if (!list) return;
        
        list.innerHTML = '';
        
        if (!bookings || bookings.length === 0) {
            list.innerHTML = '<p class="empty-state">No reservations found.</p>';
            const pagination = document.querySelector('#reservations-section .pagination');
            if (pagination) pagination.style.display = 'none';
            return;
        }
        
        bookings.forEach(booking => {
            const item = createReservationItem(booking);
            list.appendChild(item);
        });
        
        // Re-apply current filter
        applyReservationFilter();
        
        const pagination = document.querySelector('#reservations-section .pagination');
        if (pagination) pagination.style.display = 'flex';
    }
    
    function createReservationItem(booking) {
        let statusClass;
        switch (booking.status) {
            case 'confirmed':
                statusClass = 'upcoming';
                break;
            case 'completed':
                statusClass = 'past';
                break;
            case 'canceled':
                statusClass = 'canceled';
                break;
            default:
                statusClass = 'upcoming';
        }
        
        const capitalizedStatus = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
        const confirmation = booking.confirmationNumber || `#LH${booking.id}`;
        
        const checkIn = new Date(booking.dates.checkIn);
        const checkOut = new Date(booking.dates.checkOut);
        
        const dateStr = formatDateRange(checkIn, checkOut);
        
        const hotel = booking.hotel;
        let imageUrl = hotel.imageUrl;
        if (!imageUrl) {
            const roomIndex = (booking.id % 3) + 1;
            imageUrl = `/images/room-${roomIndex}.jpg`;
        }
        
        let actionsHtml = '';
        switch (booking.status) {
            case 'confirmed':
                actionsHtml = `
                    <button class="btn btn-outline btn-sm" data-action="modify">Modify</button>
                    <button class="btn btn-danger btn-sm" data-action="cancel">Cancel</button>
                `;
                break;
            case 'completed':
                actionsHtml = `
                    <button class="btn btn-outline btn-sm" data-action="view-details">View Details</button>
                    <button class="btn btn-primary btn-sm" data-action="book-again">Book Again</button>
                `;
                break;
            case 'canceled':
                actionsHtml = `
                    <button class="btn btn-primary btn-sm" data-action="book-again">Book Again</button>
                `;
                break;
            default:
                actionsHtml = '';
        }
        
        const item = document.createElement('div');
        item.className = `reservation-item ${statusClass}`;
        
        item.innerHTML = `
            <div class="reservation-header">
                <div class="reservation-status ${statusClass}">${capitalizedStatus}</div>
                <div class="reservation-id">Confirmation #${confirmation}</div>
            </div>
            <div class="reservation-details">
                <div class="hotel-info">
                    <img src="${imageUrl}" alt="${hotel.name}" class="hotel-thumbnail">
                    <div class="hotel-details">
                        <h4 class="hotel-name">${hotel.name}</h4>
                        <p class="room-type">${hotel.roomType || 'Standard Room'}</p>
                        <p class="reservation-dates"><i class="fas fa-calendar-alt"></i> ${dateStr}</p>
                    </div>
                </div>
                <div class="reservation-actions">
                    ${actionsHtml}
                </div>
            </div>
        `;
        
        return item;
    }
    
    function getReservationActions(status) {
        switch (status) {
            case 'confirmed':
                return ['Modify', 'Cancel'];
            case 'completed':
                return ['View Details', 'Book Again'];
            case 'canceled':
                return ['Book Again'];
            default:
                return [];
        }
    }
    
    function formatDateRange(start, end) {
        const monthFormatter = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
        });
        
        const yearFormatter = new Intl.DateTimeFormat('en-US', {
            year: 'numeric'
        });
        
        const startStr = monthFormatter.format(start);
        const endStr = monthFormatter.format(end);
        const year = yearFormatter.format(end);
        
        return `${startStr} - ${endStr}, ${year}`;
    }
    
    function applyReservationFilter() {
        const filter = document.getElementById('reservation-filter');
        if (!filter) return;
        
        const filterValue = filter.value;
        const items = document.querySelectorAll('.reservation-item');
        
        items.forEach(item => {
            item.style.display = (filterValue === 'all' || item.classList.contains(filterValue)) ? 'block' : 'none';
        });
    }
});