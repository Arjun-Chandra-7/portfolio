'use client';

import portfolioMarkup from '@/data/portfolioMarkup.json';

export default function PortfolioSections() {
  return <div className="portfolio-sections" dangerouslySetInnerHTML={{ __html: portfolioMarkup.html }} />;
}
