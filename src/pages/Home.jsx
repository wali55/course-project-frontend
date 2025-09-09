import { useNavigate } from 'react-router-dom'
import HomeLayout from '../components/HomeLayout';

const Home = () => {
    const navigate = useNavigate();
  return (
    <div>
        <HomeLayout />
    </div>
  )
}

export default Home