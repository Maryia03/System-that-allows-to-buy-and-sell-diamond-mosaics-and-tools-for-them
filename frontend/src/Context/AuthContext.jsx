import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [mosaics, setMosaics] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);  // Stan dla aktualnego użytkownika
    const [errorMessage, setErrorMessage] = useState("");
    const [users, setUsers] = useState([]);  // Stan dla wszystkich użytkowników
    const [orders, setOrders] = useState([]); // Stan dla rezerwacji
    const [notifications, setNotifications] = useState([]);
    const [cart, setCart] = useState([]);
    const [tools, setTools] = useState([]);

    const config = {
        headers: { 'Authorization': `Bearer ${Cookies.get("user_key")}` }
    };

    //Retrieving data from localStorage on startup
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (storedUser) {
            setCurrentUser(storedUser);
        }

        //Retrieve users from localStorage
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = storedUsers.map(user => {
            if (!user.registeredAt) {
                user.registeredAt = new Date().toISOString();
            }
            return user;
        });

        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        if (storedUser) {
            // const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
            // const userReservations = storedReservations.filter(reservation => reservation.userId === storedUser.id);
            // setReservations(userReservations);

        }

        if(Cookies.get("admin") == '1'){
            setCurrentUser({role: 'admin'})
        }


        //Loading basket
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (storedCart && Array.isArray(storedCart)) {
            setCart(storedCart);
        }
        getAllMosaics();
        getAllTools();
    }, []);

    useEffect(() => {
        console.log('Cart changed:', cart);
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    //User login function
    const login = (user, password) => {
        var data = { email: user, password: password }
        // console.log("login: " + JSON.stringify(data))
        axios.post("http://localhost:8080/auth/login", data)
            .then((res) => {
                console.log((res));
                if (res.data == "invalid user data") {
                    alert(res.data);
                    return;
                }

                var thirtyMinutes = new Date(new Date().getTime() + 30 * 60 * 1000);
                Cookies.set("user_id", res.data.id, { expires: thirtyMinutes });
                Cookies.set("user_key", res.data.token, { expires: thirtyMinutes });

                if (res.data.admin === true) {
                    Cookies.set("admin", "1", { expires: thirtyMinutes });
                    setCurrentUser({ role: 'admin' });
                } else {
                    setCurrentUser(res.data);
                    localStorage.setItem('currentUser', JSON.stringify(res.data));
                }
                setErrorMessage('');
                window.location.reload();
            })
            .catch(function (error) {
                console.log(error);
                setErrorMessage("Nieprawidłowe dane logowania");
                return false;
            });

        // document.cookie = 'user_key=' + user + ";";
        // setCurrentUser(user);
        // localStorage.setItem('currentUser', JSON.stringify(user)); // Zapisz użytkownika w localStorage

        // // Ładowanie rezerwacji tylko dla zalogowanego użytkownika
        // const storedReservations = JSON.parse(localStorage.getItem('reservations')) || [];
        // const userReservations = storedReservations.filter(reservation => reservation.userId === user.id);
        // setReservations(userReservations);
    };

    const logout = () => {
        setOrders([]);
        setCart([]);
        setCurrentUser(null);

        Cookies.remove("user_key");
        Cookies.remove("user_id");
        Cookies.remove("admin");

        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
    }

        const register = (newUser) => {
        var data = {
            email: newUser.email,
            username: newUser.firstName + " " + newUser.lastName,
            password: newUser.password,
            address: newUser.address,
            phone: newUser.phoneNumber
        }

        console.log(data)
        axios.post("http://localhost:8080/auth/register", data)
            .then((res) => {
                console.log(res)
                login(data.email, data.password);
            }).catch((err) => {
                console.log(err)
            })



        // const isUserExist = users.some(user => user.email === newUser.email);
        // if (isUserExist) {
        //     alert("Użytkownik z tym emailem już istnieje.");
        //     return;
        // }

        // const updatedUsers = [...users, newUser];
        // setUsers(updatedUsers);
        // localStorage.setItem('users', JSON.stringify(updatedUsers));
        // login(newUser);
    };

    const addOrder = async (mosaicIds = [], toolIds = []) => {
        if (!Cookies.get("user_id") || !Cookies.get("user_key")) {
            alert("Musisz być zalogowany, aby złożyć zamówienie.");
            return;
        }

        const params = {
            userId: Cookies.get("user_id"),
        };

        if (mosaicIds.length > 0) {
            params.mosaicIds = mosaicIds;
        }

        if (toolIds.length > 0) {
            params.toolIds = toolIds;
        }

        try {
            const res = await axios.post("http://localhost:8080/order/addOrder", null, {
                params,
                headers: {
                    Authorization: `Bearer ${Cookies.get("user_key")}`,
                },
            });

            alert(res.data);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Błąd przy składaniu zamówienia");
            return null;
        }
    };

    const getOrders = async () => {
        try {
            const res = await axios.get("http://localhost:8080/order/allOrders", config);
            setOrders(res.data);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Błąd podczas pobierania wszystkich zamówień");
        }
    };

    const getAllUsers = async () =>{
        console.log("get all users");
        const config = {
            headers: { 'Authorization': `Bearer ${Cookies.get("user_key")}` }
        };
        return axios.get("http://localhost:8080/user/all",config)
        .then((res)=>{
            console.log(res.data);
            return res.data;
        })
        .catch((err)=>{
            console.log(err)
            alert(err)
        })

    }

    const updateUserRole = ()=>{
        console.log("update user role")
    }

    const toggleBlockUser = async (userId) => {
        console.log("toggle block user")
        return axios.get("http://localhost:8080/user/block/"+userId,config)
        .then((res)=>{
            console.log(res)
        })
        .catch((err)=>{
            console.log(err)
            alert(err)
        })
    }

    const deleteUser = (userId) =>{
        console.log("delete user")

        axios.delete(`http://localhost:8080/user/delete?id=${userId}`,config)
        .then((res)=>{
            console.log(res.data)
        }).catch((err)=>{
            alert(err)
            console.log(err)
        })
    }

    const addMosaic = async (mosaicData) => {
        try {
            const res = await axios.post("http://localhost:8080/mosaic/add", mosaicData, config);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Błąd przy dodawaniu mozaiki");
        }
    };

    const getAllMosaics = async () => {
        const response = await fetch("http://localhost:8080/mosaic/all");
        const data = await response.json();
        setMosaics(data);
        return data;
    };

    const refreshMosaics = () => getAllMosaics();

    const getMosaicById = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8080/mosaic/id/${id}`, config);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Mozaika nie znaleziona");
        }
    };

    const deleteMosaic = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8080/mosaic/delete/${id}`, config);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Błąd przy usuwaniu mozaiki");
        }
    };

    const updateMosaic = async (mosaicData) => {
        try {
            const res = await axios.patch(`http://localhost:8080/mosaic/update/${mosaicData.id}`, mosaicData, config);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Błąd przy aktualizacji mozaiki");
        }
    };

    const addTool = async (toolData) => {
        try {
            const res = await axios.post("http://localhost:8080/tool/add", toolData, config);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Błąd przy dodawaniu narzędzia");
        }
    };

    const getAllTools = async () => {
        try {
            const res = await axios.get("http://localhost:8080/tool/all", config);
            setTools(res.data);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Błąd przy pobieraniu narzędzi");
        }
    };

    const getToolById = async (id) => {
        try {
            const res = await axios.get(`http://localhost:8080/tool/id/${id}`, config);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Narzędzie nie znalezione");
        }
    };

    const deleteTool = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8080/tool/delete/${id}`, config);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Błąd przy usuwaniu narzędzia");
        }
    };

    const updateTool = async (toolData) => {
        try {
            const res = await axios.patch(`http://localhost:8080/tool/update/${toolData.id}`, toolData, config);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Błąd przy aktualizacji narzędzia");
        }
    };

    const addToCart = (item) => {
        setCart(prevCart => [...prevCart, item]);
    };

    const deleteFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const submitOrder = async () => {
        if (!currentUser || cart.length === 0) {
            alert("Musisz być zalogowany i mieć produkty w koszyku");
            return;
        }

        const mosaicIds = cart.filter(item => item.type !== 'tool').map(item => item.id);
        const toolIds = cart.filter(item => item.type === 'tool').map(item => item.id);
        try {
            const res = await axios.post(
                "http://localhost:8080/order/addOrder",
                null,
                {
                    params: {
                        userId: Cookies.get("user_id"),
                        mosaicIds: mosaicIds.length > 0 ? mosaicIds : null,
                        toolIds: toolIds.length > 0 ? toolIds : null
                    },
                    headers: { Authorization: `Bearer ${Cookies.get("user_key")}` }
                }
            );
            console.log(res.data);
            alert("Zamówienie złożone!");
            clearCart();
        } catch (err) {
            console.error(err);
            alert("Błąd podczas składania zamówienia");
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await axios.patch(
                `http://localhost:8080/order/updateStatus/${orderId}`,
                null,
                {
                    params: { newStatus },
                    headers: { Authorization: `Bearer ${Cookies.get("user_key")}` }
                }
            );
            alert(`Status zamówienia zmieniony na ${newStatus}`);
            return res.data;
        } catch (err) {
            console.error(err);
            alert("Nie udało się zmienić statusu zamówienia");
            return null;
        }
    };


    return (
        <AuthContext.Provider value={{
            users,
            orders,
            notifications,
            login,
            logout,
            register,
            getAllUsers,
            updateUserRole,
            toggleBlockUser,
            addOrder,
            getOrders,
            deleteUser,
            getMosaicById,
            getAllMosaics,
            addMosaic,
            refreshMosaics,
            mosaics,
            deleteMosaic,
            updateMosaic,
            getToolById,
            getAllTools,
            addTool,
            deleteTool,
            updateTool,
            tools,
            setTools,
            errorMessage,
            currentUser,
            cart,
            addToCart,
            deleteFromCart,
            clearCart,
            submitOrder,
            updateOrderStatus,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
