/* ============================================================
   HURLEY ENTERPRISE LLC — SEO Schema Engine
   js/seo-schema.js
   ============================================================ */
(function () {
  'use strict';
  const SITE_URL  = 'https://www.hurleyenterprisellc.com';
  const SITE_NAME = 'Hurley Enterprise LLC';

  const organization = {
    '@type': ['Organization','LocalBusiness','RealEstateAgent'],
    '@id': SITE_URL + '/#organization',
    name: SITE_NAME,
    legalName: 'Hurley Enterprise LLC',
    url: SITE_URL,
    description: "Bristol TN/VA's premier commercial real estate developer and leasing company. Ground-up construction, historic renovation, office & warehouse leasing, and cash property acquisition since 2004.",
    foundingDate: '2004',
    telephone: '+14237427219',
    email: 'info@hurleyenterprisellc.com',
    priceRange: '$$',
    address: { '@type': 'PostalAddress', streetAddress: '100 5th St., Suite 2W', addressLocality: 'Bristol', addressRegion: 'TN', postalCode: '37620', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: 36.5951, longitude: -82.1887 },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:30', closes: '17:00' }],
    areaServed: [
      { '@type': 'City', name: 'Bristol', containedInPlace: { '@type': 'State', name: 'Tennessee' } },
      { '@type': 'City', name: 'Bristol', containedInPlace: { '@type': 'State', name: 'Virginia' } },
      { '@type': 'City', name: 'Kingsport', containedInPlace: { '@type': 'State', name: 'Tennessee' } },
      { '@type': 'City', name: 'Johnson City', containedInPlace: { '@type': 'State', name: 'Tennessee' } }
    ]
  };

  const website = {
    '@type': 'WebSite',
    '@id': SITE_URL + '/#website',
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { '@id': SITE_URL + '/#organization' },
    potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: SITE_URL + '/for-sale-lease.html?q={search_term_string}' }, 'query-input': 'required name=search_term_string' },
    inLanguage: 'en-US'
  };

  const path = window.location.pathname;
  const schemas = [organization, website];

  if (path === '/' || path.endsWith('index.html') || path === '') {
    schemas.push({
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What commercial spaces does Hurley Enterprise LLC have for lease in Bristol TN?', acceptedAnswer: { '@type': 'Answer', text: 'Hurley Enterprise LLC offers office suites from 120 sqft to 6,000 sqft at City Centre (100 5th St), restaurant/retail space at 628 State Street (8,500 sqft), professional offices at Jamestown @ Shelby (815 Shelby St), and retail units at Center Point near the Hard Rock Casino in Bristol VA.' } },
        { '@type': 'Question', name: 'How is the Hard Rock Casino affecting commercial real estate in Bristol VA?', acceptedAnswer: { '@type': 'Answer', text: 'The Hard Rock Hotel & Casino Bristol VA is the single largest economic catalyst in the Bristol MSA. Retail vacancy on the State Street/Commonwealth Ave corridor dropped from 18% to 11% in 12 months. Demand for office, retail, and warehouse space near the casino is at historic highs.' } },
        { '@type': 'Question', name: 'Will Hurley Enterprise LLC buy my property in Bristol TN?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Hurley Enterprise LLC purchases residential and commercial properties across Bristol TN/VA, Kingsport, and Johnson City. We make cash offers with no repairs required and can close in as little as 14 days.' } },
        { '@type': 'Question', name: 'Does Hurley Enterprise LLC do commercial construction in Bristol TN?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Hurley Enterprise LLC has been a licensed commercial developer and contractor in the Tri-Cities since 2004, offering ground-up construction, tenant improvement, historic renovation, and site development across Bristol TN/VA.' } }
      ]
    });
  }

  if (path.includes('for-sale-lease')) {
    schemas.push({
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What office space is available for lease at City Centre Bristol TN?', acceptedAnswer: { '@type': 'Answer', text: 'City Centre at 100 5th Street Bristol TN offers Class A office suites from 120 to 6,000 sqft with all-inclusive rent covering utilities, cleaning, security and fitness access.' } },
        { '@type': 'Question', name: 'Is 628 State Street Bristol TN available for lease?', acceptedAnswer: { '@type': 'Answer', text: '628 State Street Bristol TN is an 8,500 sqft commercial space available for lease, featuring a bar build-out, mezzanine, and commercial kitchen infrastructure — ideal for a restaurant, bar, or entertainment venue.' } },
        { '@type': 'Question', name: 'What is Center Point in Bristol VA near the Hard Rock Casino?', acceptedAnswer: { '@type': 'Answer', text: 'Center Point is a premier commercial development on Commonwealth Ave in Bristol VA, located directly across from the Hard Rock Hotel & Casino Bristol. Multiple retail and office units available for lease in the fastest-growing commercial corridor in the Tri-Cities.' } }
      ]
    });
  }

  const script = document.createElement('script');
  script.type  = 'application/ld+json';
  script.text  = JSON.stringify({ '@context': 'https://schema.org', '@graph': schemas });
  document.head.appendChild(script);
})();
