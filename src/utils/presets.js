export const CURRENCIES = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (NGN)' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)' },
  { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar (AUD)' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi (GHS)' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand (ZAR)' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling (KES)' }
];

export const INVOICE_PRESETS = [
  {
    id: 'web-app',
    name: 'Full-Stack Web Application (React + Node.js)',
    description: 'Custom React frontend, Express REST API, MongoDB Atlas database & Cloud deployment.',
    category: 'Engineering',
    badge: 'Popular',
    title: 'SOFTWARE DEVELOPMENT SERVICES INVOICE',
    currency: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (NGN)' },
    items: [
      {
        id: '1',
        description: 'Frontend Web Application (React + Vite + Modern UI/UX)',
        details: 'Interactive client dashboard, state management, responsive mobile views, and authentication.',
        quantity: 1,
        rate: 2500000,
        amount: 2500000
      },
      {
        id: '2',
        description: 'Backend REST API & Database Architecture (Node.js + MongoDB)',
        details: 'API security, JWT authentication, data schema optimization, and third-party webhooks integration.',
        quantity: 1,
        rate: 2000000,
        amount: 2000000
      },
      {
        id: '3',
        description: 'Cloud Infrastructure Setup & CI/CD Deployment',
        details: 'Production server provisioning, SSL certificates, staging environment, and automated backups.',
        quantity: 1,
        rate: 750000,
        amount: 750000
      }
    ],
    pricing: {
      discountType: 'percent',
      discountValue: 5,
      taxRate: 0,
      shipping: 0,
      deposit: 2500000
    },
    paymentDetails: {
      bankName: 'Access Bank PLC / Standard Chartered',
      accountName: 'Village Coders Tech Ltd',
      accountNumber: '0123456789',
      paymentTerms: '50% milestone advance paid, balance due upon final production release.',
      notes: 'Thank you for choosing Village Coders for your engineering needs!'
    }
  },
  {
    id: 'mobile-app',
    name: 'Cross-Platform Mobile App (iOS & Android)',
    description: 'React Native / Flutter mobile app development with push notifications & API sync.',
    category: 'Mobile',
    badge: 'Enterprise',
    title: 'MOBILE APPLICATION DEVELOPMENT INVOICE',
    currency: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (NGN)' },
    items: [
      {
        id: '1',
        description: 'Mobile App Core Engine & UI Screens',
        details: 'Pixel-perfect mobile UI, offline caching, push notifications, and biometric authentication.',
        quantity: 1,
        rate: 3800000,
        amount: 3800000
      },
      {
        id: '2',
        description: 'App Store & Google Play Publishing',
        details: 'Store compliance audit, privacy manifest configuration, app signing, and release management.',
        quantity: 1,
        rate: 650000,
        amount: 650000
      }
    ],
    pricing: {
      discountType: 'percent',
      discountValue: 0,
      taxRate: 0,
      shipping: 0,
      deposit: 2000000
    },
    paymentDetails: {
      bankName: 'Access Bank PLC',
      accountName: 'Village Coders Tech Ltd',
      accountNumber: '0987654321',
      paymentTerms: 'Payment due within 14 days of invoice issue date.',
      notes: 'Source code repository and store ownership will be transferred upon full settlement.'
    }
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design & Brand Identity System',
    description: 'Figma prototypes, design system components, high-fidelity wireframes.',
    category: 'Design',
    badge: 'Design',
    title: 'UI/UX DESIGN & BRANDING INVOICE',
    currency: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (NGN)' },
    items: [
      {
        id: '1',
        description: 'Comprehensive UX Audit & User Journey Mapping',
        details: 'User persona analysis, low-fidelity wireframing, and interactive user flow diagrams.',
        quantity: 1,
        rate: 950000,
        amount: 950000
      },
      {
        id: '2',
        description: 'High-Fidelity Figma Design System & UI Kit',
        details: 'Design tokens, auto-layout components, light & dark theme states, responsive mobile breakpoints.',
        quantity: 1,
        rate: 1650000,
        amount: 1650000
      }
    ],
    pricing: {
      discountType: 'percent',
      discountValue: 0,
      taxRate: 0,
      shipping: 0,
      deposit: 1000000
    },
    paymentDetails: {
      bankName: 'Access Bank PLC',
      accountName: 'Village Coders Tech Ltd',
      accountNumber: '0123456789',
      paymentTerms: 'Payment due on receipt.',
      notes: 'Full Figma source files and design handoff assets included.'
    }
  },
  {
    id: 'maintenance-retainer',
    name: 'Monthly Engineering & Cloud Retainer',
    description: 'Continuous bug fixes, security patches, uptime monitoring, server upkeep.',
    category: 'Retainer',
    badge: 'Recurring',
    title: 'MONTHLY ENGINEERING RETAINER INVOICE',
    currency: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (NGN)' },
    items: [
      {
        id: '1',
        description: 'Monthly Software Maintenance & 24/7 Uptime Monitoring',
        details: 'Security vulnerability patches, database indexing, automated backup checks, and dependency updates.',
        quantity: 1,
        rate: 650000,
        amount: 650000
      },
      {
        id: '2',
        description: 'Dedicated Feature Iteration Hours (20 Hours Block)',
        details: 'Ongoing UI tweaks, API extensions, bug resolutions, and performance optimizations.',
        quantity: 1,
        rate: 1100000,
        amount: 1100000
      }
    ],
    pricing: {
      discountType: 'fixed',
      discountValue: 100000,
      taxRate: 0,
      shipping: 0,
      deposit: 0
    },
    paymentDetails: {
      bankName: 'Access Bank PLC',
      accountName: 'Village Coders Tech Ltd',
      accountNumber: '0123456789',
      paymentTerms: 'Payment due at the 1st of every month for recurring service retainers.',
      notes: 'Retainer active for current billing cycle.'
    }
  }
];

