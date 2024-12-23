// Auth
import {signupController} from './auth/signup.js';
import {loginController} from './auth/login.js';
import {verifyEmailController} from './auth/verifyEmail.js';
import {requestPasswordResetController} from './auth/requestPasswordReset.js';
import {resetPasswordController} from './auth/resetPassword.js';
import {getCurrentUserController} from "./auth/getCurrentUser.js";

// Performer
import {addPerformerController} from "./performer/addPerformer.js";
import {getPerformersController} from "./performer/getAllPerformers.js";
import {getPerformerByIdController} from "./performer/getPerformerById.js";
import {updatePerformerController} from "./performer/updatePerformer.js";
import {deletePerformerController} from "./performer/deletePerformer.js";

// Albums
import {addAlbumController} from "./albums/addAlbum.js";
import {getAllAlbumsController} from "./albums/getAllAlbums.js";
import {getAlbumByIdController} from "./albums/getAlbumById.js";
import {updateAlbumController} from "./albums/updateAlbum.js";
import {deleteAlbumController} from "./albums/deleteAlbum.js";

// Songs
import {addSongController} from "./songs/addSong.js";
import {getAllSongsController} from "./songs/getAllSongs.js";
import {getSongByIdController} from "./songs/getSongById.js";
import {updateSongController} from "./songs/updateSong.js";
import {deleteSongController} from "./songs/deleteSong.js";

// Playlists
import {createPlaylistController} from "./playlists/createPlaylist.js";
import {getUserPlaylistsController} from "./playlists/getUserPlaylists.js";
import {addSongToPlaylistController} from "./playlists/addSongToPlaylist.js";
import {removeSongFromPlaylistController} from "./playlists/removeSongFromPlaylist.js";
import {deletePlaylistController} from "./playlists/deletePlaylist.js";
import {getSongsInPlaylist} from "./playlists/getSongsInPlaylist.js";

// Groups
import {addArtistToGroupController} from "./groups/addArtistToGroup.js";
import {removeArtistFromGroupController} from "./groups/removeArtistFromGroup.js";
import {getAllGroupsController} from "./groups/getAllGroups.js";

// Statistics
import {getTopSongsController} from "./statistics/getTopSongs.js";
import {getPopularGenresController} from "./statistics/getPopularGenres.js";

export default {
    signupController,
    loginController,
    verifyEmailController,
    requestPasswordResetController,
    resetPasswordController,
    getCurrentUserController,

    addPerformerController,
    getPerformersController,
    getPerformerByIdController,
    updatePerformerController,
    deletePerformerController,

    addAlbumController,
    getAllAlbumsController,
    getAlbumByIdController,
    updateAlbumController,
    deleteAlbumController,

    addSongController,
    getAllSongsController,
    getSongByIdController,
    updateSongController,
    deleteSongController,

    createPlaylistController,
    getUserPlaylistsController,
    addSongToPlaylistController,
    removeSongFromPlaylistController,
    deletePlaylistController,
    getSongsInPlaylist,

    addArtistToGroupController,
    removeArtistFromGroupController,
    getAllGroupsController,

    getTopSongsController,
    getPopularGenresController,
}