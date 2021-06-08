import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dotenv from 'dotenv';
function App() {
  dotenv.config();
  const [values, setvalues] = useState();
  const [fetch, setfetch] = useState(false);
  console.log(process.env.REACT_APP_API_KEY);
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_KEY)
      .then((res) => setvalues(res.data.values))
      .then((res) => setfetch(true));
  }, []);
  const render = (values) => {
    return values.map((value) => {
      return <div>{`${value[0]}  ${value[1]}    ${value[2]} `}</div>;
    });
  };

  return <div>{fetch ? render(values) : <h1>아직</h1>}</div>;
}

export default App;
