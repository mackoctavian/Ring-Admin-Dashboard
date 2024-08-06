'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { Inventory, InventoryModification } from "@/types";
import { InventoryStatus } from "@/types/data-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'
import { capitalizeFirstLetter } from "@/lib/utils"

const {
    INVENTORY_COLLECTION: INVENTORY_COLLECTION_ID,
    INVENTORY_VARIANTS_COLLECTION: INVENTORY_VARIANTS_COLLECTION_ID,
    INVENTORY_MODIFICATION_COLLECTION: INVENTORY_MODIFICATION_COLLECTION_ID,
    ALARM_QUANTITY = 3
} = process.env;

export const createItem = async (data: Inventory) => {
  if( !data ) throw new Error("Data required to process request")

  const { database, businessId, databaseId, collectionId } = await databaseCheck(INVENTORY_COLLECTION_ID, {needsBusinessId: true})
  const alarmQuantity : number = parseInt(String(ALARM_QUANTITY));

  for ( const variant of data.variants ) {
    //Add business id to the variant
    variant.businessId = businessId!;

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
      databaseId,
      collectionId,
      ID.unique(),
      {
        ...data,
        businessId: businessId
      }
    )
  } catch (error: any) {
    handleError(error, "Error creating stock item:");
  }

  revalidatePath('/dashboard/inventory')
  redirect('/dashboard/inventory')
};

export const list = async ( ) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(INVENTORY_COLLECTION_ID, {needsBusinessId: true})
  try {
    const items = await database.listDocuments(
      databaseId,
      collectionId,
      [
        Query.orderAsc("name"),
        Query.equal('businessId', businessId!)
      ]
    );

    if (items.documents.length == 0) return null

    return parseStringify(items.documents);

  } catch (error: any) {
    handleError(error, "Error listing stock items")
  }
}

export const listVariants = async ( ) => {
    const { database, businessId, databaseId, collectionId } = await databaseCheck(INVENTORY_VARIANTS_COLLECTION_ID, {needsBusinessId: true})
    try {
      const items = await database.listDocuments(
        databaseId,
        collectionId,
        [
          Query.orderAsc("fullName"),
          Query.equal('businessId', businessId!)
        ]
      );

      if (items.documents.length == 0) return null

      return parseStringify(items.documents);
    } catch (error: any) {
      handleError(error, "Error listing variants");
    }
  };

  export const getItems = async (
    q?: string,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    const { database, businessId, databaseId, collectionId } = await databaseCheck(INVENTORY_COLLECTION_ID, {needsBusinessId: true})
    try {  
      const queries = [];
      queries.push(Query.equal("businessId", businessId!));
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
        databaseId,
        collectionId,
        queries
      );
  
      if (items.documents.length == 0) return null
  
      return parseStringify(items.documents);
    } catch (error: any) {
      handleError(error, "Error getting stock intake data")
    }
}

export const getVariantItems = async (
  q?: string,
  status?: InventoryStatus | null,
  limit?: number | null,
  offset?: number | 1,
) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(INVENTORY_VARIANTS_COLLECTION_ID, {needsBusinessId: true})

  try {
    const queries = [];
    queries.push(Query.equal("businessId", businessId!));
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
      databaseId,
      collectionId,
      queries
    );

    if (items.documents.length == 0) return null

    return parseStringify(items.documents);
  } catch (error: any) {
    handleError(error, "Error getting stock variants")
  }
};

export const getItem = async (id: string) => {
    if( !id ) return null
    const { database, databaseId, collectionId } = await databaseCheck(INVENTORY_COLLECTION_ID);

    try {
      const item = await database.listDocuments(
        databaseId,
        collectionId,
        [Query.equal('$id', id)]
      )
  
      if ( item.total == 0 ) return null;

      return parseStringify(item.documents[0]);

    } catch (error: any) {
      handleError(error, "Error getting stock item")
    }
};

