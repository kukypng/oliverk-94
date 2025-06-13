
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useShopProfile } from '@/hooks/useShopProfile';
import { Building2, Save, Upload, X, Image } from 'lucide-react';

export const CompanySettings = () => {
  const { 
    shopProfile, 
    isLoading, 
    saveProfile, 
    isSaving,
    uploadLogo,
    isUploadingLogo,
    removeLogo,
    isRemovingLogo
  } = useShopProfile();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    shop_name: '',
    cnpj: '',
    address: '',
    contact_phone: '',
  });

  useEffect(() => {
    if (shopProfile) {
      setFormData({
        shop_name: shopProfile.shop_name || '',
        cnpj: shopProfile.cnpj || '',
        address: shopProfile.address || '',
        contact_phone: shopProfile.contact_phone || '',
      });
    }
  }, [shopProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveProfile(formData);
  };

  const formatCNPJ = (value: string) => {
    // Remove non-numeric characters
    const numeric = value.replace(/\D/g, '');
    
    // Apply CNPJ mask: XX.XXX.XXX/XXXX-XX
    if (numeric.length <= 14) {
      return numeric.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
        '$1.$2.$3/$4-$5'
      );
    }
    
    return numeric.substring(0, 14).replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    handleInputChange('cnpj', formatted);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadLogo(file);
    }
  };

  const handleRemoveLogo = () => {
    removeLogo();
  };

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Building2 className="h-5 w-5 mr-2 text-primary" />
            Informações da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card animate-scale-in">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Building2 className="h-5 w-5 mr-2 text-primary" />
          Informações da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Logo Section */}
        <div className="space-y-2">
          <Label>Logo da Empresa</Label>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              {shopProfile?.logo_url ? (
                <img 
                  src={shopProfile.logo_url} 
                  alt="Logo da empresa" 
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <Image className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingLogo}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploadingLogo ? 'Enviando...' : 'Enviar Logo'}
              </Button>
              {shopProfile?.logo_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveLogo}
                  disabled={isRemovingLogo}
                >
                  <X className="h-4 w-4 mr-2" />
                  {isRemovingLogo ? 'Removendo...' : 'Remover'}
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Formatos aceitos: PNG, JPEG, WebP, GIF. Tamanho máximo: 3MB
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shop_name">Nome da Empresa</Label>
          <Input
            id="shop_name"
            value={formData.shop_name}
            onChange={(e) => handleInputChange('shop_name', e.target.value)}
            placeholder="Nome da sua empresa"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            value={formData.cnpj}
            onChange={(e) => handleCNPJChange(e.target.value)}
            placeholder="00.000.000/0000-00"
            maxLength={18}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Endereço completo da empresa"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact_phone">Telefone de Contato</Label>
          <Input
            id="contact_phone"
            value={formData.contact_phone}
            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Informações'}
        </Button>
      </CardContent>
    </Card>
  );
};
