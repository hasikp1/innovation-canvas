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

// Create PDF template-based export function matching template.html design
function createPDFTemplate() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // PDF dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    let currentY = margin;
    
    // Helper function to check if we need a new page
    function checkNewPage(requiredHeight) {
        if (currentY + requiredHeight > pageHeight - margin - 10) {
            pdf.addPage();
            currentY = margin;
            return true;
        }
        return false;
    }
    
    // Helper function to add the elegant gradient header banner
    function addHeaderBanner(stats) {
        // Create elegant gradient effect with multiple layers
        pdf.setFillColor(45, 55, 72); // Dark slate
        pdf.roundedRect(margin, currentY, contentWidth, 55, 4, 4, 'F');
        
        // Add gradient overlay effect
        pdf.setFillColor(59, 130, 246); // Blue overlay
        pdf.setGState(new pdf.GState({opacity: 0.8}));
        pdf.roundedRect(margin, currentY, contentWidth, 55, 4, 4, 'F');
        pdf.setGState(new pdf.GState({opacity: 1})); // Reset opacity
        
        // Title with elegant typography
        pdf.setFont("helvetica", 'bold');
        pdf.setFontSize(22);
        pdf.setTextColor(255, 255, 255);
        pdf.text('Innovation Canvas Complete', pageWidth/2, currentY + 18, { align: 'center' });
        
        // Subtitle with better spacing
        pdf.setFont("helvetica", 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(229, 231, 235); // Light gray
        pdf.text('Professional Project Summary & Analysis', pageWidth/2, currentY + 28, { align: 'center' });
        
        // Stats with enhanced design
        const statWidth = contentWidth / 3;
        stats.forEach((stat, index) => {
            const x = margin + (index * statWidth) + (statWidth / 2);
            
            // Stat background circle
            pdf.setFillColor(255, 255, 255);
            pdf.setGState(new pdf.GState({opacity: 0.15}));
            pdf.circle(x, currentY + 42, 12, 'F');
            pdf.setGState(new pdf.GState({opacity: 1}));
            
            // Stat value with better typography
            pdf.setFont("helvetica", 'bold');
            pdf.setFontSize(16);
            pdf.setTextColor(255, 255, 255);
            pdf.text(stat.value.toString(), x, currentY + 40, { align: 'center' });
            
            // Stat label with refined spacing
            pdf.setFont("helvetica", 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(203, 213, 225); // Lighter gray
            pdf.text(stat.label, x, currentY + 48, { align: 'center' });
        });
        
        currentY += 70;
    }
    
    // Helper function to add main content white background
    function addMainContentBackground() {
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(margin, currentY, contentWidth, pageHeight - currentY - margin - 10, 3, 3, 'F');
        
        // Add subtle border
        pdf.setDrawColor(224, 224, 224);
        pdf.setLineWidth(0.2);
        pdf.roundedRect(margin, currentY, contentWidth, pageHeight - currentY - margin - 10, 3, 3, 'S');
        
        currentY += 15; // Padding inside content area
    }
    
    // Helper function to add title bar with enhanced design
    function addTitleBar() {
        // Main title with better typography
        pdf.setFont("helvetica", 'bold');
        pdf.setFontSize(18);
        pdf.setTextColor(30, 41, 59); // Slate-800
        pdf.text('Innovation Project Overview', margin + 10, currentY);
        
        // Subtitle with modern styling
        pdf.setFont("helvetica", 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(100, 116, 139); // Slate-500
        pdf.text('Comprehensive analysis and strategic summary', margin + 10, currentY + 10);
        
        // Enhanced separator with gradient effect
        pdf.setDrawColor(226, 232, 240); // Slate-200
        pdf.setLineWidth(0.5);
        pdf.line(margin + 10, currentY + 18, contentWidth + margin - 10, currentY + 18);
        
        // Add accent line
        pdf.setDrawColor(59, 130, 246); // Blue-500
        pdf.setLineWidth(2);
        pdf.line(margin + 10, currentY + 19, margin + 60, currentY + 19);
        
        currentY += 30;
    }
    
    // Helper function to create 3-column grid layout
    function create3ColumnGrid() {
        const columnWidth = (contentWidth - 40) / 3; // 20px margins + 20px between columns
        const columnGap = 10;
        
        return {
            column1: { x: margin + 10, width: columnWidth },
            column2: { x: margin + 10 + columnWidth + columnGap, width: columnWidth },
            column3: { x: margin + 10 + (columnWidth + columnGap) * 2, width: columnWidth },
            startY: currentY
        };
    }
    
    // Helper function to add section in column with enhanced styling
    function addColumnSection(title, content, x, width, yPos) {
        let sectionY = yPos;
        
        // Add section background
        pdf.setFillColor(248, 250, 252); // Gray-50
        pdf.roundedRect(x - 3, sectionY - 5, width + 6, 8, 2, 2, 'F');
        
        // Section title with modern typography and colors
        pdf.setFont("helvetica", 'bold');
        pdf.setFontSize(9);
        
        // Color-coded section headers
        const sectionColors = {
            'PROBLEM': [239, 68, 68], // Red-500
            'TARGET USERS': [245, 158, 11], // Amber-500
            'SOLUTION': [34, 197, 94], // Green-500
            'IMPLEMENTATION': [168, 85, 247], // Purple-500
            'KEY METRICS': [59, 130, 246], // Blue-500
            'RESOURCES': [107, 114, 128] // Gray-500
        };
        
        const color = sectionColors[title.toUpperCase()] || [107, 114, 128];
        pdf.setTextColor(...color);
        pdf.text(title.toUpperCase(), x, sectionY);
        sectionY += 15;
        
        // Section content with improved typography
        pdf.setFont("helvetica", 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(51, 65, 85); // Slate-700
        
        if (Array.isArray(content)) {
            content.forEach((item, index) => {
                // Add bullet points for multiple items
                if (content.length > 1 && item.length < 100) {
                    pdf.setTextColor(156, 163, 175); // Gray-400
                    pdf.text('•', x, sectionY);
                    pdf.setTextColor(51, 65, 85); // Slate-700
                    
                    const lines = pdf.splitTextToSize(item, width - 10);
                    lines.forEach((line, lineIndex) => {
                        pdf.text(line, x + (lineIndex === 0 ? 6 : 0), sectionY);
                        sectionY += 4;
                    });
                } else {
                    const lines = pdf.splitTextToSize(item, width - 5);
                    lines.forEach(line => {
                        pdf.text(line, x, sectionY);
                        sectionY += 4;
                    });
                }
                sectionY += 3;
            });
        } else {
            const lines = pdf.splitTextToSize(content, width - 5);
            lines.forEach(line => {
                pdf.text(line, x, sectionY);
                sectionY += 4;
            });
        }
        
        return sectionY + 20; // Return next section start position
    }
    
    // Helper function to add vertical separator lines between columns
    function addColumnSeparators(grid) {
        pdf.setDrawColor(224, 224, 224);
        pdf.setLineWidth(0.2);
        
        // Line after column 1
        const line1X = grid.column1.x + grid.column1.width + 5;
        pdf.line(line1X, grid.startY, line1X, currentY);
        
        // Line after column 2
        const line2X = grid.column2.x + grid.column2.width + 5;
        pdf.line(line2X, grid.startY, line2X, currentY);
    }
    
    // Helper function to add uploaded resources section
    function addResourcesSection(images, links) {
        if (images.length === 0 && links.length === 0) return;
        
        checkNewPage(60);
        currentY += 25;
        
        // Section title with enhanced styling
        pdf.setFont("helvetica", 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(30, 41, 59); // Slate-800
        pdf.text('Project Resources', margin + 10, currentY);
        
        // Add decorative underline
        pdf.setDrawColor(99, 102, 241); // Indigo-500
        pdf.setLineWidth(2);
        pdf.line(margin + 10, currentY + 3, margin + 80, currentY + 3);
        
        currentY += 20;
        
        // Resources grid
        const resourceWidth = (contentWidth - 40) / 2; // 2 columns
        const resourceGap = 20;
        let resourceX = margin + 10;
        let resourceY = currentY;
        let col = 0;
        
        // Add images
        images.forEach((image, index) => {
            if (col >= 2) {
                col = 0;
                resourceX = margin + 10;
                resourceY += 60;
            }
            
            // Enhanced resource card background with shadow effect
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(resourceX, resourceY, resourceWidth, 50, 3, 3, 'F');
            pdf.setDrawColor(226, 232, 240); // Slate-200
            pdf.setLineWidth(0.5);
            pdf.roundedRect(resourceX, resourceY, resourceWidth, 50, 3, 3, 'S');
            
            try {
                // Add image
                pdf.addImage(image.data, 'JPEG', resourceX + 5, resourceY + 5, resourceWidth - 10, 30);
                
                // Add caption with better typography
                pdf.setFont("helvetica", 'normal');
                pdf.setFontSize(8);
                pdf.setTextColor(71, 85, 105); // Slate-600
                pdf.text(image.title, resourceX + resourceWidth/2, resourceY + 42, { align: 'center' });
                
                // Add modern tag with gradient colors
                const tagColor = image.type === 'prototype' ? [34, 197, 94] : [59, 130, 246]; // Green or Blue
                pdf.setFillColor(...tagColor);
                pdf.roundedRect(resourceX + resourceWidth/2 - 18, resourceY + 44, 36, 5, 2, 2, 'F');
                pdf.setFont("helvetica", 'bold');
                pdf.setFontSize(7);
                pdf.setTextColor(255, 255, 255);
                pdf.text(image.type === 'prototype' ? 'PROTOTYPE' : 'WIREFRAME', resourceX + resourceWidth/2, resourceY + 47, { align: 'center' });
                
            } catch (error) {
                pdf.setFontSize(8);
                pdf.setTextColor(150, 150, 150);
                pdf.text('Image could not be loaded', resourceX + resourceWidth/2, resourceY + 25, { align: 'center' });
            }
            
            resourceX += resourceWidth + resourceGap;
            col++;
        });
        
        // Add links
        links.forEach((link, index) => {
            if (col >= 2) {
                col = 0;
                resourceX = margin + 10;
                resourceY += 60;
            }
            
            // Enhanced link card background
            pdf.setFillColor(255, 255, 255);
            pdf.roundedRect(resourceX, resourceY, resourceWidth, 50, 3, 3, 'F');
            pdf.setDrawColor(226, 232, 240); // Slate-200
            pdf.setLineWidth(0.5);
            pdf.roundedRect(resourceX, resourceY, resourceWidth, 50, 3, 3, 'S');
            
            // Enhanced URL display with modern styling
            pdf.setFillColor(241, 245, 249); // Blue-50
            pdf.roundedRect(resourceX + 8, resourceY + 12, resourceWidth - 16, 10, 2, 2, 'F');
            
            const displayUrl = link.url.length > 25 ? link.url.substring(0, 25) + '...' : link.url;
            pdf.setFont("helvetica", 'normal');
            pdf.setFontSize(7);
            pdf.setTextColor(71, 85, 105); // Slate-600
            pdf.text(displayUrl, resourceX + resourceWidth/2, resourceY + 18, { align: 'center' });
            
            // Modern clickable link button
            pdf.setFillColor(59, 130, 246); // Blue-500
            pdf.roundedRect(resourceX + resourceWidth/2 - 20, resourceY + 28, 40, 8, 2, 2, 'F');
            pdf.setFont("helvetica", 'bold');
            pdf.setFontSize(7);
            pdf.setTextColor(255, 255, 255);
            pdf.text('OPEN LINK', resourceX + resourceWidth/2, resourceY + 33, { align: 'center' });
            pdf.link(resourceX + resourceWidth/2 - 20, resourceY + 28, 40, 8, { url: link.url });
            
            // Enhanced tag
            pdf.setFillColor(168, 85, 247); // Purple-500
            pdf.roundedRect(resourceX + resourceWidth/2 - 22, resourceY + 42, 44, 5, 2, 2, 'F');
            pdf.setFont("helvetica", 'bold');
            pdf.setFontSize(7);
            pdf.setTextColor(255, 255, 255);
            pdf.text('EXTERNAL LINK', resourceX + resourceWidth/2, resourceY + 45, { align: 'center' });
            
            resourceX += resourceWidth + resourceGap;
            col++;
        });
        
        currentY = resourceY + 70;
    }
    
    // Helper function to add footer details with enhanced design
    function addFooterDetails() {
        checkNewPage(50);
        currentY += 25;
        
        // Enhanced footer separator with gradient
        pdf.setDrawColor(226, 232, 240); // Slate-200
        pdf.setLineWidth(0.5);
        pdf.line(margin + 10, currentY, contentWidth + margin - 10, currentY);
        
        // Add accent line
        pdf.setDrawColor(99, 102, 241); // Indigo-500
        pdf.setLineWidth(2);
        pdf.line(margin + 10, currentY + 1, margin + 100, currentY + 1);
        
        currentY += 20;
        
        // Footer content in 3 columns
        const footerColumnWidth = (contentWidth - 40) / 3;
        
        // Canvas Details with modern styling
        pdf.setFont("helvetica", 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(30, 41, 59); // Slate-800
        pdf.text('Project Details', margin + 10, currentY);
        
        pdf.setFont("helvetica", 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139); // Slate-500
        pdf.text(`Created: ${new Date().toLocaleDateString()}`, margin + 10, currentY + 10);
        pdf.text(`Exported: ${new Date().toLocaleDateString()}`, margin + 10, currentY + 16);
        pdf.text('Framework: Innovation Canvas Pro', margin + 10, currentY + 22);
        
        // Project Status with modern design
        const statusX = margin + 10 + footerColumnWidth * 2;
        pdf.setFont("helvetica", 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(30, 41, 59); // Slate-800
        pdf.text('Completion Status', statusX, currentY);
        
        // Modern status badge
        pdf.setFillColor(34, 197, 94); // Green-500
        pdf.roundedRect(statusX, currentY + 6, 35, 8, 3, 3, 'F');
        pdf.setFont("helvetica", 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.text('COMPLETED', statusX + 17.5, currentY + 11, { align: 'center' });
        
        pdf.setFont("helvetica", 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139); // Slate-500
        pdf.text('All 7 sections finished', statusX, currentY + 20);
        
        // Modern progress bar
        pdf.setFillColor(241, 245, 249); // Blue-50
        pdf.roundedRect(statusX, currentY + 26, 60, 4, 2, 2, 'F');
        pdf.setFillColor(34, 197, 94); // Green-500
        pdf.roundedRect(statusX, currentY + 26, 60, 4, 2, 2, 'F'); // 100% complete
        
        currentY += 40;
    }
    
    return {
        pdf,
        addHeaderBanner,
        addMainContentBackground,
        addTitleBar,
        create3ColumnGrid,
        addColumnSection,
        addColumnSeparators,
        addResourcesSection,
        addFooterDetails,
        checkNewPage,
        getCurrentY: () => currentY,
        setCurrentY: (y) => { currentY = y; },
        addSpace: (space = 5) => { currentY += space; }
    };
}

// Enhanced PDF export function using template.html design
async function exportToPDF() {
    console.log('exportToPDF called - using template.html design approach');
    showNotification('Generating PDF... Please wait.', 'info');
    
    try {
        const template = createPDFTemplate();
        const { 
            pdf, 
            addHeaderBanner, 
            addMainContentBackground, 
            addTitleBar, 
            create3ColumnGrid, 
            addColumnSection, 
            addColumnSeparators,
            addResourcesSection,
            addFooterDetails
        } = template;
        
        // Step 1: Add header banner with stats
        const stats = [
            {
                value: document.getElementById('sectionsCompleted')?.textContent || '7',
                label: 'Sections Completed'
            },
            {
                value: document.getElementById('ideasGenerated')?.textContent || '0',
                label: 'Ideas Generated'
            },
            {
                value: document.getElementById('resourcesUploaded')?.textContent || '0',
                label: 'Resources Uploaded'
            }
        ];
        addHeaderBanner(stats);
        
        // Step 2: Add main content background
        addMainContentBackground();
        
        // Step 3: Add title bar
        addTitleBar();
        
        // Step 4: Create 3-column grid and add content
        const grid = create3ColumnGrid();
        let column1Y = grid.startY;
        let column2Y = grid.startY;
        let column3Y = grid.startY;
        
        // Column 1: Problem and Target Users
        // Problem section
        const problemContent = canvasData.step1?.problemStatement || 'No problem statement defined';
        column1Y = addColumnSection('Problem', [`Problem: ${problemContent}`], grid.column1.x, grid.column1.width, column1Y);
        
        // Target Users section
        const targetUsersContent = [];
        if (canvasData.step2?.primaryUsers) {
            targetUsersContent.push(`Primary Users: ${canvasData.step2.primaryUsers}`);
        }
        if (canvasData.step2?.keyNeeds) {
            targetUsersContent.push(`Key Needs: ${canvasData.step2.keyNeeds}`);
        }
        if (canvasData.step2?.biggestFrustration) {
            targetUsersContent.push(`Biggest Frustration: ${canvasData.step2.biggestFrustration}`);
        }
        if (targetUsersContent.length === 0) {
            targetUsersContent.push('No target users defined');
        }
        column1Y = addColumnSection('Target Users', targetUsersContent, grid.column1.x, grid.column1.width, column1Y);
        
        // Column 2: Solution and Implementation
        // Solution section
        const solutionContent = [];
        if (canvasData.step4?.selectedSolution !== null && canvasData.step3?.ideas) {
            const selectedIdea = canvasData.step3.ideas[canvasData.step4.selectedSolution];
            if (selectedIdea) {
                solutionContent.push(`${selectedIdea.title}`);
                solutionContent.push(selectedIdea.content);
                if (canvasData.step4.refinement) {
                    solutionContent.push(`Implementation: ${canvasData.step4.refinement}`);
                }
            }
        } else {
            solutionContent.push('No solution selected');
        }
        column2Y = addColumnSection('Solution', solutionContent, grid.column2.x, grid.column2.width, column2Y);
        
        // Implementation section
        const implementationContent = [];
        if (canvasData.step6?.keyActivities) {
            implementationContent.push(`Key Activities: ${canvasData.step6.keyActivities.split('\n').slice(0, 3).join(' • ')}`);
        }
        if (canvasData.step6?.timeline) {
            implementationContent.push(`Timeline: ${canvasData.step6.timeline.split('\n')[0]}`);
        }
        if (implementationContent.length === 0) {
            implementationContent.push('No implementation plan available');
        }
        column2Y = addColumnSection('Implementation', implementationContent, grid.column2.x, grid.column2.width, column2Y);
        
        // Column 3: Key Metrics and Resources
        // Key Metrics section
        const metricsContent = [];
        if (canvasData.step4?.selectedSolution !== null && canvasData.step4?.evaluations) {
            const solutionIndex = canvasData.step4.selectedSolution;
            const evaluation = canvasData.step4.evaluations[solutionIndex];
            
            if (evaluation) {
                metricsContent.push(`Feasibility: ${evaluation.feasibility || 0}/5`);
                metricsContent.push(`Impact: ${evaluation.impact || 0}/5`);
                metricsContent.push(`Resources: ${evaluation.resources || 0}/5`);
                metricsContent.push(`User Appeal: ${evaluation.userAppeal || 0}/5`);
                metricsContent.push(`Total Score: ${evaluation.total || 0}/20`);
            }
        } else {
            metricsContent.push('No evaluation scores available');
        }
        column3Y = addColumnSection('Key Metrics', metricsContent, grid.column3.x, grid.column3.width, column3Y);
        
        // Resources section
        const resourcesContent = [];
        if (canvasData.step6?.keyResources) {
            resourcesContent.push(canvasData.step6.keyResources.split('\n').slice(0, 3).join(' • '));
        }
        if (canvasData.step6?.keyPartners) {
            resourcesContent.push(`Partners: ${canvasData.step6.keyPartners.split('\n')[0]}`);
        }
        if (resourcesContent.length === 0) {
            resourcesContent.push('No resources identified');
        }
        column3Y = addColumnSection('Resources', resourcesContent, grid.column3.x, grid.column3.width, column3Y);
        
        // Update currentY to the tallest column
        template.setCurrentY(Math.max(column1Y, column2Y, column3Y));
        
        // Add column separators
        addColumnSeparators(grid);
        
        // Step 5: Add uploaded resources section
        let allImages = [];
        let allLinks = [];
        
        // Collect prototype images
        if (canvasData.step5?.prototypes && canvasData.step5.prototypes.length > 0) {
            canvasData.step5.prototypes.forEach(prototype => {
                if (prototype.imageData) {
                    allImages.push({
                        data: prototype.imageData,
                        title: prototype.title,
                        type: 'prototype'
                    });
                }
            });
        }
        
        // Collect wireframe images
        if (canvasData.step6?.uploadedFiles && canvasData.step6.uploadedFiles.length > 0) {
            canvasData.step6.uploadedFiles.forEach(file => {
                if (file.data) {
                    allImages.push({
                        data: file.data,
                        title: file.name,
                        type: 'wireframe'
                    });
                }
            });
        }
        
        // Collect wireframe links
        if (canvasData.step6?.wireframeLinks && canvasData.step6.wireframeLinks.length > 0) {
            allLinks = canvasData.step6.wireframeLinks;
        }
        
        addResourcesSection(allImages, allLinks);
        
        // Step 6: Add footer details
        addFooterDetails();
        
        // Generate filename and save
        const filename = `Innovation_Canvas_Summary_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);
        
        console.log('PDF generated successfully using template.html design');
        showNotification('PDF exported successfully with clean template design!', 'success');
        
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