type HrTariff = {
  id: string;
  name: string;
  level: 'starter' | 'standard' | 'advanced';
  price: number;
  features: string[];
  recomendet?: boolean
};


type Plan = {
  id: number
  name: string
  price: number
}


type PlanUser = {
  id: number;
  name: string;
  plan?: string;
};

type SubscriptionLevel = 1 | 2 | 3;

type RawSubscription = {
  plan: SubscriptionLevel;
  month: number;
}

interface IncomingEmployee {
  id: number;
  full_name: string;
  subscriptions: RawSubscription[];
}

type Employee = {
  id: number;
  first_name: string;
  face?: string
  subscriptions: {
    [month: number]: SubscriptionLevel;
  };
}


type PaymentsRoles = {
  id: number,
  name: string,
  paid_count: number,
  count: number
}

type Payment = {
  id: number,
  created_at: string,
  updated_at: string,
  amount: string,
  status: number,
  provider: number,
  client: number
}

type PlanHistory = {
  id: number
  created_at: string
  updated_at: string
  amount: string
  status: number,
  year: number,
  month: number,
  employees_count: number,
  plan: string,
  client: number
}