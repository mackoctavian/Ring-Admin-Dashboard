/* eslint-disable no-unused-vars */
import { Icons } from "@/components/icons";
import  * as enums from "./data-schemas";

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Country = {
  name: string;
  countryShortName: string;
  currency: string; 
  currencyShortName: string;
  phonecode: number;
}

declare type UserContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: SignUpParams) => Promise<void>;
  logout: () => Promise<void>;
}

declare type SignUpParams = {
  email: string;
  name: string;
  name: string;
  phoneNumber?: number;
  city?: string;
  country: string;
  gender: string;
  dateOfBirth?: Date;
  email: string;
  password: string;
};

declare type SignInParams = {
  email: string;
  password: string;
};

declare type User = {
  $id: string;
  email: string;
  userId: string;
  name: string;
  phoneNumber: number;
  city?: string;
  country: string;
  gender: string;
  dateOfBirth: Date;
  points: number;
  status: boolean;
};



declare type BusinessCategory = {
  $id: string;
  name: string;
  $createdAt: Date;
  $updatedAt: Date;
}

declare type Business = {
  $id: string;
  name: string;
  logo?: string;
  slug: string;
  description?: string;
  email: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  country?: string;
  businessCategory: BusinessCategory[];
  user: User;
  status: boolean;
  $createdAt: Date;
  $updatedAt: Date;
}

/* Product Unit Data types */

declare type ProductUnit = {
  $id?: string;
  name: string;
  shortName: string;
  status: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
};

declare type ProductUnitDto = {
  name: string;
  shortName: string;
  status: boolean;
}

/* End Product Unit Data types */


/* Department Data types */
declare type Department = {
  $id: string;
  name: string;
  shortName: string;
  status: boolean;
};

declare type DepartmentDto = {
  name: string;
  shortName: string;
  status: boolean;
}
/* Department Data types */

/* Category */

declare type Category = {
  $id: string;
  name: string;
  slug: string;
  categoryType: CategoryType;
  parent?: string;
  discount?: Discount;
  description?: string;
  childrenCount: number;
  $createdAt: Date;
  $updatedAt: Date;
  status: boolean;
};

/* Category */

/* Discount */
declare type Discount = {
  $id?: string;
  name: string;
  code?: string;
  type: DiscountType;
  value: number;
  redemptionStartDate?: Date;
  redemptionEndDate?: Date;
  redemptionLimit?: number;
  description?: string;
  $createdAt?: Date;
  $updatedAt?: Date;
  status: boolean;
};

declare type DiscountDto = {
  name: string;
  code?: string;
  type: DiscountType;
  value: number;
  redemptionStartDate?: Date;
  redemptionEndDate?: Date;
  redemptionLimit?: number;
  description?: string;
  status: boolean;
};
/* Discount */



/* Branches */
declare type Branch = {
  $id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  openingTime?: string;
  closingTime?: string;
  $createdAt: Date;
  $updatedAt: Date;
  status: boolean;
}

declare type BranchDto = {
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  openingTime?: string;
  closingTime?: string;
  status: boolean;
}
/* End Branches */


/* Payment Types */
declare type PaymentType = {
  $id: string;
  name: string;
  status: boolean;
  $createdAt: Date;
  $updatedAt: Date;
}

declare type PaymentTypeDto = {
  name: string;
  status: boolean;
}
/* End Payment Types */


/* Product */

declare type Product = {
  $id?: string;
  name: string;
  slug: string;
  sku: string;
  quantity: number;
  quantityAlert?: number;
  allowDiscount: boolean;
  unit?: ProductUnit;
  category?: Category;
  discount?: Discount;
  description?: string;
  variant?: Variant[];
  status: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
};

declare type ProductDto = {
  name: string;
  slug: string;
  sku: string;
  image?: File;
  quantity: number;
  quantityAlert?: number;
  allowDiscount: boolean;
  manufactureDate?: Date;
  expiryDate?: Date;
  unit?: ProductUnit;
  category?: Category;
  discount?: Discount;
  minimumSellingPrice?: number;
  description?: string;
  variant?: Variant[];
  status: boolean;
};

declare type Variant = {
  $id: string;
  name: string;
  product: ProductDto;
  image: string;
  quantity: number;
  discount?: Discount;
  status: boolean;
  $createdAt: Date;
  $updatedAt: Date;
}

declare type VariantDto = {
  name: string;
  product: ProductDto;
  image: string;
  quantity: number;
  discount?: Discount;
  status: boolean;
}
/* End Product */


/* Service */

declare type Service = {
  $id?: string;
  name: string;
  discount?: Discount;
  allowDiscount: boolean;
  allowWalkin: boolean;
  duration?: number;
  price: number;
  offeringStartTime?: string;
  offeringEndTime?: string;
  category: Category;
  description?: string;
  inventoryItems?: InventoryItemUsage[];
  concurrentCustomers: number;
  status: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
};

declare type ServiceDto = {
  name: string;
  discount?: Discount;
  allowDiscount: boolean;
  allowWalkin: boolean;
  duration?: number;
  price: number;
  offeringStartTime?: string;
  offeringEndTime?: string;
  category: Category;
  description?: string;
  status: boolean;
};


/* End Service */

/* Inventory Usage */
declare type ServiceInventoryItemUsage = {
  $id?: string | undefined;
  item: InventoryVariant | null;
  service: Service | null;
  amountUsed: number;
  $createdAt?: Date;
  $updatedAt?: Date;
}

