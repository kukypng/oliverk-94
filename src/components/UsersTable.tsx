import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Settings, FileText, CalendarClock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User } from '@/types/user';

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onRenew: (user: User) => void;
}

export const UsersTable = ({ users, onEdit, onDelete, onRenew }: UsersTableProps) => {
  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (user: User) => {
    const now = new Date();
    const expiration = new Date(user.expiration_date);
    const isExpired = expiration < now;
    
    if (!user.is_active) {
      return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
    }
    if (isExpired) {
      return <Badge className="bg-red-100 text-red-800">Expirado</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Orçamentos</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{getStatusBadge(user)}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-1">
                <FileText className="h-3.5 w-3.5" />
                <span>{user.budget_count}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-1">
                      <h4 className="font-medium leading-none">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="grid grid-cols-2 items-center">
                        <strong>Função:</strong>
                        <Badge className={`${getRoleBadge(user.role)} justify-self-start`}>
                          {user.role === 'admin' ? 'Administrador' : 
                           user.role === 'manager' ? 'Gerente' : 'Usuário'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <strong>Expira em:</strong>
                        <span>{format(new Date(user.expiration_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                       <div className="grid grid-cols-2 items-center">
                        <strong>Criado em:</strong>
                        <span>{format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <strong>Último login:</strong>
                        <span>
                          {user.last_sign_in_at 
                            ? format(new Date(user.last_sign_in_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }) 
                            : 'Nunca'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => onRenew(user)}>
                        <CalendarClock className="h-4 w-4 mr-1" /> Renovar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                        <Edit className="h-4 w-4 mr-1" /> Editar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onDelete(user)}>
                        <Trash2 className="h-4 w-4 mr-1" /> Deletar
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
