
import {useState, useContext, createContext} from 'react';

//config context
const SearchContext = createContext();

//create context provider
const SearchProvider = ({children})=>{

    const [values, setValues] = useState({
        keyword:'',
        results:[]
    });


    return (
        <SearchContext.Provider value = {[values,setValues]}>
            {children}

        </SearchContext.Provider>
    )
};

//custom hook
const useSearch = () => useContext(SearchContext);

export {useSearch , SearchProvider};
