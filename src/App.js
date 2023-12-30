import './App.css';
import "aos/dist/aos.css";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import AOS from "aos";
import CsvDownloadButton from 'react-json-to-csv'

function App() {
  const app = React.useRef();
const [chatHistory , setChat] = React.useState([])
const [chatHis , setChatHis] = React.useState([])
const [loadProcess , setLoad] = React.useState(false)
const [pro , setPro] = React.useState(false)
const [con , setCon] = React.useState(false)

const Load = (e) => {
  e.preventDefault()
  if (e.target[0].value == '') {
    return;
  }
  console.log(e.target[0].value)
  setLoad(true)
  let obj = {
    user: "Me: " + e.target[0].value,
    bot: ""
  }
  setChat(chatHistory => [...chatHistory, obj]);
  const chatx = [...chatHis] 
  if (con) {
    chatx.push({
      "role": "user",
      "parts": [
          {
              "text": e.target[0].value
          }
      ]
    })
    setChatHis(chatx);
  }
setPro(true)
setTimeout(() => {
  window.scrollTo(0, document.body.scrollHeight);
}, 100);
  fetch(encodeURI(con ? 'https://cpxdevservice.onrender.com/internal/internalused/testaichat' : 'https://cpxdevservice.onrender.com/internal/internalused/testai'), {
    method: 'post', // or 'PUT'
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: con ? JSON.stringify(chatx) : JSON.stringify({
      p: e.target[0].value
    })
    })
    .then(response => response.json())
    .then(data => {
      setPro(false)
        if (data.status == true) {
          if (con) {
            chatx.push({
              "role": "model",
              "parts": [
                  {
                      "text": data.message
                  }
              ]
            })
            setChatHis(chatx);
          }
          obj = {
            user: "Me: " + e.target[0].value,
            bot: data.message
          }
          e.target.reset();
        } else {
          obj = {
            user: "Me: " + e.target[0].value,
            bot: "Exprected error: " + data.message
          }
        }
        const newState = [...chatHistory] // creates a copy of the current array
        newState[chatHistory.length] = obj // set the position of the array to payload (or whatever should be the new value)
        setChat(newState)
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight);
        }, 200);
        setTimeout(() => {
          var objDiv = document.getElementById("root");
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 1000);
        setTimeout(() => {
          setLoad(false)
        }, 5000);
    })
    .catch((error) => {
    console.error('Error:', error);
    });
}

React.useEffect(() => {
  AOS.init({ duration: 800 });
}, [])

  return (
    <div>
      <ScrollToBottom mode='bottom'>
        <div style={{marginBottom: app.current != null ? app.current.offsetHeight +10 :200}}>
        {
          chatHistory.map((item) => (
            <div key={item.id}>
            <div className='d-flex justify-content-end mb-3' data-aos="fade-down-left">
            <div className="card">
                <div className="card-body">
                  {item.user}
                </div>
              </div>
            </div>
    
            {item.bot != '' && (
                    <div className={'d-flex justify-content-start ' + (window.innerWidth < 700 ? 'w-75' : 'w-50')} data-aos="fade-down-right">
                    <div className="card">
                        <div className="card-body">
                        <Markdown key={item.bot} remarkPlugins={[remarkGfm]}>{item.bot}</Markdown>
                        </div>
                      </div>
                    </div>
            )}
             {item.bot == '' && pro && (
                    <div className={'d-flex justify-content-start ' + (window.innerWidth < 700 ? 'w-75' : 'w-50')} data-aos="fade-down-right">
                    <div className="card">
                        <div className="card-body">
                        <img src='https://cdn.statically.io/gl/cpx2017/cpxcdnbucket@main/main/cpx-circular.svg' width='40' />
                        </div>
                      </div>
                    </div>
            )}
            {con == false && (
            <hr/>
            )}
            </div>
    
          ))
        }
        </div>

      </ScrollToBottom>


      <div className="fixed-bottom bg-light" ref={app}>
      <form className='d-flex justify-content-center card-body' onSubmit={(e) => Load(e)} autoComplete='off'>
  <div className="form-row container align-items-center">
    <div className="col-md col-12">
      <label className="" for="inlineFormInput">Enter your prompt</label>
      <textarea className="form-control" id="inlineFormInput" disabled={loadProcess} rows="2"></textarea>
    </div>
    <div className="col-md-2 col-12">
    <div class="btn-group" role="group" aria-label="Basic example">
      <button type="submit" className="btn btn-lg mt-2 w-100 btn-primary mb-2" disabled={loadProcess}>Send</button>
      <CsvDownloadButton data={chatHistory} delimiter=',' className="btn btn-lg mt-2 w-100 btn-success mb-2" disabled={loadProcess}>Export Chat History</CsvDownloadButton>
</div>
    </div>
  </div>
</form>
    <div class="container mt-5 form-check mb-3">
      <input class="form-check-input" id="idcheck" type="checkbox" value={con} disabled={chatHistory.length > 0} onChange={() => setCon(!con)} />
      <label class="form-check-label" for="idcheck">
        Continuous Chat (Remember previous conversation on this chat)
      </label>
    </div>
      </div>
    </div>
  );
}

export default App;
