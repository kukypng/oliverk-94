
export interface UserProfile {
  id: string;
  name: string;
  role: string;
}

export interface Budget {
    id: string;
    total_price: number | null;
    created_at: string;
    client_name: string | null;
    device_model: string;
    status: string;
}
