document.addEventListener('DOMContentLoaded', () => {
  const codeBlock = document.getElementById('codeBlock');
  const copyBtn = document.getElementById('copyBtn');

  // Retrieve the captured HTML from storage
  browser.storage.local.get('capturedHtml').then((result) => {
    if (result.capturedHtml) {
      // Format the HTML using js-beautify
      let formattedHtml = result.capturedHtml;
      try {
        if (typeof html_beautify !== 'undefined') {
          formattedHtml = html_beautify(result.capturedHtml, {
            indent_size: 2,
            wrap_line_length: 120,
            preserve_newlines: true
          });
        }
      } catch (e) {
        console.error("Formatting error:", e);
      }

      window.formattedHtmlSource = formattedHtml;
      codeBlock.textContent = formattedHtml;

      // --- Search functionality ---
      const searchInput = document.getElementById('searchInput');
      const searchStats = document.getElementById('searchStats');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      
      let currentMatches = [];
      let currentIndex = -1;

      function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag));
      }

      function updateHighlight() {
        currentMatches.forEach(el => el.classList.remove('active'));
        if (currentIndex >= 0 && currentIndex < currentMatches.length) {
          const activeMatch = currentMatches[currentIndex];
          activeMatch.classList.add('active');
          activeMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
          searchStats.textContent = `${currentIndex + 1}/${currentMatches.length}`;
        }
      }

      function performSearch() {
        const query = searchInput.value;
        if (!query) {
          codeBlock.textContent = window.formattedHtmlSource;
          searchStats.textContent = '0/0';
          currentMatches = [];
          currentIndex = -1;
          return;
        }

        const escapedSource = escapeHTML(window.formattedHtmlSource);
        const escapedQuery = escapeHTML(query);
        const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp("(" + escapeRegExp(escapedQuery) + ")", "gi");

        let matchCount = 0;
        const highlighted = escapedSource.replace(regex, (match) => {
          matchCount++;
          return `<mark class="highlight">${match}</mark>`;
        });

        codeBlock.innerHTML = highlighted;

        if (matchCount > 0) {
          currentMatches = Array.from(codeBlock.querySelectorAll('mark'));
          currentIndex = 0;
          updateHighlight();
        } else {
          currentMatches = [];
          currentIndex = -1;
          searchStats.textContent = '0/0';
        }
      }

      searchInput.addEventListener('input', performSearch);

      nextBtn.addEventListener('click', () => {
        if (currentMatches.length > 0) {
          currentIndex = (currentIndex + 1) % currentMatches.length;
          updateHighlight();
        }
      });

      prevBtn.addEventListener('click', () => {
        if (currentMatches.length > 0) {
          currentIndex = (currentIndex - 1 + currentMatches.length) % currentMatches.length;
          updateHighlight();
        }
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (e.shiftKey) prevBtn.click();
          else nextBtn.click();
        }
      });
      // --- End Search functionality ---

      // Setup copy button
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(formattedHtml).then(() => {
          const originalText = copyBtn.innerText;
          copyBtn.innerText = "Copied!";
          setTimeout(() => {
            copyBtn.innerText = originalText;
          }, 2000);
        }).catch(err => {
          console.error("Failed to copy text: ", err);
          alert("Failed to copy to clipboard.");
        });
      });

      // Clear storage to save memory
      browser.storage.local.remove('capturedHtml');
    } else {
      codeBlock.textContent = "No HTML content found. Please try capturing again.";
    }
  }).catch((error) => {
    console.error("Error retrieving stored HTML:", error);
    codeBlock.textContent = "Error loading HTML content.";
  });
});
