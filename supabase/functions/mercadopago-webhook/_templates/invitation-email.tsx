
import React from 'npm:react@18.3.1';
import { Html, Head, Preview, Body, Container, Img, Heading, Text, Button, Hr, Tailwind } from 'npm:@react-email/components@0.0.22';

interface InvitationEmailProps {
  name: string;
  confirmationUrl: string;
}

export const InvitationEmail: React.FC<Readonly<InvitationEmailProps>> = ({ name, confirmationUrl }) => (
  <Html>
    <Head />
    <Preview>Bem-vindo ao Oliver! Defina sua senha.</Preview>
    <Tailwind>
      <Body className="bg-gray-100 font-sans">
        <Container className="bg-white border border-gray-200 rounded-lg my-10 mx-auto p-8 w-full max-w-[600px]">
          <Img src="https://oghjlypdnmqecaavekyr.supabase.co/storage/v1/object/public/assets/icone.png" width="48" height="48" alt="Oliver Logo" className="mx-auto" />
          
          <Heading className="text-2xl font-bold text-center mt-6 mb-4">Bem-vindo(a) ao Oliver, {name || 'novo usuário'}!</Heading>
          
          <Text className="text-gray-600 text-base leading-6 text-center">
            Sua assinatura foi confirmada! Para acessar sua conta pela primeira vez, você precisa definir uma senha. Clique no botão abaixo para criar sua senha de forma segura.
          </Text>
          
          <div className="text-center my-8">
            <Button href={confirmationUrl} className="bg-blue-600 text-white font-semibold rounded-md py-3 px-6">
              Definir Minha Senha e Acessar
            </Button>
          </div>
          
          <Text className="text-gray-600 text-base leading-6">
            Se o botão não funcionar, copie e cole o seguinte link no seu navegador:
          </Text>
          <Text className="text-blue-600 text-sm break-all">{confirmationUrl}</Text>
          
          <Hr className="border-gray-300 my-6" />
          
          <Text className="text-gray-500 text-sm">
            Este é um convite para configurar sua conta na plataforma Oliver. Se você não realizou uma assinatura, pode ignorar este e-mail com segurança.
          </Text>
          
          <Text className="text-gray-500 text-sm text-center mt-8">
            © 2025 Oliver | Sistema de Gestão Profissional
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default InvitationEmail;
