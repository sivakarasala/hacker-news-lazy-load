import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App";
const queryClient = new QueryClient();

const PreFetchLinks = () => {
  const [newStoriesLinks, setNewStoriesLinks] = useState(null);
  useEffect(() => {
    // Fetch top 500 news stories and store them in properly formatted URLs
    async function fetchNewStories() {
      const response = await axios.get(
        "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
      );
      const newStoriesListByIds = await response.data;
      // build story url and store them
      const newStoriesLinks = newStoriesListByIds.map(
        (storyId) =>
          `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`
      );
      setNewStoriesLinks(newStoriesLinks);
    }
    fetchNewStories();
  }, []);
  if (newStoriesLinks) {
    return <App newStoriesLinks={newStoriesLinks} />;
  }
  return null;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PreFetchLinks />
    </QueryClientProvider>
  </React.StrictMode>
);
