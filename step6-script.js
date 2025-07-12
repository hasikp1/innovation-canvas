// Innovation Canvas - Step 6: Plan Implementation

// Global variables
let currentStep = 6;
const totalSteps = 7;
let selectedSolution = null;

// Data storage object
const canvasData = {
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {
        keyActivities: '',
        keyResources: '',
        keyPartners: '',
        timeline: '',
        timestamp: null
    },
    step7: {}
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    loadSelectedSolution();
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

// Load selected solution from Step 4
function loadSelectedSolution() {
    if (canvasData.step4 && canvasData.step4.selectedSolution !== null) {
        const solutionIndex = canvasData.step4.selectedSolution;
        const ideas = canvasData.step3?.ideas || [];
        
        if (ideas[solutionIndex]) {
            selectedSolution = ideas[solutionIndex];
            displaySelectedSolution();
        } else {
            showNoSolutionMessage();
        }
    } else {
        showNoSolutionMessage();
    }
}

// Display selected solution
function displaySelectedSolution() {
    const container = document.getElementById('selectedSolutionSummary');
    container.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <h5 class="text-success mb-2">${selectedSolution.title}</h5>
                <p class="mb-3">${selectedSolution.content}</p>
                <div class="row">
                    <div class="col-md-6">
                        <small class="text-muted">Original Rating:</small>
                        <div class="mb-2">
                            ${generateStarDisplay(selectedSolution.rating)}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <small class="text-muted">Evaluation Score:</small>
                        <div class="mb-2">
                            <span class="badge bg-success">${getEvaluationScore()}/20</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 text-end">
                <button class="btn btn-outline-primary btn-sm" onclick="goToPreviousStep()">
                    <i class="fas fa-edit me-1"></i>Change Solution
                </button>
            </div>
        </div>
    `;
}

// Get evaluation score from Step 4
function getEvaluationScore() {
    if (canvasData.step4 && canvasData.step4.evaluations) {
        const evaluations = canvasData.step4.evaluations;
        const solutionIndex = canvasData.step4.selectedSolution;
        
        if (evaluations[solutionIndex]) {
            return evaluations[solutionIndex].total || 0;
        }
    }
    return 0;
}

// Generate star display (read-only)
function generateStarDisplay(rating) {
    let stars = '';
    for (let i = 1; i <= 3; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-muted"></i>';
        }
    }
    return stars;
}

// Show no solution message
function showNoSolutionMessage() {
    const container = document.getElementById('selectedSolutionSummary');
    // Keep the existing HTML as is - it already shows the right message
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
    
    // Auto-save form fields
    const formFields = ['keyActivities', 'keyResources', 'keyPartners', 'timeline'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', saveFormData);
        }
    });
}

// Populate form with saved data
function populateForm() {
    const step6Data = canvasData.step6;
    
    if (step6Data.keyActivities) {
        document.getElementById('keyActivities').value = step6Data.keyActivities;
    }
    
    if (step6Data.keyResources) {
        document.getElementById('keyResources').value = step6Data.keyResources;
    }
    
    if (step6Data.keyPartners) {
        document.getElementById('keyPartners').value = step6Data.keyPartners;
    }
    
    if (step6Data.timeline) {
        document.getElementById('timeline').value = step6Data.timeline;
    }
}

// Save form data
function saveFormData() {
    canvasData.step6 = {
        keyActivities: document.getElementById('keyActivities').value.trim(),
        keyResources: document.getElementById('keyResources').value.trim(),
        keyPartners: document.getElementById('keyPartners').value.trim(),
        timeline: document.getElementById('timeline').value.trim(),
        timestamp: new Date().toISOString()
    };
    
    saveDataToStorage();
}

// Save data to localStorage
function saveDataToStorage() {
    try {
        localStorage.setItem('innovationCanvasData', JSON.stringify(canvasData));
    } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Error saving progress. Please try again.', 'error');
    }
}

// Show video modal
function showVideoModal() {
    const modalHTML = `
        <div class="modal fade" id="videoModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Implementation Planning</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3 text-center">
                            <h6>From Idea to Reality</h6>
                            <p class="text-muted">Learn how to create an effective implementation plan for your innovation.</p>
                        </div>
                        
                        <!-- YouTube Video Embed -->
                        <div class="ratio ratio-16x9 mb-4">
                            <iframe 
                                src="https://www.youtube.com/embed/b9XDyXiJD7U" 
                                title="Implementation Planning" 
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

// Validation and navigation
function validateForm() {
    const keyActivities = document.getElementById('keyActivities').value.trim();
    const keyResources = document.getElementById('keyResources').value.trim();
    const timeline = document.getElementById('timeline').value.trim();
    
    if (keyActivities.length < 10) {
        showNotification('Please provide more details about your key activities.', 'warning');
        return false;
    }
    
    if (keyResources.length < 10) {
        showNotification('Please provide more details about the resources you\'ll need.', 'warning');
        return false;
    }
    
    if (timeline.length < 10) {
        showNotification('Please provide a more detailed timeline for your implementation.', 'warning');
        return false;
    }
    
    return true;
}

function goToPreviousStep() {
    saveFormData();
    window.location.href = 'step5.html';
}

function saveAndContinue() {
    if (validateForm()) {
        saveFormData();
        
        showNotification('Implementation plan saved successfully! Moving to next step...', 'success');
        
        setTimeout(() => {
            window.location.href = 'step7.html';
        }, 1500);
    }
}

// Utility functions
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

// Console helper functions for development
if (typeof window !== 'undefined') {
    window.canvasDebug = {
        exportData: () => {
            const dataStr = JSON.stringify(canvasData, null, 2);
            console.log(dataStr);
        },
        clearData: () => {
            if (confirm('Clear all data?')) {
                localStorage.removeItem('innovationCanvasData');
                location.reload();
            }
        },
        viewData: () => console.log(canvasData),
        saveTest: () => saveDataToStorage()
    };
}