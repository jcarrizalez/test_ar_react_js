import React from "react";
import { Router as ReactRouter, Route, BrowserRouter, Switch, Redirect, useLocation } from "react-router-dom";
import { createBrowserHistory } from "history";

import BookReader from './components/BookReader';
import { redux } from './services';

function Layout(props) {

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  return(
    <Switch>
      <Route path="/reader/:book" render={ prop => <BookReader {...prop} query={query} /> } />
    </Switch>
  )
}

function Router() {
  
  const history = createBrowserHistory();
  //Load store de redux
  redux.store({
    //lo dejo como proceso inicial hasta tener el circuito de seleccinar un libro
    book:{
      slug:'eloquent-javascript',
      name:'Eloquent JavaScript'
    },
    loader:false,
    search:{}
  });

  return(
    <ReactRouter history={history}>
      <BrowserRouter>
        <Switch>
          <Redirect from="/" exact to="/reader/eloquent-javascript?location=1" /> 
          <Route path="/*" render={ prop => <Layout {...prop} /> } />
        </Switch>
      </BrowserRouter>
    </ReactRouter>
  )
}

export default Router;