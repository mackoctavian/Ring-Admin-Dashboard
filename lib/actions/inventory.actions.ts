'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs"
import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Inventory, InventoryModification } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { InventoryStatus } from "@/types/data-schemas";
import { auth } from "@clerk/nextjs/server";
import { getBusinessId } from "./business.actions";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'
import { capitalizeFirstLetter } from "@/lib/utils"

const {
    APPWRITE_DATABASE: DATABASE_ID,
    INVENTORY_COLLECTION: INVENTORY_COLLECTION_ID,
    INVENTORY_VARIANTS_COLLECTION: INVENTORY_VARIANTS_COLLECTION_ID,
    INVENTORY_MODIFICATION_COLLECTION: INVENTORY_MODIFICATION_COLLECTION_ID,
    ALARM_QUANTITY = 3
} = process.env;

const checkRequirements = async (collectionId: string | undefined) => {
  if (!DATABASE_ID || !collectionId) throw new Error('Database ID or Collection ID is missing');

  const { database } = await createAdminClient();
  if (!database) throw new Error('Database client could not be initiated');

  const { userId } = auth();
  if (!userId) {
    throw new Error('You must be signed in to use this feature');
  }
  
  const businessId = await getBusinessId();
  if( !businessId ) throw new Error('Business ID could not be initiated');

  return { database, userId, businessId };
};


export const createItem = async (data: Inventory) => {
  const { database, businessId } = await checkRequirements(INVENTORY_COLLECTION_ID)
  const alarmQuantity : number = parseInt(ALARM_QUANTITY);

  for ( const variant of data.variants ) {
    //Add business Id to the variant
    variant.businessId = businessId;

    // Ensure quantities and values are parsed correctly and are numbers
    const startingQuantity = variant.startingQuantity || 0;
    const startingValue =variant.startingValue || 0;

    //Set status
    if (startingQuantity === 0) {
      variant.status = InventoryStatus.OUT_OF_STOCK;
    } else if (startingQuantity <= variant.lowQuantity) {
      variant.status = InventoryStatus.LOW_STOCK;
    } else if (startingQuantity <= variant.lowQuantity + alarmQuantity) {
      variant.status = InventoryStatus.ALARM;
    } else {
      variant.status = InventoryStatus.IN_STOCK;
    }

    //Set full name
    variant.fullName = capitalizeFirstLetter(`${data.title} ${data.packaging ?? ''} ${variant.name ?? ''}`.trim());

    //Set value
    variant.value = startingValue;
    variant.actualValue = startingValue;

    //Set quantity
    variant.quantity = variant.startingQuantity;
    variant.actualQuantity = variant.startingQuantity;
  }

  //console.log(data)
  try {
    await database.createDocument(
      DATABASE_ID!,
      INVENTORY_COLLECTION_ID!,
      ID.unique(),
      {
        ...data,
        businessId: businessId
      }
    )
  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }

    if(env == "development"){ console.error(error); }

    Sentry.captureException(error);
    throw Error(errorMessage);
  }

  revalidatePath('/inventory')
  redirect('/inventory')
};

export const list = async ( ) => {
  const { database, businessId } = await checkRequirements(INVENTORY_COLLECTION_ID);

    try {
      const items = await database.listDocuments(
        DATABASE_ID!,
        INVENTORY_COLLECTION_ID!,
        [
          Query.orderAsc("name"),
          Query.equal('businessId', businessId!)
        ]
      );

      return parseStringify(items.documents);

    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }
  };

export const listVariants = async ( ) => {
    const { database, businessId } = await checkRequirements(INVENTORY_VARIANTS_COLLECTION_ID);

    try {
      const items = await database.listDocuments(
        DATABASE_ID!,
        INVENTORY_VARIANTS_COLLECTION_ID!,
        [
          Query.orderAsc("fullName"),
          Query.equal('businessId', businessId!)
        ]
      );

      return parseStringify(items.documents);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }
  };

  export const getItems = async (
    q?: string,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    const { database, businessId } = await checkRequirements(INVENTORY_COLLECTION_ID);

    try {  
      const queries = [];
      queries.push(Query.equal("businessId", businessId));
      queries.push(Query.orderAsc("name"));

      if ( limit ) {
        queries.push(Query.limit(limit));
        queries.push(Query.offset(offset!));
      }
  
      if (q) {
        queries.push(Query.search('name', q));
      }
  
      if (status) {
        queries.push(Query.equal('status', status));
      }
  
      const items = await database.listDocuments(
        DATABASE_ID!,
        INVENTORY_COLLECTION_ID!,
        queries
      );
  
      if (items.documents.length === 0) {
        return [];
      }
  
      return parseStringify(items.documents);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }
  };


  export const getVariantItems = async (
    q?: string,
    status?: InventoryStatus | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    const { database, businessId } = await checkRequirements(INVENTORY_VARIANTS_COLLECTION_ID);
  
    try {  
      const queries = [];
      queries.push(Query.equal("businessId", businessId));
      queries.push(Query.orderAsc("fullName"));

      if ( limit ) {
        queries.push(Query.limit(limit));
        queries.push(Query.offset(offset!));
      }
  
      if (q) {
        queries.push(Query.search('fullName', q));
      }
  
      if (status) {
        queries.push(Query.equal('status', status));
      }
  
      const items = await database.listDocuments(
        DATABASE_ID!,
        INVENTORY_VARIANTS_COLLECTION_ID!,
        queries
      );
  
      if (items.documents.length === 0) {
        return [];
      }
  
      return parseStringify(items.documents);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }
  };

