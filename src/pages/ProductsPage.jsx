import { useEffect } from 'react';
import { PageLayout } from '../components/PageLayout';
import { DataTable } from '../components/DataTable';
import { useApi } from '../hooks/useApi';
import '../styles/pages/ProductsPage.css';

export function ProductsPage() {
  const { data: response, isLoading, error, get } = useApi();

  useEffect(() => {
    get('/products');
  }, []);

  const products = (response && response.data && Array.isArray(response.data.products)) 
    ? response.data.products 
    : [];

  const columnDefs = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'api_name', headerName: 'Name', flex: 2 },
    { field: 'description', headerName: 'Description', flex: 3 },
    { field: 'created_at', headerName: 'Created', flex: 1 },
  ];

  return (
    <PageLayout>
      <div className="products-container">
        <div className="products-header">
          <h2>Products</h2>
          <p>Manage your API products and versions</p>
        </div>
        <DataTable 
          data={products} 
          isLoading={isLoading} 
          error={error}
          columnDefs={columnDefs}
          paginationPageSize={10}
        />
      </div>
    </PageLayout>
  );
}