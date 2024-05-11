import { Icons } from "@/components/icons";
import { NavItem, SidebarNavItem } from "@/types";

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: "Candice Schiner",
    company: "Dell",
    role: "Frontend Developer",
    verified: false,
    status: "Active",
  },
  {
    id: 2,
    name: "John Doe",
    company: "TechCorp",
    role: "Backend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    company: "WebTech",
    role: "UI Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 4,
    name: "David Smith",
    company: "Innovate Inc.",
    role: "Fullstack Developer",
    verified: false,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Emma Wilson",
    company: "TechGuru",
    role: "Product Manager",
    verified: true,
    status: "Active",
  },
  {
    id: 6,
    name: "James Brown",
    company: "CodeGenius",
    role: "QA Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 7,
    name: "Laura White",
    company: "SoftWorks",
    role: "UX Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 8,
    name: "Michael Lee",
    company: "DevCraft",
    role: "DevOps Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 9,
    name: "Olivia Green",
    company: "WebSolutions",
    role: "Frontend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 10,
    name: "Robert Taylor",
    company: "DataTech",
    role: "Data Analyst",
    verified: false,
    status: "Active",
  },
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  // {
  //   title: "Reports",
  //   spacer: true,
  // },
  {
    title: "Sales Reports",
    href: "/dashboard/sales-reports",
    icon: "dashboard",
    label: "Sales Reports",
  },
  {
    title: "Inventory Reports",
    href: "/dashboard/inventory-reports",
    icon: "dashboard",
    label: "Inventory Reports",
  },

  // {
  //   title: "Inventory",
  //   spacer: true,
  // },
  {
    title: "Vendors",
    href: "/dashboard/vendors",
    icon: "user",
    label: "Vendors",
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: "user",
    label: "Products",
  },
  {
    title: "Services",
    href: "/dashboard/services",
    icon: "user",
    label: "Services",
  },
  {
    title: "Units",
    href: "/dashboard/units",
    icon: "user",
    label: "Units",
  },
  {
    title: "Categories",
    href: "/dashboard/inventory-categories",
    icon: "laptop",
    label: "Categories",
  },
  // {
  //   title: "Stock",
  //   spacer: true,
  // },
  {
    title: "Manage Stock",
    href: "/dashboard/stock",
    icon: "user",
    label: "Stock",
  },
  {
    title: "Stock Transfer",
    href: "/dashboard/stock-transfer",
    icon: "user",
    label: "Stock Transfer",
  },
  {
    title: "HRM",
    spacer: true,
  },
  {
    title: "Staff",
    href: "/dashboard/employee",
    icon: "employee",
    label: "employee",
  },
  {
    title: "Departments",
    href: "/dashboard/departments",
    icon: "employee",
    label: "Departments",
  },
  {
    title: "Business Settings",
    spacer: true,
  },
  {
    title: "Business Profile",
    href: "/dashboard/business",
    icon: "settings",
    label: "Business Profile",
  },
  {
    title: "Branches",
    href: "/dashboard/branches",
    icon: "settings",
    label: "Branches",
  },
  {
    title: "Settings",
    spacer: true,
  },
  {
    title: "System Settings",
    href: "/dashboard/profile",
    icon: "profile",
    label: "System Settings",
  },


  {
    title: "Login",
    href: "/",
    icon: "login",
    label: "login",
  },
];
