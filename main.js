document.addEventListener('DOMContentLoaded', function () {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');
  const contactForm = document.getElementById('contactForm');

  function removeHighlights() {
    document.querySelectorAll('.search-highlight').forEach(el => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
  }

  function highlightTerm(term) {
    if (!term) return;

    const regex = new RegExp(`(${term})`, 'gi');
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToHighlight = [];

    while ((node = walker.nextNode())) {
      if (
        node.parentNode &&
        node.nodeValue.trim() &&
        !['SCRIPT', 'STYLE'].includes(node.parentNode.nodeName) &&
        !node.parentNode.classList.contains('search-highlight')
      ) {
        if (regex.test(node.nodeValue)) {
          nodesToHighlight.push(node);
        }
      }
    }

    nodesToHighlight.forEach(node => {
      const spanWrapper = document.createElement('span');
      spanWrapper.innerHTML = node.nodeValue.replace(regex, `<span class="search-highlight">$1</span>`);
      node.parentNode.replaceChild(spanWrapper, node);
    });
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function () {
      const query = searchInput.value.trim();
      removeHighlights();
      if (!query) {
        alert('Please enter a search term.');
        return;
      }
      highlightTerm(query);

      const firstHighlight = document.querySelector('.search-highlight');
      if (firstHighlight) {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('No matches found.');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const message = document.getElementById('contactMessage').value;
      const existingContacts = JSON.parse(localStorage.getItem('contacts') || '[]');

      existingContacts.push({
        name,
        email,
        message,
        timestamp: new Date().toISOString()
      });

      localStorage.setItem('contacts', JSON.stringify(existingContacts));

      contactForm.reset();
      alert('Your message has been submitted successfully!');
    });
  }
});
