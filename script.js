document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // MOBILE NAVIGATION MENU
  // ==========================================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileToggleIcon = mobileToggle.querySelector('i');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function toggleMobileMenu() {
    const isActive = mobileMenu.classList.toggle('active');
    
    // Toggle body scroll lock to prevent scrolling background when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
    
    // Swap icon
    if (isActive) {
      mobileToggleIcon.setAttribute('data-lucide', 'x');
    } else {
      mobileToggleIcon.setAttribute('data-lucide', 'menu');
    }
    
    // Re-initialize icon
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  mobileToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a navigation link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // ==========================================================================
  // SCROLL-EFFECTED ACTIONS (HEADER STICKY STATE) - THROTTLED
  // ==========================================================================
  const header = document.getElementById('header');
  let isScrolling = false;
  
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });
  // Trigger initially in case page loaded already scrolled
  handleScroll();

  // ==========================================================================
  // INTERSECTION OBSERVER FOR ENTRY ANIMATIONS
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.15 // trigger when 15% of the element is visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once it's revealed to prevent repeat triggers on scroll up
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // ==========================================================================
  // ACCESSIBILITY: REDUCED MOTION PREFERENCE CHECK
  // ==========================================================================
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  function handleMotionPreference(e) {
    if (e.matches) {
      // If user prefers reduced motion, disable all observers and reveal immediately
      revealElements.forEach(el => {
        el.classList.add('revealed');
        revealObserver.unobserve(el);
      });
    }
  }

  // Set initial state
  handleMotionPreference(motionQuery);
  // Listen for changes
  motionQuery.addEventListener('change', handleMotionPreference);

  // ==========================================================================
  // SMOOTH ANCHOR LINK INTERACTION
  // ==========================================================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Allow standard behavior for empty anchors
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset (sticky header height)
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================================================
  // SELECTED WORKS / PORTFOLIO SECTION
  // ==========================================================================
  
  // Banner gallery setup
  const bannerGalleryContainer = document.querySelector('.banner-gallery');
  const lightboxModal = document.getElementById('banner-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  // Banner data - recruiter-friendly assets, categories, and descriptions
  const banners = [
    {
      id: 1,
      name: 'Shampoo Commercial Banner',
      category: 'Product Banner Practice',
      description: 'Created as a product advertising banner practice, focusing on soft visuals, product placement, typography, and promotional composition.',
      tools: 'Figma, Adobe Photoshop',
      path: 'assets/img/collections/banner/banner1.png'
    },
    {
      id: 2,
      name: 'Minimal Shampoo Banner',
      category: 'Minimal Promotional Banner',
      description: 'Designed as a simple and clean shampoo promotional banner, focusing on minimal layout, visual spacing, product emphasis, and readability.',
      tools: 'Figma, Canva',
      path: 'assets/img/collections/banner/banner2.png'
    },
    {
      id: 3,
      name: 'Matcha Latte Banner',
      category: 'Café Promotional Banner Practice',
      description: 'Created as a café-themed promotional banner practice, focusing on Japanese-inspired typography, product presentation, color harmony, and visual balance.',
      tools: 'Figma, Adobe Photoshop',
      path: 'assets/img/collections/banner/banner3.png'
    }
  ];
  
  let currentBannerIndex = 0;
  
  // Generate banner cards with detailed recruiter-friendly layout
  function renderBannerGallery() {
    if (!bannerGalleryContainer) return;
    bannerGalleryContainer.innerHTML = '';
    
    banners.forEach((banner, index) => {
      const bannerCard = document.createElement('div');
      bannerCard.className = 'gallery-card';
      bannerCard.innerHTML = `
        <div class="gallery-card-image-wrap">
          <img 
            src="${banner.path}" 
            alt="${banner.name}" 
            class="gallery-card-image"
            loading="lazy"
            decoding="async"
          >
          <div class="gallery-card-overlay">
            <span class="gallery-overlay-btn">
              <i data-lucide="maximize-2"></i> View Full Size
            </span>
          </div>
        </div>
        <div class="gallery-card-info">
          <span class="gallery-card-category">${banner.category}</span>
          <h4 class="gallery-card-title">${banner.name}</h4>
          <p class="gallery-card-desc">${banner.description}</p>
          <div class="gallery-card-tools">
            <span class="tools-label">Tools:</span>
            <span class="tools-list">${banner.tools}</span>
          </div>
        </div>
      `;
      
      const imageWrap = bannerCard.querySelector('.gallery-card-image-wrap');
      imageWrap.addEventListener('click', () => openLightbox(index));
      bannerGalleryContainer.appendChild(bannerCard);
    });
    
    // Re-initialize Lucide icons for new banner cards
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
  
  // Lightbox functions
  function openLightbox(index) {
    currentBannerIndex = index;
    lightboxImage.src = banners[index].path;
    lightboxImage.alt = banners[index].name;
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function showPrevious() {
    currentBannerIndex = (currentBannerIndex - 1 + banners.length) % banners.length;
    lightboxImage.src = banners[currentBannerIndex].path;
    lightboxImage.alt = banners[currentBannerIndex].name;
  }
  
  function showNext() {
    currentBannerIndex = (currentBannerIndex + 1) % banners.length;
    lightboxImage.src = banners[currentBannerIndex].path;
    lightboxImage.alt = banners[currentBannerIndex].name;
  }
  
  // Lightbox event listeners
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevious);
  lightboxNext.addEventListener('click', showNext);
  
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });
  
  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevious();
    } else if (e.key === 'ArrowRight') {
      showNext();
    }
  });
  
  // Render banner gallery on page load
  renderBannerGallery();
});
