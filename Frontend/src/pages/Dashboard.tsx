// src/pages/Dashboard.tsx
import * as React from "react";
import UrlShortener from "../components/UrlShortener";
import UrlTable from "../components/URLtable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store.ts";
import { fetchLinks } from "../store/linkSlice";

const Dashboard: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.links);

  React.useEffect(() => {
    dispatch(fetchLinks());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-2">
      <main className="flex-grow w-full ">
        <UrlShortener />
        {loading ? <p className="text-center">Loading...</p> : <UrlTable />}
      </main>
    </div>
  );
};

export default Dashboard;
