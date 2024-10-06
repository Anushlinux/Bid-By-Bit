import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dropdown() {
  return (
    <div className="overflow-visible">
      <Menu
        as="div"
        className="relative inline-block text-left z-50 overflow-visible "
        style={{ backgroundColor: "#1e1e1e", zIndex: 100 }} // Increase z-index
      >
        <div>
          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-lg font-semibold text-gray-400 hover:text-gray-200 ">
            C++
            <ChevronDownIcon
              className="-mr-1 mt-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </MenuButton>
        </div>

        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems
            className="absolute left-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            style={{ backgroundColor: "#2e2e2e" }}
          >
            <div className="py-1">
              <MenuItem>
                {({ selected }) => (
                  <a
                    href="#"
                    className={classNames(
                      selected ? "bg-gray-700 text-gray-100" : "text-gray-100",
                      "block px-4 py-2 text-md"
                    )}
                  >
                    C++
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <a
                    href="#"
                    className={classNames(
                      focus ? "bg-gray-700 text-gray-100" : "text-gray-100",
                      "block px-4 py-2 text-md"
                    )}
                  >
                    C
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <a
                    href="#"
                    className={classNames(
                      focus ? "bg-gray-700 text-gray-100" : "text-gray-100",
                      "block px-4 py-2 text-md"
                    )}
                  >
                    Java
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <a
                    href="#"
                    className={classNames(
                      focus ? "bg-gray-700 text-gray-100" : "text-gray-100",
                      "block px-4 py-2 text-md"
                    )}
                  >
                    Python
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <a
                    href="#"
                    className={classNames(
                      focus ? "bg-gray-700 text-gray-100" : "text-gray-100",
                      "block px-4 py-2 text-md"
                    )}
                  >
                    Javascript
                  </a>
                )}
              </MenuItem>
            </div>
            {/* <div className="py-1">
              <form method="POST" action="#">
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="submit"
                      className={classNames(
                        focus ? "bg-gray-100 text-white" : "text-gray-700",
                        "block w-full px-4 py-2 text-left text-sm"
                      )}
                    >
                      Sign out
                    </button>
                  )}
                </MenuItem>
              </form>
            </div> */}
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
