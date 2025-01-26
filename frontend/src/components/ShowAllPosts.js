import React, { useEffect, useState } from "react";
import axios from "axios";
import AllPostItem from "./AllPostItem";
import ForumIcon from "@material-ui/icons/Forum";
import SearchIcon from "@material-ui/icons/Search";
import "./ShowAllPosts.css";

const ShowAllPosts = () => {
  const [posts, setPosts] = useState([]); // All posts
  const [searchQuery, setSearchQuery] = useState(""); // Search query for username
  const [isSearching, setIsSearching] = useState(false); // To track search mode

  // Fetch all posts
  const fetchAllPosts = () => {
    axios.get("http://localhost:5000/discussion/allposts").then((response) => {
      const allPosts = response.data;
      console.log("All Posts:", allPosts);
      setPosts(Array.isArray(allPosts) ? allPosts : []); // Ensure posts is always an array
    }).catch((error) => {
      console.error("Error fetching all posts:", error);
      setPosts([]); // Set empty array in case of an error
    });
  };

  // Fetch posts by username
  const fetchPostsByUser = (username) => {
    axios
      .get(`http://localhost:5000/discussion/userposts?username=${username}`)
      .then((response) => {
        const userPosts = response.data;
        console.log(`Posts by ${username}:`, userPosts);
        setPosts(Array.isArray(userPosts) ? userPosts : []); // Ensure posts is always an array
      })
      .catch((error) => {
        console.error("Error fetching user posts:", error);
        alert("Failed to fetch posts for the specified user.");
        setPosts([]); // Set empty array in case of an error
      });
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      alert("Please enter a username to search.");
      return;
    }
    setIsSearching(true);
    fetchPostsByUser(searchQuery.trim());
  };

  // Handle reset to view all posts
  const handleReset = () => {
    setIsSearching(false);
    setSearchQuery("");
    fetchAllPosts();
  };

  useEffect(() => {
    // Fetch all posts initially
    fetchAllPosts();
  }, []);

  return (
    <>
      <div className="postsPage">
        {/* Title Section */}
        <div className="title">
          <h1>
            <ForumIcon className="forumI" /> Discussion Forum
          </h1>
        </div>

        {/* Search Section */}
        <div className="searchBar">
          <input
            type="text"
            className="searchInput"
            placeholder="Search by username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="searchButton" onClick={handleSearch}>
            <SearchIcon />
          </button>
          {isSearching && (
            <button className="resetButton" onClick={handleReset}>
              Reset
            </button>
          )}
        </div>

        {/* Posts List Section */}
        <div className="DisPostsList row">
          <AllPostItem posts={posts} />
        </div>
      </div>
    </>
  );
};

export default ShowAllPosts;
