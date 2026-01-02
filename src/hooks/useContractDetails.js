// src/hooks/useContractDetails.js
import { useEffect, useState, useCallback } from 'react';
import { useApi } from './useApi';
import { extractList } from './useApiHelpers';

export function useContractDetails(id) {
  const { get, isLoading, error: apiError } = useApi();
  const [contract, setContract] = useState(null);
  const [clients, setClients] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadError, setLoadError] = useState(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoadError(null);
    try {
      
      const [productsResp, contractResp, clientsResp, subscriptionsResp] = await Promise.all([
        get('/products'),
        get(`/contracts/${id}`),
        get('/clients'),
        get(`/contracts/${id}/subscriptions`),
      ]);

      setProducts(extractList(productsResp, 'products'));

      
      const resolvedContract =
        contractResp?.data?.contract ||
        contractResp?.contract ||
        contractResp;
      setContract(resolvedContract);

      setClients(extractList(clientsResp, 'clients'));
      setSubscriptions(extractList(subscriptionsResp, 'subscriptions'));
    } catch (err) {
      console.error('load contract details', err);
      setLoadError(err?.message || String(err));
    }
  }, [get, id]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    contract,
    clients,
    subscriptions,
    products,
    isLoading,
    error: loadError || apiError,
    refresh: load,
    setContract, 
  };
}