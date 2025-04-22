// script.js
document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuButton && mobileMenu) { mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden')); }

  // --- Filter and Sort --- //
  const resourceCards = document.querySelectorAll('.resource-card');
  const resourceGrid = document.getElementById('resources-grid');
  const noResults = document.getElementById('no-results');
  const resourceCount = document.getElementById('resource-count');
  const searchInput = document.getElementById('resource-search');
  const sortOptions = document.getElementById('sort-options');
  const priceFilters = document.querySelectorAll('.price-filter');
  const tagFilters = document.querySelectorAll('.tag-filter');
  const resetFiltersButton = document.getElementById('reset-filters');
  const activeFiltersContainer = document.getElementById('active-filters');

  let activeFilters = { prices: ['free', 'paid'], tags: [], search: '' };
  let currentSort = 'popularity';

  function updateResourceCount() {
    const visibleCards = Array.from(resourceCards).filter(card => !card.classList.contains('hidden'));
    resourceCount.textContent = visibleCards.length;
    noResults.classList.toggle('hidden', visibleCards.length > 0);
  }

  function updateActiveFiltersDisplay() {
    activeFiltersContainer.innerHTML = ''; let hasFilters = false;
    activeFilters.prices.forEach(price => { if (activeFilters.prices.length < 2) { hasFilters = true; const badge = createFilterBadge(price === 'free' ? 'Free' : 'Paid', () => { removeFilter('prices', price); updateCheckboxState(); }); activeFiltersContainer.appendChild(badge); } });
    activeFilters.tags.forEach(tag => { hasFilters = true; const displayName = getTagDisplayName(tag); const badge = createFilterBadge(displayName, () => { removeFilter('tags', tag); updateCheckboxState(); }); activeFiltersContainer.appendChild(badge); });
    if (activeFilters.search) { hasFilters = true; const badge = createFilterBadge(`"${activeFilters.search}"`, () => { activeFilters.search = ''; searchInput.value = ''; applyFilters(); }); activeFiltersContainer.appendChild(badge); }
    activeFiltersContainer.classList.toggle('hidden', !hasFilters);
  }
  function createFilterBadge(text, removeCallback) { const badge = document.createElement('span'); badge.className = 'filter-badge'; badge.innerHTML = `${text} <i class="fas fa-times"></i>`; badge.querySelector('i').addEventListener('click', removeCallback); return badge; }
  function getTagDisplayName(tag) { const displayNames = { 'bestseller': 'Bestseller', 'hot': 'Hot Deal', 'new': 'New', 'discounted': 'Discounted' }; return displayNames[tag] || tag; }
  function removeFilter(filterType, value) { activeFilters[filterType] = activeFilters[filterType].filter(item => item !== value); applyFilters(); }
  function updateCheckboxState() { priceFilters.forEach(cb => cb.checked = activeFilters.prices.includes(cb.value)); tagFilters.forEach(cb => cb.checked = activeFilters.tags.includes(cb.value)); }

  function applyFilters() {
    resourceCards.forEach(card => {
      const price = card.dataset.price; const tag = card.dataset.tag; const title = card.dataset.title.toLowerCase(); const description = card.querySelector('p').textContent.toLowerCase();
      const passPriceFilter = activeFilters.prices.length === 0 ? false : activeFilters.prices.includes(price); const passTagFilter = activeFilters.tags.length === 0 || activeFilters.tags.includes(tag);
      const searchTerm = activeFilters.search.toLowerCase(); const passSearchFilter = !searchTerm || title.includes(searchTerm) || description.includes(searchTerm);
      card.classList.toggle('hidden', !(passPriceFilter && passTagFilter && passSearchFilter)); card.classList.toggle('fade-in', passPriceFilter && passTagFilter && passSearchFilter);
    });
    sortResources(); updateResourceCount(); updateActiveFiltersDisplay();
  }

  function sortResources() {
    const cards = Array.from(resourceCards).filter(card => !card.classList.contains('hidden'));
    cards.sort((a, b) => {
      switch (currentSort) {
        case 'popularity': return parseInt(b.dataset.popularity) - parseInt(a.dataset.popularity);
        case 'rating': return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        case 'price-low': { const aPrice = a.dataset.price === 'free' ? 0 : parseFloat(a.querySelector('.current-price').textContent.replace(/[^\d.]/g, '')); const bPrice = b.dataset.price === 'free' ? 0 : parseFloat(b.querySelector('.current-price').textContent.replace(/[^\d.]/g, '')); return aPrice - bPrice; }
        case 'price-high': { const aPrice = a.dataset.price === 'free' ? 0 : parseFloat(a.querySelector('.current-price').textContent.replace(/[^\d.]/g, '')); const bPrice = b.dataset.price === 'free' ? 0 : parseFloat(b.querySelector('.current-price').textContent.replace(/[^\d.]/g, '')); return bPrice - aPrice; }
        case 'newest': return new Date(b.dataset.date) - new Date(a.dataset.date);
        default: return 0;
      }
    });
    resourceGrid.innerHTML = ''; cards.forEach(card => resourceGrid.appendChild(card));
  }

  priceFilters.forEach(cb => cb.addEventListener('change', function () { if (this.checked) activeFilters.prices.push(this.value); else activeFilters.prices = activeFilters.prices.filter(p => p !== this.value); applyFilters(); }));
  tagFilters.forEach(cb => cb.addEventListener('change', function () { if (this.checked) activeFilters.tags.push(this.value); else activeFilters.tags = activeFilters.tags.filter(t => t !== this.value); applyFilters(); }));
  sortOptions.addEventListener('change', function () { currentSort = this.value; applyFilters(); });
  let searchTimeout; searchInput.addEventListener('input', function () { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => { activeFilters.search = this.value.trim(); applyFilters(); }, 300); });
  resetFiltersButton.addEventListener('click', function () { activeFilters = { prices: ['free', 'paid'], tags: [], search: '' }; searchInput.value = ''; updateCheckboxState(); applyFilters(); });

  applyFilters(); // Initial load

  // --- Testimonial Scroll --- //
  const testimonialContainer = document.getElementById('testimonial-container');
  const scrollLeftBtn = document.getElementById('scroll-left-btn');
  const scrollRightBtn = document.getElementById('scroll-right-btn');

  if (testimonialContainer && scrollLeftBtn && scrollRightBtn) {
    scrollLeftBtn.addEventListener('click', () => {
      const scrollAmount = testimonialContainer.offsetWidth * 0.8; // Scroll by 80% of visible width
      testimonialContainer.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });

    scrollRightBtn.addEventListener('click', () => {
      const scrollAmount = testimonialContainer.offsetWidth * 0.8; // Scroll by 80% of visible width
      testimonialContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });
  }

  // --- Newsletter Validation and Redirect --- //
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmailInput = document.getElementById('newsletter-email');
  const newsletterSubscribeBtn = document.getElementById('newsletter-subscribe-btn');
  const emailErrorMsg = document.getElementById('email-error');
  const substackUrl = 'https://sathyaanand.substack.com/';

  if (newsletterSubscribeBtn && newsletterEmailInput && emailErrorMsg) {
    newsletterSubscribeBtn.addEventListener('click', function () {
      const emailValue = newsletterEmailInput.value.trim();
      emailErrorMsg.textContent = ''; // Clear previous errors
      emailErrorMsg.classList.add('hidden');

      // Simple Email Regex (basic format check)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailValue === '') {
        // If email is empty, just redirect (as requested implicitly before)
        window.open(substackUrl, '_blank');
      } else if (emailRegex.test(emailValue)) {
        // If email is valid format, redirect
        window.open(substackUrl, '_blank');
      } else {
        // If email is invalid format, show error
        emailErrorMsg.textContent = 'Please enter a valid email address.';
        emailErrorMsg.classList.remove('hidden');
      }
    });

    // Optional: Clear error when user starts typing again
    newsletterEmailInput.addEventListener('input', () => {
      emailErrorMsg.textContent = '';
      emailErrorMsg.classList.add('hidden');
    });
  }

});