import { Route, Routes } from 'react-router-dom'
import RequireSession from './components/RequireSession'
import Assinaturas from './pages/Assinaturas'
import BakeryPage from './pages/BakeryDashboard'
import Cadastro from './pages/Cadastro'
import CustomerPage from './pages/CustomerView'
import Fornadas from './pages/Fornadas'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Mapa from './pages/Mapa'
import Operacao from './pages/Operacao'
import Reservas from './pages/Reservas'
import Sobre from './pages/Sobre'

const staffRoles = ['ESTABLISHMENT_ADMIN', 'ESTABLISHMENT_OPERATOR']

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cliente" element={<CustomerPage />} />
      <Route path="/padaria" element={<BakeryPage />} />
      <Route path="/sobre" element={<Sobre />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/mapa" element={<Mapa />} />
      <Route path="/fornadas" element={<Fornadas />} />
      <Route path="/reservas" element={<RequireSession roles={['CONSUMER']}><Reservas /></RequireSession>} />
      <Route path="/assinaturas" element={<RequireSession roles={['CONSUMER']}><Assinaturas /></RequireSession>} />
      <Route path="/operacao" element={<RequireSession roles={staffRoles}><Operacao /></RequireSession>} />
    </Routes>
  )
}
