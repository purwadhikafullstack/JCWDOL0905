import "react-datepicker/dist/react-datepicker.css";
import VoucherValueInput from "./VoucherValueInput";
import ProductSelector from "../ProductSelector";
import InputStartEndDate from "../InputStartEndDate";

export default function VoucherForm({handleVoucherType, selectedType, role, storeBranches, categories, inventories, selectedCategory, handleProductSelect, selectedProduct, selectedKind, errorValue, validateValue, voucherValue, maxDiscount, errorMaxDiscount, minPurchaseValue, errorMinPurchase, selectedStartDate, selectedEndDate, validateMaxDiscount, validateMinPurchase, handleVoucherKind, handleSelectBranch, handleSelectCategory, handleSelectStartDate, handleSelectEndDate}) {
  return (
    <div className="mt-8 mb-4 w-96">
      <form className="" action="#" method="POST">
        <div>
          <label className="block text-md font-medium leading-6 text-gray-900">
            Voucher Type
          </label>
          <div className="my-2">
            <select
              className="w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
              id="voucher_type"
              data-te-select-init
              onChange={(e) => handleVoucherType(e.target.value)}
            >
              <option value="total purchase">Total Purchase</option>
              <option value="product">Product</option>
              <option value="shipping">Shipping</option>
              <option value="referral code">Referral Code</option>
            </select>
          </div>
        </div>

        {selectedType === "product" ? (
          <div>
            {role === "SUPER_ADMIN" ? (
              <div>
                <label className="block text-md font-medium leading-6 text-gray-900">
                  Select Store Branch
                </label>
                <div className="my-2">
                  <select
                    className="w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                    id="category"
                    required
                    onChange={(e) => handleSelectBranch(e.target.value)}
                  >
                    {storeBranches.map((branch) => (
                      <option key={branch?.id} value={branch?.id}>
                        {branch?.branch_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div>
              <label className="block text-md font-medium leading-6 text-gray-900">
                Select Category Product
              </label>
              <div className="my-2">
                <select
                  className="w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                  id="category"
                  data-te-select-init
                  onChange={(e) => handleSelectCategory(e.target.value)}
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
          </div>
        ) : (
          <></>
        )}

        <div className="flex">
          <div className="mr-2 w-full">
            <label className="block text-md font-medium leading-6 text-gray-900">
              Voucher Kind
            </label>
            <div className="my-2 ">
              <select
                className="w-full rounded-md border border-gray-200 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500"
                id="voucher_kind"
                value={selectedKind}
                onChange={(e) => handleVoucherKind(e.target.value)}
              >
                <option value="percentage">Percentage</option>
                <option value="amount">Amount</option>
              </select>
            </div>
          </div>

          <VoucherValueInput
            selectedType={selectedKind}
            errorValue={errorValue}
            validateValue={validateValue}
            value={voucherValue}
          />
        </div>

        <div className="flex">
          <div className="mr-2 w-full">
            <label className="block text-md font-medium leading-6 text-gray-900">
              Maximum Discount
            </label>
            <div className="my-2">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-700 sm:text-sm">Rp</span>
                </div>
                <input
                  id="max_discount"
                  type="number"
                  value={maxDiscount}
                  disabled={selectedKind === "amount"}
                  className="block w-full rounded-md border-0 px-2 py-1.5 pl-9 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 placeholder:text-sm placeholder:italic disabled:bg-gray-100"
                  placeholder={
                    selectedKind === "percentage" ? "(optional)" : ""
                  }
                  onChange={(e) => validateMaxDiscount(e.target.value)}
                />
              </div>
              {errorMaxDiscount && (
                <div className="text-red-700 text-sm font-semibold mt-1">
                  {errorMaxDiscount ? errorMaxDiscount : ""}
                </div>
              )}
            </div>
          </div>

          <div className="ml-2 w-full">
            <label className="block text-md font-medium leading-6 text-gray-900">
              Minimum Purchase
            </label>
            <div className="my-2">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-700 sm:text-sm">Rp</span>
                </div>
                <input
                  type="number"
                  disabled={
                    selectedType === "product" ||
                    selectedType === "shipping" ||
                    selectedType === "referral code"
                  }
                  id="min_purchase_amount"
                  value={minPurchaseValue}
                  className="block w-full rounded-md border-0 px-2 py-1.5 pl-9 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-sm placeholder:italic placeholder:text-gray-400 focus:ring-2 focus:ring-inset disabled:bg-gray-100 focus:ring-green-600 sm:text-sm sm:leading-6"
                  onChange={(e) => validateMinPurchase(e.target.value)}
                  placeholder={
                    selectedType === "total purchase" ? "required" : ""
                  }
                />
              </div>
              {errorMinPurchase && (
                <div className="text-red-700 text-sm font-semibold mt-1">
                  {errorMinPurchase ? errorMinPurchase : ""}
                </div>
              )}
            </div>
          </div>
        </div>

        <InputStartEndDate selectedStartDate={selectedStartDate} selectedEndDate={selectedEndDate} handleSelectEndDate={handleSelectEndDate} handleSelectStartDate={handleSelectStartDate} />

        
      </form>
    </div>
  );
}
