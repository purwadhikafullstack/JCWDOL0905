import React from "react";
import Layout from "../../component/Layout";
import { Toaster } from "react-hot-toast";
import ProductSalesReport from "../../component/salesReport/ProductSalesReport";

function SalesReport() {
  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <h1 className="text-xl font-semibold text-gray-900 text-center justify-center">
          Sales Report
        </h1>
        <ProductSalesReport/>
      <Toaster />
      </div>
    </Layout>
  );
}

export default SalesReport;
