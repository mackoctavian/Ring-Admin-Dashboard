export interface NavItem {
    title: string
    href?: string
    disabled?: boolean
    external?: boolean
}

export const mainMenu = [
    {
      icon: '/icons/icons/dashboard.svg',
      route: "/dashboard/overview",
      label: "Dashboard",
    },
  
    {
      type: 'title',
      label: 'Reports',
    },
    { type: 'separator' },
    // {
    //   route: "/#",
    //   icon: "/icons/icons/sales-report.svg",
    //   label: "Sales Reports",
    // },
    {
      route: "/dashboard/inventory-report",
      icon: "/icons/icons/inventory-report.svg",
      label: "Inventory Reports",
    },
    // {
    //   route: "/#",
    //   icon: "/icons/icons/invoices.svg",
    //   label: "Profit & Loss Report",
    // },
    
  
  
    {
      type: 'title',
      label: 'Inventory management',
    },
    { type: 'separator' },
    {
      icon: "/icons/icons/stock-management.svg",
      route: "/dashboard/inventory",
      label: "Stock",
    },
    {
      icon: "/icons/icons/stock-management.svg",
      route: "/dashboard/stock",
      label: "Stock Intake",
    },
    
    {
      icon: "/icons/icons/suppliers.svg",
      route: "/dashboard/suppliers",
      label: "Suppliers",
    },
    // {
    //   icon: "/icons/icons/units.svg",
    //   route: "/units",
    //   label: "Units",
    // },
    // {
    //   icon: "/icons/icons/stock-transfer.svg",
    //   route: "/stock-transfer",
    //   label: "Stock Transfer",
    // },
    
  
    {
      type: 'title',
      label: 'Products & Services',
    },
    { type: 'separator' },
    {
      icon: "/icons/icons/categories.svg",
      route: "/dashboard/categories",
      label: "Categories",
    },
    {
      icon: "/icons/icons/units.svg",
      route: "/dashboard/modifiers",
      label: "Modifiers",
    },
    {
      icon: "/icons/icons/products.svg",
      route: "/dashboard/products",
      label: "Products",
    },
    // {
    //   icon: "/icons/icons/services.svg",
    //   route: "/services",
    //   label: "Services",
    // },
    // {
    //   icon: "/icons/icons/packages.svg",
    //   route: "/#",
    //   label: "Packages",
    // },
    
    {
      type: 'title',
      label: 'Business',
    },
    { type: 'separator' },
    {
      icon: "/icons/icons/customers.svg",
      route: "/dashboard/customers",
      label: "Customers",
    },
    {
      icon: "/icons/icons/discounts.svg",
      route: "/dashboard/discounts",
      label: "Discounts",
    },
    {
      icon: "/icons/icons/invoices.svg",
      route: "/dashboard/expenses",
      label: "Expenses",
    },
    {
      icon: "/icons/icons/campaigns.svg",
      route: "/dashboard/campaigns",
      label: "Campaigns",
    },
    
  
    { type: 'separator' },
  
    {
      icon: "/icons/icons/branches.svg",
      route: "/dashboard/branches",
      label: "Branches",
    },
  
    {
      icon: "/icons/icons/departments.svg",
      route: "/dashboard/departments",
      label: "Departments",
    },
    {
      icon: "/icons/icons/departments.svg",
      route: "/dashboard/sections",
      label: "Spaces & sections",
    },
    {
      icon: "/icons/icons/staff.svg",
      route: "/dashboard/staff",
      label: "Staff",
    },
    
  
    { type: 'separator' },
  
//    {
//      icon: "/icons/icons/business-settings.svg",
//      route: "/business",
//      label: "Business Settings",
//    },
    
    {
      icon: "/icons/icons/settings.svg",
      route: "/dashboard/settings/user-profile",
      label: "System Settings",
    },
    
    
  ];