// Innovation Canvas - Step 7: Canvas Summary

// Global variables
let currentStep = 7;
const totalSteps = 7;
let canvasData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    generateSummary();
    updateStats();
    updateMetaInformation();
    displayUploadedResources();
    setPrintDate();
});

// Load existing data from localStorage
function loadDataFromStorage() {
    const savedData = localStorage.getItem('innovationCanvasData');
    if (savedData) {
        try {
            canvasData = JSON.parse(savedData);
        } catch (error) {
            console.error('Error loading saved data:', error);
            canvasData = {};
        }
    }
}

// Generate summary content from all steps
function generateSummary() {
    // Problem Statement (Step 1)
    const problemElement = document.getElementById('summaryProblem');
    if (canvasData.step1?.problemStatement) {
        problemElement.innerHTML = `<p><strong>Problem:</strong> ${canvasData.step1.problemStatement}</p>`;
        if (canvasData.step1.problemDescription) {
            problemElement.innerHTML += `<p class="small">${canvasData.step1.problemDescription}</p>`;
        }
    }

    // Solution (Step 4 - Selected Solution)
    const solutionElement = document.getElementById('summarySolution');
    if (canvasData.step4?.selectedSolution !== null && canvasData.step3?.ideas) {
        const selectedIdea = canvasData.step3.ideas[canvasData.step4.selectedSolution];
        if (selectedIdea) {
            solutionElement.innerHTML = `
                <p><strong>${selectedIdea.title}</strong></p>
                <p class="small">${selectedIdea.content}</p>
            `;
            if (canvasData.step4.refinement) {
                solutionElement.innerHTML += `<p class="small"><strong>Implementation:</strong> ${canvasData.step4.refinement}</p>`;
            }
        }
    }

    // Key Metrics (Step 4 - Evaluation Scores)
    const metricsElement = document.getElementById('summaryMetrics');
    if (canvasData.step4?.selectedSolution !== null && canvasData.step4?.evaluations) {
        const solutionIndex = canvasData.step4.selectedSolution;
        const evaluation = canvasData.step4.evaluations[solutionIndex];
        
        if (evaluation) {
            metricsElement.innerHTML = `
                <div class="row text-center">
                    <div class="col-6 mb-2">
                        <strong>Feasibility:</strong> ${evaluation.feasibility || 0}/5
                    </div>
                    <div class="col-6 mb-2">
                        <strong>Impact:</strong> ${evaluation.impact || 0}/5
                    </div>
                    <div class="col-6 mb-2">
                        <strong>Resources:</strong> ${evaluation.resources || 0}/5
                    </div>
                    <div class="col-6 mb-2">
                        <strong>User Appeal:</strong> ${evaluation.userAppeal || 0}/5
                    </div>
                </div>
                <div class="text-center mt-2">
                    <strong class="text-success">Total Score: ${evaluation.total || 0}/20</strong>
                </div>
            `;
        }
    }

    // Target Users (Step 2)
    const usersElement = document.getElementById('summaryUsers');
    if (canvasData.step2?.primaryUsers) {
        let userContent = `<p><strong>Primary Users:</strong> ${canvasData.step2.primaryUsers}</p>`;
        if (canvasData.step2.keyNeeds) {
            userContent += `<p class="small"><strong>Key Needs:</strong> ${canvasData.step2.keyNeeds}</p>`;
        }
        if (canvasData.step2.biggestFrustration) {
            userContent += `<p class="small"><strong>Biggest Frustration:</strong> ${canvasData.step2.biggestFrustration}</p>`;
        }
        usersElement.innerHTML = userContent;
    }

    // Implementation (Step 6)
    const implementationElement = document.getElementById('summaryImplementation');
    if (canvasData.step6?.keyActivities) {
        let implContent = `<p class="small"><strong>Key Activities:</strong></p>`;
        implContent += `<p class="small">${canvasData.step6.keyActivities.split('\n').slice(0, 3).join(' • ')}</p>`;
        if (canvasData.step6.timeline) {
            implContent += `<p class="small"><strong>Timeline:</strong> ${canvasData.step6.timeline.split('\n')[0]}</p>`;
        }
        implementationElement.innerHTML = implContent;
    }

    // Resources (Step 6)
    const resourcesElement = document.getElementById('summaryResources');
    if (canvasData.step6?.keyResources) {
        let resourceContent = `<p class="small">${canvasData.step6.keyResources.split('\n').slice(0, 3).join(' • ')}</p>`;
        if (canvasData.step6.keyPartners) {
            resourceContent += `<p class="small"><strong>Partners:</strong> ${canvasData.step6.keyPartners.split('\n')[0]}</p>`;
        }
        resourcesElement.innerHTML = resourceContent;
    }
}

