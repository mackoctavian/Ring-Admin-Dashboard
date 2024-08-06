import * as z from "zod";
const phoneNumberRegex = /^\+\d{10,15}$/;

//Image validation
const MAX_MB = 5; // Max size in MB
const MAX_UPLOAD_SIZE = MAX_MB * 1024 * 1024; // Convert MB to bytes
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];

export enum CategoryType{
    SERVICE = "SERVICE",
    PRODUCT = "PRODUCT",
}

export enum ModifierType{
    LIST = "LIST",
    TEXT = "TEXT",
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
    ALARM = "ALARM",
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

export enum CampaignAudience{
    ALL = "ALL",
    STAFF = "STAFF",
    CUSTOMERS = "CUSTOMERS",
}

export enum SubscriptionStatus {
    PAST = 'PAST_DUE',
    DUE = 'DUE',
    EXPIRED = 'EXPIRED',
    OK = 'OK',
    ALMOST = 'ALMOST_DUE',
    TRIAL = 'TRIAL'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export enum POSItemStatus {
    DRAFT = 'Draft',
    ACTIVE = 'Active',
    ARCHIVED = 'Archived'
}

export const MultiSelectSchema = z.object({
    label: z.string(),
    value: z.string(),
    disable: z.boolean().optional(),
});

export const BusinessTypeSchema = z.object({
    $id: z.string(),
    name: z.string(),
    $createdAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date()),
    $updatedAt: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date()),
})

export const SignUpSchema = z.object({
    name: z.string().min(3),
    phoneNumber: z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
    businessType: BusinessTypeSchema,
    size: z.string(),
    city: z.string().optional(),
    country: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
})


export const BusinessRegistrationSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    name: z.string(),
    phoneNumber: z.string().regex(phoneNumberRegex, "Invalid phone number"),
    logo: z.custom<File[]>().optional(),
    size: z.string(),
    currency: z.string(),
    city: z.string().optional(),
    country: z.string(),
    email: z.string().email(),
    address: z.string().optional(),
    businessType: BusinessTypeSchema,
    description: z.string().optional(),
    registrationNumber: z.string().optional(),
    termsConsent: z
        .boolean()
        .default(false)
        .refine((value) => value === true, {
            message: "You must consent to the terms & conditions before you proceed",
        }),
})


export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export const UserSchema: z.ZodSchema = z.lazy(() =>
    z.object({
        $id: z.string().optional(),
        name: z.string(),
        email: z.string().email(),
        phoneNumber: z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
        city: z.string().optional(),
        country: z.string().optional(),
        gender: z.nativeEnum(Gender).optional(),
        dateOfBirth: z.preprocess((val) => {
            if (typeof val === "string" && val.trim() !== "") {
                return new Date(val);
            }
            return val;
        }, z.date().optional()),
        points: z.number().positive(),
        status: z.boolean(),
        userId: z.string(),
        business: BusinessSchema.optional(),
        isOwner: z.boolean(),
    })
)

export const BusinessSchema = z.object({
    name: z.string(),
    phoneNumber: z.string().regex(phoneNumberRegex, "Invalid phone number"),
    logo: z.custom<File[]>().optional(),
    size: z.string(),
    currency: z.string(),
    city: z.string().optional().nullable(),
    country: z.string(),
    email: z.string().email(),
    address: z.string().optional().nullable(),
    businessType: BusinessTypeSchema,
    description: z.string().optional().nullable(),
    registrationNumber: z.string().optional().nullable()
})

export const BranchSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
    email: z.string().email("Invalid email address"),
    phoneNumber:  z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    daysOpen: z.array(z.string()).min(1, { message: "Select at least one day" }),
    openingTime: z.string(),
    closingTime: z.string(),
    staffCount: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative().gt(0)),
    status: z.boolean()
})

export const DepartmentSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
    shortName: z.string(),
    branch: BranchSchema,
    status: z.boolean(),
});

export const CampaignSchema = z.object({
    $id: z.string().optional(),
    title: z.string().min(1, {message: "Enter campaign title"}),
    message: z.string().min(10).max(160),
    audience: z.nativeEnum(CampaignAudience, {message: "Select your campaign target audience"}),
    scheduleDate: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date({message: "Select a date to broadcast your message"}))
});
    


