// import React from "react";
import "./App.css";
import MapContainer from "./Components/MapContainer";
import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Select,
  FormControl,
  Card,
  CardContent,
} from "@mui/material";
import InfoBox from "./Components/InfoBox";
import Table from "./Components/Table";
import { prettyprintStat, sortData } from "./Components/util";
import LineGraph from "./Components/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countrydata, setCountrydata] = useState({});
  const [table, setTable] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountrydata(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTable(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json({}))
      .then((data) => {
        setCountry(countryCode);
        //all of the data from the country response
        setCountrydata(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };
  return (
    <div className="App">
      <div className="app__left">
        <div>
          <div className="app__header">
            <h1>COVID 19 TRACKER</h1>
            <FormControl className="app__dropdown">
              <Select
                variant="outlined"
                onChange={onCountryChange}
                value={country}
              >
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="app__stats">
            <InfoBox
              isRed
              active={casesType === "cases"}
              onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases"
              cases={prettyprintStat(countrydata.todayCases)}
              total={prettyprintStat(countrydata.cases)}
            ></InfoBox>

            <InfoBox
              active={casesType === "recovered"}
              onClick={(e) => setCasesType("recovered")}
              title="Recovered"
              cases={prettyprintStat(countrydata.todayRecovered)}
              total={prettyprintStat(countrydata.recovered)}
            ></InfoBox>

            <InfoBox
              isRed
              active={casesType === "deaths"}
              onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              cases={prettyprintStat(countrydata.todayDeaths)}
              total={prettyprintStat(countrydata.deaths)}
            ></InfoBox>
          </div>
          <MapContainer
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>
      <div className="right__column">
        <Card className="app__right">
          <CardContent>
            <h3 className="live__cases">Live Cases by Country</h3>
            <Table countries={table}></Table>
            <h3 className="graph__title">Worldwide new Cases</h3>
            <LineGraph className="app__graph"></LineGraph>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
