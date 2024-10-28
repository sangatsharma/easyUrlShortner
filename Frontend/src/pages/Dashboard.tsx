import * as React from "react";
import UrlShortener from "../components/UrlShortener";
import UrlTable from "../components/URLtable";
import axios from "axios";

interface IDashboardProps {}

const Dashboard: React.FunctionComponent<IDashboardProps> = () => {
  const [links, setLinks] = React.useState<
    [
      {
        originalUrl: string;
        shortId: string;
        createdAt: string;
        expiryDate: string;
        clicks: number;
      }
    ]
  >([
    {
      originalUrl: "",
      shortId: "",
      createdAt: "",
      expiryDate: "",
      clicks: 0,
    },
  ]);

  const [loading, setLoading] = React.useState<boolean>(false);
  React.useEffect(() => {
    fetchLinks();
  }, []);
  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/urls/all`,
        { withCredentials: true }
      );
      const data = response.data;
      console.log(response.data);
      if (data.success) {
        setLinks(response.data.urls);
      }
    } catch (err) {
      console.error("Error fetching URLs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-2">
      <main className="flex-grow w-full ">
        <UrlShortener />
        {loading ? <p>Loading...</p> : <UrlTable links={links} />}
      </main>
    </div>
  );
};

export default Dashboard;
