// Innovation Canvas - Step 4: Select Best Solution

// Global variables
let currentStep = 4;
const totalSteps = 7;
let previousIdeas = [];
let evaluationData = {};
let selectedSolutionId = null;

// Data storage object
const canvasData = {
    step1: {},
    step2: {},
    step3: {},
    step4: {
        evaluations: {},
        selectedSolution: null,
        refinement: '',
        successMetrics: '',
        timestamp: null
    },
    step5: {},
    step6: {},
    step7: {}
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    loadPreviousIdeas();
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

// Load ideas from Step 3
function loadPreviousIdeas() {
    if (canvasData.step3 && canvasData.step3.ideas && canvasData.step3.ideas.length > 0) {
        // Filter ideas that have content
        previousIdeas = canvasData.step3.ideas.filter(idea => 
            idea.content && idea.content.trim().length > 0
        );
        
        if (previousIdeas.length > 0) {
            displayPreviousIdeas();
            generateEvaluationTable();
        } else {
            showNoIdeasMessage();
        }
    } else {
        showNoIdeasMessage();
    }
}

// Display ideas from Step 3
function displayPreviousIdeas() {
    const container = document.getElementById('previousIdeas');
    container.innerHTML = '';
    
    previousIdeas.forEach((idea, index) => {
        const ideaCard = document.createElement('div');
        ideaCard.className = 'col-md-4 mb-3';
        ideaCard.innerHTML = `
            <div class="card idea-preview" data-idea-id="${index}">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h6 class="card-title text-primary mb-0">${idea.title}</h6>
                        <div class="idea-rating">
                            ${generateStarDisplay(idea.rating)}
                        </div>
                    </div>
                    <p class="card-text small">${idea.content}</p>
                </div>
            </div>
        `;
        container.appendChild(ideaCard);
    });
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

// Show no ideas message
function showNoIdeasMessage() {
    document.getElementById('noIdeasMessage').style.display = 'block';
    document.getElementById('previousIdeas').style.display = 'none';
}

// Generate evaluation table
function generateEvaluationTable() {
    const tableBody = document.getElementById('evaluationTableBody');
    tableBody.innerHTML = '';
    
    previousIdeas.forEach((idea, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-bold">${idea.title}</td>
            <td class="text-center">
                <select class="form-select form-select-sm evaluation-select" data-idea-id="${index}" data-criteria="feasibility">
                    <option value="0">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </td>
            <td class="text-center">
                <select class="form-select form-select-sm evaluation-select" data-idea-id="${index}" data-criteria="impact">
                    <option value="0">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </td>
            <td class="text-center">
                <select class="form-select form-select-sm evaluation-select" data-idea-id="${index}" data-criteria="resources">
                    <option value="0">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </td>
            <td class="text-center">
                <select class="form-select form-select-sm evaluation-select" data-idea-id="${index}" data-criteria="userAppeal">
                    <option value="0">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </td>
            <td class="text-center">
                <span class="fw-bold fs-5 total-score" id="total-${index}">0</span>
            </td>
        `;
        tableBody.appendChild(row);
    });
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
    
    // Evaluation select handlers
    document.addEventListener('change', function(e) {
        if (e.target.matches('.evaluation-select')) {
            updateEvaluation(e.target);
        }
    });
    
    // Auto-save on refinement and metrics changes
    const refinementTextarea = document.getElementById('solutionRefinement');
    const metricsTextarea = document.getElementById('successMetrics');
    
    if (refinementTextarea) {
        refinementTextarea.addEventListener('blur', saveFormData);
    }
    
    if (metricsTextarea) {
        metricsTextarea.addEventListener('blur', saveFormData);
    }
}

// Update evaluation and calculate total
function updateEvaluation(selectElement) {
    const ideaId = selectElement.getAttribute('data-idea-id');
    const criteria = selectElement.getAttribute('data-criteria');
    const value = parseInt(selectElement.value);
    
    // Initialize evaluation object for this idea if not exists
    if (!evaluationData[ideaId]) {
        evaluationData[ideaId] = {
            feasibility: 0,
            impact: 0,
            resources: 0,
            userAppeal: 0,
            total: 0
        };
    }
    
    // Update the specific criteria
    evaluationData[ideaId][criteria] = value;
    
    // Calculate total
    const total = evaluationData[ideaId].feasibility + 
                 evaluationData[ideaId].impact + 
                 evaluationData[ideaId].resources + 
                 evaluationData[ideaId].userAppeal;
    
    evaluationData[ideaId].total = total;
    
    // Update display
    document.getElementById(`total-${ideaId}`).textContent = total;
    
    // Automatically select best solution
    autoSelectBestSolution();
    
    // Save data
    saveEvaluationData();
}

// Automatically select the best solution based on highest score
function autoSelectBestSolution() {
    // Remove previous highlights
    document.querySelectorAll('.table-success').forEach(row => {
        row.classList.remove('table-success');
    });
    
    let maxScore = 0;
    let bestIdeaId = null;
    
    // Find highest score
    Object.keys(evaluationData).forEach(ideaId => {
        if (evaluationData[ideaId].total > maxScore) {
            maxScore = evaluationData[ideaId].total;
            bestIdeaId = ideaId;
        }
    });
    
    // Highlight and auto-select best option
    if (bestIdeaId !== null && maxScore > 0) {
        const bestRow = document.querySelector(`tr:has([data-idea-id="${bestIdeaId}"])`);
        if (bestRow) {
            bestRow.classList.add('table-success');
        }
        
        // Automatically select the best solution
        selectSolution(bestIdeaId);
    } else {
        // If no scores or all scores are 0, hide solution details
        document.getElementById('selectedSolution').querySelector('.text-center').style.display = 'block';
        document.getElementById('solutionDetails').style.display = 'none';
        selectedSolutionId = null;
    }
}

// Select a solution
function selectSolution(ideaId) {
    selectedSolutionId = ideaId;
    const selectedIdea = previousIdeas[ideaId];
    const evaluation = evaluationData[ideaId];
    
    // Hide selection prompt and show details
    document.getElementById('selectedSolution').querySelector('.text-center').style.display = 'none';
    document.getElementById('solutionDetails').style.display = 'block';
    
    // Populate selected solution details
    document.getElementById('selectedIdeaTitle').textContent = selectedIdea.title;
    document.getElementById('selectedIdeaDescription').textContent = selectedIdea.content;
    
    // Populate evaluation scores
    document.getElementById('selectedFeasibility').textContent = evaluation.feasibility;
    document.getElementById('selectedImpact').textContent = evaluation.impact;
    document.getElementById('selectedResources').textContent = evaluation.resources;
    document.getElementById('selectedUserAppeal').textContent = evaluation.userAppeal;
    document.getElementById('selectedTotalScore').textContent = evaluation.total;
    
    // Highlight selected row
    document.querySelectorAll('.table-primary').forEach(row => {
        row.classList.remove('table-primary');
    });
    
    const selectedRow = document.querySelector(`tr:has([data-idea-id="${ideaId}"])`);
    if (selectedRow) {
        selectedRow.classList.add('table-primary');
    }
    
    // Save selection
    saveFormData();
    
    showNotification('Solution selected successfully!', 'success');
}

// Populate form with saved data
function populateForm() {
    const step4Data = canvasData.step4;
    
    if (step4Data.evaluations) {
        evaluationData = step4Data.evaluations;
        
        // Populate evaluation selects
        Object.keys(evaluationData).forEach(ideaId => {
            const evaluation = evaluationData[ideaId];
            
            ['feasibility', 'impact', 'resources', 'userAppeal'].forEach(criteria => {
                const select = document.querySelector(`[data-idea-id="${ideaId}"][data-criteria="${criteria}"]`);
                if (select && evaluation[criteria]) {
                    select.value = evaluation[criteria];
                }
            });
            
            // Update total display
            const totalSpan = document.getElementById(`total-${ideaId}`);
            if (totalSpan) {
                totalSpan.textContent = evaluation.total || 0;
            }
        });
        
        autoSelectBestSolution();
    }
    
    if (step4Data.selectedSolution !== null) {
        selectSolution(step4Data.selectedSolution);
    }
    
    if (step4Data.refinement) {
        document.getElementById('solutionRefinement').value = step4Data.refinement;
    }
    
    if (step4Data.successMetrics) {
        document.getElementById('successMetrics').value = step4Data.successMetrics;
    }
}

// Save evaluation data
function saveEvaluationData() {
    canvasData.step4.evaluations = evaluationData;
    saveDataToStorage();
}

// Save form data
function saveFormData() {
    canvasData.step4 = {
        ...canvasData.step4,
        evaluations: evaluationData,
        selectedSolution: selectedSolutionId,
        refinement: document.getElementById('solutionRefinement').value.trim(),
        successMetrics: document.getElementById('successMetrics').value.trim(),
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
                        <h5 class="modal-title">Solution Evaluation Guide</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3 text-center">
                            <h6>Learn How to Choose the Right Idea</h6>
                            <p class="text-muted">Watch this video to understand effective solution evaluation techniques.</p>
                        </div>
                        
                        <!-- YouTube Video Embed -->
                        <div class="ratio ratio-16x9 mb-4">
                            <iframe 
                                src="https://www.youtube.com/embed/VWPDIUe7R08" 
                                title="Solution Evaluation Guide" 
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
    if (selectedSolutionId === null) {
        showNotification('Please select a solution before continuing.', 'warning');
        return false;
    }
    
    const refinement = document.getElementById('solutionRefinement').value.trim();
    if (refinement.length < 10) {
        showNotification('Please provide more details about how you plan to implement this solution.', 'warning');
        return false;
    }
    
    return true;
}

function goToPreviousStep() {
    saveFormData();
    window.location.href = 'step3.html';
}

function saveAndContinue() {
    if (validateForm()) {
        saveFormData();
        
        showNotification('Solution selected successfully! Moving to next step...', 'success');
        
        setTimeout(() => {
            window.location.href = 'step5.html';
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