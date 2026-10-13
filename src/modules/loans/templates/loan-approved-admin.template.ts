export interface LoanApprovedAdminEmailData {
  loan: {
    _id?: any;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    amount: number;
    purpose: string;
    tenure: number;
    interest: number;
    bvn: string;
    nin?: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
    additionalInformation?: string;
    utilityBills?: string[];
    bankRecords?: string[];
    companyId?: any;
    createdAt?: any;
  };
  company?: {
    _id?: any;
    name?: string;
    industry?: string;
  } | null;
  packageName?: string | null;
}

export interface LoanApprovedEmailContent {
  subject: string;
  text: string;
  html: string;
}

function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildLoanApprovedAdminEmail(
  data: LoanApprovedAdminEmailData,
): LoanApprovedEmailContent {
  const { loan, company, packageName } = data;

  const companyName = company?.name?.trim() || 'Company';
  const companyIndustry = company?.industry?.trim() || 'N/A';
  const companyIdStr = loan.companyId?.toString?.() ?? 'N/A';
  const loanIdStr = loan._id?.toString?.() ?? 'N/A';
  const applicantName = `${loan.firstName} ${loan.lastName}`.trim();
  const formattedAmount = `₦${Number(loan.amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const tenureStr = `${loan.tenure} ${loan.tenure === 1 ? 'month' : 'months'}`;
  const interestStr = `${loan.interest}%`;
  const ninStr = loan.nin?.trim() || 'N/A';
  const packageStr = packageName?.trim() || 'N/A';
  const additionalNotesStr = loan.additionalInformation?.trim() || 'None';

  const utilityBills = Array.isArray(loan.utilityBills) ? loan.utilityBills : [];
  const bankRecords = Array.isArray(loan.bankRecords) ? loan.bankRecords : [];

  const subject = `Loan Approved Notification - ${applicantName} (${companyName})`;

  const textLines = [
    `LOAN APPROVED BY COMPANY`,
    `========================================`,
    `A loan application has been approved by ${companyName} and requires admin review.`,
    ``,
    `LOAN DETAILS:`,
    `- Loan ID: ${loanIdStr}`,
    `- Status: APPROVED (by Company)`,
    `- Amount: ${formattedAmount}`,
    `- Purpose: ${loan.purpose}`,
    `- Tenure: ${tenureStr}`,
    `- Interest Rate: ${interestStr}`,
    `- Package: ${packageStr}`,
    `- Additional Info: ${additionalNotesStr}`,
    ``,
    `APPLICANT DETAILS:`,
    `- Full Name: ${applicantName}`,
    `- Email: ${loan.email}`,
    `- Phone: ${loan.phone}`,
    `- BVN: ${loan.bvn}`,
    `- NIN: ${ninStr}`,
    ``,
    `COMPANY DETAILS:`,
    `- Company Name: ${companyName}`,
    `- Industry: ${companyIndustry}`,
    `- Company ID: ${companyIdStr}`,
    ``,
    `DISBURSEMENT BANK DETAILS:`,
    `- Bank Name: ${loan.bankName}`,
    `- Account Number: ${loan.accountNumber}`,
    `- Account Name: ${loan.accountName}`,
    ``,
    `DOCUMENTS:`,
    `- Utility Bills: ${utilityBills.length > 0 ? utilityBills.join(', ') : 'None'}`,
    `- Bank Records: ${bankRecords.length > 0 ? bankRecords.join(', ') : 'None'}`,
    ``,
    `Please log in to the admin dashboard to review and fund this loan.`,
  ];
  const text = textLines.join('\n');

  const renderDocLinks = (docs: string[], label: string) => {
    if (!docs || docs.length === 0) {
      return `<span style="color: #94a3b8; font-style: italic;">None provided</span>`;
    }
    return docs
      .map(
        (url, idx) =>
          `<a href="${escapeHtml(url)}" target="_blank" style="display: inline-block; margin-right: 8px; margin-bottom: 4px; color: #2563eb; text-decoration: underline; font-weight: 500;">${escapeHtml(label)} #${idx + 1}</a>`,
      )
      .join(' ');
  };

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 24px 28px; background-color: #0f172a; color: #ffffff;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: #ffffff;">Eazicred Enterprise</div>
                    <div style="font-size: 13px; color: #94a3b8; margin-top: 2px;">Administrator Notification</div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 9999px; background-color: #10b981; color: #ffffff;">
                      Approved by Company
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Banner -->
          <tr>
            <td style="padding: 20px 28px; background-color: #ecfdf5; border-bottom: 1px solid #d1fae5;">
              <div style="font-size: 14px; color: #065f46; line-height: 1.5;">
                A loan application for <strong>${escapeHtml(applicantName)}</strong> has been <strong>approved</strong> by <strong>${escapeHtml(companyName)}</strong>. Please review the details below to proceed with administrative funding.
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px;">

              <!-- Amount Highlight Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; background-color: #f1f5f9; border-radius: 8px; border: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px;">Approved Amount</div>
                    <div style="font-size: 26px; font-weight: 700; color: #0f172a; margin-top: 4px;">${escapeHtml(formattedAmount)}</div>
                    <div style="font-size: 13px; color: #475569; margin-top: 4px;">Tenure: <strong>${escapeHtml(tenureStr)}</strong> &bull; Interest: <strong>${escapeHtml(interestStr)}</strong></div>
                  </td>
                </tr>
              </table>

              <!-- Loan Details Section -->
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
                Loan Details
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px; margin-bottom: 24px;">
                <tr>
                  <td width="35%" style="color: #64748b; font-weight: 500;">Loan ID:</td>
                  <td width="65%" style="color: #0f172a; font-family: monospace; font-size: 12px;">${escapeHtml(loanIdStr)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">Purpose:</td>
                  <td style="color: #0f172a;">${escapeHtml(loan.purpose)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">Package:</td>
                  <td style="color: #0f172a;">${escapeHtml(packageStr)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">Additional Info:</td>
                  <td style="color: #0f172a;">${escapeHtml(additionalNotesStr)}</td>
                </tr>
              </table>

              <!-- Applicant Details Section -->
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
                Applicant Information
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px; margin-bottom: 24px;">
                <tr>
                  <td width="35%" style="color: #64748b; font-weight: 500;">Full Name:</td>
                  <td width="65%" style="color: #0f172a; font-weight: 600;">${escapeHtml(applicantName)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">Email:</td>
                  <td style="color: #0f172a;"><a href="mailto:${escapeHtml(loan.email)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(loan.email)}</a></td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">Phone:</td>
                  <td style="color: #0f172a;"><a href="tel:${escapeHtml(loan.phone)}" style="color: #2563eb; text-decoration: none;">${escapeHtml(loan.phone)}</a></td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">BVN:</td>
                  <td style="color: #0f172a; font-family: monospace;">${escapeHtml(loan.bvn)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">NIN:</td>
                  <td style="color: #0f172a; font-family: monospace;">${escapeHtml(ninStr)}</td>
                </tr>
              </table>

              <!-- Company Details Section -->
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
                Company Information
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px; margin-bottom: 24px;">
                <tr>
                  <td width="35%" style="color: #64748b; font-weight: 500;">Company Name:</td>
                  <td width="65%" style="color: #0f172a; font-weight: 600;">${escapeHtml(companyName)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">Industry:</td>
                  <td style="color: #0f172a;">${escapeHtml(companyIndustry)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">Company ID:</td>
                  <td style="color: #0f172a; font-family: monospace; font-size: 12px;">${escapeHtml(companyIdStr)}</td>
                </tr>
              </table>

              <!-- Disbursement Bank Account Details -->
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
                Disbursement Account Details
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px; margin-bottom: 24px;">
                <tr>
                  <td width="35%" style="color: #64748b; font-weight: 500;">Bank Name:</td>
                  <td width="65%" style="color: #0f172a; font-weight: 600;">${escapeHtml(loan.bankName)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">Account Number:</td>
                  <td style="color: #0f172a; font-family: monospace; font-weight: 600; font-size: 14px;">${escapeHtml(loan.accountNumber)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">Account Name:</td>
                  <td style="color: #0f172a;">${escapeHtml(loan.accountName)}</td>
                </tr>
              </table>

              <!-- Uploaded Documents -->
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;">
                Uploaded Documents
              </div>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px; margin-bottom: 24px;">
                <tr>
                  <td width="35%" style="color: #64748b; font-weight: 500;">Utility Bills:</td>
                  <td width="65%">${renderDocLinks(utilityBills, 'Utility Bill')}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-weight: 500;">Bank Records:</td>
                  <td>${renderDocLinks(bankRecords, 'Bank Record')}</td>
                </tr>
              </table>

              <!-- Call to Action Banner -->
              <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 16px; text-align: center; margin-top: 12px;">
                <p style="margin: 0; font-size: 13px; color: #475569;">
                  Please visit the <strong>Eazicred Admin Dashboard</strong> to review this approved loan and proceed with funding.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 28px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; ${new Date().getFullYear()} Eazicred. All rights reserved. This is an automated administrative notification.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, text, html };
}
