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
  /* const [searchText, setSearchText] = useState(''); */
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    get('/products');
  }, []);

  // Safely extract products array
  const products = (response && response.data && Array.isArray(response.data.products)) 
    ? response.data.products 
    : [];

  // ag-grid column definitions
  const columnDefs = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'api_name', headerName: 'Name', flex: 2 },
    { field: 'description', headerName: 'Description', flex: 3 },
    { field: 'created_at', headerName: 'Created', flex: 1 },
    { field: 'updated_at', headerName: 'Updated', flex: 1 },
  ];

  // input fields for add/edit modals
  const formFields = [
    { name: 'api_name', label: 'Product Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
  ];


  // ag-grid onGridReady
  const handleGridReady = (params) => {
    gridApiRef.current = params.api;
  };

  // Handle row double click to open edit modal
  const handleRowDoubleClick = (event) => {
    setSelectedProduct(event.data);
    setShowEditModal(true);
  };

  // Handle add product
  const handleAddProduct = async (formData) => {
    await post('/products', formData);
    setShowAddModal(false);
    get('/products');
  };

  // Handle edit product
  const handleEditProduct = async (formData) => {
    await put(`/products/${selectedProduct.id}`, formData);
    setShowEditModal(false);
    get('/products');
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    await deleteRequest(`/products/${productId}`);
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
          
        </div>
        <DataTable 
          onGridReady={handleGridReady}
          data={products} 
          isLoading={isLoading} 
          error={error}
          columnDefs={columnDefs}
          paginationPageSize={10}
          onRowDoubleClick={handleRowDoubleClick}
          exportFileName="products"
          
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