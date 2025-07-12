// Innovation Canvas - Step 3: Brainstorm Solutions

// Global variables
let currentStep = 3;
const totalSteps = 7;
let totalTimeSpent = 0;

// Data storage object
const canvasData = {
    step1: {},
    step2: {},
    step3: {
        ideas: [],
        promptResponses: {},
        timeSpent: 0,
        timestamp: null
    },
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
    updateStatistics();
    setupPromptTracking();
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
    const step3Data = canvasData.step3;
    
    // Populate ideas
    if (step3Data.ideas && step3Data.ideas.length > 0) {
        const container = document.getElementById('ideasContainer');
        const emptyState = document.getElementById('emptyState');
        
        // Clear default ideas and add saved ones
        container.innerHTML = '';
        emptyState.style.display = 'none';
        
        step3Data.ideas.forEach((idea, index) => {
            addIdeaCard(idea.title, idea.content, idea.rating);
        });
        
        updateStatistics();
    } else {
        // Keep default ideas and update their event listeners
        setupDefaultIdeaListeners();
        updateStatistics();
    }
    
    // Populate prompt responses
    if (step3Data.promptResponses) {
        const prompts = document.querySelectorAll('.prompt-question textarea');
        prompts.forEach((textarea, index) => {
            const key = `prompt_${index}`;
            if (step3Data.promptResponses[key]) {
                textarea.value = step3Data.promptResponses[key];
            }
        });
    }
    
    // Update time spent
    if (step3Data.timeSpent) {
        totalTimeSpent = step3Data.timeSpent;
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
    
    // Auto-save on input changes
    document.addEventListener('input', function(e) {
        if (e.target.matches('.prompt-question textarea')) {
            savePromptResponses();
            updateStatistics();
        }
        
        if (e.target.matches('.idea-card textarea')) {
            saveIdeas();
            updateStatistics();
        }
    });
    
    // Star rating click handlers
    document.addEventListener('click', function(e) {
        if (e.target.matches('.idea-rating i')) {
            updateIdeaRating(e.target);
        }
    });
}

// Setup prompt tracking
function setupPromptTracking() {
    const prompts = document.querySelectorAll('.prompt-question textarea');
    prompts.forEach((textarea) => {
        textarea.addEventListener('blur', function() {
            updateStatistics();
        });
    });
}


// Ideas management
function addNewIdea() {
    addIdeaCard('New Idea', '', 1);
    saveIdeas();
    updateStatistics();
}

// Setup event listeners for default idea cards
function setupDefaultIdeaListeners() {
    const titleInputs = document.querySelectorAll('.idea-title');
    const textareas = document.querySelectorAll('.idea-card textarea');
    
    titleInputs.forEach(input => {
        input.addEventListener('input', () => {
            saveIdeas();
            updateStatistics();
        });
    });
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', () => {
            saveIdeas();
            updateStatistics();
        });
    });
}

