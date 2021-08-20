import React, {useEffect, useState } from "react";
import {Link, get, redux} from '../services';

import Search from './Search';

/**
* no uso el Hooks useCallback, porque incrementa el uso de memoria
* en el acceso desde useEffect, aunque no es la manera en react, asi da mas performance
* y escribo menos codigo, que es un beneficio para el build
*/
const default_state = {
	url:'/books/{{book}}/content?page={{page}}&count={{count}}',
	book:null,
	text:null,
	timer:0,
	elements:[],
	paginate:{
	  count: 20, 
	  page: 1
	}
};
var state = default_state;

const BookContent = ({book}) => {

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

	//load ultima busqueda
	useEffect(() => {
		
		let search = redux.get('search');
		
		if(search.elements){
			state = {
				...default_state,
				...search
			}
			setUpdate(new Date());
		}

	}, []);

	/**
	* ctrl de tiempo entre las busquedas, esto cuando desmonta el componente
	* si quedo un setTimeout, esto lo eliimina y evita el uso de memoria
	*/
	useEffect(() => {
		return () => clearTimeout(state.timer);
	}, []);

	//Listener del scroll busqueda
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

const Item = ({text, item:{page, text_content}}) =>{
	let content = (text_content === null)?'':String(text_content);
	content = content.substring(0,200)+(content.length>200?'...':'');
	if(text!==''){
		content = content.replace(text,'{{'+text.toUpperCase()+'}}');
	}
	return(
		<div className="card item">
		  <div className="card-body">
			<Link to={`/reader/eloquent-javascript?location=${page}`}>
			    <h5 className="card-title"><b>PÁGINA</b> {page}</h5>
			    <p className="card-text">{content}</p>
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
		book,
		url,
		elements,
		paginate:{
			page, 
			count,
			total_pages
		}
	} = state;

	if(text === null) return null;

  	if(total_pages === page) return null;
  	
  	//replace url con datos actuales
  	url = url
  		.replace('{{book}}', book)
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
		redux.push('search',state);
	}
	callback(new Date());
}

export default BookContent;