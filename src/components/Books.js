import React, {useEffect, useState } from "react";
import {Link, get} from '../services';

import Search from './Search';

/**
* no uso el Hooks useCallback, porque incrementa el uso de memoria
* en el acceso desde useEffect, aunque no es la manera en react, asi da mas performance
* y escribo menos codigo, que es un beneficio para el build
*/
const default_state = {
	url:'/books?page={{page}}&count={{count}}',
	book:null,
	text:'',
	timer:0,
	elements:[],
	paginate:{
	  count: 20, 
	  page: 1
	}
};
var state = default_state;

const Books = ({book}) => {

	const [update, setUpdate] = useState(null);

	const {text, paginate, elements } = state;

	const onChance = ({target:{value}}) => {

		//ctrl de tiempo entre las busquedas
		clearTimeout(state.timer);

		state = {
			...default_state,
			book:book,
			text:value,
			//ctrl de tiempo entre las busquedas
			timer:setTimeout(() => {
				getDatauseCallback(setUpdate);
			} , 500)
		};
	};

	/**
	* ctrl de tiempo entre las busquedas, esto cuando desmonta el componente
	* si quedo un setTimeout, esto lo eliimina y evita el uso de memoria
	*/
	useEffect(() => {
		getDatauseCallback(setUpdate);
		return () => clearTimeout(state.timer);
	}, []);

	//Listener del scroll busqueda esto se debe pasar a un componente separado, es comun con otros
	useEffect(() => {

		var scroll = document.getElementById('search-elements');
		
	    function handleScroll(event) {

		  if (scroll.offsetHeight + scroll.scrollTop >= scroll.scrollHeight) {	      	
	      	getDatauseCallback(setUpdate);
		  }
	    }

	    scroll.addEventListener('scroll', handleScroll);

	    return () => scroll.removeEventListener('scroll', handleScroll);

	}, [update]);

	return(
		<Search value={text} paginate={paginate} onChance={onChance}>
			<div id="search-elements">
				{elements.map((item,key) =>{
					return <Item key={key} text={text} item={item}/>
				})}
        	</div>
        </Search>
	);
}

const Item = ({text, item:{slug, name}}) =>{
	return(
		<div className="card item">
		  <div className="card-body">
			<Link to={`/reader/${slug}?location=1`}>
			    <h5 className="card-title"><b>{name}</b></h5>
			</Link>
		  </div>
		</div>
	);
}

/**
* NOT Hooks useCallback, asi da mas performance en memoria
*/
async function getDatauseCallback(callback){
	let {
		text,
		url,
		elements,
		paginate:{
			page, 
			count,
			total_pages
		}
	} = state;

  	if(total_pages === page) return null;
  	
  	//replace url con datos actuales
  	url = url
  		.replace('{{page}}', total_pages? (page+1) : page)
  		.replace('{{count}}', count)
  		+((text !== '')? `&search=${text}`:'');
	
	let response = await get(url);
	if(response){

		state = {
			...state,
			paginate: response.metadata,
			elements: elements.concat(response.elements),
		};
	}
	callback(new Date());
}

export default Books;