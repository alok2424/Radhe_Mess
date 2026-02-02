import {Route, Routes} from "react-router-dom"
const AppRoutes = ()=>{
    return(
        <Routes>
           <Route path="/" element={<span>HOME PAGE</span>}/>
           <Route path="/user-profile" element={<span>HOME PAGE</span>}/>
        </Routes>
    )
}
