import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './List.css';
import { AuthContext } from '../../Context/AuthContext';

const ToolList = () => {
    const { tools } = useContext(AuthContext);
    const [filtered, setFiltered] = useState([]);
    const [sort, setSort] = useState('default');
    const navigate = useNavigate();

    useEffect(() => {
        let result = [...tools];

        if (sort === 'asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            result.sort((a, b) => b.price - a.price);
        }

        setFiltered(result);
    }, [tools, sort]);

    return (
        <div className="tool-list-container">
            <div className="list-filters">
                <select onChange={(e) => setSort(e.target.value)} value={sort}>
                    <option value="default">Sortuj</option>
                    <option value="asc">Cena: od najniższej</option>
                    <option value="desc">Cena: od najwyższej</option>
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
