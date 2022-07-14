/**
* Create HTML Element Function
* @param {HTMLElementTagNameMap | String} tag -HTML Element Tag Name
* @param {HTMLAnchorElement} obj -Anchor
* @returns {HTMLElement} A HTML Element
*/

const createElement = async ( structure ) => {
  let root = document.createElement( structure.el );
  await appendObject( root, Object.assign({}, structure) );

  if( typeof structure === "object" && typeof structure['childs'] == "object" ){
    for( let child of structure.childs ){
      let el = await createElement( child );
      root.appendChild( el );
    }
  }
  return root;
}

const appendObject = async ( root, parame ) => {
  delete parame['el'];
  delete parame['childs'];
  for( let key in parame ){
    if( !(key in root) ){
      root[ key ] = new Object();
    }
    if( [ "string", "function" ].indexOf( typeof parame[key] ) > -1){
      root[key] = parame[key];
    }else{
      await appendObject( root[key], parame[key] );
    }   
  }
  return root;
}