export const getItem = async (id: string) => {
    if( !id ) return null
    const { database } = await checkRequirements(INVENTORY_COLLECTION_ID);

    try {
      if (!id) throw new Error('Document ID is missing');
  
      const item = await database.listDocuments(
        DATABASE_ID!,
        INVENTORY_COLLECTION_ID!,
        [Query.equal('$id', id)]
      )
  
      if ( item.total < 1 ) return null;

      return parseStringify(item.documents[0]);

    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }
  };

export const deleteItem = async ({ $id }: Inventory) => {
    if (!$id) return null;
    const { database } = await checkRequirements(INVENTORY_COLLECTION_ID);

    try {
      await database.deleteDocument(
        DATABASE_ID!,
        INVENTORY_COLLECTION_ID!,
        $id);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }

    revalidatePath('/inventory')
    redirect('/inventory')
  };

export const updateItem = async (inventoryId: string, data: Inventory) => {
  const { database, businessId } = await checkRequirements(INVENTORY_COLLECTION_ID);
  const alarmQuantity = parseInt(ALARM_QUANTITY, 10);

  try {
    for (const variant of data.variants) {
      // Modify full name for the variants assuming name has changed
      variant.fullName = capitalizeFirstLetter(`${data.title} ${data.packaging ?? ''} ${variant.name ?? ''}`.trim());

      if (variant.$id) {
        //Variant exists so we are just updating

        // Modify status incase low quantity value changed
        if (variant.quantity === 0) {
          variant.status = InventoryStatus.OUT_OF_STOCK;
        } else if (variant.quantity <= variant.lowQuantity) {
          variant.status = InventoryStatus.LOW_STOCK;
        } else if (variant.quantity <= variant.lowQuantity + alarmQuantity) {
          variant.status = InventoryStatus.ALARM;
        } else {
          variant.status = InventoryStatus.IN_STOCK;
        }

      }else{
        //New variant added

        // Set new ID
        variant.$id = ID.unique();

        // Set business ID
        variant.businessId = businessId

        // Ensure quantities and values are parsed correctly and are numbers
        variant.startingQuantity = variant.startingQuantity || 0;
        variant.startingValue = variant.startingValue || 0;

        variant.quantity = variant.startingQuantity
        variant.actualQuantity = variant.startingQuantity

        variant.value = variant.startingValue
        variant.actualValue = variant.startingValue

        if (variant.startingQuantity === 0) {
          variant.status = InventoryStatus.OUT_OF_STOCK;
        } else if (variant.startingQuantity <= variant.lowQuantity) {
          variant.status = InventoryStatus.LOW_STOCK;
        } else if (variant.startingQuantity <= variant.lowQuantity + alarmQuantity) {
          variant.status = InventoryStatus.ALARM;
        } else {
          variant.status = InventoryStatus.IN_STOCK;
        }

      }

    }

    await database.updateDocument(
      DATABASE_ID!,
      INVENTORY_COLLECTION_ID!,
      inventoryId,
      data
    );


  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }

    if (process.env.NODE_ENV === "development") {
      console.error(error);
    }

    Sentry.captureException(error);
    throw Error(errorMessage);
  }

  revalidatePath('/inventory');
  redirect('/inventory');
};

export const modifyStockItem = async (data: InventoryModification) => {
    if (!data) return null;
    const { database, businessId } = await checkRequirements(INVENTORY_COLLECTION_ID);
    const alarmQuantity = parseInt(ALARM_QUANTITY, 10);

    try {
      //Create record of modification
      await database.createDocument(
        DATABASE_ID!,
        INVENTORY_MODIFICATION_COLLECTION_ID!,
        ID.unique(),
        {
          ...data,
          businessId: businessId,
          itemId: data.item.$id
        }
      )

      //modify item quantity
      data.item.actualValue = data.value;
      data.item.value = data.value;

      //modify item value
      data.item.actualQuantity = data.quantity;
      data.item.quantity = data.quantity;

      //Update stock status
      if ( data.item.quantity === 0 ) {
        data.item.status = InventoryStatus.OUT_OF_STOCK;
      } else if (data.item.quantity <= data.item.lowQuantity) {
        data.item.status = InventoryStatus.LOW_STOCK;
      } else if (data.item.quantity <= data.item.lowQuantity + alarmQuantity) {
        data.item.status = InventoryStatus.ALARM;
      } else {
        data.item.status = InventoryStatus.IN_STOCK;
      }

      await database.updateDocument(
        DATABASE_ID!,
        INVENTORY_VARIANTS_COLLECTION_ID!,
        data.item.$id!,
        data.item);
  
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }

    revalidatePath('/inventory')
    redirect('/inventory')
  };