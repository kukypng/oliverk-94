
# Sistema de Gestão de Orçamentos

Um sistema completo para gestão de orçamentos de assistência técnica, desenvolvido com React, TypeScript e Supabase.

## 🚀 Funcionalidades

- **Gestão de Orçamentos**: Criação, edição e visualização de orçamentos
- **Geração de PDF**: Criação automática de orçamentos em PDF
- **Integração WhatsApp**: Compartilhamento direto de orçamentos via WhatsApp
- **Gestão de Usuários**: Sistema completo de autenticação e controle de acesso
- **Dashboard Analytics**: Visualização de métricas e estatísticas
- **Alertas de Orçamento**: Notificações para orçamentos vencidos
- **Configurações Personalizáveis**: Customização de empresa e perfil
- **Design Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Tema Claro/Escuro**: Suporte a múltiplos temas

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI/UX**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Roteamento**: React Router DOM
- **Gerenciamento de Estado**: TanStack Query
- **Geração de PDF**: jsPDF + pdf-lib
- **Notificações**: Sonner
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Formulários**: React Hook Form + Zod

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (para backend)

## 🏗️ Instalação e Configuração

1. **Clone o repositório**:
```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_PROJETO>
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure as variáveis de ambiente**:
```bash
# Crie um arquivo .env.local na raiz do projeto
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. **Configure o Supabase**:
   - Crie um novo projeto no Supabase
   - Execute as migrações SQL disponíveis na pasta `supabase/migrations/`
   - Configure as políticas RLS (Row Level Security)

5. **Inicie o servidor de desenvolvimento**:
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:8080`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── adaptive/       # Componentes responsivos
│   ├── budgets/        # Componentes específicos de orçamentos
│   └── dashboard/      # Componentes do dashboard
├── hooks/              # Hooks customizados
├── pages/              # Páginas da aplicação
├── utils/              # Utilitários e helpers
├── contexts/           # Contextos React
├── integrations/       # Integrações externas (Supabase)
└── types/              # Definições de tipos TypeScript
```

## 🎯 Principais Recursos

### Gestão de Orçamentos
- Criação de orçamentos com informações detalhadas
- Cálculo automático de valores e parcelas
- Status de aprovação e controle de validade
- Busca e filtragem avançada

### Geração de PDF
- Templates personalizáveis
- Informações da empresa
- Logo e identidade visual
- Exportação automática

### Dashboard Analytics
- Métricas de performance
- Gráficos interativos
- Resumo financeiro
- Estatísticas de conversão

### Sistema de Usuários
- Autenticação segura
- Controle de acesso por níveis
- Gestão de perfis
- Histórico de atividades

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint do código
npm run lint
```

## 🌐 Deploy

### Deploy no Lovable
1. Clique no botão "Publish" no editor Lovable
2. Configure o domínio personalizado (se necessário)

### Deploy Manual
1. Execute o build: `npm run build`
2. Faça deploy da pasta `dist/` para seu provedor de hospedagem
3. Configure as variáveis de ambiente no ambiente de produção

## 📱 Recursos Mobile

- Interface totalmente responsiva
- Navegação otimizada para touch
- Acesso rápido a funcionalidades principais
- Compatibilidade com PWA

## 🔐 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) configurado
- Validação de dados com Zod
- Sanitização de inputs

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte e dúvidas:
- Abra uma issue no repositório
- Consulte a documentação do Supabase
- Verifique os logs do console para debugging

## 📊 Status do Projeto

✅ Autenticação e autorização
✅ CRUD de orçamentos
✅ Geração de PDF
✅ Dashboard analytics
✅ Interface responsiva
✅ Integração WhatsApp
✅ Sistema de notificações
🔄 Melhorias de performance
🔄 Testes automatizados

---

Desenvolvido com ❤️ usando Lovable
