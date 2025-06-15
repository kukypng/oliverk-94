
import { User } from '@/types/user';

const CSV_HEADERS = [
  'ID',
  'Nome',
  'Email',
  'Função (Role)',
  'Status',
  'Data de Expiração',
  'Data de Criação',
  'Último Login',
  'Qtd. Orçamentos'
];

// Helper to format date strings
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('pt-BR');
  } catch (e) {
    return 'Data Inválida';
  }
};

export const generateUsersExportCsv = (users: User[]): string => {
  const header = CSV_HEADERS.join(';');
  
  const rows = users.map(user => {
    const status = user.is_active ? 'Ativo' : 'Inativo';
    
    const rowData = [
      user.id,
      `"${user.name.replace(/"/g, '""')}"`, // Handle quotes in name
      user.email,
      user.role,
      status,
      formatDate(user.expiration_date),
      formatDate(user.created_at),
      formatDate(user.last_sign_in_at),
      user.budget_count
    ];
    
    return rowData.join(';');
  });

  // BOM for Excel compatibility with UTF-8
  const BOM = '\uFEFF';
  return BOM + [header, ...rows].join('\n');
};
