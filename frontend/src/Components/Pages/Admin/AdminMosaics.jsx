import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { AuthContext } from '../../../Context/AuthContext';
import './AdminMosaics.css';

const AdminMosaics = () => {
    const { getAllMosaics, addMosaic, updateMosaic, deleteMosaic } = useContext(AuthContext);
    const [mosaics, setMosaics] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [editImageFile, setEditImageFile] = useState(null);

    const [newMosaic, setNewMosaic] = useState({
        name: '',
        description: '',
        size: '',
        price: ''
    });

    const [editModal, setEditModal] = useState(false);
    const [editingMosaic, setEditingMosaic] = useState(null);

    useEffect(() => {
        fetchMosaics();
    }, []);

    const fetchMosaics = async () => {
        const data = await getAllMosaics();
        if (Array.isArray(data)) {
            setMosaics(data);
        }else{
            console.error("getAllMosaics did not return an array:", data);
            setMosaics([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewMosaic(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("The file must be an image!");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("The image is too large! The maximum size is 5 MB.");
            e.target.value = "";
            return;
        }

        const img = new Image();
        img.onload = () => {
            if (img.width > 850 || img.height > 600) {
                alert("The image is too big.The maximum size is 850x600.");
                e.target.value = "";
            } else {
                setImageFile(file); // OK
            }
        };
        img.src = URL.createObjectURL(file);
    };

    const handleEditFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("The file must be an image!");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("The image is too large! The maximum size is 5 MB.");
            e.target.value = "";
            return;
        }

        const img = new Image();
        img.onload = () => {
            if (img.width > 850 || img.height > 600) {
                alert("The image is too big.The maximum size is 850x600.");
                e.target.value = "";
            } else {
                setEditImageFile(file);
            }
        };
        img.src = URL.createObjectURL(file);
    };

    const handleAdd = async () => {
        const { name, description, size, price } = newMosaic;
        if (!name || !description || !size || !price || !imageFile) {
            alert("All fields are required.");
            return;
        }
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('http://localhost:8080/upload', {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) {
            alert('Image transfer error.');
            return;
        }

        const imageUrl = await uploadRes.text();

        await addMosaic({ ...newMosaic, price: parseFloat(price), imageLink: imageUrl});
        setNewMosaic({ name: '', description: '', size: '', price: '' });
        setImageFile(null);
        setShowForm(false);
        fetchMosaics();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this mosaic?")) {
            await deleteMosaic(id);
            fetchMosaics();
        }
    };

    const openEditModal = (mosaic) => {
        setEditingMosaic({ ...mosaic });
        setEditImageFile(null);
        setEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingMosaic(prev => ({ ...prev, [name]: value }));
    };

    const saveEdit = async () => {
        const { id, name, description, size, price } = editingMosaic;
        if (!name || !description || !size || !price) {
            alert("All fields are required.");
            return;
        }

        let imageLink = editingMosaic.imageLink;
        if (editImageFile) {
            const formData = new FormData();
            formData.append('file', editImageFile);

            const uploadRes = await fetch('http://localhost:8080/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) {
                alert('Error uploading new image.');
                return;
            }

            imageLink = await uploadRes.text();
        }

        await updateMosaic({ id, name, description, size, price: parseFloat(price), imageLink });
        setEditModal(false);
        setEditImageFile(null);
        fetchMosaics();
    };

    return (
        <div className="admin-mosaics-container">
            <h2>Mosaic management</h2>
            <button onClick={() => setShowForm(!showForm)} className="toggle-form-button">
                {showForm ? 'Cancel' : 'Add a new mosaic'}
            </button>

            {showForm && (
                <div className="admin-form">
                    <input type="text" name="name" placeholder="Name" value={newMosaic.name} onChange={handleChange} />
                    <input type="text" name="description" placeholder="Description" value={newMosaic.description} onChange={handleChange} />
                    <select name="size" value={newMosaic.size} onChange={handleChange}>
                        <option value="">Select size</option>
                        <option value="40x40">40x40</option>
                        <option value="30x40">30x40</option>
                        <option value="20x30">20x30</option>
                    </select>
                    <input type="number" name="price" placeholder="Price" value={newMosaic.price} onChange={handleChange} />
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {imageFile && <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ maxWidth: 200, marginTop: 10 }} />}
                    <button onClick={handleAdd}>Add</button>
                </div>
            )}

            <div className="mosaic-grid admin">
                {mosaics.map((mosaic) => (
                    <div key={mosaic.id} className="mosaic-card">
                        <img src={mosaic.imageLink} alt={mosaic.name}/>
                        <h4>{mosaic.name}</h4>
                        <p>{mosaic.size}</p>
                        <p>{mosaic.price} PLN</p>
                        <p>{mosaic.description}</p>
                        <button onClick={() => openEditModal(mosaic)}>Edytuj</button>
                        <button onClick={() => handleDelete(mosaic.id)}>Usuń</button>
                    </div>
                ))}
            </div>

            <Modal show={editModal} onHide={() => setEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit mosaic</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingMosaic && (
                        <div className="admin-form">
                            <input type="text" name="name" value={editingMosaic.name} onChange={handleEditChange} />
                            <input type="text" name="description" value={editingMosaic.description} onChange={handleEditChange} />
                            <select name="size" value={editingMosaic.size} onChange={handleEditChange}>
                                <option value="40x40">40x40</option>
                                <option value="30x40">30x40</option>
                                <option value="20x30">20x30</option>
                            </select>
                            <input type="number" name="price" value={editingMosaic.price} onChange={handleEditChange} />
                            <input type="file" accept="image/*" onChange={handleEditFileChange} />
                            {editImageFile ? (
                                <img src={URL.createObjectURL(editImageFile)} alt="New preview" style={{ maxWidth: 200, marginTop: 10 }} />
                            ) : (
                                editingMosaic.imageLink && <img src={editingMosaic.imageLink} alt="Preview" style={{ maxWidth: 200, marginTop: 10 }} />
                            )}
                            <button onClick={saveEdit}>Save</button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AdminMosaics;
