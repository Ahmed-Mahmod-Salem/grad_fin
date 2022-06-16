import React , {useEffect}from 'react'
import Head from "./Head.js";
import useScript from './useScript.js';



// var htmlContent = require('./index.html');
const IDE = () => {

useScript('https://cdn.socket.io/3.1.3/socket.io.min.js', false, false);
useScript(
	'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js',
	false,
	false
);
useScript(
	"https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/clike/clike.min.js",
	false,
	false
);

useScript("https://code.jquery.com/jquery-3.6.0.min.js", false, false);
useScript('/IDE/main.js', true, false);

    return (
		<div>
			<Head> </Head>
			<div className="editorArea">
				<button type="button" id="File1">
					File1
				</button>
				<button type="button" id="File2">
					File2
				</button>
				<textarea id="editor"></textarea>
				{/* <ScriptTag src='/main.js'
					type="text/javascript"
					hydrated
				></ScriptTag> */}
			</div>
		</div>
	);

}

export default IDE