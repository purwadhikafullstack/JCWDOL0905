import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Dialog, Transition } from "@headlessui/react";

export default function ProductForm({ title, categories, handleClose, cancelButtonRef }) {
  return (
        <Form>
      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900" > {title} </Dialog.Title>
            <div className="mt-8 mb-4 w-96">
              <Field name="product_name">
                {({ field, form }) => (
                  <div>
                    <label htmlFor="product_name" className="block text-md font-medium leading-6 text-gray-900" > Product Name </label>
                    <div className="my-2">
                      <input
                        {...field}
                        id="product_name"
                        type="text"
                        className={`block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 ${
                          form.errors.product_name && form.touched.product_name
                            ? "ring-2 ring-red-600"
                            : ""
                        }`}
                      />
                      <ErrorMessage component="div" name="product_name" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                )}
              </Field>
              <Field name="id_category">
                {({ field, form }) => (
                  <div>
                    <label htmlFor="id_category" className="block text-md font-medium leading-6 text-gray-900" > Select Category </label>
                    <div className="my-2">
                      <select
                        {...field}
                        id="id_category"
                        required
                        className={`w-full rounded-md border border-gray-200 text-md focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500 ${
                          form.errors.id_category && form.touched.id_category
                            ? "ring-2 ring-red-600"
                            : ""
                        }`}
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                      <ErrorMessage name="id_category" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                )}
              </Field>
              <Field name="product_description">
                {({ field, form }) => (
                  <div>
                    <label htmlFor="product_description" className="block text-md font-medium leading-6 text-gray-900" > Product Description </label>
                    <div className="my-2">
                      <textarea
                        {...field}
                        id="product_description"
                        type="text"
                        className={`block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 ${
                          form.errors.product_description &&
                          form.touched.product_description
                            ? "ring-2 ring-red-600"
                            : ""
                        }`}
                      />
                      <ErrorMessage name="product_description" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                )}
              </Field>
              <div className="flex">
                <Field name="product_price">
                  {({ field, form }) => (
                    <div className="">
                      <label htmlFor="product_price" className="block text-md font-medium leading-6 text-gray-900" > Price </label>
                      <div className="my-2">
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">Rp</span>
                          </div>
                          <input
                            {...field}
                            id="product_price"
                            type="number"
                            className={`block w-full rounded-md border-0 pl-9 pr-2 pt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 ${
                              form.errors.product_price &&
                              form.touched.product_price
                                ? "ring-2 ring-red-600"
                                : ""
                            }`}
                          />
                        </div>
                        <ErrorMessage name="product_price" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  )}
                </Field>
                <Field name="weight">
                  {({ field, form }) => (
                    <div className="ml-4">
                      <label htmlFor="weight" className="block text-md font-medium leading-6 text-gray-900" > Weight </label>
                      <div className="my-2">
                        <div className="relative">
                          <input
                            {...field}
                            id="weight"
                            type="number"
                            className={`block w-full rounded-md border-0 pr-12 px-2 py-1.5 pt-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 ${
                              form.errors.weight && form.touched.weight
                                ? "ring-2 ring-red-600"
                                : ""
                            }`}
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <span
                              className="text-gray-500 sm:text-sm"
                              id="price-currency"
                            >
                              gram
                            </span>
                          </div>
                        </div>
                        <ErrorMessage name="weight" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  )}
                </Field>
              </div>
              <Field name="image">
                {({ field, form }) => (
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="image" className="block text-md font-medium leading-6 text-gray-900" > Product image </label>
                    </div>
                    <div className="my-2">
                      <input
                        {...field}
                        id="image"
                        type="file"
                        className={`block w-full mr-2 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 hover:file:bg-green-100 ${
                          form.errors.image && form.touched.image
                            ? "ring-2 ring-red-600"
                            : ""
                        }`}
                      />
                      <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                )}
              </Field>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        <button type="submit" className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3 sm:w-auto" > Submit </button>
        <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={handleClose} ref={cancelButtonRef} > Cancel </button>
      </div>
      </Form>
  );
}
