/**
 * ADVOCATE SUNIL KUMARI - CHAMBER PORTAL
 * Interactive Engine: BCI Modal, 5-9 PM Scheduler, iCal (.ics) Generator, Form Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. Toast Notification Helper
  // ---------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');
  
  function showToast(message, duration = 4000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ---------------------------------------------------------------------------
  // 2. Bar Council of India (BCI) Ethics Disclaimer Modal
  // ---------------------------------------------------------------------------
  const bciModal = document.getElementById('bciModal');
  const btnAcceptBci = document.getElementById('btnAcceptBci');
  const openBciModalBtn = document.getElementById('openBciModalBtn');
  const footerDisclaimerBtn = document.getElementById('footerDisclaimerBtn');

  const BCI_STORAGE_KEY = 'ask_bci_ethics_acknowledged_2026';

  function openBciModal() {
    if (bciModal) {
      bciModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBciModal() {
    if (bciModal) {
      bciModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Check if previously acknowledged
  if (!localStorage.getItem(BCI_STORAGE_KEY)) {
    // Show after slight delay for gentle visual entry
    setTimeout(openBciModal, 400);
  }

  if (btnAcceptBci) {
    btnAcceptBci.addEventListener('click', () => {
      localStorage.setItem(BCI_STORAGE_KEY, 'true');
      closeBciModal();
      showToast('Disclaimer acknowledged. Welcome to Adv Sunil Kumari’s chamber portal.');
    });
  }

  if (openBciModalBtn) {
    openBciModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openBciModal();
    });
  }

  if (footerDisclaimerBtn) {
    footerDisclaimerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openBciModal();
    });
  }

  // ---------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // ---------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = mobileDrawer ? mobileDrawer.querySelectorAll('a') : [];

  function openMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeMobileMenu);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close drawer on Escape key for mobile accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ---------------------------------------------------------------------------
  // 4. Consultation Mode Selection (Chamber vs Virtual)
  // ---------------------------------------------------------------------------
  const modeCards = document.querySelectorAll('.mode-card');
  modeCards.forEach(card => {
    card.addEventListener('click', () => {
      modeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('.mode-radio');
      if (radio) radio.checked = true;
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Evening Chamber Time Slots (5:00 PM – 9:00 PM)
  // ---------------------------------------------------------------------------
  const timeSlotsContainer = document.getElementById('timeSlotsContainer');
  const selectedTimeSlotInput = document.getElementById('selectedTimeSlot');
  const slotErrorMsg = document.getElementById('slotErrorMsg');
  const appointmentDateInput = document.getElementById('appointmentDate');
  const dateHint = document.getElementById('dateHint');

  // Evening slots strictly between 5:00 PM and 9:00 PM
  const eveningSlots = [
    '5:00 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM'
  ];

  function renderTimeSlots() {
    if (!timeSlotsContainer) return;
    timeSlotsContainer.innerHTML = '';

    eveningSlots.forEach((slot, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time-slot-btn';
      btn.textContent = slot;
      btn.dataset.slot = slot;
      
      // Auto-select first slot or restore previous
      if (index === 0 && !selectedTimeSlotInput.value) {
        btn.classList.add('selected');
        selectedTimeSlotInput.value = slot;
      } else if (selectedTimeSlotInput.value === slot) {
        btn.classList.add('selected');
      }

      btn.addEventListener('click', () => {
        document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedTimeSlotInput.value = slot;
        if (slotErrorMsg) slotErrorMsg.style.display = 'none';
      });

      timeSlotsContainer.appendChild(btn);
    });
  }

  // Setup Date Constraints (Tomorrow onwards, skip or flag Sundays)
  if (appointmentDateInput) {
    const today = new Date();
    // Default to tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // If tomorrow is Sunday, jump to Monday
    if (tomorrow.getDay() === 0) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }

    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const defaultDateStr = `${yyyy}-${mm}-${dd}`;

    appointmentDateInput.min = defaultDateStr;
    appointmentDateInput.value = defaultDateStr;

    // Date change listener
    appointmentDateInput.addEventListener('change', () => {
      const pickedDate = new Date(appointmentDateInput.value);
      if (pickedDate.getDay() === 0) {
        // Sunday warning
        dateHint.textContent = '⚠️ Sundays: Regular chamber closed. Slots limited to emergency bail/writ consultations.';
        dateHint.style.color = '#d97706';
      } else {
        dateHint.textContent = 'Consultations available Monday through Saturday (5 PM – 9 PM)';
        dateHint.style.color = '';
      }
    });
  }

  renderTimeSlots();

  // ---------------------------------------------------------------------------
  // 6. Pre-select Practice Area from Practice Cards or Buttons
  // ---------------------------------------------------------------------------
  const practiceSelect = document.getElementById('practiceAreaSelect');
  const preselectTriggers = document.querySelectorAll('[data-preselect]');

  preselectTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetPractice = trigger.getAttribute('data-preselect');
      if (practiceSelect && targetPractice) {
        for (let i = 0; i < practiceSelect.options.length; i++) {
          if (practiceSelect.options[i].value.toLowerCase().includes(targetPractice.toLowerCase())) {
            practiceSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Appointment Booking Form Submission & Confirmation Modal
  // ---------------------------------------------------------------------------
  const bookingForm = document.getElementById('appointmentBookingForm');
  const bookingSuccessModal = document.getElementById('bookingSuccessModal');
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  const modalRefId = document.getElementById('modalRefId');
  const modalClientName = document.getElementById('modalClientName');
  const modalClientEmail = document.getElementById('modalClientEmail');
  const modalDate = document.getElementById('modalDate');
  const modalTimeSlot = document.getElementById('modalTimeSlot');
  const modalMode = document.getElementById('modalMode');
  const modalPractice = document.getElementById('modalPractice');
  const btnDownloadIcs = document.getElementById('btnDownloadIcs');
  const btnPrintReceipt = document.getElementById('btnPrintReceipt');

  let currentAppointmentData = null;

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const clientName = document.getElementById('clientName').value.trim();
      const clientEmail = document.getElementById('clientEmail').value.trim();
      const practiceArea = document.getElementById('practiceAreaSelect').value;
      const dateVal = appointmentDateInput.value;
      const timeSlot = selectedTimeSlotInput.value;
      const caseSummary = document.getElementById('caseSummary').value.trim();
      const disclaimerChecked = document.getElementById('bookingDisclaimerCheck').checked;

      const activeModeRadio = document.querySelector('input[name="consultationMode"]:checked');
      const consultationMode = activeModeRadio ? activeModeRadio.value : 'In-Person Chamber (Jaipur)';

      if (!timeSlot) {
        if (slotErrorMsg) slotErrorMsg.style.display = 'block';
        return;
      }

      if (!disclaimerChecked) {
        showToast('Please acknowledge the chamber consultation disclaimer.');
        return;
      }

      // Generate reference ID
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const refId = `SKL-2026-${randomSuffix}`;

      // Format date for display
      const dateObj = new Date(dateVal + 'T17:00:00');
      const formattedDate = dateObj.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      currentAppointmentData = {
        refId,
        clientName,
        clientEmail,
        dateVal,
        formattedDate,
        timeSlot,
        consultationMode,
        practiceArea,
        caseSummary
      };

      // Populate Modal Fields
      if (modalRefId) modalRefId.textContent = refId;
      if (modalClientName) modalClientName.textContent = clientName;
      if (modalClientEmail) modalClientEmail.textContent = clientEmail;
      if (modalDate) modalDate.textContent = formattedDate;
      if (modalTimeSlot) modalTimeSlot.textContent = `${timeSlot} IST (Chamber Hours)`;
      if (modalMode) modalMode.textContent = consultationMode;
      if (modalPractice) modalPractice.textContent = practiceArea;

      // Show Modal
      if (bookingSuccessModal) {
        bookingSuccessModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      showToast(`Appointment Request ${refId} registered successfully!`);
    });
  }

  function closeSuccessModal() {
    if (bookingSuccessModal) {
      bookingSuccessModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeSuccessModalBtn) {
    closeSuccessModalBtn.addEventListener('click', closeSuccessModal);
  }

  // Print Receipt
  if (btnPrintReceipt) {
    btnPrintReceipt.addEventListener('click', () => {
      window.print();
    });
  }

  // ---------------------------------------------------------------------------
  // 8. Download .ics iCalendar File Generator
  // ---------------------------------------------------------------------------
  if (btnDownloadIcs) {
    btnDownloadIcs.addEventListener('click', () => {
      if (!currentAppointmentData) return;

      const { refId, clientName, dateVal, timeSlot, consultationMode, practiceArea } = currentAppointmentData;

      // Parse date and time for ics
      // Example timeSlot: "6:30 PM"
      const [timeStr, meridiem] = timeSlot.split(' ');
      let [hours, minutes] = timeStr.split(':').map(Number);
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;

      const startDate = new Date(`${dateVal}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
      const endDate = new Date(startDate.getTime() + 45 * 60000); // 45 minute duration

      const formatIcsTime = (d) => {
        return d.toISOString().replace(/-|:|\.\d+/g, '');
      };

      const startIcs = formatIcsTime(startDate);
      const endIcs = formatIcsTime(endDate);

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Adv Sunil Kumari Chamber//Consultation Portal//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:REQUEST',
        'BEGIN:VEVENT',
        `UID:${refId}@gmail.com`,
        `DTSTAMP:${formatIcsTime(new Date())}`,
        `DTSTART:${startIcs}`,
        `DTEND:${endIcs}`,
        `SUMMARY:Legal Consultation with Adv Sunil Kumari (${practiceArea})`,
        `DESCRIPTION:Consultation with Adv Sunil Kumari\\nRef: ${refId}\\nClient: ${clientName}\\nMode: ${consultationMode}\\nPractice Area: ${practiceArea}\\nChamber Hours: 5:00 PM - 9:00 PM IST.\\nNote: Please carry all relevant court documents\\, FIR copies\\, or contracts.`,
        'LOCATION:Chamber Complex\\, Near Rajasthan High Court Bench\\, Jaipur\\, Rajasthan 302005',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `Chamber_Consultation_${refId}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Appointment invitation (.ics) downloaded.');
    });
  }

  // ---------------------------------------------------------------------------
  // 9. Contact / Inquiry Form Handler
  // ---------------------------------------------------------------------------
  const contactForm = document.getElementById('contactInquiryForm');
  const inquirySuccessAlert = document.getElementById('inquirySuccessAlert');
  const btnSubmitInquiry = document.getElementById('btnSubmitInquiry');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('contactFullName').value.trim();
      const email = document.getElementById('contactUserEmail').value.trim();
      const matter = document.getElementById('contactMatterType').value;
      const message = document.getElementById('contactMessage').value.trim();
      const disclaimer = document.getElementById('contactDisclaimerCheck').checked;

      if (!fullName || !email || !matter || !message) {
        showToast('Please complete all required fields.');
        return;
      }

      if (!disclaimer) {
        showToast('Please check the legal disclaimer acknowledgement.');
        return;
      }

      // Simulate sending inquiry
      btnSubmitInquiry.disabled = true;
      btnSubmitInquiry.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        <span>Transmitting Inquiry...</span>
      `;

      setTimeout(() => {
        btnSubmitInquiry.disabled = false;
        btnSubmitInquiry.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          <span>Transmit Secure Inquiry</span>
        `;

        contactForm.reset();
        if (inquirySuccessAlert) {
          inquirySuccessAlert.style.display = 'flex';
          setTimeout(() => {
            inquirySuccessAlert.style.display = 'none';
          }, 8000);
        }

        showToast('Your inquiry has been transmitted to Adv Sunil Kumari’s chamber.');
      }, 900);
    });
  }

  // ---------------------------------------------------------------------------
  // 10. Copy Professional Email to Clipboard
  // ---------------------------------------------------------------------------
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      const emailText = 'sukumari3128@gmail.com';
      navigator.clipboard.writeText(emailText).then(() => {
        btnCopyEmail.textContent = 'Copied!';
        showToast('Email address copied to clipboard: ' + emailText);
        setTimeout(() => {
          btnCopyEmail.textContent = 'Copy';
        }, 2500);
      }).catch(() => {
        showToast('Email: sukumari3128@gmail.com');
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 11. FAQ Accordion Interaction
  // ---------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isOpen = questionBtn.getAttribute('aria-expanded') === 'true';

        // Close all others
        faqItems.forEach(other => {
          const otherBtn = other.querySelector('.faq-question');
          const otherAns = other.querySelector('.faq-answer');
          if (otherBtn && otherAns && other !== item) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherAns.style.maxHeight = null;
          }
        });

        if (!isOpen) {
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          questionBtn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        }
      });
    }
  });

  // ---------------------------------------------------------------------------
  // 12. Active Navigation Spy on Scroll
  // ---------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

});