function addIdeaCard(title = 'New Idea', content = '', rating = 1) {
    const container = document.getElementById('ideasContainer');
    
    const ideaCard = document.createElement('div');
    ideaCard.className = 'col-md-4 mb-3';
    ideaCard.innerHTML = `
        <div class="idea-card p-3 border rounded" data-default="false">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <input type="text" class="form-control border-0 fw-bold text-primary idea-title" value="${title}" placeholder="Idea Title">
                <div class="idea-rating ms-2" data-fixed="false">
                    ${generateStarRating(rating)}
                </div>
            </div>
            <textarea class="form-control border-0" rows="3" placeholder="Describe your solution idea here...">${content}</textarea>
            <div class="mt-2">
                <button class="btn btn-outline-danger btn-sm" onclick="removeIdea(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(ideaCard);
    
    // Add event listeners
    const titleInput = ideaCard.querySelector('.idea-title');
    const textarea = ideaCard.querySelector('textarea');
    
    titleInput.addEventListener('input', () => {
        saveIdeas();
        updateStatistics();
    });
    
    textarea.addEventListener('input', () => {
        saveIdeas();
        updateStatistics();
    });
}

function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 3; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star text-warning" data-rating="' + i + '"></i>';
        } else {
            stars += '<i class="far fa-star text-muted" data-rating="' + i + '"></i>';
        }
    }
    return stars;
}

function updateIdeaRating(starElement) {
    const ratingContainer = starElement.parentElement;
    const isFixed = ratingContainer.getAttribute('data-fixed') === 'true';
    
    // Don't allow rating changes for fixed ratings (default ideas)
    if (isFixed) {
        return;
    }
    
    const rating = parseInt(starElement.getAttribute('data-rating'));
    
    // Update visual stars
    const stars = ratingContainer.querySelectorAll('i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star text-warning';
        } else {
            star.className = 'far fa-star text-muted';
        }
    });
    
    saveIdeas();
    updateStatistics();
}

function removeIdea(button) {
    const ideaCard = button.closest('.idea-card');
    const isDefault = ideaCard.getAttribute('data-default') === 'true';
    
    // Don't allow deletion of default ideas
    if (isDefault) {
        showNotification('Default idea cards cannot be deleted. You can edit their content instead.', 'warning');
        return;
    }
    
    if (confirm('Are you sure you want to remove this idea?')) {
        const ideaCardWrapper = button.closest('.col-md-4');
        ideaCardWrapper.remove();
        
        const container = document.getElementById('ideasContainer');
        const nonDefaultIdeas = container.querySelectorAll('[data-default="false"]');
        
        if (nonDefaultIdeas.length === 0) {
            // Only show empty state if there are no ideas at all (including defaults)
            const allIdeas = container.querySelectorAll('.idea-card');
            if (allIdeas.length === 3) { // Only the 3 default ideas remain
                // Don't show empty state, keep the default ideas visible
            }
        }
        
        saveIdeas();
        updateStatistics();
    }
}

// Save functions
function saveIdeas() {
    const ideas = [];
    const ideaCards = document.querySelectorAll('.idea-card');
    
    ideaCards.forEach(card => {
        const title = card.querySelector('.idea-title').value.trim();
        const content = card.querySelector('textarea').value.trim();
        const rating = card.querySelectorAll('.fas.fa-star').length;
        
        if (title || content) {
            ideas.push({
                title: title || 'Untitled Idea',
                content: content,
                rating: rating
            });
        }
    });
    
    canvasData.step3.ideas = ideas;
    canvasData.step3.timeSpent = totalTimeSpent;
    canvasData.step3.timestamp = new Date().toISOString();
    saveDataToStorage();
}

function savePromptResponses() {
    const responses = {};
    const prompts = document.querySelectorAll('.prompt-question textarea');
    
    prompts.forEach((textarea, index) => {
        responses[`prompt_${index}`] = textarea.value.trim();
    });
    
    canvasData.step3.promptResponses = responses;
    saveDataToStorage();
}

// Statistics and achievements
function updateStatistics() {
    // Update idea count - only count ideas with content
    let ideaCount = 0;
    const ideaCards = document.querySelectorAll('.idea-card');
    
    ideaCards.forEach(card => {
        const textarea = card.querySelector('textarea');
        if (textarea && textarea.value.trim().length > 0) {
            ideaCount++;
        }
    });
    
    document.getElementById('ideaCount').textContent = ideaCount;
}

// Validation and navigation
function validateForm() {
    const ideas = document.querySelectorAll('.idea-card');
    
    if (ideas.length === 0) {
        showNotification('Please add at least one solution idea before continuing.', 'warning');
        return false;
    }
    
    let hasContent = false;
    ideas.forEach(card => {
        const content = card.querySelector('textarea').value.trim();
        if (content.length > 0) {
            hasContent = true;
        }
    });
    
    if (!hasContent) {
        showNotification('Please describe at least one of your solution ideas.', 'warning');
        return false;
    }
    
    return true;
}

function goToPreviousStep() {
    saveIdeas();
    savePromptResponses();
    window.location.href = 'step2.html';
}

function saveAndContinue() {
    if (validateForm()) {
        saveIdeas();
        savePromptResponses();
        
        showNotification('Solutions brainstormed successfully! Moving to next step...', 'success');
        
        setTimeout(() => {
            window.location.href = 'step4.html';
        }, 1500);
    }
}

// Show video modal
function showVideoModal() {
    const modalHTML = `
        <div class="modal fade" id="videoModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Brainstorming Techniques</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3 text-center">
                            <h6>Learn Effective Ideation Methods</h6>
                            <p class="text-muted">Watch this video to discover powerful brainstorming techniques and creative thinking strategies.</p>
                        </div>
                        
                        <!-- YouTube Video Embed -->
                        <div class="ratio ratio-16x9 mb-4">
                            <iframe 
                                src="https://www.youtube.com/embed/YXZamW4-Ysk" 
                                title="Brainstorming Techniques" 
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