declare type ProductInventoryItemUsage = {
  $id?: string | undefined;
  item: InventoryVariant | null;
  service: Product | null;
  amountUsed: number;
  $createdAt?: Date;
  $updatedAt?: Date;
}
/* End Inventory Usage */


/* Supplier */

declare type Supplier = {
  $id?: string | undefined;
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  description?: string;
  contactPerson?: string;
  status: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
}

declare type SupplierDto = {
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  description?: string;
  contactPerson?: string;
  status: boolean;
}

/* End Supplier */



/* Staff */

declare type Staff = {
  $id?: string | undefined;
  name: string;
  email: string;
  phoneNumber: string;
  code?:code;
  gender: Gender;
  dateOfBirth?: Date;
  nationality?: string;
  joiningDate: Date;
  jobTitle: string;
  emergencyNumber?: string;
  address?: string;
  notes?: string;
  department?: Department;
  image?: string;
  status: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
}

declare type StaffDto = {
  name: string;
  email: string;
  phoneNumber: string;
  code?:code;
  gender: Gender;
  dateOfBirth?: Date;
  nationality?: string;
  joiningDate: Date;
  jobTitle: string;
  emergencyNumber?: string;
  address?: string;
  notes?: string;
  department?: Department;
  image?: string;
  status: boolean;
}

/* End Staff */



/* Customer */

declare type Customer = {
  $id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  gender: Gender;
  dateOfBirth?: Date;
  nationality?: string;
  lastVisitDate: Date;
  registrationBranch?: Branch;
  address?: string;
  notes?: string;
  allowNotifications: boolean;
  status: boolean;
  points: number;
  totalSpend: number;
  totalVisits: number;
  $createdAt: Date;
  $updatedAt: Date;
}

declare type CustomerDto = {
  name: string;
  email?: string;
  phoneNumber?: string;
  gender: Gender;
  dateOfBirth?: Date;
  nationality?: string;
  lastVisitDate: Date;
  registrationBranch?: Branch;
  address?: string;
  notes?: string;
  allowNotifications: boolean;
  status: boolean;
  points: number;
  totalSpend: number;
  totalVisits: number;
}

/* End Customer */



/* Stock */

declare type Inventory = {
  $id?: string;
  title: string,
  variants: InventoryVariant[],
  $createdAt?: Date;
  $updatedAt?: Date;
}


declare type InventoryVariant = {
  $id?: string;
  name: string,
  quantity: number,
  startingQuantity: number;
  itemsPerUnit?: number,
  unit?: ProductUnit,
  lowQuantity: number,
  barcodeId?: string,
  image?: string,
  inventory?: Inventory;
  status: InventoryStatus,
  $createdAt?: Date;
  $updatedAt?: Date;
}

declare type Stock = {
  $id?: string;
  item: InvenvtoryVariant;
  quantity: number;
  staff?: Staff;
  department?: Department;
  supplier: Supplier;
  value?: number;
  $createdAt?: Date;
  $updatedAt?: Date;
}
/* End Stock */


/* Expense */
declare type Expense = {
  $id?: string;
  name: string;
  category: string;
  currency: string;
  tax: number;
  amount: number;
  staff?: Staff;
  vendor?: Supplier;
  department?: Department;
  expenseDate: Date;
  dueDate: Date;
  document?: string;
  description: string;
  status: ExpenseStatus;
  $createdAt?: Date;
  $updatedAt?: Date;
}

declare type ExpensePayment = {
  $id?: string;
  expense: Expense;
  paymentDate: Date;
  receipt?: string;
  amount: number;
  paymentMethod: PaymentMethod; 
  description?: string;
  $createdAt?: Date;
  $updatedAt?: Date;
}
/* End Expense */



/* Section */
declare type Section = {
  $id?: string;
  name: string;
  type: SectionType;
  description: string;
  status: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
}

/* End Section */




// ========================================


declare type Account = {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName: string;
  mask: string;
  institutionId: string;
  name: string;
  type: string;
  subtype: string;
  appwriteItemId: string;
  shareableId: string;
};

declare type Transaction = {
  id: string;
  $id: string;
  name: string;
  paymentChannel: string;
  type: string;
  accountId: string;
  amount: number;
  pending: boolean;
  category: string;
  date: string;
  image: string;
  type: string;
  $createdAt: string;
  channel: string;
  senderBankId: string;
  receiverBankId: string;
};



declare type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

declare type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};

declare type NewDwollaCustomerParams = {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

declare interface DashboardNavProps {
  user: User;
  setOpen: boolean;
}

declare interface CreditCardProps {
  account: Account;
  userName: string;
  showBalance?: boolean;
}

declare interface BankInfoProps {
  account: Account;
  appwriteItemId?: string;
  type: "full" | "card";
}

declare interface HeaderBoxProps {
  type?: "title" | "greeting";
  title: string;
  subtext: string;
  user?: string;
}

declare interface MobileNavProps {
  user: User;
}

declare interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

declare interface PaginationProps {
  page: number;
  totalPages: number;
}

declare interface PlaidLinkProps {
  user: User;
  variant?: "primary" | "ghost";
}

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare interface BankDropdownProps {
  accounts: Account[];
  setValue?: UseFormSetValue<any>;
  otherStyles?: string;
}

declare interface BankTabItemProps {
  account: Account;
  appwriteItemId?: string;
}

declare interface TotalBalanceBoxProps {
  accounts: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
}

declare interface FooterProps {
  user: User;
  type?: 'mobile' | 'desktop'
}

declare interface RightSidebarProps {
  user: User;
  transactions: Transaction[];
  banks: Bank[] & Account[];
}

declare interface SiderbarProps {
  user: User;
}
