import React,{useState, useEffect} from 'react';
import './App.css';
import Papa from 'papaparse';

import './tables.css'
import HistoTabs from './Components/HistoTabs'
var mytable = [];

function App() {
  const [data, setData] = useState([{}]);
  const [dataHW2, setDataHW2] = useState([{}]);
  const [sizeOrNUmber,setsizeOrNUmber] = useState(false)
  const [originalHeaders,setoriginalHeaders] = useState([])
  
  //  K-anonymization/ipumsHW2-test.csv
  // 
  const [link, setlink] = useState("/ipumsHW2-test.csv");
  const [E, setE] = useState(0.1);
  const [bins, setbins] = useState(2);
  const [binsSize, setbinsSize] = useState(2);
  const [loaded, setloaded] = useState(false);
  const [reGenerate, setreGenerate] = useState(3);
  const [reload, setreload] = useState(false);

// Age Gender Marital Race Status Birth place Language Occupation Income (K) 

 
  const   onEChange  = (event)=>{
    setE( event.target.value);
    // console.log(event.target.value);
  }
  const   onbinsChange  = (event)=>{
    setbins( event.target.value);
    // console.log(event.target.value);
  }
  const   onbinsSizeChange  = (event)=>{
    setbinsSize( event.target.value);
    // console.log(event.target.value);
  }
  const onLinkChange = (event)=>{
    setlink( event.target.value);
    // console.log(event.target.value);
  }
  const onSelectionChange = (event)=>{
    if ( event.target.value === "size"){
      setsizeOrNUmber(true)
    }else{
      setsizeOrNUmber(false)
    }
    console.log(event.target.value);
  }
  const submitHandler = (event)=>{
    event.preventDefault();
      if(reGenerate===0){
        setreGenerate(1)    
      }else{
        setreGenerate(0)
      }
    // console.log("submitted");
  }

  const dataSubmitHandler =(event)=>{
    event.preventDefault();
    setreload(!reload)
    setloaded(false)
    setreGenerate(3)
    // console.log("submitted");
  }

   // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    
var rows;
//http://localhost:3000/ipums-solution.csv
Papa.parse(link, {
    header: false,
    delimiter: ";",
    download: true,
    complete: function(results) {
        console.log("Finished:", results.data);
    rows = results.data;
    let headers=[];
    for (let i = 0; i < rows[0].length; i++) {
      headers.push(<th className=" pa2">{rows[0][i]}</th>) 
    }
    mytable =[ 
    <thead>
    <tr>
    {headers}
    </tr>
    </thead>
    ]
    
      //clearing extra empty lines 
      console.log(rows);
      while(rows[rows.length-1].length === 1){
          rows.pop();
      }
    // rows.pop();
    //deleting headers row 
     setoriginalHeaders( rows.shift())
    let myrows = []
    for (let i = 0; i < (rows.length>19? 19 : rows.length); i++) {
      let currentrow=[];
      for (let j = 0; j < rows[i].length; j++) {
        currentrow.push(<td className=" pa2">{rows[i][j]}</td>)
      }
      myrows.push(<tr>{currentrow}</tr>)   
    }
  mytable.push(<tbody>{myrows}</tbody>)


  let datahw2 = []
  let datahw2Member = []
  // col
  for (let i = 0; i < rows[0].length; i++) {
    //rows
    for (let j = 0; j < rows.length; j++) {
      datahw2Member.push({x:Number(rows[j][i])})
    }
    datahw2.push(Array( datahw2Member))
    datahw2Member = []
  }

    
  
    setDataHW2(datahw2)
    setData(rows)
    setloaded(true)
    }
});
  }, [reload]);


  
  return (
    <div className="App ">
      <div>
        <h1>HW2 COE526</h1>
      </div>
      <form onSubmit={dataSubmitHandler}>
      <label className="b"> Link to Load data (csv, with Headers): </label>
      <input className="bg-lightest-blue ba b--green" type="text"  onChange={onLinkChange} value={link}></input>
      <button > Load </button>
      </form>
      <div className="orange bg-black-90 pa1">
      <p >Note: This tool is used to apply differntial privacy to a given data,
        <br></br>
        with limitation on the first and the last data to be 4 and 70 respectivally in the size 
        <br></br>
        That in order to protect your beautiful eyes 
      </p>
      </div>
      {loaded?
      <div> 
      <table className="shadow-2 ba center ma2" cellPadding="0" cellSpacing="0">
      {mytable}

    </table>
    </div>
    :
    <h4>Loading Data..</h4>
    }
      
      <div className="pa2">
        <form className="generator" onSubmit={submitHandler}>

      <div>
      <label className="b"> E(privacy budget) value: </label>
      <input className="bg-lightest-blue ba b--green e" type="number" step="any" min="0" max="0.1" onChange={onEChange} value={E}></input>
      </div>
      <div>
      <input type="radio" name="sizeOrNumber" value="number" defaultChecked  onChange={onSelectionChange}></input>
      <label className="b" for="binsNumber"> Number of Bins: </label>
      <input className="bg-lightest-blue ba b--green e" id="binsNumber" type="number" min="2" max="19" onChange={onbinsChange} value={bins} 
      disabled = {sizeOrNUmber? "disabled" : ""}
      style ={{
        opacity: sizeOrNUmber ? 0.25 : 1,
      marginLeft: "-23px"}}
        ></input>
      </div>
      <div>
      <input type="radio" name="sizeOrNumber" value="size"  onChange={onSelectionChange}></input>
      <label className="b" for="binsSize"> Size of Bins: </label>
      <input className="bg-lightest-blue ba b--green e" id="binsSize" type="number" min="2" max="400" onChange={onbinsSizeChange} value={binsSize}
       disabled = {!sizeOrNUmber? "disabled" : ""}
       style ={{
        opacity: !sizeOrNUmber ? 0.25 : 1,
        marginLeft: "-23px"}}
        ></input>
      </div>
      {/* <br></br>      <br></br>
      <br></br> */}
      <div >
      <button > Generate </button>
      </div>
      </form>
      </div>
      <div>
        <h2>Private Histogram</h2>
        { reGenerate<3 ? 
        <div>
          <div className="Histograms">
          <HistoTabs 
          privacyBudget ={E}
          sizeOrNUmber = {sizeOrNUmber} bins={sizeOrNUmber ? [binsSize] : bins}
           colmns={data[0].length}  data={dataHW2} dataHw2={data} 
            headers={originalHeaders} reGenerate={reGenerate} reload={reload}/>
          
          {/* {histograms} */}
          </div>
        </div>
        :
        <h3>Click Generate to show Histogram & statistics...</h3>
        }
      </div>
    </div>
  );
}

export default App;

