// Innovation Canvas - Step 5: Design Prototype

// Global variables
let currentStep = 5;
const totalSteps = 7;
let selectedSolution = null;
let savedPrototypes = [];
let currentUploadType = null;
let currentFileData = null;

// Data storage object
const canvasData = {
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {
        prototypes: [],
        selectedSolution: null,
        timestamp: null
    },
    step6: {},
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
            populateMarketResearch();
            populatePhysicalProductPrompt();
            populateDigitalToolPrompt();
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

// Populate market research section with data from previous steps
function populateMarketResearch() {
    // Get solution name
    const solutionName = selectedSolution?.title || 'My Innovation Solution';
    document.getElementById('solutionNameText').textContent = solutionName;
    
    // Get problem from Step 1
    const problemStatement = canvasData.step1?.problemStatement || 'No problem statement available';
    document.getElementById('problemText').textContent = problemStatement;
    
    // Get target users from Step 2
    const primaryUsers = canvasData.step2?.primaryUsers || 'No target users defined';
    const keyNeeds = canvasData.step2?.keyNeeds || '';
    const targetUsersText = primaryUsers + (keyNeeds ? ' - Key needs: ' + keyNeeds : '');
    document.getElementById('targetUsersText').textContent = targetUsersText;
    
    // Get selected solution description
    const solutionText = selectedSolution?.content || 'No solution description available';
    document.getElementById('solutionText').textContent = solutionText;
    
    // Get key features from Step 4 refinement
    const refinement = canvasData.step4?.refinement || '';
    const keyFeaturesText = refinement || 'Key features not yet defined';
    document.getElementById('keyFeaturesText').textContent = keyFeaturesText;
}

// Populate physical product prompt with data from previous steps
function populatePhysicalProductPrompt() {
    // Get solution name
    const productName = selectedSolution?.title || 'My Innovation Product';
    document.getElementById('physicalProductName').textContent = productName;
    
    // Get problem from Step 1
    const problemStatement = canvasData.step1?.problemStatement || 'No problem statement available';
    document.getElementById('physicalProblemText').textContent = problemStatement;
    
    // Get target users from Step 2
    const primaryUsers = canvasData.step2?.primaryUsers || 'No target users defined';
    document.getElementById('physicalTargetText').textContent = primaryUsers;
    
    // Get selected solution description as innovation
    const innovation = selectedSolution?.content || 'No innovation description available';
    document.getElementById('physicalInnovationText').textContent = innovation;
    
    // Set placeholder text for physical specifications
    document.getElementById('physicalSizeText').textContent = '[Approximate size - handheld, desktop, industrial, etc.]';
    document.getElementById('physicalMaterialsText').textContent = '[Plastic, metal, glass, eco-friendly materials, etc.]';
    document.getElementById('physicalColorText').textContent = '[Primary and accent colors]';
    document.getElementById('physicalStyleText').textContent = '[Modern, minimalist, industrial, consumer-friendly, etc.]';
    
    // Set placeholder text for business context
    document.getElementById('physicalMarketText').textContent = '[Size of market/problem]';
    document.getElementById('physicalRevenueText').textContent = '[How will this make money?]';
    document.getElementById('physicalAdvantageText').textContent = '[Why this over alternatives?]';
}

// Populate digital tool prompt with data from previous steps
function populateDigitalToolPrompt() {
    // Get app name
    const appName = selectedSolution?.title || 'My Innovation App';
    document.getElementById('digitalAppName').textContent = appName;
    
    // Get problem from Step 1
    const problemStatement = canvasData.step1?.problemStatement || 'No problem statement available';
    document.getElementById('digitalProblemText').textContent = problemStatement;
    
    // Get target users from Step 2
    const primaryUsers = canvasData.step2?.primaryUsers || 'No target users defined';
    document.getElementById('digitalTargetText').textContent = primaryUsers;
    
    // Get selected solution description as primary feature
    const primaryFeature = selectedSolution?.content || 'No primary feature description available';
    document.getElementById('digitalPrimaryText').textContent = primaryFeature;
    
    // Get key features from Step 4 refinement
    const refinement = canvasData.step4?.refinement || '';
    const secondaryFeatures = refinement || 'Supporting functionality not yet defined';
    document.getElementById('digitalSecondaryText').textContent = secondaryFeatures;
    
    // Get competitive advantage from selected solution
    const advantage = selectedSolution?.content || 'Unique value proposition not yet defined';
    document.getElementById('digitalAdvantageText').textContent = advantage;
    
    // Set placeholder text for business and technical details
    document.getElementById('digitalBusinessText').textContent = '[How does this make money? Subscription, ads, freemium, etc.]';
    document.getElementById('digitalPlatformText').textContent = '[iOS, Android, Web, Desktop - be specific]';
    document.getElementById('digitalJourneyText').textContent = '[How users discover → onboard → get value → retain]';
    document.getElementById('digitalStyleText').textContent = '[Modern, minimalist, playful, professional, etc.]';
    document.getElementById('digitalColorText').textContent = '[Primary brand colors]';
    document.getElementById('digitalDeviceText').textContent = '[Phone, tablet, desktop - specify screen sizes]';
    document.getElementById('digitalScreensText').textContent = '[Login, dashboard, main feature, profile, etc.]';
}

// Copy physical product prompt to clipboard
function copyPhysicalProductPrompt() {
    const promptElement = document.getElementById('physicalProductPrompt');
    const textToCopy = promptElement.innerText || promptElement.textContent;
    
    // Use the modern clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Physical product prompt copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
        // Fallback for older browsers or non-HTTPS
        fallbackCopyTextToClipboard(textToCopy);
    }
}

