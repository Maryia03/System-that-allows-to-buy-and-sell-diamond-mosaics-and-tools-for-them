import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './List.css';
import { AuthContext } from '../../Context/AuthContext';

const MosaicList = () => {
    const { mosaics } = useContext(AuthContext);
    const [filtered, setFiltered] = useState([]);
    const [sort, setSort] = useState('default');
    const [searchTerm, setSearchTerm] = useState('');
    const [sizeFilter, setSizeFilter] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let result = [...mosaics];

        if (sizeFilter) {
            result = result.filter(m => m.size === sizeFilter);
        }

        if (searchTerm) {
            result = result.filter(m =>
                m.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sort === 'asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sort === 'desc') {
            result.sort((a, b) => b.price - a.price);
        }

        setFiltered(result);
    }, [mosaics, sort, sizeFilter, searchTerm]);

    return (
        <div className="mosaic-list-container">
            <div className="list-filters">
                <input
                    type="text"
                    placeholder="Search mosaic"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select onChange={(e) => setSort(e.target.value)} value={sort}>
                    <option value="default">Sort</option>
                    <option value="asc">Price: from lowest</option>
                    <option value="desc">Price: from highest</option>
                </select>

                <select onChange={(e) => setSizeFilter(e.target.value)} value={sizeFilter}>
                    <option value="">Size</option>
                    <option value="40x40">40x40</option>
                    <option value="30x40">30x40</option>
                    <option value="20x30">20x30</option>
                </select>
            </div>

            <div className="list-grid">
                {filtered.map((mosaic) => (
                    <div key={mosaic.id}
                         className="list-card"
                         onClick={() => navigate(`/mosaics/${mosaic.id}`, { state: { mosaic } })}
                    >
                        <img src={mosaic.imageLink} alt={mosaic.name} />
                        <h4>{mosaic.name}</h4>
                        <p>{mosaic.size}</p>
                        <p>{mosaic.price} PLN</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MosaicList;
