import React, { useEffect, useState } from "react";
import axios from "axios";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found.");
          setLoading(false);
          return;
        }

        const response = await axios.get("https://notes.devlop.tech/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Users fetched:", response.data);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "#1a74bd" }}>{error}</p>}
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              <strong>First Name:</strong> {user.first_name} <br />
              <strong>Last Name:</strong> {user.last_name} <br />
            </li>
          ))
        ) : (
          <li>No users found</li>
        )}
      </ul>
    </div>
  );
}

export default UsersList;
