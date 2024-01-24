import React, { useEffect, useState } from "react";
import "./App.css";
import "./styles.css";

// function Display({ data }) {
//   return (
//     <ul>
//       {data.map((row, index) => (
//         <li key={index}>{row.join(" | ")}</li>
//       ))}
//     </ul>
//   );
// }

function App() {
  const [data, setData] = useState([]);
  const [queriedData, setQueriedData] = useState(null);
  const [queryInput, setQueryInput] = useState("");

  const Submit = (e) => {
    e.preventDefault();
    const formEle = e.target;
    const formDatab = new FormData(formEle);

    fetch(
      "https://script.google.com/macros/s/AKfycbwJ3xx-A7EuQ_nFIEC7UgZ9VK5Ps7gR5K3mjcwekKpflc9uEloQNFtZFt7MSh_oOa8_/exec",
      {
        method: "POST",
        body: formDatab,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const displayData = <Display data={data} />;

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbwJ3xx-A7EuQ_nFIEC7UgZ9VK5Ps7gR5K3mjcwekKpflc9uEloQNFtZFt7MSh_oOa8_/exec"
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  const handleQueryById = () => {
    const result = data.find((row) => row[0] === queryInput);
    if (result) {
      setQueriedData(result);
    } else {
      fetch(
        `https://script.google.com/macros/s/AKfycbwJ3xx-A7EuQ_nFIEC7UgZ9VK5Ps7gR5K3mjcwekKpflc9uEloQNFtZFt7MSh_oOa8_/exec?id=${queryInput}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((fetchedData) => {
          if (fetchedData.length > 0) {
            const selectedColumns = [
              fetchedData[1],
              fetchedData[2],
              fetchedData[3],
            ]; // Fetching the first three columns
            setQueriedData(selectedColumns);
          } else {
            setQueriedData(null);
            console.log("ID not found");
            // Handle case when ID is not found
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
        });
    }
  };

  return (
    <div className="App">
      <h1>Contact Me form</h1>
      <h2>Send data from a website form to Google sheet in React</h2>
      <div>
        <form className="form" onSubmit={(e) => Submit(e)}>
          <input placeholder="Your Name" name="Name" type="text" />
          <input placeholder="Your Email" name="Email" type="text" />
          <input placeholder="Your Message" name="Message" type="text" />
          <input name="Name" type="submit" />
        </form>
        <div>
          <input
            type="text"
            placeholder="Enter ID to query"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
          <button onClick={handleQueryById}>Query by ID</button>
          {queriedData !== null ? (
            Array.isArray(queriedData) ? (
              <div>
                <h2>Queried Result:</h2>
                <ul>
                  {queriedData.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <button onClick={() => setQueriedData(null)}>
                  Clear Result
                </button>
              </div>
            ) : (
              <div>
                <h2>Queried Result:</h2>
                <p>{queriedData}</p>
                <button onClick={() => setQueriedData(null)}>
                  Clear Result
                </button>
              </div>
            )
          ) : null}
          {/* {displayData} */}
        </div>
      </div>
    </div>
  );
}

export default App;
