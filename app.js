/* ==========================================================================
   INTERACTION ENGINE — PROF. PRAJAPATI TRIVEDI PORTFOLIO
   ========================================================================== */

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
        if (target === 50 || target === 40) {
          stat.textContent = `${currentValue}+`;
        } else {
          stat.textContent = currentValue;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target === 50 || target === 40 ? `${target}+` : target;
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
    
    if (stepNum === 2) {
      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const org = document.getElementById('form-org').value.trim();
      
      if (!name || !email || !org) {
        alert("Please complete all required fields (*).");
        return false;
      }
      
      // Basic Email Regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return false;
      }
      return true;
    }

    if (stepNum === 3) {
      const msg = document.getElementById('form-message').value.trim();
      if (!msg) {
        alert("Please enter details regarding your request.");
        return false;
      }
      return true;
    }

    return true;
  }

  function goForward() {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        currentStep++;
        updateWizardUI();
      } else if (currentStep === 3) {
        // Form Submit Simulation
        currentStep = 4;
        updateWizardUI();
        console.log("Consultation Request Submitted successfully!");
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

});
