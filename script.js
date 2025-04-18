document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const authButtons = document.querySelector('.auth-buttons');
  
  mobileMenuBtn.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    authButtons.classList.toggle('active');
    this.querySelector('i').classList.toggle('fa-times');
  });

  // Range slider sync with number input
  const loanAmountInput = document.getElementById('loanAmount');
  const loanAmountRange = document.getElementById('loanAmountRange');
  const loanTermInput = document.getElementById('loanTerm');
  const loanTermRange = document.getElementById('loanTermRange');

  // Format loan amount with commas
  function formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Sync loan amount range and input
  if (loanAmountInput && loanAmountRange) {
    loanAmountInput.addEventListener('input', function() {
      loanAmountRange.value = this.value.replace(/,/g, '');
      this.value = formatNumberWithCommas(this.value.replace(/,/g, ''));
    });

    loanAmountRange.addEventListener('input', function() {
      loanAmountInput.value = formatNumberWithCommas(this.value);
    });

    // Initialize with formatted value
    loanAmountInput.value = formatNumberWithCommas(loanAmountInput.value);
  }

  // Sync loan term range and input
  if (loanTermInput && loanTermRange) {
    loanTermInput.addEventListener('input', function() {
      loanTermRange.value = this.value;
    });

    loanTermRange.addEventListener('input', function() {
      loanTermInput.value = this.value;
    });
  }

  // Loan form submission
  const loanForm = document.getElementById('loanForm');
  const loanResultsSection = document.getElementById('loanResults');
  
  if (loanForm) {
    loanForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const loanAmount = parseInt(loanAmountInput.value.replace(/,/g, ''));
      const loanTerm = parseInt(loanTermInput.value);
      const loanPurpose = document.getElementById('loanPurpose').value;
      const creditScore = document.getElementById('creditScore').value;
      const employmentStatus = document.getElementById('employmentStatus').value;
      
      // Simulate API call with mock data
      setTimeout(() => {
        const mockLoanOffers = generateMockLoanOffers(loanAmount, loanTerm, creditScore);
        displayLoanOffers(mockLoanOffers);
        
        // Show results section
        loanResultsSection.style.display = 'block';
        
        // Scroll to results
        loanResultsSection.scrollIntoView({ behavior: 'smooth' });
      }, 800);
    });
  }

  // Generate mock loan offers based on user input
  function generateMockLoanOffers(amount, term, creditScore) {
    const lenders = [
      {
        id: 1,
        name: 'Prime Lending',
        logo: 'prime-lending',
        rating: 4.9,
        minAmount: 1000,
        maxAmount: 50000,
        minTerm: 12,
        maxTerm: 60,
        excellentAPR: 5.99,
        goodAPR: 8.99,
        fairAPR: 12.99,
        poorAPR: 18.99
      },
      {
        id: 2,
        name: 'Trusted Financial',
        logo: 'trusted-financial',
        rating: 4.7,
        minAmount: 2000,
        maxAmount: 75000,
        minTerm: 6,
        maxTerm: 84,
        excellentAPR: 4.99,
        goodAPR: 7.99,
        fairAPR: 11.99,
        poorAPR: 17.99
      },
      {
        id: 3,
        name: 'QuickCapital',
        logo: 'quick-capital',
        rating: 4.5,
        minAmount: 5000,
        maxAmount: 100000,
        minTerm: 12,
        maxTerm: 72,
        excellentAPR: 6.49,
        goodAPR: 9.49,
        fairAPR: 13.49,
        poorAPR: 19.49
      },
      {
        id: 4,
        name: 'Community Credit Union',
        logo: 'community-cu',
        rating: 4.8,
        minAmount: 1000,
        maxAmount: 35000,
        minTerm: 12,
        maxTerm: 60,
        excellentAPR: 5.49,
        goodAPR: 8.49,
        fairAPR: 12.49,
        poorAPR: 16.99
      },
      {
        id: 5,
        name: 'Simple Loans',
        logo: 'simple-loans',
        rating: 4.3,
        minAmount: 1000,
        maxAmount: 40000,
        minTerm: 6,
        maxTerm: 60,
        excellentAPR: 7.99,
        goodAPR: 10.99,
        fairAPR: 14.99,
        poorAPR: 21.99
      }
    ];

    // Filter lenders that match the criteria
    const eligibleLenders = lenders.filter(lender => 
      amount >= lender.minAmount && 
      amount <= lender.maxAmount && 
      term >= lender.minTerm && 
      term <= lender.maxTerm
    );

    // Generate offers
    const offers = eligibleLenders.map(lender => {
      let apr;
      switch(creditScore) {
        case 'excellent':
          apr = lender.excellentAPR;
          break;
        case 'good':
          apr = lender.goodAPR;
          break;
        case 'fair':
          apr = lender.fairAPR;
          break;
        case 'poor':
        case 'unknown':
          apr = lender.poorAPR;
          break;
        default:
          apr = lender.goodAPR;
      }

      // Add some random variation
      apr += (Math.random() * 2 - 1); // +/- 1%
      apr = Math.max(3.49, Math.min(35.99, apr)); // Keep within reasonable bounds
      apr = parseFloat(apr.toFixed(2));

      // Calculate monthly payment
      const monthlyRate = apr / 100 / 12;
      const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
      const totalPayment = monthlyPayment * term;
      const totalInterest = totalPayment - amount;

      return {
        lenderId: lender.id,
        lenderName: lender.name,
        lenderLogo: lender.logo,
        lenderRating: lender.rating,
        amount: amount,
        term: term,
        apr: apr,
        monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
        totalPayment: parseFloat(totalPayment.toFixed(2)),
        totalInterest: parseFloat(totalInterest.toFixed(2)),
        type: ['bank', 'credit-union', 'online'][Math.floor(Math.random() * 3)],
        features: [
          'No prepayment penalty',
          'Fast approval',
          'Direct deposit'
        ].slice(0, 1 + Math.floor(Math.random() * 3))
      };
    });

    // Sort by APR by default
    return offers.sort((a, b) => a.apr - b.apr);
  }

  // Display loan offers in the UI
  function displayLoanOffers(offers) {
    const loanOffersContainer = document.getElementById('loanOffers');
    const resultsCount = document.getElementById('resultsCount');
    
    // Update results count
    resultsCount.textContent = offers.length;
    
    // Clear previous results
    loanOffersContainer.innerHTML = '';
    
    if (offers.length === 0) {
      loanOffersContainer.innerHTML = `
        <div class="no-results">
          <i class="fas fa-search"></i>
          <h3>No loan offers found for your criteria</h3>
          <p>Try adjusting your loan amount, term, or credit score to see more options.</p>
        </div>
      `;
      return;
    }
    
    // Create offer cards
    offers.forEach(offer => {
      const offerCard = document.createElement('div');
      offerCard.className = 'loan-offer';
      offerCard.innerHTML = `
        <div class="loan-offer-header">
          <img src="images/lenders/${offer.lenderLogo}.png" alt="${offer.lenderName}" class="lender-logo">
          <span class="loan-badge">Best Rate</span>
        </div>
        <div class="loan-offer-details">
          <div class="detail-item">
            <span class="detail-label">APR</span>
            <span class="detail-value apr">${offer.apr}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Monthly Payment</span>
            <span class="detail-value monthly">$${offer.monthlyPayment.toLocaleString()}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Term</span>
            <span class="detail-value">${offer.term} months</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Total Interest</span>
            <span class="detail-value">$${offer.totalInterest.toLocaleString()}</span>
          </div>
        </div>
        <div class="loan-offer-features">
          <ul>
            ${offer.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
          </ul>
        </div>
        <div class="loan-offer-actions">
          <a href="#" class="more-details">More details <i class="fas fa-chevron-right"></i></a>
          <button class="btn btn-primary">Apply Now</button>
        </div>
      `;
      loanOffersContainer.appendChild(offerCard);
    });
    
    // Add event listeners to apply buttons
    document.querySelectorAll('.loan-offer-actions .btn').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        // In a real app, this would redirect to the lender's application page
        alert('Redirecting to lender application...');
      });
    });
  }
  
  // Sort functionality
  const sortBySelect = document.getElementById('sortBy');
  if (sortBySelect) {
    sortBySelect.addEventListener('change', function() {
      // In a real app, this would re-sort the offers
      alert('Sorting by ' + this.value);
    });
  }
  
  // Filter functionality
  const applyFiltersBtn = document.getElementById('applyFilters');
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // In a real app, this would apply the filters
      alert('Applying filters...');
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        navLinks.classList.remove('active');
        authButtons.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
      }
    });
  });
  
  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value;
      
      // In a real app, this would send the data to a server
      alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
      this.reset();
    });
  }
  
  // Chat bubble functionality
  const chatBubble = document.querySelector('.chat-bubble');
  if (chatBubble) {
    chatBubble.addEventListener('click', function() {
      alert('Live chat would open here in a real implementation.');
    });
  }
});
