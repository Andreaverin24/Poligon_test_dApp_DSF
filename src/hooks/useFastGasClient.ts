// useFastGasClient.ts

import { usePublicClient } from 'wagmi';

function promiseTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('TimeoutError')), ms);
    promise.then((value) => {
      clearTimeout(timer);
      resolve(value);
    }).catch((err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

export const useFastGasClient = () => {
  const client = usePublicClient();
  if (!client) return undefined;

  const smartGetGasPrice = async () => {
    try {
      return await promiseTimeout(client.getGasPrice(), 4000);
    } catch (err: any) {
      if (err?.message === 'TimeoutError' && typeof client.transport?.retry === 'function') {
        console.warn('⏩ Retrying getGasPrice...');
        client.transport.retry();
      }
      throw err;
    }
  };

  const smartEstimateGas = async (args: any) => {
    try {
      return await promiseTimeout(client.estimateGas(args), 4000);
    } catch (err: any) {
      if (err?.message === 'TimeoutError' && typeof client.transport?.retry === 'function') {
        console.warn('⏩ Retrying estimateGas...');
        client.transport.retry();
      }
      throw err;
    }
  };

  return {
    ...client,
    getGasPrice: smartGetGasPrice,
    estimateGas: smartEstimateGas,
  };
};
