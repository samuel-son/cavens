// ============================================================
// MOBILE MONEY SERVICE — MTN, Telecel, AT Integration
// ============================================================
import { MobileProvider, PaymentResponse } from '../features/portfolio/types';

interface MoMoConfig {
  provider: MobileProvider;
  baseUrl: string;
  apiKey: string;
}

const MOMO_CONFIGS: Record<MobileProvider, MoMoConfig> = {
  MTN: {
    provider: 'MTN',
    baseUrl: 'https://sandbox.momodeveloper.mtn.com',
    apiKey: 'mtn_test_key',
  },
  Telecel: {
    provider: 'Telecel',
    baseUrl: 'https://api.telecel.com.gh',
    apiKey: 'telecel_test_key',
  },
  AT: {
    provider: 'AT',
    baseUrl: 'https://api.at.com.gh',
    apiKey: 'at_test_key',
  },
};

/**
 * Request payment from user's mobile money wallet.
 * Simulated — in production, integrates with MoMo APIs.
 */
export async function requestMoMoPayment(
  provider: MobileProvider,
  phoneNumber: string,
  amount: number,
  reference: string
): Promise<PaymentResponse> {
  const config = MOMO_CONFIGS[provider];

  // Simulated API call
  // In production:
  // const response = await axios.post(`${config.baseUrl}/collection/v1_0/requesttopay`, {
  //   amount: amount.toString(),
  //   currency: 'GHS',
  //   externalId: reference,
  //   payer: { partyIdType: 'MSISDN', partyId: phoneNumber },
  //   payerMessage: 'Cavens App Deposit',
  // }, {
  //   headers: {
  //     'X-Reference-Id': reference,
  //     'Ocp-Apim-Subscription-Key': config.apiKey,
  //   }
  // });

  await new Promise((r) => setTimeout(r, 2000));

  return {
    success: true,
    reference,
    transactionId: `momo_${provider.toLowerCase()}_${Date.now()}`,
    message: `${provider} MoMo payment of ₵${amount.toFixed(2)} initiated`,
  };
}

/**
 * Send money to a user's mobile money wallet.
 */
export async function sendToMoMo(
  provider: MobileProvider,
  phoneNumber: string,
  amount: number,
  reference: string
): Promise<PaymentResponse> {
  await new Promise((r) => setTimeout(r, 1500));

  return {
    success: true,
    reference,
    transactionId: `momo_send_${Date.now()}`,
    message: `₵${amount.toFixed(2)} sent to ${phoneNumber} via ${provider}`,
  };
}