export const StaffSchema = z.object({
    $id: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email("Invalid email address").trim().optional().nullable(),
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
    emergencyName: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    emergencyRelationship: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    address: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    notes: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    image: z.custom<File[]>().optional(),
    posAccess: z.boolean(),
    dashboardAccess: z.boolean(),
    status: z.boolean(),
    department: z.array(z.string()).min(1, { message: "Select at least one department" }),
    branch: z.array(z.string()).min(1, { message: "Select at least one branch" })
}).superRefine((values, context) => {
    if ( values.dashboardAccess === true && ( !values.email || values.email.trim() === "" ) ){
    console.log("Email value",values.email)
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required for dashboard access",
        path: ["email"],
      });

    }
})

export const SupplierSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
    email: z.string().email("Invalid email address").optional().nullable(),
    contactPersonName: z.string(),
    branch: z.array(z.string()).min(1, { message: "Select at least one branch" }),
    phoneNumber:  z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
    address: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    status: z.boolean()
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
    }, z.number().nonnegative()),
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
    status: z.boolean()
}).superRefine((values, context) => {
    if ( values.type === DiscountType.PERCENTAGE && (values.value < 0 || values.value > 100) ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Discount value must be between 0 - 100%",
        path: ["value"],
      });

    }
})

export const CategorySchema = z.object({
        $id: z.string().optional(),
        type: z.enum([CategoryType.SERVICE, CategoryType.PRODUCT], {
            required_error: "Category type is required",
            invalid_type_error: "Category type must be either 'Product' or 'Service'",
        }),
        name: z.string({
            required_error: "Product category name is required",
            invalid_type_error: "Product category name must be more than 2 characters long",
        }).min(2),
        parent: z.string().optional().nullable(),
        description: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
        status: z.boolean()
});


export const ProductUnitSchema = z.object({
    $id: z.string().optional(),
    shortName: z.string().min(1),
    name: z.string().min(1),
    status: z.boolean()
});


export const UpdateInventoryVariantSchema = z.object({
    $id: z.string(),
    name: z.string(),
    itemsPerUnit: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative().optional()),
    lowQuantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    barcodeId: z.string().length(13, { message: "Must be exactly 13 characters long" }).nullable().optional(),
    itemsPerPackage: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative().optional()),
    volume: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().nonnegative().optional()),
    unit: z.string().optional(),
    amount: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().nonnegative().optional()),
    image: z.string().optional().nullable(),
    status: z.nativeEnum(InventoryStatus)
});

export const InventoryVariantSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
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
    startingValue: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().nonnegative()),
    lowQuantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    barcodeId: z.string().length(13, { message: "Must be exactly 13 characters long" }).nullable().optional(),
    itemsPerPackage: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative().optional()),
    volume: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().nonnegative().optional()),
    unit: z.string().optional(),
    amount: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().nonnegative().optional()),
    image: z.string().optional().nullable(),
    value: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().nonnegative().optional())
});

export const InventorySchema = z.object({
    $id: z.string().optional(),
    title: z.string(),
    packaging: z.string(),
    variants: z.array(InventoryVariantSchema).min(1, "At least one item is required")
});

export const UpdateInventorySchema = z.object({
    $id: z.string().optional(),
    title: z.string().nonempty("Title is required"),
    packaging: z.string(),
    variants: z.array(UpdateInventoryVariantSchema).min(1, "At least one item is required")
});

export const InventoryModificationSchema = z.object({
    $id: z.string().optional(),
    item: z.string(),
    quantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number()),
    value: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number()),
    reason: z.string(),
    notes: z.preprocess((val) => val === null ? "" : val, z.string().optional())
});

export const ModifierItemSchema = z.object({
    $id: z.string().optional(),
    name: z.string().min(1),
    price: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number()),
    quantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().optional().nullable()),
    unit: z.string().optional().nullable(),
    inventoryItem: z.string().optional().nullable(),
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


export const ModifierSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
    type: z.nativeEnum(ModifierType),
    allowMultiple: z.boolean(),
    optional: z.boolean(),
    image: z.string().optional(),
    modifierItems: z.array(ModifierItemSchema).min(1, "At least one item is required"),
    status: z.nativeEnum(POSItemStatus),
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

