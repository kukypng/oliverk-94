
import React, { useState } from 'react';
import { NewBudgetForm } from './NewBudgetForm';

export const NewBudgetContent = () => {
  const [showForm, setShowForm] = useState(true);

  return showForm ? (
    <NewBudgetForm onBack={() => setShowForm(false)} />
  ) : (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Novo Orçamento</h1>
          <p className="text-gray-600 mt-2">Crie um novo orçamento para seu cliente</p>
        </div>
      </div>
    </div>
  );
};
