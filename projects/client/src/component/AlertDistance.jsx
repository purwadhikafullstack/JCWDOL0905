import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'

export default function AlertDistance(props) {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-yellow-800">Attention</h3>
          <div className="mt-2 text-lg text-yellow-700 text-justify">
            <p>
                The distance between the nearest store and the delivery location exceeds 30 km.
                {props.token ? " Try changing your shipping address to another location." : " Register/login first to set your shipping address."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
