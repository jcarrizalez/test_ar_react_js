import React, {useEffect, useState, useRef } from "react";
import Title from './BookTitle';
import Content from './Content';
import Books from './Books';
import {api_url} from '../services';

/**
* no uso el Hooks useCallback, porque incrementa el uso de memoria
* en el acceso desde useEffect, aunque no es la manera en react, asi da mas performance
* y escribo menos codigo, que es un beneficio para el build
*/
const default_state = {
  api_url:`${api_url}/books/{{book}}?page={{page}}`,
  web_url:null,
  current:null,
  expand:false,
  zoom:70,
  book:null,
  books:[],
};
var state = default_state;


export default function BookReader({match:{url, params}, query}) {

  state.book = params.book;
  state.web_url = url;
  
  const location = query.get("location")||1;

  const refScroll = useRef();

  const [update, setUpdate] = useState(null);

  const {expand, zoom, current, book, books } = state;

  const onExpand = () => {
    
    const ctrl = (div, _class) =>
      document.querySelector(div).classList.[expand?'remove':'add'](_class);

    //control de css
    ctrl('#nav-bar', 'show');
    ctrl('#header-toggle', 'bx-x');
    ctrl('#body-pd', 'body-pd');
    ctrl('#header', 'body-pd');

    if(expand === true){
      state.current = null;
    }
    state.expand = !expand;
    setUpdate(new Date());
  }
  const onHide = value => (expand === value)? onExpand() : null;

  const onCurrent = current => {

    state.update = update;
    state.current = current;
    setUpdate(new Date());
  }

  const onZoom = id => {

    if('zoom-in'===id && zoom<200){
      state.zoom += 10;
    }
    else if(zoom>0){
      state.zoom -= 10;
    }
    setUpdate(new Date());
  }

  const onHref = id => {
    
    if(!['zoom-in','zoom-out'].includes(id)){
      onHide(false);
    }
    state.current = id;
    setUpdate(new Date());

    document.querySelectorAll('.nav_link')
      .forEach(row=> row.classList.remove('active') );

    document.querySelector('#'+id).classList.add('active');
  }

  //busco la data cada vez que que cambia el router en location
  useEffect(() => {
    getDatauseCallback(setUpdate, location);
  }, [location]);

  
  useEffect(() => {

    function onScroll(event){

      const { offsetHeight } = refScroll.current;
      const { scrollY, innerHeight } = window;

      if ((scrollY + innerHeight) >= offsetHeight){

        /**
        * aca debo ejectuar un link-route a la siguiente pagina
        * dejo para luego ya que debo analizarlo bien
        */
        //let book = state.books.pop();
        //getDatauseCallback(setUpdate, (book.page+1));
        console.log('debo para despues')
      }
    }

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    }
  }, [location]);


  const NavLink = ({id, icon, title}) => {

    let is_id = (current === id)? true : false;

    let is_zoom = ['zoom-in','zoom-out'].includes(id);

    if(expand === true && current!==null && !is_id && !is_zoom){
      return null;
    }
    
    return (
      <div id={id} className={"nav_link"+(is_id?' active':'')}>
        <i className={`bx ${icon} nav_icon`} onClick={()=>is_zoom?onZoom(id):onHref(id)}></i>
        <div className="nav_name" onClick={()=>is_zoom?onZoom(id):onHref(id)}>{title}</div>
        {!is_zoom?<i title="Cerrar" className={is_id?`bx bx-x nav_link_close`:''} onClick={()=>onCurrent(null)}></i>:null}
      </div>
    );
  }

  return(
    <div className="snippet-body" id="body-pd">
      <header className="header" id="header">
          <div className="header_img"> <img src="https://lh3.googleusercontent.com/ogw/ADea4I67xIQeX_J_E6zDV36Y8jDeFMpg0-lvd2j8saGqTw=s83-c-mo" alt="" loading="lazy" /> </div>
          <div className="header_toggle"><i className="bx bx-menu" id="header-toggle" onClick={onExpand}></i> </div>
      </header>
      <div className="l-navbar" id="nav-bar">
          <nav className="nav">
              <div className="flex"> 
                <Title onClick={()=>onExpand()} />
                <div className="nav_list">
                  <NavLink id="thumbnails" icon="bx-grid" title="Miniaturas" />
                  <NavLink id="books" icon="bx-menu" title="Tabla de Contenidos" />
                  <NavLink id="annotator" icon="bx-book" title="Anotador" />
                  <NavLink id="content" icon="bx-search" title="Busqueda" />
                  <NavLink id="zoom-in" icon="bx-zoom-in" title="Ampliar" />
                  <NavLink id="zoom-out" icon="bx-zoom-out" title="Minimizar" />
                </div>
                <Switch current={current} book={book}  query={query}/>
              </div> 
          </nav>
      </div>
      <div id="main-content" className="height-100 bg-light" onClick={()=>onHide(true)}>
        <div className="books-content" ref={refScroll}>
          {books.map((item, key )=><img key={key} src={item.url} alt="" loading="lazy" width={zoom+"%"} />)}
        </div>
      </div>
    </div>
  )
}

const Switch = ({current, book, query}) =>{
  switch (current) {
    case 'content':   
      return <Content book={book} query={query}/>;
    case 'books':   
      return <Books query={query}/>;
    default:
      return null;
  }
}


/**
* NOT Hooks useCallback, asi da mas performance en memoria
*/
function getDatauseCallback(callback, location){

  let data = state.books;

  //replace url con datos actuales
  let _url = state.api_url
    .replace('{{book}}', state.book)
    .replace('{{page}}', location);
  
  if(data.indexOf(_url)===-1){
    //Temporal [] hasta definir el uso de scroll
    data = [];
    data.push({
      page:location,
      url:_url
    });
    state.books = data;
  }
  callback(new Date());
};