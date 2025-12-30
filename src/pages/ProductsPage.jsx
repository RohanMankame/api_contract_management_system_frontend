import { useEffect, useRef, useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { DataTable } from '../components/DataTable';
import { useApi } from '../hooks/useApi';
import { EntityModal } from '../components/EntityModal';
import { EditEntityModal } from '../components/EditEntityModal';
import '../styles/pages/ProductsPage.css';

export function ProductsPage() {
  const { data: response, isLoading, error, get, post, put, delete: deleteRequest } = useApi();
  const gridApiRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    { field: 'updated_at', headerName: 'Updated', flex: 1 },
  ];

  const formFields = [
    { name: 'api_name', label: 'Product Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (gridApiRef.current) {
      gridApiRef.current.setGridOption('quickFilterText', value);
    }
  };

  const handleGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  const handleRowDoubleClick = (event) => {
    setSelectedProduct(event.data);
    setShowEditModal(true);
  };

  const handleAddProduct = async (formData) => {
    // Don't use try-catch here - let the modal handle errors
    await post('/products', formData);
    // Only close modal and refresh if successful (no error thrown)
    setShowAddModal(false);
    get('/products');
  };

  const handleEditProduct = async (formData) => {
    // Don't use try-catch here - let the modal handle errors
    await put(`/products/${selectedProduct.id}`, formData);
    // Only close modal and refresh if successful (no error thrown)
    setShowEditModal(false);
    get('/products');
  };

  const handleDeleteProduct = async (productId) => {
    // Don't use try-catch here - let the modal handle errors
    await deleteRequest(`/products/${productId}`);
    // Only close modal and refresh if successful (no error thrown)
    setShowEditModal(false);
    get('/products');
  };

  return (
    <PageLayout>
      <div className="products-container">
        <div className="products-header">
          <div className="products-header-top">
            <div>
              <h2>Products</h2>
              <p>Manage your API products</p>
              <p>Double click a product to edit or delete it.</p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-add-product">
              + Add Product
            </button>
          </div>
          <div className="products-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>
        <DataTable 
          onGridReady={handleGridReady}
          data={products} 
          isLoading={isLoading} 
          error={error}
          columnDefs={columnDefs}
          paginationPageSize={10}
          onRowDoubleClick={handleRowDoubleClick}
        />
        <EntityModal
          isOpen={showAddModal}
          title="Add Product"
          fields={formFields}
          onSubmit={handleAddProduct}
          onClose={() => setShowAddModal(false)}
        />
        <EditEntityModal
          isOpen={showEditModal}
          title="Edit Product"
          fields={formFields}
          data={selectedProduct}
          onSubmit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onClose={() => setShowEditModal(false)}
        />
      </div>
    </PageLayout>
  );
}