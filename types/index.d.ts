/* eslint-disable no-unused-vars */
import { Icons } from "@/components/icons";
import * as enums from "./data-schemas";
import { Option } from "@/components/ui/multiple-selector";

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type MultiSelect = {
  $id?: string;
  label: string;
  value: string;
  disable?: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
}

declare type SubscriptionDetails = {
  business: string;
  email: string;
  name : string;
  monthlyFee: number;
  nextDue: Date;
  status: enums.SubscriptionStatus;
  phoneNumber: string;
  owner: string;
}

declare type Country = {
  name: string;
  countryShortName: string;
  currency: string; 
  currencyShortName: string;
  phonecode: number;
}

declare type BusinessType = {
  $id?: string;
  name: string;
  $createdAt?: Date;
  $updatedAt?: Date;
}

declare type SignUpParams = {
  name: string;
  phoneNumber: string;
  businessType: BusinessType;
  size: string;
  country: string;
  city?: string;
  email: string;
  password: string;
};

declare type SignInParams = {
  email: string;
  password: string;
};

declare type User = {
  $id?: string;
  email: string;
  name: string;
  phoneNumber?: string;
  image?: string;
  city?: string;
  country?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  points: number;
  status: boolean;
  userId: string;
  businesses: Business[];
  isOwner: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
};

declare type Business = {
  $id?: string;
  name: string;
  businessType: BusinessType;
  size: string;
  branches: Branch[];
  registrationNumber?: string;
  logo?: FileList;
  email: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  country?: string;
  owner: string;
  description?: string;
  slug: string;
  $createdAt?: Date;
  $updatedAt?: Date;
}

/* Product Unit Data types */

declare type ProductUnit = {
  $id?: string;
  name: string;
  abbreviation: string;
  isConvertible: boolean;
  unitConversions: ProductUnitConversion[];
  $createdAt?: Date;
  $updatedAt?: Date;
};

declare type ProductUnitConversion = {
  $id?: string;
  conversionFactor: number;
  from: ProductUnit;
  to: ProductUnit;
  $createdAt?: Date;
  $updatedAt?: Date;
}
/* End Product Unit Data types */


/* Department Data types */
declare type Department = {
  $id?: string;
  branch: Branch;
  branchId: string;
  businessId: string;
  name: string;
  shortName: string;
  status: boolean;
  canDelete: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
};
/* Department Data types */

/* Category */

declare type Category = {
  $id: string;
  name: string;
  slug: string;
  categoryType: CategoryType;
  parent?: string;
  description?: string;
  childrenCount: number;
  businessId: string;
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

declare type NewDiscount = {
  $id?: string;
  type: DiscountType;
  discountCode?: string;
  value: number;
  maximumValue?: number;
  minimumSpend?: number;
  startDate?: Date;
  endDate?: Date;
  branches: Branch[];
  applyAfterTax: boolean;
  status: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
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
  $id?: string;
  business: Business;
  businessId: string;
  name: string;
  email: string;
  phoneNumber: string;
  address?: string;
  city?: string;
  staffCount: number;
  daysOpen: Option[];
  departments: Department[];
  openingTime?: string;
  closingTime?: string;
  $createdAt?: Date;
  $updatedAt?: Date;
  canDelete: boolean;
  status: boolean;
  canDelete: boolean;
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

/* Modifiers */
declare type Modifier = {
  $id?: string;
  name: string;
  type: ModifierType;
  allowMultiple: boolean;
  optional: boolean;
  businessId: string;
  image: string;
  items: ModifierItem[];
  branches: Branch[];
  status: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
};

declare type ModifierItem = {
  $id?: string;
  name: string;
  price: number;
  inventoryItem: InventoryVariant;
  $createdAt?: Date;
  $updatedAt?: Date;
};

/* End modifiers */

/* Product */
declare type Product = {
  $id?: string;
  name: string;
  sku: string;
  category: Category[];
  description: string;
  status: string;
  branch: Branch[];
  department: Department[];
  modifier: Modifier[]
  image?: string;
  variants: ProductVariant[];
  $createdAt?: Date;
  $updatedAt?: Date;
};

declare type ProductVariant = {
  $id?: string;
  name: string;
  price: number;
  tax: number;
  barcode?: string;
  status: boolean;
  inventoryItems: ProductInventoryItemUsage[];
  $createdAt?: Date;
  $updatedAt?: Date;
}

declare type ProductInventoryItemUsage = {
  $id?: string;
  item: InventoryVariant;
  amountUsed: number;
  unit: ProductUnit;
  $createdAt?: Date;
  $updatedAt?: Date;
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
/* End Inventory Usage */


/* Supplier */

declare type Supplier = {
  $id?: string | undefined;
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  description?: string;
  contactPersonName: string;
  branch: Branch[];
  businessId: string; 
  status: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
}
/* End Supplier */



/* Staff */

declare type Staff = {
  $id?: string;
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
  emergencyName?: string;
  emergencyRelationship?: string;
  address?: string;
  notes?: string;
  department?: Department[];
  branch?: Branch[];
  image?: string;
  businessId: string;
  status: boolean;
  posAccess: boolean;
  dashboardAccess: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
}
/* End Staff */



/* Customer */

declare type Customer = {
  $id?: string;
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
  points: number;
  totalSpend: number;
  totalVisits: number;
  $createdAt?: Date;
  $updatedAt?: Date;
}

/* End Customer */

/* Campaign */

declare type Campaign = {
  $id: string;
  title: string;
  audience: CampaignAudience;
  message: string;
  businessId: string;
  scheduleDate: Date;
  status: boolean;
  $createdAt: Date;
  $updatedAt: Date;
}

/* End campaign */

/* Stock */

declare type Inventory = {
  $id?: string;
  title: string,
  packaging: string,
  businessId: string,
  variants: InventoryVariant[],
  $createdAt?: Date;
  $updatedAt?: Date;
}


declare type InventoryVariant = {
  $id?: string;
  name: string,
  quantity: number,
  startingQuantity: number;
  lowQuantity: number,
  barcodeId?: string,
  status: InventoryStatus,
  image?: string,
  fullName: string,
  itemsPerPackage: number,
  volume?: number,
  inventory: Inventory;
  unit: string;
  startingValue: number;
  actualValue: number;
  actualQuantity: number;
  businessId: string;
  value: number;
  $createdAt?: Date;
  $updatedAt?: Date;
}

declare type InventoryModification = {
  $id?: string;
  item: InventoryVariant,
  quantity: number,
  value: number,
  reason: string,
  notes: string,
  $createdAt?: Date;
  $updatedAt?: Date;
}

declare type Stock = {
  $id?: string;
  item: InvenvtoryVariant;
  quantity: number;
  actualQuantity: number;
  staff?: Staff;
  department?: Department;
  supplier: Supplier;
  orderNumber: string;
  orderDate: Date;
  deliveryDate: Date;
  accurate: boolean;
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
  balance: number;
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
  branch: Branch;
  branchId: string;
  businessId: string;
  description: string;
  noOfCustomers: number;
  status: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
}

/* End Section */


/* Device */
declare type Device = {
  $id?: string;
  imei?: string;
  name: string;
  branchId: string;
  businessId: string;
  code: number;
  status: boolean;
  lastSync: Date;
  forceSync: boolean;
  $createdAt?: Date;
  $updatedAt?: Date;
}
/* End Device */










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
  type?: 'mobile' | 'desktop'
}