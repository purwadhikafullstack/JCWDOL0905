import React, { useEffect, useRef } from "react";
import Layout from "../../component/Layout";
import Pagination from "../../component/PaginationRowPerPage";
import { useState } from "react";
import { api } from "../../api/api";
import { Toaster } from "react-hot-toast";
import moment from "moment";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PopoverFilter from "../../component/PopoverFilter";
import { ROLE } from "../../constant/role";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function Table({ tableData }) {
  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr> <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900 sm:pl-6" > {" "} ID{" "} </th> <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900" > {" "} Product Name{" "} </th> <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900" > {" "} Branch Name{" "} </th> <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900" > {" "} Status{" "} </th> <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900" > {" "} Reference{" "} </th> <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900" > {" "} Quantity{" "} </th> <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900" > {" "} Date{" "} </th> <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900" > {" "} Current Stock{" "} </th> </tr>
              </thead>
              <tbody className="divide-y text-left divide-gray-200 bg-white">
                {tableData.map((person) => (
                  <tr key={person.email}> <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900 sm:pl-6"> {person.id || ""} </td> <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500"> {person.productName || ""} </td> <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500"> {person.branchName || ""} </td> <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500"> {person.status || ""} </td> <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500"> {person.reference || ""} </td> <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500"> {person.quantity || ""} </td> <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500"> {moment.utc(person.createdAt).utcOffset(0).format("YYYY-MM-DD HH:mm:ss") || ""} </td> <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500"> {person.current_stock || ""} </td> </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductStockHistory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 5);
  const [tableData, setTableData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStartDate, setSelectedStartDate] = useState(searchParams.get("startDate")||"");
  const [selectedEndDate, setSelectedEndDate] = useState(searchParams.get("endDate")||"");
  const [productName, setProductName] = useState(searchParams.get("productName")||"");
  const [branchId, setBranchId] = useState(searchParams.get("branchId")||"All");
  const [orderBy, setOrderBy] = useState(searchParams.get("orderBy") || "id");
  const [sortDirection, setSortDirection] = useState( searchParams.get("sortDirection") || "ASC" );
  const [storeData, setStoreData] = useState([]);
  const { id_branch, role } = useSelector((state) => state.adminSlice);
  const isFirstRender = useRef(true);

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowPerPage = (newLimit) => {
    setLimit(newLimit);
  };

  useEffect(() => {
    setSearchParams({ page: page.toString(), limit: limit.toString(), orderBy: orderBy, sortDirection: sortDirection, branchId: branchId, startDate: selectedStartDate, endDate: selectedEndDate, productName: productName, });
  }, [page, limit, setSearchParams, orderBy, sortDirection, branchId,selectedStartDate, selectedEndDate,productName]);

  const getListOfInventoryHistory = async (id_branch) => {
    try {
      const response = await api.get(`inventory/admin/history`, { params: { endDate: selectedEndDate === "" ? null : moment(selectedEndDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'), startDate: selectedStartDate === "" ? null : moment(selectedStartDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'), page: page, limit: limit, productName: productName === "" ? null : productName, branchId: id_branch === "All" ? null : id_branch, orderBy: orderBy, orderByMethod: sortDirection, }, });
      setTableData(response.data.data.items);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const renderSearchByBranch = () => {
    return role === ROLE.SUPER_ADMIN ? (
      <div className="flex items-center space-x-4">
        <p className="w-24 text-right">Branch Store:</p>
        <select id="storeId" name="storeId" className="w-52" onChange={(e) => setBranchId(e.target.value)} value={branchId || ""} >
          <option value="All">All Branch</option>
          {storeData.map((data, index) => (
            <option key={index} value={data.id}>
              {data.branch_name}
            </option>
          ))}
        </select>
      </div>
    ) : null;
  };

  const getListOfStoreData = async () => {
    try {
      const response = await api.get(`branch`);
      setStoreData(response.data.data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getListOfStoreData();
    if (role === ROLE.SUPER_ADMIN) {
      getListOfInventoryHistory(null);
    } else {
      setBranchId(id_branch);
      getListOfInventoryHistory(id_branch);
    }
  }, [id_branch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (role === ROLE.SUPER_ADMIN) {
      getListOfInventoryHistory(null);
    } else {
      getListOfInventoryHistory(id_branch);
    }
  }, [page, limit]);

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-900 text-center justify-center">
          Product Stock History
        </h1>
        <div className="flex justify-end">
          <PopoverFilter>
            <div className="flex flex-wrap space-y-2">
              <div className="flex items-center space-x-4">
                <p className="w-24 text-right">Start Date:</p>
                <Datepicker
                  placeholderText="Start Date" selected={selectedStartDate === "" ? "" : new Date(selectedStartDate)} className="w-52 rounded-md border px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 text-sm leading-6" id="start_date"
                  onChange={(date) => {
                    if (date === null ) {
                      setSelectedStartDate("")
                      return
                    }
                    setSelectedStartDate(date)
                  }}
                />
              </div>
              <div className="flex items-center space-x-4">
                <p className="w-24 text-right">End Date:</p>
                <Datepicker
                  placeholderText="End Date" selected={selectedEndDate === "" ? "" : new Date(selectedEndDate)} className="w-52 rounded-md border px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 text-sm leading-6" id="end_date"
                  onChange={(date) => {
                    if (date === null ) {
                      setSelectedEndDate("")
                      return
                    }
                    setSelectedEndDate(date)
                  }}
                />
              </div>
              <div className="flex items-center space-x-4">
                <p className="w-24 text-right">Product Name:</p>
                <input type="text" name="name" className="w-52 rounded-md text-sm px-4 py-2 focus:outline-none focus:border-green-400 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset" placeholder="Search by product name" required value={productName} onChange={(e) => setProductName(e.target.value)} />
              </div>
              {renderSearchByBranch()}
              <div className="flex items-center space-x-4">
                <p className="w-24 text-right">Sort By:</p>
                <select id="orderBy" name="orderBy" className="w-52" onChange={(e) => setOrderBy(e.target.value)} value={orderBy || "id"} >
                  <option value="id">ID</option>
                  <option value="productName">Product Name</option>
                  <option value="createdAt">Date</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <p className="w-24 text-right">Sort Order:</p>
                <select id="orderByMethod" name="orderByMethod" className="w-52" onChange={(e) => setSortDirection(e.target.value)} value={sortDirection || "ASC"} >
                  <option value="ASC">ASC</option>
                  <option value="DESC">DESC</option>
                </select>
              </div>
              <div className="flex items-center space-x-4 w-full">
                <div className="flex items-end">
                <button type="button" onClick={() => getListOfInventoryHistory(branchId)} className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto" > Search </button>
              </div>
              </div>              
            </div>
          </PopoverFilter>
        </div>
        <Table tableData={tableData} />
        <Pagination rowsOption={[5, 10, 20, 30]} handleChangeRow={handleChangeRowPerPage} rowPerPage={limit} page={page} handleChangePage={handleChangePage} totalPages={totalPages} />
      </div>
      <Toaster />
    </Layout>
  );
}

export default ProductStockHistory;