
-- Remove colunas do Stripe da tabela de assinaturas, se elas existirem.
ALTER TABLE public.subscriptions DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE public.subscriptions DROP COLUMN IF EXISTS stripe_subscription_id;

-- CORREÇÃO: Primeiro, removemos o valor padrão da coluna 'status' que depende do tipo antigo.
ALTER TABLE public.subscriptions ALTER COLUMN status DROP DEFAULT;

-- Agora, podemos alterar o tipo da coluna para TEXT sem problemas.
ALTER TABLE public.subscriptions ALTER COLUMN status TYPE TEXT;

-- Definimos um novo valor padrão para a coluna 'status' como texto.
ALTER TABLE public.subscriptions ALTER COLUMN status SET DEFAULT 'pending';

-- Finalmente, removemos o tipo ENUM 'subscription_status' que não é mais necessário.
DROP TYPE IF EXISTS public.subscription_status;
