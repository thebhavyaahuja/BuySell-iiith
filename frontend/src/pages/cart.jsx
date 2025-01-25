import Header from "../Header.jsx";
import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext.jsx';
import { useContext } from 'react';

export default function CartPage() {
    return(
        <>
            <Header/>
            <h1 className="text-2xl text-blue-950 font-bold">My Cart</h1>
        </>
    )
}