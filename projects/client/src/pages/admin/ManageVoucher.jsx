import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Toaster } from "react-hot-toast";
import CreateVoucherModal from "../../component/CreateVoucherModal";
import Layout from "../../component/Layout";
import { useSelector } from "react-redux";
import Table from "../../component/Table";
import VoucherTableBody from "../../component/manageVoucher/VoucherTableBody";
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useSearchParams } from "react-router-dom";
import { Pagination } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const ManageVoucher = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vouchers, setVouchers] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [activePage, setActivePage] = useState(Number(searchParams.get("page")) || 1);
  const [totalPage, setTotalPage] = useState(1);
  const [voucherCode, setVoucherCode] = useState(searchParams.get("code") || "");
  const [search, setSearch] = useState("");
  const [voucherType, setVoucherType] = useState(searchParams.get("type") ||"")
  const [sort, setSort] = useState(searchParams.get("sort") || "DESC");
  const token = localStorage.getItem("token_admin");
  const role = useSelector((state) => state.adminSlice.role);
  const id_branch = useSelector((state) => state.adminSlice.id_branch);

  const branchId = role === "BRANCH_ADMIN" ? id_branch : "";

  useEffect(() => {
    setSearchParams({ 
      page: activePage,
      sort: sort,
      type: voucherType,
      code: voucherCode
    });
  }, [activePage, sort, voucherType, voucherCode]);

  useEffect(() => {
    async function fetchVouchers() {
      try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
        
        const vouchersData = await api.get(`/voucher/`, 
        {
          params: {
          page: activePage,
          sort: sort,
          code: voucherCode,
          type: voucherType, 
          },
          ...config
        });
        setVouchers(vouchersData.data.data);
        setTotalPage(Math.ceil(vouchersData.data.count / 12))
      } catch (err) {
        console.log(err);
      }
    }
    fetchVouchers();
  
  }, [activePage, sort, voucherType, voucherCode]);

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setActivePage(1);
  };

  const handleFilterVoucherType = (e) => {
    setVoucherType(e.target.value)
    setActivePage(1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
    setActivePage(1);
    setSort("DESC")
    setVoucherCode(search)
  }};


  return (
    <Layout>
    <div className="flex min-w-screen min-h-screen">
      <Toaster />
      <div className="flex mx-auto rounded-md w-full max-w-xl max-h-5xl px-2 bg-white md:w-full md:max-w-4xl md:px-6 lg:w-full lg:max-w-7xl lg:h-7xl lg:px-4">
        <div className="w-full lg:w-full p-4 lg:p-8 justify-start ">
          <div className="flex justify-between items-center my-3 mb-8">
            <h2>Manage Voucher</h2>
            <button
              className="bg-green-600 h-10 px-4 md:px-8 lg:px-8 text-white font-semibold rounded-md"
                onClick={openAddModal}
            >
              Create Voucher
            </button>
          </div>
          
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
                  placeholder="Search product or voucher code"
                  defaultValue={voucherCode}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-md border-0 pl-10 pr-40 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6"
                />
                <select className="absolute right-0 bg-gray-100 right-0 rounded-r-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500" onChange={handleFilterVoucherType}>
                <option key="all" value="">All Voucher Type</option>
                <option key="product" value="product">Product Voucher</option>
                <option key="shipping" value="shipping">Shipping Voucher</option>
                <option key="total purchase" value="total purchase">Total Purchase</option>
                <option key="referral code" value="referral code">Referral Code</option>
                </select>
              </div>

              <div className="flex mt-4 md:ml-8 md:mt-0 items-center">
                <label className="block w-16 text-md font-medium leading-6 text-gray-900 mr-2 ">
                  Sort by:
                </label>
                <select
                  className="w-56 lg:w-60 rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                  id="filter"
                  value={sort}
                  onChange={handleSortChange}
                >
                  <option value="DESC">Newer</option>
                  <option value="ASC">Older</option>
                </select>
              </div>
            </div>

          <Table headCols={["ID", "Voucher Type", "Product", "Voucher Value", "Max Discount", "Min Purchase Value", "Period"]} tableBody={<VoucherTableBody vouchers={vouchers} branchId={branchId}/>} />

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
        <div></div>
      </div>
      {addModalOpen && (
        <CreateVoucherModal
          open={addModalOpen}
          setOpen={setAddModalOpen}
          cancelButtonRef={null}
          onClose={closeAddModal}
        />
      )}
    </div>
    </Layout>
  );
};

export default ManageVoucher;