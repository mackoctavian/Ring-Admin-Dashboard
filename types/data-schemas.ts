import * as z from "zod";

const phoneNumberRegex = /^[0-9]{10,15}$/;

//Image validation
const MAX_MB = 5; // Max size in MB
const MAX_UPLOAD_SIZE = MAX_MB * 1024 * 1024; // Convert MB to bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export enum CategoryType{
    SERVICE = "SERVICE",
    PRODUCT = "PRODUCT",
}

export enum DiscountType{
    PERCENTAGE = "PERCENTAGE",
    AMOUNT = "AMOUNT",
}

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    UNDISCLOSED = "UNDISCLOSED",
}

export enum InventoryStatus {
    OUT_OF_STOCK = "OUT OF STOCK",
    IN_STOCK = "AVAILABLE",
    LOW_STOCK = "LOW STOCK",
    EXPIRED = "EXPIRED",
}

export enum ExpenseStatus{
    UNPAID = "UNPAID",
    PARTIAL = "PARTIALLY PAID",
    PAID = "PAID",
}

export enum PaymentMethod{
    CASH = "Cash",
    CHEQUE = "Cheque",
    MOBILE = "Mobile Money",
    BANK = "Bank Payment",
    CARD = "Card",
    OTHER = "Other"
}

export enum SectionType{
    ROOM = "ROOM",
    TABLE = "TABLE",
    SEAT = "SEAT",
}

export const DepartmentSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
    shortName: z.string(),
    status: z.boolean(),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});
    
export const StaffSchema = z.object({
    $id: z.union([z.string(), z.undefined()]),
    name: z.string(),
    email: z.string().email("Invalid email address").trim().max(40).min(10),
    phoneNumber: z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
    code: z.preprocess((val) => val === null ? undefined : val, z.string().optional()),
    gender: z.nativeEnum(Gender),
    dateOfBirth: z.preprocess((val) => {
      if (val === null) return undefined;
      if (typeof val === "string" && val.trim() !== "") {
        return new Date(val);
      }
      return val;
    }, z.date().optional()),
    nationality: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    joiningDate: z.preprocess((val) => {
      if (typeof val === "string" && val.trim() !== "") {
        return new Date(val);
      }
      return val;
    }, z.date()),
    jobTitle: z.string(),
    emergencyNumber: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    address: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    notes: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    image: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    status: z.boolean(),
    department: DepartmentSchema,
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});

export const SupplierSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
    email: z.string().email("Invalid email address"),
    phoneNumber:  z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
    address: z.string().optional(),
    description: z.string().optional(),
    contactPersonName: z.string().optional(),
    status: z.boolean(),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});

export const DiscountSchema = z.object({
    $id: z.string().optional(),
    name: z.string({
        required_error: "Discount name is required",
        invalid_type_error: "Discount name must be more than 2 characters long",
    }).min(2),
    type: z.enum([DiscountType.PERCENTAGE, DiscountType.AMOUNT], {
        required_error: "Category type is required",
        invalid_type_error: "Category type must be either 'Product' or 'Service'",
    }),
    value: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number()),
    code: z.string().optional(),
    redemptionStartDate: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    redemptionEndDate: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    redemptionLimit: z.preprocess((val) => val === null ? undefined : val, z.number().optional()),
    description: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    status: z.boolean(),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});

export const CategorySchema: z.ZodSchema = z.lazy(() =>
    z.object({
        $id: z.string().optional(),
        slug: z.string().min(1),
        type: z.enum([CategoryType.SERVICE, CategoryType.PRODUCT], {
            required_error: "Category type is required",
            invalid_type_error: "Category type must be either 'Product' or 'Service'",
        }),
        name: z.string({
            required_error: "Product category name is required",
            invalid_type_error: "Product category name must be more than 2 characters long",
        }).min(2),
        parent: z.string().nullable().optional(), 
        discount: DiscountSchema.nullable().optional(),
        description: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
        status: z.boolean(),
        childrenCount: z.preprocess((val) => {
            if (typeof val === "string" && val.trim() !== "") {
                return parseInt(val);
            }
            return val;
        }, z.number().nullable().optional()),
        $createdAt: z.preprocess((val) => {
            if (typeof val === "string" && val.trim() !== "") {
                return new Date(val);
            }
            return val;
        }, z.date().optional()),
        $updatedAt: z.preprocess((val) => {
            if (typeof val === "string" && val.trim() !== "") {
                return new Date(val);
            }
            return val;
        }, z.date().optional()),
    })
);

export const ProductUnitSchema = z.object({
    $id: z.string().optional(),
    shortName: z.string().min(1),
    name: z.string().min(1),
    status: z.boolean(),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});

export const InventoryVariantSchema = z.object({
    $id: z.string().optional(),
    name: z.string().trim().nonempty(),
    unit: ProductUnitSchema.nullable().optional(),
    itemsPerUnit: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative().optional()),
    startingQuantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    lowQuantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    quantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    barcodeId: z.string().length(13, { message: "Must be exactly 13 characters long" }).nullable().optional(),
    image: z.string().nullable().optional(),
    status: z.nativeEnum(InventoryStatus),
    description: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});

