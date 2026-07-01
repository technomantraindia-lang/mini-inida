/**
 * Mini-India Food & Beverage Co., Ltd. - Main Script
 * Handles custom cursor, sticky nav, parallax effects, scroll animations,
 * tabs, image gallery filters, lightboxes, and booking modals.
 */

const init = () => {
  
  // ==========================================================================
  // 0. Premium Preloader Animation Sequence
  // ==========================================================================
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloaderBar');
  const word1 = document.querySelector('.preloader-word.word-1');
  const word2 = document.querySelector('.preloader-word.word-2');
  const word3 = document.querySelector('.preloader-word.word-3');
  
  // Disable scroll during preloader loading
  document.body.style.overflow = 'hidden';
  
  if (preloader && preloaderBar) {
    // Phase 1: Animate progress bar
    setTimeout(() => {
      preloaderBar.style.width = '100%';
    }, 100);
    
    // Phase 2: Fade in tagline parts sequentially
    setTimeout(() => {
      if (word1) word1.classList.add('active');
    }, 300);
    
    setTimeout(() => {
      if (word2) word2.classList.add('active');
    }, 950);
    
    setTimeout(() => {
      if (word3) word3.classList.add('active');
    }, 1600);
    
    // Phase 3: Slide up preloader overlay and restore scroll
    setTimeout(() => {
      preloader.classList.add('hide');
      document.body.style.overflow = '';
      
      // Completely remove preloader from layout after transition ends (1.2s)
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 1200);
      
      // Trigger hero entry animations
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.classList.add('loaded');
      }
      
      // Trigger About page doors animation
      const aboutHeroDoors = document.getElementById('aboutHeroDoors');
      if (aboutHeroDoors) {
        aboutHeroDoors.classList.add('open-doors');
      }
    }, 2900);
  } else {
    document.body.style.overflow = '';
    const heroSection = document.getElementById('hero');
    if (heroSection) heroSection.classList.add('loaded');
    
    const aboutHeroDoors = document.getElementById('aboutHeroDoors');
    if (aboutHeroDoors) {
      setTimeout(() => {
        aboutHeroDoors.classList.add('open-doors');
      }, 2000);
    }
    
    const poolHeroGates = document.getElementById('poolHeroGates');
    if (poolHeroGates) {
      setTimeout(() => {
        poolHeroGates.classList.add('open-gates');
      }, 1500);
    }
  }

  // 1. Custom Trailing Cursor removed.

  // ==========================================================================
  // 2. Sticky Header & Parallax Scroll Effect
  // ==========================================================================
  const header = document.getElementById('mainHeader');
  const heroImage = document.querySelector('.hero-parallax-bg');
  
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    
    // Sticky header toggle
    if (scrollPos > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
    
    // Subtle background parallax on hero
    if (heroImage && scrollPos < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrollPos * 0.3}px) scale(${1 - scrollPos * 0.0002})`;
    }
  });

  // Hero loader is triggered by preloader finish sequence above

  // ==========================================================================
  // 3. Mobile Navigation Toggle
  // ==========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
    
    // Close nav when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
        
        // Remove active from all and set on clicked
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  // ==========================================================================
  // 4. Scroll triggered animations (Intersection Observer)
  // ==========================================================================
  const animatedElements = document.querySelectorAll('.scroll-anim');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: active everything immediately if observer not supported
    animatedElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================================================
  // 5. Celebration Tabs Switching System
  // ==========================================================================
  const tabItems = document.querySelectorAll('.tab-item');
  const tabPanels = document.querySelectorAll('.tab-panel');
  
  tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      
      // Update tabs state
      tabItems.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update panel visibility
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('id') === targetId) {
          panel.classList.add('active');
        }
      });
    });
  });

  // ==========================================================================
  // 5b. Interactive Menu Page Tab Filtering
  // ==========================================================================
  const menuTabBtns = document.querySelectorAll('.menu-tab-btn');
  const menuItemCards = document.querySelectorAll('.menu-item-card');
  
  menuTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      
      // Update active state on buttons
      menuTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter menu items
      menuItemCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hide');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.classList.add('hide');
          }, 300);
        }
      });
    });
  });

  // ==========================================================================
  // 6. Filterable Photo Gallery
  // ==========================================================================
  const filterTags = document.querySelectorAll('.filter-tag');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentFilter = 'all';
  
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const filterValue = tag.getAttribute('data-filter');
      currentFilter = filterValue;
      
      // Set active state on tags
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      
      // Filter the items
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          item.classList.remove('hide');
          // Brief timeout to trigger CSS transition
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.classList.add('hide');
          }, 300);
        }
      });
    });
  });

  // ==========================================================================
  // 7. Interactive Lightbox Modal
  // ==========================================================================
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxTitle = document.getElementById('lightboxTitle');
  
  let currentLightboxIndex = 0;
  let activeItems = [];
  
  // Helper to fetch only current active/filtered images
  const getActiveGalleryItems = () => {
    return Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
  };
  
  const updateLightboxContent = (index) => {
    const item = activeItems[index];
    if (!item) return;
    
    const imgEl = item.querySelector('img');
    const titleEl = item.querySelector('.gallery-item-title');
    const catEl = item.querySelector('.gallery-category');
    
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt;
    lightboxTitle.textContent = titleEl.textContent;
    lightboxCat.textContent = catEl.textContent;
    currentLightboxIndex = index;
  };
  
  // Attach click listener on gallery cards
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      activeItems = getActiveGalleryItems();
      const newIndex = activeItems.indexOf(item);
      
      updateLightboxContent(newIndex);
      lightboxModal.classList.add('active');
    });
  });
  
  // Next / Prev button events
  if (lightboxNext && lightboxPrev) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      let nextIdx = currentLightboxIndex + 1;
      if (nextIdx >= activeItems.length) nextIdx = 0;
      updateLightboxContent(nextIdx);
    });
    
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      let prevIdx = currentLightboxIndex - 1;
      if (prevIdx < 0) prevIdx = activeItems.length - 1;
      updateLightboxContent(prevIdx);
    });
  }
  
  // Close Lightbox
  const closeLightbox = () => {
    lightboxModal.classList.remove('active');
  };
  
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-container')) {
        closeLightbox();
      }
    });
  }
  
  // Keyboard bindings for Lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
  });

  // Link gallery CTA button to filter tab
  const viewFullGalleryBtn = document.getElementById('viewFullGalleryBtn');
  if (viewFullGalleryBtn) {
    viewFullGalleryBtn.addEventListener('click', () => {
      const allFilterTag = document.querySelector('.filter-tag[data-filter="all"]');
      if (allFilterTag) allFilterTag.click();
      document.getElementById('gallery').scrollIntoView();
    });
  }

  // ==========================================================================
  // 8. Testimonials Fade Slider
  // ==========================================================================
  const testSlides = document.querySelectorAll('.testimonial-slide');
  const testDots = document.querySelectorAll('.testimonial-dots .dot');
  const testWrapper = document.getElementById('testimonialWrapper');
  let currentSlide = 0;
  let slideInterval;
  
  const showSlide = (index) => {
    testSlides.forEach((slide, idx) => {
      slide.classList.remove('active');
      if (idx === index) slide.classList.add('active');
    });
    
    testDots.forEach((dot, idx) => {
      dot.classList.remove('active');
      if (idx === index) dot.classList.add('active');
    });

    if (testWrapper) {
      testWrapper.style.transform = `translateX(-${index * 100}%)`;
    }
    
    currentSlide = index;
  };
  
  const nextSlide = () => {
    let next = currentSlide + 1;
    if (next >= testSlides.length) next = 0;
    showSlide(next);
  };
  
  const startSlideShow = () => {
    slideInterval = setInterval(nextSlide, 7000); // Transition every 7s
  };
  
  const resetSlideShow = () => {
    clearInterval(slideInterval);
    startSlideShow();
  };
  
  // Dots events
  testDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
      showSlide(targetIdx);
      resetSlideShow();
    });
  });
  
  // Initialize slider
  if (testSlides.length > 0) {
    startSlideShow();
  }

  // ==========================================================================
  // 9. Enquiry Form Handler
  // ==========================================================================
  const enquiryForm = document.getElementById('enquiryForm');
  
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('enquiryName').value;
      const type = document.getElementById('enquiryType').value;
      const date = document.getElementById('enquiryDate').value;
      
      alert(`Thank you, ${name}! Your custom event enquiry for a ${type} scheduled on ${date} has been submitted. Our elite event organizers will get back to you with layout plans and quotation options in 24 hours.`);
      
      closeEnquiryModal();
      enquiryForm.reset();
    });
  }

  // ==========================================================================
  // 9b. Height-Aware Card Deck Stacking Scroll Animation
  // ==========================================================================
  const stackingSections = document.querySelectorAll('section, .action-footer-panel');
  
  const setupStackingDeck = () => {
    if (stackingSections.length > 0 && window.innerWidth > 600) {
      stackingSections.forEach((section, index) => {
        // Set z-index sequentially so subsequent elements stack on top
        section.style.zIndex = index + 1;
        
        // Remove existing stacking classes to recalculate
        section.classList.remove('sticky-deck', 'relative-deck');
        
        // Only make the section sticky if it fits within the viewport.
        // Taller sections scroll naturally to avoid cutting off bottom content,
        // while still allowing standard overlaying behavior.
        if (section.offsetHeight <= window.innerHeight + 150) {
          section.classList.add('sticky-deck');
        } else {
          section.classList.add('relative-deck');
        }
      });
    } else {
      // Clean up classes on small screens
      stackingSections.forEach(section => {
        section.classList.remove('sticky-deck', 'relative-deck');
        section.style.zIndex = '';
      });
    }
  };

  // Run on load and resize
  setupStackingDeck();
  window.addEventListener('resize', setupStackingDeck);
  window.addEventListener('load', setupStackingDeck);

  // Event planner quick form submission
  const ctaQuickForm = document.getElementById('ctaQuickForm');
  if (ctaQuickForm) {
    ctaQuickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for contacting Mini-India! Our host team will get back to you shortly.');
      ctaQuickForm.reset();
    });
  }

  // Contact page premium form interactions
  const contactPremiumForm = document.getElementById('contactPremiumForm');
  const contactFormStatus = document.getElementById('contactFormStatus');
  const contactDateInput = document.getElementById('contactDate');
  const contactTypeSelect = document.getElementById('contactEnquiryType');
  const contactChips = document.querySelectorAll('.contact-chip');
  const faqItems = document.querySelectorAll('.contact-faq-item');

  if (contactDateInput) {
    const today = new Date().toISOString().split('T')[0];
    contactDateInput.min = today;
  }

  if (contactTypeSelect && contactChips.length > 0) {
    const syncContactChipState = (value) => {
      contactChips.forEach((chip) => {
        chip.classList.toggle('active', chip.getAttribute('data-value') === value);
      });
    };

    contactChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const chipValue = chip.getAttribute('data-value');
        contactTypeSelect.value = chipValue;
        syncContactChipState(chipValue);
      });
    });

    contactTypeSelect.addEventListener('change', () => {
      syncContactChipState(contactTypeSelect.value);
    });
  }

  if (contactPremiumForm) {
    contactPremiumForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const leadName = document.getElementById('contactLeadName');
      const enquiryType = document.getElementById('contactEnquiryType');

      if (contactFormStatus) {
        const selectedType = enquiryType ? enquiryType.options[enquiryType.selectedIndex].text : 'your enquiry';
        contactFormStatus.textContent = `Thank you, ${leadName.value}! Your ${selectedType.toLowerCase()} request has been received. Our Mini-India team will contact you shortly.`;
      }

      contactPremiumForm.reset();

      if (contactTypeSelect) {
        contactTypeSelect.value = 'event';
      }

      contactChips.forEach((chip) => {
        chip.classList.toggle('active', chip.getAttribute('data-value') === 'event');
      });
    });
  }

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.contact-faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach((faq) => faq.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ==========================================================================================
// 10. Global Modal Controls (Exposed to HTML)
// ==========================================================================

function openEnquiryModal(eventType = '') {
  const modal = document.getElementById('enquiryModal');
  const typeSelect = document.getElementById('enquiryType');
  
  if (typeSelect && eventType) {
    if (eventType === 'wedding') typeSelect.value = 'wedding';
    else if (eventType === 'corporate') typeSelect.value = 'corporate';
    else if (eventType === 'pool') typeSelect.value = 'poolparty';
    else if (eventType === 'songkran') typeSelect.value = 'poolparty';
    else if (eventType === 'entertainment') typeSelect.value = 'poolparty';
    else if (eventType === 'venue') typeSelect.value = 'wedding';
  }
  
  // Set min date of form dynamically to today
  const dateInput = document.getElementById('enquiryDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
  
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeEnquiryModal() {
  const modal = document.getElementById('enquiryModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modals clicking outside
window.addEventListener('click', (e) => {
  const enquiryModal = document.getElementById('enquiryModal');
  if (e.target === enquiryModal) closeEnquiryModal();
});
