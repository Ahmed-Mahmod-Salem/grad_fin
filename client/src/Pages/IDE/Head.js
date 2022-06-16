import React from "react";
import { Helmet } from "react-helmet";
const Head =() => {
	return (
		<div>
			<Helmet>
				<script
					src="https://cdn.socket.io/3.1.3/socket.io.min.js"
					integrity="sha384-cPwlPLvBTa3sKAgddT6krw0cJat7egBga3DJepJyrLl4Q9/5WLra3rrnMcyTyOnh"
					crossorigin="anonymous"
				></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/clike/clike.min.js"></script>
				<script
					src="https://code.jquery.com/jquery-3.6.0.min.js"
					integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4="
					crossorigin="anonymous"
				></script>
				<link
					rel="stylesheet"
					href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css"
				/>
				<link rel="stylesheet" href="/css/vscode-dark.css" />

			</Helmet>
		</div>
	);
};
export default Head;