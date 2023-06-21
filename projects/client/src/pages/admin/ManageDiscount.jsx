import { useState, useEffect } from "react";
import { api } from "../../api/api";
import { Toaster } from "react-hot-toast";
import AddDiscountModal from "../../component/AddDiscountModal";


export const ManageDiscount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const token = localStorage.getItem("token_admin");

  useEffect(() => {
    async function fetchDiscounts() {
      try {
        const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
        
        const discountData = await api.get("/discount/", config);
        setDiscounts(discountData.data.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchDiscounts();
  
  }, []);

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  function formatDate(date) {
    let objectDate = new Date(date);

    let day = objectDate.getDate();
    let month = objectDate.getMonth();
    let year = objectDate.getFullYear();

    return `${day}/${month + 1}/${year}`
  }

  return (
    <div className="flex bg-neutral-100 min-w-screen min-h-screen">
      <Toaster />
      <div className="flex mx-auto rounded-md w-full max-w-xl max-h-5xl px-2 py-2 bg-white md:w-full md:my-8 md:px-6 md:py-6 lg:w-full lg:max-w-7xl lg:h-7xl lg:px-4 lg:py-4 lg:my-8 drop-shadow-md">
        <div className="w-full lg:w-full p-4 lg:p-8 justify-start ">
          <div className="flex justify-between items-center my-3 mb-8">
            <h2>Manage Discount</h2>
            <button
              className="bg-green-600 h-10 px-4 md:px-8 lg:px-8 text-white font-semibold rounded-md"
                onClick={openAddModal}
            >
              Create Discount
            </button>
          </div>

          <div>
            <div className="flex flex-col">
              <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full text-left text-md font-light">
                      <thead className="border-b font-medium dark:border-neutral-500">
                        <tr>
                          <th scope="col" className="px-6 py-4">
                            Id
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Product
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Discount Type
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Discount Value
                          </th>
                          <th scope="col" className="px-6 py-4">
                            Period
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {discounts.map((discount) => (
                          <tr className="border-b dark:border-neutral-500">
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {discount.id}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">{discount.Inventory.Product.product_name}</td>
                            <td className="whitespace-nowrap px-6 py-4">{discount.discount_type}</td>
                            <td className="whitespace-nowrap px-6 py-4">{discount.discount_value}</td>
                            <td className="whitespace-nowrap px-6 py-4">{formatDate(discount.start_date)} - {formatDate(discount.end_date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      {addModalOpen && (
        <AddDiscountModal
          open={addModalOpen}
          setOpen={setAddModalOpen}
          cancelButtonRef={null}
          onClose={closeAddModal}
        />
      )}
    </div>
  );
};
