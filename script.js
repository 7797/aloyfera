/* ==========================================================================
   Aloe Vera Trust - Interactive Logic Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header Scroll Effect
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = '#ffffff';
        navLinks.style.padding = '2rem';
        navLinks.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      }
    });
  }

  // Counter Animation for Impact Stats
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const prefix = counter.getAttribute('data-prefix') || '';
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = Math.ceil(target / 80);

      const updateCount = () => {
        count += speed;
        if (count >= target) {
          counter.innerText = prefix + target.toLocaleString('en-IN') + suffix;
        } else {
          counter.innerText = prefix + count.toLocaleString('en-IN') + suffix;
          setTimeout(updateCount, 25);
        }
      };

      updateCount();
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animateCounters();
        animated = true;
      }
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // Donation Amount Preset & Impact Calculation
  const presetBtns = document.querySelectorAll('.preset-btn');
  const customAmountInput = document.getElementById('customAmountInput');
  const impactMsg = document.getElementById('impactMsgText');
  const selectedAmountDisplay = document.getElementById('selectedAmountDisplay');

  let currentAmount = 1000; // Default ₹1000

  const updateImpactMessage = (amount) => {
    currentAmount = amount;
    if (selectedAmountDisplay) {
      selectedAmountDisplay.innerText = `₹${amount.toLocaleString('en-IN')}`;
    }

    if (amount < 500) {
      impactMsg.innerHTML = `<i class="fas fa-heart text-emerald-500"></i> Provides educational stationery for 1 rural child in Namkhana.`;
    } else if (amount < 1500) {
      impactMsg.innerHTML = `<i class="fas fa-book-reader text-emerald-500"></i> Sponsors 1 month of coaching fee & textbooks for a underprivileged student.`;
    } else if (amount < 3000) {
      impactMsg.innerHTML = `<i class="fas fa-seedling text-emerald-500"></i> Plants & maintains 30 green shade trees in South 24 Parganas coastal area.`;
    } else if (amount < 5000) {
      impactMsg.innerHTML = `<i class="fas fa-medkit text-emerald-500"></i> Provides complete essential health & hygienic kits for 3 rural families.`;
    } else {
      impactMsg.innerHTML = `<i class="fas fa-hands-helping text-emerald-500"></i> Comprehensive monthly support covering Education, Clothes & Nutrition for a rural household!`;
    }
  };

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = parseInt(btn.getAttribute('data-val'));
      customAmountInput.value = val;
      updateImpactMessage(val);
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value) || 0;
      presetBtns.forEach(b => {
        if (parseInt(b.getAttribute('data-val')) === val) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      updateImpactMessage(val);
    });
  }

  // Donation Modal Logic & QR Code Generation
  const donateModal = document.getElementById('donateModal');
  const openDonateBtns = document.querySelectorAll('.open-donate-modal');
  const closeDonateBtn = document.getElementById('closeDonateModal');
  const modalAmountText = document.getElementById('modalAmountText');
  const qrImage = document.getElementById('upiQrCodeImage');

  openDonateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const amountToUse = currentAmount || 1000;
      if (modalAmountText) {
        modalAmountText.innerText = `₹${amountToUse.toLocaleString('en-IN')}`;
      }
      
      // Use official uploaded HDFC SmartHub Vyapar QR image
      if (qrImage) {
        qrImage.src = 'assets/images/official_qr.jpg';
      }

      donateModal.classList.add('active');
    });
  });

  if (closeDonateBtn) {
    closeDonateBtn.addEventListener('click', () => {
      donateModal.classList.remove('active');
    });
  }

  // Close Modal on backdrop click
  if (donateModal) {
    donateModal.addEventListener('click', (e) => {
      if (e.target === donateModal) {
        donateModal.classList.remove('active');
      }
    });
  }

  // Payment Tabs inside Modal (UPI / Bank Transfer)
  const payTabBtns = document.querySelectorAll('.pay-tab-btn');
  const upiView = document.getElementById('upiPaymentView');
  const bankView = document.getElementById('bankPaymentView');

  payTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      payTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetView = btn.getAttribute('data-target');
      if (targetView === 'upi') {
        upiView.style.display = 'block';
        bankView.style.display = 'none';
      } else {
        upiView.style.display = 'none';
        bankView.style.display = 'block';
      }
    });
  });

  // Copy to Clipboard Utility
  window.copyText = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${label} to clipboard!`);
    }).catch(err => {
      showToast(`Text: ${text}`);
    });
  };

  // Toast Notification Utility
  window.showToast = (message, type = 'success') => {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle text-emerald-400"></i> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // Simulated Payment Confirmation Handler
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', () => {
      const txId = document.getElementById('transactionIdInput')?.value.trim();
      if (!txId) {
        showToast('Please enter UTR / Transaction ID for receipt generation', 'warning');
        return;
      }
      donateModal.classList.remove('active');
      showToast('Thank you! Your donation reference has been received. Receipt will be issued shortly.');
    });
  }

  // Volunteer Modal Logic
  const volunteerModal = document.getElementById('volunteerModal');
  const openVolunteerBtns = document.querySelectorAll('.open-volunteer-modal');
  const closeVolunteerBtn = document.getElementById('closeVolunteerModal');
  const volunteerForm = document.getElementById('volunteerForm');

  openVolunteerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      volunteerModal.classList.add('active');
    });
  });

  if (closeVolunteerBtn) {
    closeVolunteerBtn.addEventListener('click', () => {
      volunteerModal.classList.remove('active');
    });
  }

  if (volunteerModal) {
    volunteerModal.addEventListener('click', (e) => {
      if (e.target === volunteerModal) {
        volunteerModal.classList.remove('active');
      }
    });
  }

  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      volunteerModal.classList.remove('active');
      showToast('Thank you for registering as a Volunteer with Aloy Fera Trust! Our team will contact you.');
      volunteerForm.reset();
    });
  }

  // Gallery Filter Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Contact Form Submission Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Your message has been sent successfully to Aloy Fera Trust team!');
      contactForm.reset();
    });
  }
});