// Update statistics
function updateStats() {
    // Ideas Generated (Step 3)
    let ideasCount = 0;
    if (canvasData.step3?.ideas) {
        ideasCount = canvasData.step3.ideas.filter(idea => idea.content && idea.content.trim().length > 0).length;
    }
    document.getElementById('ideasGenerated').textContent = ideasCount;

    // Resources Uploaded (Step 5 + Step 6)
    let resourcesCount = 0;
    if (canvasData.step5?.prototypes) {
        resourcesCount += canvasData.step5.prototypes.length;
    }
    if (canvasData.step6?.uploadedFiles) {
        resourcesCount += canvasData.step6.uploadedFiles.length;
    }
    if (canvasData.step6?.wireframeLinks) {
        resourcesCount += canvasData.step6.wireframeLinks.length;
    }
    document.getElementById('resourcesUploaded').textContent = resourcesCount;
}

// Update meta information
function updateMetaInformation() {
    // Find earliest and latest timestamps
    let earliestDate = null;
    let latestDate = null;

    Object.keys(canvasData).forEach(stepKey => {
        const stepData = canvasData[stepKey];
        if (stepData.timestamp) {
            const date = new Date(stepData.timestamp);
            if (!earliestDate || date < earliestDate) {
                earliestDate = date;
            }
            if (!latestDate || date > latestDate) {
                latestDate = date;
            }
        }
    });

    if (earliestDate) {
        document.getElementById('creationDate').textContent = earliestDate.toLocaleDateString();
    }
    if (latestDate) {
        document.getElementById('lastUpdated').textContent = latestDate.toLocaleDateString();
    }
}

