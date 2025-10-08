import React from 'react'
import { Carousel } from 'antd'
import WO1 from '../../images/workout1.jpg'
import WO2 from '../../images/workout2.webp'
import WO3 from '../../images/workout3.webp'
import WO4 from '../../images/workout4.jpg'


const CarouselPage = () => {
  return (
    
    <div className=' m-2  text-center'>

<Carousel autoplay effect="fade">
    <div>
    <img alt='banner 1' className='img img-responsive' style={{width:"100%"}} height="300px" src={WO1}/>
     
    </div>
    <div>
    <img alt='banner 2' className='img img-responsive' style={{width:"100%"}} height="300px" src={WO2}/>

    </div>
    <div>
    <img alt='banner 3' className='img img-responsive' style={{width:"100%"}}  height="300px" src={WO3}/>

    </div>
    <div>
    <img alt='banner 4' className='img img-responsible' style={{width:"100%"}} height="300px" src={WO4}/>

    </div>
  </Carousel>
    </div>
  )
}

export default CarouselPage