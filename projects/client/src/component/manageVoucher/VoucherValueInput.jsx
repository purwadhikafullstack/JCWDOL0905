export default function VoucherValueInput({
  selectedType,
  errorValue,
  validateValue,
  value,
}) {
  return (
    <div className="ml-2 w-full">
      <label className="block text-md font-medium leading-6 text-gray-900">
        Voucher Value
      </label>
      <div className="my-2">
        <div className="relative">
          {selectedType === "amount" && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">Rp</span>
            </div>
          )}
          <input
            id="voucher_value"
            value={value}
            type="number"
            className={`w-full block rounded-md border-0 px-2 py-1.5 ${
              selectedType === "amount" ? "pl-9" : "pr-8"
            } text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6 disabled:bg-gray-100 required:ring-red-500 placeholder:italic placeholder:text-sm ${
              errorValue ? "focus:ring-red-500" : ""
            }`}
            onChange={(e) => validateValue(e.target.value)}
            placeholder="input value (required)"
          />
          {selectedType === "percentage" && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm" id="price-currency">
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
  );
}
