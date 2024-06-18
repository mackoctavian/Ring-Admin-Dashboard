import { count } from "console";
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
    name: z.string().min(3),
    // logo: z
    // .custom<FileList>()
    // .transform((file) => file.length > 0 && file.item(0))
    // .refine((file) => !file || (!!file && file.size <= MAX_UPLOAD_SIZE ), {
    //   message: `Max image size is ${MAX_MB}MB`,
    // })
    // .refine((file) => !file || (!!file && file.type?.startsWith("image")), {
    //   message: "Only .jpg .jpeg and .png formats are supported",
    // }),
    phoneNumber: z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
    businessType: BusinessTypeSchema,
    size: z.string(),
    city: z.string().optional(),
    country: z.string(),
    email: z.string().email(),
    address: z.string().optional(),
    description: z.string().optional(),
    registrationNumber: z.string().optional(),
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
    $id: z.string().optional(),
    name: z.string(),
    businessType: BusinessTypeSchema,
    size: z.string(),
    registrationNumber: z.string().optional(),
    // logo: z.instanceof(File)
    // .optional()
    // .refine(
    //     (file) => !file || file.size !== 0 || file.size <= MAX_UPLOAD_SIZE,
    //     `Max image size is ${MAX_MB}MB`
    // )
    // .refine(
    //     (file) => !file || file.type === "" || ACCEPTED_IMAGE_TYPES.includes(file.type),
    //     "Only .jpg .jpeg and .png formats are supported"
    // ),
    email: z.string().email(),
    phoneNumber: z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    country: z.string(),
    authId: z.string(),
    description: z.string().optional(),
    slug: z.string(),
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

export const BranchSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
    email: z.string().email("Invalid email address"),
    businessId: z.string().optional(),
    business: BusinessSchema.optional(),
    phoneNumber:  z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    daysOpen: z.array(MultiSelectSchema).min(1, { message: "Select at least one day" }),
    openingTime: z.string().optional(),
    closingTime: z.string().optional(),
    staffCount: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
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
})

export const DepartmentSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
    shortName: z.string(),
    branch: BranchSchema.omit({business: true, daysOpen: true}),
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
    }, z.date({message: "Select a date to broadcast your message"})),
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
    $id: z.string().optional(),
    name: z.string(),
    email: z.string().email("Invalid email address").trim().optional(),
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
    // image: z.instanceof(File)
    // .optional()
    // .refine(
    //     (file) => !file || file.size !== 0 || file.size <= MAX_UPLOAD_SIZE,
    //     `Max image size is ${MAX_MB}MB`
    // )
    // .refine(
    //     (file) => !file || file.type === "" || ACCEPTED_IMAGE_TYPES.includes(file.type),
    //     "Only .jpg .jpeg and .png formats are supported"
    // ).nullable(),
    posAccess: z.boolean(),
    dashboardAccess: z.boolean(),
    status: z.boolean(),
    department: z.array(DepartmentSchema.omit({branch: true})).min(1, { message: "Select at least one department" }),
    branch: z.array(BranchSchema.omit({business: true, daysOpen: true})).min(1, { message: "Select at least one branch" }),
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
    branch: z.array(BranchSchema.omit({business: true, daysOpen: true})).min(1, { message: "Select at least one branch" }),
    phoneNumber:  z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
    address: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
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
}).superRefine((values, context) => {
    if ( values.type === DiscountType.PERCENTAGE && (values.value < 0 || values.value > 100) ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Discount value must be between 0 - 100%",
        path: ["value"],
      });

    }
})

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
    })
)

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
    fullName: z.string().trim().nonempty(),
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
    actualQuantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().optional()),
    quantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative().optional()),
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
    // image: z.instanceof(File)
    // .optional()
    // .refine(
    //     (file) => !file || file.size !== 0 || file.size <= MAX_UPLOAD_SIZE,
    //     `Max image size is ${MAX_MB}MB`
    // )
    // .refine(
    //     (file) => !file || file.type === "" || ACCEPTED_IMAGE_TYPES.includes(file.type),
    //     "Only .jpg .jpeg and .png formats are supported"
    // ),
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
    packaging: z.string(),
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

export const InventoryModificationSchema = z.object({
    $id: z.string().optional(),
    item: InventoryVariantSchema,
    quantity: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number()),
    reason: z.string(),
    notes: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
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
    inventoryItem: InventoryVariantSchema.optional().nullable(),
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
})

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
    accurate: z.boolean(),
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
    }, z.date()),
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


export const CustomerSchema = z.object({
    name: z.string(),
    email: z.string().email("Invalid email address").trim().optional(),
    phoneNumber: z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits.").optional(),
    code: z.preprocess((val) => val === null ? undefined : val, z.string().optional()),
    gender: z.enum([Gender.UNDISCLOSED, Gender.MALE, Gender.FEMALE]),
    dateOfBirth: z.preprocess((val) => {
        if (val === null) return undefined;
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date().optional()),
    nationality: z.preprocess((val) => val === null ? "" : val, z.string().optional()),        
    registrationBranch: BranchSchema.omit({business: true, daysOpen: true}),
    address: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    notes: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    allowNotifications: z.boolean(),
});










    
// export const ProductSchema = z.object({
//     $id: z.string().optional(),
//     name: z.string({
//         required_error: "Product name is required",
//         invalid_type_error: "Product name must be more than 2 characters long",
//     }).min(2),
//     sku: z.string(),
//     category: CategorySchema,
//     discount: DiscountSchema.nullable().optional(),
//     description: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
//     allowDiscount: z.boolean(),
//     image: z.string().optional(),
//     status: z.boolean(),
//     inventoryItems: z.array(ProductInventoryUsageSchema).optional(),
//     $createdAt: z.preprocess((val) => {
//         if (typeof val === "string" && val.trim() !== "") {
//             return new Date(val);
//         }
//         return val;
//     }, z.date().optional()),
//     $updatedAt: z.preprocess((val) => {
//         if (typeof val === "string" && val.trim() !== "") {
//             return new Date(val);
//         }
//         return val;
//     }, z.date().optional()),
// });


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
    id: z.string().optional(),
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
  });


export const ProductSchema = z.object({
    $id: z.string().optional(),
    name: z.string(),
    sku: z.string(),
    category: z.array(CategorySchema),
    description: z.string().min(5),
    posStatus: z.nativeEnum(POSItemStatus),
    branch: z.array(BranchSchema.omit({daysOpen: true})),
    department: z.array(DepartmentSchema),
    modifier: z.array(ModifierSchema),
    image: z.string(),
    variants: z.array(ProductVariantSchema).min(1, "At least one variant is required"),
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
    dueDate: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return new Date(val);
        }
        return val;
    }, z.date()),
    document: z.string().optional(),
    branch: BranchSchema.omit({business: true, daysOpen: true}).nullable().optional(),
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
    noOfCustomers: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().nonnegative()),
    type: z.enum([SectionType.ROOM, SectionType.SEAT, SectionType.TABLE], {
        required_error: "Section type is required",
        invalid_type_error: "Select a valid section type",
    }),
    branch: BranchSchema.omit({business: true, daysOpen: true}),
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