import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './List.css';
import { AuthContext } from '../../Context/AuthContext';

const ToolList = () => {
    const { tools } = useContext(AuthContext);
    const [filtered, setFiltered] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState('default');
    const navigate = useNavigate();

    useEffect(() => {
        let result = [...tools];

        if (searchTerm) {
            result = result.filter(t =>
                t.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sort === 'asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            result.sort((a, b) => b.price - a.price);
        }

        setFiltered(result);
    }, [tools, sort, searchTerm]);

    return (
        <div className="tool-list-container">
            <div className="list-filters">
                <input
                    type="text"
                    placeholder="Search for a tool"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select onChange={(e) => setSort(e.target.value)} value={sort}>
                    <option value="default">Sort</option>
                    <option value="asc">Price: from lowest</option>
                    <option value="desc">Price: from highest</option>
                </select>
            </div>

            <div className="list-grid">
                {filtered.map((tool) => (
                    <div
                        key={tool.id}
                        className="list-card"
                        onClick={() => navigate(`/tools/${tool.id}`, { state: { tool } })}
                    >
                        <img src={tool.imageLink} alt={tool.name} />
                        <h4>{tool.name}</h4>
                        <p>{tool.price} PLN</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ToolList;
