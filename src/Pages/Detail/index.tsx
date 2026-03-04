import styles from './detail.module.css'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
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
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {

        async function getData() {
            try {
                fetch(`https://rest.coincap.io/v3/assets/${cripto}?limit=10&offset=0&apiKey=c869b83000ca3235ec6647c4767e0b8db81c68eb07e863d23db5b02b96904b0a`)
                    .then(response => response.json())
                    .then((data: DataProps) => {

                        if ("error" in data) {
                            navigate("/")
                            return
                        }

                        const price = Intl.NumberFormat("en-us", {
                            style: "currency",
                            currency: "USD"
                        })

                        const priceCompact = Intl.NumberFormat("en-us", {
                            style: "currency",
                            currency: "USD",
                            notation: "compact"
                        })

                        const formated = ({
                            ...data.data,
                            formatedPrice: price.format(Number(data.data.priceUsd)),
                            formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
                            formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr))
                        })

                        console.log(formated)
                        setCoin(formated)
                        setLoading(false)
                    })
            } catch (erro) {
                navigate("/")
            }
        }

        getData()

    }, [cripto])

    if (loading || !coin) {
        return (
            <div className={styles.container}>
                <h4 className={styles.center}>
                    Carregando...
                </h4>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.center}>{coin?.name}</h1>
            <h1 className={styles.center}>{coin?.symbol}</h1>
            <section className={styles.content}>
                <img src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} alt="logo"
                    className={styles.logo}
                />
                <h1>{coin?.name} | {coin?.symbol}</h1>
                <p><strong>Preço: </strong>{coin?.formatedPrice}</p>
                <a>
                    <strong>Mercado: </strong>{coin?.formatedMarket}
                </a>
                <a>
                    <strong>Volume: </strong>{coin?.formatedVolume}
                </a>
                <a>
                    <strong>Mudança 24h: </strong><span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss}>{Number(coin?.changePercent24Hr).toFixed(3)}</span>
                </a>
            </section>

        </div>
    )
}