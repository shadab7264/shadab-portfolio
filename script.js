/* ==========================================================================
   PREMIUM DIGITAL EXPERIENCE SCRIPT - SHADAB KARIM PORTFOLIO
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. DYNAMIC NAVIGATION & MOBILE NAV TOGGLE
    // ==========================================
    const mobileToggle = document.getElementById("mobile-toggle");
    const navLinksContainer = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-link");

    if (mobileToggle) {
        mobileToggle.addEventListener("click", () => {
            mobileToggle.classList.toggle("active");
            navLinksContainer.classList.toggle("mobile-active");
        });
    }

    // Smooth navigation active states & scroll observer
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            // Close mobile menu on select
            if (navLinksContainer.classList.contains("mobile-active")) {
                mobileToggle.classList.remove("active");
                navLinksContainer.classList.remove("mobile-active");
            }
        });
    });

    // Highlight nav link dynamically on scroll
    const sections = document.querySelectorAll("section");
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach(link => {
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    } else {
                        link.classList.remove("active");
                    }
                });
            }
        });
    }, {
        threshold: 0.25,
        rootMargin: "-100px 0px -20% 0px"
    });

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Update active nav link on initial load if hash is present
    if (window.location.hash) {
        const activeLink = Array.from(navLinks).find(link => link.getAttribute("href") === window.location.hash);
        if (activeLink) {
            navLinks.forEach(l => l.classList.remove("active"));
            activeLink.classList.add("active");
        }
    }

    // ==========================================
    // 2. LETTER-BY-LETTER TYPING EFFECT
    // ==========================================
    const roles = [
        "Full Stack Developer",
        "AI Builder",
        "DTU Student",
        "Problem Solver"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById("typing");
    const typeSpeed = 100;
    const eraseSpeed = 50;
    const waitTimeBeforeErase = 1800;

    function typeEffect() {
        const currentRole = roles[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let dynamicDelay = isDeleting ? eraseSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            dynamicDelay = waitTimeBeforeErase; // Wait at completion
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % roles.length;
            dynamicDelay = 300; // Small rest before writing next
        }

        setTimeout(typeEffect, dynamicDelay);
    }

    if (typingElement) {
        typeEffect();
    }

    // ==========================================
    // 3. INTERACTIVE 3D WEBGL WAVE BACKGROUND (THREE.JS)
    // ==========================================
    const canvas = document.getElementById("particle-canvas");
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();

        // Perspective Camera
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 90;
        camera.position.y = 45;
        camera.lookAt(0, 0, 0);

        // WebGL Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Geometry - Plane with grids
        const cols = 55;
        const rows = 55;
        const geometry = new THREE.PlaneGeometry(240, 240, cols, rows);

        // Material - Glowing Luxury Gold points
        const material = new THREE.PointsMaterial({
            color: 0xc5a880,
            size: 0.35,
            transparent: true,
            opacity: 0.18,
            sizeAttenuation: true
        });

        const mesh = new THREE.Points(geometry, material);
        mesh.rotation.x = -Math.PI / 2.2;
        scene.add(mesh);

        // Track mouse movement
        let mouseX = 0, mouseY = 0;
        let targetMouseX = 0, targetMouseY = 0;
        window.addEventListener("mousemove", (e) => {
            targetMouseX = (e.clientX - window.innerWidth / 2) * 0.05;
            targetMouseY = (e.clientY - window.innerHeight / 2) * 0.05;
        });

        // Track window resize
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Animation Loop
        const clock = new THREE.Clock();
        function animate3D() {
            requestAnimationFrame(animate3D);

            const time = clock.getElapsedTime();

            // Smooth mouse interpolation (easing)
            mouseX += (targetMouseX - mouseX) * 0.08;
            mouseY += (targetMouseY - mouseY) * 0.08;

            // Slowly rotate the mesh
            mesh.rotation.z = time * 0.006;

            // Undulate mesh grid heights (Z-axis)
            const position = geometry.attributes.position;
            for (let i = 0; i < position.count; i++) {
                const vx = position.getX(i);
                const vy = position.getY(i);

                // Base Wave Height (Simplex noise simulation via combined trig functions)
                let z = Math.sin(vx * 0.04 + time * 0.4) * Math.cos(vy * 0.04 + time * 0.4) * 7;
                z += Math.sin(vx * 0.1 - time * 0.25) * Math.cos(vy * 0.08) * 2;

                // Add mouse influence deformation
                const distToMouse = Math.sqrt((vx - mouseX * 2) * (vx - mouseX * 2) + (vy + mouseY * 2) * (vy + mouseY * 2));
                if (distToMouse < 60) {
                    const factor = (1 - distToMouse / 60) * 5;
                    z += Math.sin(distToMouse * 0.15 - time * 0.8) * factor;
                }

                position.setZ(i, z);
            }
            position.needsUpdate = true;

            // Adjust camera position slightly based on mouse
            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
            camera.position.y += ((45 - mouseY * 0.3) - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        }
        animate3D();
    }

    // ==========================================
    // 3.5. 3D TILT PHYSICS INTERACTION
    // ==========================================
    const tiltElements = document.querySelectorAll(".glow-card, .credit-card-3d");
    tiltElements.forEach(el => {
        el.addEventListener("mouseenter", () => {
            el.style.transition = "transform 0.1s ease"; // Quick tracking
        });

        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const x = e.clientX - rect.left - width / 2;
            const y = e.clientY - rect.top - height / 2;

            const rotateX = -(y / height) * 12;
            const rotateY = (x / width) * 12;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.025)`;
        });

        el.addEventListener("mouseleave", () => {
            el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"; // Smooth spring return
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    // ==========================================
    // 4. CUSTOM MAGNETIC CURSOR (REMOVED FOR SIMPLE & PREMIUM AESTHETIC)
    // ==========================================

    // ==========================================
    // 5. GLOW CARD CURSOR GLOW TRACKING
    // ==========================================
    const glowCards = document.querySelectorAll(".glow-card");
    glowCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // ==========================================
    // 6. SCROLL FADE-IN ENTRANCES
    // ==========================================
    const scrollRevealElements = document.querySelectorAll("section > *, .glow-card");
    scrollRevealElements.forEach(el => {
        el.classList.add("reveal-on-scroll");
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                // Stop observing once animated
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });
    // ==========================================
    // 7. SKYWARD CRM SANDBOX CONTROLLER
    // ==========================================

    // Sidebar navigation tabs
    const crmNavBtns = document.querySelectorAll(".crm-nav-btn");
    const crmPanels = document.querySelectorAll(".crm-panel");

    crmNavBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");

            // Toggle active buttons
            crmNavBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Toggle active panels
            crmPanels.forEach(p => {
                p.classList.remove("active");
                if (p.id === `crm-panel-${targetTab}`) {
                    p.classList.add("active");
                }
            });

            // Log navigation to console
            appendCrmLog(`SYSTEM: Navigated to panel [${targetTab.toUpperCase()}]`, "info");
        });
    });

    // Logging Terminal helper
    const logTerminal = document.getElementById("crm-log-terminal");

    function appendCrmLog(message, type = "info") {
        if (!logTerminal) return;

        const now = new Date();
        const timeStr = now.toTimeString().split(" ")[0];

        const line = document.createElement("div");
        line.className = `terminal-line log-${type}`;
        line.textContent = `[${timeStr}] ${message}`;

        logTerminal.appendChild(line);
        logTerminal.scrollTop = logTerminal.scrollHeight;
    }

    // Candidate Pipeline Advancement Logic
    const crmCandidatesBody = document.getElementById("crm-candidates-body");
    const candidateCountBadge = document.getElementById("candidate-count");

    if (crmCandidatesBody) {
        crmCandidatesBody.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-crm-action");
            if (!btn) return;

            const tr = btn.closest("tr");
            const candId = btn.getAttribute("data-id");
            const name = tr.querySelector(".candidate-name").textContent;
            const badge = tr.querySelector(".status-badge");

            let currentStatus = badge.textContent.trim();
            let nextStatus = "";
            let badgeClass = "";

            if (currentStatus === "Screening") {
                nextStatus = "Shortlisted";
                badgeClass = "status-badge progress-stage";
            } else if (currentStatus === "Shortlisted") {
                nextStatus = "Interviewing";
                badgeClass = "status-badge progress-stage";
            } else if (currentStatus === "Interviewing") {
                nextStatus = "Placed";
                badgeClass = "status-badge success-stage";
                btn.textContent = "Completed";
                btn.classList.add("disabled");
                btn.disabled = true;

                // Trigger placement celebration log
                appendCrmLog(`CELEBRATION: Candidate ${name} successfully PLACED!`, "success");
            }

            if (nextStatus) {
                badge.textContent = nextStatus;
                badge.className = badgeClass;
                appendCrmLog(`SUPABASE: Advanced candidate [${name}] to [${nextStatus.toUpperCase()}]`, "success");
            }
        });
    }

    // AI ATS Scanner Simulation
    const btnRunAts = document.getElementById("btn-run-ats");
    const atsPlaceholderState = document.getElementById("ats-placeholder-state");
    const atsScanningState = document.getElementById("ats-scanning-state");
    const atsReportState = document.getElementById("ats-report-state");

    const atsScanText = document.getElementById("ats-scan-text");
    const atsScanProgress = document.getElementById("ats-scan-progress");

    const reportName = document.getElementById("report-name");
    const reportRole = document.getElementById("report-role");
    const reportStatus = document.getElementById("report-status");
    const reportMissing = document.getElementById("report-missing");
    const atsScoreCircle = document.getElementById("ats-score-circle");
    const atsScoreText = document.getElementById("ats-score-text");

    const presetBtns = document.querySelectorAll(".preset-btn");
    let activePreset = "1";

    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            presetBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activePreset = btn.getAttribute("data-preset");

            const presetName = btn.textContent;
            appendCrmLog(`ATS: Preset loaded [${presetName}]`, "info");
        });
    });

    const presetData = {
        "1": {
            name: "Shadab Karim (DTU)",
            scores: {
                "Software Engineer": { score: 94, missing: "None (Excellent match)", status: "Strong Match" },
                "AI Engineer": { score: 91, missing: "None (Excellent match)", status: "Strong Match" },
                "Frontend Developer": { score: 88, missing: "TypeScript details", status: "Strong Match" },
                "Backend Developer": { score: 92, missing: "None (Excellent match)", status: "Strong Match" }
            }
        },
        "2": {
            name: "Junior Frontend Candidate",
            scores: {
                "Software Engineer": { score: 62, missing: "System Design, SQL Databases", status: "Average Match" },
                "AI Engineer": { score: 45, missing: "PyTorch, Linear Algebra, Python ML Libraries", status: "Weak Match" },
                "Frontend Developer": { score: 78, missing: "Redux State Management, TypeScript", status: "Good Match" },
                "Backend Developer": { score: 55, missing: "NodeJS framework depth, MongoDB indexes", status: "Weak Match" }
            }
        },
        "3": {
            name: "Generic Non-Technical Resume",
            scores: {
                "Software Engineer": { score: 28, missing: "Data Structures, Algorithms, Git, Languages", status: "Insufficient Match" },
                "AI Engineer": { score: 15, missing: "Calculus, Machine Learning theory, Python, Data frames", status: "Insufficient Match" },
                "Frontend Developer": { score: 32, missing: "HTML, CSS, React, JS fundamentals", status: "Insufficient Match" },
                "Backend Developer": { score: 22, missing: "SQL, REST APIs, HTTP protocols, Server architecture", status: "Insufficient Match" }
            }
        }
    };

    if (btnRunAts) {
        btnRunAts.addEventListener("click", () => {
            const role = document.getElementById("ats-role").value;
            const currentPreset = presetData[activePreset];
            const data = currentPreset.scores[role];

            // Log scan start
            appendCrmLog(`ATS: Initiating evaluation for candidate [${currentPreset.name}] target [${role}]`, "info");

            // Hide previous reports
            atsPlaceholderState.classList.add("hide-element");
            atsReportState.classList.add("hide-element");
            atsScanningState.classList.remove("hide-element");

            // Progress Bar simulation
            let progress = 0;
            atsScanProgress.style.width = "0%";
            atsScanText.textContent = "Reading resume token vectors...";

            const interval = setInterval(() => {
                progress += 20;
                atsScanProgress.style.width = `${progress}%`;

                if (progress === 40) {
                    atsScanText.textContent = "Embedding vectors with Gemini AI API...";
                } else if (progress === 80) {
                    atsScanText.textContent = "Matching against target role keyword constraints...";
                } else if (progress >= 100) {
                    clearInterval(interval);

                    // Render report
                    atsScanningState.classList.add("hide-element");
                    atsReportState.classList.remove("hide-element");

                    reportName.textContent = currentPreset.name;
                    reportRole.textContent = `Targeting: ${role}`;
                    reportStatus.textContent = data.status;
                    reportMissing.textContent = data.missing;

                    // Adjust color styling based on score
                    if (data.score >= 85) {
                        reportStatus.className = "detail-val text-green";
                    } else if (data.score >= 60) {
                        reportStatus.className = "detail-val";
                        reportStatus.style.color = "#ffa500";
                    } else {
                        reportStatus.className = "detail-val";
                        reportStatus.style.color = "#ff3366";
                    }

                    // Set SVG progress score circle
                    atsScoreCircle.style.strokeDasharray = `${data.score}, 100`;
                    atsScoreText.textContent = `${data.score}%`;

                    appendCrmLog(`GEMINI-AI: Computed ATS score of ${data.score}% for ${currentPreset.name}`, "success");
                }
            }, 350);
        });
    }

    // Dynamic background logs simulator
    const backgroundLogEvents = [
        "Visitor IP [192.168.1.4] checked placement dashboard metrics.",
        "SUPABASE: Synchronized student catalog metadata.",
        "GEMINI-AI: Prepared 5 custom interview queries for Priyal.",
        "DATABASE: Cached 12 active company drives for this cycle.",
        "SYSTEM: Synced audit ledger to cloud backups.",
        "SUPABASE: Processed e-commerce credentials request.",
        "GEMINI-AI: Parsed skill matrix comparison metrics.",
        "Visitor checked Arvelo project page details.",
        "SYSTEM: Periodic analytics refresh complete."
    ];

    setInterval(() => {
        if (!logTerminal) return;

        // Only append background log 30% of the time to avoid spamming the screen
        if (Math.random() > 0.4) {
            const index = Math.floor(Math.random() * backgroundLogEvents.length);
            const msg = backgroundLogEvents[index];
            appendCrmLog(msg, "info");
        }
    }, 8000);
});
