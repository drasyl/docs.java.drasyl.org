// Custom script to add drasyl-java documentation banner to every page
(function() {
  'use strict';

  // Wait for DOM to be ready
  function addCustomAdmonition() {
    // Check if the banner already exists to avoid duplicates
    if (document.querySelector('.custom-drasyl-java-banner')) {
      return;
    }

    // Create the banner HTML
    const bannerHTML = `
      <div class="theme-admonition theme-admonition-info alert alert--info admonition_node_modules-@docusaurus-theme-classic-lib-theme-Admonition-styles-module custom-drasyl-java-banner">
        <div class="admonitionHeading_node_modules-@docusaurus-theme-classic-lib-theme-Admonition-styles-module">
          <span class="admonitionIcon_node_modules-@docusaurus-theme-classic-lib-theme-Admonition-styles-module">
            <svg viewBox="0 0 14 16">
              <path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path>
            </svg>
          </span>
          drasyl-java documentation
        </div>
        <div class="admonitionContent_node_modules-@docusaurus-theme-classic-lib-theme-Admonition-styles-module">
          <p>You're viewing the documentation for the original <strong>drasyl</strong> project, now renamed to <strong>drasyl-java</strong>.<br>
          It provides a high-performance framework for building distributed applications.</p>
          <p>If you're looking for the new <strong>drasyl</strong> documentation, a secure, software-defined overlay network solution,<br>
please visit <a href="https://docs.drasyl.org">docs.drasyl.org</a>.</p>
        </div>
      </div>
    `;

    // Find the main content area to insert the banner
    const mainContent = document.querySelector('main .row .col');

    if (mainContent) {
      // Create a temporary container to parse the HTML
      const temp = document.createElement('div');
      temp.innerHTML = bannerHTML;
      const bannerElement = temp.firstElementChild;

      // Insert the banner at the beginning of the main content
      if (mainContent.firstChild) {
        mainContent.insertBefore(bannerElement, mainContent.firstChild);
      } else {
        mainContent.appendChild(bannerElement);
      }
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCustomAdmonition);
  } else {
    addCustomAdmonition();
  }

  // Also run on navigation events (for SPA behavior)
  if (typeof window !== 'undefined') {
    // Listen for navigation events
    window.addEventListener('load', addCustomAdmonition);
    
    // For Docusaurus navigation - check periodically for new content
    setInterval(function() {
      const mainContent = document.querySelector('main .row .col');
      if (mainContent && !mainContent.querySelector('.custom-drasyl-java-banner')) {
        addCustomAdmonition();
      }
    }, 250);
    
    // Also listen for popstate events (browser back/forward)
    window.addEventListener('popstate', function() {
      setTimeout(addCustomAdmonition, 100);
    });
    
    // Listen for pushstate/replacestate events
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      setTimeout(addCustomAdmonition, 100);
    };
    
    history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      setTimeout(addCustomAdmonition, 100);
    };
  }
})(); 