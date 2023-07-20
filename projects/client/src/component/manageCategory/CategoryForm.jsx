import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Dialog, Transition } from "@headlessui/react";

export default function CategoryForm({handleClose, cancelButtonRef, title}) {
    return(
        <Form>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-semibold leading-6 text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                      <div className="mt-8 mb-4 w-96">
                        <Field name="category_name">
                        {({ field, form }) => (
                          <div>
                            <label
                              className="block text-md font-medium leading-6 text-gray-900"
                            >
                              Category name
                            </label>
                            <div className="my-2">
                              <input {...field}
                                id="category_name"
                                name="category_name"
                                type="text"
                                className={`block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 ${
                                    form.errors.category_name && form.touched.category_name
                                      ? "ring-2 ring-red-600"
                                      : ""
                                  }`}
                              />
                              <ErrorMessage
                                 component="div"
                                 name="category_name"
                                className="text-red-500 text-sm mt-1"
                                />
                            </div>
                          </div>
                        )}
                        </Field>
                        
                        <Field name="image">
                        {({ field, form }) => (
                          <div>
                            <div className="flex items-center justify-between">
                              <label
                                className="block text-md font-medium leading-6 text-gray-900"
                              >
                                Category image
                              </label>
                            </div>
                            <div className="mt-2">
                              <input {...field}
                                id="image"
                                name="image"
                                type="file"
                                className={`block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 ${
                                    form.errors.image && form.touched.image
                                      ? "ring-2 ring-red-600"
                                      : ""
                                  }`}
                              />
                              <ErrorMessage
                                 component="div"
                                 name="image"
                                className="text-red-500 text-sm mt-1"
                                />
                            </div>
                          </div>
                        )}
                        </Field>
                        {/* </form> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 sm:ml-3 sm:w-auto"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleClose}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
        </Form>
    )
}