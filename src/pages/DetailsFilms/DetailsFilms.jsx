import React from 'react'
import { useParams } from 'react-router-dom';
import {  useSelector } from "react-redux";

const DetailsFilms = () => {
  const { id } = useParams();
  const count = useSelector((state) => state.counter.value);

  return (  
    <div>
      <h2>👤 Film Page</h2>
      <p>Film ID: {id} ||   {count}</p>
    </div>
  );
}

export default DetailsFilms
