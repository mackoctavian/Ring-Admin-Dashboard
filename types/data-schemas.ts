import * as z from "zod";

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

const phoneNumberRegex = /^[0-9]{10,15}$/;

export const DepartmentSchema = z.object({
    $id: z.string(),
    name: z.string(),
    shortName: z.string(),
    status: z.boolean(),
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
        parent: z.string().optional(),
        discount: DiscountSchema.optional(),
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
);

export const ServiceSchema = z.object({
    $id: z.string().optional(),
    name: z.string({
        required_error: "Product category name is required",
        invalid_type_error: "Product category name must be more than 2 characters long",
        }).min(2),
    category: CategorySchema,
    price: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseFloat(val);
        }
        return val;
    }, z.number()),
    allowDiscount: z.boolean(),
    description: z.preprocess((val) => val === null ? "" : val, z.string().optional()),
    discount: DiscountSchema.optional(),
    offeringStartTime: z.string().optional(),
    offeringEndTime: z.string().optional(),
    duration: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number().optional()),
    concurrentCustomers: z.preprocess((val) => {
        if (typeof val === "string" && val.trim() !== "") {
            return parseInt(val);
        }
        return val;
    }, z.number()),
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


export const InventoryUsageSchema = z.object({
    $id: z.string().optional(),
    item: InventoryVariantSchema,

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

// export const StockSchema = z.object({
//     $id: z.string().optional(),
//     name: z.string(),
//     quantity: z.number().nonnegative(),
//     variants: StockVariantSchema,
//     status: z.nativeEnum(InventoryStatus),
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
