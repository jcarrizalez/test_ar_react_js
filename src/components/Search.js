import React from "react";

const Search = ({value, onChance, children, paginate:{total, total_pages, page }}) =>
	<div className="search">
		<input type="text" name="" id=""  placeholder="Indique una busqueda" 
		defaultValue={value} onChange={onChance}/>
		<div id="search-paginate">
			<p><b>registros:</b> {total} </p>
			<p><b>pagina:</b> {total_pages?page:''} </p>
			<p><b>paginas:</b> {total_pages} </p>
		</div>
		{children}
    </div>;

export default Search;