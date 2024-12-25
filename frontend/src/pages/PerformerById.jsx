import React, {useEffect, useState} from 'react';
import Container from "../components/Container.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import sprite from "../assets/symbol-defs.svg";
import '../styles/pages/PerformerById.css';
import {toast} from "react-toastify";
import {IoIosAdd} from "react-icons/io";
import {FaRegTrashAlt} from "react-icons/fa";
import {FaPencil} from "react-icons/fa6";
import {isAdmin} from "../utils/isAdmin.js";
import {deletePerformer, getPerformerById} from "../api/performer.js";
import {addArtistToGroup, getAllGroups} from "../api/groups.js";

const PerformerById = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [performer, setPerformer] = useState([]);
    const [groups, setGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState('');

    const loadData = async () => {
        try {
            const performerData = await getPerformerById(id);
            setPerformer(performerData);
        } catch (error) {
            navigate('/performers')
            toast.error(error.message || "An error occurred during getting data.", {
                theme: "dark"
            });
        }
    };

    const fetchGroups = async () => {
        try {
            const groupsData = await getAllGroups();
            setGroups(groupsData);
        } catch (error) {
            toast.error("Failed to load groups.", {theme: "dark"});
        }
    }

    const handleAddToGroup = async (groupId) => {
        try {
            const response = await addArtistToGroup(groupId, {artist_id: performer?.artist_id, start_date: selectedDate});
            toast.success(response.message || "Artist successfully added to group!", {
                theme: "dark"
            });
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.message || "Error in adding artist to group!", {
                theme: "dark"
            });
        }
    };

    const handleDeletePerformer = async () => {
        try {
            const response = await deletePerformer(id);
            toast.success(response.message || "Artist successfully deleted!", {
                theme: "dark"
            });
            setIsModalDeleteOpen(false);
            navigate('/performers')
        } catch (error) {
            toast.error(error.message || "Error in deleting artist!", {
                theme: "dark"
            });
        }
    }

    useEffect(() => {
        loadData();
        fetchGroups();
    }, [id]);

    return (
        <Container>
            <div className='performerById-wrapper'>
                <Link to={'/performers'} className='performerById-link--back'>
                    <svg className="performerById-back--icon">
                        <use href={`${sprite}#arrow-left`}></use>
                    </svg>
                    Back
                </Link>

                <div className="performerById">
                    <div className="performerById-container">
                        <div className="performerById-card">
                            <img className="performerById-album-photo" src={performer?.photo} alt="performer"/>
                            <div className='performerById-album-info'>
                                <h2 className="performerById-title">{performer?.name}</h2>
                                <h2 className="performerById-album">{`${performer?.type?.split('')[0].toUpperCase()}${performer?.type?.slice(1)}`}</h2>
                                {performer?.country !== null &&
                                    (<p className="performerById-album">
                                        <strong>Country: </strong>{performer?.country}
                                    </p>)
                                }
                                {performer?.genre !== null &&
                                    (<p className="performerById-album">
                                        <strong>Genre: </strong>{performer?.genre}
                                    </p>)
                                }
                                {!performer?.year_created || (<p className="performerById-album">
                                    <strong>Year created: </strong>{performer?.year_created}
                                </p>)
                                }
                                {!performer?.birthday_date || (<p className="performerById-album">
                                    <strong>Birthday year: </strong>{performer?.birthday_date}
                                </p>)
                                }
                                {!performer?.career_started_date || (<p className="performerById-album">
                                    <strong>Career started at </strong>{performer?.career_started_date}
                                </p>)
                                }
                                {performer?.bio !== null &&
                                    (<p className="performerById-album">
                                        <strong>Bio: </strong>{performer?.bio}
                                    </p>)
                                }

                                {performer?.type === 'artist' && performer?.groups?.length > 0 && (
                                    <div className="performerById-album">
                                        <strong>Groups:</strong>
                                        <ul>
                                            {performer.groups.map(group => (
                                                <li key={group.performer_id} style={{marginTop: '10px'}}>
                                                    <Link className='performerById-link' to={`/performer/${group.performer_id}`}>{group.name}</Link> - Joined: {new Date(group.start_date).toLocaleDateString()} - Ended: {group.end_date ? new Date(group.end_date).toLocaleDateString() : 'Currently Active'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {performer?.type === 'group' && performer?.members?.length > 0 && (
                                    <div className="performerById-album">
                                        <strong>Members:</strong>
                                        <ul>
                                            {performer.members.map(member => (
                                                <li key={member.performer_id} style={{marginTop: '10px'}}>
                                                    <Link className='performerById-link' to={`/performer/${member.performer_id}`}>{member.name}</Link> - Joined: {new Date(member.start_date).toLocaleDateString()} - Ended: {member.end_date ? new Date(member.end_date).toLocaleDateString() : 'Currently Active'}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className='performerById-album-buttons'>
                                <div className="performerById-add-playlist">
                                    {
                                        performer?.type === 'artist' && isAdmin() === 'admin' && (
                                        <button className='performerById-album-button'
                                                onClick={() => setIsModalOpen(!isModalOpen)}>
                                            <IoIosAdd
                                                className={`performerById-album-button-icon ${isModalOpen && 'addIconPlaylist'}`}
                                                size={30}/>
                                        </button>)
                                    }

                                    {isModalOpen && (
                                        <div className={`performerById-overlay ${isModalOpen ? 'active' : ''}`}
                                             onClick={() => setIsModalOpen(false)}>
                                            <div className={`performerById-modal ${isModalOpen ? 'active' : ''}`}
                                                 onClick={(e) => e.stopPropagation()}>
                                                <form onSubmit={(e) => e.preventDefault()}>
                                                    <label>
                                                        Select Date:
                                                        <input
                                                            type="date"
                                                            value={selectedDate}
                                                            max={new Date().toISOString().split("T")[0]}
                                                            onChange={(e) => setSelectedDate(e.target.value)}
                                                        />
                                                    </label>
                                                    <label>
                                                        Select Group:
                                                        <select
                                                            value={selectedGroupId}
                                                            onChange={(e) => setSelectedGroupId(e.target.value)}
                                                        >
                                                            <option value="" disabled>Select a group</option>
                                                            {groups?.data?.map(group => (
                                                                <option key={group.group_id} value={group.group_id}>
                                                                    {group.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                    <button
                                                        type="button"
                                                        className="performerById-playlist-item"
                                                        onClick={() => handleAddToGroup(selectedGroupId)}
                                                        disabled={!selectedGroupId || !selectedDate}
                                                    >
                                                        Add to Group
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {isAdmin() === 'admin' && (
                                    <>
                                        <Link to={`/performer/edit-performer/${id}/${performer?.type}`}
                                              className='performerById-album-button'>
                                            <FaPencil className='performerById-album-button-icon' size={17}/>
                                        </Link>
                                        <div style={{position: 'relative'}}>
                                            <button className='performerById-album-button'
                                                    onClick={() => setIsModalDeleteOpen(!isModalDeleteOpen)}>
                                                <FaRegTrashAlt className='performerById-album-button-icon' size={17}/>
                                            </button>
                                            {isModalDeleteOpen && (
                                                <div className="performerById-playlist-delete--modal">
                                                    <p>Are you sure that you want to delete this performer?</p>

                                                    <div className="performerById-delete-buttons">
                                                        <button className='performerById-delete-button'
                                                                onClick={handleDeletePerformer}>Yes
                                                        </button>
                                                        <button className='performerById-delete-button'
                                                                onClick={() => setIsModalDeleteOpen(false)}>No
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default PerformerById;
