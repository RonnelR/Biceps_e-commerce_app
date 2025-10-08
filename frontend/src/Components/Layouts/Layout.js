import React from 'react';
import Header from "./Header";
import Footer from "./Footer";
import {Helmet} from 'react-helmet';

const Layout = ({children, title , description , author,keywords}) => {
  return (
    <>
     <Helmet>
                <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />

                <title>{title}</title>
            </Helmet>
    <Header/>
    <main style={{minHeight:"75vh"}}>
    <div>
    <h1>{children}</h1>
    </div>
   
    </main>
    <Footer/>

    </>
  )
}

Layout.defaultProps={
  title:"BICEPS - Shop Now",
  description:"Mern Stack E-commerce App",
  author:"Casper Ronnel Rodrigues",
  keywords:"MongoDB,Express,React,Node,Mern"
}

export default Layout