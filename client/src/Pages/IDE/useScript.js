import { useEffect } from "react";

const useScript = (url, defer, async) => {
	useEffect(() => {
		const script = document.createElement("script");

		script.src = url;
		script.async = async;
        script.defer=defer;
        

		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);
};

export default useScript;
