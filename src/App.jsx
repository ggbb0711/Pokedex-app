import { useState,useEffect } from 'react'
import colorCode from './colorType.json' 
import './index.css'


export default function App() {
  const [bgColor,setBgColor]=useState({})
  const [pokeType,setpokeType]=useState([])
  const [pokeImage,setPokeImage]=useState('Images/MissingNo.1.webp')
  const [pokeName,setPokeName]=useState('Please enter a name to search')
  const [currName,setCurrName]=useState('')
  const [loadingState,setLoadingState]=useState(false)
  
  const updateDisplay=(bgColor,pokeType,pokeImage,pokeName)=>{
    setBgColor(bgColor)
    setpokeType(pokeType)
    setPokeImage(pokeImage)
    setPokeName(pokeName)
  }

  const handleChange=(e)=>{
    setCurrName(e.target.value)
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    e.target.reset()
    try{
      setLoadingState(true)
      const pokeDataResponse=await fetch(`https://pokeapi.co/api/v2/pokemon/${currName.toLowerCase()}`)

      if(pokeDataResponse.ok){
        setLoadingState(false)
        const pokeData=await pokeDataResponse.json()

        const color=pokeData.types.map(type=>type.type.name)
        const bgColor=(color.length>1)?{backgroundImage:`linear-gradient(to right, ${colorCode[color[0]]} , ${colorCode[color[1]]})`}:{backgroundColor:colorCode[color[0]]}
        updateDisplay(bgColor,color,pokeData.sprites.other[`official-artwork`].front_default,`${pokeData.name[0].toUpperCase()}${pokeData.name.slice(1)}`)
      }

      else{
        throw new Error(pokeDataResponse.statusText)
      }


    }
    catch(e){
      setLoadingState(false)
      console.error(e)
      updateDisplay({},[],'Images/MissingNo.1.webp','Please enter a correct pokemon name')
    }


    setCurrName('')
  }

  return (
    <div className='w-[400px] h-[600px] relative flex flex-col m-auto border-2 border-black'>
      <img className='absolute w-full h-full ' src="Images/Pokedex_Background.webp" alt="pokedex background" />
      <div className={`absolute w-full h-full opacity-50`} style={bgColor}></div>
      <Display pokeName={pokeName} pokeImage={pokeImage} pokeType={pokeType} loadingState={loadingState}></Display>
      <div className='bg-red-500 w-full h-[30%] z-10'>
        <form onSubmit={handleSubmit} className={'flex flex-col justify-center items-center h-full gap-2'} action="#" >
          <input type="text" onChange={handleChange} value={currName}/>
          <input className='cursor-pointer border-2 border-white bg-[rgb(137,170,225)] p-2 rounded-lg' type="submit" value={'Search'} style={{pointerEvents:(loadingState)?'none':'auto'}}/>
        </form>
      </div>
    </div>
  )
}

function Display(props){
  console.log(props.pokeType)
  const [pokeType,setpokeType]=useState(props.pokeType)
  const [pokeImage,setPokeImage]=useState('')
  const [pokeName,setPokeName]=useState('')
  const [loadingState,setLoadingState]=useState(props.loadingState)

  useEffect(() => {
    if(props.loadingState!==loadingState){
      setLoadingState(props.loadingState)
    }

    if(props.pokeImage!==pokeImage||props.pokeType!==pokeType||props.pokeName!==pokeName){
      setPokeName(props.pokeName)
      setpokeType(props.pokeType)
      setPokeImage(props.pokeImage)
      console.log(pokeType)
    }
  }, [props.pokeImage,props.pokeType,props.pokeName,props.loadingState])

  return(
  <div className='w-full h-[70%] z-10 p-4 flex flex-col justify-center items-center'>
    {
      (loadingState)?
      <LoadingProps size={'70'}></LoadingProps>:
      <>
      <img className='h-[50%]' src={pokeImage} alt={pokeName} />
      <h1>{pokeName}</h1>
      <div className='w-[50%] flex justify-between items-center gap-4'>
        {
          (pokeType.length===0)?
          <></>
          :pokeType.map((type,i)=>{
            console.log(type)
            return <div key={i} className={`flex-1 p-2 border-4 rounded-xl text-center text-white border-white`} style={{backgroundColor:colorCode[type]}}>{`${type[0].toUpperCase()}${type.slice(1)}`}</div>
          })
        }
      </div>
      </>
    }
    
  </div>)
}

function LoadingProps({size}){
  return(
      <div style={{width:`${size}px`,height:`${size}px`}} className='animate-spin'>
        <div className='w-full h-full rounded-full border-2 border-t-black border-b-black border-r-gray-500 border-l-gray-500'></div>
      </div>
  )
}