// Display uploaded resources
function displayUploadedResources() {
    console.log('displayUploadedResources called');
    console.log('Step 5 prototypes:', canvasData.step5?.prototypes?.length || 0);
    console.log('Step 6 uploadedFiles:', canvasData.step6?.uploadedFiles?.length || 0);
    console.log('Step 6 wireframeLinks:', canvasData.step6?.wireframeLinks?.length || 0);
    
    // Debug: Show actual prototype data
    if (canvasData.step5?.prototypes) {
        console.log('Step 5 prototypes details:', canvasData.step5.prototypes.map(p => ({
            title: p.title,
            type: p.type,
            id: p.id,
            timestamp: p.timestamp
        })));
    }
    
    // Debug: Show actual uploaded files data
    if (canvasData.step6?.uploadedFiles) {
        console.log('Step 6 uploadedFiles details:', canvasData.step6.uploadedFiles.map(f => ({
            name: f.name,
            type: f.type,
            id: f.id
        })));
    }
    
    let hasResources = false;
    const resourcesContainer = document.getElementById('allResourcesList');
    
    // Clear existing resources to prevent duplicates
    resourcesContainer.innerHTML = '';

    // Step 5 Prototypes
    if (canvasData.step5?.prototypes && canvasData.step5.prototypes.length > 0) {
        hasResources = true;
        // Remove duplicates based on ID (more reliable than imageData)
        const uniquePrototypes = canvasData.step5.prototypes.filter((prototype, index, self) => 
            index === self.findIndex(p => p.id === prototype.id)
        );
        
        console.log('After deduplication - unique prototypes:', uniquePrototypes.length);
        
        uniquePrototypes.forEach(prototype => {
            const resourceDiv = document.createElement('div');
            resourceDiv.className = 'col-md-3 col-sm-4 col-6 mb-3';
            resourceDiv.innerHTML = `
                <div class="text-center">
                    <img src="${prototype.imageData}" alt="${prototype.title}" class="uploaded-image mb-2" title="${prototype.title}">
                    <div class="small text-muted">${prototype.title}</div>
                    <div class="badge bg-primary">Prototype</div>
                </div>
            `;
            resourcesContainer.appendChild(resourceDiv);
        });
    }

    // Step 6 Wireframe Images
    if (canvasData.step6?.uploadedFiles && canvasData.step6.uploadedFiles.length > 0) {
        hasResources = true;
        // Remove duplicates based on ID if available, otherwise data and name
        const uniqueFiles = canvasData.step6.uploadedFiles.filter((file, index, self) => 
            index === self.findIndex(f => f.id ? f.id === file.id : (f.data === file.data && f.name === file.name))
        );
        
        uniqueFiles.forEach(file => {
            const resourceDiv = document.createElement('div');
            resourceDiv.className = 'col-md-3 col-sm-4 col-6 mb-3';
            resourceDiv.innerHTML = `
                <div class="text-center">
                    <img src="${file.data}" alt="${file.name}" class="uploaded-image mb-2" title="${file.name}">
                    <div class="small text-muted">${file.name}</div>
                    <div class="badge bg-success">Wireframe</div>
                </div>
            `;
            resourcesContainer.appendChild(resourceDiv);
        });
    }

    // Step 6 Wireframe Links - Display as cards on webpage but hide during PDF export
    if (canvasData.step6?.wireframeLinks && canvasData.step6.wireframeLinks.length > 0) {
        hasResources = true;
        // Remove duplicates based on URL
        const uniqueLinks = canvasData.step6.wireframeLinks.filter((link, index, self) => 
            index === self.findIndex(l => l.url === link.url)
        );
        
        uniqueLinks.forEach((link, linkIndex) => {
            const resourceDiv = document.createElement('div');
            resourceDiv.className = 'col-md-3 col-sm-4 col-6 mb-3 no-print'; // Add no-print class
            const displayUrl = link.url.length > 40 ? link.url.substring(0, 40) + '...' : link.url;
            resourceDiv.innerHTML = `
                <div class="text-center">
                    <div class="wireframe-link-display mb-2 p-3 border rounded bg-light">
                        <i class="fas fa-external-link-alt fa-2x text-info mb-2"></i>
                        <div class="small text-muted">${displayUrl}</div>
                    </div>
                    <a href="${link.url}" target="_blank" class="btn btn-sm btn-outline-info">
                        <i class="fas fa-external-link-alt me-1"></i>Open Link
                    </a>
                    <div class="badge bg-info mt-1">Wireframe Link</div>
                </div>
            `;
            resourcesContainer.appendChild(resourceDiv);
        });
    }

    if (hasResources) {
        document.getElementById('uploadedResourcesSection').style.display = 'block';
    } else {
        document.getElementById('uploadedResourcesSection').style.display = 'none';
    }
    
    console.log('displayUploadedResources completed');
}

// Set print date
function setPrintDate() {
    document.getElementById('printDate').textContent = new Date().toLocaleDateString();
}

