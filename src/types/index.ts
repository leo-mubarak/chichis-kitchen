export interface MenuItemWithSizes {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  createdAt: Date;
  sizes: MenuSize[];
}

export interface MenuSize {
  id: string;
  label: string;
  price: number;
  menuItemId: string;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  image: string;
  sizeLabel: string;
  price: number;
  quantity: number;
}

export interface OrderWithDetails {
  id: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  customer: {
    id: string;
    fullname: string;
    phone: string;
    address: string;
  };
  orderItems: {
    id: string;
    sizeLabel: string;
    quantity: number;
    subtotal: number;
    menuItem: {
      id: string;
      name: string;
      image: string;
    };
  }[];
}

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
  recentOrders: OrderWithDetails[];
}
