import { createBrowserRouter } from 'react-router'
import { Home } from './Pages/Home'
import { Detail } from './Pages/Detail'
import { NotFound } from './Components/Erro'
import { Layout } from './Components/Layout'

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/detail/:cripto",
                element: <Detail />
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    }
])

export { router }