export const DEFAULT_INVOICE_STATE = {
  invoiceNumber: '',
  title: 'INVOICE',
  status: 'pending',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: (() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  })(),
  poNumber: '',
  client: {
    name: 'Olami Tech Ventures',
    company: 'Olami Digital Solutions Ltd',
    email: 'billing@olamitech.com',
    phone: '+234 802 345 6789',
    address: '14 Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    country: 'Nigeria',
    taxId: 'TIN-9842104-001'
  },
  sender: {
    company: 'VILLAGE CODERS',
    tagline: 'WEB & SOFTWARE DEVELOPERS',
    email: 'villagecoders7@gmail.com',
    website: 'villagecoders.io',
    phone: '+234 808 5742 261',
    address: 'Fully Remote | Operating Worldwide'
  },
  currency: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira (NGN)' },
  items: [
    {
      id: 'item-1',
      description: 'Full-Stack Web Application Architecture & Development',
      details: 'Custom scalable SaaS frontend in React and high-performance microservices API with MongoDB database.',
      quantity: 1,
      rate: 3500000,
      amount: 3500000
    },
    {
      id: 'item-2',
      description: 'UI/UX Design System & Interactive Prototypes',
      details: 'Design system components, responsive mobile/tablet breakpoints, and interactive user flows.',
      quantity: 1,
      rate: 1200000,
      amount: 1200000
    },
    {
      id: 'item-3',
      description: 'Cloud Deployment, SSL Security & CI/CD Pipeline',
      details: 'Automated deployment pipelines, database clustering, monitoring alerts, and production go-live.',
      quantity: 1,
      rate: 800000,
      amount: 800000
    }
  ],
  pricing: {
    subtotal: 5500000,
    discountType: 'percent',
    discountValue: 5,
    discountAmount: 275000,
    taxRate: 0,
    taxAmount: 0,
    shipping: 0,
    deposit: 2500000,
    total: 5225000,
    balanceDue: 2725000
  },
  paymentDetails: {
    bankName: 'Access Bank PLC / Standard Chartered',
    accountName: 'Village Coders Tech Ltd',
    accountNumber: '0123456789',
    paymentTerms: 'Payment is due within 14 days of invoice issue date.',
    notes: 'Thank you for choosing Village Coders for your web & software engineering needs!'
  },
  signature: {
    type: 'typed',
    value: 'Village Coders Management',
    signerName: 'Village Coders Ltd',
    date: new Date().toISOString().split('T')[0]
  }
};
