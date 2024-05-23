export interface NavItem {
    title: string
    href?: string
    disabled?: boolean
    external?: boolean
}

export const mainMenu = [
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
      icon: "/icons/icons/stock-management.svg",
      route: "/inventory",
      label: "Inventory",
    },
    {
      icon: "/icons/icons/stock-management.svg",
      route: "/stock",
      label: "Stock Intake",
    },
    
    {
      icon: "/icons/icons/suppliers.svg",
      route: "/suppliers",
      label: "Suppliers",
    },
    {
      icon: "/icons/icons/units.svg",
      route: "/units",
      label: "Units",
    },
    {
      icon: "/icons/icons/stock-transfer.svg",
      route: "/stock-transfer",
      label: "Stock Transfer",
    },
    
  
    {
      type: 'title',
      label: 'Products & Services',
    },
    { type: 'separator' },
    {
      icon: "/icons/icons/categories.svg",
      route: "/categories",
      label: "Categories",
    },
    {
      icon: "/icons/icons/products.svg",
      route: "/products",
      label: "Products",
    },
    {
      icon: "/icons/icons/services.svg",
      route: "/services",
      label: "Services",
    },
    {
      icon: "/icons/icons/packages.svg",
      route: "/#",
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
      route: "/#",
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
      route: "/#",
      label: "Business Settings",
    },
    
    {
      icon: "/icons/icons/settings.svg",
      route: "/#",
      label: "System Settings",
    },
    
    
  ];