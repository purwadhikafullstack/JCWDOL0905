import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import UserOrder from '../../component/UserOrder'
import NavBar from '../../component/NavBar'
import Footer from '../../component/Footer'

export default function OrderHistory() {
  const Navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [dateCheck, setDateCheck] = useState(false)
  const [priceCheck, setPriceCheck] = useState(false)
  const [start, setStart] = useState()
  const [end, setEnd] = useState()
  const [status, setStatus] = useState()
  const [date, setDate] = useState()
  const [price, setPrice] = useState()
  const [update, setUpdate] = useState()
  const cancelButtonRef = useRef(null)

  var isDate = function(date) { return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));}

  const handleSubmit = () => {
    try{
      let url = ''
      if(isDate(document.getElementById('start').value)){
        if(url == '') url += `?start=${document.getElementById('start').value}`
        setStart(document.getElementById("start").value)
      }
      if(isDate(document.getElementById('end').value)){
        if(url == '') url += `?end=${document.getElementById('end').value}`
        else url += `&end=${document.getElementById('end').value}`
        setEnd(document.getElementById("end").value)
      }

      let status = document.getElementById('status').value
      if(status=='waiting for payment' || status=='waiting for payment confirmation' || status=='processed' || status=='shipped' || status=='done' || status=='canceled'){
        if(url == '') url += `?status=${status}`
        else url += `&status=${status}`
        setStatus(status)
      }

      if(document.getElementById("datecheck").checked){
        if(url == '') url += `?date=${document.getElementById("date").value}`
        else url += `&date=${document.getElementById("date").value}`
        setDate(document.getElementById("date").value)
      }

      if(document.getElementById("pricecheck").checked){
        if(url == '') url += `?price=${document.getElementById("price").value}`
        else url += `&price=${document.getElementById("price").value}`
        setPrice(document.getElementById("price").value)
      }

      Navigate(`/order-history${url}`)
      setUpdate(Math.random())
      setOpen(false)
    } catch(error){
      toast.error('Filter/sort failed')
    }
  }

  const reset = function (){
    setStart()
    setEnd()
    setStatus()
    setDate()
    setDateCheck(false)
    setPrice()
    setPriceCheck(false)
    setOpen(false)
    Navigate('/order-history')
    setUpdate(Math.random())
  }

  return (
    <>
      <NavBar/>
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6 bg-neutral-100">
            <div className="flex items-center">
                <button type="button" onClick={()=>Navigate(-1)} class="font-medium flex-none mr-1">
                    <ChevronLeftIcon className="h-5 w-5 fill-white stroke-black stroke-2"/>
                </button>
                <strong className="text-lg font-bold sm:text-xl">Order History</strong>
            </div>
            <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={() => setOpen(true)} className="whitespace-nowrap rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center">
                        Filter & Sort
                    </button>
                </div>
            </div>
        </div>
      <UserOrder update={update}/>
      <Footer/>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button type="button" className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" onClick={() => setOpen(false)}>
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div>
                    <div className="mt-3 text-start sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        Filter
                      </Dialog.Title>
                      <div className="mt-2 flex w-full">
                        <div className='w-full mr-1'>
                            <label htmlFor="start" className="block text-sm font-medium text-warm-gray-900 w-full">Start Date</label>
                            <div className="mt-1">
                              <input type="date" name="start" id="start" defaultValue={start} className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"/>
                            </div>
                        </div>
                        <div className='w-full ml-1'>
                            <label htmlFor="end" className="block text-sm font-medium text-warm-gray-900 w-full">End Date</label>
                            <div className="mt-1">
                              <input type="date" name="end" id="end" defaultValue={end} className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"/>
                            </div>
                        </div>
                      </div>

                      <div className='w-full mr-1'>
                        <label htmlFor="status" className="block text-sm font-medium text-warm-gray-900 w-full">Order Status</label>
                        <div className="mt-1">
                          <select name="status" id="status" className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500">
                            <option value={'all'} key={0}>All Order Status</option>
                            <option selected={status=='waiting for payment'} value={'waiting for payment'} key={1}>Waiting for Payment</option>
                            <option selected={status=='waiting for payment confirmation'} value={'waiting for payment confirmation'} key={2}>Waiting for Payment Confirmation</option>
                            <option selected={status=='processed'} value={'processed'} key={3}>Processed</option>
                            <option selected={status=='shipped'} value={'shipped'} key={4}>Shipped</option>
                            <option selected={status=='done'} value={'done'} key={5}>Done</option>
                            <option selected={status=='canceled'} value={'canceled'} key={6}>Canceled</option>
                          </select>
                        </div>
                    </div>
                    </div>
                    <div className="mt-5 text-start sm:mt-7">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                        Order By (Sort)
                      </Dialog.Title>
                      <div className="mt-2">
                        <div className="relative flex">
                          <div className="flex">
                              <input id="datecheck" name="datecheck" type="checkbox" defaultChecked={dateCheck} onChange={() => setDateCheck(document.getElementById("datecheck").checked)} className="h-5 w-5 rounded border-gray-500 text-green-600 focus:ring-green-500"/>
                              <div className='ml-3'>
                                <label htmlFor="date" className="block text-sm font-medium text-warm-gray-900 w-full">Date</label>
                                {dateCheck &&
                                  <div className="mt-1">
                                    <select name="date" id="date" className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500">
                                      <option selected={date=='asc'} key={0} value={'asc'}>Oldest - Newest (ASC)</option>
                                      <option selected={date=='desc'} key={1} value={'desc'}>Newest - Oldest (DESC)</option>
                                    </select>
                                  </div>} 
                            </div>
                          </div>
                      </div>
                      <div className="relative flex mt-5">
                          <div className="flex">
                              <input id="pricecheck" name="pricecheck" type="checkbox" defaultChecked={priceCheck} onChange={() => setPriceCheck(document.getElementById("pricecheck").checked)} className="h-5 w-5 rounded border-gray-500 text-green-600 focus:ring-green-500"/>
                              <div className='ml-3'>
                                <label htmlFor="date" className="block text-sm font-medium text-warm-gray-900 w-full">Price</label>
                                {priceCheck &&
                                  <div className="mt-1">
                                    <select name="price" id="price" className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500">
                                      <option selected={price=='asc'} key={0} value={'asc'}>Lowest - Highest (ASC)</option>
                                      <option selected={price=='desc'} key={1} value={'desc'}>Highest - Lowest (DESC)</option>
                                    </select>
                                  </div>}
                            </div>
                          </div>
                      </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button type="button" className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm" onClick={() => handleSubmit()}>Save</button>
                    <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm" onClick={() => reset()} ref={cancelButtonRef}>Reset</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
