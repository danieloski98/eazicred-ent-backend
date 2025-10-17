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

function RejectCoachApplicationEmail({ firstName }: IProps): any {
  return (
    <Html>
      <Container style={styles.container}>
        <Text style={styles.heading}>Dear {firstName}!</Text>

        <Text style={styles.paragraph}>
          Thank you for taking the time to apply to the{' '}
          <strong>Ryzly Coaching Program.</strong>
        </Text>

        <Text style={styles.paragraph}>
          After carefully reviewing your application, we regret to inform you
          that you were not selected for this cohort. Please know that this
          decision was not easy — we received a high number of applications and
          had to make tough choices.
        </Text>

        <Text style={styles.paragraph}>
          This doesn’t mean the door is closed. We’d love to:
        </Text>

        <Text style={styles.listItem}>
          • Encourage you to <strong> apply again in the next 6 months</strong>
        </Text>
        <Text style={styles.listItem}>
          • Stay connected with the Ryzly community and keep exploring
          challenges as a talent
        </Text>
        <Text style={styles.listItem}>
          • Keep building your portfolio and skills — they’ll make your next
          application even stronger
        </Text>

        <Text style={styles.paragraph}>
          We truly appreciate your interest in helping learners grow through
          challenge-based learning, and we hope to see your application again
          soon.
        </Text>

        <Text style={styles.footer}>
          <br />
          <br />
          Warm regards,
          <br />
          The Ryzly Team
        </Text>
      </Container>
    </Html>
  );
}

export async function rejectCoachApplicationEmail(
  firstName: string,
): Promise<string> {
  return render(<RejectCoachApplicationEmail firstName={firstName} />);
}
