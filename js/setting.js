document.addEventListener('DOMContentLoaded', function() {
    // Settings navigation
    const settingsNavItems = document.querySelectorAll('.settings-nav li');
    const settingsSections = document.querySelectorAll('.settings-section');
    
    settingsNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            settingsNavItems.forEach(navItem => navItem.classList.remove('active'));
            this.addEventListener('click', function() {
                const targetSection = this.getAttribute('data-section');
                
                settingsNavItems.forEach(navItem => navItem.classList.remove('active'));
                this.classList.add('active');
                
                settingsSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === `${targetSection}-section`) {
                        section.classList.add('active');
                    }
                });
            });
        });
    });
    
    // Profile Form Submission
    const profileForm = document.getElementById('profile-form');

    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const firstName = document.getElementById('profile-first-name')?.value.trim() ?? '';
            const lastName = document.getElementById('profile-last-name')?.value.trim() ?? '';
            const email = document.getElementById('profile-email')?.value.trim() ?? '';

            const sidebarUserName = document.getElementById('sidebar-user-name');
            if (sidebarUserName) sidebarUserName.textContent = `${firstName} ${lastName}`;

            const sidebarUserEmail = document.getElementById('sidebar-user-email');
            if (sidebarUserEmail) sidebarUserEmail.textContent = email;

            const navUserName = document.getElementById('nav-user-name');
            if (navUserName) navUserName.textContent = firstName;

            simulateAPICall()
                .then(() => showNotification('Changes saved successfully!', 'success'))
                .catch(() => showNotification('Failed to update profile', 'error'));
        });
    }
        
    // Password Form
    const passwordForm = document.getElementById('password-form');
    const passwordInput = document.getElementById('new-password');
    const confirmInput = document.getElementById('confirm-password');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const currentPassword = document.getElementById('current-password')?.value.trim() ?? '';

            if (!currentPassword) {
                showNotification('Please enter your current password', 'error');
                return;
            }

            if (passwordInput !== confirmInput) {
                showNotification('New passwords and Confirm password do not match', 'error');
                return;
            }

            simulateAPICall()
                .then(() => {
                    showNotification('Password updated successfully', 'success');
                    passwordForm.reset();
                })
                .catch(() => {
                    showNotification('Failed to update password', 'error');
                });
        });
    }
    
    // Reservation Filtering
    const reservationFilter = document.getElementById('reservation-filter');
    const reservationItems = document.querySelectorAll('.reservation-item');
    
    if (reservationFilter) {
        reservationFilter.addEventListener('change', function() {
            const filterValue = this.value;
            
            reservationItems.forEach(item => {
                item.style.display = filterValue === 'all' || item.classList.contains(filterValue)
                    ? 'block'
                    : 'none';
            });
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
            photoPreview.src = 'images/default-profile.jpg';
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
        confirmDeleteBtn.addEventListener('click', function() {
            const deletePassword = document.getElementById('delete-password').value;
            
            if (!deletePassword) {
                showNotification('Please enter your password to confirm', 'error');
                return;
            }
            
            simulateAPICall()
                .then(() => {
                    showNotification('Your account has been deleted. You will be redirected to the homepage.', 'success');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000);
                })
                .catch(() => showNotification('Failed to delete account. Please check your password.', 'error'));
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
});