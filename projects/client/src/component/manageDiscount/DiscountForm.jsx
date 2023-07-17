import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProductSelector from "../ProductSelector";

export default function DiscountForm({categories, inventories, selectedCategory, handleProductSelect, selectedProduct, selectedDiscountType, discountValue, errorValue, selectedStartDate, selectedEndDate, validateValue, selectDiscountType, selectStartDate, selectEndDate, selectCategory}) {
  return (
    <div className="mt-8 mb-4 w-96">
      <form className="" action="#" method="POST">
        <div>
          <label className="block text-md font-medium leading-6 text-gray-900">
            Product Category
          </label>
          <div className="my-2">
            <select
              className="w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
              id="category"
              required
              onChange={(e) => selectCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <ProductSelector
          inventories={inventories}
          selectedCategory={selectedCategory}
          onProductSelect={handleProductSelect}
          value={selectedProduct}
        />

        <div className="flex">
          <div className="mr-2">
            <label className="block text-md font-medium leading-6 text-gray-900">
              Discount Type
            </label>
            <div className="my-2">
              <select
                className="rounded-md border border-gray-200 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                id="discount_type"
                required
                onChange={(e) => selectDiscountType(e.target.value)}
              >
                <option value="percentage">Percentage</option>
                <option value="amount">Amount</option>
                <option value="buy one get one">Buy One Get One</option>
              </select>
            </div>
          </div>

          <div className="ml-2">
            <label className="block text-md font-medium leading-6 text-gray-900">
              Discount Value
            </label>
            <div className="my-2">
              <div className="relative">
                {selectedDiscountType === "amount" && (
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">Rp</span>
                  </div>
                )}
                <input
                  id="discount_value"
                  value={discountValue}
                  type="number"
                  disabled={selectedDiscountType === "buy one get one"}
                  className={` w-full block rounded-md border-0 px-2 py-1.5 ${
                    selectedDiscountType === "amount" ? "pl-9" : "pr-8"
                  } text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6 disabled:bg-gray-100 required:ring-red-500 placeholder:italic placeholder:text-sm ${
                    errorValue ? "focus:ring-red-500" : ""
                  }`}
                  onChange={(e) => validateValue(e.target.value)}
                  placeholder={
                    selectedDiscountType === "buy one get one"
                      ? ""
                      : "input value (required)"
                  }
                />
                {selectedDiscountType === "percentage" && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span
                      className="text-gray-500 sm:text-sm"
                      id="price-currency"
                    >
                      %
                    </span>
                  </div>
                )}
              </div>
              {errorValue && (
                <div className="text-red-700 text-sm font-semibold mt-1">
                  {errorValue ? errorValue : ""}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="mr-2">
            <div className="flex items-center justify-between">
              <label className="block text-md font-medium leading-6 text-gray-900">
                Start Date
              </label>
            </div>
            <div className="mt-2">
              <Datepicker
                selected={selectedStartDate}
                className="block w-full mr-2 rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6 placeholder:italic placeholder:text-sm"
                id="start_date"
                minDate={new Date()}
                onChange={(date) => selectStartDate(date)}
                placeholderText="select date (required)"
              />
            </div>
          </div>
          <div className="ml-2">
            <div className="flex items-center justify-between">
              <label className="block text-md font-medium leading-6 text-gray-900">
                End Date
              </label>
            </div>
            <div className="mt-2">
              <Datepicker
                selected={selectedEndDate}
                className="block w-full mr-2 rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 placeholder:text-gray-400 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6 placeholder:italic placeholder:text-sm"
                id="end_date"
                placeholderText="select date (required)"
                minDate={
                  selectedStartDate
                    ? new Date(
                        selectedStartDate.getTime() + 24 * 60 * 60 * 1000
                      )
                    : new Date()
                }
                onChange={(date) => selectEndDate(date)}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
