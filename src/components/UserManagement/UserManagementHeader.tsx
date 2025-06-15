
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { DebugInfo } from '@/types/user';

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debugInfo: DebugInfo | null;
  showDebugInfo: boolean;
  setShowDebugInfo: (show: boolean) => void;
}

export const UserManagementHeader = ({ searchTerm, setSearchTerm, debugInfo, showDebugInfo, setShowDebugInfo }: Props) => (
  <CardHeader>
    <CardTitle className="flex items-center justify-between">
      <span>Gerenciar Usuários</span>
      <div className="flex items-center space-x-2">
        {debugInfo && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            className="text-xs"
          >
            Debug
          </Button>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
      </div>
    </CardTitle>
  </CardHeader>
);
