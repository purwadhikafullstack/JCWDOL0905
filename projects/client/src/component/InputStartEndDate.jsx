import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function InputStartEndDate({selectedStartDate, selectedEndDate, handleSelectEndDate, handleSelectStartDate}) {
    return(
        <div className="flex">
          <div className="mr-2">
            <div className="flex items-center justify-between">
              <label className="block text-md font-medium leading-6 text-gray-900">
                Start Date
              </label>
            </div>
            <div className="mt-2">
              <Datepicker
                required
                selected={selectedStartDate}
                className="block w-full mr-2 rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6 placeholder:text-sm placeholder:italic"
                id="start_date"
                minDate={new Date()}
                onChange={(date) => handleSelectStartDate(date)}
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
                required
                selected={selectedEndDate}
                className="block w-full mr-2 rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 placeholder:text-gray-400 focus:ring-inset focus:ring-green-600 sm:text-md sm:leading-6 placeholder:text-sm placeholder:italic"
                id="end_date"
                minDate={
                  selectedStartDate
                    ? new Date(
                        selectedStartDate.getTime() + 24 * 60 * 60 * 1000
                      )
                    : new Date()
                }
                placeholderText="select date (required)"
                onChange={(date) => handleSelectEndDate(date)}
              />
            </div>
          </div>
        </div>
    )
}