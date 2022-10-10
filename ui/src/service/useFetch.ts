import { useState, useEffect } from "react"

export const useFetch = (url: string, method: string, body?: any) => {
    const [fetchedData, setFetchedData] = useState()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState(null)


    useEffect(() => {
        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : null
        })
        .then(response => response.json())
        .then((data) => {
            setFetchedData(data)
            setIsLoading(true)
        })
        .catch(error => setError(error))
    }, [])

    
    return {fetchedData, isLoading, error}
}