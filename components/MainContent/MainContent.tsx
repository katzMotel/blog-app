'use client';
import React, { useState, useEffect } from 'react';
import styles from './MainContent.module.scss';
import{
    collection,
    addDoc,
    query,
    orderBy,
    getDocs,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebaseConfig';
import {
    FaImage,
    FaSmile,
    FaPoll,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaBold,
    FaItalic,
    FaUserCircle,
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function MainContent() {
    
}
