

const header =(props)=> {
   let lien= props.prop.map((el,index)=><div key={index}>{el}</div>)
    return ( 
        <div className="header">
            <h1>ARTFOLLIS</h1>
            
            <div className="header-lien">{lien}</div>
        </div>
     );
}

export default header ;