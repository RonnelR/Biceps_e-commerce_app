import axios from 'axios'
import React  from 'react'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../../../Context/SearchContext'



const Search = () => {

  const [values,setValues] = useSearch()

  const navigate = useNavigate()

  const handleSearch = async(e) =>{
    e.preventDefault()
    try {
      const res = await axios.get(`/api/v1/product/search-product/${values.keyword}`)

        setValues({...values, results : res.data})
        navigate('/Search')
        
       
      
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
<form className="form-inline my-2 my-lg-0" onSubmit={(handleSearch)}>
<div className='row'>
<div className='col-md-11'>
<input className="form-control mr-sm-2" value={values.keyword} onChange={(e)=>{setValues({...values, keyword : e.target.value})}} type="search" placeholder="Search" aria-label="Search" /> 
</div>

  </div>
</form>

    </div>
  )
}

export default Search