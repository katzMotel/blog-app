'use client';
import React from 'react';
import {useState, useEffect} from 'react';
import {
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
    doc,
    getDoc,
} from 'firebase/firestore';
import {db, auth} from '@/lib/firebaseConfig';
import{
    FaImage,
    FaSmile,
    FaPoll,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaBold,
    FaItalic,
    FaUserCircle,
} from 'react-icons/fa';
import {fixIcon} from '@/utils/fixIcon';
import styles from './MainContent.module.scss';
//import BlogPost from '../BlogPost/BlogPost';
import {useAuth} from '@/context/AuthContext';

export default function  MainContent() {
    return(
        <div className={styles.MainContent}>
            <h2>Main Content Area</h2>
        </div>
    )
}