export const InventorySchema = z.object({
    $id: z.string().optional(),
    title: z.string().nonempty("Title is required"),
    variants: z.array(InventoryVariantSchema).min(1, "At least one item is required"),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
  });

export const StockSchema = z.object({
    $id: z.string().optional(),
    item: InventoryVariantSchema.refine((value) => {
            return value !== undefined && value !== null && value.$id !== "";
        }, { message: "Select inventory item" }),
    quantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    staff: StaffSchema.optional(),
    department: DepartmentSchema.optional(),
    supplier: SupplierSchema,
    value: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});

export const ServiceInventoryUsageSchema: z.ZodSchema = z.lazy(() =>
    z.object({
        $id: z.string().optional(),
        item: InventoryVariantSchema.refine(
            (value) => value !== null,
            { message: "Inventory item is required" }
        ),
        amountUsed: z.preprocess((val) => {
            if (typeof val === "string" && val.trim() !== "") {
                return parseFloat(val);
            }
            return val;
        }, z.number().nonnegative()),
        service: ServiceSchema.nullable().optional(),
        $createdAt: z.preprocess((val) => {
            if (typeof val === "string" && val.trim() !== "") {
                return new Date(val);
            }
            return val;
        }, z.date().optional()),
        $updatedAt: z.preprocess((val) => {
            if (typeof val === "string" && val.trim() !== "") {
                return new Date(val);
            }
            return val;
        }, z.date().optional()),
    })
);

export const ProductInventoryUsageSchema: z.ZodSchema = z.lazy(() =>
    z.object({
        $id: z.string().optional(),
        item: InventoryVariantSchema,
        amountUsed: z.preprocess((val) => {
            if (typeof val === "string" && val.trim() !== "") {
                return parseFloat(val);
            }
            return val;
        }, z.number().nonnegative()),
        service: ProductSchema.nullable(),
        $createdAt: z.preprocess((val) => {
            if (typeof val === "string" && val.trim() !== "") {
                return new Date(val);
            }
            return val;
        }, z.date().optional()),
        $updatedAt: z.preprocess((val) => {
            if (typeof val === "string" && val.trim() !== "") {
                return new Date(val);
            }
            return val;
        }, z.date().optional()),
    })
);
    
export const ProductSchema = z.object({
    $id: z.string().optional(),
    name: z.string({
        required_error: "Product name is required",
        invalid_type_error: "Product name must be more than 2 characters long",
    }).min(2),
    slug: z.string(),
    sku: z.string(),
    category: CategorySchema,
    discount: DiscountSchema.nullable().optional(),
    description: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    allowDiscount: z.boolean(),
    image: z.string().optional(),
    status: z.boolean(),
    inventoryItems: z.array(ProductInventoryUsageSchema).optional(),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});


export const ServiceSchema = z.object({
    $id: z.string().optional(),
    name: z.string({
        required_error: "Service name is required",
        invalid_type_error: "Service name must be more than 2 characters long",
        }).min(2),
    category: CategorySchema,
    price: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number()),
    allowDiscount: z.boolean(),
    inventoryItems: z.array(ServiceInventoryUsageSchema).optional(), 
    description: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    discount: DiscountSchema.nullable().optional(),
    offeringStartTime: z.string().nullable().optional(),
    offeringEndTime: z.string().nullable().optional(),
    duration: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nullable().optional()),
    concurrentCustomers: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().optional()),
    allowWalkin: z.boolean(),
    status: z.boolean(),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});

export const ExpenseSchema = z.object({
    $id: z.string().optional(),
    name: z.string({
        required_error: "Expense title is required",
        invalid_type_error: "Expense title must be more than 2 characters long",
    }).min(2),
    category: z.string(),
    amount: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    tax: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    currency: z.string(),
    staff: StaffSchema.nullable().optional(),
    department: DepartmentSchema.nullable().optional(),
    vendor: SupplierSchema.nullable().optional(),
    expenseDate: z.date().optional(),
    dueDate: z.date().optional(),
    document: z.string().optional(),
    description: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    status: z.enum([ExpenseStatus.PAID, ExpenseStatus.PARTIAL, ExpenseStatus.UNPAID], {
        required_error: "Expense status is required",
        invalid_type_error: "Select a valid expense status",
    }),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});

export const ExpensePaymentSchema = z.object({
    $id: z.string().optional(),
    expense: ExpenseSchema,
    paymentDate: z.date(),
    paymentMethod: z.enum([PaymentMethod.BANK, PaymentMethod.CARD, PaymentMethod.CASH, PaymentMethod.CHEQUE, PaymentMethod.MOBILE, PaymentMethod.OTHER], {
        required_error: "Payment method is required",
        invalid_type_error: "Select a valid payment method",
    }),
    amount: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    document: z.string().optional(),
    description: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});

export const SectionSchema = z.object({
    $id: z.string().optional(),
    name: z.string({
        required_error: "Section name is required",
        invalid_type_error: "Section name must be more than 2 characters long",
    }).min(2),
    type: z.enum([SectionType.ROOM, SectionType.SEAT, SectionType.TABLE], {
        required_error: "Section type is required",
        invalid_type_error: "Select a valid section type",
    }),
    description: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    status: z.boolean(),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
});


