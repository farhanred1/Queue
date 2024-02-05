import { useEffect, useState } from "react";
import axios from 'axios';

const useFetch = (url, method = 'GET', payload = null, authenticated = true) => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiData, setApiData] = useState(null);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                let axiosConfig = {
                    method: method,
                    url: url,
                    data: payload,
                };

                if (authenticated) {
                    const token = localStorage.getItem('accessToken');
                    console.log("token", token)
                    if (token) {
                        axiosConfig.headers = {
                            Authorization: `Bearer ${token}`,
                        };
                    }
                }

                const resp = await axios(axiosConfig);
                const data = await resp?.data;

                setApiData(data);
                setIsLoading(false);
            } catch (error) {
                setServerError(error);
                setIsLoading(false);
            }
            
        };

        fetchData();
    }, [url, method, authenticated, payload]);

    return { isLoading, apiData, serverError };
};

export default useFetch;
