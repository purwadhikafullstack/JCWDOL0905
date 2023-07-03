import { useSelector } from 'react-redux'
import Layout from '../../component/Layout';
import { Toaster } from "react-hot-toast";

const DASHBOARD_TEXT_ROLE_MAPPING = {
  SUPER_ADMIN: 'Dashboard Super Admin',
  BRANCH_ADMIN: 'Dashboard Branch Admin',

}
const DashboardAdmin = () => {
  const { role } = useSelector((state) => state.adminSlice);
  return (
    <Layout>
      <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900"> {DASHBOARD_TEXT_ROLE_MAPPING[role]} </h1>
              </div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="py-4">
                  <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
                </div>
              </div>
            </div>
          </main>
          <Toaster />
    </Layout>
  );
};

export default DashboardAdmin;
