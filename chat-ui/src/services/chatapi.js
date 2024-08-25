// API endpoint to connect from frontend with Kafka
import Axios from "axios";

const api = Axios.create({
    baseURL: 'http://localhost:8080/api/',
});

const chatAPI = {
    getMessages: (groupId) => {
        console.log('Calling get messages from API');
        return api.get(`messages/${groupId}`);
    },
    sendMessage: (channel, username, text) => {
        let msg = {
            channel: channel,
            sender: username,
            content: text
        }
        // post new message/ send new message via API here: /api/send
        return api.post(`send`, msg);
    }
}


export default chatAPI;
