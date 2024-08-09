'use server'

import {PaymentStatus} from "@/types/data-schemas";

const env = process.env.NODE_ENV;

import * as Sentry from "@sentry/nextjs";
import {createAdminClient, createSaaSAdminClient} from "@/lib/appwrite";
import {auth} from "@clerk/nextjs/server";
import {getBusinessId} from "@/lib/actions/business.actions";
import {SubscriptionDetails, SubscriptionPayment} from "@/types";
import {AppwriteException, ID, Query} from "node-appwrite";
import {parseStringify} from "@/lib/utils";
import {getStatusMessage, HttpStatusCode} from "@/lib/status-handler";
import { parsePhoneNumber } from 'react-phone-number-input'
import { headers } from "next/headers";

const {
    APPWRITE_DATABASE: DATABASE_ID,
    APPWRITE_SAAS_DATABASE: SAAS_DATABASE_ID,
    SUBSRIBERS_COLLECTION: SUBSCRIBERS_COLLECTION_ID,
    PAYMENTS_COLLECTION: PAYMENTS_COLLECTION_ID,
    SUBSCRIPTION_PLANS_COLLECTION: SUBSCRIPTION_PLANS_COLLECTION_ID,
    PAYMENT_GATEWAY_PUBLIC_KEY,
    PAYMENT_GATEWAY_SECRET_KEY
} = process.env;

const handleError = (error: any) => {
    let errorMessage = 'Something went wrong with your request, please try again later.'
    if (error instanceof AppwriteException) { errorMessage = getStatusMessage(error.code as HttpStatusCode) }

    if (env === "development") { console.error(error) } else { Sentry.captureException(error) }

    throw Error(errorMessage);
}

const checkRequirements = async (collectionId: string | undefined) => {
    if ( !SAAS_DATABASE_ID || !collectionId) throw new Error('Database ID or Collection ID is missing')

    const { database } = await createSaaSAdminClient()
    if (!database) throw new Error('Database client could not be initiated')

    const { userId } = auth();
    if (!userId) { throw new Error('You must be signed in to use this feature') }

    const businessId = await getBusinessId()
    if( !businessId ) throw new Error('Business ID could not be initiated')

    const flutterWave = require('flutterwave-node-v3')
    const flw = new flutterWave(PAYMENT_GATEWAY_PUBLIC_KEY, PAYMENT_GATEWAY_SECRET_KEY)
    if( !flw ) throw new Error('Payment gateway could not be initiated')

    return { database, userId, businessId, flw }
}

export const getSubscriptionPlans = async () => {
    const {database} = await checkRequirements(SUBSCRIPTION_PLANS_COLLECTION_ID)

    try {
        const plans = await database.listDocuments(
            SAAS_DATABASE_ID!,
            SUBSCRIPTION_PLANS_COLLECTION_ID!
        )

        if (plans.total < 1) return null

        return parseStringify(plans.documents);
    } catch (error) {
        handleError(error);
    }
}

export const processPayment = async ( payment: SubscriptionPayment ) => {
    const {database, businessId, flw, userId} = await checkRequirements(PAYMENTS_COLLECTION_ID)
    const headersList = headers();

    const md5 = require('crypto-js/md5')

    const ip = headersList.get("x-forwarded-for") || "127.0.0.1";
    const useragent = headersList.get("user-agent") || 'Qroo-System';

    payment.clientIp = ip;
    payment.deviceFingerprint = md5(ip + useragent + parseStringify(payment)).toString();

    //Parse phone number
    //const parsedPhoneNumber = parsePhoneNumber(payment.phoneNumber)

    // Set payment amount
    if ( payment.subscriptionPeriod === "biAnnual" ){
        payment.amount = payment.subscriptionPlan.biAnnualFee;
    }else if ( payment.subscriptionPeriod === "annual" ){
        payment.amount = payment.subscriptionPlan.annualFee;
    } else {
        payment.amount = payment.subscriptionPlan.monthlyFee;
    }

    // Set currency
    //if ( parsedPhoneNumber?.country != 'TZ' ) throw Error("Sorry! We only accept mobile money payments from Tanzania at the moment")
    //Set to Tanzanian Shilling for now
    payment.currency = 'TZS'
    payment.redirectUrl = ''

    try {
        const transaction = await database.createDocument(
            SAAS_DATABASE_ID!,
            PAYMENTS_COLLECTION_ID!,
            ID.unique(),
            {
                ...payment,
                businessId: businessId,
                userId: userId,
                paymentStatus: PaymentStatus.PENDING,
            }
        )

        const payload = {
            "tx_ref": transaction.$id,
            "amount": payment.amount,
            "currency": payment.currency,
            "network": payment.network,
            "email": payment.email,
            "phone_number": payment.phoneNumber,
            "fullname": payment.fullName,
            "client_ip": payment.clientIp,
            "device_fingerprint": payment.deviceFingerprint
        }

        const response =  await flw.MobileMoney.tanzania(payload)

        console.log(response)
    } catch (error) {
        handleError(error);
    }

}