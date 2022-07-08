import React, { useState } from "react";
import "./App.css";
import "primereact/resources/themes/saga-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import axios from "axios";
import { ProgressBar } from "primereact/progressbar";
import SearchBar, { SearchParams } from "../SearchBar/SearchBar";
import SearchList from "../SearchList/SearchList";
import { Trip } from "../../types/Fares";

export enum SearchState {
  INITIAL,
  PENDING,
  SUCCESS,
  FAILURE,
}

function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchState, setSearchState] = useState<SearchState>(
    SearchState.INITIAL
  );
  const [progress] = useState(15);

  const handleSearch = async (searchParams: SearchParams) => {
    setSearchState(SearchState.PENDING);
    setTrips([]);

    await axios
      .post<Trip[]>(
        process.env.NODE_ENV === "production"
          ? "/search"
          : "http://localhost:3001/search",
        searchParams
      )
      .then((res) => {
        setTrips(res.data);
        setSearchState(SearchState.SUCCESS);
      })
      .catch(() => {
        setSearchState(SearchState.FAILURE);
      });
  };

  return (
    <div className="">
      <div>
        <SearchBar onSearch={handleSearch} />
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div>
                <ProgressBar value={progress} className="mt-4" />
                <div className="d-flex justify-content-end mt-1">
                  <div className="small opacity-50 cursor-pointer">Cancel</div>
                </div>
              </div>
              {searchState === SearchState.INITIAL && (
                <h4 className="text-center mt-3">
                  Select criteria and click search 🔍
                </h4>
              )}
              {searchState === SearchState.PENDING && (
                <h4 className="text-center mt-3">
                  ⌛ Loading, sit back and relax. It may take a moment...
                </h4>
              )}
              {searchState === SearchState.FAILURE && (
                <h4 className="text-center mt-3">🤷‍♀️ Something went wrong...</h4>
              )}
              {searchState === SearchState.SUCCESS && trips.length === 0 && (
                <h4 className="text-center mt-3">
                  Nothing found, change criteria and try again 🍸
                </h4>
              )}
            </div>
          </div>
        </div>
        <SearchList trips={trips} />
      </div>
    </div>
  );
}

export default App;
