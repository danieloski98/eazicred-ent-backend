import { buildLoanApprovedAdminEmail } from './loan-approved-admin.template';

describe('buildLoanApprovedAdminEmail', () => {
  const mockData = {
    loan: {
      _id: '670aa1112223334445556667',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+2348011223344',
      amount: 150000,
      purpose: 'Medical Emergency',
      tenure: 6,
      interest: 3.5,
      bvn: '22334455667',
      nin: '11223344556',
      bankName: 'First Bank',
      accountNumber: '0123456789',
      accountName: 'Jane Smith',
      additionalInformation: 'Requires urgent processing',
      utilityBills: ['https://example.com/bills/bill1.pdf'],
      bankRecords: ['https://example.com/statements/bank1.pdf'],
      companyId: '670bb1112223334445556668',
    },
    company: {
      _id: '670bb1112223334445556668',
      name: 'Acme Global Corp',
      industry: 'Technology',
    },
    packageName: 'Staff Medical Package',
  };

  it('should generate subject, text and html with all details', () => {
    const result = buildLoanApprovedAdminEmail(mockData);

    // Subject
    expect(result.subject).toContain('Loan Approved Notification');
    expect(result.subject).toContain('Jane Smith');
    expect(result.subject).toContain('Acme Global Corp');

    // Plain text content
    expect(result.text).toContain('LOAN APPROVED BY COMPANY');
    expect(result.text).toContain('Jane Smith');
    expect(result.text).toContain('jane.smith@example.com');
    expect(result.text).toContain('+2348011223344');
    expect(result.text).toContain('22334455667');
    expect(result.text).toContain('11223344556');
    expect(result.text).toContain('Acme Global Corp');
    expect(result.text).toContain('Technology');
    expect(result.text).toContain('670aa1112223334445556667');
    expect(result.text).toContain('₦150,000.00');
    expect(result.text).toContain('Medical Emergency');
    expect(result.text).toContain('6 months');
    expect(result.text).toContain('3.5%');
    expect(result.text).toContain('Staff Medical Package');
    expect(result.text).toContain('Requires urgent processing');
    expect(result.text).toContain('First Bank');
    expect(result.text).toContain('0123456789');
    expect(result.text).toContain('https://example.com/bills/bill1.pdf');
    expect(result.text).toContain('https://example.com/statements/bank1.pdf');

    // HTML content
    expect(result.html).toContain('Jane Smith');
    expect(result.html).toContain('Acme Global Corp');
    expect(result.html).toContain('Technology');
    expect(result.html).toContain('₦150,000.00');
    expect(result.html).toContain('Medical Emergency');
    expect(result.html).toContain('First Bank');
    expect(result.html).toContain('0123456789');
    expect(result.html).toContain('Staff Medical Package');
    expect(result.html).toContain('href="https://example.com/bills/bill1.pdf"');
    expect(result.html).toContain('href="https://example.com/statements/bank1.pdf"');
  });

  it('should handle optional and missing fields gracefully', () => {
    const minimalData = {
      loan: {
        _id: '670aa9998887776665554443',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '12345',
        amount: 5000,
        purpose: 'Education',
        tenure: 1,
        interest: 0,
        bvn: '12345678901',
        bankName: 'GTBank',
        accountNumber: '9876543210',
        accountName: 'John Doe',
      },
      company: null,
      packageName: null,
    };

    const result = buildLoanApprovedAdminEmail(minimalData);

    expect(result.subject).toContain('John Doe (Company)');
    expect(result.text).toContain('1 month');
    expect(result.text).toContain('None');
    expect(result.html).toContain('None provided');
    expect(result.html).toContain('GTBank');
    expect(result.html).toContain('9876543210');
  });
});
