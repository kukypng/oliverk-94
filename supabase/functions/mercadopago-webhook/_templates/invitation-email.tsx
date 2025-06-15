
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface InvitationEmailProps {
  userName: string;
  invitationLink: string;
}

export const InvitationEmail = ({ userName, invitationLink }: InvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>Bem-vindo ao Oliver! Complete seu cadastro.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={heading}>Oliver</Heading>
        <Heading style={subheading}>Bem-vindo a bordo, {userName}!</Heading>
        <Section style={box}>
          <Text style={paragraph}>
            Seu pagamento foi confirmado e sua conta foi criada com sucesso. Estamos felizes em ter você conosco.
          </Text>
          <Text style={paragraph}>
            Para começar a usar a plataforma e transformar a gestão da sua assistência técnica, por favor, clique no botão abaixo para definir sua senha e acessar seu painel.
          </Text>
          <Button style={button} href={invitationLink}>
            Configurar Minha Senha e Acessar
          </Button>
          <Hr style={hr} />
          <Text style={paragraph}>
            Se você tiver qualquer problema ou dúvida, não hesite em nos contatar respondendo a este email ou através do nosso suporte via WhatsApp.
          </Text>
          <Text style={paragraph}>— A equipe Oliver</Text>
        </Section>
        <Text style={footer}>
          Oliver - Sistema profissional para gestão de orçamentos.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default InvitationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  maxWidth: '465px',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  color: '#1a1a1a',
  marginTop: '30px',
  marginBottom: '10px'
};

const subheading = {
  fontSize: '22px',
  fontWeight: 'normal',
  textAlign: 'center' as const,
  color: '#1a1a1a',
  marginTop: '0px',
  marginBottom: '30px'
};

const box = {
  padding: '0 24px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const button = {
  backgroundColor: '#2563eb', // primary blue
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '24px 0'
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};