// Export to PDF function
async function exportToPDF() {
    console.log('exportToPDF called');
    showNotification('Generating PDF... Please wait.', 'info');
    
    try {
        // Wait a moment to ensure page is fully rendered
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Check if main content exists
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) {
            throw new Error('Main content not found');
        }
        
        console.log('Main content found, proceeding with PDF generation');
        
        // Hide no-print elements and show print-only elements
        const noPrintElements = document.querySelectorAll('.no-print');
        const printOnlyElements = document.querySelectorAll('.print-only');
        
        noPrintElements.forEach(el => el.style.display = 'none');
        printOnlyElements.forEach(el => el.style.display = 'block');
        
        // Make sure uploaded resources are visible for PDF
        const uploadedResourcesSection = document.getElementById('uploadedResourcesSection');
        if (uploadedResourcesSection) {
            uploadedResourcesSection.style.display = 'block';
            console.log('Uploaded resources section made visible');
        }
        
        // Wait for any images to load
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('Starting html2canvas capture');
        
        // Use html2canvas to capture the content with better settings for images
        const canvas = await html2canvas(mainContent, {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            foreignObjectRendering: true,
            logging: true,
            height: mainContent.scrollHeight,
            width: mainContent.scrollWidth
        });
        
        console.log('html2canvas capture completed, canvas size:', canvas.width, 'x', canvas.height);
        
        // Restore visibility
        noPrintElements.forEach(el => el.style.display = '');
        printOnlyElements.forEach(el => el.style.display = 'none');
        
        // Check if canvas has content
        if (canvas.width === 0 || canvas.height === 0) {
            throw new Error('Canvas is empty');
        }
        
        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        console.log('PDF dimensions:', imgWidth, 'x', imgHeight);
        
        // Add the main content image
        if (imgHeight > 297) { // A4 height is 297mm
            const pageHeight = 297;
            const totalPages = Math.ceil(imgHeight / pageHeight);
            console.log('Creating multi-page PDF with', totalPages, 'pages');
            
            for (let i = 0; i < totalPages; i++) {
                if (i > 0) {
                    pdf.addPage();
                }
                
                const sourceY = (canvas.height * pageHeight * i) / imgWidth;
                const sourceHeight = Math.min(canvas.height * pageHeight / imgWidth, canvas.height - sourceY);
                
                // Create a temporary canvas for this page
                const pageCanvas = document.createElement('canvas');
                const pageCtx = pageCanvas.getContext('2d');
                pageCanvas.width = canvas.width;
                pageCanvas.height = sourceHeight;
                
                pageCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
                
                pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, pageHeight);
            }
        } else {
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
        }
        
        // Add wireframe hyperlinks after the uploaded resources section
        if (canvasData.step6?.wireframeLinks && canvasData.step6.wireframeLinks.length > 0) {
            console.log('Adding wireframe hyperlinks to PDF');
            
            // Find the uploaded resources section to position links after it
            const uploadedResourcesSection = document.getElementById('uploadedResourcesSection');
            
            if (uploadedResourcesSection && uploadedResourcesSection.style.display !== 'none') {
                const resourcesRect = uploadedResourcesSection.getBoundingClientRect();
                const mainContentRect = mainContent.getBoundingClientRect();
                
                // Calculate position after the uploaded resources section
                const relativeY = (resourcesRect.bottom - mainContentRect.top) / mainContentRect.height;
                let linkY = (relativeY * imgHeight) + 3; // 3mm below the resources section
                
                // Determine which page to add links to
                let targetPage = 0;
                if (imgHeight > 297) {
                    const pageHeight = 297;
                    targetPage = Math.floor(linkY / pageHeight);
                    linkY = linkY % pageHeight;
                    
                    // If we're too close to the bottom, move to next page
                    if (linkY > 280) {
                        targetPage++;
                        linkY = 20;
                    }
                }
                
                // Ensure we have the right page
                if (targetPage >= pdf.internal.getNumberOfPages()) {
                    pdf.addPage();
                }
                
                // Set the page for adding links
                const currentPage = pdf.internal.getCurrentPageInfo().pageNumber;
                if (targetPage + 1 !== currentPage) {
                    pdf.setPage(targetPage + 1);
                }
                
                // Add wireframe links section
                pdf.setFontSize(10);
                pdf.setTextColor(0, 0, 0);
                pdf.text('Wireframe Links:', 10, linkY);
                linkY += 5;
                
                pdf.setFontSize(8);
                pdf.setTextColor(0, 0, 255); // Blue for hyperlinks
                
                canvasData.step6.wireframeLinks.forEach((wireframeLink, index) => {
                    // Check if we need a new page
                    if (linkY > 285) {
                        pdf.addPage();
                        linkY = 20;
                    }
                    
                    // Add the clickable hyperlink
                    const linkText = `• ${wireframeLink.url}`;
                    pdf.text(linkText, 12, linkY);
                    
                    // Add clickable area
                    const textWidth = pdf.getTextWidth(linkText);
                    pdf.link(12, linkY - 3, textWidth, 4, {
                        url: wireframeLink.url
                    });
                    
                    console.log(`Added wireframe hyperlink: ${wireframeLink.url} at position (12, ${linkY})`);
                    linkY += 4; // Move to next line
                });
                
                // Restore original page if we changed it
                if (targetPage + 1 !== currentPage) {
                    pdf.setPage(currentPage);
                }
            }
        }
        
        // Generate filename with current date
        const filename = `Innovation_Canvas_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);
        
        console.log('PDF saved successfully');
        showNotification('PDF exported successfully!', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Error generating PDF: ' + error.message, 'error');
    }
}

// Debug version of export to PDF for bottom button
async function exportToPDFDebug() {
    console.log('exportToPDFDebug called from bottom button');
    
    // Scroll to top to ensure all content is visible
    window.scrollTo(0, 0);
    
    // Wait a moment for scroll to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Call the main export function
    return exportToPDF();
}

// Download as image
async function downloadAsImage() {
    showNotification('Generating image... Please wait.', 'info');
    
    try {
        // Hide no-print elements and show print-only elements
        const noPrintElements = document.querySelectorAll('.no-print');
        const printOnlyElements = document.querySelectorAll('.print-only');
        
        noPrintElements.forEach(el => el.style.display = 'none');
        printOnlyElements.forEach(el => el.style.display = 'block');
        
        // Make sure uploaded resources are visible for image
        const uploadedResourcesSection = document.getElementById('uploadedResourcesSection');
        if (uploadedResourcesSection) {
            uploadedResourcesSection.style.display = 'block';
        }
        
        const canvas = await html2canvas(document.querySelector('.main-content'), {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            foreignObjectRendering: true,
            logging: false,
            height: document.querySelector('.main-content').scrollHeight,
            width: document.querySelector('.main-content').scrollWidth
        });
        
        // Restore visibility
        noPrintElements.forEach(el => el.style.display = '');
        printOnlyElements.forEach(el => el.style.display = 'none');
        
        // Download image
        const link = document.createElement('a');
        link.download = `Innovation_Canvas_Summary_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        showNotification('Image downloaded successfully!', 'success');
    } catch (error) {
        console.error('Error generating image:', error);
        showNotification('Error generating image. Please try again.', 'error');
    }
}

// Navigation functions
function goToPreviousStep() {
    window.location.href = 'step6.html';
}

function goToCanvasPreview() {
    window.location.href = 'step6.html';
}

function completeSession() {
    showNotification('Session completed! Thank you for using Innovation Canvas.', 'success');
    setTimeout(() => {
        // Could redirect to a thank you page or dashboard
        console.log('Session completed');
    }, 2000);
}

function startNewCanvas() {
    if (confirm('Are you sure you want to start a new canvas? This will clear all current data.')) {
        localStorage.removeItem('innovationCanvasData');
        window.location.href = 'index.html';
    }
}

// Feedback functions
function rateExperience() {
    showNotification('Thank you for your feedback! Rating feature would be implemented here.', 'info');
}

function sendFeedback() {
    showNotification('Feedback form would be implemented here.', 'info');
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

// Console helper functions for development
if (typeof window !== 'undefined') {
    window.canvasDebug = {
        exportData: () => {
            const dataStr = JSON.stringify(canvasData, null, 2);
            console.log(dataStr);
        },
        viewData: () => console.log(canvasData)
    };
}