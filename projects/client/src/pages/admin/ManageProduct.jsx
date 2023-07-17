import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Toaster } from "react-hot-toast";
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Pagination } from "semantic-ui-react";
import DeleteProductModal from "../../component/manageProduct/DeleteProductModal";
import AddProductModal from "../../component/manageProduct/AddProductModal";
import EditProductModal from "../../component/manageProduct/EditProductModal";
import Layout from "../../component/Layout";
import { useSearchParams } from "react-router-dom";
import ProductInfo from "../../component/ProductInfo";

const ManageProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activePage, setActivePage] = useState(searchParams.get("page") || 1);
  const [totalPage, setTotalPage] = useState(1);
  const [order, setOrder] = useState(searchParams.get("order") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || 'ASC');
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [searchedProduct, setSearchedProduct] = useState(searchParams.get("name") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState({})

  useEffect(() => {
    setSearchParams({ 
      page: activePage,
      sort: sort,
      order: order,
      category: selectedCategory,
      name: searchedProduct
    });
  }, [activePage, sort, order, selectedCategory, searchedProduct]);

  async function fetchProducts() {
    try{
      const productsData = await api.get('/product', {
        params: {
          order: order,
          sort: sort,
          name: searchedProduct,
          category: selectedCategory,
          page: activePage
        }
      });
      setProducts(productsData.data.data);
      setTotalPage(Math.ceil(productsData.data.count / 8));  
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await api.get("/category");
        setCategories(categoriesData.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchCategories();
    fetchProducts()
  }, [activePage, sort, order, selectedCategory, searchedProduct]);

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const openDeleteModal = (productId) => {
    setSelectedProductId(productId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedProductId(null);
    setDeleteModalOpen(false);
  };

  const openEditModal = (productData) => {
    setSelectedProduct(productData);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedProduct({});
    setEditModalOpen(false);
  };

  const handleSortChange = (e) => {
    const values = JSON.parse(e.target.value);
    setSort(values.sort);
    setOrder(values.order);
    setActivePage(1);
  };
  const handleFilterCategory = (e) => {
    setSelectedCategory(e.target.value)
    setActivePage(1);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
    setActivePage(1);
    setSearchedProduct(search)
  }};  

  return (
    <Layout>
    <div className="flex min-w-screen min-h-screen">
      <Toaster />
      <div className="flex mx-auto rounded-md w-full max-w-xl max-h-5xl px-2 bg-white md:w-full md:max-w-4xl md:px-6 lg:w-full lg:max-w-7xl lg:h-7xl lg:px-4">
        <div className="w-full lg:w-full p-4 lg:p-8 justify-start ">
          <div className="flex justify-between items-center my-3 mb-8">
            <h2>Manage Product</h2>
            <button
              className="bg-green-500 h-10 px-4 md:px-8 lg:px-8 text-white font-semibold rounded-md hover:bg-green-600 active:bg-green-700"
              onClick={openAddModal}
            >
              Add Product
            </button>
          </div>

          <div>
          <div className="flex flex-col md:flex-row lg:flex-row mb-6">
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="search" type="search"
                  placeholder="Search product name"
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown} defaultValue={searchedProduct}
                  className="w-full rounded-md border-0 pl-10 pr-40 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                />
                <select className="absolute right-0 bg-gray-100 right-0 rounded-r-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500" onChange={handleFilterCategory} value={selectedCategory}>
                <option key="" value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex mt-4 md:ml-8 md:mt-0 items-center">
                <label className="block w-16 text-md font-medium leading-6 text-gray-900 mr-2 ">
                  Sort by:
                </label>
                <select
                  className="w-56 lg:w-60 rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                  id="filter" value={JSON.stringify({ order, sort })}
                  onChange={handleSortChange}
                >
                  <option value='{"order":"product_name","sort":"ASC"}'>Product Name A-Z</option>
                  <option value='{"order":"product_name","sort":"DESC"}'>Product Name Z-A</option>
                  <option value='{"order":"product_price","sort":"ASC"}'>Price Lowest-Highest</option>
                  <option value='{"order":"product_price","sort":"DESC"}'>Price Highest-Lowest</option>
                </select>
              </div>
            </div>
            
            <ProductInfo products={products} openDeleteModal={openDeleteModal} openEditModal={openEditModal} />
            
          </div>
          <div className="mt-12 flex justify-center items-end">
              <Pagination
                activePage={activePage}
                totalPages={totalPage}
                onPageChange={(e, pageInfo) => {
                  setActivePage(pageInfo.activePage);
                }}
              />
            </div>
        </div>
        <div></div>
      </div>
      {addModalOpen && (<AddProductModal open={addModalOpen} setOpen={setAddModalOpen} categories={categories} cancelButtonRef={null} onClose={closeAddModal} fetchProducts={fetchProducts} /> )}
      {deleteModalOpen && (<DeleteProductModal open={deleteModalOpen} setOpen={setDeleteModalOpen} productId={selectedProductId} cancelButtonRef={null} onClose={closeDeleteModal} fetchProducts={fetchProducts}/> )}
      {editModalOpen && (<EditProductModal open={editModalOpen} setOpen={setEditModalOpen} categories={categories} product={selectedProduct} cancelButtonRef={null} onClose={closeEditModal} fetchProducts={fetchProducts} />)}
    </div>
    </Layout>
  );
};

export default ManageProduct;