import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import "../styles/pages/PerformersCreate.css";
import {Link, useNavigate, useParams} from "react-router-dom";
import Container from "../components/Container.jsx";
import sprite from "../assets/symbol-defs.svg";
import {throttle} from "lodash";
import {getPerformerById, updatePerformer} from "../api/performer.js";

const PerformersEdit = () => {
    const {id, type} = useParams();
    const [formData, setFormData] = useState({
        name: null,
        type: null,
        genre: null,
        country: null,
        career_started_date: null,
        birthday_date: null,
        year_created: null,
        photo: null,
        bio: null,
        start_date: null,
        end_date: null,
    });
    const [groups, setGroups] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [selectedMember, setSelectedMember] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (type === "artist") {
                    const performerData = await getPerformerById(id);
                    setGroups(performerData.groups || []);
                }
                if (type === "group") {
                    const performerData = await getPerformerById(id);
                    setMembers(performerData.members || []);
                }
            } catch (error) {
                toast.error("Failed to fetch data", { theme: "dark" });
            }
        };

        fetchData();
    }, [id, type]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleGroupChange = (e) => {
        setSelectedGroup(e.target.value);
    };

    const handleMemberChange = (e) => {
        setSelectedMember(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({ ...prevData, photo: file }));
    };

    const submitForm = async (e) => {
        if (!type) {
            toast.error("Choose performer type!", { theme: "dark" });
            return;
        }

        if (!id) {
            toast.error("No performer id!", {
                theme: "dark",
            });
            return;
        }

        try {
            const formDataToSend = new FormData();

            const allFieldsEmpty = Object.values(formData).every((value) => value === null);

            if (allFieldsEmpty && !selectedMember) {
                toast.error("No changes detected.", { theme: "dark" });
                return;
            }

            if (selectedGroup) {
                formDataToSend.append("group_id", selectedGroup);
            }
            if (selectedMember) {
                formDataToSend.append("member_id", selectedMember);
            }
            if (selectedGroup && !formData.start_date && !formData.end_date) {
                toast.error( "Choose start and end dates of group career.", { theme: "dark" });
                return
            }

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    formDataToSend.append(key, value);
                }
            });

            const response = await updatePerformer(id, formDataToSend);
            toast.success(response.message || "You have successfully updated the performer!", { theme: "dark" });
            navigate("/performers");
        } catch (error) {
            toast.error(error.message || "An error occurred while updated the performer.", { theme: "dark" });
        }
    };

    const throttledSubmit = throttle(submitForm, 5000, { leading: true, trailing: false });

    const onSubmit = (e) => {
        e.preventDefault();
        throttledSubmit();
    };

    return (
        <Container>
            <div className='performersCreate-wrapper'>
                <Link to={'/performers'} className='performersCreate-link--back'>
                    <svg className="performersCreate-back--icon">
                        <use href={`${sprite}#arrow-left`}></use>
                    </svg>
                    Back</Link>

                <div className="performersCreate">
                    <div className="performersCreate-container">
                        <h2 className="performersCreate-title">Edit performer</h2>
                        <form id="performersForm" className="performersCreate-form" onSubmit={onSubmit}>
                            <div className="performersCreate-form--container">
                                <label className="performersCreate-form--label" htmlFor="type">
                                    Performer Type:
                                </label>
                                <select
                                    className="performersCreate-form--select"
                                    id="type"
                                    name="type"
                                    value={type}
                                    disabled
                                >
                                    <option value="" disabled>
                                        Select type
                                    </option>
                                    <option value="artist">Solo Artist</option>
                                    <option value="group">Group</option>
                                </select>
                            </div>

                            <div className="performersCreate-form--container">
                                <label className="performersCreate-form--label" htmlFor="name">
                                    Name:
                                </label>
                                <input
                                    className="performersCreate-form--input"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="performersCreate-form--container">
                                <label className="performersCreate-form--label" htmlFor="genre">
                                    Genre:
                                </label>
                                <input
                                    className="performersCreate-form--input"
                                    type="text"
                                    id="genre"
                                    name="genre"
                                    value={formData.genre}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="performersCreate-form--container">
                                <label className="performersCreate-form--label" htmlFor="country">
                                    Country:
                                </label>
                                <input
                                    className="performersCreate-form--input"
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="performersCreate-form--container">
                                <label className="performersCreate-form--label" htmlFor="bio">
                                    Biography:
                                </label>
                                <textarea
                                    className="performersCreate-form--textarea"
                                    id="bio"
                                    name="bio"
                                    rows="6"
                                    value={formData.bio}
                                    onChange={handleChange}
                                />
                            </div>

                            {type === "artist" && (
                                <>
                                    <div className="performersCreate-form--container">
                                        <label className="performersCreate-form--label" htmlFor="birthday_date">
                                            Birthday (Year):
                                        </label>
                                        <input
                                            className="performersCreate-form--input"
                                            type="number"
                                            id="birthday_date"
                                            name="birthday_date"
                                            value={formData.birthday_date}
                                            onChange={handleChange}
                                            min="1900"
                                            max={new Date().getFullYear()}
                                        />
                                    </div>

                                    <div className="performersCreate-form--container">
                                        <label className="performersCreate-form--label" htmlFor="career_started_date">
                                            Career Started (Year):
                                        </label>
                                        <input
                                            className="performersCreate-form--input"
                                            type="number"
                                            id="career_started_date"
                                            name="career_started_date"
                                            value={formData.career_started_date}
                                            onChange={handleChange}
                                            min="1900"
                                            max={new Date().getFullYear()}
                                        />
                                    </div>

                                    <div className="performersCreate-form--container">
                                        <label className="performersCreate-form--label" htmlFor="group">
                                            Group Participation:
                                        </label>
                                        <select
                                            className="performersCreate-form--select"
                                            id="group"
                                            name="group"
                                            value={selectedGroup}
                                            onChange={handleGroupChange}
                                        >
                                            <option value="" key='default' disabled>
                                                Select group
                                            </option>
                                            {groups.map((group) => (
                                                <option key={group.group_id} value={group.group_id}>
                                                    {group.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="performersCreate-form--container">
                                        <label className="performersCreate-form--label" htmlFor="start_date">
                                            Start Date:
                                        </label>
                                        <input
                                            className="performersCreate-form--input"
                                            type="date"
                                            id="start_date"
                                            name="start_date"
                                            value={formData.start_date}
                                            onChange={handleChange}
                                            disabled={!selectedGroup}
                                        />
                                    </div>

                                    <div className="performersCreate-form--container">
                                        <label className="performersCreate-form--label" htmlFor="end_date">
                                            End Date:
                                        </label>
                                        <input
                                            className="performersCreate-form--input"
                                            type="date"
                                            id="end_date"
                                            name="end_date"
                                            value={formData.end_date}
                                            onChange={handleChange}
                                            disabled={!selectedGroup}
                                        />
                                    </div>
                                </>
                            )}

                            {type === "group" && (
                                <>
                                    <div className="performersCreate-form--container">
                                        <label className="performersCreate-form--label" htmlFor="year_created">
                                            Year Created:
                                        </label>
                                        <input
                                            className="performersCreate-form--input"
                                            type="number"
                                            id="year_created"
                                            name="year_created"
                                            value={formData.year_created}
                                            onChange={handleChange}
                                            min="1900"
                                            max={new Date().getFullYear()}
                                        />
                                    </div>

                                    <div className="performersCreate-form--container">
                                        <label className="performersCreate-form--label" htmlFor="group">
                                            Delete from group participation:
                                        </label>
                                        <select
                                            className="performersCreate-form--select"
                                            id="group"
                                            name="group"
                                            value={selectedMember}
                                            onChange={handleMemberChange}
                                        >
                                            <option value="" key='default' disabled>
                                                Select member, which you want to delete
                                            </option>
                                            {members.map((member) => (
                                                <option key={member.artist_id} value={member.artist_id}>
                                                    {member.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            <div className="performersCreate-form--file-container">
                                <label className="performersCreate-form--label" htmlFor="photo">
                                    {formData.type === "group" ? "Group" : "Artist"} Photo:
                                </label>
                                <input
                                    className="performersCreate-form--file-button"
                                    type="file"
                                    id="photo"
                                    name="photo"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <button type="submit" className="performersCreate-form--button">
                                Update Performer
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </Container>
    );
};

export default PerformersEdit;
