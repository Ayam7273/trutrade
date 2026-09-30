export const contactHeroContent = {
  titleLines: ['Get in touch with us.', "We're here to assist you."],
  body: 'Have a question about an account or a trade? Describe what you need help with using the form below.',
  image: '/assets/images/contact-page-hero-img.png',
  nameLabel: 'Name',
  namePlaceholder: 'Name',
  emailLabel: 'Email*',
  emailPlaceholder: 'Email',
  messageLabel: 'Message*',
  messagePlaceholder: 'Message',
  submit: 'Send Message',
  emailError: 'Please enter a valid email address.',
  messageError: 'Please enter a message.',
};

export const contactInfoContent = {
  label: 'Before you get in touch',
  title: 'A few details can help clarify a transaction question.',
  body: 'Include the transaction reference, what you expected to happen, and what happened instead. Never include your password, one-time codes, or full payment-card details.',
};

export const faqContent = {
  title: 'Frequently Asked Questions',
  items: [
    {
      number: '01',
      question: 'How does escrow protect a transaction?',
      answer:
        'The buyer and seller agree on the transaction terms first. The buyer funds the escrow, and the money stays held until delivery is confirmed against those terms.',
    },
    {
      number: '02',
      question: 'When is payment released to the seller?',
      answer:
        'Payment is released after the buyer confirms that the agreed goods or services have been delivered. If there is a disagreement, the transaction can be reviewed through the dispute process.',
    },
    {
      number: '03',
      question: 'What should both sides agree before funding?',
      answer:
        'Confirm what is being sold, the amount and currency, delivery method and timing, and how completion will be confirmed. Clear terms make expectations easier to check.',
    },
    {
      number: '04',
      question: 'Does TruTrade arrange shipping?',
      answer:
        'Buyers and sellers arrange delivery directly and should include the delivery terms in their agreement. TruTrade provides the escrow payment flow for the transaction.',
    },
    {
      number: '05',
      question: 'Which currencies can I use?',
      answer:
        'TruTrade is designed for UK-Nigeria trade and supports GBP, NGN, and USD in its multi-currency wallet.',
    },
    {
      number: '06',
      question: 'What happens if a transaction is disputed?',
      answer:
        'The buyer and seller can provide information about the agreed terms and what happened. TruTrade describes its dispute process as a neutral review before funds are released.',
    },
  ],
};
