export const HOST = import.meta.env.VITE_SERVER_URL;

// Authentication Routes  //

export const AUTH_ROUTES = "/api/auth";

export const SIGINUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/user-info`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/update-profile`;
export const ADD_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE = `${AUTH_ROUTES}/remove-profile-image`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

// Contacts Routes  //

export const CONTACTS_ROUTES = `/api/contacts`;

export const SEARCH_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/search`;
export const GET_DM_CONTACT_ROUTE = `${CONTACTS_ROUTES}/get-contacts-for-dm`;
export const GET_ALL_CONTACTS_ROUTE = `${CONTACTS_ROUTES}/get-all-contacts`;


// messages Route //

export const MESSAGES_ROUTE = `/api/messages`;

export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTE}/get-messages`;
export const FILE_UPLOAD_ROUTE = `${MESSAGES_ROUTE}/upload-files`;


// channels Route //

export const CHANNEL_ROUTE = `/api/channel`;

export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/create-channel`;
export const GET_USER_CHANNEL_ROUTE = `${CHANNEL_ROUTE}/get-user-channel`;
export const GET_CHANNEL_MESSAGES_ROUTE = `${CHANNEL_ROUTE}/get-channel-messages`;
