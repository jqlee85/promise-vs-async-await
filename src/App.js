import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const jumpwriterAPI = 'https://api.jumpwriter.com/wp-json/jumpwriter-theme/v1/noun-verb-prompt/';
const giphyAPI1 = 'https://api.giphy.com/v1/gifs/search?api_key=XKSIgL9gyVGH4R3w4LpkpiHRIvnIoAMv&q=';
const giphyAPI2 = '&limit=2&lang=en';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      word1: false,
      img1: false,
      word2: false,
      img2: false
    };  
  }
  
  componentDidMount(){
    
    // Chaining Promises
    this.getPromptsPromiseChain()
    
    // Using Async/Await
    // this.getPromptsAwait().
    // then(results => {
    //   this.setState(prevState => ({
    //     word2: results.word2,
    //     img2: results.img2
    //   }));
    // });
  }
  
  // Get Prompts via chain of promises
  getPromptsPromiseChain(){

    fetch(jumpwriterAPI)
      .then(response => response.json())
      .then( json => {
        console.log(json.text)
        this.setState(prevState => ({
          word1: json.text,
        }));
        return fetch(giphyAPI1 + encodeURI(json.text) + giphyAPI2, {mode:'cors'})
      })
      .then(response => response.json())
      .then( json => {
        this.setState(prevState => ({
          img1: json.data[0].images['original']['url'],
        }));
      })
      .catch(err =>{
        console.error(err);
      })

  } 

  // Get Prompts with Async/Await
  async getPromptsAwait(){

    let words = await fetch(jumpwriterAPI)
    let wordsjson = await words.json()
    let phrase = wordsjson.text
    console.log(phrase)
    let img = await fetch(giphyAPI1 + encodeURI(phrase) + giphyAPI2, {mode:'cors'})
    let imgjson = await img.json()
    let imgURL = imgjson.data[0].images['original']['url']

    return {
      word2: phrase,
      img2: imgURL
    }
  
  }

  render() {
    
    let styles = {
      color: '#fff',
      background: '#191919',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }

    return (
      <div className="App" style={styles}>
        <p>Chaining Promises</p>
        {this.state.word1 && <h1>{this.state.word1}</h1> }
        {this.state.img1 && <img style={{maxWidth:'100%',height:'auto'}} src={this.state.img1}/> }
        <br/>
        <p>Async/Await</p>
        {this.state.word2 && <h1>{this.state.word2}</h1> }
        {this.state.img2 && <img style={{maxWidth:'100%',height:'auto'}} src={this.state.img2}/> }
      </div>
    );
  }
}

export default App;
