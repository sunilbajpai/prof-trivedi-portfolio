/* ==========================================================================
   INTERACTION ENGINE — PROF. PRAJAPATI TRIVEDI PORTFOLIO
   ========================================================================== */

// ===== GLOBAL CONFIGURATION =====
const CONFIG = {
  // Toggle between 'simulation' and 'live' mode for contact form submission
  formMode: 'simulation', // Options: 'simulation' or 'live'
  
  // Endpoint URL for live submissions (e.g. Web3Forms, Formspree, or your custom server)
  // For Web3Forms, use: 'https://api.web3forms.com/submit'
  // For Formspree, use: 'https://formspree.io/f/YOUR_FORM_ID'
  formEndpoint: 'https://api.web3forms.com/submit',
  
  // Access Key / ID (if using a service like Web3Forms, paste your access key here)
  formAccessKey: 'YOUR_ACCESS_KEY_HERE',
  
  // The email address to receive notifications (if supported by backend configuration)
  notificationEmail: 'contact@prajapatitrivedi.com'
};

document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. THEME MANAGER =====
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = themeToggleBtn.querySelector('i');
  
  // Set default theme from localStorage or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggleBtn.style.color = '#F59E0B'; // Gold Sun
    } else {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggleBtn.style.color = ''; // Reset
    }
  }

  // ===== 2. SCROLLED HEADER EFFECT =====
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ===== 3. MOBILE NAV DRAWER TOGGLING =====
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavLinks = mobileNavDrawer.querySelectorAll('ul li a');

  function openMobileNav() {
    mobileNavDrawer.classList.add('active');
    mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop scroll
  }

  function closeMobileNav() {
    mobileNavDrawer.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Resume scroll
  }

  mobileToggle.addEventListener('click', openMobileNav);
  mobileNavClose.addEventListener('click', closeMobileNav);
  mobileNavOverlay.addEventListener('click', closeMobileNav);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });


  // ===== 4. HERO CAROUSEL ENGINE =====
  const slides = document.querySelectorAll('.hero-banner img');
  const dots = document.querySelectorAll('.carousel-dot');
  const caption = document.getElementById('carouselCaption');
  let currentSlide = 0;
  let autoplayInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Smooth caption crossfade
    caption.style.opacity = '0';
    caption.style.transform = 'translateY(10px)';
    setTimeout(() => {
      caption.textContent = slides[currentSlide].dataset.caption;
      caption.style.opacity = '1';
      caption.style.transform = 'translateY(0)';
    }, 400);
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, 6000);
  }

  function stopAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
  }

  // Dot Navigation Click Handler
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(parseInt(dot.dataset.slide));
      startAutoplay();
    });
  });

  // Mobile Swipe Gestures on Hero
  let touchStartX = 0;
  let touchEndX = 0;
  const heroSection = document.getElementById('hero');

  heroSection.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  heroSection.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    if (touchStartX - touchEndX > threshold) {
      // Swipe Left -> Next
      stopAutoplay();
      nextSlide();
      startAutoplay();
    } else if (touchEndX - touchStartX > threshold) {
      // Swipe Right -> Prev
      stopAutoplay();
      prevSlide();
      startAutoplay();
    }
  }

  // Start Autoplay Loop
  startAutoplay();


  // ===== 5. SCROLL-REVEAL ENGINE =====
  const revealElements = document.querySelectorAll('.reveal-element');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed to keep layout performant
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ===== 6. ANIME COUNTER FOR STATS BAR =====
  const statsSection = document.querySelector('.stats-grid');
  const statNumbers = document.querySelectorAll('.stat-number');
  let counterStarted = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counterStarted) {
        counterStarted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  function animateCounters() {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.dataset.count);
      const duration = 2000; // 2 seconds total animation time
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Quad ease-out equation for smooth decelerating counter
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easeProgress * target);
        
        // Append '+' to matches that represent higher ranges
        if (target === 50 || target === 40 || target === 336) {
          stat.textContent = `${currentValue}+`;
        } else {
          stat.textContent = currentValue;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = (target === 50 || target === 40 || target === 336) ? `${target}+` : target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }


  // ===== 7. PUBLICATIONS FILTER & LIVE SEARCH =====
  const searchInput = document.getElementById('pub-search');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const pubCards = document.querySelectorAll('.pub-card');

  function filterPublications() {
    const searchQuery = searchInput.value.toLowerCase().trim();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

    pubCards.forEach(card => {
      const cardType = card.dataset.type;
      const title = card.querySelector('h4').textContent.toLowerCase();
      const publisher = card.querySelector('.pub-publisher').textContent.toLowerCase();
      const year = card.querySelector('.pub-year').textContent.toLowerCase();
      
      const matchesSearch = title.includes(searchQuery) || publisher.includes(searchQuery) || year.includes(searchQuery);
      const matchesFilter = activeFilter === 'all' || cardType === activeFilter;

      if (matchesSearch && matchesFilter) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px) scale(0.95)';
        // Set display to none after fade animation
        setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  }

  // Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', filterPublications);
  }

  // Filter Buttons Click
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterPublications();
    });
  });


  // ===== 8. TIMELINE DETAIL DRAWER DATABASE & LOGIC =====
  const milestoneDetails = {
    "1974": {
      year: "1974 – 1987",
      title: "Lecturer in Economics, St. Stephen's College",
      desc: `
        <p>Began his academic journey at St. Stephen's College, Delhi, widely considered one of the premium liberal arts colleges in India. As the youngest appointed lecturer in economics, he built the pedagogical foundation that defined his subsequent career.</p>
        <h5>Key Contributions & Achievements</h5>
        <ul>
          <li>Taught advanced core courses in Applied Microeconomics, Mathematical Economics, and Welfare Theory.</li>
          <li>Advised and mentored dozens of students who subsequently went on to occupy critical policy leadership positions globally.</li>
          <li>Layed early theoretical frameworks bridging academic economics with the execution dynamics of public administration.</li>
        </ul>
      `
    },
    "1985": {
      year: "1985",
      title: "Ph.D. in Economics, Boston University",
      desc: `
        <p>Completed his rigorous doctoral research at Boston University in the United States, specializing in public sector industrial economics and applied microeconomics.</p>
        <h5>Research Core & Influence</h5>
        <ul>
          <li><strong>Doctoral Dissertation:</strong> Focused on performance evaluation and policy modeling for public enterprises in developing nations.</li>
          <li>Developed complex quantitative systems to separate administrative effort from external market factors.</li>
          <li>Collaborated with leading international experts on development economics and privatization policies.</li>
        </ul>
      `
    },
    "1987": {
      year: "1987 – 1992",
      title: "STC Chair Professor, IIM Calcutta",
      desc: `
        <p>Became the youngest Chaired Tenured Professor in the history of the Indian Institute of Management Calcutta, directing the prestigious Centre for Public Enterprise Management.</p>
        <h5>Academic Leadership</h5>
        <ul>
          <li>Directed comprehensive research initiatives analyzing the efficiency of state-owned enterprises (SOEs).</li>
          <li>Authored foundational books on the "Memorandum of Understanding" (MOU) performance model.</li>
          <li>Led executive seminars advising board members and managing directors of public corporations on governance disinvestments.</li>
        </ul>
      `
    },
    "1992": {
      year: "1992 – 1994",
      title: "Economic Adviser, Government of India",
      desc: `
        <p>Served as Economic Adviser to the Government of India during a historic phase of market liberalization, privatization, and macroeconomic deregulation.</p>
        <h5>Policy Implementation & Advisory</h5>
        <ul>
          <li>Drafted national disinvestments guidelines and policy proposals for administrative restructuring.</li>
          <li>Advised senior cabinet officials, the Ministry of Finance, and state boards on the modernization of national infrastructure companies.</li>
          <li>Helped develop long-range structural reform plans to transition India to a highly competitive, market-driven economy.</li>
        </ul>
      `
    },
    "1995": {
      year: "1995 – 2009",
      title: "Senior Economist, World Bank",
      desc: `
        <p>Devoted 14 years as a Senior Economist at the World Bank headquarters in Washington, DC, managing global governance, administrative reform, and privatization initiatives.</p>
        <h5>Global Operations & Advisory</h5>
        <ul>
          <li>Led public enterprise restructuring and privatization projects across over 30 countries in Africa, East Asia, and Latin America.</li>
          <li>Author and chief architect of the World Bank's unified guidelines on public sector performance contracting.</li>
          <li>Coordinated international panels and advised ministers on regulatory design, structural reforms, and capacity-building frameworks.</li>
        </ul>
      `
    },
    "2009": {
      year: "2009 – 2014",
      title: "Secretary, Performance Management (Cabinet Secretariat)",
      desc: `
        <p>Served as the first-ever Secretary of the Performance Management Division in the Cabinet Secretariat, Prime Minister's Office, designing and enforcing India's whole-of-government performance system.</p>
        <h5>Whole-of-Government Innovation</h5>
        <ul>
          <li>Designed and implemented the historic <strong>Results-Framework Document (RFD)</strong> system, evaluating performance across 80+ central government departments and ministries.</li>
          <li>Served as Chairman of the <strong>National Authority for the Chemical Weapons Convention (NACWC)</strong>, ensuring compliance with international treaties.</li>
          <li>Shaped the Performance Related Pay (PRP) architecture adopted in the 7th Central Pay Commission report.</li>
        </ul>
      `
    },
    "2014": {
      year: "2014 – Present",
      title: "Special Envoy & Distinguished Global Faculty",
      desc: `
        <p>Serves in multiple prominent global roles, actively bridging the gap between national government execution, global policy design, and academic training.</p>
        <h5>Current Appointments & Leadership</h5>
        <ul>
          <li><strong>Commonwealth Special Envoy:</strong> Advises the Commonwealth Secretary-General and 56 member countries on modern public administration mechanisms to execute the UN Sustainable Development Goals (SDGs).</li>
          <li><strong>Harvard Kennedy School:</strong> Visiting Economics Faculty, teaching applied policy analysis and institutional monitoring.</li>
          <li><strong>MDI Gurgaon:</strong> Distinguished Professor, conducting advanced research on public management models.</li>
          <li><strong>IBM Center for the Business of Government:</strong> Visiting International Fellow, producing cutting-edge monographs for public sector practitioners.</li>
        </ul>
      `
    }
  };

  const timelineCards = document.querySelectorAll('.timeline-content');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const milestoneDrawer = document.getElementById('milestone-drawer');
  const drawerCloseBtn = document.getElementById('drawer-close');
  
  const drawerYear = document.getElementById('drawer-year');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerContent = document.getElementById('drawer-content');

  function openDrawer(milestoneKey) {
    const detail = milestoneDetails[milestoneKey];
    if (!detail) return;

    drawerYear.textContent = detail.year;
    drawerTitle.textContent = detail.title;
    drawerContent.innerHTML = detail.desc;

    milestoneDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent main page scrolling
  }

  function closeDrawer() {
    milestoneDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Resume scrolling
  }

  // Click handler on timeline elements
  timelineCards.forEach(card => {
    card.addEventListener('click', () => {
      const milestone = card.dataset.milestone;
      openDrawer(milestone);
    });
  });

  drawerCloseBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeMobileNav();
      closeBookingModal();
    }
  });


  // ===== 9. INTERACTIVE BOOKING WIZARD LOGIC =====
  const bookingOverlay = document.getElementById('booking-modal-overlay');
  const bookingCloseBtn = document.getElementById('booking-close');
  const openBookingBtn = document.getElementById('open-booking-btn');
  const heroContactBtn = document.getElementById('hero-contact-btn');
  
  const wizardForm = document.getElementById('consultation-form');
  const wizardSteps = document.querySelectorAll('.wizard-step');
  const wizardProgressBar = document.getElementById('wizard-progress-bar');
  const wizardSubtitle = document.getElementById('wizard-subtitle');
  
  const prevBtn = document.getElementById('prev-step');
  const nextBtn = document.getElementById('next-step');
  const wizardFooter = document.getElementById('wizard-footer');

  let currentStep = 1;

  function openBookingModal() {
    resetWizard();
    bookingOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBookingModal() {
    bookingOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openBookingBtn) openBookingBtn.addEventListener('click', openBookingModal);
  if (heroContactBtn) heroContactBtn.addEventListener('click', openBookingModal);
  bookingCloseBtn.addEventListener('click', closeBookingModal);
  
  // Close booking when clicking overlay backdrop
  bookingOverlay.addEventListener('click', (e) => {
    if (e.target === bookingOverlay) {
      closeBookingModal();
    }
  });

  // Step 1 Option Card Select
  const optionCards = document.querySelectorAll('.option-card');
  const hiddenInquiryInput = document.getElementById('inquiry-type');

  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      optionCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      hiddenInquiryInput.value = card.dataset.value;
      // Auto advance to next step once option is picked for fluid UX
      setTimeout(goForward, 300);
    });
  });

  function updateWizardUI() {
    // Show active step
    wizardSteps.forEach(step => {
      step.classList.remove('active');
      if (parseInt(step.dataset.step) === currentStep) {
        step.classList.add('active');
      }
    });

    // Update Progress Bar
    const progressPercent = (currentStep / 3) * 100;
    wizardProgressBar.style.width = `${progressPercent}%`;

    // Update Header Details
    if (currentStep === 1) {
      wizardSubtitle.textContent = "Step 1 of 3: Select Inquiry Type";
      prevBtn.style.opacity = '0';
      prevBtn.style.pointerEvents = 'none';
      nextBtn.textContent = 'Continue';
    } else if (currentStep === 2) {
      wizardSubtitle.textContent = "Step 2 of 3: Contact Details";
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'all';
      nextBtn.textContent = 'Continue';
    } else if (currentStep === 3) {
      wizardSubtitle.textContent = "Step 3 of 3: Project Requirements";
      prevBtn.style.opacity = '1';
      prevBtn.style.pointerEvents = 'all';
      nextBtn.textContent = 'Submit Request';
    } else if (currentStep === 4) {
      // Success State
      wizardSubtitle.textContent = "Inquiry Received";
      wizardFooter.style.display = 'none'; // Hide buttons
      wizardProgressBar.style.width = '100%';
    }
  }

  function validateStep(stepNum) {
    if (stepNum === 1) {
      if (!hiddenInquiryInput.value) {
        alert("Please select an inquiry type to continue.");
        return false;
      }
      return true;
    }
    
    // Antivirus-safe native browser validation to avoid phishing heuristics
    const stepContainer = wizardForm.querySelector(`.wizard-step[data-step="${stepNum}"]`);
    if (!stepContainer) return true;
    
    const fields = stepContainer.querySelectorAll('input, textarea');
    let allValid = true;
    
    fields.forEach(field => {
      if (!field.checkValidity()) {
        field.reportValidity();
        allValid = false;
      }
    });
    
    return allValid;
  }

  function submitForm() {
    // Show a premium loading state
    const originalText = nextBtn.textContent;
    nextBtn.textContent = 'Submitting...';
    nextBtn.disabled = true;

    if (CONFIG.formMode === 'live') {
      // Configure native form post
      wizardForm.action = CONFIG.formEndpoint;
      wizardForm.method = 'POST';
      
      // Inject access key for Web3Forms/Formspree if configured
      if (CONFIG.formAccessKey) {
        let keyInput = document.getElementById('web3forms-access-key');
        if (!keyInput) {
          keyInput = document.createElement('input');
          keyInput.type = 'hidden';
          keyInput.name = 'access_key';
          keyInput.id = 'web3forms-access-key';
          wizardForm.appendChild(keyInput);
        }
        keyInput.value = CONFIG.formAccessKey;
      }
      
      // Submit natively. The browser redirects to Netlify or Web3Forms success page.
      // This is 100% compliant with antivirus rules as it's a standard web submit!
      wizardForm.submit();
    } else {
      // Simulation Mode (Default)
      // Wait for a realistic 800ms latency to convey premium quality
      setTimeout(() => {
        currentStep = 4;
        updateWizardUI();
        nextBtn.textContent = originalText;
        nextBtn.disabled = false;
        console.log("Simulation Submit: Success!");
      }, 800);
    }
  }

  function goForward() {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        currentStep++;
        updateWizardUI();
      } else if (currentStep === 3) {
        submitForm();
      }
    }
  }

  function goBackward() {
    if (currentStep > 1) {
      currentStep--;
      updateWizardUI();
    }
  }

  nextBtn.addEventListener('click', goForward);
  prevBtn.addEventListener('click', goBackward);

  function resetWizard() {
    currentStep = 1;
    hiddenInquiryInput.value = "";
    optionCards.forEach(c => c.classList.remove('selected'));
    wizardForm.reset();
    wizardFooter.style.display = 'flex';
    updateWizardUI();
  }

  // ===== 10. GPM ACADEMY / MASTERCLASS ENGINE =====
  const GPM_SESSIONS = [
    {
      id: 1,
      title: "A Toolkit for Practitioners",
      embedUrl: "https://drive.google.com/file/d/1OBC6t2ho2peyFLV_Y9kuBD8WeJP9_4eH/preview",
      description: "An essential primer for governance practitioners on using structural tools and frameworks to optimize public service delivery.",
      takeaways: [
        "Introduction to whole-of-government GPM tools.",
        "Bridging the gap between high-level policy and real-world results.",
        "Establishing objective metrics for sustainable accountability."
      ]
    },
    {
      id: 2,
      title: "The Solutions",
      embedUrl: "https://drive.google.com/file/d/1NqSNtaBwcJtnKW1Vt5R1dpg0xtvCwb6B/preview",
      description: "Exploring programmatic solutions to address systemic administrative bottlenecks and improve state capacity.",
      takeaways: [
        "Identifying roots of bureaucratic inertia and delivery failure.",
        "Designing performance incentive loops for government departments.",
        "Operationalizing monitoring systems that drive organizational reform."
      ]
    },
    {
      id: 3,
      title: "What Gets Measured Gets Done",
      embedUrl: "https://drive.google.com/file/d/1psjiYv9f60JstgeGO1IQPzY3IrF6iGiY/preview",
      description: "The core philosophy of metric-based governance, examining why quantitative targets drive institutional focus.",
      takeaways: [
        "The psychological and institutional impact of visible metrics.",
        "Constructing clear parameters for otherwise abstract policy goals.",
        "Avoiding measurement pitfalls like gaming and goal displacement."
      ]
    },
    {
      id: 4,
      title: "How to Measure Performance",
      embedUrl: "https://drive.google.com/file/d/1ShccxYRfmxfEc1quH24tJFGcuGVF9ETe/preview",
      description: "Practical methodologies for building rigorous, reliable, and verifiable metrics within public organizations.",
      takeaways: [
        "Differentiating between inputs, outputs, outcomes, and impact.",
        "Formulating indicators that represent true performance.",
        "Setting realistic, data-backed baselines and target ranges."
      ]
    },
    {
      id: 5,
      title: "In Search of Accountability",
      embedUrl: "https://drive.google.com/file/d/1piK3il97g6lqJTe8EO0HE7omc-3B_Fw-/preview",
      description: "Exploring institutional models of accountability, focusing on aligning individual effort with public sector goals.",
      takeaways: [
        "Structural versus individual accountability paradigms.",
        "Building administrative checks and balances that prevent corruption.",
        "Designing evaluation feedback loops to continuously improve systems."
      ]
    },
    {
      id: 6,
      title: "A Case Study on Bhutan",
      embedUrl: "https://drive.google.com/file/d/1hpkpYyU6iYhGcfZAEcpesnqaFk7_sn-s/preview",
      description: "An analytical case study of Bhutan's Gross National Happiness (GNH) index and its performance management implementation.",
      takeaways: [
        "Translating multi-dimensional happiness metrics into policy action.",
        "How a small nation structured a unified governance evaluation framework.",
        "Lessons on cultural values integration in modern public administration."
      ]
    },
    {
      id: 7,
      title: "How to Rate a Government Performance System",
      embedUrl: "https://drive.google.com/file/d/1uJvabU5P2kHgCbzKANa87cMITl0qO4ZG/preview",
      description: "A rigorous framework for auditing, scoring, and rating the maturity of government-wide monitoring systems.",
      takeaways: [
        "Key quality dimensions for public sector evaluation architectures.",
        "Differentiating between superficial checklists and robust systems.",
        "Developing independent, reliable scoring indexes for state performance."
      ]
    },
    {
      id: 8,
      title: "A Case of the United States",
      embedUrl: "https://drive.google.com/file/d/1u-qsz2yv-zk3iSdDkeli2hWtnV2TsJTY/preview",
      description: "An analysis of the Government Performance and Results Act (GPRA) and performance frameworks in the US federal government.",
      takeaways: [
        "The evolution of GPM in the United States from GPRA to GPRAMA.",
        "Congressional oversight and executive branch alignment challenges.",
        "Practical takeaways from US federal agency performance reporting."
      ]
    },
    {
      id: 9,
      title: "SMART Toolkit",
      embedUrl: "https://drive.google.com/file/d/1bVboAHbjwIinkZjR4GZi1ZQPuw3q9D7U/preview",
      description: "A comprehensive breakdown of the SMART toolkit, a software and methodology designed to track policy commitments.",
      takeaways: [
        "The conceptual design and technical architecture of the SMART Toolkit.",
        "Bridging political manifestos and actual cabinet-level achievements.",
        "Securing transparency and automated reporting across agencies."
      ]
    },
    {
      id: 10,
      title: "Case Study of GPM in India (RFD)",
      embedUrl: "https://drive.google.com/file/d/1s6jzNXT3qdutXg0Fx_6kGpAreEwR0glk/preview",
      description: "Analyzing India's historic Results-Framework Document (RFD) system, designed by Prof. Trivedi for all central ministries.",
      takeaways: [
        "Designing performance agreements for 80+ diverse government agencies.",
        "The impact of the RFD system on administrative speed and focus.",
        "Key insights from India's Cabinet Secretariat implementation era."
      ]
    },
    {
      id: 11,
      title: "GPM of Public Enterprises (MoU India)",
      embedUrl: "https://drive.google.com/file/d/1LOBRcZVBHWKAO-dI9ehnfxbjF4dDkApZ/preview",
      description: "The origins and mechanisms of the Memorandum of Understanding (MoU) system that revitalized Indian state-owned enterprises.",
      takeaways: [
        "Evaluating public enterprise efficiency using commercial and social metrics.",
        "Decentralizing decision-making power through structured performance contracts.",
        "Achieving market competitiveness in major public sector undertakings (PSUs)."
      ]
    },
    {
      id: 12,
      title: "Case Study of Kenya's Performance Contracts",
      embedUrl: "https://drive.google.com/file/d/17eV1d77xLH5LQfwbTpO_hTxMMzdjat-N/preview",
      description: "Reviewing the highly successful implementation of performance contracting across the public service of Kenya.",
      takeaways: [
        "Scaling performance contracts from local councils to central ministries.",
        "The role of leadership commitment and public audits in driving compliance.",
        "Quantifiable outcomes of Kenyan public service reform initiatives."
      ]
    },
    {
      id: 13,
      title: "Case Study of Bangladesh System (APA)",
      embedUrl: "https://drive.google.com/file/d/1eIONVgd867RvfJZNCs2DDnDN7ehLKUJ9/preview",
      description: "Analyzing the Annual Performance Agreement (APA) system, standardizing governance evaluation and development targets in Bangladesh.",
      takeaways: [
        "Adapting GPM frameworks to support long-term five-year national plans.",
        "Improving coordination and accountability across field offices and ministries.",
        "Key success metrics and lessons learned from the Bangladeshi APA rollout."
      ]
    }
  ];

  const playlistContainer = document.getElementById('academy-playlist');
  const theaterPlayer = document.getElementById('theater-player');
  const theaterSessionLabel = document.getElementById('theater-session-label');
  const theaterSessionTitle = document.getElementById('theater-session-title');
  const theaterSessionDesc = document.getElementById('theater-session-desc');
  const theaterTakeaways = document.getElementById('theater-session-takeaways');
  const infoContainer = document.querySelector('.theater-info');

  function renderPlaylist() {
    if (!playlistContainer) return;
    
    playlistContainer.innerHTML = '';
    GPM_SESSIONS.forEach((session, index) => {
      const paddedNum = String(session.id).padStart(2, '0');
      const item = document.createElement('div');
      item.className = `playlist-item${index === 0 ? ' active' : ''}`;
      item.dataset.id = session.id;
      
      item.innerHTML = `
        <div class="playlist-num">${paddedNum}</div>
        <div class="playlist-details">
          <div class="playlist-title">${session.title}</div>
          <div class="playlist-meta">Session ${paddedNum} · Video</div>
        </div>
        <div class="playlist-play-icon">
          <i class="fa-solid fa-circle-play"></i>
        </div>
      `;
      
      item.addEventListener('click', () => {
        switchActiveSession(session.id);
      });
      
      playlistContainer.appendChild(item);
    });
  }

  function switchActiveSession(sessionId) {
    const session = GPM_SESSIONS.find(s => s.id === sessionId);
    if (!session) return;

    // Toggle active class in sidebar items
    const items = playlistContainer.querySelectorAll('.playlist-item');
    items.forEach(item => {
      if (parseInt(item.dataset.id) === sessionId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Animate transition of content text
    if (infoContainer) {
      infoContainer.classList.add('fade-out');
    }

    setTimeout(() => {
      // Swap Iframe URL
      if (theaterPlayer) {
        theaterPlayer.src = session.embedUrl;
      }

      // Update Texts
      const paddedNum = String(session.id).padStart(2, '0');
      if (theaterSessionLabel) {
        theaterSessionLabel.textContent = `Session ${paddedNum} · Course Lecture`;
      }
      if (theaterSessionTitle) {
        theaterSessionTitle.textContent = session.title;
      }
      if (theaterSessionDesc) {
        theaterSessionDesc.textContent = session.description;
      }

      // Update Takeaways list
      if (theaterTakeaways) {
        theaterTakeaways.innerHTML = '';
        session.takeaways.forEach(takeaway => {
          const li = document.createElement('li');
          li.textContent = takeaway;
          theaterTakeaways.appendChild(li);
        });
      }

      // Animate Back In
      if (infoContainer) {
        infoContainer.classList.remove('fade-out');
      }
    }, 400);
  }

  // Initialize GPM Academy Playlist
  renderPlaylist();

});
