import React from 'react'
import './Homecard.css'
import { Link } from 'react-router-dom'

export default function Homecard() {
  return (
    <div>
      <div class="card" style={{width: "18rem"}} id='homecard'>
        <img src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?cs=srgb&dl=pexels-pixabay-259588.jpg&fm=jpg" class="card-img-top" alt="..."/>
        <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <Link to="#" class="btn btn-primary">Go somewhere</Link>
  </div>
</div>
    </div>
  )
}
