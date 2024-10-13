import React from 'react'
import { Fragment, useState } from 'react'

const EditQuestion = () => {
  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full min-w-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full max-w-xl transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all"
                  style={{ backgroundColor: "#1e1e1e" }}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white mb-4"
                  >
                    Create Question
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                      <div className="flex flex-col flex-grow">
                        <label
                          htmlFor="problemTitle"
                          className="text-white text-lg font-semibold mb-2"
                        >
                          Problem Title
                        </label>
                        <input
                          id="problemTitle"
                          type="text"
                          value={formData.problemTitle}
                          onChange={handleChange}
                          className={inputStyle}
                          style={{ backgroundColor: "#2e2e2e" }}
                        />
                      </div>
                      <div className="flex flex-col w-full sm:w-60">
                        <label
                          htmlFor="problemDifficulty"
                          className="text-white text-lg font-semibold mb-2"
                        >
                          Problem Difficulty
                        </label>
                        <select
                          id="problemDifficulty"
                          value={formData.problemDifficulty}
                          onChange={handleChange}
                          className={inputStyle}
                          style={{ backgroundColor: "#2e2e2e" }}
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <label
                        htmlFor="problemDescription"
                        className="text-white text-lg font-semibold mb-2"
                      >
                        Problem Description
                      </label>
                      <textarea
                        id="problemDescription"
                        value={formData.problemDescription}
                        onChange={handleChange}
                        className={textareaStyle}
                        style={{ backgroundColor: "#2e2e2e" }}
                      ></textarea>
                    </div>
                    <div className="flex flex-col flex-grow">
                      <label
                        htmlFor="problemExamples"
                        className="text-white text-lg font-semibold mb-2"
                      >
                        Problem Examples
                      </label>
                      <textarea
                        id="problemExamples"
                        value={formData.problemExamples}
                        onChange={handleChange}
                        className={textareaStyle}
                        style={{ backgroundColor: "#2e2e2e" }}
                      ></textarea>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0">
                      <div className="flex flex-col flex-grow">
                        <label
                          htmlFor="problemTags"
                          className="text-white text-lg font-semibold mb-2"
                        >
                          Problem Tags
                        </label>
                        <input
                          id="problemTags"
                          type="text"
                          value={formData.problemTags}
                          onChange={handleChange}
                          className="border-2 border-gray-400 text-white h-20 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          style={{ backgroundColor: "#2e2e2e" }}
                        />
                      </div>
                      <div className="flex flex-col w-full sm:w-120">
                        <label
                          htmlFor="testCase"
                          className="text-white text-lg font-semibold mb-2"
                        >
                          Test Case
                        </label>
                        <div className="flex flex-col space-y-2">
                          <input
                            id="testCaseInput"
                            type="text"
                            placeholder="input:"
                            value={formData.testCaseInput}
                            onChange={handleChange}
                            className={inputStyle}
                            style={{ backgroundColor: "#2e2e2e" }}
                          />
                          <input
                            id="testCaseOutput"
                            type="text"
                            placeholder="expectedOutput:"
                            value={formData.testCaseOutput}
                            onChange={handleChange}
                            className={inputStyle}
                            style={{ backgroundColor: "#2e2e2e" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      >
                        Submit Problem
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default EditQuestion