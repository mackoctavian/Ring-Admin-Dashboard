/* eslint-disable no-unused-vars */
import { Icons } from "@/components/icons";

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
//=======================================
export const phoneNumberRegex = /^[0-9]{10,15}$/;

declare enum CategoryType{
  SERVICE = "SERVICE",
  PRODUCT = "PRODUCT",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNDISCLOSED = "UNDISCLOSED",
}

declare type Country = {
  name: string;
  countryShortName: string;
  currency: string; 
  currencyShortName: string;
  phonecode: number;
}

declare type SignUpParams = {
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phoneNumber?: number;
  city?: string;
  country: string;
  gender: string;
  dateOfBirth?: Date;
  email: string;
  password: string;
};

declare type LoginUser = {
  email: string;
  password: string;
};

declare type User = {
  $id: string;
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  name: string;
  phoneNumber: number;
  city?: string;
  country: string;
  gender: string;
  dateOfBirth: Date;
  points: number;
  status: boolean;
};

declare type NewUserParams = {
  userId: string;
  email: string;
  name: string;
  business: Business;
  password: string;
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
  $id: string;
  name: string;
  shortName: string;
  status: boolean;
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

/* Category Data types */

declare type Category = {
  $id: string;
  name: string;
  slug: string;
  categoryType: CategoryType;
  parent?: string;
  description?: string;
  $createdAt: Date;
  $updatedAt: Date;
  status: boolean;
};

declare type CategoryDto = {
  name: string;
  slug: string;
  type: CategoryType;
  parent?: string;
  description?: string;
  status: boolean;
};

/* Category */



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


declare type Product = {
  $id: string;
  name: string;
  slug: string;
  sku: string;
  quantity: number;
  quantityAlert?: number;
  allowDiscount: boolean;
  expiryDate: Date;
  price: number;
  unit: ProductUnit;
  category: Category;
  description?: string;
  status: boolean;
  $createdAt: Date;
  $updatedAt: Date;
};

/* Service */

declare type Service = {
  $id: string;
  name: string;
  allowDiscount: boolean;
  duration?: string;
  price: number;
  startTime?: string;
  endTime?: string;
  category: Category;
  description?: string;
  status: boolean;
  $createdAt: Date;
  $updatedAt: Date;
};

declare type ServiceDto = {
  name: string;
  allowDiscount: boolean;
  duration?: string;
  price: number;
  startTime?: string;
  endTime?: string;
  category: Category;
  description?: string;
  status: boolean;
};


/* End Service */



/* Supplier */

declare type Supplier = {
  $id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  description?: string;
  contactPerson?: string;
  status: boolean;
  $createdAt: Date;
  $updatedAt: Date;
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
  $id: string;
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
  $createdAt: Date;
  $updatedAt: Date;
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

declare type Bank = {
  $id: string;
  accountId: string;
  bankId: string;
  accessToken: string;
  fundingSourceUrl: string;
  userId: string;
  shareableId: string;
};

declare type AccountTypes =
  | "depository"
  | "credit"
  | "loan "
  | "investment"
  | "other";

declare type Category = "Food and Drink" | "Travel" | "Transfer";

declare type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

declare type Receiver = {
  firstName: string;
  lastName: string;
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
  dwollaCustomerId?: string;
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

declare interface RecentTransactionsProps {
  accounts: Account[];
  transactions: Transaction[];
  appwriteItemId: string;
  page: number;
}

declare interface TransactionHistoryTableProps {
  transactions: Transaction[];
  page: number;
}

declare interface CategoryBadgeProps {
  category: string;
}

declare interface TransactionTableProps {
  transactions: Transaction[];
}

declare interface CategoryProps {
  category: CategoryCount;
}

declare interface DoughnutChartProps {
  accounts: Account[];
}

declare interface PaymentTransferFormProps {
  accounts: Account[];
}

// Actions
declare interface getAccountsProps {
  userId: string;
}

declare interface getAccountProps {
  appwriteItemId: string;
}

declare interface getInstitutionProps {
  institutionId: string;
}

declare interface getTransactionsProps {
  accessToken: string;
}

declare interface CreateFundingSourceOptions {
  customerId: string; // Dwolla Customer ID
  fundingSourceName: string; // Dwolla Funding Source Name
  plaidToken: string; // Plaid Account Processor Token
  _links: object; // Dwolla On Demand Authorization Link
}

declare interface CreateTransactionProps {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
}

declare interface getTransactionsByBankIdProps {
  bankId: string;
}

declare interface signInProps {
  email: string;
  password: string;
}

declare interface getUserInfoProps {
  userId: string;
}

declare interface exchangePublicTokenProps {
  publicToken: string;
  user: User;
}

declare interface createBankAccountProps {
  accessToken: string;
  userId: string;
  accountId: string;
  bankId: string;
  fundingSourceUrl: string;
  shareableId: string;
}

declare interface getBanksProps {
  userId: string;
}

declare interface getBankProps {
  documentId: string;
}

declare interface getBankByAccountIdProps {
  accountId: string;
}
