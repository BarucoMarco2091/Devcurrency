import styles from './detail.module.css'
import { useState, useEffect } from 'react'
import { data, useNavigate, useParams } from 'react-router'
import type { CoinProps } from '../Home'

interface ResponseData {
    data: CoinProps
}

interface ErrorData {
    error: string;
}

type DataProps = ResponseData | ErrorData

export function Detail() {
    const [coin, setCoin] = useState<CoinProps>()
    const { cripto } = useParams()
    const navigate = useNavigate()

    useEffect(() => {

        async function getData() {
            try {
                fetch(`https://rest.coincap.io/v3/assets/${cripto}?limit=10&offset=0&apiKey=c869b83000ca3235ec6647c4767e0b8db81c68eb07e863d23db5b02b96904b0a`)
                .then(response => response.json())
                .then((data) => data.data)
            } catch(erro) {
                navigate("/")
            }
        }

        getData()

    }, [])

    return(
        <div className={styles.container}>
            <h1>detalhes</h1>
        </div>
    )
}