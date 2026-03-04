import styles from './home.module.css'
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { BsSearch } from 'react-icons/bs'
import type { FormEvent } from 'react'

export interface CoinProps {
    id: string;
    rank: string;
    symbol: string;
    name: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    priceUsd: string;
    changePercent24Hr: string;
    vwap24Hr: string;
    explore: string;
    formatedPrice?: string;
    formatedMarket?: string;
    formatedVolume?: string;
}

interface DataProps {
    data: CoinProps[]
}

export function Home() {
    const [input, setInput] = useState("")
    const [coin, setCoin] = useState<CoinProps[]>([])
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {

        getData()

    }, [offset])

    async function getData() {
        try {
            fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=c869b83000ca3235ec6647c4767e0b8db81c68eb07e863d23db5b02b96904b0a`)
                .then(response => response.json())
                .then((data: DataProps) => {
                    const coinsData = data.data
                    console.log(coinsData)

                    const price = Intl.NumberFormat("en-us", {
                        style: "currency",
                        currency: "USD"
                    })

                    const priceCompact = Intl.NumberFormat("en-us", {
                        style: "currency",
                        currency: "USD",
                        notation: "compact"
                    })

                    const formatedResult = coinsData.map((item) => ({
                        ...item,
                        formatedPrice: price.format(Number(item.priceUsd)),
                        formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
                        formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
                    }))

                    const listCoins = [...coin, ...formatedResult]
                    setCoin(listCoins)
                })

        } catch (err) {
            console.log("erro")
        }
    }

    function handleInput(e: FormEvent) {
        e.preventDefault()
        if (input === "") {
            alert("Digite uma moeda")
            return
        } else {
            navigate(`detail/${input}`)
        }
    }

    function handleGetMore() {
        if (offset === 0) {
            setOffset(10)
            return
        }
        setOffset(offset + 10)
    }

    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleInput}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">
                    <BsSearch size={30} color='#FFF' />
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope='col'>Moeda</th>
                        <th scope='col'>Valor Mercado</th>
                        <th scope='col'>Preço</th>
                        <th scope='col'>Volume</th>
                        <th scope='col'>Mudança 24h</th>
                    </tr>
                </thead>
                <tbody id='tbody'>
                    {coin.length > 0 && coin.map((item) => (
                        <tr className={styles.tr} key={item.id}>
                        <td className={styles.tdLabel} data-label="Moeda">
                            <div className={styles.name}>
                                <img
                                className={styles.logo} 
                                src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} 
                                alt="logo" 
                                />
                                <Link to={`/detail/${item.id}`}>
                                    <span>{item.name}</span> | {item.symbol}
                                </Link>
                            </div>
                        </td>
                        <td className={styles.tdLabel} data-label="Valor mercado">
                            {item.formatedMarket}
                        </td>
                        <td className={styles.tdLabel} data-label="Preço">
                            {item.formatedPrice}
                        </td>
                        <td className={styles.tdLabel} data-label="Volume">
                            {item.formatedVolume}
                        </td>
                        <td className={styles.tdLabel} data-label="Mudança 24h">
                            <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>

            <button className={styles.buttonMore} onClick={handleGetMore}>
                Carregar mais
            </button>
        </main>
    )
}