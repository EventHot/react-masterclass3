import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/react-masterclass3/tv">
                    <Tv />
                </Route>
                <Route path={["/react-masterclass3/search", "/react-masterclass3/search/:movieId"]}>
                    <Search />
                </Route>
                <Route path={["/react-masterclass3/", "/react-masterclass3/movies/:movieId"]}>
                    <Home />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
