// Innovation Canvas - JavaScript functionality

// Global variables
let currentStep = 1;
const totalSteps = 7;

// Data storage object
const canvasData = {
    step1: {
        problemStatement: '',
        problemContext: '',
        problemImpact: ''
    },
    step2: {},
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
    const step1Data = canvasData.step1;
    
    if (step1Data.problemStatement) {
        document.getElementById('problemStatement').value = step1Data.problemStatement;
    }
    if (step1Data.problemContext) {
        document.getElementById('problemContext').value = step1Data.problemContext;
    }
    if (step1Data.problemImpact) {
        document.getElementById('problemImpact').value = step1Data.problemImpact;
    }
}

// Initialize form handlers
function initializeFormHandlers() {
    const form = document.getElementById('problemForm');
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            saveFormData();
            saveDataToStorage();
            
            // Show success message and redirect after delay
            showNotification('Problem defined successfully! Moving to next step...', 'success');
            
            setTimeout(() => {
                window.location.href = 'step2.html';
            }, 1500);
        }
    });
    
    // Video placeholder click handler
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            showVideoModal();
        });
    }
    
    // Auto-save on input change
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            saveFormData();
            saveDataToStorage();
        });
    });
    
    // Next button in learning resources
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            document.getElementById('problemStatement').focus();
        });
    }
}

// Validate form
function validateForm() {
    const problemStatement = document.getElementById('problemStatement');
    let isValid = true;
    
    // Reset previous validation states
    document.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('is-invalid', 'is-valid');
    });
    
    // Validate problem statement (required)
    if (!problemStatement.value.trim()) {
        problemStatement.classList.add('is-invalid');
        showFieldError(problemStatement, 'Please describe the problem you want to solve.');
        isValid = false;
    } else if (problemStatement.value.trim().length < 10) {
        problemStatement.classList.add('is-invalid');
        showFieldError(problemStatement, 'Please provide more detail about the problem (at least 10 characters).');
        isValid = false;
    } else {
        problemStatement.classList.add('is-valid');
        hideFieldError(problemStatement);
    }
    
    return isValid;
}

// Save form data to canvasData object
function saveFormData() {
    canvasData.step1 = {
        problemStatement: document.getElementById('problemStatement').value.trim(),
        problemContext: document.getElementById('problemContext').value.trim(),
        problemImpact: document.getElementById('problemImpact').value.trim(),
        timestamp: new Date().toISOString()
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
                        <h5 class="modal-title">Problem Definition Guide</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3 text-center">
                            <h6>Learn How to Define Problems Effectively</h6>
                            <p class="text-muted">Watch this video to understand the process of clearly defining problems for innovation.</p>
                        </div>
                        
                        <!-- YouTube Video Embed -->
                        <div class="ratio ratio-16x9 mb-4">
                            <iframe 
                                src="https://www.youtube.com/embed/ms9TZxDx9xE" 
                                title="Problem Definition Guide" 
                                allowfullscreen>
                            </iframe>
                        </div>
                        
                        <div class="text-center">
                            <h6 class="mb-3">Need Additional Help?</h6>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                                <a href="https://claude.ai" target="_blank" class="btn btn-primary">
                                    <i class="fas fa-robot me-2"></i>Get Help from Claude AI
                                </a>
                                <a href="https://chat.openai.com" target="_blank" class="btn btn-success">
                                    <i class="fas fa-comments me-2"></i>Get Help from ChatGPT
                                </a>
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