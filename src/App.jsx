import { useInfiniteQuery } from "react-query";
import { useEffect } from "react";
import { useRef, useCallback } from "react";
import axios from "axios";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AppBar from "@mui/material/AppBar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

import "./app.css";

const Story = ({ title, author, text, id }) => {
  return (
    <Accordion key={id}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id={id}
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>By {author}</Typography>
        <Typography>{text}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

function App({ newStoriesLinks }) {
  const LIMIT = 10;
  const observerElem = useRef(null);

  const fetchStories = async (page) => {
    page = page - 1;
    const start = page * LIMIT;
    const end = start + LIMIT;
    const storyLinksToBeFetched = newStoriesLinks.slice(start, end);
    const storiesResponse = await Promise.all(
      storyLinksToBeFetched.map((link) => axios.get(link))
    );
    const storiesData = await Promise.all(
      storiesResponse.map((response) => response.data)
    );
    return storiesData;
  };

  const { data, isSuccess, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      "stories",
      ({ pageParam = 1 }) => fetchStories(pageParam),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length + 1;
          return nextPage * LIMIT <= newStoriesLinks.length
            ? nextPage
            : undefined;
        },
      }
    );

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    const element = observerElem.current;
    const option = { threshold: 0 };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [fetchNextPage, hasNextPage, handleObserver]);

  return (
    <div className="app">
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit" component="div">
            Hacker News
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ maxHeight: "600px", overflow: "auto" }}>
        {isSuccess &&
          data.pages.map((page) =>
            page.map(({ id, title, by, text }) => (
              <Story key={id} title={title} author={by} text={text} />
            ))
          )}

        <div className="loader" ref={observerElem}>
          {isFetchingNextPage && hasNextPage && "Loading..."}
          {!hasNextPage && data && "No stories left"}
        </div>
      </div>
    </div>
  );
}

export default App;
