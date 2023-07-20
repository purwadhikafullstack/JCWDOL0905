import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pagination } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Category } from "../../component/category";
import { api } from "../../api/api";
import NavBar from "../../component/NavBar";
import { ProductsList } from "../../component/productsList";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

export default function ProductsByCategory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productsInfo, setProductsInfo] = useState([]);
  const [order, setOrder] = useState(searchParams.get("order") || "")
  const [sort, setSort] = useState(searchParams.get("sort") || 'ASC');
  const [activePage, setActivePage] = useState(searchParams.get("page") || 1);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate();

  const branchId = useSelector((state) => state.branchSlice.branchId);
  const { id } = useParams();

  useEffect(() => {
    setSearchParams({ 
      page: activePage,
      sort: sort,
      order: order,
    });
  }, [activePage, sort, order]);

  useEffect(() => {
    async function findCategory() {
      try {
        const result = await api.get(`category/find/${id}`);
      } catch (error) {
        if(error.response.data.navigate){
            navigate('/404')
        }
      }
    }
    findCategory();

    async function fetchProducts() {
      try {
        const productData = await api.get('/inventory', {
          params : {
            branchId,
            order: order,
            sort: sort,
            category: id,
            page: activePage
          }
        });
        setProductsInfo(productData.data.data);
        setTotalPage(Math.ceil(productData.data.count / 12));       
      } catch (err) {
        console.log(err);
      }
    }
    fetchProducts();
  }, [sort, activePage]);

  const handleSortChange = (e) => {
    const values = JSON.parse(e.target.value);
    setSort(values.sort);
    setOrder(values.order);
    setActivePage(1);
  };

  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6">
        <h2 className="sr-only">Products</h2>
        <Category />

        <div className="my-12 flex justify-end drop-shadow-md">
          <select className="w-72 rounded-md green border border-gray-200 active:border-green-500" id="sortBy" data-te-select-init value={JSON.stringify({ order, sort })} onChange={handleSortChange}>
            <option value='{"order":"product_name","sort":"ASC"}'>Sort by Product Name A-Z</option>
            <option value='{"order":"product_name","sort":"DESC"}'>Sort by Product Name Z-A</option>
            <option value='{"order":"product_price","sort":"ASC"}'>Sort by Price Lowest-Highest</option>
            <option value='{"order":"product_price","sort":"DESC"}'>Sort by Price Highest-Lowest</option>
          </select>
        </div>

        <ProductsList productsInfo={productsInfo} />

        <div className="my-12 flex justify-center">
          <Pagination
            activePage={activePage}
            totalPages={totalPage}
            onPageChange={(e, pageInfo) => {
              setActivePage(pageInfo.activePage);
            }}
          />
        </div>
      </div>
    </div>
  );
}
