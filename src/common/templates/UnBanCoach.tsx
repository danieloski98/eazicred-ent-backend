import { Container, Text, Html, render } from '@react-email/components';

interface IProps {
  firstName: string;
}

const styles = {
  container: {
    padding: '40px 20px',
    background: '#ffffff',
    borderRadius: '5px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Helvetica, Arial, sans-serif',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    color: '#1a73e8',
    marginBottom: '20px',
  },
  paragraph: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#333333',
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  listItem: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#333333',
    marginBottom: '10px',
    textAlign: 'center' as const,
  },
  button: {
    backgroundColor: '#1a73e8',
    color: '#ffffff',
    fontSize: '16px',
    padding: '12px 24px',
    borderRadius: '4px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '20px',
  },
  footer: {
    fontSize: '14px',
    color: '#666666',
    textAlign: 'center' as const,
    marginTop: '40px',
  },
};

function UnBanCoachEmail({ firstName }: IProps): any {
  return (
    <Html>
      <Container style={styles.container}>
        <Text style={styles.heading}>Welcome aboard, {firstName}!</Text>

        <Text style={styles.paragraph}>
          We’re pleased to inform you that after a thorough review, your{' '}
          <strong>Ryzly Coach account has been reinstated.</strong>! 🎉
        </Text>

        <Text style={styles.paragraph}>You can now once again:</Text>

        <Text style={styles.listItem}>
          • ✅ Create and manage your own challenges
        </Text>
        <Text style={styles.listItem}>
          • 🌍 Inspire and support talents worldwide
        </Text>
        <Text style={styles.listItem}>
          • 🏅 Gain recognition for your mentorship
        </Text>
        <Text style={styles.listItem}>• 💰 Monetize your knowledge</Text>
        <Text style={styles.listItem}>
          • 👥 Build and grow your own community
        </Text>

        <Text style={styles.paragraph}>
          Please note that while your account is active again, we encourage you
          to carefully review our{' '}
          <strong>Coach Guidelines and Community Standards</strong> to avoid
          future disruptions. We’re excited to have you back on the platform and
          look forward to the positive impact you’ll continue to make.
        </Text>

        <Text style={styles.footer}>
          Welcome back to Ryzly! 🚀
          <br />
          <br />
          Sincerely,
          <br />
          The Ryzly Team
        </Text>
      </Container>
    </Html>
  );
}

export async function unBanCoachEmail(firstName: string): Promise<string> {
  return render(<UnBanCoachEmail firstName={firstName} />);
}