// Copy digital tool prompt to clipboard
function copyDigitalToolPrompt() {
    const promptElement = document.getElementById('digitalToolPrompt');
    const textToCopy = promptElement.innerText || promptElement.textContent;
    
    // Use the modern clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Digital tool prompt copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
        // Fallback for older browsers or non-HTTPS
        fallbackCopyTextToClipboard(textToCopy);
    }
}

// Copy market research prompt to clipboard
function copyMarketResearchPrompt() {
    const marketResearchElement = document.getElementById('marketResearchText');
    const textToCopy = marketResearchElement.innerText || marketResearchElement.textContent;
    
    // Use the modern clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Market research prompt copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
        // Fallback for older browsers or non-HTTPS
        fallbackCopyTextToClipboard(textToCopy);
    }
}

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Market research prompt copied to clipboard!', 'success');
        } else {
            showNotification('Failed to copy text. Please copy manually.', 'error');
        }
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
        showNotification('Failed to copy text. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// File upload handling
function handleFileUpload(input, type) {
    const file = input.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file.', 'error');
        input.value = '';
        return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('File size must be less than 5MB.', 'error');
        input.value = '';
        return;
    }
    
    currentUploadType = type;
    
    // Read file as data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        currentFileData = e.target.result;
        showFilePreview(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
}

// Show file preview
function showFilePreview(dataUrl, fileName) {
    const preview = document.getElementById('filePreview');
    const previewImage = document.getElementById('previewImage');
    
    previewImage.src = dataUrl;
    preview.style.display = 'block';
    
    // Auto-fill title with filename (without extension)
    const title = fileName.split('.')[0];
    document.getElementById('uploadTitle').value = title;
    
    // Scroll to preview
    preview.scrollIntoView({ behavior: 'smooth' });
}

// Remove file preview
function removePreview() {
    document.getElementById('filePreview').style.display = 'none';
    document.getElementById('uploadTitle').value = '';
    document.getElementById('uploadDescription').value = '';
    document.getElementById('uploadFeatures').value = '';
    
    // Clear file inputs
    document.getElementById('sketchUpload').value = '';
    document.getElementById('wireframeUpload').value = '';
    
    currentFileData = null;
    currentUploadType = null;
}

// Save uploaded prototype
function saveUploadedPrototype() {
    const title = document.getElementById('uploadTitle').value.trim();
    const description = document.getElementById('uploadDescription').value.trim();
    const features = document.getElementById('uploadFeatures').value.trim();
    
    if (!title) {
        showNotification('Please enter a title for your prototype.', 'warning');
        return;
    }
    
    if (!description) {
        showNotification('Please add a description for your prototype.', 'warning');
        return;
    }
    
    if (!currentFileData) {
        showNotification('No file selected. Please upload an image first.', 'error');
        return;
    }
    
    const prototype = {
        id: Date.now(),
        title: title,
        description: description,
        keyFeatures: features,
        type: currentUploadType,
        imageData: currentFileData,
        timestamp: new Date().toISOString()
    };
    
    canvasData.step5.prototypes.push(prototype);
    savedPrototypes.push(prototype);
    
    displayPrototypes();
    saveDataToStorage();
    
    // Clear form and hide preview
    removePreview();
    
    showNotification('Prototype saved successfully!', 'success');
}


// Display saved prototypes
function displayPrototypes() {
    const container = document.getElementById('savedPrototypes');
    const noPrototypesMessage = document.getElementById('noPrototypesMessage');
    
    if (savedPrototypes.length === 0) {
        noPrototypesMessage.style.display = 'block';
        return;
    }
    
    noPrototypesMessage.style.display = 'none';
    container.innerHTML = '';
    
    savedPrototypes.forEach((prototype, index) => {
        const prototypeCard = document.createElement('div');
        prototypeCard.className = 'col-md-4 mb-3';
        prototypeCard.innerHTML = `
            <div class="card">
                <img src="${prototype.imageData}" class="card-img-top" alt="${prototype.title}" style="height: 200px; object-fit: contain; background-color: #f8f9fa;">
                <div class="card-body">
                    <h6 class="card-title">${prototype.title}</h6>
                    <p class="card-text small">${prototype.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-secondary">${prototype.type}</span>
                        <button class="btn btn-outline-danger btn-sm" onclick="deletePrototype(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(prototypeCard);
    });
}

// Delete prototype
function deletePrototype(index) {
    if (confirm('Are you sure you want to delete this prototype?')) {
        savedPrototypes.splice(index, 1);
        canvasData.step5.prototypes = savedPrototypes;
        displayPrototypes();
        saveDataToStorage();
        showNotification('Prototype deleted.', 'info');
    }
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
    const formFields = ['uploadTitle', 'uploadDescription', 'uploadFeatures'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', saveFormData);
        }
    });
    
}

// Populate form with saved data
function populateForm() {
    const step5Data = canvasData.step5;
    
    if (step5Data.prototypes) {
        savedPrototypes = step5Data.prototypes;
        displayPrototypes();
    }
    
}

// Save form data
function saveFormData() {
    canvasData.step5 = {
        ...canvasData.step5,
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
                        <h5 class="modal-title">Prototyping Basics</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3 text-center">
                            <h6>From Idea to Visual Concept</h6>
                            <p class="text-muted">Learn essential prototyping techniques to bring your ideas to life.</p>
                        </div>
                        
                        <!-- YouTube Video Embed -->
                        <div class="ratio ratio-16x9 mb-4">
                            <iframe 
                                src="https://www.youtube.com/embed/ULW9bgSYIrw" 
                                title="Prototyping Basics" 
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
    return true;
}

function goToPreviousStep() {
    saveFormData();
    window.location.href = 'step4.html';
}

function saveAndContinue() {
    if (validateForm()) {
        saveFormData();
        
        showNotification('Step 5 completed successfully! Moving to next step...', 'success');
        
        setTimeout(() => {
            // Here you would redirect to step 6
            console.log('Ready to move to Step 6: Plan Implementation');
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