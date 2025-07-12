// Innovation Canvas - Step 2: Identify Target Users

// Global variables
let currentStep = 2;
const totalSteps = 7;

// Data storage object
const canvasData = {
    step1: {},
    step2: {
        primaryUsers: '',
        keyNeeds: '',
        biggestFrustration: '',
        persona: {
            name: '',
            age: '',
            occupation: '',
            goals: '',
            challenges: ''
        }
    },
    step3: {},
    step4: {},
    step5: {},
    step6: {},
    step7: {}
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    initializeFormHandlers();
    updateProgress();
    // updateCompletionStatus() is now called after populateForm() in loadDataFromStorage()
});

// Load existing data from localStorage
function loadDataFromStorage() {
    const savedData = localStorage.getItem('innovationCanvasData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            Object.assign(canvasData, parsedData);
            populateForm();
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

// Save data to localStorage
function saveDataToStorage() {
    try {
        localStorage.setItem('innovationCanvasData', JSON.stringify(canvasData));
        showNotification('Progress saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Error saving progress. Please try again.', 'error');
    }
}

// Populate form with saved data
function populateForm() {
    const step2Data = canvasData.step2;
    
    if (step2Data.primaryUsers) {
        document.getElementById('primaryUsers').value = step2Data.primaryUsers;
    }
    if (step2Data.keyNeeds) {
        document.getElementById('keyNeeds').value = step2Data.keyNeeds;
    }
    if (step2Data.biggestFrustration) {
        document.getElementById('biggestFrustration').value = step2Data.biggestFrustration;
    }
    
    // Populate persona data
    if (step2Data.persona) {
        const persona = step2Data.persona;
        if (persona.name) document.getElementById('personaName').value = persona.name;
        if (persona.age) document.getElementById('personaAge').value = persona.age;
        if (persona.occupation) document.getElementById('personaOccupation').value = persona.occupation;
        if (persona.goals) document.getElementById('personaGoals').value = persona.goals;
        if (persona.challenges) document.getElementById('personaChallenges').value = persona.challenges;
        
        updatePersonaPreview();
    }
    
    // Update completion status after populating form
    updateCompletionStatus();
}

// Initialize form handlers
function initializeFormHandlers() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    // Video placeholder click handler
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            showVideoModal();
        });
    }
    
    // Auto-save on input change for main form
    const mainFormInputs = document.querySelectorAll('#userGroupsForm input, #userGroupsForm textarea');
    mainFormInputs.forEach(input => {
        input.addEventListener('blur', function() {
            saveFormData();
            saveDataToStorage();
            updateCompletionStatus();
        });
        
        input.addEventListener('input', function() {
            updateCompletionStatus();
        });
    });
    
    // Persona form handlers
    const personaInputs = document.querySelectorAll('#personaName, #personaAge, #personaOccupation, #personaGoals, #personaChallenges');
    personaInputs.forEach(input => {
        input.addEventListener('input', function() {
            updatePersonaPreview();
        });
        
        input.addEventListener('blur', function() {
            savePersonaData();
            saveDataToStorage();
        });
    });
}

// Update completion status
function updateCompletionStatus() {
    // This function can be used for other completion tracking if needed
    // Currently no visual completion status indicator on this page
}

// Update persona preview
function updatePersonaPreview() {
    const name = document.getElementById('personaName').value.trim();
    const age = document.getElementById('personaAge').value;
    const occupation = document.getElementById('personaOccupation').value.trim();
    const goals = document.getElementById('personaGoals').value.trim();
    const challenges = document.getElementById('personaChallenges').value.trim();
    
    const preview = document.getElementById('personaPreview');
    const display = document.getElementById('personaDisplay');
    
    if (name || age || occupation || goals || challenges) {
        preview.style.display = 'block';
        
        let personaHtml = '<div class="row">';
        
        if (name || age || occupation) {
            personaHtml += '<div class="col-md-6">';
            personaHtml += '<h6 class="fw-bold text-primary">Profile</h6>';
            if (name) personaHtml += `<p><strong>Name:</strong> ${name}</p>`;
            if (age) personaHtml += `<p><strong>Age:</strong> ${age}</p>`;
            if (occupation) personaHtml += `<p><strong>Role:</strong> ${occupation}</p>`;
            personaHtml += '</div>';
        }
        
        if (goals || challenges) {
            personaHtml += '<div class="col-md-6">';
            personaHtml += '<h6 class="fw-bold text-primary">Insights</h6>';
            if (goals) personaHtml += `<p><strong>Goals:</strong> ${goals}</p>`;
            if (challenges) personaHtml += `<p><strong>Challenges:</strong> ${challenges}</p>`;
            personaHtml += '</div>';
        }
        
        personaHtml += '</div>';
        display.innerHTML = personaHtml;
    } else {
        preview.style.display = 'none';
    }
}

