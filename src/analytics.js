// analytics.js - Google Analytics event helpers

export function trackEvent({ category, action, label, value }) {
  if (window.gtag && localStorage.getItem('fidga_ga_enabled') !== 'false') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    // Dispatch a custom event for local analytics panel
    window.dispatchEvent(new CustomEvent('fidga-analytics', {
      detail: { type: 'analytics-event', event: { category, action, label, value, ts: Date.now() } }
    }));
  }
}

export function trackPageView(page_path) {
  if (window.gtag && localStorage.getItem('fidga_ga_enabled') !== 'false') {
    window.gtag('event', 'page_view', {
      page_path,
    });
  }
}
