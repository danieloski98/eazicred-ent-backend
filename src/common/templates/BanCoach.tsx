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

function BanCoachEmail({ firstName }: IProps): any {
  return (
    <Html>
      <Container style={styles.container}>
        <Text style={styles.heading}>Dear {firstName}!</Text>

        <Text style={styles.paragraph}>
          We regret to inform you that your{' '}
          <strong>Ryzly Coach account has been temporary suspended </strong>{' '}
          effective immediately.
        </Text>

        <Text style={styles.paragraph}>
          This action was taken due to violations of our{' '}
          <strong>Ryzly Coach Guidelines and Community Standards,</strong> which
          all coaches agree to uphold. These guidelines exist to ensure
          fairness, safety, and a high-quality experience for learners and
          fellow coaches on the platform.
        </Text>

        <Text style={styles.paragraph}>
          As a result of this suspension, you will no longer be able to:
        </Text>

        <Text style={styles.listItem}>• Create or manage challenges</Text>
        <Text style={styles.listItem}>
          • Interact with learners in a coaching capacity
        </Text>
        <Text style={styles.listItem}>
          • Access earnings or recognition features tied to your account
        </Text>

        <Text style={styles.listItem}>
          • If you believe this decision was made in error, you may{' '}
          <string>appeal within 7 days</string> by replying to this email with
          supporting details. After this window, the decision will be considered
          final.
        </Text>

        <Text style={styles.paragraph}>
          We value the integrity of our community and thank you for your
          understanding.
        </Text>

        <Text style={styles.footer}>
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

export async function banCoachEmail(firstName: string): Promise<string> {
  return render(<BanCoachEmail firstName={firstName} />);
}
