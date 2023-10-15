import React from 'react';
import { NavLink } from "react-router-dom";
import './NavBar.css';

export default function NavBar()
{
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/"><strong>SimpleNotes</strong></NavLink>
                </li>
                <li>
                    <NavLink to="/create">Create</NavLink>
                </li>
            </ul>
        </nav>
        );
}