export const StockSchema = z.object({
    $id: z.string().optional(),
    item: z.string(),
    quantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative().gt(0, "Quantity must be greater than zero")), // Ensuring quantity is greater than zero
    staff: z.string(),
    supplier: z.string(),
    value: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().nonnegative().gt(0, "Value must be greater than zero")), // Ensuring value is greater than zero
    accurate: z.preprocess((val) => {
        if (typeof val === "string" && val.trim().toLowerCase() === "true") {
            return true;
        }
        if (typeof val === "string" && val.trim().toLowerCase() === "false") {
            return false;
        }
        return val;
    }, z.boolean()),
    orderNumber: z.string().trim().optional(),
    orderDate: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date()),
    deliveryDate: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date())
});


export const CustomerSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email address").trim().optional(),
    phoneNumber: z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits.").optional(),
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
    registrationBranch: z.string(),
    address: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    notes: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    allowNotifications: z.boolean(),
});

export const SubscriptionPlanSchema = z.object({
    $id: z.string(),
    name: z.string(),
    features: z.string(),
    monthlyFee: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().nonnegative()),
    biAnnualFee: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().nonnegative()),
    annualFee: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().nonnegative()),
    status: z.boolean(),
})

export const SubscriptionPaymentSchema = z.object({
    paymentMethod: z.string().trim(),
    fullName: z.string().trim(),
    email: z.string().email("Invalid email address").trim(),
    phoneNumber: z.string().regex(phoneNumberRegex, "Invalid phone number"),
    subscriptionPeriod: z.string().trim(),
    subscriptionPlan: SubscriptionPlanSchema,
    network: z.string().trim(),
})

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
        unit: z.string(),
        //TODO: use unit object unit: ProductUnitSchema,
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

export const ProductVariantSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
    price: z.preprocess((val) => {
            if (typeof val === "string" && val.trim() !== "") {
                return parseFloat(val);
            }
            return val;
        }, z.number().nonnegative()),
    tax: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number().nonnegative()),
    barcode: z.string().optional().nullable(),
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


export const ProductSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
    sku: z.string().optional().nullable(),
    category: z.array(CategorySchema).min(1, "Select category"),
    description: z.string().optional().nullable(),
    posStatus: z.nativeEnum(POSItemStatus),
    branch: z.array(BranchSchema).min(1, { message: "Select at least one branch" }),
    department: z.array(DepartmentSchema).min(1, { message: "Select at least one department" }),
    modifier: z.array(ModifierSchema).optional().nullable(),
    image: z.custom<File[]>().optional(),
    variants: z.array(ProductVariantSchema).min(1, "At least one variant is required")
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
    name: z.string({
        required_error: "Expense title is required",
        invalid_type_error: "Expense title must be more than 2 characters long",
    }).min(2),
    category: z.string(),
    amount: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
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
    staff: z.string().nullable().optional(),
    department: z.string().nullable().optional(),
    vendor: z.string().nullable().optional(),
    dueDate: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date()),
    document: z.custom<File[]>().optional().nullable(),
    branch: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    status: z.nativeEnum(ExpenseStatus)
});

export const ExpensePaymentSchema = z.object({
    $id: z.string().optional(),
    expense: z.string(),
    paymentDate: z.date(),
    paymentMethod: z.nativeEnum(PaymentMethod, {message: "Select the repayment method"}),
    amount: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    document: z.string().optional(),
    description: z.preprocess((val) => val === null ? "" : val, z.string().optional())
});

export const SectionSchema = z.object({
    $id: z.string().optional(),
    name: z.string().min(2),
    noOfCustomers: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative().gt(0)),
    type: z.nativeEnum(SectionType),
    branch: z.string(),
    description: z.string().optional().nullable(),
    status: z.boolean()
});


export const DeviceSchema = z.object({
    $id: z.string().optional(),
    name: z.string({
        required_error: "Device name is required",
        invalid_type_error: "Device name must be more than 2 characters long",
    }).min(2),
    branchId: z.string(),
    status: z.boolean(),
    code: z.coerce
            .string()
            .trim()
            .toUpperCase()
            .regex(/^[A-Z0-9]*$/, "Activation code can only have letters and numbers!")
            .min(6, "Activation code must be 6 characters long!")
            .max(6, "Activation code must be 6 characters long!")
            .transform((val) => val.toUpperCase())
});