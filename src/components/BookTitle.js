import React, {useEffect, useState } from "react";
import {redux} from '../services';
export default function BookTitle({onClick}){

	const [book, setBook] = useState(redux.get('book'));

	document.title = book.name;

	useEffect(() => {

	    const unsubscribe = redux.subscribe( () => {
	      if(redux.is('book')) {
	        setBook(redux.get('book'));
	      }
	    });
	    return () => unsubscribe();
  	});

	return (
		<div id="logo" className="nav_logo" onClick={onClick}>
		  <i className="bx bx-layer nav_logo-icon"></i>
		  <span className="nav_logo-name ">{book.name}</span>
		</div>
	);
}