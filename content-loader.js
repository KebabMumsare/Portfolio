//import { Carousel } from 'bootstrap';

// Content Management System for Portfolio - No Server Required
class ContentManager {
    

    // Constructor
    constructor() {
        this.projectsContainer = document.querySelector('.projects-grid');
        this.projects = [];
        this.init();
    }

    async init() {
        await this.scanForProjects();
        this.renderProjects();
    }

    async scanForProjects() {
        // Try to find projects by checking common folder names and patterns
        const possibleProjectNames = this.generateProjectNames();

        for (const projectName of possibleProjectNames) {
            const projectData = await this.loadProjectData(projectName);
            if (projectData) {
                this.projects.push(projectData);
            }
        }

        // If no projects found, show default
        if (this.projects.length === 0) {
            this.projects = this.getDefaultProjects();
            console.log("No projects found, showing default projects");
        }
    }

    generateProjectNames() {
        // Generate common project folder names to check
        const baseNames = [
            'my-project', 'portfolio-project', 'web-app', 'mobile-app',
            'game-project', 'design-project', 'api-project', 'fullstack-project',
            'frontend-project', 'backend-project', 'ui-project', 'ux-project'
        ];

        // Also check for numbered variations
        const numberedNames = [];
        for (let i = 1; i <= 20; i++) {
            numberedNames.push(`project-${i}`);
            numberedNames.push(`project${i}`);
            numberedNames.push(`app-${i}`);
            numberedNames.push(`app${i}`);
        }

        return [...baseNames, ...numberedNames];
    }

    async loadProjectData(projectFolder) {
        try {
            // Try to load the info.json file
            const infoPath = `./content/projects/${projectFolder}/info.json`;
            const response = await fetch(infoPath);

            if (!response.ok) {
                return null; // Project doesn't exist
            }

            const projectInfo = await response.json();

            // Try to load additional content files
            let screenshots = [];
            if (projectInfo.media && Array.isArray(projectInfo.media)) {
                screenshots = projectInfo.media.map(imageName => 
                    `./content/projects/${projectFolder}/media/${imageName}`
                );
            } else {
                // Fallback to single screenshot if no media array
                const screenshot = await this.checkFileExists(`./content/projects/${projectFolder}/media/screenshot.jpg`)
                    ? `./content/projects/${projectFolder}/media/screenshot.jpg`
                    : null;
                screenshots = screenshot ? [screenshot] : [];
            }
            console.log("Screenshots:", screenshots);
            return {
                ...projectInfo,
                screenshots: screenshots,
                folder: projectFolder
            };
        } catch (error) {
            console.error("Error loading project data:", error);
            return null; // Project doesn't exist or has errors
        }
    }

    async checkFileExists(filePath) {
        try {
            const response = await fetch(filePath, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    async loadTextFile(filePath) {
        try {
            const response = await fetch(filePath);
            if (response.ok) {
                return await response.text();
            }
        } catch (error) {
            return null;
        }
        return null;
    }

    renderProjects() {
        // Clear existing content
        this.projectsContainer.innerHTML = '';

        // Render each project
        this.projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            this.projectsContainer.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        
        // Create carousel if multiple screenshots exist
        let imageContent;
        if (project.screenshots && project.screenshots.length > 1) {
            imageContent = this.createImageCarousel(project.screenshots, project.title);
        } else if (project.screenshots && project.screenshots.length === 1) {
            imageContent = `<img src="${project.screenshots[0]}" alt="${project.title}" onerror="this.parentElement.innerHTML='<div class=\'image-placeholder\'><i class=\'fas fa-code\'></i><span>Project Screenshot</span></div>'">`;
        } else {
            imageContent = `<div class="image-placeholder project-image"><i class="fas fa-code"></i><span>Project Screenshot</span></div>`;
        }
    
        card.innerHTML = `
            <div class="project-image">
                ${imageContent}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.github ? `<a href="${project.github}" class="project-link" target="_blank"><i class="fab fa-github"></i> Code</a>` : ''}
                </div>
            </div>
        `;
    
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    
        return card;
    }
    
    createImageCarousel(images, title) {
        const carouselId = 'carousel-' + Math.random().toString(36).substr(2, 9);
        
        return `
            <div id="${carouselId}" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${images.map((img, index) => `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}">
                            <img src="${img}" class="d-block w-100" alt="${title} - Image ${index + 1}" 
                                 onerror="this.style.display='none'">
                        </div>
                    `).join('')}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        `;
    }

    getDefaultProjects() {
        return [
            {
                title: "Sample Project",
                description: "This is a sample project. Add your own projects by creating folders in the content/projects directory.",
                technologies: ["HTML", "CSS", "JavaScript"],
                screenshot: null,
                liveDemo: "#",
                github: "#"
            }
        ];
    }
    
}

// Initialize content manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContentManager();
});

// Add a manual refresh function for development
window.refreshProjects = () => {
    location.reload();
};