export const getInventoryVariant = async (id: string) => {
  if( !id ) return null
  const { database, databaseId, collectionId } = await databaseCheck(INVENTORY_VARIANTS_COLLECTION_ID);

  try {
    const item = await database.listDocuments(
        databaseId,
        collectionId,
        [Query.equal('$id', id)]
    )

    if ( item.total == 0 ) return null;

    return parseStringify(item.documents[0]);

  } catch (error: any) {
    handleError(error, "Error getting variant:")
  }
}

export const deleteItem = async ({ $id }: Inventory) => {
    if (!$id) return null;
    const { database, databaseId, collectionId } = await databaseCheck(INVENTORY_COLLECTION_ID);

    try {
      await database.deleteDocument(
        databaseId,
        collectionId,
        $id);
    } catch (error: any) {
      handleError(error, "Error deleting inventory item")
    }

    revalidatePath('/dashboard/inventory')
    redirect('/dashboard/inventory')
  };

export const updateItem = async (inventoryId: string, data: Inventory) => {
  if (!inventoryId || !data ) return null;
  const { database, businessId, databaseId, collectionId } = await databaseCheck(INVENTORY_COLLECTION_ID, {needsBusinessId: true})
  const alarmQuantity = parseInt(String(ALARM_QUANTITY));

  console.log("variants", data.variants)

  try {
    for (const variant of data.variants) {
      // Modify full name for the variants assuming name has changed
      variant.fullName = capitalizeFirstLetter(`${data.title} ${data.packaging ?? ''} ${variant.name ?? ''}`.trim());

      if (variant.$id) {
        //Variant exists so we are just updating

        // Modify status in-case low quantity value changed
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
        // Set new ID
        variant.$id = ID.unique();

        // Set business ID
        variant.businessId = businessId!

        // Ensure quantities and values are parsed correctly and are numbers
        variant.startingQuantity = variant.startingQuantity || 0;
        variant.startingValue = variant.startingValue || 0;

        variant.quantity = variant.startingQuantity
        variant.actualQuantity = variant.startingQuantity

        variant.value = variant.startingValue
        variant.actualValue = variant.startingValue

        if (variant.startingQuantity == 0) {
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

    console.log("Item", data)


    await database.updateDocument(
      databaseId,
      collectionId,
      inventoryId,
      data
    )
  } catch (error: any) {
    handleError(error, "Error updating variant:")
  }

  revalidatePath('/dashboard/inventory');
  redirect('/dashboard/inventory');
};

export const modifyStockItem = async (data: InventoryModification) => {
    if (!data) return null;
    const { database, businessId, databaseId, collectionId } = await databaseCheck(INVENTORY_MODIFICATION_COLLECTION_ID, {needsBusinessId: true})
    const alarmQuantity = parseInt(String(ALARM_QUANTITY));

    const inventoryVariantItem = await getInventoryVariant(data.item)
    if ( !inventoryVariantItem ) return null

    //Remove un-needed variables
    const { $databaseId, $collectionId, ...variantItem } = inventoryVariantItem;

    try {
      //Create record of modification
      await database.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          ...data,
          businessId: businessId,
          itemId: variantItem.$id
        }
      )

      //modify item quantity
      variantItem.actualValue = data.value;
      variantItem.value = data.value;

      //modify item value
      variantItem.actualQuantity = data.quantity;
      variantItem.quantity = data.quantity;

      //Update stock status
      if ( variantItem.quantity == 0 ) {
        variantItem.status = InventoryStatus.OUT_OF_STOCK;
      } else if (variantItem.quantity <= variantItem.lowQuantity) {
        variantItem.status = InventoryStatus.LOW_STOCK;
      } else if (variantItem.quantity <= variantItem.lowQuantity + alarmQuantity) {
        variantItem.status = InventoryStatus.ALARM;
      } else {
        variantItem.status = InventoryStatus.IN_STOCK;
      }

      console.log("Item", variantItem)

      await database.updateDocument(
        databaseId,
        INVENTORY_VARIANTS_COLLECTION_ID!,
          variantItem.$id!,
          variantItem);
  
    } catch (error: any) {
      handleError(error, "Error updating modifying stock values: ")
    }

    revalidatePath('/dashboard/inventory')
    redirect('/dashboard/inventory')
  };