// Validate form
function validateForm() {
    const primaryUsers = document.getElementById('primaryUsers');
    const keyNeeds = document.getElementById('keyNeeds');
    let isValid = true;
    
    // Reset previous validation states
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });
    
    // Validate primary users (required)
    if (!primaryUsers.value.trim()) {
        primaryUsers.classList.add('is-invalid');
        showFieldError(primaryUsers, 'Please identify your primary users.');
        isValid = false;
    } else {
        primaryUsers.classList.add('is-valid');
        hideFieldError(primaryUsers);
    }
    
    // Validate key needs (required)
    if (!keyNeeds.value.trim()) {
        keyNeeds.classList.add('is-invalid');
        showFieldError(keyNeeds, 'Please describe the key needs of your users.');
        isValid = false;
    } else {
        keyNeeds.classList.add('is-valid');
        hideFieldError(keyNeeds);
    }
    
    return isValid;
}

// Save form data to canvasData object
function saveFormData() {
    canvasData.step2 = {
        ...canvasData.step2,
        primaryUsers: document.getElementById('primaryUsers').value.trim(),
        keyNeeds: document.getElementById('keyNeeds').value.trim(),
        biggestFrustration: document.getElementById('biggestFrustration').value.trim(),
        timestamp: new Date().toISOString()
    };
}

// Save persona data
function savePersonaData() {
    canvasData.step2.persona = {
        name: document.getElementById('personaName').value.trim(),
        age: document.getElementById('personaAge').value,
        occupation: document.getElementById('personaOccupation').value.trim(),
        goals: document.getElementById('personaGoals').value.trim(),
        challenges: document.getElementById('personaChallenges').value.trim()
    };
}

// Show field error
function showFieldError(field, message) {
    let errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        field.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
}

// Hide field error
function hideFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Show video modal
function showVideoModal() {
    const modalHTML = `
        <div class="modal fade" id="videoModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">How to Spot Hidden Users</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3 text-center">
                            <h6>Learn to Identify Your Real Target Users</h6>
                            <p class="text-muted">Watch this video to understand user research and persona development techniques.</p>
                        </div>
                        
                        <!-- YouTube Video Embed -->
                        <div class="ratio ratio-16x9 mb-4">
                            <iframe 
                                src="https://www.youtube.com/embed/kAFG1DaCV3E" 
                                title="How to Spot Hidden Users" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        
                        <div class="text-center">
                            <h6 class="mb-3">Need Additional Help?</h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6>Ask Claude AI</h6>
                                            <p class="small text-muted">Get help with user research questions and persona building</p>
                                            <a href="https://claude.ai" target="_blank" class="btn btn-primary btn-sm">
                                                <i class="fas fa-robot me-2"></i>Chat with Claude
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6>Ask ChatGPT</h6>
                                            <p class="small text-muted">Get guidance on target user identification strategies</p>
                                            <a href="https://chat.openai.com" target="_blank" class="btn btn-success btn-sm">
                                                <i class="fas fa-comments me-2"></i>Chat with GPT
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('videoModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body and show
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('videoModal'));
    modal.show();
    
    // Clean up modal when hidden
    document.getElementById('videoModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Update progress indicator
function updateProgress() {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.text-muted');
    
    if (progressBar) {
        const progressPercentage = (currentStep / totalSteps) * 100;
        progressBar.style.width = progressPercentage + '%';
    }
    
    if (progressText) {
        progressText.textContent = `Progress: ${currentStep} of ${totalSteps} steps`;
    }
}

// Navigation functions
function goToPreviousStep() {
    saveFormData();
    savePersonaData();
    saveDataToStorage();
    window.location.href = 'index.html';
}

function saveAndContinue() {
    if (validateForm()) {
        saveFormData();
        savePersonaData();
        saveDataToStorage();
        
        showNotification('Target users identified successfully! Moving to next step...', 'success');
        
        setTimeout(() => {
            window.location.href = 'step3.html';
        }, 1500);
    }
}

// Export data function (for debugging)
function exportCanvasData() {
    const dataStr = JSON.stringify(canvasData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'innovation-canvas-data.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Clear all data function (for debugging)
function clearAllData() {
    if (confirm('Are you sure you want to clear all saved data? This action cannot be undone.')) {
        localStorage.removeItem('innovationCanvasData');
        location.reload();
    }
}

// Console helper functions for development
if (typeof window !== 'undefined') {
    window.canvasDebug = {
        exportData: exportCanvasData,
        clearData: clearAllData,
        viewData: () => console.log(canvasData),
        saveTest: () => saveDataToStorage()
    };
}