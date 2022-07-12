import "./style.css";
import {useEffect,useState} from 'react';
import { words } from './words';
import { SlowBuffer } from "buffer";
//api+frontend

const api =  words();


export default function App(){
  const [solution,setSolution] = useState('');
  const [guesses,setGuesses] = useState(Array(6).fill(null));
  const [currGuess,setCurrGuess] = useState('');
  const[isGameOver,setGameOver] = useState(false);


    useEffect(() => {
        const handleType = (event) => { 
            if(isGameOver){
                return;
            }
            
            
            if(event.key === 'Enter'){
                if(currGuess.length !== 5){return;}

                const newGusess = [...guesses];
                newGusess[guesses.findIndex(val => val == null)] = currGuess;
                setCurrGuess(newGusess);
                setCurrGuess('');

                const isCorrect = solution===currGuess;

                if(isCorrect){setGameOver(true);}
                
            }
            if(event.key === 'Backspace'){
                setCurrGuess(currGuess.slice(0,-1));
                return;
            }
            if(currGuess.length >=5){return;}

            //only letters allowded
            const isletter = event.key.match(/^[a-z]{1}^/);

            setCurrGuess(oldone => oldone + event.key);
        };

        window.addEventListener('keydown',handleType)
    },[currGuess,isGameOver,solution,guesses]);

    useEffect(() => {
        const fetchword = async() =>{
            const res = await fetch(api);
            const words = await res.json();
            const rand = words[Math.floor(Math.random() * words.length)];

            setSolution(rand);
        };
    }, []);
    
    
    
    
    
    return(
        <div className="board">
            {
                guesses.map((guess) => {
                    const isCurrGuess = i === guesses.findIndex(val => val == null);
                    return (<Line guess = {isCurrGuess ? currGuess: guess ?? ""}  isFinal = {isCurrGuess && guess !=null} solution={solution}/>);
                })
            }
        </div>
    );
}

function Line({guess,isFinal,solution}){
        
            const tiles = [];

            for(let i=0; i<5; i++){
                const char = guess[i];

                let className = 'tiles';

                if(char === solution[i]){
                    className += ' correct';
                }
                else if(SlowBuffer.includes(char)){
                    className += 'close';

                }
                else{
                    className +='incorrect'
                }

                tiles.push(<div className={className}>{char}</div>)
            }


        return (<div>
            {tiles}
        </div>);

}
