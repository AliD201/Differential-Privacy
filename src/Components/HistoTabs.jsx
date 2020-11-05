import React,{useState, useEffect, Fragment} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Scroll from './Scroll'
import laplace from './laplace'
import Bars from './Bar'

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box >
            {/* <Typography> */}
                {children}
                {/* </Typography> */}
          </Box>
        )}
      </div>
    );
  }
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  




// ---------------------------------
const HistoTabs = (props)=>{
    const colmns = props.colmns
    const headers = props.headers
    const reGenerate = props.reGenerate
    const usingSize = props.sizeOrNUmber
    const dataHw2 = props.dataHw2
    const E = props.privacyBudget
    const [bars, setBars ] = useState([]);
    const [anonBars, setAnonBars ] = useState([]);
    const [mses, setMses ] = useState([]);
    const [msesDisplay, setMsesDisplay ] = useState([]);
    const [noisyMax, setNoisyMax ] = useState([]);
   

    useEffect(() => {
      setMses([])
    }, [props.reload]);
    useEffect(() => {
      console.log("histos");
      console.log(colmns);
      console.log(dataHw2);

      // new way of bars
      let datahw2 = []
      let datahw2Member = []
      for (let i = 0; i < dataHw2[0].length; i++) {
        //rows
        for (let j = 0; j < dataHw2.length; j++) {
          datahw2Member.push(Number(dataHw2[j][i]))
        }
        datahw2.push(Array( datahw2Member))
        datahw2Member = []
      }
      console.log("new data");
      for (let i = 0; i < datahw2.length; i++) {
        datahw2[i][0] = datahw2[i][0].sort(function(a, b){return a - b})
      }
      console.log(datahw2);
      
        // using bins 
        // go through the columns
        var myBins = [[]]
        let binSize
        if(!usingSize){
        for (let i = 0; i < datahw2.length; i++) {
           binSize = datahw2[i][0].length/Number(props.bins)
          let max =  Math.max(...datahw2[i][0]);
          let start = 0;
          let count = 0;
          for (let j = 0; j < datahw2[i][0].length; j++) {
            if ( count <  binSize){
              count ++
            }else{
              myBins[i].push({begin: start, finish:datahw2[i][0][j], count: Number(count)})
              count = 1;
              start = datahw2[i][0][j]
              

            }
          }
          if ( count !==1){
            myBins[i].push({begin: start, finish:max, count: Number(count)})
          }
          if ( i !== datahw2.length-1){
            myBins.push([])
          }
        }
        // using the size
      }else{
        for (let i = 0; i < datahw2.length; i++) {
          let addition = 0;
          if (i===datahw2.length-1){
            if(Number(props.bins[0])>=70){
              binSize= Number(props.bins[0])
            }else{
              binSize = 70
            }
          }else if (i===0){
            if(Number(props.bins[0])>=4){
              binSize= Number(props.bins[0])
            }else{
              binSize = 4
            }
          }else{
            binSize = Number(props.bins[0])
          }
          addition = Number(binSize)

          // binSize = (i===datahw2.length-1)?(Number(props.bins[0])>=70)?( Number(props.bins[0]) ): 70:Number(props.bins[0])
          // let addition = (i===datahw2.length-1)?(Number(props.bins[0])>=70)?( Number(props.bins[0]) ): 70:Number(props.bins[0])
         let max =  Math.max(...datahw2[i][0]);
         let start = 0;
         let count = 0;
         for (let j = 0; j < datahw2[i][0].length; j++) {
           let element = datahw2[i][0][j]
           if ( element< ( binSize)){
             count ++
           }else{
             myBins[i].push({begin: start, finish:binSize, count: Number(count)})
             count = 0;
             start = binSize
             binSize += addition
             j -=1
           }
         }
         if ( count !==0){
           myBins[i].push({begin: start, finish:max, count: Number(count)})
         }
         if ( i !== datahw2.length-1){
           myBins.push([])
         }
       }
      }
        console.log(myBins)
        // fix data for bars
        
        const barsGenerator =(myBins) =>  {
          let myData = [[]]
          for (let i = 0; i < myBins.length; i++) {
          for (let j = 0; j < myBins[i].length; j++) {
            myData[i].push({x:`[${myBins[i][j].begin}, ${myBins[i][j].finish})`,y:myBins[i][j].count})
          }
          if ( i !== myBins.length-1){
            myData.push([])
          }
        }
        let myBars = []
        for (let i = 0; i < myData.length; i++) {
          if( i === myData.length-1){
            let style = {flexBasis:"50%"};
            myBars.push(<Fragment>
              <div style={{flexBasis:"100%"}}></div>
              <Bars style={style} name={headers[i]} data={myData[i]}></Bars>
              <div style={{flexBasis:"100%"}}></div>
            </Fragment>)  
          }else{
            let style = {flexBasis:"30%"};
          myBars.push(<Bars style={style} name={headers[i]} data={myData[i]}></Bars>)
        }
        }
        return [myData, myBars]
      }
        let bars =  barsGenerator(myBins)
        setBars(bars[1])
        console.log("mydata", bars[0]);


        // annonymization -----------------------
        const noiseGenerator = (limiter,u,b)=>{
          let noiseValue 
          // !(noiseValue <= limiter) ||
          while ( !(noiseValue > -limiter)){
            noiseValue = laplace(u,b)
          }
          return noiseValue
        }
        // go through columns
        let anonBins = JSON.parse(JSON.stringify(myBins));
        console.log("anonyBIns", anonBins);
        for (let i = 0; i < anonBins.length; i++) {
          // go through the bars of the specific column
          for (let j = 0; j < anonBins[i].length; j++) {
            anonBins[i][j].count += Math.ceil( noiseGenerator(anonBins[i][j].count,0,1/E))
          }
        }
        let anonbars = barsGenerator(anonBins)
        setAnonBars(anonbars[1])
        console.log("myAnondata", anonbars[0]);
        
        // MSE calculation 
        let allMSE = []
        let memberMSE = 0;
        for (let i = 0; i < anonBins.length; i++) {
          // go through the bars of the specific column
          for (let j = 0; j < anonBins[i].length; j++) {
            memberMSE += Math.pow(myBins[i][j].count-anonBins[i][j].count, 2 )
          }
          memberMSE = (memberMSE/anonBins[i].length).toFixed(3)
          console.log("member",memberMSE);
          allMSE.push({name:headers[i],MSE:Number(memberMSE),bins: usingSize?`S(${props.bins[0]})`:`N(${props.bins})`})
        }
        console.log("MSE", allMSE);
        console.log("current", mses);
        let currentMSE= mses;
        
        for (let i = 0; i < currentMSE.length; i++) {
          allMSE[i].MSE = Number(((allMSE[i].MSE + currentMSE[i].MSE)/2).toFixed(3))
          allMSE[i].bins = currentMSE[i].bins + ` ${allMSE[i].bins}`
        }
        console.log("totalMSE", allMSE);
        setMses(allMSE)

        let display = []
        for (let i = 0; i < allMSE.length; i++) {
        display.push(<p>{`${allMSE[i].name}:  ${allMSE[i].MSE} ,Calculation Bins:${allMSE[i].bins}`}</p>)
        }
        console.log("displays", display);
        setMsesDisplay(display)

        //maxes 
        let maxes = []
        for (let i = 0; i < anonBins.length; i++) {
          let max = 0
          let range= 0
          for (let j = 0; j < anonBins[i].length; j++) {
            if (anonBins[i][j].count > max){
              range =`[${anonBins[i][j].begin}, ${anonBins[i][j].finish}]`
              max = anonBins[i][j].count;
            }
          }
          maxes.push(` ${headers[i]}: ${range} `)
        }
        console.log("MAAAAAAAXES",maxes)
        setNoisyMax(maxes)
        //----- end the way of bars
      
     },[props.reload, props.reGenerate])

     
     
    
//choosing age to begin with 

// starting with findin the frequency of the dimension/quasi

// first choose the most suitable dimension
/**
 * * large difference between min and max
 * * have more "unique" values 
//  */


const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
      return (
        <div className="center">

            
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            centered
          >
            <Tab label="Histograms" {...a11yProps(0)} />
            <Tab label="Stats" {...a11yProps(1)} />
          </Tabs>
          {reGenerate<2 ? 
          <Fragment>
          <TabPanel value={value} index={0}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <Scroll>
                <div className="Histograms">
                {bars}
                </div>
    
              <h2 className="center">Anonymized Histograms</h2>

              <div className="Histograms">
              {anonBars}
              <h3 className="db" style={{flexBasis:"100%"}}>Noisy Maxes</h3>
              {noisyMax}
              </div>
              </Scroll>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} >
            <Scroll flexDirection={"column"} className="w-100">
            
            <h4>The displayed values are for all the generated bins</h4>
            <p>where N(x) means used in number of bins with number x<br></br>
            and S(x) means used in size of bins with size x
            </p>
            {msesDisplay}
            
            </Scroll>
          </TabPanel>
          </Fragment>: ""}
        </div>
      );
    
}


export default HistoTabs;