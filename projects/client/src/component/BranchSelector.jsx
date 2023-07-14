export default function BranchSelector({}) {

    return (
        <div className="flex mb-6">
              <div className="flex items-center">
                <label className="block text-md font-medium leading-6 text-gray-900 mr-4"> Select Branch:</label>
                <select className="rounded-md border border-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600 active:border-green-500 hover:border-green-500 target:border-green-500" id="filter" 
                onChange={(e) => setSelectedBranchId(e.target.value)}
                 >
                  {storeBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
    )
}