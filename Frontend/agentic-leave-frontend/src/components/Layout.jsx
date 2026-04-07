import Sidebar from "./Sidebar";
import Header from "./Header";


function Layout({ children }) {

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-100">

        <Header />

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;
