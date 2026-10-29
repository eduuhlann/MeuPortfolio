import { useEffect, useState } from 'react';

export function usePortfolioLanguage() {
  const [english, setEnglish] = useState(document.documentElement.dataset.lang === 'en');

  useEffect(() => {
    const observer = new MutationObserver(() => setEnglish(document.documentElement.dataset.lang === 'en'));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.dispatchEvent(new Event('portfolio:content-ready'));
    document.dispatchEvent(new Event('portfolio:layout-change'));
  }, [english]);

  return english;
}
