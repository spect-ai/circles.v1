interface User {
  accounts: string[];
  createdAt: string;
  ethAddress: string;
  id: string;
  updatedAt: string;
  username: string;
  _id: string;
}
interface Payment {
  chain: {
    chainId: string;
    name: string;
  };
  token: {
    address: string;
    symbol: string;
  };
}

interface Circle {
  activity: string[];
  archived: boolean;
  avatar: string;
  children: Circle[];
  createdAt: string;
  defaultPayment: Payment;
  description: string;
  id: string;
  members: any[];
  name: string;
  parents: Circle[];
  private: boolean;
  projects: any[];
  roles: any[];
  slug: string;
  templates: any[];
  updatedAt: string;
  whitelistedTokens: any;
}
