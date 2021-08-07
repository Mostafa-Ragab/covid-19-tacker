import { CardContent,Card,FormControl, MenuItem, Select } from '@material-ui/core';
import {useState,useEffect} from 'react'
import './App.css';
import InfoBox from './components/info-box/InfoBox'
import Map from './components/map/Map'
import Table from './components/table/Table'
import numeral from "numeral";
import {sortData,prettyPrintStat} from './components/util'
import Chart from './components/chart'
import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([])
 const [country,setCountry] = useState('worldWide')
 const [countryInfo, setCountryInfo] = useState({})
 const [tableData, setTableData] = useState([])
 const [mapCenter, setMapCenter] = useState({lat:34.80746, lng: -40.4796 })
 const [mapZoom, setMapZoom] = useState(3)
 const [mapCountries, setMapCountries] = useState([])
 const [casesType, setCasesType] = useState('cases')

 useEffect(() => {
  const fetchData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then(res => res.json())
    .then(data => {
      const countries = data.map(item => (
        {
          name: item.country,
          value: item.countryInfo.iso2
        }
      ))
      // sorted data
      const sortedData = sortData(data)
      setTableData(sortedData)
      setMapCountries(data)
      setCountries(countries)
   
    })
  } 
   
  fetchData()
    
  }, [])
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all').then(
      res => res.json()
    ).then(countries => {
      setCountryInfo(countries)
    })
  }, [])
  // trigger and set the set the new country.
  const OnCountryChange = async (event) => {
    const url =  event.target.value === 'worldWide'?
    'https://disease.sh/v3/covid-19/all' :
    `https://disease.sh/v3/covid-19/countries/${event.target.value}`

   await fetch(url)
   .then(res => res.json())
   .then(country => {

     setCountry(event.target.value)
     setCountryInfo(country)
     country.countryInfo && setMapCenter([country.countryInfo.lat, country.countryInfo.long])
     setMapZoom(4)
   }
    )

  }
  return (
    <div className="app">
    <div className="app__left">

    <div className="app__header">
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app__dropdwon">
        <Select variant="outlined" value={country} onChange={OnCountryChange}>
        <MenuItem value="worldWide">World Wide</MenuItem>
        {countries.map(country => <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
    <div className="app__states">
          <InfoBox 
          onClick={() => setCasesType('cases')}
           title="Coronavirus Cases" 
           active={casesType === 'cases'}
                cases={prettyPrintStat(countryInfo.todayCases)} total={numeral(countryInfo.cases).format('0.0a')}/>
          <InfoBox 
          isGreen
                     active={casesType === 'recovered'}

           onClick={() => setCasesType('recovered')}
           title="Recovered"   cases={prettyPrintStat(countryInfo.todayRecovered)} total={numeral(countryInfo.recovered).format('0.0a')}/>
          <InfoBox
                     active={casesType === 'deaths'}

           onClick={() => setCasesType('deaths')}
            title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={numeral(countryInfo.deaths).format('0.0a')}/>

    </div>
    <Map center={mapCenter} zoom={mapZoom} countries={mapCountries} casesType={casesType}/>
    </div>
    <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 style={{ marginTop: '25px'}}>World wide new {casesType}</h3>
          <Chart casesType={casesType} />
        </CardContent>
      </Card>

     
    </div>
  );
}

export default App;
