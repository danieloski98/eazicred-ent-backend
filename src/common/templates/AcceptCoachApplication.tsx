import { Container, Text, Html, Button, render } from '@react-email/components';

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

function AcceptCoachApplicationEmail({ firstName }: IProps): any {
  return (
    <Html>
      <Container style={styles.container}>
        <Text style={styles.heading}>Welcome aboard, {firstName}!</Text>

        <Text style={styles.paragraph}>
          After reviewing your application, we’re thrilled to welcome you to the{' '}
          <strong>Ryzly Coaching Program</strong>! 🚀
        </Text>

        <Text style={styles.paragraph}>
          As a Ryzly Coach, you now have the opportunity to:
        </Text>

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
          We’re excited to see the impact you’ll make by guiding learners
          through challenge-based, hands-on experiences.
        </Text>

        <div style={{ textAlign: 'center' }}>
          <Button
            href="https://app.ryzly.com/create-challenge"
            style={styles.button}
          >
            Start Creating Challenges →
          </Button>
        </div>

        <Text style={styles.footer}>
          The future of learning is challenge-based — and you’re now one of the
          builders.
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

export async function acceptCoachApplicationEmail(
  firstName: string,
): Promise<string> {
  return render(<AcceptCoachApplicationEmail firstName={firstName} />);
}
