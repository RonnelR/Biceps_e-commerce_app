import React from 'react'

const CategoryForm = ({value,setValue,handleSubmit}) => {
 

  return (
    <>
    <form onSubmit={handleSubmit}>
   
  <div className="form-group w-75">
    <input type="name" autoComplete="new-password" value={value || ''} className="form-control " onChange={(e)=>{setValue(e.target.value)}} id="name" aria-describedby="name" placeholder="Name..." />
  </div>
  <div className='w-75'>
  <div className= "d-grid gap-2 d-md-flex">
  <button type="submit" className="btn btn-primary m-2 ">Submit</button>
</div>
  </div>
  
</form>
    </>
  )
}

export default CategoryForm