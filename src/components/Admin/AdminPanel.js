import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AuthenticationModal from './AuthenticationModal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

function AdminPanel() {

    const [userData, setUserData] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAuthenticationModalOpen, setAuthenticationModalOpen] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [url, setUrl] = useState("")
    const [username, setUsername] = useState('')
    const [role, setRole] = useState('')
    const [filteredData, setFilteredData] = useState([])
    const [message, setMessage] = useState("")

    useEffect(() => {
        const token = localStorage.getItem("jwtToken")
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        axios.get("getalldetails", config)
            .then(dt => {
                setLoading(false)
                setUserData(dt.data)
                setFilteredData(dt.data)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })

        if (authenticated) {
            axios.get(url, config)
                .then(dt => {
                    window.location.reload()
                })
                .catch(err => {
                })
        }
        setLoading(true)
        setAuthenticated(false)
    }, [authenticated])

    useEffect(() => {
        if (username === "" && role === "") {
            setFilteredData(userData)
        } else {
            if (role === "") {
                setFilteredData(userData.filter(user => user.username.toLowerCase().includes(username.toLowerCase())))
            } else {
                setFilteredData(userData.filter(user => user.role.toLowerCase().includes(role.toLowerCase())))
            }
        }
    }, [username, role])





    const handleDelete = (user) => {
        setAuthenticationModalOpen(true)
        setMessage(`Are you sure to delete ${user.username}`)
        setUrl(`/deleteuser?username=${user.username}`)
    }

    const handleAccess = (user) => {
        setAuthenticationModalOpen(true)
        setMessage(`Are you sure Want to change Access for ${user.username}`)
        setUrl(`/grantorrevokeaccess?username=${user.username}`)
    }

    const handleUsernameChange = ({ target }) => {
        setUsername(target.value)
        setRole("")
    }

    const handleRoleChange = ({ target }) => {
        setRole(target.value)
        setUsername("")
    }


    if (loading) {
        return (
            <div className='adminPanelLoading'><img src='images/loadingballs.gif' alt="" /></div>
        )
    }

    return (
        <div className='AdminPanelContainer'>
            <div className='logoutContainerAdminPanel'>
                <Link to="/logout" style={{ fontSize: "25px", fontWeight: "bold", padding: "20px" }}><LogoutIcon /> Logout</Link>
            </div>
            <AuthenticationModal isModalOpen={isAuthenticationModalOpen}
                setIsModalOpen={setAuthenticationModalOpen}
                setAuthenticated={setAuthenticated}
                message={message}
            />
            <div className='adminPanelInfoAndFilter'>
                <p className='otpTimerInfo'>Users : {userData.length}</p>
                <p className='otpTimerInfo'>Want to Filter <FilterAltOutlinedIcon />? You can Filter By username or their role</p>
                <div className='filterFormAdminPanel'>
                    <TextField placeholder="Enter Username" label="Username" value={username} onChange={handleUsernameChange}
                        style={{ marginRight: "20px" }}
                    />
                    <TextField placeholder="Enter Role" label="Role" value={role} onChange={handleRoleChange}
                        style={{ marginRight: "20px" }} />
                </div>
            </div>
            <TableContainer>
                <Table>
                    <TableHead style={{ backgroundColor: "#19232b" }}>
                        <TableRow>
                            <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Username</TableCell>
                            <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Role</TableCell>
                            <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Access</TableCell>
                            <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
                            <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Mobile</TableCell>
                            <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Account Created on</TableCell>
                            <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Access Action</TableCell>
                            <TableCell style={{ color: "#fff", fontWeight: "bold" }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredData.map((user, index) => {
                                return <TableRow key={index} style={index % 2 ? { background: "#fdffe0" } : { background: "white" }}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    {user.hasAccess === null ?
                                        <TableCell>-</TableCell>
                                        :
                                        user.hasAccess === true ?
                                            <TableCell>Yes</TableCell>
                                            : <TableCell>No</TableCell>}
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.mobile}</TableCell>
                                    <TableCell>{user.dateOfCreation}</TableCell>
                                    {user.hasAccess === null ?
                                        <TableCell>-</TableCell>
                                        :
                                        user.hasAccess === true ?
                                            <TableCell><Button style={{ backgroundColor: "red", color: "#fff" }} variant='contained'
                                                onClick={() => handleAccess(user)}
                                            >Remove Access</Button></TableCell>
                                            : <TableCell><Button color='primary' variant='contained'
                                                onClick={() => handleAccess(user)}
                                            >Grant Access</Button></TableCell>}

                                    {
                                        user.role === "ADMIN" ? null :
                                            <TableCell><DeleteForeverOutlinedIcon
                                                sx={{ fontSize: "25px" }}
                                                className='deleteButton'
                                                onClick={() => handleDelete(user)}
                                            /></TableCell>}
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default AdminPanel
