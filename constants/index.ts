export const sidebarLinks = [
  {
    icon: '/icons/icons/dashboard.svg',
    route: "/",
    label: "Dashboard",
  },

  {
    type: 'title',
    label: 'Reports',
  },
  { type: 'separator' },
  {
    route: "/sales-reports",
    icon: "/icons/icons/sales-report.svg",
    label: "Sales Reports",
  },
  {
    route: "/inventory-reports",
    icon: "/icons/icons/inventory-report.svg",
    label: "Inventory Reports",
  },
  {
    route: "/profit-and-loss",
    icon: "/icons/icons/invoices.svg",
    label: "Profit & Loss Report",
  },
  


  {
    type: 'title',
    label: 'Stock',
  },
  { type: 'separator' },
  {
    icon: "/icons/icons/categories.svg",
    route: "/categories",
    label: "Categories",
  },
  {
    icon: "/icons/icons/units.svg",
    route: "/units",
    label: "Units",
  },
  {
    icon: "/icons/icons/suppliers.svg",
    route: "/suppliers",
    label: "Suppliers",
  },
  {
    icon: "/icons/icons/products.svg",
    route: "/products",
    label: "Products",
  },
  {
    icon: "/icons/icons/stock-management.svg",
    route: "/stock",
    label: "Stock Management",
  },
  {
    icon: "/icons/icons/stock-transfer.svg",
    route: "/stock-transfer",
    label: "Stock Transfer",
  },

  { type: 'separator' },

  {
    icon: "/icons/icons/services.svg",
    route: "/services",
    label: "Services",
  },
  {
    icon: "/icons/icons/packages.svg",
    route: "/packages",
    label: "Packages",
  },
  
  {
    type: 'title',
    label: 'Business',
  },
  { type: 'separator' },
  {
    icon: "/icons/icons/customers.svg",
    route: "/customers",
    label: "Customers",
  },
  {
    icon: "/icons/icons/discounts.svg",
    route: "/discounts",
    label: "Discounts",
  },
  {
    icon: "/icons/icons/campaigns.svg",
    route: "/campaigns",
    label: "Campaigns",
  },
  

  { type: 'separator' },

  {
    icon: "/icons/icons/branches.svg",
    route: "/branches",
    label: "Branches",
  },

  {
    icon: "/icons/icons/departments.svg",
    route: "/departments",
    label: "Departments",
  },
  {
    icon: "/icons/icons/staff.svg",
    route: "/staff",
    label: "Staff",
  },
  

  { type: 'separator' },

  {
    icon: "/icons/icons/business-settings.svg",
    route: "/business-settings",
    label: "Business Settings",
  },
  
  {
    icon: "/icons/icons/settings.svg",
    route: "/settings",
    label: "System Settings",
  },
  
  
];


export const topCategoryStyles = {
  "Food and Drink": {
    bg: "bg-blue-25",
    circleBg: "bg-blue-100",
    text: {
      main: "text-blue-900",
      count: "text-blue-700",
    },
    progress: {
      bg: "bg-blue-100",
      indicator: "bg-blue-700",
    },
    icon: "/icons/monitor.svg",
  },
  Travel: {
    bg: "bg-success-25",
    circleBg: "bg-success-100",
    text: {
      main: "text-success-900",
      count: "text-success-700",
    },
    progress: {
      bg: "bg-success-100",
      indicator: "bg-success-700",
    },
    icon: "/icons/coins.svg",
  },
  default: {
    bg: "bg-pink-25",
    circleBg: "bg-pink-100",
    text: {
      main: "text-pink-900",
      count: "text-pink-700",
    },
    progress: {
      bg: "bg-pink-100",
      indicator: "bg-pink-700",
    },
    icon: "/icons/shopping-bag.svg",
  },
};

export const transactionCategoryStyles = {
  "Food and Drink": {
    borderColor: "border-pink-600",
    backgroundColor: "bg-pink-500",
    textColor: "text-pink-700",
    chipBackgroundColor: "bg-inherit",
  },
  Payment: {
    borderColor: "border-success-600",
    backgroundColor: "bg-green-600",
    textColor: "text-success-700",
    chipBackgroundColor: "bg-inherit",
  },
  "Bank Fees": {
    borderColor: "border-success-600",
    backgroundColor: "bg-green-600",
    textColor: "text-success-700",
    chipBackgroundColor: "bg-inherit",
  },
  Transfer: {
    borderColor: "border-red-700",
    backgroundColor: "bg-red-700",
    textColor: "text-red-700",
    chipBackgroundColor: "bg-inherit",
  },
  Processing: {
    borderColor: "border-[#F2F4F7]",
    backgroundColor: "bg-gray-500",
    textColor: "text-[#344054]",
    chipBackgroundColor: "bg-[#F2F4F7]",
  },
  Success: {
    borderColor: "border-[#12B76A]",
    backgroundColor: "bg-[#12B76A]",
    textColor: "text-[#027A48]",
    chipBackgroundColor: "bg-[#ECFDF3]",
  },
  Travel: {
    borderColor: "border-[#0047AB]",
    backgroundColor: "bg-blue-500",
    textColor: "text-blue-700",
    chipBackgroundColor: "bg-[#ECFDF3]",
  },
  default: {
    borderColor: "",
    backgroundColor: "bg-blue-500",
    textColor: "text-blue-700",
    chipBackgroundColor: "bg-inherit",
  },
};
