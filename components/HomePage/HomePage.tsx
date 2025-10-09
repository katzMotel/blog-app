'use client';
import styles from './HomePage.module.scss';
import MainContent from '../MainContent/MainContent';
import Sidebar from '../Sidebar/Sidebar';

const HomePage = () => {
    return (
       <div className={styles.container}>
        <h1>Home Page</h1>
        
        <Sidebar /> 
       </div>
        
    );
}





export default HomePage;